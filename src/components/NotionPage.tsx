import React from 'react';
import { useAxios } from '../hooks/useAxios';
import { Block, RichText } from '../types/Block';
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
    const blocks: Block[] = Array.isArray(data) ? (data as Block[]) : [];

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
                            className="text-amber-glow underline hover:text-amber-gold transition-colors"
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
                            className="text-amber-glow underline hover:text-amber-gold transition-colors"
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
                        {block.has_children && block.children && (
                            <ol className="list-decimal list-inside ml-4">
                                {block.children.map((childBlock: Block) => renderBlock(childBlock))}
                            </ol>
                        )}
                    </li>
                );

            case 'bulleted_list_item':
                return (
                    <li key={block.id} className="mb-2">
                        {renderRichText(block.content.rich_text)}
                        {block.has_children && block.children && (
                            <ul className="list-disc list-inside ml-4">
                                {block.children.map((childBlock: Block) => renderBlock(childBlock))}
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
                    <div key={block.id} className="flex flex-col md:flex-row md:space-x-4 mb-4">
                        {Array.isArray(block.children) &&
                            block.children.map((childBlock: Block) => (
                                <div key={childBlock.id} className="flex-1 mb-4 md:mb-0">
                                    {renderBlock(childBlock)}
                                </div>
                            ))}
                    </div>
                );

            case 'toggle':
                // Toggle uses plain text, not rich_text formatting
                const toggleText = block.content.rich_text?.[0]?.plain_text || '';
                return (
                    <details key={block.id} className="mb-4">
                        <summary className="cursor-pointer font-semibold text-lg mb-2">
                            {toggleText}
                        </summary>
                        {block.has_children && block.children && (
                            <div className="ml-4 mt-2">
                                {block.children.map((childBlock: Block) => renderBlock(childBlock))}
                            </div>
                        )}
                    </details>
                );

            case 'divider':
                return (
                    <hr key={block.id} className="my-6 border-gray-600" />
                );

            case 'table':
                const tableContent = block.content as any;
                const hasColumnHeader = tableContent.has_column_header || false;
                return (
                    <div key={block.id} className="my-6 overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-600">
                            <tbody>
                                {block.has_children && block.children && block.children.map((rowBlock: Block, rowIndex: number) => {
                                    if (rowBlock.type !== 'table_row') return null;
                                    const rowContent = rowBlock.content as any;
                                    const cells = rowContent.cells || [];
                                    const isHeaderRow = hasColumnHeader && rowIndex === 0;
                                    
                                    return (
                                        <tr key={rowBlock.id} className={isHeaderRow ? 'bg-gray-800' : ''}>
                                            {cells.map((cell: RichText[], cellIndex: number) => {
                                                const CellTag = isHeaderRow ? 'th' : 'td';
                                                return (
                                                    <CellTag
                                                        key={cellIndex}
                                                        className="border border-gray-600 px-4 py-2 text-left"
                                                    >
                                                        {renderRichText(cell)}
                                                    </CellTag>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );

            case 'table_row':
                // table_row는 table의 children으로만 렌더링되므로 여기서는 처리하지 않음
                return null;

            default:
                console.warn(`Unsupported block type: ${block.type}`, block);
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
                    case 'toggle':
                    case 'divider':
                    case 'table':
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
