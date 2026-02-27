---
title: User Interfaces and Tools
description: From Cursor to Open Code - choosing the right interface for AI-assisted coding.
sidebar:
  order: 3
---

## The Unbundling of AI Tools

Traditional AI coding tools bundled everything together:
- The model (usually proprietary)
- The interface
- The agent logic
- The billing

> "A lot of software was built on the assumption of bundling... I think AI is unbundling stuff."

The new model: use your favorite text editor, your favorite agent manager, and whichever model is cheapest.

## Terminology: "Harness" and Tool Calls

In AI tooling, people sometimes call the UI a "harness": a wrapper around chat that can also trigger tool calls.

In practice, most coding harnesses are just:
- read files
- write files
- run commands

That's enough to feel "agentic" while still being the same underlying thing: chat completions plus tools.

## The Rise and Fall of Specialized Tools

Tools like Cursor, Windsurf, and Aider had their moment:

> "I think their time is over, honestly... If you get a really good interface with any of these 600 models, why would you pay for a specialized tool?"

The problem with specialized tools:
- Often locked to specific models
- Expensive subscriptions
- Features get copied quickly
- Open alternatives catch up

## Open Code: The Current Recommendation

[Open Code](https://opencode.ai) is a Claude Code clone that works with any model:

```bash
# Start open code in your project
cd my-project
opencode
```

### Key Features

1. **Model agnostic** - Works with Open Router, Anthropic, OpenAI, etc.
2. **Simple interface** - Terminal-based, fast
3. **Skills system** - Teach it your preferences
4. **Open source** - No lock-in

### Providers and Open Code Zen

Open Code can connect to multiple providers (Open Router, OpenAI, etc.).

It also has its own inference option (Open Code Zen) which sometimes offers free promos.

Provider policies change. Some providers may restrict third-party clients or make API use expensive. If something does not connect, fall back to Open Router or another provider.

### The Interface

```
┌─────────────────────────────────────────┐
│ opencode v0.1.0          [minimax-m2.5] │
├─────────────────────────────────────────┤
│ > show me a sample of 25 people         │
│                                         │
│ Running: duckdb -c "SELECT * FROM       │
│ 'temp/entities/people.parquet' LIMIT 25"│
│                                         │
│ ┌──────────────────┬─────────┬────────┐ │
│ │    person_id     │   sex   │ birth  │ │
│ ├──────────────────┼─────────┼────────┤ │
│ │ ft11220745       │ NULL    │   NULL │ │
│ │ PP148348_1270409 │ male    │   1986 │ │
│ └──────────────────┴─────────┴────────┘ │
└─────────────────────────────────────────┘
```

## What About VS Code?

VS Code with GitHub Copilot is still useful:
- Good for quick completions
- Integrated in your editor
- But: limited model choice

> "I connected a server because of the data. So that's a good case... But the actual editor, sometimes I... but less than 30% of my time."

The trend is toward terminal-based agents that can do more than just complete code.

## Other Interfaces (Know They Exist)

You will see teams using:
- **Codex**: a popular UI for chatting with an agent, reviewing files, and revisiting previous sessions.
- **Google's agentic IDE experiments** ("anti-gravity"): a strong UI idea, but typically tied to a single model ecosystem.

The general pattern is the same: UI quality matters, but model lock-in matters more.

## Permissions and Safety

Some tools ask for permission before every file change/command. Others default to "do it".

Fast defaults are convenient but risky. The habit that makes this safe is always the same: review diffs.

## The Skills System

Open Code (and similar tools) let you define "skills" - reusable prompts:

````markdown
```markdown
# DuckDB Skill

## What I do
DuckDB is a fast, in-memory analytical database.

## CLI usage
```bash
duckdb -c "SELECT 1"
duckdb < queries.sql
```
```
````

Once defined, the agent knows how to use DuckDB without you explaining it every time.

## My Current Setup

> "70% terminal, 20% Sublime Merge [for git diffs], maybe 10% VS Code"

The terminal agent does most of the work. The GUI is for reviewing changes, not writing code.
