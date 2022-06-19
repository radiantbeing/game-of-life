function getCellSize(screenW) {
  let cellSize;
  if (screenW < 576) cellSize = 5;
  else if (screenW < 993) cellSize = 6;
  else cellSize = 8;
  return cellSize;
}

// Variables of device screen
const screenW = window.screen.width;
const screenH = window.screen.height;

const cellSize = getCellSize(); // Cell 하나의 크기

// Variables of state space
const rangeX = parseInt(screenW / cellSize); // 상태 공간 열의 길이
const rangeY = parseInt(screenH / cellSize); // 상태 공간 행의 길이

// Variables of state
const ALIVE = 1; // 생존 상태
const DEATH = 0; // 죽음 상태

// Set up canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = rangeX * cellSize;
canvas.height = rangeY * cellSize;

function render(cell, x, y, cellSize) {
  if (cell.getT() === true) {
    ctx.fillStyle = cell.getState() == ALIVE ? "black" : "white";
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    cell.setT(false);
  }
}

// 세포 클래스 정의
class Cell {
  constructor(state) {
    this.setState(state);
    // 상태 전이 Flag
    // 상태 전이가 발생하면 true로 변화한다.
    // true로 바뀐 flag는 render 함수에서 렌더링 후 false로 바꿔준다.
    this.T = false;
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  setT(bool) {
    this.T = bool;
  }

  getT() {
    return this.T;
  }

  decideLife(iStateSpace, X, Y) {
    const Neighbors = [
      [X - 1, Y + 1],
      [X, Y + 1],
      [X + 1, Y + 1],
      [X - 1, Y],
      [X + 1, Y],
      [X - 1, Y - 1],
      [X, Y - 1],
      [X + 1, Y - 1],
    ];

    let aliveCnt = 0;

    // 이웃 세포의 생사를 확인한다.
    for (let coordinate of Neighbors) {
      if (coordinate[0] < 0 || coordinate[0] >= rangeX) continue;
      if (coordinate[1] < 0 || coordinate[1] >= rangeY) continue;

      const tempCell = iStateSpace[coordinate[0]][coordinate[1]];

      if (tempCell.getState() === ALIVE) aliveCnt++;
    }

    const iCell = iStateSpace[X][Y];
    const iCellState = iCell.getState();

    if (iCellState === ALIVE) {
      // 살아 있는 세포의 이웃 중에 두 개나 세 개가 살아 있으면, 그 세포는 계속 살아 있는 상태를 유지하고, 이외에는 ‘외로워서’, 또는 ‘숨이 막혀서’ 죽어버린다.
      this.setState(aliveCnt === 2 || aliveCnt === 3 ? ALIVE : DEATH);
    } else {
      // 죽은 세포의 이웃 중 정확히 세 개가 살아 있으면 그 세포는 살아난다(‘태어난다’).
      this.setState(aliveCnt === 3 ? ALIVE : DEATH);
    }

    if (this.getState() !== iCellState) {
      this.setT(true);
    }
  }
}

// 상태 공간 생성
const stateSpace = new Array(rangeX);
for (let i = 0; i < stateSpace.length; i++) {
  stateSpace[i] = new Array(rangeY);
}

// 상태 공간 초기화
for (let i = 0; i < stateSpace.length; i++) {
  for (let j = 0; j < stateSpace[i].length; j++) stateSpace[i][j] = new Cell(DEATH);
}

// 초기 생존 세포 할당

for (let i = 0; i < stateSpace.length; i++) {
  for (let j = 0; j < stateSpace[i].length; j++) stateSpace[i][j].setState(Math.round(Math.random()));
}

setInterval(() => {
  // 세포 생사 결정을 위한 현재 상태 공간 복사
  // Immediate State Space
  const iStateSpace = JSON.parse(JSON.stringify(stateSpace)); // 깊은 복사
  for (let i = 0; i < stateSpace.length; i++) {
    for (let j = 0; j < stateSpace[i].length; j++) iStateSpace[i][j].__proto__ = Cell.prototype;
  }

  // 세포 생사 결정
  console.time();
  for (let i = 0; i < stateSpace.length; i++) {
    for (let j = 0; j < stateSpace[i].length; j++) {
      const cell = stateSpace[i][j];
      cell.decideLife(iStateSpace, i, j);
      render(cell, i, j, cellSize);
    }
  }
  console.timeEnd();
}, 0);
