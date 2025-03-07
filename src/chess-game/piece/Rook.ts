import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";

export class Rook extends Piece {
  constructor(color: Color) {
    super(color, PieceType.Rook);
  }

  isValidMove(move: Move, board: Board): boolean {
    const from = move.from;
    const to = move.to;

    if (!from.sameRow(to) && !from.sameCol(to)) {
      return false;
    }

    if (from.sameRow(to)) {
      const startCol = Math.min(from.col, to.col) + 1;
      const endCol = Math.max(from.col, to.col) - 1;
      for (let col = startCol; col <= endCol; col++) {
        const square = board.getSquareAt(new Position(from.row, col));
        if (!square.isEmpty()) {
          return false;
        }
      }
    }
    if (from.sameCol(to)) {
      const startRow = Math.min(from.row, to.row) + 1;
      const endRow = Math.max(from.row, to.row) - 1;
      for (let row = startRow; row <= endRow; row++) {
        const square = board.getSquareAt(new Position(row, from.col));
        if (!square.isEmpty()) {
          return false;
        }
      }
    }

    const toSquare = board.getSquareAt(to);
    return toSquare.isEmpty() || this.isEnemy(toSquare.piece!);
  }

  getValidMoves(position: Position, board: Board): Move[] {
    const validMoves: Move[] = [];

    const directions = [
      [-1, 0], [0, -1], [0, +1], [+1, 0]
    ];

    for (const [dr, dc] of directions) {
      let pos = position.addRow(dr).addCol(dc);

      while (board.isValidPosition(pos)) {
        const square = board.getSquareAt(pos);
        if (square.isEmpty()) {
          validMoves.push(new Move(position, pos));
        } else {
          if (this.isEnemy(square.piece!)) {
            validMoves.push(new Move(position, pos));
          }
          break;
        }
        pos = pos.addRow(dr).addCol(dc);
      }
    }

    return validMoves;
  }
}