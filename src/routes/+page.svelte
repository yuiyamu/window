<script lang="ts">
  type Frame = {
    width: number;
    height: number;
    x: number;
    y: number;
  }

  type Rect = {
    width: number;
    height: number;
  }

  type Titlebar = {
    width: number;
    height: number;
    button: Rect;
    controlBox: Rect;
    gradient: Rect;
  }

  //will determine this later with the image you drag in :p
  let bgFilename = $state("");

  let targetWidth = $state(800);
  let targetHeight = $state(400);
  let isActive = $state(true); //should be able to change this via web tick tick
  let showScrollbar = $state(false);
  let showResize = $state(false);
  let showStatus = $state(false);

  let scale = $state(2);
  const padding = 2;
  const frameSize = 2;
  let width = $derived(targetWidth / scale);
  let height = $derived(targetHeight / scale);
  let windowFrame: Frame = $derived({width, height, x: 0, y: 0});

  let windowContents: Frame = $derived({
    width: windowFrame.width - frameSize * 2 - padding * 2,
    height: windowFrame.height - frameSize * 2 - padding * 2,
    x: frameSize + padding,
    y: frameSize + padding
  });

  const titlebarButtonWidth = 16;
  const titlebarHeight = 18;
  let titlebar: Titlebar = $derived({
    width: windowContents.width,
    height: titlebarHeight,
    button: {
      width: titlebarButtonWidth,
      height: 14
    },
    controlBox: {
      width: titlebarButtonWidth * 3 + padding * 3,
      height: titlebarHeight
    },
    gradient: {
      width: windowContents.width - (titlebarButtonWidth * 3 + padding * 3),
      height: titlebarHeight
    }
  });

  const statusbarHeight = 18;
  const statusbar: Rect = $derived({
    width: windowContents.width,
    height: statusbarHeight
  });

  const windowTextArea: Rect = $derived({
    width: windowContents.width,
    height: showStatus? (windowContents.height - titlebar.height - padding - (statusbar.height + padding)) : (windowContents.height - titlebar.height - padding)
  });

  const scrollbar = $derived({
    width: 16,
    height: windowTextArea.height - frameSize * 2,
    y: frameSize,
    x: windowTextArea.width - frameSize - 16,
    button: {
      width: 16,
      height: 16,
    }
  });

  const resizeGrip: Frame = $derived({
    width: 13,
    height: 13,
    x: windowContents.width - 13,
    y: windowContents.height - 13
  });

  let titleColor = $state("ActiveTitle");
  let titleGradientColor = $state("GradientActiveTitle");
  if (!isActive) {
    titleColor = "InactiveTitle";
    titleGradientColor = "GradientInactiveTitle";
  }

  let inputFiles: FileList = $state()!;
  let imgBase64 = $state("");
  function uploadFile() {
    let file = inputFiles[0];

    const img = new Image(); //making a fake temp object to get dimensions~
    const imgUrl = URL.createObjectURL(file);
    img.onload = function() {
      //also we calculate how much Actual width and height we will need beforehand since :p fuck it i guess
      const windowWidth = frameSize * 2 + padding * 2;
      const windowHeight = frameSize * 2 + padding * 2 + titlebarHeight + padding + (showStatus ? (statusbarHeight + padding) : 0);
      targetWidth = (img.naturalWidth + windowWidth) * scale;
      targetHeight = (img.naturalHeight + windowHeight) * scale;

      bgFilename = `${file.name.replace(/\.[^/.]+$/, "")}-window.png`;

      URL.revokeObjectURL(imgUrl); //free our temp object >.<
    };

    img.src = imgUrl;

    const reader = new FileReader();
    reader.onload = function(event) { imgBase64 = event.target!.result; };
    reader.readAsDataURL(file);
  }

  function exportPNG() {
    const svgElement = document.querySelector<SVGSVGElement>("#preview svg");
    if (!svgElement) return;

    const code = new XMLSerializer().serializeToString(svgElement);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth / scale;
      canvas.height = targetHeight / scale;

      const context = canvas.getContext("2d");
      if (!context) return; 
      context.drawImage(image, 0, 0, width, height);

      //then, force download >.<
      const element = document.createElement("a");
      element.setAttribute("href", canvas.toDataURL());
      element.setAttribute("download", bgFilename);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      URL.revokeObjectURL(image.src); //cleanup~
    };
    image.src = URL.createObjectURL(new Blob([code], {type: "image/svg+xml;charset=utf-8"}));
  }
</script>

<h1>yuiyamu window generator :3</h1>
<p>much less versatile compared to <a href="http://tpenguinltg.wordpress.com/">tPenguinLTG</a>'s <a href="https://github.com/tpenguinltg/winclassic-window">winclassic-window</a>, but made more efficient for video making >:3</p>
    
<div>
    <input type="file" accept="image/*" bind:files={inputFiles} onchange={() => uploadFile()} />
    <label>scale</label>
    <input type="range" min="1" max="10" bind:value={scale}/>
    <button id="download-png" onclick={() => exportPNG()}>download (~˶˃ ᵕ ˂˶)~</button>
