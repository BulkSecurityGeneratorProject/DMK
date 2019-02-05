export interface IMail {
    id?: number;
    from?: string;
    to?: string;
    subject?: string;
    content?: string;
}

export class Mail implements IMail {
    constructor(public id?: number, public from?: string, public to?: string, public subject?: string, public content?: string) {}
}
