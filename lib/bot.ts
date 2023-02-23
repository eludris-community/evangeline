import { RawData, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import axios from 'axios';
import { Message } from 'eludris-api-types/oprish';
import { EvangelineValueError } from './errors.js';
import uploadAttachment from './attachments/upload.js';
import { FileData } from 'eludris-api-types/effis';

const DEFAULT_REST_URL = 'https://eludris.tooty.xyz/';
const DEFAULT_WS_URL = 'wss://eludris.tooty.xyz/ws/';
const DEFAULT_CDN_URL = 'https://effis.tooty.xyz/';

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
    /**
     * The CDN URL to send requests to.
     */
    cdnURL?: string;
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
    public cdn: string
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
        this.cdn = this.options?.cdnURL || DEFAULT_CDN_URL;
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
    // make use of Buffer.from() to send files
    async sendMessage(content?: string, file?: {
        name: string,
        file: Buffer,
        spoiler?: boolean;
    }): Promise<Message> {
        let fullMessage: string;
        if (file) {
            const attachment = await uploadAttachment(this, file);
            const fixedURL = `${this.cdn}${attachment.id}`;
            fullMessage = `${content || ''} ${fixedURL}`;
        } else {
            fullMessage = content || '';
        }

        return (await axios.post(`${this.rest}/messages`, {
            author: this.author,
            content: fullMessage,
        })).data as Message;
    }

    /**
     * Send a message to Eludris. (Alias for {@link sendMessage})
     * @param content The content of the message.
     */
    async send(content?: string, file?: {
        name: string,
        file: Buffer,
        spoiler?: boolean;
    }): Promise<Message> {
        return await this.sendMessage(content, file);
    }

    /**
     * Fetches an attachment from the attachment bucket.
     * @param id The ID of the attachment.
     * @returns {Buffer} The attachment.
     */
    async fetchAttachment(id: string): Promise<Buffer> {
        return (await axios.get(`${this.cdn}/attachments/${id}`, {
            responseType: 'arraybuffer'
        })).data as Buffer;
    }

    /**
     * Fetches an attachment's data from the attachment bucket.
     * @param id The ID of the attachment.
     * @returns {FileData} The attachment's data.
     */
    async fetchAttachmentData(id: string): Promise<FileData> {
        return (await axios.get(`${this.cdn}/attachments/${id}/data`, {
            responseType: 'json'
        })).data as FileData;
    }
}
