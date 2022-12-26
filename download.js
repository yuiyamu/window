function download(uri, filename) {
  const element = document.createElement("a");
  element.setAttribute("href", uri);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function downloadSVG(code, filename) {
  download("data:image/svg+xml;charset=utf-8," + encodeURIComponent(code), filename);
}

function downloadPNG(code, filename, width, height) {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);

    download(canvas.toDataURL(), filename);
  };
  image.src = URL.createObjectURL(new Blob([code], {type: "image/svg+xml;charset=utf-8"}));
}
