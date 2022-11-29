import { EventEmitter, WebSocket } from "ws";
import { Message, MessageResponse } from "./types/message";

const DEFAULT_REST_URL = "https://eludris.tooty.xyz/"
const DEFAULT_WS_URL = "wss://eludris.tooty.xyz/ws/"

interface BotOptions {
    gatewayURL?: string;
    restURL?: string;
}

export class Bot extends EventEmitter {
    public name: string;
    private options?: BotOptions;
    public ws: WebSocket;
    public rest: string;

    /**
     * The main bot class.
     * @param name The desired name of the bot.
     * @param options The options for the bot.
     */
    constructor(name: string, options?: BotOptions) {
        super();
        this.name = name
        this.options = options
        this.ws = new WebSocket(this.options?.gatewayURL || DEFAULT_WS_URL);
        this.rest = this.options?.restURL || DEFAULT_REST_URL;
    }

    /**
     * Connects to the Eludris gateway.
     */
    connect() {
        this.ws.on("open", () => {
            this.emit("ready");
        })

        this.ws.on("message", (data) => {
            this.emit("message", data);
        })

        this.ws.on("close", (code, reason) => {
            this.emit("close", code, reason);
        })

        this.ws.on("error", (error) => {
            this.emit("error", error);
        })
    }

    /**
     * Closes the connection to the Eludris gateway.
     */
    close() {
        if (this.ws.OPEN) {
            this.ws.close();
        }
    }

    /**
     * A private function to create messages.
     * @param message The message to create
     */
    private async createMessage(message: Message): Promise<MessageResponse> {
        const response = await fetch(`${this.rest}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        })

        return response.json() as Promise<MessageResponse>;
    }

    /**
     * Send a message to Eludris.
     * @param content The content of the message.
     */
    async sendMessage(content: string): Promise<MessageResponse> {
        return await this.createMessage(new Message(this.name, content));
    }

    /**
     * Send a message to Eludris. (Alias for sendMessage)
     * @param content The content of the message.
     */
    async send(content: string): Promise<MessageResponse> {
        return await this.sendMessage(content);
    }

}