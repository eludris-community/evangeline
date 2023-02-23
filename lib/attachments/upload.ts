import axios from 'axios';
import { FileData } from 'eludris-api-types/effis';
import { Bot } from '../bot.js';

// Make an uploadAttachment function where file.file must use FileData and Buffer
export default async function uploadAttachment(
    bot: Bot,
    file: {
        file: Buffer,
        name: string,
        spoiler?: boolean,
    }
): Promise<FileData> {
    const fixedFile = {
        file: file.file,
        name: file.name,
        spoiler: file.spoiler,
    };
    const response = await axios.post(`${bot.cdn}/attachments`, {
        file: fixedFile,
    },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
    );
    return response.data as FileData;
}