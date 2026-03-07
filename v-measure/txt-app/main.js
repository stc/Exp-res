let events = [];
let asciiChars = ['_', '/', '-', ':', '=', '+', '*', '#', '%', '@'];
let shades = ['░', '▒', '▓', '█']
let gridCols = 280;
let gridRows = 320;
let cellSize = 8;
let grid = [];
let mFont;
let timestampsByRow = {};
let eventCountsByRow = {};

let renderAsSVG = false;

let colorIndex = 1;

let colors = [
  {
    "label": [140,0,4],
    "positions": [68,30,148],
    "noise": [141,156,169],
    "time": [255,255,255],
    "collisions": [140,0,4],
    "header": [255,255,255]
  },
  {
    "label": [255,255,255],
    "positions": [140,0,4],
    "noise": [41,56,69],
    "time": [41,56,69],
    "collisions": [140,0,4],
    "header": [200,200,200]
  },
  {
    "label": [255,255,255],
    "positions": [210,158,0],
    "noise": [41,56,69],
    "time": [41,56,69],
    "collisions": [210,158,0],
    "header": [210,158,0]
  },
  {
    "label": [255,255,255],
    "positions": [0,80,255],
    "noise": [41,56,69],
    "time": [94, 178, 205],
    "collisions": [94, 178, 205],
    "header": [94, 178, 205]
  },
  {
    "label": [157, 242, 127],
    "positions": [0,238, 242],
    "noise": [0, 60, 62],
    "time": [255,255,255],
    "collisions": [150, 150, 150],
    "header": [255, 255, 255]
  },
  {
    "label": [255, 255, 255],
    "positions": [0, 72, 75],
    "noise": [73, 125, 103],
    "time": [255, 255, 255],
    "collisions": [150, 150, 150],
    "header": [255, 255, 255]
  },
  {
    "label": [141, 255, 200],
    "positions": [255, 255, 255],
    "noise": [30, 62, 96],
    "time": [255, 255, 255],
    "collisions": [150, 150, 150],
    "header": [141, 255, 200]
  },
  {
    "label": [188, 186, 0],
    "positions": [255, 255, 255],
    "noise": [109, 138, 151],
    "time": [255, 255, 255],
    "collisions": [150, 150, 150],
    "header": [0, 0, 200]
  },
  {
    "label": [255, 255, 255],
    "positions": [14, 187, 234],
    "noise": [77, 124, 101],
    "time": [188, 186, 0],
    "collisions": [150, 150, 150],
    "header": [188, 186, 0]
  },
  {
    // FF-Version + yellow & blue
    "label": [0, 200, 0],
    "positions": [10, 200, 255],
    "noise": [200],
    "time": [255, 255, 255],
    "collisions": [150, 150, 150],
    "header": [0, 200, 0]
  }]

function preload() {
  mFont = loadFont("./assets/IBMPlexMono-Bold.ttf");
  events = loadStrings('./assets/red-2399.txt');
}

function setup() {
  if (renderAsSVG) {
    createCanvas((gridCols + 200) * cellSize / 1.7, gridRows * cellSize, SVG);
  } else {
    createCanvas((gridCols + 200) * cellSize / 1.7, gridRows * cellSize);
  }
  textFont(mFont, cellSize);
  getCollisionEvents();
  //noLoop();
}

