class BoardData {
    constructor(pieces) {
      this.pieces = pieces; //{1,0,rook,white}  *32
    }
  
    // Returns piece in row, col, or undefined if not exists.
    getPiece(row, col) {
      for (const piece of this.pieces) {
        if (row === piece.row && col === piece.col) {
          return piece;
        }
      }
    }

    //changes the location in the array
    changeLocation(lastPiece,row,col) {

        let remove = this.getPiece(lastPiece.row, lastPiece.col);
        let lastmove = [lastPiece.row,lastPiece.col]
       remove.row =row;
       remove.col=col;
       
        return lastmove;
      }

      //remove piece from the array
      removePiece(eatenPiece){
        for (const piece of this.pieces) {
            if (eatenPiece!==undefined&&eatenPiece===piece) {
                this.pieces.splice(this.pieces.indexOf(piece),1)
            }
          } 
      }

      checkIfWon(color){
        for (const piece of this.pieces) {
            if (piece.player===color) {

                possibleMoves=piece.getPossibleMoves();
                if (possibleMoves.length >0) {
                    return false;
                }
            }
          }
          return true;
      }

}