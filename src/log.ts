
export class Log {
    messages: string[] = [];
    isOpen: boolean = false;

    add(message: string): void {
        this.messages.push(message);
    }

    show(): void {
        this.isOpen = true;
    }

    hide(): void {
        this.isOpen = false;
    }
}
