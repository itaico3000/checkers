class BoardData {
  constructor(pieces) {
    this.pieces = pieces; //array of all pieces
  }
  //
  //
  // Returns piece in row, col, or undefined if not exists.
  getPiece(row, col) {
    for (const piece of this.pieces) {
      if (row === piece.row && col === piece.col) {
        return piece;
      }
    }
  }

  //
  //
  //changes the location in the array
  changeLocation(lastPiece, row, col) {
    let remove = this.getPiece(lastPiece.row, lastPiece.col);
    let lastMove = [lastPiece.row, lastPiece.col];
    remove.row = row;
    remove.col = col;

    return lastMove;
  }
  //
  //
  //remove piece from the array
  removePiece(eatenPiece) {
    for (const piece of this.pieces) {
      if (eatenPiece !== undefined && eatenPiece === piece) {
        this.pieces.splice(this.pieces.indexOf(piece), 1);
      }
    }
  }

  //
  //
  //checks if player can win
  checkIfWon(color) {
    for (const piece of this.pieces) {
      if (piece.player === color) {
        possibleMoves = piece.getPossibleMoves();
        if (possibleMoves.length > 0) {
          return false;
        }
      }
    }
    return true;
  }
  //
  //
  //turn piece into queen
  turnIntoQueen(piece) {
    piece.type = QUEEN;
  }
}
