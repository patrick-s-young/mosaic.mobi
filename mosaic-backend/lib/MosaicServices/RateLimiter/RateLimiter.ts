import { NextFunction, Request, Response } from 'express';
import failureLog from '../FailureLogService/FailureLogService';

interface Window {
  count: number;
  resetAt: number;
  logged: boolean;
}

// beyond this many tracked addresses, expired windows are swept out
const SWEEP_AT_SIZE = 5000;

// Counts requests per IP address in fixed windows. Limits are generous, since
// people on mobile networks can share one address; they're there to stop one
// visitor or script filling the server's memory and disk, not to ration use.
// Kept in memory, so they reset when the server restarts.
export default class RateLimiter {
  private windows = new Map<string, Window>();

  // stage is where a rejection shows in the failure log; null for the failure
  // endpoint itself, whose rejections aren't logged
  constructor (
    private readonly stage: string | null,
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}

  public middleware () {
    return (req: Request, res: Response, next: NextFunction) => {
      const now = Date.now();
      const key = req.ip ?? 'unknown';
      let window = this.windows.get(key);
      if (!window || window.resetAt <= now) {
        if (this.windows.size >= SWEEP_AT_SIZE) this.sweep(now);
        window = { count: 0, resetAt: now + this.windowMs, logged: false };
        this.windows.set(key, window);
      }
      window.count++;
      if (window.count <= this.maxRequests) return next();

      res.setHeader('Retry-After', String(Math.ceil((window.resetAt - now) / 1000)));
      // logged once per window, so a flood can't fill the failure log either
      if (this.stage && !window.logged) {
        window.logged = true;
        return failureLog.respond(req, res, { stage: this.stage, reason: 'rate_limited', status: 429, detail: `over ${this.maxRequests} in ${this.windowMs / 60000} min` });
      }
      res.status(429).json({ error: true, stage: this.stage, reason: 'rate_limited', logged: true });
    };
  }

  private sweep (now: number) {
    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) this.windows.delete(key);
    }
  }
}
