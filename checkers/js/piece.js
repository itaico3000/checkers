class Piece {
  constructor(row, col, player ,type) {
    this.row = row;
    this.col = col;
    this.player = player;
    this.type =type;
  }

  //gets all the possible moves
  getPossibleMoves() {
    // Get relative moves

    let relativeMoves = [];

    if (this.player === BLUE_PLAYER&&this.type ===piece) {
      relativeMoves = this.getBluePieceRelativeMoves();
    } else if(this.player === BROWN_PLAYER&&this.type ===piece) {
      relativeMoves = this.getBrownPieceRelativeMoves();
    }
    else if(this.player === BLUE_PLAYER&&this.type ===QUEEN){
        relativeMoves = this.getBlueQueenPossibleMoves();
        relativeMoves = relativeMoves.concat(this.getBluePieceRelativeMoves());
        }
        else {
            relativeMoves =this.getBrownQueenPossibleMoves();
            relativeMoves  =relativeMoves.concat(this.getBrownPieceRelativeMoves());
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
    let count = 0;
    eatenPieceLeft = [];
    eatenPieceRight = [];
    let ifCanEatRight = false;
    let ifCanEatLeft = false;
    let CanContinueLeft = false;
    let CanContinueRight = false;

    result = result.concat(this.ifCanMove(result, BLUE_PLAYER, 1, -1));
    ifCanEatLeft = this.ifCanContinueLeft(BLUE_PLAYER, 1, -1);
    CanContinueLeft = this.ifCanEat(result, ifCanEatLeft, 2, -2);

    result = result.concat(this.ifCanMove(result, BLUE_PLAYER, 1, 1));
    ifCanEatRight = this.ifCanContinueRight(BLUE_PLAYER, 1, 1);

    CanContinueRight = this.ifCanEat(result, ifCanEatRight, 2, 2);

    if (CanContinueLeft && ifCanEatLeft) {
      let e = eatenPieceLeft.pop();
      possibleEaten.push([e[0], e[1]]);
      count = 1;
    }
    if (CanContinueRight && ifCanEatRight) {
      let e = eatenPieceRight.pop();
      possibleEaten.push([e[0], e[1]]);
      count = 1;
    }

    if (countEating > 0) {
      result = result.concat(getMultipleJumpBackWards(this, -1, -1));
      result = result.concat(getMultipleJumpBackWards(this, -1, 1));
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

    if (countEating > 0) {
      result = result.concat(getMultipleJumpBackWards(this, 1, -1));
      result = result.concat(getMultipleJumpBackWards(this, 1, 1));
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


getBlueQueenPossibleMoves()
{
    let result =[];
    result = result.concat(whiteArrow(this, 1, 1 ,BROWN_PLAYER));

    result = result.concat(whiteArrow(this, -1, -1,BROWN_PLAYER));

    result = result.concat(whiteArrow(this, -1, 1,BROWN_PLAYER));

    result = result.concat(whiteArrow(this, 1, -1,BROWN_PLAYER));
    return result;
}


getBrownQueenPossibleMoves()
{
    let result =[];
    result = result.concat(whiteArrow(this, 1, 1 ,BLUE_PLAYER));

    result = result.concat(whiteArrow(this, -1, -1,BLUE_PLAYER));

    result = result.concat(whiteArrow(this, -1, 1,BLUE_PLAYER));

    result = result.concat(whiteArrow(this, 1, -1,BLUE_PLAYER));
    return result;
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

    if (
      currentPiece !== undefined &&
      currentPiece.player !== color &&
      currentPiece.row < 7
    ) {
      a = true;
      eatenPieceLeft.push([currentPiece.row, currentPiece.col]);
    }
    return a;
  }

  ifCanContinueRight(color, row, col) {
    let currentPiece;
    let a = false;
    currentPiece = boardData.getPiece(this.row + row, this.col + col);

    if (
      currentPiece !== undefined &&
      currentPiece.player !== color &&
      currentPiece.row < 7
    ) {
      a = true;
      eatenPieceRight.push([currentPiece.row, currentPiece.col]);
    }
    return a;
  }
}
