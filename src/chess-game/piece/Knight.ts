import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";

export class Knight extends Piece {
  constructor(color: Color) {
    super(color, PieceType.Knight);
  }

  isValidMove(move: Move, board: Board): boolean {
    const from = move.from;
    const to = move.to;

    if (
      (Math.abs(from.row - to.row) !== 2 || Math.abs(from.col - to.col) !== 1) &&
      (Math.abs(from.row - to.row) !== 1 || Math.abs(from.col - to.col) !== 2)
    ) {
      return false;
    }

    const toSquare = board.getSquareAt(to);
    return toSquare.isEmpty() || this.isEnemy(toSquare.piece!);
  }

  getValidMoves(position: Position, board: Board): Move[] {
    const validMoves: Move[] = [];

    const directions = [
      [-2, -1], [-2, +1], [-1, -2], [-1, +2], [+1, -2], [+1, +2], [+2, -1], [+2, +1]
    ];

    for (const [dr, dc] of directions) {
      const pos = position.addRow(dr).addCol(dc);
      if (!board.isValidPosition(pos)) continue;
      const square = board.getSquareAt(pos);
      if (square && (square.isEmpty() || this.isEnemy(square.piece!))) {
        validMoves.push(new Move(position, pos));
      }
    }

    return validMoves;
  }
}