const DEFAULT_COLORS = {
  ButtonAlternateFace: '#babdb6',
  ButtonDkShadow: '#000',
  ButtonFace: '#d3d7cf',
  ButtonHilight: '#eaece8',
  ButtonLight: '#eeeeec',
  ButtonShadow: '#888a85',
  ButtonText: '#000000',
  ActiveBorder: '#d3d7cf',
  AppWorkspace: '#888a85',
  Background: '#729fcf',
  InactiveBorder: '#d3d7cf',
  Scrollbar: '#eaece8',
  Window: '#ffffff',
  WindowFrame: '#000000',
  WindowText: '#000000',
  ActiveTitle: '#204a87',
  GradientActiveTitle: '#498e4e',
  GradientInactiveTitle: '#3465a4',
  InactiveTitle: '#204a87',
  InactiveTitleText: '#d3d7cf',
  TitleText: '#ffffff',
  Menu: '#d3d7cf',
  MenuBar: '#d3d7cf',
  MenuHilight: '#204a87',
  MenuText: '#000000',
  GrayText: '#888a85',
  Hilight: '#204a87',
  HilightText: '#ffffff',
  HotTrackingColor: '#204a87',
  InfoText: '#000000',
  InfoWindow: '#ffffbb',
};

function createWindowSVG({
  width: targetWidth = 266,
  height: targetHeight = 486,
  scale = 1,
  showScrollbar = true,
  showResize = true,
  showStatus = true,
  maximized = false,
  colors: {
    ButtonDkShadow = DEFAULT_COLORS.ButtonDkShadow,
    ButtonShadow = DEFAULT_COLORS.ButtonShadow,
    ButtonFace = DEFAULT_COLORS.ButtonFace,
    ButtonLight = DEFAULT_COLORS.ButtonLight,
    ButtonHilight = DEFAULT_COLORS.ButtonHilight,
    ButtonText = DEFAULT_COLORS.ButtonText,
    ActiveTitle = DEFAULT_COLORS.ActiveTitle,
    GradientActiveTitle = DEFAULT_COLORS.GradientActiveTitle,
    Window = DEFAULT_COLORS.Window,
  } = {},
}) {
  const padding = 2;
  const frameSize = 2;
  const width = targetWidth / scale;
  const height = targetHeight / scale;
  const windowFrame = {
    width,
    height,
    x: 0,
    y: 0,
  };
  const windowContents = {
    width: maximized ? width : windowFrame.width - frameSize * 2 - padding * 2,
    height: maximized ? height : windowFrame.height - frameSize * 2 - padding * 2,
    x: maximized ? 0 : frameSize + padding,
    y: maximized ? 0 : frameSize + padding,
  };
  const titlebar = {
    width: windowContents.width,
    height: 18,
    button: {
      width: 16,
      height: 14,
    },
  };
  titlebar.gradient = {
    width: titlebar.width - (titlebar.button.width * 3 + padding * 3),
    height: titlebar.height,
  };
  const statusbar = {
    width: windowContents.width,
    height: 18,
  }
  const windowTextArea = {
    width: windowContents.width,
    height: windowContents.height - titlebar.height - padding - (statusbar.height + padding) * showStatus,
  };
  const scrollbar = {
    height: windowTextArea.height - frameSize * 2,
    button: {
      width: 16,
      height: 16,
    },
    y: frameSize,
  };
  scrollbar.width = scrollbar.button.width;
  scrollbar.x = windowTextArea.width - frameSize - scrollbar.width;
  const resizeGrip = {
    width: 13,
    height: 13,
  };
  resizeGrip.x = windowContents.width - resizeGrip.width;
  resizeGrip.y = windowContents.height - resizeGrip.height;

  const svg= `<svg
   width="${targetWidth}"
   height="${targetHeight}"
   viewBox="0 0 ${targetWidth} ${targetHeight}"
   version="1.1"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink">
   <style><![CDATA[
     .ButtonDkShadow { fill: ${ButtonDkShadow}; }
     .ButtonShadow   { fill: ${ButtonShadow}; }
     .ButtonFace     { fill: ${ButtonFace}; }
     .ButtonLight    { fill: ${ButtonLight}; }
     .ButtonHilight  { fill: ${ButtonHilight}; }
     .ButtonText     { fill: ${ButtonText}; }
     .ActiveTitle    { fill: ${ActiveTitle}; stop-color: ${ActiveTitle}; }
     .GradientActiveTitle { fill: ${GradientActiveTitle}; stop-color: ${GradientActiveTitle}; }
     .Window { fill: ${Window}; }
   ]]></style>
   <defs>
     <rect id="minimize-symbol" width="6" height="2" class="ButtonText"/>
     <path id="maximize-symbol" fill-rule="evenodd" d="m 0,0 h 9 v 9 h -9 v -9 m 1,2 v 6 h 7 v -6 h -7" class="ButtonText"/>
     <path id="restore-symbol" fill-rule="evenodd" d="m 0,9 v -6 h 2 v -3 h 6 v 6 h -2 v 3 h -6 m 1,-1 h 4 v -3 h -4 v 3 m 6,-6 h -4 v 1 h 3 v 2 h 1 v -3" class="ButtonText"/>
     <path id="close-symbol" d="m 0,0 h 2 v 1 h 1 v 1 h 2 v -1 h 1 v -1 h 2 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h -2 v -1 h -1 v -1 h -2 v 1 h -1 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h -1 v -1 h -1 v -1 h -1 v -1" class="ButtonText"/>
     <path id="scroll-up-symbol" d="m 0,4 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h -7" class="ButtonText"/>
     <path id="scroll-down-symbol" d="m 0,0 h 7 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -1" class="ButtonText"/>
     <linearGradient id="titlebar-gradient">
       <stop offset="0" class="ActiveTitle"/>
       <stop offset="1" class="GradientActiveTitle"/>
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

     <g id="titlebar-buttons">
       <rect class="GradientActiveTitle" width="54" height="18"/>
       <use href="#minimize-button" xlink:href="#minimize-button" x="2" y="2"/>
${maximized ? '       <use href="#restore-button" xlink:href="#restore-button" x="18" y="2"/>\n'
            : '       <use href="#maximize-button" xlink:href="#maximize-button" x="18" y="2"/>\n'
}       <use href="#close-button" xlink:href="#close-button" x="36" y="2"/>
     </g>

     <g id="window-frame">
       <rect x="0" y="0" width="${windowFrame.width - 0}" height="${windowFrame.height - 0}" class="ButtonDkShadow"/>
       <rect x="0" y="0" width="${windowFrame.width - 1}" height="${windowFrame.height - 1}" class="ButtonLight"/>
       <rect x="1" y="1" width="${windowFrame.width - 2}" height="${windowFrame.height - 2}" class="ButtonShadow"/>
       <rect x="1" y="1" width="${windowFrame.width - 3}" height="${windowFrame.height - 3}" class="ButtonHilight"/>
       <rect x="2" y="2" width="${windowFrame.width - 4}" height="${windowFrame.height - 4}" class="ButtonFace"/>
     </g>
     <g id="window-text-area">
       <rect x="0" y="0" width="${windowTextArea.width - 0}" height="${windowTextArea.height - 0}" class="ButtonHilight"/>
       <rect x="0" y="0" width="${windowTextArea.width - 1}" height="${windowTextArea.height - 1}" class="ButtonShadow"/>
       <rect x="1" y="1" width="${windowTextArea.width - 2}" height="${windowTextArea.height - 2}" class="ButtonLight"/>
       <rect x="1" y="1" width="${windowTextArea.width - 3}" height="${windowTextArea.height - 3}" class="ButtonDkShadow"/>
       <rect x="2" y="2" width="${windowTextArea.width - 4}" height="${windowTextArea.height - 4}" class="Window"/>
     </g>
     <g id="scrollbar">
       <rect fill="url(#scrollbar-pattern)" width="16" height="${scrollbar.height}"/>
       <use href="#scroll-up-button" xlink:href="#scroll-up-button"/>
       <use href="#scroll-down-button" xlink:href="#scroll-down-button" x="0" y="${scrollbar.height - scrollbar.button.height}"/>
     </g>
     <g id="statusbar">
       <rect x="0" y="0" width="${statusbar.width - 0}" height="${statusbar.height - 0}" class="ButtonHilight"/>
       <rect x="0" y="0" width="${statusbar.width - 1}" height="${statusbar.height - 1}" class="ButtonShadow"/>
       <rect x="1" y="1" width="${statusbar.width - 2}" height="${statusbar.height - 2}" class="ButtonFace"/>
     </g>

     <g id="titlebar">
       <rect fill="url(#titlebar-gradient)" width="${titlebar.gradient.width}" height="18"/>
       <use href="#titlebar-buttons" xlink:href="#titlebar-buttons" x="${titlebar.gradient.width}"/>
     </g>

     <g id="window-main">
       <use href="#window-text-area" xlink:href="#window-text-area"/>
${showScrollbar ? `       <use href="#scrollbar" xlink:href="#scrollbar" x="${scrollbar.x}" y="${scrollbar.y}"/>\n` : ''
}     </g>

     <g id="window-contents">
       <rect width="${windowContents.width}" height="${windowContents.height}" class="ButtonFace"/>
       <use href="#titlebar" xlink:href="#titlebar" y="0"/>
       <use href="#window-main" xlink:href="#window-main" y="${titlebar.height + padding}"/>
${showStatus ? `       <use href="#statusbar" xlink:href="#statusbar" y="${windowContents.height - statusbar.height}"/>\n` : ''
}${showResize ? `     <use href="#resize-grip" xlink:href="#resize-grip" x="${resizeGrip.x}" y="${resizeGrip.y}"/>\n` : ''
}     </g>
   </defs>
   <g id="window" transform="scale(${scale})">
${maximized ? '' : `     <use href="#window-frame" xlink:href="#window-frame" x="0" y="0"/>\n`
}     <use href="#window-contents" xlink:href="#window-contents" x="${windowContents.x}" y="${windowContents.y}"/>
   </g>
</svg>`;

  return {
    svg,
    dimensions: {
      windowTextArea: {
        width: (showScrollbar ? scrollbar.x - frameSize : windowTextArea.width - frameSize * 2) * scale,
        height: scrollbar.height * scale,
      }
    }
  }
}
