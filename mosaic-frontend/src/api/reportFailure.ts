import type { Failure, FailureReason } from '@typescript/types';

const SESSION_STORAGE_KEY = 'mosaicSessionId';

let sessionId: string | undefined;

// crypto.randomUUID only exists on secure origins
const createSessionId = (): string => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

// a random ID for this browser tab, so a failure can be tied to its upload.
// It identifies a visit, not a person, and goes when the tab closes.
export const getSessionId = (): string => {
  if (sessionId) return sessionId;
  try {
    sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY) ?? undefined;
  } catch (err) {
    // storage can be blocked; the ID then just lasts for this page load
  }
  sessionId = sessionId ?? createSessionId();
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch (err) {
    // see above
  }
  return sessionId;
};

// responses from nginx and the load balancer have no JSON body to read a reason from
export const failureReasonForStatus = (status: number): FailureReason => {
  if (status === 413) return 'too_large';
  if (status === 504) return 'timeout';
  return 'server_error';
};

// sendBeacon so the report still goes out if the user leaves straight away
export const reportFailure = (failure: Failure, assetID?: string): void => {
  if (failure.logged) return;
  const { stage, reason, status, detail } = failure;
  const body = JSON.stringify({ sessionId: getSessionId(), assetID, stage, reason, status, detail: detail?.slice(0, 300) });
  navigator.sendBeacon('/api/failure', new Blob([body], { type: 'application/json' }));
};
