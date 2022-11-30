import { RawData, WebSocket } from 'ws'
import { EventEmitter } from 'events'
import { Message, MessageResponse } from './types/message'

const DEFAULT_REST_URL = 'https://eludris.tooty.xyz/'
const DEFAULT_WS_URL = 'wss://eludris.tooty.xyz/ws/'

interface BotOptions {
    gatewayURL?: string;
    restURL?: string;
}

export declare interface Bot {
    on(event: 'messageCreate', listener: (message: Message) => void): this;
    on(event: 'ready', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
}

export class Bot extends EventEmitter {
    public name: string
    private options?: BotOptions
    public ws: WebSocket | null = null
    public rest: string
    private interval: NodeJS.Timer | null = null;

    /**
     * The main bot class.
     * @param name The desired name of the bot.
     * @param options The options for the bot.
     */
    constructor(name: string, options?: BotOptions) {
        super()
        this.name = name
        this.options = options
        this.rest = this.options?.restURL || DEFAULT_REST_URL
    }
    
    /**
     * Connects to the Eludris gateway.
     */
    connect() {
        this.ws = new WebSocket(this.options?.gatewayURL || DEFAULT_WS_URL)
        console.log(this.ws.readyState);
        
        this.ws.on('open', () => {
            this.emit('ready')
        })

        this.ws.on('message', (data: RawData) => {
            const message = JSON.parse(data.toString()) as Message
            this.emit('messageCreate', message)
        })

        this.ws.on('close', (code: number, reason: Buffer) => {
            this.emit('close', code, reason)
        })

        this.ws.on('error', (error: Error) => {
            this.emit('error', error)
        })

        this.interval = setInterval(() => {
            this.ws?.ping()
        }, 20 * 1000)
    }

    /**
     * Closes the connection to the Eludris gateway.
     */
    close() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.close()
            clearInterval(this.interval!)
        }
    }

    /**
     * A private function to create messages.
     * @param message The message to create
     */
    private async createMessage(message: Message): Promise<MessageResponse> {
        const response = await fetch(`${this.rest}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        return response.json() as Promise<MessageResponse>
    }

    /**
     * Send a message to Eludris.
     * @param content The content of the message.
     */
    async sendMessage(content: string): Promise<MessageResponse> {
        return await this.createMessage(new Message(this.name, content))
    }

    /**
     * Send a message to Eludris. (Alias for sendMessage)
     * @param content The content of the message.
     */
    async send(content: string): Promise<MessageResponse> {
        return await this.sendMessage(content)
    }

}
