
export interface PositionJSON {
  row: number;
  col: number;
};

export class Position {
  private _row: number;
  private _col: number;

  constructor(row: number, col: number) {
    this._row = row;
    this._col = col;
  }

  get row(): number {
    return this._row;
  }

  get col(): number {
    return this._col;
  }

  get value(): { row: number; col: number; } {
    return { row: this._row, col: this._col };
  }

  public sameCol(position: Position): boolean {
    return this._col === position._col;
  }

  public sameRow(position: Position): boolean {
    return this._row === position._row;
  }

  public equals(position: Position): boolean {
    return this.sameCol(position) && this.sameRow(position);
  }

  public addCol(col: number): Position {
    return new Position(this._row, this._col + col);
  }

  public addRow(row: number): Position {
    return new Position(this._row + row, this._col);
  }
}