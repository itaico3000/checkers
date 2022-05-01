const BOARD_SIZE = 8;
const BLUE_PLAYER = "blue";
const BROWN_PLAYER = "brown";
const piece = "Piece";
let eatenPieceLeft = [];
let eatenPieceRight = [];

let selectedCell;
let possibleMoves;
let pieces = [];
let boardData;
let savePieces = [];
let savedPiece;
let lastcell;
let savedPossibleMoves = [];
let lastRow;
let lastCol;
let turn = 0;
let lastTurn = 0;
let canEat = false;
let hasEaten;

//removes cells classes from the board
function removeCellClasses() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove("selectedoptions");
      table.rows[i].cells[j].classList.remove("selected");
    }
  }
}

//removes pieces images
function removeCellPieces() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (table.rows[i].cells[j].firstChild !== null) {
        let remove = boardData.getPiece(i, j);
        if (remove === undefined) {
          table.rows[i].cells[j].firstChild.remove("img");
        }
      }
    }
  }
}

//adds possible options
function addPossibleOptions(piece, turn) {
  if (piece !== undefined && turn % 2 === 0 && piece.player === BLUE_PLAYER) {
    possibleMoves = piece.getPossibleMoves();

    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add("selectedoptions");
    }

    return possibleMoves;
  } else if (
    piece !== undefined &&
    turn % 2 !== 0 &&
    piece.player === BROWN_PLAYER
  ) {
    possibleMoves = piece.getPossibleMoves();

    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add("selectedoptions");
    }

    return possibleMoves;
  }
}

//what happens onClick
function onCellClick(event, row, col) {
  if (selectedCell !== undefined) {
    selectedCell.classList.remove("selected");

    if (lastcell !== undefined && lastcell === selectedCell) {
      savePieces.push(lastcell.firstChild);
    }
  }

  removeCellClasses();

  selectedCell = event.currentTarget;

  selectedCell.classList.add("selected");
  let piece = boardData.getPiece(row, col);
  console.log(piece);

  addPossibleOptions(piece, turn);

  let ifMove = false;
  ifMove = movePiece(savedPossibleMoves, row, col, savedPiece);
  console.log(eatenPieceLeft, "this is left");
  console.log(eatenPieceRight, "this is right");

  if (ifMove) {
    turn++;
    hasEaten = eatPieces(savedPossibleMoves, row, col, savedPiece);
    checkIfWinner();
  
  }

  if (selectedCell!==undefined) {
    eatenPieceLeft=[];
    eatenPieceRight=[];
  }

  // if (
  //   piece !== undefined &&
  //   savedPiece !== undefined &&
  //   piece === savedPiece
  // ) {
  //   console.log(piece, "itai the king");
  //   console.log(savedPiece, "shir the king");
  // }
  //  else if (
  //   piece !== undefined &&
  //   savedPiece !== undefined &&
  //   piece !== savedPiece

  // )
  //  {
  //   console.log(piece, " the king");
  //   console.log(savedPiece, "saved piece != piece");
  //   eatenPieceLeft = [];
  //   eatenPieceRight = [];
  // }

  if (piece !== undefined && possibleMoves !== undefined) {
    savedPiece = piece;
    savedPossibleMoves = possibleMoves;
    piece = undefined;
    possibleMoves = undefined;
  }
  lastTurn = turn;
  lastcell = selectedCell;
  savePieces = [];
  lastCol = col;
  lastRow = row;

  hasEaten = false;
}

//return true if player has won
function checkIfWinner() {
  if (boardData.checkIfWon(BLUE_PLAYER)) {
    console.log("brown has won the game");
  } else if (boardData.checkIfWon(BROWN_PLAYER)) {
    console.log("blue has won the game");
  }
}

//move's a piece and return if it happen
function movePiece(savedPossibleMoves, row, col, savedPiece) {
  let a = false;
  for (const i of savedPossibleMoves) {
    if (i !== undefined && i[0] === row && i[1] === col) {
      if (savePieces.length > 0 && savePieces[0] !== null) {
        let cell = table.rows[i[0]].cells[i[1]].append(savePieces.pop());
        cell = table.rows[i[0]].cells[i[1]];
        boardData.changeLocation(savedPiece, row, col);

        return true;
      }
    }
  }
  return a;
}

function eatPieces(savedPossibleMoves, row, col, savedPiece) {
  let a = false;
  for (const i of savedPossibleMoves) {
    if (i !== undefined && i[0] === row && i[1] === col) {
      eatPiece(lastRow, lastCol, savedPiece);

      return true;
    }
  }
  return a;
}
//eats a piece , removes the piece from the board
function eatPiece(lastRow, lastCol, savedPiece) {
  let direction = witchDirection(lastRow, lastCol, savedPiece);
  if (direction === "left" && eatenPieceLeft !== undefined) {
    removeEatenPiece(eatenPieceLeft.pop());
    removeCellPieces();
    eatenPieceLeft = [];
    eatenPieceRight = [];
  } else if (direction === "right" && eatenPieceRight !== undefined) {
    removeEatenPiece(eatenPieceRight.pop());
    removeCellPieces();
    eatenPieceLeft = [];
    eatenPieceRight = [];
  }
}

//removes piece from the board
function removeEatenPiece(eatenPiece) {
  boardData.removePiece(eatenPiece);
}

//return witch direction the pawn has moved
function witchDirection(lastRow, lastCol, savedPiece) {
  let col = savedPiece.col;
  if (col < lastCol) {
    return "left";
  } else {
    return "right";
  }
}

//puts all pieces on the board
function getInitialPieces() {
  let result = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i % 2 == 0) {
      result.push(new Piece(1, i, BLUE_PLAYER));
      result.push(new Piece(5, i, BROWN_PLAYER));
      result.push(new Piece(7, i, BROWN_PLAYER));
    } else {
      result.push(new Piece(0, i, BLUE_PLAYER));
      result.push(new Piece(2, i, BLUE_PLAYER));
      result.push(new Piece(6, i, BROWN_PLAYER));
    }
  }

  return result;
}

//adds images to the board
function addImage(cell, player, name) {
  if (player === undefined) {
  } else {
    const image = document.createElement("img");
    image.src = "images/" + player + "-" + piece + ".png";
    image.id = player + "-" + name;
    cell.appendChild(image);
  }
}

//creates the board
function createBoard() {
  // Create empty board HTML:
  table = document.createElement("table");
  document.body.appendChild(table);
  // table.classList.add("animate__animated");
  // table.classList.add("animate__fadeInUpBig");

  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.className = "light-cell";
      } else {
        cell.className = "dark-cell";
      }
      cell.addEventListener("click", (event) => onCellClick(event, row, col));
    }
  }

  //Create list of pieces (32 total)
  boardData = new BoardData(getInitialPieces());
  pieces = getInitialPieces();

  // Add pieces images to board
  for (let piece of boardData.pieces) {
    const cell = table.rows[piece.row].cells[piece.col];
    addImage(cell, piece.player, piece.type);
  }
}

window.addEventListener("load", createBoard);
