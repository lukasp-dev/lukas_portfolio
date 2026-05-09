---
name: smart-commit
description: Generate clear, professional commit messages from local git changes. Use when writing commit messages, preparing commits, or reviewing staged diffs before commit.
disable-model-invocation: true
---

# Smart Commit

Use this skill when preparing a commit message from local changes.

## Goal

Produce a concise, professional commit message that explains intent, not just file edits.

## Workflow

1. Inspect local changes:
   - Review staged and unstaged diffs.
   - Identify the primary purpose of the change.
2. Classify the change type:
   - `feat` for new behavior
   - `fix` for bug fixes
   - `refactor` for internal improvement without behavior change
   - `docs` for documentation-only updates
   - `test` for test-only changes
   - `chore` for maintenance work
3. Draft the subject line:
   - Format: `<type>(optional-scope): <short summary>`
   - Keep it under 72 characters.
   - Use imperative mood (e.g., "add", "fix", "update").
4. Draft the body (optional but recommended):
   - One short paragraph explaining why this change exists.
   - Add impact notes if behavior, config, or migration is affected.

## Quality Checklist

- Message reflects the real purpose of the diff.
- Scope is meaningful and not overly broad.
- Avoid vague wording (e.g., "update stuff", "fix issue").
- Subject is concise, body adds context.

## Example

```text
feat(auth): add refresh token rotation on login

Reduce session replay risk by rotating refresh tokens at each successful login
and invalidating previous tokens server-side.
```
