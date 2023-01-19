import { RawData, WebSocket } from 'ws'
import { EventEmitter } from 'events'
import { Message, MessageResponse } from './types/message.js'
import axios from 'axios'
import { EvangelineValueError } from './errors.js'

const DEFAULT_REST_URL = 'https://eludris.tooty.xyz/'
const DEFAULT_WS_URL = 'wss://eludris.tooty.xyz/ws/'

/**
 * The options for the bot.
 */
export interface BotOptions {
    /**
     * The gateway URL to connect to.
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
	 * @returns {@link Bot}
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
    public author: string
    private options?: BotOptions
    public ws: WebSocket | null = null
    public rest: string
    private interval: NodeJS.Timer | null = null

    /**
     * The main bot class.
     * @param author The author name of the to-be-sent messages. It **must** be 2-32 characters long.
     * @param options The options for the bot.
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot(
     *      'evangeline test', {
     *          gatewayURL: 'wss://some.ws-url.xyz/ws/', // optional
     *          restURL: 'https://some.rest-url.xyz/' // optional
     * })
     */
    constructor(author: string, options?: BotOptions) {
        super()
        this.author = author
        this.options = options
        this.rest = this.options?.restURL || DEFAULT_REST_URL
    }
    
    /**
     * Connects to the Eludris gateway.
     * @throws {EvangelineValueError} If `author` is not 2-32 characters long.
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot('evangeline test')
     * 
     * bot.connect()
     */
    connect() {
        if (this.author.length < 2 || this.author.length > 32) {
            throw new EvangelineValueError('author passed is not 2-32 characters long')
        }

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
        const response = axios.post(`${this.rest}/messages`, {
            author: this.author,
            content: message.content
        }).then((v) => v.data)
        return await response as MessageResponse
    }

    /**
     * Send a message to Eludris.
     * @param content The content of the message.
     * @example
     * import { Bot } from 'evangeline';
     * 
     * const bot = new Bot('evangeline test')
     * 
     * bot.on('ready', async () => {
     *     await bot.sendMessage('woah, I\'m alive!')
     * })
     */
    async sendMessage(content: string): Promise<MessageResponse> {
        if (content === '' || content === undefined || content === null) {
            throw new EvangelineValueError('Message content cannot be empty')
        }
        return await this.createMessage(new Message(this.author, content))
    }

    /**
     * Send a message to Eludris. (Alias for {@link sendMessage})
     * @param content The content of the message.
     */
    async send(content: string): Promise<MessageResponse> {
        return await this.sendMessage(content)
    }

}
