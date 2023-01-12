export declare function Evangeline(author: string, options?: BotOptions): Bot

export interface BotOptions {
    gatewayURL?: string;
    restURL?: string;
}

export interface MessagePayload {
    author: string;
    content: string;
}

export interface MessageResponse {
    author: string;
    content: string;
}

export class Message {
    public author: string
    public content: string

    constructor(author: string, content: string);
}

export class Bot {
    public author: string
    private options?: BotOptions
    public ws: WebSocket
    public rest: string
    constructor(author: string, options?: BotOptions);
}

export type MessageType = MessagePayload | MessageResponse;