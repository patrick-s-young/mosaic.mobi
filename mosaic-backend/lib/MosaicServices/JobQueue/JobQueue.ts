import os from 'os';
import { Response } from 'express';

// Several ffmpeg jobs at once are what ran the server out of memory. With
// threads capped, a 9-tile render peaked at 0.8 GB and an upload's processing
// at 0.3 GB in testing; the budget per job leaves room for larger phone videos.
// Jobs beyond the limit wait their turn, for a bounded time: the wait counts
// towards the 60-second limit the load balancer and nginx put on a request.
const GB = 1024 * 1024 * 1024;
const MEMORY_PER_JOB = 1.25 * GB;
const MEMORY_RESERVED = 0.75 * GB;
const MAX_AUTO_JOBS = 4;

// a whole number from the environment, or undefined when unset or below min
const envNumber = (name: string, min = 1): number | undefined => {
  const raw = process.env[name];
  const value = Math.floor(Number(raw));
  return raw !== undefined && raw !== '' && Number.isFinite(value) && value >= min ? value : undefined;
};

// threads for each ffmpeg encode and filter graph. Two cut a render's peak
// memory from 1.4 GB to 0.8 GB and were no slower than ffmpeg's default.
export const FFMPEG_THREADS = envNumber('FFMPEG_THREADS') ?? 2;

// from the machine's memory and cores, unless FFMPEG_MAX_JOBS sets it
const autoMaxJobs = (): number => {
  const byMemory = Math.floor((os.totalmem() - MEMORY_RESERVED) / MEMORY_PER_JOB);
  const byCores = Math.floor(os.cpus().length / FFMPEG_THREADS);
  return Math.max(1, Math.min(byMemory, byCores, MAX_AUTO_JOBS));
};

// true once the visitor has gone, such as a cancelled export or upload. The
// socket is what tells: the request itself counts as destroyed as soon as its
// body has been read.
export const isClosed = (res: Response): boolean =>
  !res.writableEnded && (!res.socket || res.socket.destroyed);

// releases a job's slot; safe to call more than once
export type Release = () => void;

// why a job didn't get a slot: the queue was full, the wait ran out, or the
// request closed while waiting
export type Refusal = 'full' | 'timeout' | 'gone';

interface Waiter {
  grant: (release: Release) => void;
  timer: NodeJS.Timeout;
}

export class JobQueue {
  private running = 0;
  private waiting: Waiter[] = [];

  constructor (
    public readonly maxRunning: number,
    public readonly maxWaiting: number,
    public readonly maxWaitMs: number
  ) {}

  // Resolves with a release function once the job may start, or with why it
  // can't. A request that closes while waiting gives up its place.
  public acquire (res: Response): Promise<Release | Refusal> {
    if (isClosed(res)) return Promise.resolve('gone');
    if (this.running < this.maxRunning && this.waiting.length === 0) {
      return Promise.resolve(this.start());
    }
    if (this.waiting.length >= this.maxWaiting) return Promise.resolve('full');

    return new Promise((resolve) => {
      const leave = (refusal: Refusal) => {
        clearTimeout(waiter.timer);
        res.off('close', onClose);
        this.waiting = this.waiting.filter((other) => other !== waiter);
        resolve(refusal);
      };
      const onClose = () => leave('gone');
      const waiter: Waiter = {
        grant: (release) => {
          clearTimeout(waiter.timer);
          res.off('close', onClose);
          resolve(release);
        },
        timer: setTimeout(() => leave('timeout'), this.maxWaitMs)
      };
      res.once('close', onClose);
      this.waiting.push(waiter);
    });
  }

  public get waitingCount (): number {
    return this.waiting.length;
  }

  public get runningCount (): number {
    return this.running;
  }

  private start (): Release {
    this.running++;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.running--;
      const next = this.waiting.shift();
      if (next) next.grant(this.start());
    };
  }
}

// one queue for all heavy ffmpeg work, since uploads and renders share memory
const ffmpegJobs = new JobQueue(
  envNumber('FFMPEG_MAX_JOBS') ?? autoMaxJobs(),
  envNumber('FFMPEG_MAX_WAITING', 0) ?? 8,
  envNumber('FFMPEG_MAX_WAIT_MS') ?? 25000
);
console.log(`ffmpeg jobs: ${ffmpegJobs.maxRunning} at once, ${FFMPEG_THREADS} threads each, up to ${ffmpegJobs.maxWaiting} waiting for ${ffmpegJobs.maxWaitMs / 1000}s (${(os.totalmem() / GB).toFixed(1)} GB, ${os.cpus().length} cores)`);

export default ffmpegJobs;