function draw() {
  background(0);

  let oStr = "OBJECT "
  let pStr = "POSITIONS"

  // NEW: offsets only for these labels
  let objectOffset = 22;
  let positionOffset = 22;

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      let cell = grid[y][x];
      let char = cell.char;
      let label = cell.label;
      let type = cell.type;

      if (type === "coords") fill(colors[colorIndex].positions);
      else if (label) fill(...colors[colorIndex].label);
      else fill(colors[colorIndex].noise);

      noStroke();
      if (y > 0) {
        text(char, x * cellSize / 1.7, y * cellSize + cellSize);
      } else {
        if (x < 7) {
          fill(colors[colorIndex].header)
          text("0", x * cellSize / 1.7, y * cellSize + cellSize)

          fill(colors[colorIndex].label)
          text(
            oStr[x % 9],
            x * cellSize / 1.7 + (cellSize * gridCols / 4) + cellSize * 4 + objectOffset,
            y * cellSize + cellSize
          );

        } else if (x > 8 && x < 18) {
          fill(colors[colorIndex].header)
          text("0", x * cellSize / 1.7, y * cellSize + cellSize)

          fill(colors[colorIndex].positions)
          text(
            pStr[x % 9],
            x * cellSize / 1.7 + (cellSize * gridCols / 4) + cellSize * 3 + positionOffset,
            y * cellSize + cellSize
          );

        } else {
          fill(colors[colorIndex].header)
          if (x > gridCols / 2 + 6 || x < gridCols / 2 - 10) text("0", x * cellSize / 1.7, y * cellSize + cellSize)
        }
      }
    }
    noLoop();
  }

  let baseX = gridCols * cellSize / 1.7 + 5;
  let maxColumnWidth = 150;

  for (let row in timestampsByRow) {
    let tsArray = timestampsByRow[row];
    let colIndex = 0;
    let xOffset = baseX;
    let yPos = row * cellSize + cellSize;

    for (let ts of tsArray) {
      let paddedTime = nf(parseFloat(ts), 5, 1);
      let tsText = `[${paddedTime}]`;
      let tsWidth = textWidth(tsText) + 10;

      if (xOffset + tsWidth - baseX > maxColumnWidth) {
        colIndex++;
        xOffset = baseX + colIndex * maxColumnWidth;
      }
      fill(colors[colorIndex].time);
      if (row == 0) text("TIME(s)", xOffset, yPos);
      else text(tsText, xOffset, yPos);
      xOffset += tsWidth;
    }

    fill(colors[colorIndex].collisions)
    if (eventCountsByRow[row] !== undefined) {
      if (row == 0) text("COLLISIONS", xOffset, yPos);
      else text(`+ ${nf(eventCountsByRow[row], 3)}`, xOffset + 10, yPos);
    }
  }
}

function getCollisionEvents() {
  let n = 5;
  events = events.filter((_, index) => index % n === 0);

  for (let y = 0; y < gridRows; y++) {
    grid[y] = [];
    for (let x = 0; x < gridCols; x++) {
      grid[y][x] = { char: y, label: null, type: null };
    }
  }

  // Group events by timestamp
  let groupedEvents = {};
  let minX = Infinity, maxX = -Infinity;

  for (let line of events) {
    let match = line.match(/\[([^\]]+)\].*T=([\d.]+)/);
    if (!match) continue;

    let name = match[1].split("_")[0];
    let timestamp = parseFloat(match[2]).toFixed(2);

    let coordsMatch = line.match(/X=([\d,-]+).*Y=([\d,-]+).*Z=([\d,-]+)/);
    if (!coordsMatch) continue;
    let xVal = parseFloat(coordsMatch[1].replace(',', '.'));
    let yVal = parseFloat(coordsMatch[2].replace(',', '.'));
    let zVal = parseFloat(coordsMatch[3].replace(',', '.')).toFixed(2);

    minX = Math.min(minX, xVal);
    maxX = Math.max(maxX, xVal);

    if (!groupedEvents[timestamp]) groupedEvents[timestamp] = [];
    groupedEvents[timestamp].push({ name, xVal, yVal, zVal });
  }

  // Place grouped events in rows
  let rowIndex = 0;
  for (let ts in groupedEvents) {
    if (rowIndex >= gridRows) break;

    let eventsRow = groupedEvents[ts];

    let firstEventX = eventsRow[0].xVal;
    let startCol = Math.floor(map(firstEventX, minX, maxX, 0, gridCols - 1))
    startCol = constrain(startCol, 0, gridCols - 1);
    let colIndex = startCol;

    // Store number of events per row
    eventCountsByRow[rowIndex] = eventsRow.length;

    let evIndex = 0
    for (let ev of eventsRow) {
      let name = ev.name;
      let coordsStr = ` X: ${ev.xVal}, Y: ${ev.yVal}, Z: ${ev.zVal}`;

      // Place name characters
      for (let i = 0; i < name.length; i++) {
        if (colIndex < gridCols) grid[rowIndex][colIndex++] = { char: name[i], label: true, type: "name" };
      }

      // Place coordinates after name
      for (let i = 0; i < coordsStr.length; i++) {
        if (colIndex < gridCols) grid[rowIndex][colIndex++] = { char: coordsStr[i], label: false, type: "coords" };
      }

      if (colIndex < gridCols) grid[rowIndex][colIndex++] = { char: ' ', label: false, type: null };
    }

    if (!timestampsByRow[rowIndex]) timestampsByRow[rowIndex] = [];
    timestampsByRow[rowIndex].push(ts);

    rowIndex++;
  }
}

function keyPressed() {
  if (key == "s") {
    if (renderAsSVG) {
      save(`collisions-${Date.now()}.svg`);
    } else {
      save(`collisons-${Date.now()}.png`)
    }
  }
  if (key == "n") {
    colorIndex++;
    if (colorIndex > colors.length - 1) {
      colorIndex = 0;
    }
    loop();
  }
}