const screenSize = { width: window.screen.width, height: window.screen.height };

let cellSize; // Cell 하나의 크기

if (screenSize.width < 576)
  // Mobile
  cellSize = 5;
else if (screenSize.width < 993)
  // Tablet
  cellSize = 6;
// PC
else cellSize = 8;

const rangeX = parseInt(screenSize.width / cellSize); // 상태 공간 상에서 X축의 범위
const rangeY = parseInt(screenSize.height / cellSize); // 상태 공간 상에서 Y축의 범위

const mode = "live"; // "live" or "test"
const testPattern = "glider"; // "block", "blinker", "boat", "toad", "glider"

const states = {
  ALIVE: 1,
  DEATH: 0,
};

// canvas 준비
const canvas = document.getElementById("canvas");
canvas.width = rangeX * cellSize;
canvas.height = rangeY * cellSize;
const ctx = canvas.getContext("2d");

function render(stateSpace) {
  for (let i = 0; i < stateSpace.length; i++) {
    for (let j = 0; j < stateSpace[i].length; j++) {
      if (stateSpace[i][j].getState() == states.ALIVE) {
        ctx.fillStyle = "black";
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

// 세포 클래스 정의
class Cell {
  constructor(state) {
    this.setState(state);
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
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

      const cell = iStateSpace[coordinate[0]][coordinate[1]];

      if (cell.getState() === states.ALIVE) aliveCnt++;
    }

    switch (iStateSpace[X][Y].getState()) {
      // 살아 있는 세포의 이웃 중에 두 개나 세 개가 살아 있으면, 그 세포는 계속 살아 있는 상태를 유지하고, 이외에는 ‘외로워서’, 또는 ‘숨이 막혀서’ 죽어버린다.
      case states.ALIVE:
        this.setState(aliveCnt === 2 || aliveCnt === 3 ? states.ALIVE : states.DEATH);
        break;
      // 죽은 세포의 이웃 중 정확히 세 개가 살아 있으면 그 세포는 살아난다(‘태어난다’).
      case states.DEATH:
        this.setState(aliveCnt === 3 ? states.ALIVE : states.DEATH);
        break;
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
  for (let j = 0; j < stateSpace[i].length; j++) stateSpace[i][j] = new Cell(states.DEATH);
}

// 초기 생존 세포 할당
if (mode === "live") {
  for (let i = 0; i < stateSpace.length; i++) {
    for (let j = 0; j < stateSpace[i].length; j++) stateSpace[i][j].setState(Math.round(Math.random()));
  }
} else {
  const pattern = {
    block: () => {
      stateSpace[0][0].setState(1);
      stateSpace[1][0].setState(1);
      stateSpace[0][1].setState(1);
      stateSpace[1][1].setState(1);
    },
    blinker: () => {
      stateSpace[1][0].setState(1);
      stateSpace[1][1].setState(1);
      stateSpace[1][2].setState(1);
    },
    boat: () => {
      stateSpace[0][0].setState(1);
      stateSpace[1][0].setState(1);
      stateSpace[0][1].setState(1);
      stateSpace[2][1].setState(1);
      stateSpace[1][2].setState(1);
    },
    toad: () => {
      stateSpace[1][1].setState(1);
      stateSpace[2][1].setState(1);
      stateSpace[3][1].setState(1);
      stateSpace[0][2].setState(1);
      stateSpace[1][2].setState(1);
      stateSpace[2][2].setState(1);
    },
    glider: () => {
      stateSpace[2][0].setState(1);
      stateSpace[0][1].setState(1);
      stateSpace[2][1].setState(1);
      stateSpace[1][2].setState(1);
      stateSpace[2][2].setState(1);
    },
  };
  pattern[testPattern]();
}

render(stateSpace);

setInterval(() => {
  // 세포 생사 결정을 위한 현재 상태 공간 복사
  // Immediate State Space
  const iStateSpace = JSON.parse(JSON.stringify(stateSpace)); // 깊은 복사
  for (let i = 0; i < stateSpace.length; i++) {
    for (let j = 0; j < stateSpace[i].length; j++) iStateSpace[i][j].__proto__ = Cell.prototype;
  }

  // 세포 생사 결정
  for (let i = 0; i < stateSpace.length; i++) {
    for (let j = 0; j < stateSpace[i].length; j++) {
      stateSpace[i][j].decideLife(iStateSpace, i, j);
    }
  }

  render(stateSpace);
}, 100);
