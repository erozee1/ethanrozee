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

// Hand-rolled SVG renderer (the qrcode package only draws square pixels)
// so modules can get rounded corners while staying a real vector file —
// good for printing at any size or dropping straight into Canva.
export function qrRoundedSvg(url: string, size = 320): string {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const modules = qr.modules;
  const count = modules.size;
  const margin = 2; // quiet-zone modules, matches qrPngDataUrl
  const cell = size / (count + margin * 2);
  const radius = cell * 0.35;

  let rects = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules.get(row, col)) {
        const x = ((col + margin) * cell).toFixed(2);
        const y = ((row + margin) * cell).toFixed(2);
        rects += `<rect x="${x}" y="${y}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" rx="${radius.toFixed(2)}" ry="${radius.toFixed(2)}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${LIGHT}"/><g fill="${DARK}">${rects}</g></svg>`;
}

export function qrRoundedSvgDataUrl(url: string, size = 320): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(qrRoundedSvg(url, size))}`;
}
