import { Board } from "../Board.js";
import { Color } from "../Color.js";
import { Move } from "../Move.js";
import { Position } from "../Position.js";
import { PieceType } from "./PieceType.js";

export abstract class Piece {
  private _color: Color;
  private _type: PieceType;
  private _hasMoved: boolean;

  constructor(color: Color, type: PieceType) {
    this._color = color;
    this._type = type;
    this._hasMoved = false;
  }

  get color(): Color {
    return this._color;
  }

  get type(): PieceType {
    return this._type;
  }

  get hasMoved(): boolean {
    return this._hasMoved;
  }

  public toString(): string {
    return this.color === Color.White ? this._type.toUpperCase() : this._type.toLowerCase();
  }

  public isWhite(): boolean {
    return this._color === Color.White;
  }

  public isEnemy(piece: Piece): boolean {
    return this._color !== piece._color;
  }

  public move(): void {
    this._hasMoved = true;
  }

  abstract isValidMove(move: Move, board: Board): boolean;
  abstract getValidMoves(position: Position, board: Board): Move[];
}