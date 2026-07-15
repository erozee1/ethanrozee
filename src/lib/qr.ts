import QRCode from "qrcode";

export async function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    color: { dark: "#151515", light: "#FFFFFF" },
  });
}
