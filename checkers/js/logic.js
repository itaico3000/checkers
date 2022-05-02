const BOARD_SIZE = 8;
const BLUE_PLAYER = "blue";
const BROWN_PLAYER = "brown";
const piece = "Piece";
let eatenPieceLeft = [];
let eatenPieceRight = [];
let possibleEaten = [];
let savedPossibleEaten = [];
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
let attackColor = "";
let ifCanMove = false;

function getMultipleJumps(piece, fromHere, color) {
  let arr = [];
  let num = 0;
  let thisAttcker;
  let attackCol;
  let attackerRow;
  let jumpPieceCol;
  let jumpPieceRow;
  let endOfJump;
  let row = 1;
  let col = 1;
  //todo - only the current piece can do things
  console.log(fromHere);
  for (let i = 1; i < 8; i++) {
    attackerRow = piece.row + fromHere[0] + row * i; // 4 ,5
    attackCol = piece.col + fromHere[1] + col * i;
    thisAttcker = boardData.getPiece(attackerRow, attackCol);

    jumpPieceRow = piece.row + fromHere[0] + row * (i + 1);
    jumpPieceCol = piece.col + fromHere[1] + col * (i + 1);

    endOfJump = boardData.getPiece(jumpPieceRow, jumpPieceCol);
    if (
      thisAttcker !== undefined &&
      thisAttcker.player !== color &&
      endOfJump === undefined &&
      thisAttcker !== piece
    ) {
      console.log("attacker row in", attackerRow, "   ", i);
      console.log("attacker col in ", attackCol);
      console.log("end of jump row in ", jumpPieceRow);
      console.log("end of jump col  in", jumpPieceCol);

      arr.push([jumpPieceRow - piece.row, jumpPieceCol - piece.col]);
      console.log(arr);
      possibleEaten.push([attackerRow, attackCol]);
      let r = [];
      arr = arr.concat(
        getMultipleJumpsOfMultipleJumps(
          piece,
          [jumpPieceRow - piece.row, jumpPieceCol - piece.col],
          BLUE_PLAYER
        )
      );
      console.log("this is r", r);
    } else if (num === 0) {
      i = 0;
      row = -1;
      col = -1;
      num++;
      console.log("in ", i);
    } else if (num === 1) {
      row = -1;
      col = 1;
      num++;
      i = 0;
      console.log("in 2", i);
    } else if (num === 2) {
      i = 0;
      row = 1;
      col = -1;
      num++;
      console.log("in 3");
    } else if (num === 3) {
      console.log("out");
      return arr;
    }
  }
  return arr;
}

