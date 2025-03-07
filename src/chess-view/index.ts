import { pieces } from "./pieces.js";

interface Position {
  row: number;
  col: number;
};
interface Move {
  from: Position,
  to: Position
};
type moveCallback = (move: Move) => void;
type validMovesCallback = (position: Position) => Move[];
type onStartCallback = (player1: string, pĺayer2: string) => void;
type onResetCallback = () => void;

const SQUARE_CLASS = 'square';
const PIECE_CLASS = 'piece';
const HIGHLIGHT_CLASS = 'highlight';

const isSquare = (el: HTMLElement) => el.classList.contains(SQUARE_CLASS);
const isPiece = (el: HTMLElement) => el.classList.contains(PIECE_CLASS);
const getSquare: (squareElement: HTMLElement) => Position = (squareElement: HTMLElement) => {
  if (!squareElement.dataset.row || !squareElement.dataset.col) {
    throw new Error(`Elemento con dataset erróneo.`);
  }

  return {
    row: parseInt(squareElement.dataset.row),
    col: parseInt(squareElement.dataset.col)
  }
};

export class ChessView {

  private boardElement: HTMLElement;
  private onMoveCallback: moveCallback | null = null;
  private onValidMovesCallback: validMovesCallback | null = null;
  private draggedPiece: HTMLElement | null = null;
  private sourceSquare: HTMLElement | null = null;
  private hoveredSquare: HTMLElement | null = null;

  constructor(elementId: string, board: string[]) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento con ID "${elementId}" no encontrado.`);
    }
    this.boardElement = element;
    this.render(board);

    this.initializeBoard();
    this.setupGlobalHandlers();
  }

  public render(board: string[]): void {
    this.boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.createSquareElement(row, col, board[row][col]);
        this.boardElement.appendChild(square);
      }
    }
  }

  public reset(board: string[]): void {
    this.render(board);
  }

  private createSquareElement(row: number, col: number, piece: string): HTMLElement {
    const squareElement = document.createElement("div");
    squareElement.className = `${SQUARE_CLASS} ${((row + col) % 2 === 0 ? "white" : "black")}`;
    squareElement.dataset.row = row.toString();
    squareElement.dataset.col = col.toString();

    if (piece !== ".") {
      const pieceElement = this.createPieceElement(piece);
      squareElement.appendChild(pieceElement);
    }

    return squareElement;
  }

  private createPieceElement(piece: string): HTMLElement {
    const pieceElement = document.createElement('img');
    pieceElement.src = `images/${pieces[piece]}.svg`;
    pieceElement.alt = pieces[piece];
    pieceElement.className = PIECE_CLASS;
    pieceElement.draggable = true;
    pieceElement.dataset.piece = piece;

    return pieceElement;
  }

  private initializeBoard(): void {
    this.boardElement.addEventListener('dragstart', this.onDragStart.bind(this));
    this.boardElement.addEventListener('dragover', this.onDragOver.bind(this));
    this.boardElement.addEventListener('drop', this.onDrop.bind(this));
  }

  private setupGlobalHandlers(): void {
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.draggedPiece && this.sourceSquare) {
        this.draggedPiece.style.display = 'block';
        this.draggedPiece = null;
        this.sourceSquare = null;
      }
    });
  }

  public onStart(callback: onStartCallback): void {
    const startGame = document.getElementById('start-game')!;

    startGame.addEventListener("click", (e: Event) => {
      const white = document.getElementById('player-white')! as HTMLInputElement;
      const black = document.getElementById('player-black')! as HTMLInputElement;
      const whiteName = white.value;
      const blackName = black.value;
      white.disabled = true;
      black.disabled = true;

      startGame.classList.add("hidden");

      callback(whiteName, blackName);
    });
  }

  public onReset(callback: onResetCallback): void {
    const resetGame = document.getElementById('reset-game')!;
    resetGame.addEventListener("click", (e: Event) => {
      const startGame = document.getElementById('start-game')!;
      startGame.classList.remove("hidden");

      const white = document.getElementById('player-white')! as HTMLInputElement;
      const black = document.getElementById('player-black')! as HTMLInputElement;

      white.disabled = false;
      black.disabled = false;

      callback();
    });
  }

  public onMove(callback: moveCallback): void {
    this.onMoveCallback = callback;
  }

  public onValidMoves(callback: validMovesCallback): void {
    this.onValidMovesCallback = callback;
  }

  private onDragStart(e: DragEvent): void {
    const target = e.target && e.target as HTMLElement;
    if (!target || !isPiece(target)) {
      return;
    }
    this.draggedPiece = target;
    this.sourceSquare = target.parentElement;
    setTimeout(() => target.style.display = 'none', 0);

    const sourcePosition = getSquare(this.sourceSquare!);
    const validMoves = this.onValidMovesCallback!(sourcePosition);
    console.log(validMoves);
    for (const move of validMoves) {
      const targetSquare = this.getSquareElement(move.to.row, move.to.col);
      if (targetSquare) {
        targetSquare.classList.add('valid-move');
      }
    }
  }

  private onDragOver(e: DragEvent): void {
    e.preventDefault();
    const target = e.target && e.target as HTMLElement;
    if (!target) {
      return;
    }

    const square = isPiece(target) ? target.parentElement : target;

    if (square && isSquare(square) && square !== this.hoveredSquare) {
      this.hoveredSquare?.classList.remove(HIGHLIGHT_CLASS);
      square.classList.add(HIGHLIGHT_CLASS);
      this.hoveredSquare = square;
    }
  }

  private onDrop(e: DragEvent): void {
    e.preventDefault();

    if (this.hoveredSquare) {
      this.hoveredSquare.classList.remove(HIGHLIGHT_CLASS);
      this.hoveredSquare = null;
    }
    const squares = this.boardElement.querySelectorAll('.square');
    squares.forEach(square => square.classList.remove('valid-move'));

    const target = e.target && e.target as HTMLElement;
    if (!target || !this.draggedPiece || !this.sourceSquare) {
      return;
    }

    const square = isPiece(target) ? target.parentElement : target;
    if (square && isSquare(square) && square !== this.sourceSquare) {
      const move: Move = {
        from: getSquare(this.sourceSquare),
        to: getSquare(square)
      };
      this.onMoveCallback?.(move);
    }

    this.draggedPiece.style.display = 'block';
    this.draggedPiece = null;
    this.sourceSquare = null;
  }

  public handleMoves(moves: Move[]): void {
    for (const move of moves) {
      this.updateBoardOnMove(move);
    }
  }

  public updateBoardOnMove(move: Move): void {
    const fromSquare = this.getSquareElement(move.from.row, move.from.col);
    const toSquare = this.getSquareElement(move.to.row, move.to.col);

    if (!fromSquare || !toSquare) return;

    const pieceElement = fromSquare.querySelector(`.${PIECE_CLASS}`);
    if (!pieceElement) return;

    toSquare.querySelector(`.${PIECE_CLASS}`)?.remove();
    toSquare.appendChild(pieceElement);
  }

  private getSquareElement(row: number, col: number): HTMLElement | null {
    return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }
}