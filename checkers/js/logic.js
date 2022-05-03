const BOARD_SIZE = 8;
const BLUE_PLAYER = "blue";
const BROWN_PLAYER = "brown";
const piece = "Piece";
const QUEEN = "queen";
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
let lastType;

//
//
//whiteArrow - check by direction if there any possible moves
function whiteArrow(piece, row, col, color) {
  let arr = [];
  for (let i = 1; i < 8; i++) {
    let currentRow = piece.row + row * i; // 3-3 - 4-3
    let currentCol = piece.col + col * i;
    let thisPiece = boardData.getPiece(currentRow, currentCol);

    let currentAttackerRow = piece.row + row * (i + 1); // 3-3 - 4-3
    let currentAttackerCol = piece.col + col * (i + 1);
    let thisAttacker = boardData.getPiece(
      currentAttackerRow,
      currentAttackerCol
    );

    if (thisPiece === undefined) {
      arr.push([row * i, col * i]);
    } else if (thisPiece.player === color && thisAttacker === undefined) {
      arr.push([row * (i + 1), col * (i + 1)]);
      possibleEaten.push([currentRow, currentCol]);

      return arr;
    } else if (thisPiece) {
      return arr;
    }
  }
  return arr;
}

//
//
//return multiple jumps backwards
function getMultipleJumpBackWards(piece, row, col) {
  let arr = [];
  let thisAttcker;
  let attackCol;
  let attackerRow;
  let jumpPieceCol;
  let jumpPieceRow;
  let endOfJump;

  attackerRow = piece.row + row; // 4 ,5
  attackCol = piece.col + col;
  thisAttcker = boardData.getPiece(attackerRow, attackCol);
  jumpPieceRow = piece.row + row * 2;
  jumpPieceCol = piece.col + col * 2;
  endOfJump = boardData.getPiece(jumpPieceRow, jumpPieceCol);
  if (
    thisAttcker !== undefined &&
    thisAttcker.player !== piece.color &&
    endOfJump === undefined &&
    thisAttcker !== piece
  ) {
    arr.push([jumpPieceRow - piece.row, jumpPieceCol - piece.col]);
    possibleEaten.push([attackerRow, attackCol]);
  }
  return arr;
}

//
//
//removes cells classes from the board
function removeCellClasses() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove("selectedoptions");
      table.rows[i].cells[j].classList.remove("selected");
      if (table.rows[i].cells[j].classList.firstChild !== undefined) {
        table.rows[i].cells[j].classList.firstChild.remove("faded-piece");
      }
    }
  }
  let h2 = document.querySelector("h2");
  h2.classList.remove("faded");
}

//
//
//removes pieces images
function removeCellPieces() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (table.rows[i].cells[j].firstChild !== null) {
        let remove = boardData.getPiece(i, j);
        if (remove === undefined) {
          table.rows[i].cells[j].firstChild.remove("img");
        } else {
          table.rows[i].cells[j].firstChild.classList.remove("faded");
        }
      }
    }
  }
  let h2 = document.querySelector("h2");
  h2.classList.remove("animate__zoomIn");
}

