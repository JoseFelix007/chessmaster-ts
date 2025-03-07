import { Position, PositionJSON } from "./Position.js";

export interface MoveJSON {
  from: PositionJSON,
  to: PositionJSON
};

export class Move {
  private _from: Position;
  private _to: Position;

  constructor(from: Position, to: Position) {
    this._from = from;
    this._to = to;
  }

  get from(): Position {
    return this._from;
  }

  get to(): Position {
    return this._to;
  }

  get value(): MoveJSON {
    return { from: this._from, to: this._to };
  }

  public static fromJSON(move: MoveJSON): Move {
    return new Move(
      new Position(move.from.row, move.from.col),
      new Position(move.to.row, move.to.col),
    );
  }

  public opposite(): Move {
    return new Move(this._to, this._from);
  }
}