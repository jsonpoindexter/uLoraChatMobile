import {Buffer} from "buffer";

export const stringToBase64 = (str: string): string => {
    const buff = Buffer.from(str, 'utf8');
    return buff.toString('base64');
}

export const base64ToString = (base64str: string): string => {
    const buff = Buffer.from(base64str, 'base64');
    return buff.toString('utf8');
}
