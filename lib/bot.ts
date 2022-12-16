import { RawData, WebSocket } from 'ws'
import { EventEmitter } from 'events'
import { Message, MessageResponse } from './types/message.js'
import fetch from 'node-fetch'

const DEFAULT_REST_URL = 'https://eludris.tooty.xyz/'
const DEFAULT_WS_URL = 'wss://eludris.tooty.xyz/ws/'

/**
 * The options for the bot.
 */
interface BotOptions {
    /**
     * The gateway URL to connect to.
     * @public
     */
    gatewayURL?: string;
    /**
     * The REST URL to send requests to.
     */
    restURL?: string;
}

export declare interface Bot {
    /**
     * A function to listen to certain events.
     * @param event The event to listen to.
     * @param listener The parameters (if needed) to be used in the event.
     * @public
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot('evangeline bot')
     * 
     * bot.on('messageCreate', async (message) => {
     *     // event code here
     * })
     * 
     * bot.connect()
     */
    on(event: 'messageCreate', listener: (message: Message) => void): this;
    on(event: 'ready', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
}

export class Bot extends EventEmitter {
    public name: string
    private options?: BotOptions
    public ws: WebSocket | null = null
    public rest: string
    private interval: NodeJS.Timer | null = null

    /**
     * The main bot class.
     * @param name The desired name of the bot.
     * @param options The options for the bot.
     * @public
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot(
     *      'evangeline test', {
     *          gatewayURL: 'wss://some.ws-url.xyz/ws/', // optional
     *          restURL: 'https://some.rest-url.xyz/' // optional
     * })
     */
    constructor(name: string, options?: BotOptions) {
        super()
        this.name = name
        this.options = options
        this.rest = this.options?.restURL || DEFAULT_REST_URL
    }
    
    /**
     * Connects to the Eludris gateway.
     * @public
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot('evangeline test')
     * 
     * bot.connect()
     */
    connect() {
        this.ws = new WebSocket(this.options?.gatewayURL || DEFAULT_WS_URL)

        this.ws.on('open', () => {
            this.emit('ready')
        })

        this.ws.on('message', (data: RawData) => {
            const event = JSON.parse(data.toString())
            if (event.op == "MESSAGE_CREATE") {
              this.emit('messageCreate', event.d as Message)
            }
        })

        this.ws.on('close', (code: number, reason: Buffer) => {
            this.emit('close', code, reason)
        })

        this.ws.on('error', (error: Error) => {
            this.emit('error', error)
        })

        this.interval = setInterval(() => {
            this.ws?.send(JSON.stringify({op: "PING"}))
        }, 45 * 1000)
    }

    /**
     * Closes the connection to the Eludris gateway.
     * @public
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
     * @private
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
     * @public
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot('evangeline test')
     * 
     * bot.on('ready', async () => {
     *     await bot.sendMessage('woah, I'm alive!')
     * })
     * @returns {@link Promise<MessageResponse>}
     */
    async sendMessage(content: string): Promise<MessageResponse> {
        return await this.createMessage(new Message(this.name, content))
    }

    /**
     * Send a message to Eludris. (Alias for {@link sendMessage})
     * @param content The content of the message.
     */
    async send(content: string): Promise<MessageResponse> {
        return await this.sendMessage(content)
    }

}
