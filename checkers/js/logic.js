const BOARD_SIZE = 8;
const WHITE_PLAYER = "blue";
const BLACK_PLAYER = "brown";
const piece ='Piece';

let selectedCell;
let possibleMoves;
let pieces = [];
let boardData;
let savePieces=[];
let savedPiece;
let lastcell;
let savedPossibleMoves =[];
//removes cells classes from the board
function removeCellClasses() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove("selectedoptions");
      table.rows[i].cells[j].classList.remove("selected");

     
    }
  }

}


//adds possible options
function addPossibleOptions(piece) {
  
  if (piece !== undefined) {
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
  if (selectedCell !== undefined && lastcell !== undefined) {
    if (lastcell === selectedCell) {
     
      savePieces.push(lastcell.firstChild);
    }
  }
  if (selectedCell !== undefined) {
    selectedCell.classList.remove("selected");
  }
removeCellClasses();

  selectedCell = event.currentTarget;


  selectedCell.classList.add("selected");
   let piece = boardData.getPiece(row, col);
   console.log(piece);


  addPossibleOptions(piece);
  let ifMove = move(savedPossibleMoves,row,col,savedPiece);
  if (ifMove) {
    selectedCell=undefined;
  }
  if (piece !== undefined && possibleMoves !== undefined) {
    savedPiece = piece;
    savedPossibleMoves = possibleMoves;
  }

  console.log('this is savedPieces' , savePieces);
  lastcell = selectedCell;
  savePieces = [];
}

//move's a piece and return if it happen
function move(savedPossibleMoves,row,col,savedPiece) {
  let turn = 0;
  let a= false;
  for (const i of savedPossibleMoves) {
    // for (const k of possibleMoves) {
    if (i !== undefined && i[0] === row && i[1] === col) {
      //  if (lastcell!==undefined) {
      
      if (savePieces.length > 0 && savePieces[0] !== null) {
        let cell = table.rows[i[0]].cells[i[1]].append(savePieces.pop());
        cell = table.rows[i[0]].cells[i[1]];
       a=true;

       boardData.changeLocation(savedPiece,row,col)
      }
    }
    //}
  }
  return a;

}










//puts all pieces on the board
function getInitialPieces() {
  let result = [];

 
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i%2==0) {
      result.push(new Piece(1, i, WHITE_PLAYER));
      result.push(new Piece(5, i,  BLACK_PLAYER));
      result.push(new Piece(7, i,  BLACK_PLAYER));

    }
    else{
      result.push(new Piece(0, i, WHITE_PLAYER));
      result.push(new Piece(2 , i, WHITE_PLAYER));
      result.push(new Piece(6, i, BLACK_PLAYER));

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
    table.classList.add("animate__animated");
    table.classList.add("animate__fadeInUpBig");
  
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
  