import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";

export class Pawn extends Piece {
  constructor(color: Color) {
    super(color, PieceType.Pawn);
  }

  isValidMove(move: Move, board: Board): boolean {
    const from = move.from;
    const to = move.to;

    const direction = this.isWhite() ? -1 : +1;
    const initialRow = this.isWhite() ? 6 : 1;
    const toSquare = board.getSquareAt(to);

    const isMovingForwardOne = to.sameCol(from) && to.sameRow(from.addRow(direction));
    const isMovingForwardTwoFromStart = from.row === initialRow && to.sameCol(from) && to.sameRow(from.addRow(2 * direction));
    const isCapturing = Math.abs(to.col - from.col) === 1 && to.row === from.row + direction;

    if (isMovingForwardOne) {
      return toSquare.isEmpty();
    }

    if (isMovingForwardTwoFromStart) {
      const middleSquare = board.getSquareAt(from.addRow(direction))!;
      return middleSquare.isEmpty() && toSquare.isEmpty();
    }

    if (isCapturing) {
      return !toSquare.isEmpty() && this.isEnemy(toSquare.piece!);
    }

    return false;
  }

  getValidMoves(position: Position, board: Board): Move[] {
    const validMoves: Move[] = [];
    const direction = this.isWhite() ? -1 : +1;
    const initialRow = this.isWhite() ? 6 : 1;

    const forwardOne = position.addRow(direction);
    if (board.isValidPosition(forwardOne) && board.getSquareAt(forwardOne).isEmpty()) {
      validMoves.push(new Move(position, forwardOne));
    }

    if (position.row === initialRow) {
      const forwardTwo = position.addRow(2 * direction);
      if (
        board.isValidPosition(forwardOne) && board.getSquareAt(forwardOne).isEmpty() &&
        board.isValidPosition(forwardTwo) && board.getSquareAt(forwardTwo).isEmpty()
      ) {
        validMoves.push(new Move(position, forwardTwo));
      }
    }

    const captureLeft = position.addRow(direction).addCol(-1);
    const captureRight = position.addRow(direction).addCol(+1);
    [captureLeft, captureRight].forEach(pos => {
      if (!board.isValidPosition(pos)) return;

      const square = board.getSquareAt(pos);
      if (!square.isEmpty() && this.isEnemy(square.piece!)) {
        validMoves.push(new Move(position, pos));
      }
    });

    return validMoves;
  }
}