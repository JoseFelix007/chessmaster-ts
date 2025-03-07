import { Piece } from "./piece/Piece.js";
import { Position } from "./Position.js";

export class Square {
  private _position: Position;
  private _piece: Piece | null;

  constructor(position: Position, piece: Piece | null = null) {
    this._position = position;
    this._piece = piece;
  }

  get piece(): Piece | null {
    return this._piece;
  }

  set piece(piece: Piece | null) {
    this._piece = piece;
  }

  get position(): Position {
    return this._position;
  }

  public isEmpty(): boolean {
    return this._piece === null;
  }
}