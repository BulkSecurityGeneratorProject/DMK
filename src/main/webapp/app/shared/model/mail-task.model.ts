import { Moment } from 'moment';

export interface IMailTask {
    id?: number;
    mailId?: number;
    status?: string;
    lastUpdate?: Moment;
}

export class MailTask implements IMailTask {
    constructor(public id?: number, public mailId?: number, public status?: string, public lastUpdate?: Moment) {}
}
