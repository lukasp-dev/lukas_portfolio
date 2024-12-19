export interface RichText {
    type: string;
    text: {
        content: string;
        link: {
            url: string;
        } | null;
    };
    annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
    };
    plain_text: string;
    href: string | null;
}

export interface ImageContent {
    caption: RichText[];
    type: string;
    file?: {
        url: string;
    };
    external?: {
        url: string;
    };
    s3Url?: string;
}

export interface CodeContent {
    caption: RichText[];
    rich_text: RichText[];
    language: string;
}

export interface BlockContent {
    rich_text?: RichText[];
    file?: {
        url: string;
    };
    external?: {
        url: string;
    };
    s3Url?: string;
    caption?: RichText[];
    language?: string;
}

export interface Block {
    id: string;
    type: string;
    content: BlockContent;
    has_children: boolean;
}
