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

    changeLocation(lastPiece,row,col) {

        let remove = this.getPiece(lastPiece.row, lastPiece.col);
       remove.row =row;
       remove.col=col;
        // this.pieces.push(new Piece(row, col,lastPiece.player));
    
        // this.pieces.splice(this.pieces.indexOf(remove), 1);
    
        return remove;
      }
}