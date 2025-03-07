
import { ChessView } from './chess-view/index.js';
import { ChessGame } from './chess-game/index.js';
import { ChessMessage } from './chess-message.js';

interface Position {
  row: number;
  col: number;
};
interface Move {
  from: Position,
  to: Position
};

export class ChessController {
  private view: ChessView;
  private game: ChessGame;
  private message: ChessMessage;

  constructor(elementId: string, initialBoard: string[] | null = null) {
    this.message = new ChessMessage("messages");
    this.game = new ChessGame(initialBoard);
    this.view = new ChessView(elementId, this.game.board);

    this.view.onStart((player1, player2) => {
      this.start(player1, player2);
    });

    this.view.onReset(() => {
      this.reset();
    });

    this.view.onValidMoves((position: Position) => {
      return this.game.getValidMoves(position);
    });
  }

  public start(player1: string, player2: string): void {
    this.game.setPlayers(player1, player2);
    this.game.start();
    this.message.show(`Juegan ${this.game.playerInTurn}`);

    this.view.onMove((move: Move) => {
      const result = this.game.handleMove(move);
      if (result.done) {
        this.view.handleMoves(result.moves);

        this.message.show(`Juegan ${this.game.playerInTurn}`);

        this.message.alert("");
        for (const message of result.messages) {
          this.message.alert(message);
        }
      } else {
        console.error("Movimiento no válido");
      }
    });
  }

  public reset(): void {
    this.game.reset();
    this.view.reset(this.game.board);
    this.message.show("");
    this.message.alert("");

    this.view.onMove((move: Move) => { });
  }
}