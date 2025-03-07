import { Color } from "./Color.js";
import { Move } from "./Move.js";
import { Piece } from "./piece/Piece.js";
import { PieceBuilder } from "./piece/PieceBuilder.js";
import { PieceType } from "./piece/PieceType.js";
import { Position } from "./Position.js";
import { Square } from "./Square.js";

const _initialBoard = [
  "rnbqkbnr",
  "pppppppp",
  "........",
  "........",
  "........",
  "........",
  "PPPPPPPP",
  "RNBQKBNR"
];

export class Board {
  private squares: Square[][];

  constructor(initialBoard: string[] | null = null) {
    this.squares = this.getBoardFromString(initialBoard ?? _initialBoard);
  }

  reset(): void {
    this.squares = this.getBoardFromString(_initialBoard);
  }

  public toArray() {
    let board: string[] = [];
    for (let row = 0; row < 8; row++) {
      board[row] = "";
      for (let col = 0; col < 8; col++) {
        const square = this.squares[row][col];
        board[row] += square.piece ? square.piece.toString() : '.';
      }
    }
    return board;
  }

  private getBoardFromString(board: string[]): Square[][] {
    return board.map((row, r) =>
      row.split('').map((symbol: string, c) => {
        let piece: Piece | null = null;
        if (symbol !== '.') {
          piece = PieceBuilder.getPieceFromSymbol(symbol);
        }
        const position = new Position(r, c);
        return new Square(position, piece);
      })
    );
  }

  getSquareAt(position: Position): Square {
    return this.squares[position.row][position.col];
  }

  setSquareAt(position: Position, piece: Piece): void {
    this.squares[position.row][position.col].piece = piece;
  }

  isValidPosition(position: Position): boolean {
    return (position.row >= 0 && position.row < 8) && (position.col >= 0 && position.col < 8);
  }

  movePiece(move: Move, markMove = true): Piece | null {
    const fromSquare = this.getSquareAt(move.from)!;
    const toSquare = this.getSquareAt(move.to)!;

    const piece = fromSquare.piece;
    const capture = toSquare.piece;
    if (markMove) {
      piece?.move();
    }

    fromSquare.piece = null;
    toSquare.piece = piece;

    return capture;
  }

  isSquareUnderAttack(position: Position, color: Color): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.squares[row][col];
        const piece = square.piece;

        if (!piece || piece.color === color) continue;

        const move = new Move(new Position(row, col), position);
        if (piece.isValidMove(move, this)) {
          return true;
        }
      }
    }

    return false;
  }

  findPiecePosition(pieceType: PieceType, color: Color): Position | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const position = new Position(row, col);
        const square = this.getSquareAt(position);
        if (square.piece && square.piece.type === pieceType && square.piece.color === color) {
          return position;
        }
      }
    }
    return null;
  }

  clone(): Board {
    return new Board(this.toArray());
  }
}