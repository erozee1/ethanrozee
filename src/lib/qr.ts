import QRCode from "qrcode";

export async function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 2,
    width: 320,
    errorCorrectionLevel: "M",
    color: { dark: "#151515", light: "#FFFFFF" },
  });
}
