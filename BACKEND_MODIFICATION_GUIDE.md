# 백엔드 수정 가이드: Notion Children 블록 재귀 Fetch

## 문제
현재 백엔드는 최상위 블록만 반환하고, `has_children: true`인 블록의 `children`을 포함하지 않습니다.

## 해결 방법

`notion-server` 레포의 `/page/:pageId/blocks` 엔드포인트를 수정하여 children을 재귀적으로 fetch하도록 변경해야 합니다.

### 예시 코드 구조

```javascript
// utils/notionHelper.js 또는 유사한 파일

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * 특정 블록의 children을 재귀적으로 fetch하는 함수
 */
async function fetchBlockWithChildren(blockId) {
    // 블록 정보 가져오기
    const blockResponse = await notion.blocks.retrieve({ block_id: blockId });
    const block = transformBlock(blockResponse); // 기존 transform 로직 사용
    
    // has_children이 true인 경우 children을 재귀적으로 fetch
    if (block.has_children) {
        const childrenResponse = await notion.blocks.children.list({ 
            block_id: blockId 
        });
        
        // 각 child 블록에 대해 재귀 호출
        block.children = await Promise.all(
            childrenResponse.results.map(child => 
                fetchBlockWithChildren(child.id)
            )
        );
    }
    
    return block;
}

/**
 * 페이지의 모든 블록을 children 포함하여 fetch
 */
async function fetchPageBlocksWithChildren(pageId) {
    // 최상위 블록들 가져오기
    const response = await notion.blocks.children.list({ 
        block_id: pageId 
    });
    
    // 각 블록에 대해 children 포함하여 fetch
    const blocks = await Promise.all(
        response.results.map(block => 
            fetchBlockWithChildren(block.id)
        )
    );
    
    return blocks;
}

// 기존 이미지 처리 로직은 그대로 유지하되, children 내부의 이미지도 처리
async function processImagesInBlock(block) {
    if (block.type === 'image') {
        // 기존 이미지 처리 로직
        // block.content.s3Url = await uploadToS3(...);
    }
    
    // children이 있으면 재귀적으로 처리
    if (block.children && Array.isArray(block.children)) {
        for (const child of block.children) {
            await processImagesInBlock(child);
        }
    }
    
    return block;
}
```

### 엔드포인트 수정 예시

```javascript
// routes/page.js 또는 유사한 파일

router.get('/page/:pageId/blocks', async (req, res) => {
    try {
        const { pageId } = req.params;
        
        // 기존: const blocks = await fetchPageBlocks(pageId);
        // 변경: children 포함하여 fetch
        const blocks = await fetchPageBlocksWithChildren(pageId);
        
        // 이미지 처리 (children 포함)
        for (const block of blocks) {
            await processImagesInBlock(block);
        }
        
        res.json(blocks);
    } catch (error) {
        console.error('Error fetching blocks:', error);
        res.status(500).json({ error: 'Failed to fetch blocks' });
    }
});
```

## 주의사항

1. **API Rate Limit**: Notion API는 rate limit이 있으므로, 너무 많은 재귀 호출을 피하세요.
2. **성능**: 깊은 중첩 구조의 경우 응답 시간이 길어질 수 있습니다.
3. **이미지 처리**: children 내부의 이미지도 S3에 업로드하도록 처리해야 합니다.

## 테스트

수정 후 다음 명령어로 테스트:

```bash
curl http://localhost:5001/page/1a7a96ff12e680a5920bce87a1afa141/blocks | jq '.[] | select(.has_children == true) | {type, id, has_children_field: (.children != null)}'
```

`has_children_field`가 모두 `true`로 나와야 합니다.
