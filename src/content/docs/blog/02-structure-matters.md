---
title: "Structure Becomes More Important"
description: The paradox of AI - unstructured interaction requires structured data.
sidebar:
  order: 2
---

## The Paradox

Working with AI agents feels fluid. You speak English, it responds, you iterate. No syntax errors, no compilation, just conversation.

> "You're interacting in a very unstructured way, but... almost everything has to be super structured."

This is the paradox: the more conversational your interface, the more your underlying data and code need structure.

## The SCD Moment

Here's what convinced me. I removed all instructions, switched to Haiku (a deliberately "not very smart" model), and ran a single command:

```bash
tree
```

Then asked: "What is this project doing?"

> "As soon as Haiku saw that the folder name was scd, it immediately realized that it's slowly changing dimension."

The model identified:
- Entity tables in `temp/entities/`
- SCD2 relations in `temp/scd/`
- DuckDB SQL scripts
- Makefile orchestration

Zero prompting. Just good naming conventions.

## Why Structure Enables Fluency

Without structure:
```
Me: Show me some people
AI: What do you mean by people? What format? What database?
    What columns? How many?
[30 minutes of clarification]
```

With proper ERD structure:
```
Me: show me a sample of 25 people
AI: SELECT * FROM 'temp/entities/people.parquet' LIMIT 25
[instant result]
```

> "By this stage, it's not confusing to the agent at all because people - we have an entity relational model, I have an entity table called people."

The conversation becomes efficient precisely because the data is unambiguous.

## Less Context is Better

You might think: "I'll just explain everything in my prompt." Research suggests the opposite.

> "What you're not saying is as important as what you're saying."

Generic instructions that aren't relevant to the current task actually hurt performance. They consume context window. They can mislead.

> "The less you load into the head of the chatbot, the better."

The solution isn't more explanation - it's better structure that needs no explanation.

## Self-Documenting Architecture

Good structure is self-documenting:

| Bad | Good |
|-----|------|
| `data1.csv` | `temp/entities/people.parquet` |
| `process.sql` | `code/create/people.sql` |
| `valid`, `invalid` | `valid_from`, `valid_till` |
| `id` | `person_id`, `frame_id` |

> "If you have good code, you don't have to write documentation."

Industry standards help enormously. SQL, SCD2, ERD patterns - these are in the training data. The AI knows them. Use them.

## The Practical Takeaway

Before your next AI-assisted project:

1. **Design your schema** - Entity tables, relation tables, clear PKs
2. **Name things conventionally** - `create/`, `test/`, `valid_from`
3. **Use standard formats** - Parquet, SQL, Makefiles
4. **Skip the lengthy prompts** - Let structure speak

The irony: preparing for AI assistance looks exactly like preparing for human collaboration. Clear organization, standard conventions, self-documenting names.

Structure becomes more important, not less. But with AI, it's also easier to create.

---

*Based on a hackathon session at CEU MicroData, February 2026.*