//
//
//filter moves the you cant do after eating
function filterAfterEating(possibleMoves, piece) {
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

//
//
//adds possible options
function addPossibleOptions(piece, turn, countEating) {
  if (piece !== undefined && turn % 2 === 0 && piece.player === BLUE_PLAYER) {
    possibleMoves = piece.getPossibleMoves();
    console.log(piece);
    if (countEating > 0) {
      ifQueenAndHasEaten(piece);

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
      possibleMoves = piece.getPossibleMoves();
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

//
//
//what happens onClick
function onCellClick(event, row, col) {
  if (selectedCell !== undefined) {
    selectedCell.classList.remove("selected");

    if (lastcell !== undefined && lastcell === selectedCell) {
      //sava the picture for later (if he can eat)
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

  if (saveCell === selectedCell) {
    //only the piece that has eaten can continuo
    addPossibleOptions(saveIfHasEaten, turn, countEating);
  } else if (saveCell !== selectedCell && countEating > 0) {
  } else {
    //Everybody can continuo
    addPossibleOptions(piece, turn, countEating);
  }

  ifCanMove = canMovePiece(savedPossibleMoves, row, col);

  if (ifCanMove) {
    // attackColor = onTurn(lastTurn, savedPiece);

    turn += movePiece(row, col, savedPiece);

    attackColor = onTurn(lastTurn, savedPiece, turn);

    if (turn > lastTurn) {
      savedPossibleMoves = [];
      let direction = witchDirection(lastCol, savedPiece);
      hasEaten = eatPiece(savedPossibleEaten, attackColor, direction, lastCol);

      if (hasEaten) {
        let cell = table.rows[savedPiece.row].cells[savedPiece.col];
        cell.firstChild.classList.add("faded-piece");
        saveCell = selectedCell;
        saveIfHasEaten = savedPiece;
        possibleEaten = [];
        lastType = saveIfHasEaten.type;
        saveIfHasEaten.type = "Piece";
        possibleMoves = saveIfHasEaten.getPossibleMoves();
        possibleMoves = filterAfterEating(possibleMoves, saveIfHasEaten);
        if (possibleMoves.length > 0 && possibleEaten.length > 0) {
          turn--;
          lastTurn--;
          removeCellClasses();
          countEating++;
          ifQueenAndHasEaten(saveIfHasEaten);
          console.log(saveIfHasEaten, "   2");
        } else {
          countEating = 0;
          ifQueenAndHasEaten(saveIfHasEaten);
          lastType = "";
        }

        removeCellClasses();
        selectedCell = undefined;
        hasEaten = undefined;
      }

      possibleEaten = [];
    }

    checkIfWinner();
    ChangePlayerTurnText(turn);
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

//
//
//return true if player has won
function checkIfWinner() {
  if (boardData.checkIfWon(BLUE_PLAYER)) {
    console.log("brown has won the game");
  } else if (boardData.checkIfWon(BROWN_PLAYER)) {
    console.log("blue has won the game");
  }
}

//
//
//what happens when turn occurred
function onTurn(lastTurn, savedPiece) {
  if (lastTurn % 2 === 0) {
    attackColor = BROWN_PLAYER;
    if (savedPiece.row === 7) {
      boardData.turnIntoQueen(savedPiece);
    }
  } else if (lastTurn % 2 !== 0) {
    attackColor = BLUE_PLAYER;
    if (savedPiece.row === 0) {
      boardData.turnIntoQueen(savedPiece);
    }
  }

  return attackColor;
}

//
//
//return true if piece can move
function canMovePiece(savedPossibleMoves, row, col) {
  let a = false;
  for (const i of savedPossibleMoves) {
    if (i !== undefined && i[0] === row && i[1] === col) {
      return true;
    }
  }
  return a;
}
//
//
// moves the piece and return turn++
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
        cell.firstChild.classList.add("faded-piece");
      }
    }
  }
  if (savePieces.length === 0) {
    return 1;
  }
  return 0;
}

//
//
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
      removeCellClasses();

      return true;
    } else if (
      piece !== undefined &&
      piece.player === attackColor &&
      direction === "right" &&
      lastCol < piece.col
    ) {
      boardData.removePiece(piece);
      removeCellPieces();
      removeCellClasses();
      return true;
    }
  }
}

//
//
//change h2 text
function ChangePlayerTurnText(turn) {
  if (turn % 2 === 0 && turn !== 0) {
    let h2 = document.querySelector("h2");
    // h2.classList.add("animate__animated");
    // h2.classList.add("animate__zoomIn");
    h2.classList.add("faded");

    h2.innerText = "This is blue player's turn";
  } else if (turn % 2 !== 0) {
    let h2 = document.querySelector("h2");
    // h2.classList.add("animate__animated");
    // h2.classList.add("animate__zoomIn");
    h2.classList.add("faded");

    h2.innerText = "This is brown player's turn";
  }
}
//
//
//what happens when queen eats another piece
function ifQueenAndHasEaten(piece) {
  if (countEating > 0 && piece.type === QUEEN) {
    piece.type = "Piece";
  } else if (lastType === QUEEN && countEating < 1) {
    piece.type = QUEEN;
  }
}
//
//
//return witch direction the pawn has moved
function witchDirection(lastCol, savedPiece) {
  let col = savedPiece.col;

  if (col < lastCol) {
    return "left";
  } else {
    return "right";
  }
}
//
//
//puts all pieces on the board
function getInitialPieces() {
  let result = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i % 2 == 0) {
      result.push(new Piece(1, i, BLUE_PLAYER, piece));
      result.push(new Piece(5, i, BROWN_PLAYER, piece));
      result.push(new Piece(7, i, BROWN_PLAYER, piece));
    } else {
      result.push(new Piece(0, i, BLUE_PLAYER, piece));
      result.push(new Piece(2, i, BLUE_PLAYER, piece));
      result.push(new Piece(6, i, BROWN_PLAYER, piece));
    }
  }

  return result;
}

//
//
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

//
//
//creates the board
function createBoard() {
  // Create empty board HTML:
  table = document.createElement("table");
  document.body.appendChild(table);

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
