import ReactGA from 'react-ga4';

// Google Analytics 4 measurement id for mosaic.mobi.
const MEASUREMENT_ID = 'G-J0W4FDF6FY';

// One GA4 event name (snake_case, GA4 convention) per meaningful user action.
// Keeping them centralized here means the whole funnel — open -> pick format ->
// pick layout -> pick background -> upload -> render -> save — reads cleanly in
// the GA dashboard and stays consistent across the app.
export const AnalyticsEvent = {
  APP_OPEN: 'app_open',
  VIEW_DESKTOP: 'view_desktop',
  VIEW_MOBILE: 'view_mobile',
  SELECT_ASPECT_RATIO: 'select_aspect_ratio',
  SELECT_TILE_COUNT: 'select_tile_count',
  SELECT_BACKGROUND_FRAME: 'select_background_frame',
  TOGGLE_CONTROLS: 'toggle_controls',
  UPLOAD_VIDEO: 'upload_video',
  UPLOAD_SUCCESS: 'upload_success',
  UPLOAD_REJECTED: 'upload_rejected',
  RENDER_VIDEO: 'render_video',
  RENDER_SUCCESS: 'render_success',
  RENDER_ERROR: 'render_error',
  SAVE_VIDEO: 'save_video',
  CANCEL: 'cancel'
} as const;

export type AnalyticsEventName = typeof AnalyticsEvent[keyof typeof AnalyticsEvent];
export type AnalyticsParams = Record<string, string | number | boolean>;

let initialized = false;

// Initialize GA once (idempotent). Safe to call from app start-up.
export const initAnalytics = (): void => {
  if (initialized) return;
  ReactGA.initialize(MEASUREMENT_ID);
  initialized = true;
};

// Send a GA4 event with optional custom parameters. Using the GA4 name+params
// signature (instead of the legacy category/action/label model) so each event
// carries the dimensions we actually care about — tile count, aspect ratio,
// render duration, file size, etc.
export const logEvent = (name: AnalyticsEventName, params: AnalyticsParams = {}): void => {
  ReactGA.event(name, params);
};
