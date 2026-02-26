---
title: Tips and Anti-Patterns
description: What works and what doesn't when using AI for research coding.
sidebar:
  order: 5
---

## What Works

### Use Industry Standards

The AI knows SQL, Makefiles, ERD patterns, and standard file structures:

> "As soon as Haiku saw that the folder name was scd, it immediately realized that it's slowly changing dimension."

Name things conventionally:
- `create/` for scripts that create tables
- `test/` for test scripts
- `.parquet` for columnar data
- `valid_from`, `valid_till` for SCD2 dates

### Self-Documenting Structure

> "If you have good code, you don't have to write documentation."

A file named `code/create/people.sql` that outputs `temp/entities/people.parquet` needs no explanation.

### Let the Agent Write Tests

```
User: verify that each row in each entity table has a distinct PK
Agent: [writes pk_uniqueness.sql, runs it, all pass]
```

The agent is good at writing boilerplate tests. Use this.

### Review Diffs, Not Code

> "I'm mostly working in the terminal and in Sublime Merge... in Sublime Merge I can review the changes with git diffs."

You don't need to read every line. Look at the diff:
- Did it change what I expected?
- Did it touch files I didn't expect?
- Does the pattern look right?

## What Doesn't Work

### Overloading Context

> "The less you load into the head of the chatbot, the better."

Don't put everything in AGENTS.md. Don't paste entire files when a line number will do.

### Arguing with a Confused Agent

> "Sometimes it might get hurt, their feelings or something. Sometimes I just stop, get distracted."

If the agent is confused after 2-3 corrections, start fresh. The context window is polluted.

### Trusting Without Verification

> "I always do this questions again and again: did you extract all variables? Did you extract all rows? Check the original input please."

The agent will confidently produce wrong results. Always verify:
- Row counts match expectations
- Primary keys are unique
- Foreign keys resolve
- Sample data looks right

### One Big Script

> "Why are you doing everything in one script? No sane person would do that."

Even when the agent tries to put everything in one file, ask it to split:
- One script per table
- Clear inputs and outputs
- Makefile orchestrates

### Meaningful IDs (Sometimes)

> "Software engineers insist that IDs should be meaningless, either UUID or a counter. Because whenever you hang on to something meaningful, it's gonna change and you're gonna get screwed."

But for research:
> "It's just so convenient to use these IDs from time to time."

Trade-off: meaningful IDs are convenient but fragile. Be aware of the cost.

## The Meta-Lesson

> "Structure becomes more important with conversational and agentic AI, not less important. Of course, you can ask whatever and it's going to do something. But it's going to be very confusing, very unmaintainable."

The better your data architecture, the more powerful the AI becomes. This isn't about the AI—it's about good engineering practices that the AI can leverage.
