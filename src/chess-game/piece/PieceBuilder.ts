import { Color } from "../Color.js";
import { Bishop } from "./Bishop.js";
import { King } from "./King.js";
import { Knight } from "./Knight.js";
import { Pawn } from "./Pawn.js";
import { Piece } from "./Piece.js";
import { PieceType } from "./PieceType.js";
import { Queen } from "./Queen.js";
import { Rook } from "./Rook.js";

export abstract class PieceBuilder {

  public static getPieceFromSymbol(symbol: string): Piece {
    const isUppercase = symbol === symbol.toUpperCase();
    const color = isUppercase ? Color.White : Color.Black;

    switch (symbol.toUpperCase()) {
      case PieceType.Pawn:
        return new Pawn(color);
      case PieceType.Rook:
        return new Rook(color);
      case PieceType.Knight:
        return new Knight(color);
      case PieceType.Bishop:
        return new Bishop(color);
      case PieceType.Queen:
        return new Queen(color);
      case PieceType.King:
        return new King(color);
    }

    throw new Error(`Simbolo ${symbol} no registrado`);
  }

}