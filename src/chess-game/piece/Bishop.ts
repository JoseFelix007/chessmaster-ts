import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";

export class Bishop extends Piece {
  constructor(color: Color) {
    super(color, PieceType.Bishop);
  }

  isValidMove(move: Move, board: Board): boolean {
    const from = move.from;
    const to = move.to;

    if (Math.abs(from.row - to.row) !== Math.abs(from.col - to.col)) {
      return false;
    }

    const dr = to.row > from.row ? +1 : -1;
    const dc = to.col > from.col ? +1 : -1;
    let pos = from.addRow(dr).addCol(dc);

    while (!pos.equals(to)) {
      const square = board.getSquareAt(pos);
      if (!square.isEmpty()) {
        return false;
      }
      pos = pos.addRow(dr).addCol(dc);
    }

    const toSquare = board.getSquareAt(to);
    return toSquare.isEmpty() || this.isEnemy(toSquare.piece!);
  }

  getValidMoves(position: Position, board: Board): Move[] {
    const validMoves: Move[] = [];
    const directions = [
      [-1, -1], [-1, +1], [+1, -1], [+1, +1]
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