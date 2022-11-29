export interface MessagePayload {
    author: string;
    content: string;
}

export interface MessageResponse {
    author: string;
    content: string;
}

export class Message {
    public author: string;
    public content: string;

    /**
     * Creates a new message.
     * @param author The author of the message.
     * @param content The content of the message.
     */
    constructor(author: string, content: string) {
        this.author = author
        this.content = content
    }
}