</div>

<div id="preview">
<svg width="{targetWidth}" height="{targetHeight}" viewBox="0 0 {targetWidth} {targetHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
   <style><![CDATA[
     .ButtonDkShadow { fill: #000000; }
     .ButtonShadow   { fill: #5A4EB1; }
     .ButtonFace     { fill: #AEA8D9; }
     .ButtonLight    { fill: #AEA8D9; }
     .ButtonHilight  { fill: #D8D5EC; }
     .ButtonText     { fill: #000000; }
     .ActiveTitle    { fill: #5A4EB1; stop-color: #5A4EB1; }
     .GradientActiveTitle { fill: #B68FCB; stop-color: #B68FCB; }
     .InactiveTitle    { fill: #808080; stop-color: #808080; }
     .GradientInactiveTitle { fill: #B8B4D0; stop-color: #B8B4D0; }
     .Window { fill: #AEA8D9; }
   ]]></style>
   <defs>
     <rect id="minimize-symbol" width="6" height="2" class="ButtonText"/>
     <path id="maximize-symbol" fill-rule="evenodd" d="m 0,0 h 9 v 9 h -9 v -9 m 1,2 v 6 h 7 v -6 h -7" class="ButtonText"/>
     <path id="restore-symbol" fill-rule="evenodd" d="m 0,9 v -6 h 2 v -3 h 6 v 6 h -2 v 3 h -6 m 1,-1 h 4 v -3 h -4 v 3 m 6,-6 h -4 v 1 h 3 v 2 h 1 v -3" class="ButtonText"/>
     <path id="close-symbol" d="m 0,0 h 2 v 1 h 1 v 1 h 2 v -1 h 1 v -1 h 2 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h -2 v -1 h -1 v -1 h -2 v 1 h -1 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h -1 v -1 h -1 v -1 h -1 v -1" class="ButtonText"/>
     <path id="scroll-up-symbol" d="m 0,4 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h -7" class="ButtonText"/>
     <path id="scroll-down-symbol" d="m 0,0 h 7 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -1" class="ButtonText"/>
     <linearGradient id="titlebar-gradient">
       <stop offset="0" class="{titleColor}"/>
       <stop offset="1" class="{titleGradientColor}"/>
     </linearGradient>
     <pattern id="scrollbar-pattern" width="2" height="2" patternUnits="userSpaceOnUse">
       <rect x="0" y="0" width="2" height="2" class="ButtonFace"/>
       <rect x="0" y="0" width="1" height="1" class="ButtonHilight"/>
       <rect x="1" y="1" width="1" height="1" class="ButtonHilight"/>
     </pattern>
     <g id="titlebar-button">
       <rect x="0" y="0" width="16" height="14" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="15" height="13" class="ButtonHilight"/>
       <rect x="1" y="1" width="14" height="12" class="ButtonShadow"/>
       <rect x="1" y="1" width="13" height="11" class="ButtonLight"/>
       <rect x="2" y="2" width="12" height="10" class="ButtonFace"/>
     </g>
     <g id="scrollbar-button">
       <rect x="0" y="0" width="16" height="16" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="15" height="15" class="ButtonLight"/>
       <rect x="1" y="1" width="14" height="14" class="ButtonShadow"/>
       <rect x="1" y="1" width="13" height="13" class="ButtonHilight"/>
       <rect x="2" y="2" width="12" height="12" class="ButtonFace"/>
     </g>
     <g id="resize-grip">
       <path class="ButtonHilight" d="m 0,12 h 12 v -12 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonShadow" d="m 1,12 h 11 v -11 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonFace" d="m 3,12 h 9 v -9 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonHilight" d="m 4,12 h 8 v -8 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonShadow" d="m 5,12 h 7 v -7 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonFace" d="m 7,12 h 5 v -5 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonHilight" d="m 8,12 h 4 v -4 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonShadow" d="m 9,12 h 3 v -3 h -1 v 1 h -1 v 1 h -1 v 1"/>
       <path class="ButtonFace" d="m 0,13 h 13 v -13 h -1 v 11 h -1 v 1 h -11 v 1"/>
     </g>

     <g id="minimize-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#minimize-symbol" xlink:href="#minimize-symbol" x="4" y="9"/>
     </g>
     <g id="maximize-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#maximize-symbol" xlink:href="#maximize-symbol" x="3" y="2"/>
     </g>
     <g id="restore-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#restore-symbol" xlink:href="#restore-symbol" x="3" y="2"/>
     </g>
     <g id="close-button">
       <use href="#titlebar-button" xlink:href="#titlebar-button"/>
       <use href="#close-symbol" xlink:href="#close-symbol" x="4" y="3"/>
     </g>
     <g id="scroll-up-button">
       <use href="#scrollbar-button" xlink:href="#scrollbar-button"/>
       <use href="#scroll-up-symbol" xlink:href="#scroll-up-symbol" x="4" y="6"/>
     </g>
     <g id="scroll-down-button">
       <use href="#scrollbar-button" xlink:href="#scrollbar-button"/>
       <use href="#scroll-down-symbol" xlink:href="#scroll-down-symbol" x="4" y="6"/>
     </g>

     <g id="titlebar-control-box">
       <rect class="{titleGradientColor}" width="{titlebar.controlBox.width}" height="{titlebar.controlBox.height}"/>
       <use href="#minimize-button" xlink:href="#minimize-button" x="{padding}" y="2"/>
       <use href="#maximize-button" xlink:href="#maximize-button" x="{padding + titlebar.button.width}" y="2"/>
       <use href="#close-button" xlink:href="#close-button" x="{2 * padding + 2 * titlebar.button.width}" y="2"/>
     </g>

     <g id="window-frame">
       <rect x="0" y="0" width="{windowFrame.width - 0}" height="{windowFrame.height - 0}" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="{windowFrame.width - 1}" height="{windowFrame.height - 1}" class="ButtonLight"/>
       <rect x="1" y="1" width="{windowFrame.width - 2}" height="{windowFrame.height - 2}" class="ButtonShadow"/>
       <rect x="1" y="1" width="{windowFrame.width - 3}" height="{windowFrame.height - 3}" class="ButtonHilight"/>
       <rect x="2" y="2" width="{windowFrame.width - 4}" height="{windowFrame.height - 4}" class="ButtonFace"/>
     </g>
     <g id="window-text-area">
       <rect x="0" y="0" width="{windowTextArea.width - 0}" height="{windowTextArea.height - 0}" class="ButtonHilight"/>
       <rect x="0" y="0" width="{windowTextArea.width - 1}" height="{windowTextArea.height - 1}" class="ButtonShadow"/>
       <rect x="1" y="1" width="{windowTextArea.width - 2}" height="{windowTextArea.height - 2}" class="ButtonLight"/>
       <rect x="1" y="1" width="{windowTextArea.width - 3}" height="{windowTextArea.height - 3}" class="ButtonDkShadow"/>
       <rect x="2" y="2" width="{windowTextArea.width - 4}" height="{windowTextArea.height - 4}" class="Window"/>
     </g>
     <g id="scrollbar">
       <rect fill="url(#scrollbar-pattern)" width="16" height="{scrollbar.height}"/>
       <use href="#scroll-up-button" xlink:href="#scroll-up-button"/>
       <use href="#scroll-down-button" xlink:href="#scroll-down-button" x="0" y="{scrollbar.height - scrollbar.button.height}"/>
     </g>
     <g id="statusbar">
       <rect x="0" y="0" width="{statusbar.width - 0}" height="{statusbar.height - 0}" class="ButtonHilight"/>
       <rect x="0" y="0" width="{statusbar.width - 1}" height="{statusbar.height - 1}" class="ButtonShadow"/>
       <rect x="1" y="1" width="{statusbar.width - 2}" height="{statusbar.height - 2}" class="ButtonFace"/>
     </g>

     <g id="titlebar">
       <rect fill="url(#titlebar-gradient)" width="{titlebar.gradient.width}" height="18"/>
       <use href="#titlebar-control-box" xlink:href="#titlebar-control-box" x="{titlebar.gradient.width}"/>
     </g>

     <g id="window-main">
       <use href="#window-text-area" xlink:href="#window-text-area"/>
       <image href={imgBase64} x="2" y="2" width="{windowTextArea.width - 4}" height="{windowTextArea.height - 4}"/>
       {#if showScrollbar}
       <use href="#scrollbar" xlink:href="#scrollbar" x="{scrollbar.x}" y="{scrollbar.y}"/>
       {/if}
    </g>

     <g id="window-contents">
       <rect width="{windowContents.width}" height="{windowContents.height}" class="ButtonFace"/>
       <use href="#titlebar" xlink:href="#titlebar" y="0"/>
       <use href="#window-main" xlink:href="#window-main" y="{titlebar.height + padding}"/>
       {#if showStatus}
       <use href="#statusbar" xlink:href="#statusbar" y="{windowContents.height - statusbar.height}"/>
       {/if}
       {#if showResize}
       <use href="#resize-grip" xlink:href="#resize-grip" x="{resizeGrip.x}" y="{resizeGrip.y}"/>
       {/if}
     </g>
   </defs>
   <g id="window" transform="scale({scale})">
    <use href="#window-frame" xlink:href="#window-frame" x="0" y="0"/>
    <use href="#window-contents" xlink:href="#window-contents" x="{windowContents.x}" y="{windowContents.y}"/>
   </g>
</svg>
</div>

<footer>
    <p>made by <a href="https://yuru.ca">yuiyamu</a>, based on <a href="http://tpenguinltg.wordpress.com/">tPenguinLTG</a>'s <a href="https://github.com/tpenguinltg/winclassic-window">winclassic-window</a> project~</p>
</footer>

<style>
  #preview {
    display: inline-block;
    overflow: hidden;
    padding: 1ex;
    border: 2px inset black;
    background-color: #808080;
  }
</style>