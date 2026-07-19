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
const CROSSFADE = 0.5;
const ADVANCE = 1.0;

// filter_complex for a standalone pass that turns `frameCount` looped image
// inputs ([0:v] .. [frameCount-1:v]) into a single crossfading [out] stream.
// The inputs must all share the output canvas size (they do: imgNNN.jpg is
// 1080x1080 and imgNNN_9x16.jpg is 1080x1920). Assumes frameCount >= 2.
export default function createCarouselFilter (frameCount: number): string {
  const d = CROSSFADE.toFixed(2);
  const statements: string[] = [`[0:v] fps=25, format=yuva420p, setsar=1 [base]`];

  // input i (0-based) is frame i+1; its crossfade-in begins CROSSFADE seconds
  // before its solo slot starts at i*ADVANCE.
  for (let i = 1; i < frameCount; i++) {
    const start = (i * ADVANCE - CROSSFADE).toFixed(2);
    statements.push(`[${i}:v] fps=25, format=yuva420p, setsar=1, fade=t=in:st=${start}:d=${d}:alpha=1 [f${i}]`);
  }

  let prev = '[base]';
  for (let i = 1; i < frameCount; i++) {
    const outLabel = i === frameCount - 1 ? '[out]' : `[o${i}]`;
    statements.push(`${prev}[f${i}] overlay ${outLabel}`);
    prev = `[o${i}]`;
  }

  // joined with ';' and no trailing separator — a trailing ';' makes ffmpeg
  // parse an empty final segment ("No such filter: ''").
  return statements.join(';\n');
}
