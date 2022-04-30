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

    if (this.player === WHITE_PLAYER) {
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
    console.log("this is absoluteMoves  ", absoluteMoves);
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
    console.log("this is filtered Moves ", filteredMoves);
    return filteredMoves;
    //return filteredMoves;
  }

  //returns array of White piece possible moves
  getBluePieceRelativeMoves() {
    let result = [];
    let a = 0;
    let ifCanEatRight = false;
    let ifCanEatLeft = false;

    result.push([1, 1]); //a 0
    let currentPiece = boardData.getPiece(
      this.row + result[0][0],
      this.col + result[0][1]
    );
    if (currentPiece !== undefined && currentPiece.player !== WHITE_PLAYER) {
      result.pop();
      a--;
      ifCanEatRight = true;
    }

    result.push([1, -1]);
    a = result.length - 1;
    if (result !== undefined) {
      currentPiece = boardData.getPiece(
        this.row + result[a][0],
        this.col + result[a][1]
      );
    }

    if (currentPiece !== undefined && currentPiece.player !== WHITE_PLAYER) {
      result.pop();
      a--;
      ifCanEatLeft = true;
    }
    this.ifBlueCanEatLeft(result, ifCanEatLeft);
    this.ifBlueCanEatRight(result, ifCanEatRight);

    console.log("this is result ", result);
    return result;
  }

  //returns array of brown piece possible moves
  getBrownPieceRelativeMoves() {
    let result = [];
    let a = 0;
    let ifCanEatRight = false;
    let ifCanEatLeft = false;

    result.push([-1, 1]); //a 0
    let OnlyIfBlack;
    let currentPiece = boardData.getPiece(
      this.row + result[0][0],
      this.col + result[0][1]
    );
    if (currentPiece !== undefined && currentPiece.player !== BLACK_PLAYER) {
      result.pop();
      a--;
      ifCanEatRight = true;
      savePieces.push(currentPiece);
    }

    result.push([-1, -1]);
    a = result.length - 1;
    if (result !== undefined) {
      currentPiece = boardData.getPiece(
        this.row + result[a][0],
        this.col + result[a][1]
      );
    }

    if (currentPiece !== undefined && currentPiece.player !== BLACK_PLAYER) {
      result.pop();
      a--;
      ifCanEatLeft = true;
      savePieces.push(currentPiece);
    }

    this.ifBrownCanEatLeft(result, ifCanEatLeft);
    this.ifBrownCanEatRight(result, ifCanEatRight);

    console.log("this is result ", result);
    return result;
  }

  ifBlueCanEatRight(result, ifCanEatRight) {
    if (ifCanEatRight) {
      result.push([2, 2]);
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

  ifBlueCanEatLeft(result, ifCanEatLeft) {
    if (ifCanEatLeft) {
      result.push([2, -2]);
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

  ifBrownCanEatRight(result, ifCanEatRight) {
    if (ifCanEatRight) {
      result.push([-2, 2]);
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
  ifBrownCanEatLeft(result, ifCanEatRight) {
    if (ifCanEatRight) {
      result.push([-2, -2]);
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
