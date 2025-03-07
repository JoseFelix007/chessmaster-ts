
export class ChessMessage {
  private logElement: HTMLElement;

  constructor(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento con ID "${elementId}" no encontrado.`);
    }
    this.logElement = element;
  }

  public show(message: string) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    this.logElement.replaceChild(messageElement, this.logElement.childNodes[0]);
  }

  public alert(message: string) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.classList.add("alert");
    this.logElement.replaceChild(messageElement, this.logElement.childNodes[1]);
  }
}