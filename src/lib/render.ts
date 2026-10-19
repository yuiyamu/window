//most of this is generated not by my mind but by Sonnet 5.5. ai is ethical if its webdev i HATE WEBDEV
import { fontData } from "$lib/embedData";

export async function svgToPngBlob(svgEl, scale: number) {
  // size from the svg itself, not getBoundingClientRect (avoids css transform weirdness)
  const vb = svgEl.viewBox.baseVal;
  const width = vb?.width || svgEl.width.baseVal.value;
  const height = vb?.height || svgEl.height.baseVal.value;

  const clone = svgEl.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
      @font-face {
        font-family: "Tahoma";
        src: url("${fontData}") format("woff2");
      }
    `;
  clone.insertBefore(style, clone.firstChild);

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const canvas = new OffscreenCanvas(
      Math.round(width * scale),
      Math.round(height * scale)
    );
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false; // keeps that crunchy win2000 look at integer scales
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return await canvas.convertToBlob({ type: "image/png" });
  } finally {
    URL.revokeObjectURL(url);
  }
}