function getMultipleJumpsOfMultipleJumps(piece, fromHere, color) {
  let arr = [];
  let num = 0;
  let thisAttcker;
  let attackCol;
  let attackerRow;
  let jumpPieceCol;
  let jumpPieceRow;
  let endOfJump;
  let row = 1;
  let col = 1;
  //todo - only the current piece can do things
  console.log(fromHere);
  for (let i = 1; i < 8; i++) {
    attackerRow = piece.row + fromHere[0] + row * i; // 4 ,5
    attackCol = piece.col + fromHere[1] + col * i;
    thisAttcker = boardData.getPiece(attackerRow, attackCol);

    jumpPieceRow = piece.row + fromHere[0] + row * (i + 1);
    jumpPieceCol = piece.col + fromHere[1] + col * (i + 1);
    Jump = boardData.getPiece(jumpPieceRow, jumpPieceCol);
    if (
      thisAttcker !== undefined &&
      thisAttcker.player !== color &&
      endOfJump === undefined &&
      thisAttcker !== piece
    ) {
      arr.push([jumpPieceRow - piece.row, jumpPieceCol - piece.col]);
      possibleEaten.push([attackerRow, attackCol]);
    } else if (num === 0) {
      i = 0;
      row = -1;
      col = -1;
      num++;
      console.log("in r", i);
    } else if (num === 1) {
      row = -1;
      col = 1;
      num++;
      i = 0;
      console.log("in r", i);
    } else if (num === 2) {
      i = 0;
      row = 1;
      col = -1;
      num++;
      console.log("in r3");
    } else if (num === 3) {
      console.log("out r");
      return arr;
    }
  }
  return arr;
}

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

    if (possibleMoves !== savedPossibleMoves) {
      eatenPieceLeft = [];
      eatenPieceRight = [];
    }
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
    // if (savedPiece!==undefined &&piece!==undefined) {

    // }
  }

  removeCellClasses();

  selectedCell = event.currentTarget;

  selectedCell.classList.add("selected");
  let piece = boardData.getPiece(row, col);
  console.log(piece);

  addPossibleOptions(piece, turn);

  ifCanMove = canMovePiece(savedPossibleMoves, row, col, savedPiece);

  console.log(possibleEaten, "this is");
  console.log(savedPossibleEaten, "this is saved");

  if (ifCanMove) {
    turn += movePiece(savedPossibleMoves, row, col, savedPiece);

    if (lastTurn % 2 == 0) {
      attackColor = BROWN_PLAYER;
    } else {
      attackColor = BLUE_PLAYER;
    }
    if (turn > lastTurn) {
      let direction = witchDirection(lastRow, lastCol, savedPiece);
      // eatPiece(savedPossibleEaten, attackColor, direction, lastCol);
    }
    console.log("this is turn!!!!!!!!!!!!!!!1", turn);

    checkIfWinner();
    selectedCell = undefined;
  }

  if (piece !== undefined && possibleMoves !== undefined) {
    savedPiece = piece;
    savedPossibleMoves = possibleMoves;
    savedPossibleEaten = possibleEaten;
    piece = undefined;
    possibleMoves = undefined;
    possibleEaten = [];
  }
  lastTurn = turn;
  lastcell = selectedCell;
  savePieces = [];
  lastCol = col;
  lastRow = row;
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
function canMovePiece(savedPossibleMoves, row, col, savedPiece) {
  let a = false;
  for (const i of savedPossibleMoves) {
    if (i !== undefined && i[0] === row && i[1] === col) {
      // if (savePieces.length > 0 && savePieces[0] !== null) {
      //   let cell = table.rows[i[0]].cells[i[1]].append(savePieces.pop());
      //   cell = table.rows[i[0]].cells[i[1]];
      //   boardData.changeLocation(savedPiece, row, col);

      //   return true;
      // }
      return true;
    }
  }
  return a;
}

function movePiece(savedPossibleMoves, row, col, savedPiece) {
  for (const i of savedPossibleMoves) {
    if (i !== undefined && i[0] === row && i[1] === col) {
      if (savePieces.length > 0 && savePieces[0] !== null) {
        let cell = table.rows[i[0]].cells[i[1]].append(savePieces.pop());
        cell = table.rows[i[0]].cells[i[1]];
        boardData.changeLocation(savedPiece, row, col);

        return 1;
      }
    }
  }
}

//eats a piece , removes the piece from the board

function eatPiece(savedPossibleEaten, attackColor, direction, lastCol) {
  for (const possible of savedPossibleEaten) {
    let piece = boardData.getPiece(possible[0], possible[1]);
    if (
      piece !== undefined &&
      piece.player === attackColor &&
      direction === "left" &&
      lastCol > piece.col
    ) {
      boardData.removePiece(piece);
      removeCellPieces();
    } else if (
      piece !== undefined &&
      piece.player === attackColor &&
      direction === "right" &&
      lastCol < piece.col
    ) {
      boardData.removePiece(piece);
      removeCellPieces();
    }
  }
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
      result.push(new Piece(3, i, BROWN_PLAYER));
      result.push(new Piece(5, i, BROWN_PLAYER));
    } else {
      result.push(new Piece(0, i, BLUE_PLAYER));
      result.push(new Piece(2, i, BLUE_PLAYER));
      //result.push(new Piece(6, i, BROWN_PLAYER));
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
