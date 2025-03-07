import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { Bishop } from "./Bishop.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";
import { Rook } from "./Rook.js";

export class Queen extends Piece {
  private rook: Rook;
  private bishop: Bishop;

  constructor(color: Color) {
    super(color, PieceType.Queen);
    this.rook = new Rook(color);
    this.bishop = new Bishop(color);
  }

  isValidMove(move: Move, board: Board): boolean {
    return this.rook.isValidMove(move, board) || this.bishop.isValidMove(move, board);
  }

  getValidMoves(position: Position, board: Board): Move[] {
    const rookMoves = this.rook.getValidMoves(position, board);
    const bishopMoves = this.bishop.getValidMoves(position, board);

    return [...rookMoves, ...bishopMoves];
  }
}