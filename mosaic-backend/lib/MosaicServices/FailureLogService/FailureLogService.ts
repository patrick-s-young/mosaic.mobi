import { Request, Response } from 'express';
import env from '../../environment';
const fs = require('fs');

// where in the user's journey a failure happened, and why. The client reports
// these too, so anything outside the lists is rejected rather than stored.
// Keep in sync with the frontend FailureStage / FailureReason types.
const STAGES = ['validation', 'upload', 'processing', 'preload', 'render'];
const REASONS = [
  'too_long', 'too_short', 'too_large', 'unreadable_file',
  'no_file', 'network', 'timeout', 'server_error',
  'unreadable_video', 'ffmpeg_failed', 'ffmpeg_killed', 'missing_frames',
  'download_failed', 'asset_expired', 'invalid_request', 'cancelled',
  'busy', 'rate_limited'
];

const MAX_LOG_BYTES = 5 * 1024 * 1024;
const MAX_DETAIL_LENGTH = 300;
const MAX_USER_AGENT_LENGTH = 200;
const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;
const ASSET_ID_PATTERN = /^[A-Za-z0-9-]{1,64}$/;

interface FailureInput {
  stage: string;
  reason: string;
  status?: number;
  detail?: string;
}

interface FailureEntry extends FailureInput {
  at: string;
  source: 'server' | 'client';
  sessionId: string;
  assetID: string | null;
  userAgent: string;
}

// Failures are appended to one small file on the video volume, so they survive
// deploys and cover attempts that never produced an asset (for example, a file
// rejected for being too large). It lives outside the /uploads allow-list, is
// skipped by the archive sweep (not a directory) and rotates at MAX_LOG_BYTES.
class FailureLogService {
  private logPath (): string {
    return `${env.getVolumnPath()}/_failures.ndjson`;
  }

  // the browser's random per-tab session ID, sent as a header on API requests
  public sessionIdFrom (req: Request): string {
    return this.cleanSessionId(req.headers['x-session-id']);
  }

  public cleanSessionId (value: unknown): string {
    return typeof value === 'string' && SESSION_ID_PATTERN.test(value) ? value : 'unknown';
  }

  private userAgentFrom (req: Request): string {
    return String(req.headers['user-agent'] ?? '').slice(0, MAX_USER_AGENT_LENGTH);
  }

  private append (entry: FailureEntry) {
    // visible in `docker-compose logs backend` even if the file write fails
    console.log(`failure: ${JSON.stringify(entry)}`);
    try {
      if (fs.existsSync(this.logPath()) && fs.statSync(this.logPath()).size > MAX_LOG_BYTES) {
        fs.renameSync(this.logPath(), `${this.logPath()}.1`);
      }
      fs.appendFileSync(this.logPath(), `${JSON.stringify(entry)}\n`);
    } catch (err) {
      console.log(`FailureLogService.append err: ${err}`);
    }
  }

  // records a server-side failure and answers the request. `logged` tells the
  // client not to report the same failure a second time.
  public respond (req: Request, res: Response, failure: FailureInput & { status: number }) {
    const { stage, reason, status, detail } = failure;
    this.append({
      at: new Date().toISOString(),
      source: 'server',
      sessionId: this.sessionIdFrom(req),
      assetID: res.locals.assetID !== undefined ? String(res.locals.assetID) : null,
      userAgent: this.userAgentFrom(req),
      stage,
      reason,
      status,
      detail: detail?.slice(-MAX_DETAIL_LENGTH)
    });
    if (!res.headersSent) res.status(status).json({ error: true, stage, reason, logged: true });
  }

  // POST /api/failure, sent with navigator.sendBeacon for failures only the
  // browser can see (lost connection, unreadable file, preview download failed)
  public reportFromClient (req: Request, res: Response) {
    let body: any;
    try {
      body = JSON.parse(String(req.body));
    } catch (err) {
      return res.status(400).json({ error: true });
    }
    if (!body || !STAGES.includes(body.stage) || !REASONS.includes(body.reason)) {
      return res.status(400).json({ error: true });
    }
    this.append({
      at: new Date().toISOString(),
      source: 'client',
      sessionId: this.cleanSessionId(body.sessionId),
      assetID: typeof body.assetID === 'string' && ASSET_ID_PATTERN.test(body.assetID) ? body.assetID : null,
      userAgent: this.userAgentFrom(req),
      stage: body.stage,
      reason: body.reason,
      status: Number.isInteger(body.status) ? body.status : undefined,
      detail: typeof body.detail === 'string' ? body.detail.slice(0, MAX_DETAIL_LENGTH) : undefined
    });
    res.status(204).end();
  }

  // newest first, for the admin report
  public recent (limit: number = 200): FailureEntry[] {
    try {
      const lines: string[] = fs.readFileSync(this.logPath(), 'utf8').trim().split('\n');
      return lines.slice(-limit).reverse().map((line) => JSON.parse(line));
    } catch (err) {
      return [];
    }
  }
}

export default new FailureLogService();
