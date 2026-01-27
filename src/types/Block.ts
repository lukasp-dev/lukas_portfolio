export interface RichText {
    type: string;
    text?: {
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
    /**
     * Notion table_of_contents 등에서 사용하는 color 필드 등
     */
    color?: string;
}

export interface Block {
    id: string;
    type: string;
    content: BlockContent;
    /**
     * Notion 원본 has_children 플래그
     */
    has_children: boolean;
    /**
     * 재귀적으로 포함되는 children 블록들.
     * 서버에서 중첩 블록까지 fetch 해 줄 경우 사용된다.
     */
    children?: Block[];
}
