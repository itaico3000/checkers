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
    let arr = [];
    eatenPieceLeft = [];
    eatenPieceRight = [];
    let ifCanEatRight = false;
    let ifCanEatLeft = false;
    let CanContinueLeft = false;
    let CanContinueRight = false;
    result = result.concat(this.ifCanMove(result, BLUE_PLAYER, 1, -1));
    ifCanEatLeft = this.ifCanContinueLeft(BLUE_PLAYER, 1, -1);
    CanContinueLeft = this.ifCanEat(result, ifCanEatLeft, 2, -2);
    // if (CanContinueLeft&&ifCanEatLeft) {
    //     ifCanEatRight = false;
    //     ifCanEatLeft=false;
    //     //arr =arr.concat(getMultipleJumps(this,result[result.length-1],BLUE_PLAYER));
    //     console.log('this is all the poosible moves ', arr);
    // }

    result = result.concat(this.ifCanMove(result, BLUE_PLAYER, 1, 1));
    ifCanEatRight = this.ifCanContinueRight(BLUE_PLAYER, 1, 1);

    CanContinueRight = this.ifCanEat(result, ifCanEatRight, 2, 2);

    if (CanContinueLeft && ifCanEatLeft) {
      let e = eatenPieceLeft.pop();
      possibleEaten.push([e[0], e[1]]);
    }
    if (CanContinueRight && ifCanEatRight) {
      let e = eatenPieceRight.pop();
      possibleEaten.push([e[0], e[1]]);
    }

    return result;
  }

  //returns array of brown piece possible moves
  getBrownPieceRelativeMoves() {
    possibleEaten = [];
    let result = [];
    eatenPieceLeft = [];
    eatenPieceRight = [];
    let ifCanEatRight = false;
    let ifCanEatLeft = false;
    let CanContinueLeft = false;
    let CanContinueRight = false;
    result = result.concat(this.ifCanMove(result, BROWN_PLAYER, -1, -1));
    ifCanEatLeft = this.ifCanContinueLeft(BROWN_PLAYER, -1, -1);
    CanContinueLeft = this.ifCanEat(result, ifCanEatLeft, -2, -2);
    if (CanContinueLeft && ifCanEatLeft) {
      let e = eatenPieceLeft.pop();
      possibleEaten.push([e[0], e[1]]);
    }
    result = result.concat(this.ifCanMove(result, BROWN_PLAYER, -1, 1));
    ifCanEatRight = this.ifCanContinueRight(BROWN_PLAYER, -1, 1);

    CanContinueRight = this.ifCanEat(result, ifCanEatRight, -2, 2);

    if (CanContinueRight && ifCanEatRight) {
      let e = eatenPieceRight.pop();
      possibleEaten.push([e[0], e[1]]);
    }

    return result;
  }

  //removes the option from possible moves if he cant eat
  ifCanEat(result, ifCanEatRight, row, col) {
    let e = true;
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
          e = false;
        }
      }
    }
    return e;
  }




  ifCanMove(result, color, row, col) {
    let currentPiece;
    result.push([row, col]);
    let a = result.length - 1;
    if (result !== undefined) {
      currentPiece = boardData.getPiece(
        this.row + result[a][0],
        this.col + result[a][1]
      );
    }

    if (currentPiece !== undefined && currentPiece.player !== color) {
      result.pop();
    } else if (currentPiece !== undefined) {
      result.pop();
    }
    return result;
  }




  ifCanContinueLeft(color, row, col) {
    let currentPiece;
    let a = false;
    currentPiece = boardData.getPiece(this.row + row, this.col + col);

    if (currentPiece !== undefined && currentPiece.player !== color) {
      a = true;
      eatenPieceLeft.push([currentPiece.row, currentPiece.col]);
    }
    return a;
  }





  ifCanContinueRight(color, row, col) {
    let currentPiece;
    let a = false;
    currentPiece = boardData.getPiece(this.row + row, this.col + col);

    if (currentPiece !== undefined && currentPiece.player !== color) {
      a = true;
      eatenPieceRight.push([currentPiece.row, currentPiece.col]);
    }
    return a;
  }
}
