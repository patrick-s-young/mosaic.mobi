// rows x cols each tile count is arranged into (matches the backend TILE_GRID)
const TILE_GRID: { [key: number]: { rows: number; cols: number } } = {
  2: { rows: 1, cols: 2 },
  3: { rows: 1, cols: 3 },
  4: { rows: 2, cols: 2 },
  6: { rows: 2, cols: 3 },
  9: { rows: 3, cols: 3 }
};

// white separator thickness as a fraction of the canvas width. MUST match the
// backend GRID_LINE_RATIO (createGridFilter) so the preview and the rendered
// output look identical.
export const GRID_LINE_RATIO = 0.01;

// draws the white interior separator lines between tiles (a tic-tac-toe style
// grid for 9 tiles). Interior lines only — no outer border. Called after the
// tiles are drawn each frame so the grid always sits on top of them and the
// background image.
export function drawGridLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  numTiles: number
): void {
  const grid = TILE_GRID[numTiles];
  if (!grid) return;
  const lineWidth = Math.max(2, Math.round(width * GRID_LINE_RATIO));
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffff';
  for (let col = 1; col < grid.cols; col++) {
    const x = Math.round((col * width) / grid.cols - lineWidth / 2);
    ctx.fillRect(x, 0, lineWidth, height);
  }
  for (let row = 1; row < grid.rows; row++) {
    const y = Math.round((row * height) / grid.rows - lineWidth / 2);
    ctx.fillRect(0, y, width, lineWidth);
  }
  ctx.restore();
}
