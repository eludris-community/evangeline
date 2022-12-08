export declare function Evangeline(name: string, options?: BotOptions): Bot

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
    public name: string
    private options?: BotOptions
    public ws: WebSocket
    public rest: string
    constructor(name: string, options?: BotOptions);
}

export type MessageType = MessagePayload | MessageResponse;