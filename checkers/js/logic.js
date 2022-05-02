const BOARD_SIZE = 8;
const BLUE_PLAYER = "blue";
const BROWN_PLAYER = "brown";
const piece = "Piece";
let eatenPieceLeft;
let eatenPieceRight;
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
let attackColor = BROWN_PLAYER;
let ifCanMove = false;
let firstJump;
let secondJump;
let saveIfHasEaten;
let hasEaten;
let saveCell;
let count = 3;
let countEating = 0;

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
  let direction = [];
  firstJump = [piece.row + fromHere[0], piece.col + fromHere[1]];

  //todo - only the current piece can do things
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
      arr.push([jumpPieceRow, jumpPieceCol]);

      secondJump = [jumpPieceRow, jumpPieceCol];
      // possibleEaten.push([attackerRow, attackCol]);

      arr = arr.concat(
        getMultipleJumpsOfMultipleJumps(
          piece,
          [jumpPieceRow - piece.row, jumpPieceCol - piece.col],
          BLUE_PLAYER
        )
      );
    } else if (num === 0) {
      i = 0;
      row = -1;
      col = -1;
      num++;
    } else if (num === 1) {
      row = -1;
      col = 1;
      num++;
      i = 0;
    } else if (num === 2) {
      i = 0;
      row = 1;
      col = -1;
      num++;
    } else if (num === 3) {
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
      arr.push([jumpPieceRow, jumpPieceCol]);
      // possibleEaten.push([attackerRow, attackCol]);
    } else if (num === 0) {
      i = 0;
      row = -1;
      col = -1;
      num++;
    } else if (num === 1) {
      row = -1;
      col = 1;
      num++;
      i = 0;
    } else if (num === 2) {
      i = 0;
      row = 1;
      col = -1;
      num++;
    } else if (num === 3) {
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

function filterAfterEating(possibleMoves, piece) {
  let arr = [];
  for (let i = 0; i < possibleMoves.length; i++) {
    let row = possibleMoves[i][0];
    let col = possibleMoves[i][1];

    if (row - piece.row === 1 || row - piece.row === -1) {
      possibleMoves.splice(i, 1);
      i--;
    }
  }
  return possibleMoves;
}

//adds possible options
function addPossibleOptions(piece, turn, hasEaten, countEating) {
  if (hasEaten === true) {
    console.log("happend");
    if (piece !== undefined) {
      possibleMoves = piece.getPossibleMoves();
      if (countEating > 0) {
        possibleMoves = filterAfterEating(possibleMoves, piece);
      }
      console.log(possibleMoves, "itai ");
      if (possibleEaten.length === 0) {
        return turn++;
      }

      for (let possibleMove of possibleMoves) {
        const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];

        cell.classList.add("selectedoptions");
      }

      return possibleMoves;
    }
  } else if (
    piece !== undefined &&
    turn % 2 === 0 &&
    piece.player === BLUE_PLAYER
  ) {
    possibleMoves = piece.getPossibleMoves();
    if (countEating > 0) {
      possibleMoves = filterAfterEating(possibleMoves, piece);
    }
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
    if (countEating > 0) {
      possibleMoves = filterAfterEating(possibleMoves, piece);
    }
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
  if (hasEaten === true) {
    count = 0;
  }
  if (selectedCell !== undefined) {
    selectedCell.classList.remove("selected");

    if (lastcell !== undefined && lastcell === selectedCell) {
      savePieces.push(lastcell.firstChild);
    }
  } else {
    possibleMoves = undefined;
  }

  removeCellClasses();

  selectedCell = event.currentTarget;

  selectedCell.classList.add("selected");

  let piece = boardData.getPiece(row, col);
  console.log(piece);

  if (hasEaten === true && saveCell === selectedCell) {
    addPossibleOptions(saveIfHasEaten, turn, hasEaten, countEating);
  } else if (hasEaten === undefined) {
    addPossibleOptions(piece, turn, undefined, countEating);
  } else if (
    piece !== undefined &&
    piece.player === attackColor &&
    hasEaten === undefined
  ) {
    savedPossibleMoves = [];
    savedPossibleEaten = [];
  }

  ifCanMove = canMovePiece(savedPossibleMoves, row, col, savedPiece);

  if (ifCanMove) {
    turn += movePiece(row, col, savedPiece);
    if (lastTurn % 2 === 0) {
      let h2 = document.querySelector("h2");
      h2.innerHTML = "brown turn ";
      attackColor = BROWN_PLAYER;
      countEating = 0;
    } else if (lastTurn % 2 !== 0) {
      let h2 = document.querySelector("h2");
      h2.innerHTML = "blue turn ";
      attackColor = BLUE_PLAYER;
      countEating = 0;
    }

    if (turn > lastTurn) {
      savedPossibleMoves = [];
      let direction = witchDirection(lastRow, lastCol, savedPiece);
      hasEaten = eatPiece(savedPossibleEaten, attackColor, direction, lastCol);
      if (hasEaten) {
        saveCell = selectedCell;
        saveIfHasEaten = savedPiece;
        possibleEaten = [];
        console.log("this is the only pawn that can moves", saveIfHasEaten);
        console.log(saveCell);
        possibleMoves = saveIfHasEaten.getPossibleMoves();
        if (possibleMoves.length > 0 && possibleEaten.length > 0) {
          turn--;
          console.log("possible eaten ", possibleEaten);
          countEating++;
          console.log("numbers of eating ", countEating);
        }
        removeCellClasses();
        selectedCell = undefined;
        hasEaten = undefined;
      }

      possibleEaten = [];
    }

    checkIfWinner();
  }

  if (
    savedPiece !== undefined &&
    hasEaten === undefined &&
    turn === lastTurn &&
    count === 0 &&
    selectedCell.firstChild !== null
  ) {
    savedPiece.getPossibleMoves();
    if (possibleEaten.length < 1) {
      turn++;
      count = 1;
      countEating = 0;
    }
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

function movePiece(row, col, savedPiece) {
  if (savedPiece !== undefined) {
    savedPossibleMoves = savedPiece.getPossibleMoves();
  }
  for (const i of savedPossibleMoves) {
    if (
      savedPiece !== undefined &&
      i !== undefined &&
      i[0] === row &&
      i[1] === col
    ) {
      if (savePieces.length > 0 && savePieces[0] !== null) {
        let cell = table.rows[i[0]].cells[i[1]].append(savePieces.pop());
        cell = table.rows[i[0]].cells[i[1]];
        boardData.changeLocation(savedPiece, row, col);
      }
    }
  }
  if (savePieces.length === 0) {
    return 1;
  }
  return 0;
}

//eats a piece , removes the piece from the board

function eatPiece(savedPossibleEaten, attackColor, direction, lastCol) {
  for (const possible of savedPossibleEaten) {
    let piece = boardData.getPiece(possible[0], possible[1]);
    console.log(piece, "this is piece");
    console.log(possible, "this is possible");

    console.log(lastCol, " this is last col");
    console.log(direction, " this is dircetion");
    console.log(attackColor, " this is color");

    if (
      piece !== undefined &&
      piece.player === attackColor &&
      direction === "left" &&
      lastCol > piece.col
    ) {
      boardData.removePiece(piece);
      removeCellPieces();
      return true;
    } else if (
      piece !== undefined &&
      piece.player === attackColor &&
      direction === "right" &&
      lastCol < piece.col
    ) {
      boardData.removePiece(piece);
      removeCellPieces();
      return true;
    }
  }
}

//return witch direction the pawn has moved
function witchDirection(lastRow, lastCol, savedPiece) {
  let col = savedPiece.col;
  let row = savedPiece.row;
  console.log("this is saved piece ", savedPiece);
  if (col < lastCol) {
    return "left";
  } else {
    return "right";
  }
}

function witchDirectionHeWent(lastRow, lastCol, savedPiece) {
  let col = savedPiece.col;
  let row = savedPiece.row;
  let direction;

  if (col < lastCol) {
    direction = "left";
  } else {
    direction = "right";
  }
  direction += "-";
  if (row < lastRow) {
    direction = "down";
  } else {
    direction = "up";
  }
}

//puts all pieces on the board
function getInitialPieces() {
  let result = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i % 2 == 0) {
      result.push(new Piece(1, i, BLUE_PLAYER));
      result.push(new Piece(7, i, BROWN_PLAYER));
      result.push(new Piece(5, i, BROWN_PLAYER));
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
