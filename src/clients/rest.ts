import { User, UserCreate, PasswordDeleteCredentials, UpdateUserProfile, UpdateUser, SessionCreate, SessionCreated, Session, MessageCreate, Message, InstanceInfo, FileData, FileUpload } from 'eludris-api-types/dist/v0.4.0-alpha1';
import { RESTClientOptions } from './options';
import { Optional } from '../types/external';

export class RESTClient {
    constructor(private options: RESTClientOptions) {
        this.options.oprishURL = options?.oprishURL || 'https://api.eludris.gay/';
        this.options.effisURL = options?.effisURL || 'https://cdn.eludris.gay/'
    }

    private async request(options: {
        route: string,
        baseURL?: string, // for when we use CDN for example
        body?: any,
        method?: 'GET' | 'DELETE' | 'POST' | 'PATCH' | 'PUT',
        headers?: {} // `object` doesn't work apparently
    }) {
        const url = (options.baseURL || this.options.oprishURL) + options.route
        return await fetch(url, {
            method: options.method,
            body: options.body,
            headers: options.headers
        })
    }

    /**
     * Creates a new user.
     * @param data The username, email, and password for the user.
     * @returns A newly created {@link User}.
     */
    async createUser(data: UserCreate): Promise<User> {
        const request = await this.request({
            route: '/users',
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (request.ok) {
            return await request.json() as User
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Deletes a user.
     * @param data The password for the user.
     * @param authorizationToken The token for the user
     * This will default to the token passed in the Client's options.
     * @returns An empty response.
     */
    async deleteUser(
        data: PasswordDeleteCredentials,
        authorizationToken?: string,
    ): Promise<null> {
        const request = await this.request({
            route: '/users',
            method: 'DELETE',
            headers: {
                Authorization: authorizationToken || this.options.authorizationToken
            },
            body: JSON.stringify(data)
        })

        if (request.ok) {
            return await request.json() as null
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get your own user.
     * @returns The {@link User}.
     */
    async getSelf(): Promise<User> {
        const request = await this.request({
            route: '/users/@me',
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as User
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get a user.
     * @param data The user's username or ID.
     * @returns The fetched {@link User}.
     */
    async getUser(user: string): Promise<User> {
        const request = await this.request({
            route: '/users/' + user,
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as User
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Update your profile.
     * @param data The fields of the profile to update.
     * @returns The {@link User} with the updated profile fields.
     */
    async updateProfile(data: UpdateUserProfile): Promise<User> {
        const request = await this.request({
            route: '/users/profile',
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as User
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Update a user.
     * @param data The fields of the user to update.
     * @returns The {@link User} with the updated user fields.
     */
    async updateUser(data: UpdateUser): Promise<User> {
        const request = await this.request({
            route: '/users',
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as User
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Verify your email address.
     * @param data The verification code sent by email.
     * @returns An empty response.
     */
    async verifyUser(data: { code: number }): Promise<null> {
        const request = await this.request({
            route: '/users/verify?code=' + data.code,
            method: 'POST',
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as null
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Create a new session.
     * @param data The session data.
     *
     * `platform` defaults to `typescript` if not provided.
     *
     * `client` defaults to `evangeline` if not provided.
     * @returns A newly created {@link SessionCreated session}
     */
    async createSession(
        data: Optional<SessionCreate, 'platform' | 'client'>
    ): Promise<SessionCreated> {
        data.client = data.client || 'evangeline'
        data.platform = data.platform || 'typescript'

        const request = await this.request({
            route: '/sessions',
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (request.ok) {
            return await request.json() as SessionCreated
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Delete a session.
     * @param sessionID The ID of the session to delete.
     * @param data The password of the session's user.
     * @returns An empty response
     */
    async deleteSession(
        sessionID: string,
        data: PasswordDeleteCredentials
    ): Promise<null> {
        const request = await this.request({
            route: '/sessions/' + sessionID,
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as null
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get all user sessions.
     * @returns An array of {@link Session sessions}
     */
    async getSessions(): Promise<Array<Session>> {
        const request = await this.request({
            route: '/sessions',
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as Array<Session>
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Post a message to Eludris.
     * @param data The data for the message to be sent.
     * @returns The {@link Message}'s data
     */
    async createMessage(data: MessageCreate): Promise<Message> {
        const request = await this.request({
            route: '/messages',
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                Authorization: this.options.authorizationToken
            }
        })

        if (request.ok) {
            return await request.json() as Message
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Gets information on the instance you are currently send requests to.
     * Modifiable with {@link RESTClientOptions RESTClientOptions.oprishURL}
     * @param rateLimits Whether the instance rate-limits should be returned as well. Defaults to `false`.
     * @returns The {@link InstanceInfo instance's information}
     */
    async getInstanceInfo(rateLimits?: boolean): Promise<InstanceInfo> {
        const request = await this.request({
            route: '/' + ((rateLimits) ? '?rate_limits' : '')
        })

        if (request.ok) {
            return request.json() as Promise<InstanceInfo>
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Download an attachment from the `attachments` bucket.
     * @param id The ID of the attachment
     * @returns A {@link Blob} of the attachment.
     */
    async downloadAttachment(
        id: string,
    ): Promise<Blob> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/attachments/${id}/download`
        })

        if (request.ok) {
            return await request.blob()
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Download a file from a specific bucket.
     * @param options The bucket and ID to use.
     * @returns The {@link Blob} of the file.
     */
    async downloadFile(options: { bucket: string, id: string }): Promise<Blob> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/${options.bucket}/${options.id}/download`
        })

        if (request.ok) {
            return await request.blob()
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Downloads a static file. This can only be added by the instance owner and cannot be modified.
     * @param name The name of the file.
     * @returns The {@link Blob} of the file.
     */
    async downloadStaticFile(name: string): Promise<Blob> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/static/${name}/download`
        })

        if (request.ok) {
            return await request.blob()
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get an attachment.
     * @param id The ID of the attachment
     * @returns The {@link Blob} of the attachment
     */
    async getAttachment(id: string): Promise<Blob> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/${id}`
        })

        if (request.ok) {
            return await request.blob()
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get an attachment's metadata.
     * @param id The ID of the attachment.
     * @returns The {@link FileData file's data}.
     */
    async getAttachmentData(id: string): Promise<FileData> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/${id}/data`
        })

        if (request.ok) {
            return await request.json() as FileData
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get a file from a specific bucket.
     * @param options The bucket an ID for the attachment.
     * @returns The {@link Blob} of the attachment.
     */
    async getFile(options: { bucket: string, id: string }): Promise<Blob> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/${options.bucket}/${options.id}`
        })

        if (request.ok) {
            return await request.blob()
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get a file's metadata from a specific bucket.
     * @param options The bucket and ID for the attachment.
     * @returns The {@link Blob} of the file.
     */
    async getFileData(options: { bucket: string, id: string }): Promise<FileData> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/${options.bucket}/${options.id}/data`
        })

        if (request.ok) {
            return await request.json() as FileData
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Get a static file. This can only be added by the instance owner and cannot be modified.
     * @param name The name of the file.
     * @returns The {@link Blob} of the file.
     */
    async getStaticFile(name: string): Promise<Blob> {
        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/static/${name}`
        })

        if (request.ok) {
            return await request.blob()
        } else {
            throw Error(await request.text())
        }
    }

    /**
     * Upload an attachment to the `attachments` bucket.
     * @param data The file's data.
     * @returns The uploaded {@link FileData file's data}.
     */
    async uploadAttachment(data: FileUpload & { name: string }): Promise<FileData> {
        return this.uploadFile(
            'attachments',
            {
                ...data
            }
        )
    }

    /**
     * Upload a file to a specific bucket.
     * @param data The file data, file name, and bucket to post with.
     * @returns The uploaded {@link FileData file's data}.
     */
    async uploadFile(bucket: string, data: FileUpload & { name: string }): Promise<FileData> {
        const formData = new FormData()
        formData.append('file', data.file as File, data.name)
        formData.append('spoiler', data.spoiler.toString())

        const request = await this.request({
            baseURL: this.options.effisURL,
            route: `/${bucket}`,
            method: 'POST',
            body: formData,
        })

        if (request.ok) {
            return await request.json() as FileData
        } else {
            throw Error(await request.text())
        }
    }
}
