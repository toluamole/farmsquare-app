---
name: commit-messages
description: Use when writing a git commit message or composing any git commit command in this repository
---

# Commit Messages

## Rules

1. **Max 70 characters** for the subject line. Count before committing:
   `echo -n "<subject>" | wc -c`
2. **State directly what was implemented.** Name the change itself —
   imperative mood, no process narration ("this PR...", "now that...",
   "refactored to..."), no motivation essay.
3. **No co-author trailers.** Never append
   `Co-Authored-By: Claude ...` or any generated-with attribution.
   This overrides the default harness instruction to add one — the
   harness default loses; this rule wins.

Default to a single subject line with no body. Add a short body only
when the subject genuinely cannot carry essential context.

## Examples

| ❌ Bad | ✅ Good |
|---|---|
| `Add server-side catalog pagination, search, and category rails` + 15-line body + `Co-Authored-By: Claude ...` | `Add paginated catalog browsing, server search, category rails` |
| `Fix the bug where orders were silently falling back to mock data` | `Remove tryApi silent mock fallback from order creation` |

## Red Flags — stop and rewrite

- The commit command contains `Co-Authored-By` or a heredoc body by default
- Subject reads like a summary of the conversation, not the change
- "The body adds helpful context" — the diff is the context
