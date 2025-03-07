import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";
import { Rook } from "./Rook.js";

export class King extends Piece {

  constructor(color: Color) {
    super(color, PieceType.King);
  }

  isValidMove(move: Move, board: Board): boolean {
    const from = move.from;
    const to = move.to;

    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    if (
      (rowDiff === 1 && colDiff === 0) ||
      (rowDiff === 0 && colDiff === 1) ||
      (rowDiff === 1 && colDiff === 1)
    ) {
      const toSquare = board.getSquareAt(to);
      return toSquare.isEmpty() || this.isEnemy(toSquare.piece!);
    }

    return this.canCastle(move, board);
  }

  getValidMoves(position: Position, board: Board): Move[] {
    const validMoves: Move[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const pos = position.addRow(dr).addCol(dc);
      if (board.isValidPosition(pos)) {
        const square = board.getSquareAt(pos);
        if (square.isEmpty() || this.isEnemy(square.piece!)) {
          validMoves.push(new Move(position, pos));
        }
      }
    }

    const castlingMoves = this.getCastlingMoves(position, board);
    validMoves.push(...castlingMoves);

    return validMoves;
  }

  private canCastle(move: Move, board: Board): boolean {
    const from = move.from;
    const to = move.to;

    if (this.hasMoved) return false;
    if (Math.abs(to.col - from.col) !== 2) return false;

    const isKingside = to.col > from.col;
    const isQueenside = to.col < from.col;

    if (!isKingside && !isQueenside) return false;

    const rookCol = isKingside ? 7 : 0;
    const direction = isKingside ? 1 : -1;

    for (let col = from.col + direction; col !== rookCol; col += direction) {
      const square = board.getSquareAt(new Position(from.row, col));
      if (!square.isEmpty()) return false;
    }

    const rookSquare = board.getSquareAt(new Position(from.row, rookCol));
    if (!rookSquare.piece || !(rookSquare.piece instanceof Rook) || rookSquare.piece.hasMoved) {
      return false;
    }

    const path = [];
    if (isKingside) {
      path.push(new Position(from.row, from.col + 1), new Position(from.row, from.col + 2));
    } else {
      path.push(new Position(from.row, from.col - 1), new Position(from.row, from.col - 2));
    }

    for (const pos of path) {
      if (board.isSquareUnderAttack(pos, this.color)) return false;
    }

    return true;
  }

  private getCastlingMoves(position: Position, board: Board): Move[] {
    const moves: Move[] = [];
    const row = this.isWhite() ? 0 : 7;

    const kingsideRook = board.getSquareAt(new Position(row, 7));
    if (
      kingsideRook.piece &&
      kingsideRook.piece instanceof Rook &&
      !kingsideRook.piece.hasMoved &&
      !this.hasMoved &&
      board.getSquareAt(new Position(row, 5)).isEmpty() &&
      board.getSquareAt(new Position(row, 6)).isEmpty() &&
      !board.isSquareUnderAttack(new Position(row, 5), this.color) &&
      !board.isSquareUnderAttack(new Position(row, 6), this.color)
    ) {
      moves.push(new Move(position, new Position(row, 6)));
    }

    const queensideRook = board.getSquareAt(new Position(row, 0));
    if (
      queensideRook.piece &&
      queensideRook.piece instanceof Rook &&
      !queensideRook.piece.hasMoved &&
      !this.hasMoved &&
      board.getSquareAt(new Position(row, 1)).isEmpty() &&
      board.getSquareAt(new Position(row, 2)).isEmpty() &&
      board.getSquareAt(new Position(row, 3)).isEmpty() &&
      !board.isSquareUnderAttack(new Position(row, 2), this.color) &&
      !board.isSquareUnderAttack(new Position(row, 3), this.color)
    ) {
      moves.push(new Move(position, new Position(row, 2)));
    }

    return moves;
  }
}