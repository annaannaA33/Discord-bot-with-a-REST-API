

export interface Message {
    id?: number;
    username: string;
    sprintCode: string;
    message: string;
    gifUrl: string;
    createdAt?: Date;
}

export interface Template {
    id?: number;
    text: string;
}

export interface Sprint {
    code: string;
    title: string;
}

export interface Database {
    messages: Message;
    templates: Template;
    sprints: Sprint;
}
