let ifCanEatRight = false;
let ifCanEatLeft = false;
class Piece {

  constructor(row, col, player) {
    this.row = row;
    this.col = col;
    this.player = player;
  }

  //gets all the possible moves
  getPossibleMoves() {
    // Get relative moves

    let relativeMoves = [];

    if (this.player === BLUE_PLAYER) {
      relativeMoves = this.getBluePieceRelativeMoves();
    } else {
      relativeMoves = this.getBrownPieceRelativeMoves();
    }
    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      //check all possibilities of this.pawn
      let absoluteRow = this.row + relativeMove[0];
      let absoluteCol = this.col + relativeMove[1];

      absoluteMoves.push([absoluteRow, absoluteCol]);
    }
    // Get filtered absolute moves
    let filteredMoves = [];
    for (let absoluteMove of absoluteMoves) {
      let absoluteRow = absoluteMove[0];
      let absoluteCol = absoluteMove[1];

      if (
        absoluteRow >= 0 &&
        absoluteRow <= 7 &&
        absoluteCol >= 0 &&
        absoluteCol <= 7
      ) {
        filteredMoves.push(absoluteMove); //push this possibility
      }
    }
    return filteredMoves;
    //return filteredMoves;
  }

  //returns array of White piece possible moves
  getBluePieceRelativeMoves() {
    let result = [];
    let a = 0;
    

    result.push([1, 1]); //a 0
    let currentPiece = boardData.getPiece(
      this.row + result[0][0],
      this.col + result[0][1]
    );
    if (currentPiece !== undefined && currentPiece.player !== BLUE_PLAYER) {  
        result.pop();
      ifCanEatRight = true;
    eatenPieceRight=currentPiece; 
}
    else if(currentPiece !== undefined){
        result.pop();

    }

    result.push([1, -1]);
    a = result.length - 1;
    if (result !== undefined) {
      currentPiece = boardData.getPiece(
        this.row + result[a][0],
        this.col + result[a][1]
        
      );
    }

    if (currentPiece !== undefined && currentPiece.player !== BLUE_PLAYER) {
        result.pop();
      ifCanEatLeft = true;
      eatenPieceLeft =currentPiece;

    }
    else if(currentPiece !== undefined){
        result.pop();

    }
    this.ifCanEat(result, ifCanEatLeft,2,-2);
    this.ifCanEat(result, ifCanEatRight ,2,2);
    ifCanEatRight = false;
    ifCanEatLeft=false;

    return result;
  }

  //returns array of brown piece possible moves
  getBrownPieceRelativeMoves() {
    let result = [];
    let a = 0;
    let ifCanEatRight = false;
    let ifCanEatLeft = false;

    result.push([-1, 1]); //a 0
    let currentPiece = boardData.getPiece(
      this.row + result[0][0],
      this.col + result[0][1]
    );
    if (currentPiece !== undefined && currentPiece.player !== BROWN_PLAYER) {
      result.pop();
      ifCanEatRight = true;
      eatenPieceRight =currentPiece;
    }
    else if(currentPiece !== undefined){
        result.pop();

    }
    result.push([-1, -1]);
    a = result.length - 1;
    if (result !== undefined) {
      currentPiece = boardData.getPiece(
        this.row + result[a][0],
        this.col + result[a][1]
      );
    }

    if (currentPiece !== undefined && currentPiece.player !== BROWN_PLAYER) {
      result.pop();
      ifCanEatLeft = true;
      eatenPieceLeft =currentPiece;

    }
    else if(currentPiece !== undefined){
        result.pop();

    }
    this.ifCanEat(result, ifCanEatLeft,-2,-2);
    this.ifCanEat(result, ifCanEatRight ,-2,2);
    ifCanEatRight = false;
    ifCanEatLeft=false;
    
    return result;
  }

  //removes the option from possible moves if he cant eat
  ifCanEat(result, ifCanEatRight ,row ,col) {
    if (ifCanEatRight) {
      result.push([row, col]);
      let a = result.length - 1;
      if (result !== undefined) {
        let currentPiece = boardData.getPiece(
          this.row + result[a][0],
          this.col + result[a][1]
        );

        if (currentPiece !== undefined) {
          result.pop();
          a--;
        }
      }
    }
   
  }

 
}
