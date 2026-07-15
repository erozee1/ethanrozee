import QRCode from "qrcode";

const DARK = "#151515";
const LIGHT = "#FFFFFF";

export async function qrPngDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 2,
    width: 320,
    errorCorrectionLevel: "M",
    color: { dark: DARK, light: LIGHT },
  });
}

function roundedRect(x: number, y: number, size: number, radius: number, fill: string): string {
  return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${radius.toFixed(2)}" ry="${radius.toFixed(2)}" fill="${fill}"/>`;
}

// One finder-pattern "eye": three concentric rounded squares (7/5/3 modules,
// dark/light/dark) matching the QR spec's finder pattern exactly, so the
// 1:1:3:1:1 ratio scanners detect along the center scanline is untouched —
// only the corners get styled, never the proportions.
function finderEye(colStart: number, rowStart: number, cell: number, margin: number): string {
  const ox = (colStart + margin) * cell;
  const oy = (rowStart + margin) * cell;
  return (
    roundedRect(ox, oy, 7 * cell, 7 * cell * 0.32, DARK) +
    roundedRect(ox + cell, oy + cell, 5 * cell, 5 * cell * 0.32, LIGHT) +
    roundedRect(ox + 2 * cell, oy + 2 * cell, 3 * cell, 3 * cell * 0.32, DARK)
  );
}

// A single data module as a path rounded only on corners that aren't
// touching another dark module. Isolated modules become full circles;
// runs of adjacent modules keep their shared edges square so they merge
// into seamless capsule/blob shapes instead of a pixel grid.
function modulePath(x: number, y: number, s: number, up: boolean, down: boolean, left: boolean, right: boolean): string {
  const r = s / 2;
  const tl = !up && !left ? r : 0;
  const tr = !up && !right ? r : 0;
  const br = !down && !right ? r : 0;
  const bl = !down && !left ? r : 0;

  const f = (n: number) => n.toFixed(2);
  const parts: string[] = [`M${f(x + tl)},${f(y)}`, `L${f(x + s - tr)},${f(y)}`];
  if (tr > 0) parts.push(`A${f(tr)},${f(tr)} 0 0 1 ${f(x + s)},${f(y + tr)}`);
  parts.push(`L${f(x + s)},${f(y + s - br)}`);
  if (br > 0) parts.push(`A${f(br)},${f(br)} 0 0 1 ${f(x + s - br)},${f(y + s)}`);
  parts.push(`L${f(x + bl)},${f(y + s)}`);
  if (bl > 0) parts.push(`A${f(bl)},${f(bl)} 0 0 1 ${f(x)},${f(y + s - bl)}`);
  parts.push(`L${f(x)},${f(y + tl)}`);
  if (tl > 0) parts.push(`A${f(tl)},${f(tl)} 0 0 1 ${f(x + tl)},${f(y)}`);
  parts.push("Z");
  return `<path d="${parts.join(" ")}"/>`;
}

// Hand-rolled SVG renderer (the qrcode package only draws square pixels)
// so the code can use the "connected rounded" style — rounded eyes, dots
// and blobs instead of a grid — while staying a real vector file, good
// for printing at any size or dropping straight into Canva.
export function qrRoundedSvg(url: string, size = 320): string {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const modules = qr.modules;
  const count = modules.size;
  const margin = 2; // quiet-zone modules, matches qrPngDataUrl
  const cell = size / (count + margin * 2);

  const isDark = (row: number, col: number) =>
    row >= 0 && row < count && col >= 0 && col < count && modules.get(row, col) === 1;

  const inFinderZone = (row: number, col: number) =>
    (row < 7 && col < 7) || (row < 7 && col >= count - 7) || (row >= count - 7 && col < 7);

  const eyes = finderEye(0, 0, cell, margin) + finderEye(count - 7, 0, cell, margin) + finderEye(0, count - 7, cell, margin);

  let body = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!isDark(row, col) || inFinderZone(row, col)) continue;
      const x = (col + margin) * cell;
      const y = (row + margin) * cell;
      body += modulePath(x, y, cell, isDark(row - 1, col), isDark(row + 1, col), isDark(row, col - 1), isDark(row, col + 1));
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${LIGHT}"/>${eyes}<g fill="${DARK}">${body}</g></svg>`;
}

export function qrRoundedSvgDataUrl(url: string, size = 320): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(qrRoundedSvg(url, size))}`;
}
