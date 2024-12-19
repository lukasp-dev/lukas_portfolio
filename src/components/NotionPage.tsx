import React from 'react';
import { useAxios } from '../hooks/useAxios';
import { Block } from '../types/Block';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface NotionPageProps {
    pageId: string;
}

const getLanguage = (language?: string) => {
    if (!language) return 'plaintext';
    switch (language.toLowerCase()) {
        case 'plain text':
            return 'plaintext';
        case 'java':
            return 'java';
        case 'javascript':
            return 'javascript';
        case 'python':
            return 'python';
        default:
            return 'plaintext';
    }
};

const NotionPage: React.FC<NotionPageProps> = ({ pageId }) => {
    const { data, loading, error } = useAxios(pageId);
    const blocks: Block[] = Array.isArray(data) ? data : [];

    console.log('Loaded blocks:', blocks);

    if (loading) return <div className="p-6 text-white">Loading...</div>;
    if (error) return <div className="p-6 text-white">Error occurred</div>;

    const renderRichText = (richTexts: Block['content']['rich_text'] = []) => {
        return richTexts.map((text, index) => {
            if (!text) return null;

            let content: React.ReactNode = text.plain_text;

            // Handle different rich_text types
            if (text.type === 'text' && text.text) {
                if (text.text.link) {
                    content = (
                        <a
                            href={text.text.link.url}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {text.text.content}
                        </a>
                    );
                } else {
                    content = <span>{text.text.content}</span>;
                }
            } else if (text.type === 'mention' && (text as any).mention) {
                const mention = (text as any).mention;
                if (mention.type === 'link_preview' && mention.link_preview) {
                    content = (
                        <a
                            href={mention.link_preview.url}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {text.plain_text}
                        </a>
                    );
                }
                // Handle other mention types if necessary
            }

            const classNames = [
                text.annotations.bold ? 'font-bold' : '',
                text.annotations.italic ? 'italic' : '',
                text.annotations.underline ? 'underline' : '',
                text.annotations.code ? 'font-mono bg-gray-800 px-1 rounded' : '',
                text.annotations.strikethrough ? 'line-through' : '',
                text.annotations.color && text.annotations.color !== 'default' ? `text-${text.annotations.color}` : '',
            ]
                .filter(Boolean)
                .join(' ');

            return (
                <span key={`${text.plain_text}-${index}`} className={classNames}>
                    {content}
                </span>
            );
        });
    };

    const renderBlock = (block: Block) => {
        switch (block.type) {
            case 'paragraph':
                return (
                    <p key={block.id} className="mb-4">
                        {renderRichText(block.content.rich_text)}
                    </p>
                );

            case 'heading_1':
                return (
                    <h1 key={block.id} className="text-3xl font-bold my-4">
                        {renderRichText(block.content.rich_text)}
                    </h1>
                );

            case 'heading_2':
                return (
                    <h2 key={block.id} className="text-2xl font-semibold my-4">
                        {renderRichText(block.content.rich_text)}
                    </h2>
                );

            case 'heading_3':
                return (
                    <h3 key={block.id} className="text-xl font-semibold my-4">
                        {renderRichText(block.content.rich_text)}
                    </h3>
                );

            case 'numbered_list_item':
                return (
                    <li key={block.id} className="mb-2">
                        {renderRichText(block.content.rich_text)}
                        {block.has_children && (block as any).children && (
                            <ol className="list-decimal list-inside ml-4">
                                {(block as any).children.map((childBlock: Block) => renderBlock(childBlock))}
                            </ol>
                        )}
                    </li>
                );

            case 'bulleted_list_item':
                return (
                    <li key={block.id} className="mb-2">
                        {renderRichText(block.content.rich_text)}
                        {block.has_children && (block as any).children && (
                            <ul className="list-disc list-inside ml-4">
                                {(block as any).children.map((childBlock: Block) => renderBlock(childBlock))}
                            </ul>
                        )}
                    </li>
                );

            case 'code':
                console.log('Rendering code block:', block.id);
                return (
                    <div key={block.id} className="mb-4">
                        <SyntaxHighlighter
                            language={getLanguage(block.content.language)}
                            style={vs2015}
                            className="rounded-md"
                        >
                            {block.content.rich_text?.map(rt => rt.text?.content).join('\n') || ''}
                        </SyntaxHighlighter>
                    </div>
                );

            case 'image':
                return (
                    <div key={block.id} className="my-4">
                        <img
                            src={block.content.s3Url || block.content.file?.url || block.content.external?.url}
                            alt="Image"
                            className="rounded-lg w-full"
                        />
                        {block.content.caption && block.content.caption.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                {renderRichText(block.content.caption)}
                            </p>
                        )}
                    </div>
                );

            case 'table_of_contents':
                return (
                    <div key={block.id} className="my-4">
                        {/* 동적 TOC 구현 가능 */}
                        <div className={`text-${(block.content as any).color || 'default'}`}>
                            <p className="italic">Table of Contents</p>
                            {/* 동적 TOC 생성 로직 추가 가능 */}
                        </div>
                    </div>
                );

            case 'column_list':
                return (
                    <div key={block.id} className="flex space-x-4 mb-4">
                        {Array.isArray((block as any).children) && (block as any).children.map((childBlock: Block) => (
                            <div key={childBlock.id} className="flex-1">
                                {renderBlock(childBlock)}
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    // 리스트 블록 그룹화
    const groupedBlocks: Array<{ type: string; items: Block[] }> = [];
    let currentGroup: { type: string; items: Block[] } | null = null;

    blocks.forEach(block => {
        if (block.type === 'numbered_list_item' || block.type === 'bulleted_list_item') {
            if (currentGroup && currentGroup.type === block.type) {
                currentGroup.items.push(block);
            } else {
                currentGroup = { type: block.type, items: [block] };
                groupedBlocks.push(currentGroup);
            }
        } else {
            currentGroup = null;
            groupedBlocks.push({ type: block.type, items: [block] });
        }
    });

    return (
        <div className="mt-8">
            {groupedBlocks.map((group, index) => {
                switch (group.type) {
                    case 'paragraph':
                    case 'heading_1':
                    case 'heading_2':
                    case 'heading_3':
                    case 'code':
                    case 'image':
                    case 'table_of_contents':
                    case 'column_list':
                        return group.items.map(block => renderBlock(block));

                    case 'numbered_list_item':
                        return (
                            <ol key={index} className="list-decimal list-inside mb-4">
                                {group.items.map(block => renderBlock(block))}
                            </ol>
                        );

                    case 'bulleted_list_item':
                        return (
                            <ul key={index} className="list-disc list-inside mb-4">
                                {group.items.map(block => renderBlock(block))}
                            </ul>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default NotionPage;
