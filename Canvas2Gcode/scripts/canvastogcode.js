var gcode = "";
var gx, gy;

function recordCanvas(gw_, gh_) {
  gw = gw_;
  gh = gh_;
  gcode += "F5000\n";

  var ctxFns = [
    'fillRect',
    'save',
    'restore',
    'scale',
    'rotate',
    'translate',
    'transform',
    'setTransform',
    'resetTransform',
    'createLinearGradient',
    'createRadialGradient',
    'createPattern',
    'clearRect',
    'strokeRect',
    'beginPath',
    'fill',
    'stroke',
    'drawFocusIfNeeded',
    'clip',
    'isPointInPath',
    'isPointInStroke',
    'fillText',
    'strokeText',
    'measureText',
    'drawImage',
    'createImageData',
    'getImageData',
    'putImageData',
    'getContextAttributes',
    'setLineDash',
    'getLineDash',
    'setAlpha',
    'setCompositeOperation',
    'setLineWidth',
    'setLineCap',
    'setLineJoin',
    'setMiterLimit',
    'clearShadow',
    'setStrokeColor',
    'setFillColor',
    'drawImageFromRect',
    'setShadow',
    'closePath',
    'moveTo',
    'lineTo',
    'quadraticCurveTo',
    'bezierCurveTo',
    'arcTo',
    'rect',
    'arc',
    'ellipse',
    'scrollPathIntoView',
    'addHitRegion',
    'removeHitRegion',
    'clearHitRegions',
    'isContextLost'
  ];

  var origGetContext = HTMLCanvasElement.prototype.getContext;

  function hookFunc(ctx, name) {
    var origFn = ctx[name];
    ctx[name] = function() {
      canvasToGcode(name, arguments);
      return origFn.apply(this, arguments);
    };
  }

  HTMLCanvasElement.prototype.getContext = function() {
    var ctx = origGetContext.apply(this, arguments);
    ctxFns.forEach(function(fnName) {
      hookFunc(ctx, fnName);
    });

    return ctx;
  }
}

function beginRecord() {
  gcode = "G28\n";
}

function endRecord() {
  let g = "G01 Z0\n";
  g += "G28\n" // Home;
  gcode += g;
}

let lastMoveToX = 0; // workaround for bezierTo
let lastMoveToY = 0;

function canvasToGcode(name, arguments) {
  let g = ""; 
  switch (name) {
    case "beginPath":
      //g += "G28\n"; //Home
      gcode += g;
      break;
    case "endPath":
      g += "G01 Z0\n"
      gcode += g;
      break;
    case "moveTo":
      gx = map(arguments[0], 0, width, gw, 0); // inverted
      gy = map(arguments[1], 0, height, 0, gh); // inverted
      lastMoveToX = gx;
      lastMoveToY = gy;
      g += "G01 Z0\n"
      g += "G01 X" + gx + " Y" + gy + "\n";
      gcode += g;
      break;
    case "lineTo":
      gx = map(arguments[0], 0, width, gw, 0); // inverted
      gy = map(arguments[1], 0, height, 0, gh); // inverted
      lastMoveToX = gx;
      lastMoveToY = gy;
      
      g += "G01 Z10\n"
      g += "G01 X" + gx + " Y" + gy + "\n";
      gcode += g;
      break;
    case "rect":
      gx = map(arguments[0], 0, width, gw, 0); // inverted
      gy = map(arguments[1], 0, height, 0, gh); // inverted  
      grw = map(arguments[2], 0, width, 0, gw);
      grh = map(arguments[3], 0, height, 0, gh);
      
      g += "G01 Z10\n"
      g += "G01 X" + gx + " Y" + gy + "\n";
      g += "G01 X" + (gx+grw) + " Y" + gy + "\n";
      g += "G01 X" + (gx+grw) + " Y" + (gy+grh) + "\n";
      g += "G01 X" + gx + " Y" + (gy+grh) + "\n";
      g += "G01 X" + gx + " Y" + gy + "\n";
      g += "G01 Z0\n"
      gcode += g;
      break;
    case "bezierCurveTo":
      let g0 = lastMoveToX; //map(arguments[0], 0, width, gw, 0); // inverted
      let g1 = lastMoveToY; //map(arguments[1], 0, height, 0, gh); // inverted
      let g2 = map(arguments[0], 0, width, gw, 0); // inverted
      let g3 = map(arguments[1], 0, height, 0, gh); // inverted
      let g4 = map(arguments[2], 0, width, gw, 0); // inverted
      let g5 = map(arguments[3], 0, height, 0, gh); // inverted
      let g6 = map(arguments[4], 0, width, gw, 0); // inverted
      let g7 = map(arguments[5], 0, height, 0, gh); // inverted
      
      lastMoveToX = g6;
      lastMoveToY = g7;

      g += "G01 Z10\n"
      var curve = new Bezier(g0, g1, g2, g3, g4, g5, g6, g7);
      var LUT = curve.getLUT(16);
      LUT.forEach(function(p) {
        g += "G01 X" + p.x + " Y" + p.y + "\n";
      });
      gcode += g;
      break;
    default:
      gcode += g;
  }
}