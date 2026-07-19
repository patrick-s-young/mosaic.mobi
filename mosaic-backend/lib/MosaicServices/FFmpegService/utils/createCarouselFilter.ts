// Builds a crossfade chain that dissolves through the desaturated background
// frames. Mirrors the on-device carousel preview (HOLD_MS + CROSSFADE_MS in the
// frontend Scrubber.tsx): each frame is shown solo for (ADVANCE - CROSSFADE)
// seconds, then dissolves into the next over CROSSFADE seconds, so one frame
// occupies ADVANCE seconds on screen.
//
// The bundled ffmpeg (2018 static build) predates the `xfade` filter, so the
// dissolve is done the old way: frame 1 is an opaque base and every later frame
// is stacked on top with `overlay`, its alpha ramped 0->1 by a `fade=in` at its
// crossfade slot. Once opaque a layer fully covers the frame below it, and
// before its ramp it is transparent — the ramp window is the crossfade.
//
// Compositing runs at HALF resolution and the [out] stream stays half-size: with
// 15 simultaneous 1080p (or 1080x1920) layers a full-res graph peaks around 1GB
// of RSS and gets OOM-killed on a small instance. The main render scales this
// background back up to the canvas when it composites the tiles (a no-op for the
// full-res still path), so the build never touches full resolution. The
// background is desaturated and sits behind the mosaic tiles, so the upscale
// softness is invisible while memory drops ~4x.
const CROSSFADE = 0.5;
const ADVANCE = 1.0;

// half of the output canvas, kept even for yuv420p. Exported so the main render
// (createFfmpegFilterComplexStr) upscales the carousel background from exactly
// the same working size the build produced.
export function carouselWorkSize (outWidth: number, outHeight: number): { workW: number; workH: number } {
  return { workW: 2 * Math.round(outWidth / 4), workH: 2 * Math.round(outHeight / 4) };
}

// filter_complex for a standalone pass that turns `frameCount` looped image
// inputs ([0:v] .. [frameCount-1:v]) into a single crossfading [out] stream of
// `duration` seconds at HALF of `outWidth`x`outHeight`. The inputs must all
// share the output canvas size (imgNNN.jpg is 1080x1080, imgNNN_9x16.jpg is
// 1080x1920). Assumes frameCount >= 2.
export default function createCarouselFilter (frameCount: number, duration: number, outWidth: number, outHeight: number): string {
  const d = CROSSFADE.toFixed(2);
  const { workW, workH } = carouselWorkSize(outWidth, outHeight);
  const prep = `scale=${workW}:${workH}, fps=25, format=yuva420p, setsar=1`;

  const statements: string[] = [`[0:v] ${prep} [base]`];

  // input i (0-based) is frame i+1; its crossfade-in begins CROSSFADE seconds
  // before its solo slot starts at i*ADVANCE.
  for (let i = 1; i < frameCount; i++) {
    const start = (i * ADVANCE - CROSSFADE).toFixed(2);
    statements.push(`[${i}:v] ${prep}, fade=t=in:st=${start}:d=${d}:alpha=1 [f${i}]`);
  }

  // Each layer only needs to be composited from when it starts fading in until
  // the next frame has fully covered it (one ADVANCE later); the last frame
  // stays to the end. Gating overlay with `enable` skips compositing outside
  // that ~1.5s window.
  let prev = '[base]';
  for (let i = 1; i < frameCount; i++) {
    const winStart = (i * ADVANCE - CROSSFADE).toFixed(2);
    const winEnd = (i === frameCount - 1 ? duration : (i + 1) * ADVANCE).toFixed(2);
    const outLabel = i === frameCount - 1 ? '[out]' : `[o${i}]`;
    statements.push(`${prev}[f${i}] overlay=enable='between(t,${winStart},${winEnd})' ${outLabel}`);
    prev = `[o${i}]`;
  }

  // joined with ';' and no trailing separator — a trailing ';' makes ffmpeg
  // parse an empty final segment ("No such filter: ''").
  return statements.join(';\n');
}
