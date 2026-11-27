import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { svgToCanvas } from "./qrSvg";

// html5-qrcode needs an element to draw into, even when reading files.
const ID = "qr-read-test";
let reader = null;
let queue = Promise.resolve();

const getReader = () => {
  let el = document.getElementById(ID);
  if (!el) {
    el = document.createElement("div");
    el.id = ID;
    el.hidden = true;
    document.body.appendChild(el);
  }
  reader ??= new Html5Qrcode(ID, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false });
  return { reader, el };
};

/** Decoded text of the QR Code in an image file; rejects when none is found. */
export const readQrFile = (file) => {
  // One reader, one scan at a time: it reuses its hidden canvas.
  const run = queue.then(async () => {
    const { reader: r, el } = getReader();
    try {
      return await r.scanFile(file, false);
    } finally {
      el.replaceChildren();
    }
  });
  queue = run.catch(() => {});
  return run;
};

/** Reads back a rendered QR SVG, the way a phone would read the exported PNG. */
export const readQrSvg = async (svg) => {
  const canvas = await svgToCanvas(svg, 1);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return readQrFile(new File([blob], "qr.png", { type: "image/png" }));
};
