/**
 * Returns the payload of a posted message.
 */
export interface MessagePayload {
    /**
     * The author of the message.
     * @readonly
     */
    author: string;
    /**
     * The content of the message.
     * @readonly
     */
    content: string;
}

/**
 * Returns the response of a message. Similar to {@link MessagePayload}.
 */
export interface MessageResponse {
    /**
     * The author of the message.
     * @readonly
     */
    author: string;
    /**
     * The content of the message.
     * @readonly
     */
    content: string;
}

export class Message {
    /**
     * The author of the message.
     * @public
     */
    public author: string
    /**
     * The content of the message.
     * @public
     */
    public content: string

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
