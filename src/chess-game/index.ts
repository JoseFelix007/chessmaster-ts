import { Board } from "./Board.js";
import { Color } from "./Color.js";
import { GameStatus } from "./GameStatus.js";
import { Move, MoveJSON } from "./Move.js";
import { Piece } from "./piece/Piece.js";
import { PieceType } from "./piece/PieceType.js";
import { Player } from "./Player.js";
import { Position, PositionJSON } from "./Position.js";

interface MoveResult {
  done: Boolean,
  messages: string[],
  moves: MoveJSON[]
};

export class ChessGame {
  private _status: GameStatus;
  private _board: Board;
  private _turn: Player | undefined;
  private player1: Player | undefined;
  private player2: Player | undefined;

  constructor(initialBoard: string[] | null) {
    this._board = new Board(initialBoard);
    this._status = GameStatus.NOT_STARTED;
  }

  get board(): string[] {
    return this._board.toArray();
  }

  get turn(): Player {
    return this._turn!;
  }

  set turn(player: Player) {
    this._turn = player;
  }

  get playerInTurn(): string {
    return this._turn!.toString();
  }

  public reset(): void {
    this._status = GameStatus.NOT_STARTED;
    this._turn = this.player1;
    this._board.reset();
  }

  public setPlayers(player1: string, player2: string): void {
    this.player1 = new Player(player1, Color.White);
    this.player2 = new Player(player2, Color.Black);
    this._turn = this.player1;
  }

  public start(): void {
    this._status = GameStatus.IN_PROGRESS;
  }

  public finish(): void {
    this._status = GameStatus.FINISHED;
  }

  public switchTurn() {
    this.turn = this.turn.color === Color.White ? this.player2! : this.player1!;
  }

  public handleMove(_move: MoveJSON): MoveResult {
    const move = Move.fromJSON(_move);
    let done = false;
    let messages: string[] = [];
    let moves: MoveJSON[] = [];

    if (this.isValidMove(move)) {
      moves = this.makeMove(move);
      done = true;
      this.switchTurn();

      const playerInCheck = this.inCheck();
      if (playerInCheck) {
        messages.push(`${playerInCheck.name} en jaque`);
      }

      const playerInCheckmate = this.inCheckmate();
      if (playerInCheckmate) {
        messages.push(`${playerInCheckmate.name} en jaque mate`);
      }
    }

    return {
      done,
      messages,
      moves
    };
  }

  public isValidMove(move: Move): Boolean {
    const fromSquare = this._board.getSquareAt(move.from);
    if (!fromSquare.piece) return false;
    if (fromSquare.piece.color !== this.turn.color) return false;

    const simulation = this.simulateMove(move);
    return !simulation.inCheck && fromSquare.piece.isValidMove(move, this._board);
  }

  public makeMove(move: Move): MoveJSON[] {
    let moves: Move[] = [];
    moves.push(move);

    const fromSquare = this._board.getSquareAt(move.from);
    const piece = fromSquare.piece!;

    if (piece.type === PieceType.King && Math.abs(move.from.col - move.to.col) === 2) {
      const kingRow = piece.isWhite() ? 7 : 0;
      const isKingsideCastle = move.to.col > move.from.col;
      const rookCol = isKingsideCastle ? 7 : 0;
      const rookNewCol = isKingsideCastle ? 5 : 3;

      moves.push(new Move(new Position(kingRow, rookCol), new Position(kingRow, rookNewCol)));
    }

    for (const m of moves) {
      this._board.movePiece(m);
    }
    return moves.map(m => m.value);
  }

  public inCheck(): Player | null {
    const kingPosition = this._board.findPiecePosition(PieceType.King, this.turn.color);
    if (!kingPosition) {
      throw new Error("No se encontró el rey del jugador en el tablero.");
    }

    return this._board.isSquareUnderAttack(kingPosition, this.turn.color) ? this.turn : null;
  }

  public inCheckmate(): Player | null {
    if (!this.inCheck()) {
      return null;
    }

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this._board.getSquareAt(new Position(row, col));
        const piece = square.piece;

        if (!piece || piece.color !== this.turn.color) continue;

        const validMoves = piece.getValidMoves(square.position, this._board);
        for (const move of validMoves) {
          const simulation = this.simulateMove(move);
          if (!simulation.inCheck) {
            return null;
          }
        }
      }
    }

    this.finish();
    return this.turn;
  }

  private simulateMove(move: Move): { inCheck: boolean, capture: Piece | null } {
    const capture = this._board.movePiece(move, false);
    const inCheck = !!this.inCheck();
    this._board.movePiece(move.opposite(), false);
    if (capture) {
      this._board.setSquareAt(move.to, capture);
    }
    return { inCheck, capture };
  }

  public getValidMoves(position: PositionJSON): MoveJSON[] {
    if (this._status !== GameStatus.IN_PROGRESS) return [];

    const pos = new Position(position.row, position.col);
    const square = this._board.getSquareAt(pos);
    if (!square.piece) return [];
    if (square.piece.color !== this._turn?.color) return [];

    const validMoves = square.piece.getValidMoves(pos, this._board);
    return validMoves.map(m => m.value);
  }
}