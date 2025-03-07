import { Color } from "./Color.js";

export class Player {
  private _name: string;
  private _color: Color;

  constructor(name: string, color: Color) {
    this._name = name;
    this._color = color;
  }

  get name(): string {
    return this._name;
  }

  get color(): Color {
    return this._color;
  }

  public toString(): string {
    return `${this.isWhite() ? 'Blancas' : 'Negras'} (${this.name})`;
  }

  public isWhite(): boolean {
    return this._color === Color.White;
  }
}