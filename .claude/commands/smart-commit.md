---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
description: Analyze changes and create a well-crafted conventional commit
---

## Context

- Git status: !`git status --short`
- Staged + unstaged diff: !`git diff HEAD`
- Recent commits (for style reference): !`git log --oneline -5`
- Current branch: !`git branch --show-current`

## Your task

Analyze the changes above and create a single, well-crafted git commit following these rules:

**Commit message format:**
```
<type>(<scope>): <short summary>

[optional body — only if the why isn't obvious from the summary]
```

**Types:** `feat` · `fix` · `refactor` · `style` · `chore` · `docs` · `test`

**Rules:**
- Summary line: imperative mood, max 72 chars, no trailing period
- Scope: the affected area (e.g. `gallery`, `museum`, `navbar`, `credits`) — omit if too broad
- Body: only when the motivation or tradeoff isn't obvious
- Stage ALL modified and untracked files that belong to this logical change
- Do NOT stage `.env`, secrets, or unrelated files
- Do NOT add a `Co-Authored-By` trailer

Stage the files and create the commit in a single message. No other output.
