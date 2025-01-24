// src/types/database.ts

export interface Message {
    id: number;
    username: string;
    sprintCode: string;
    message: string;
    gifUrl: string;
    createdAt: string;
}

export interface Template {
    id: number;
    text: string;
}

export interface Sprint {
    id: number;
    code: string;
    title: string;
    createdAt: string;
}

export interface Database {
    messages: Message;
    templates: Template;
    sprints: Sprint;
}
