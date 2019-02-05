export interface IFaq {
    id?: number;
    text?: string;
}

export class Faq implements IFaq {
    constructor(public id?: number, public text?: string) {}
}
