---
title: "Structure Becomes More Important"
description: The paradox of AI - unstructured interaction requires structured data.
sidebar:
  order: 2
---

I wanted to test a theory. Could a deliberately "dumb" AI model understand a complex data pipeline with no instructions at all?

I stripped out all the custom prompts. I switched from Claude Opus to Haiku—the small, cheap, fast model Anthropic positions for simple tasks. Then I ran a single command:

```bash
tree
```

The output showed our project structure:

```
temp/
├── entities/
│   ├── organizations.parquet
│   ├── people.parquet
│   └── addresses.parquet
└── scd/
    ├── location.parquet
    ├── manage.parquet
    ├── own.parquet
    └── person_address.parquet
```

I asked: "What is this project doing?"

Haiku's response was immediate and accurate. It identified that we were building entity tables for organizations, people, and addresses. It recognized "scd" as "Slowly Changing Dimensions"—the data warehousing pattern for tracking historical changes. It noted the DuckDB SQL scripts and the Makefile orchestration.

Zero prompting. Just good naming conventions.

This is the paradox at the heart of working with AI: the more conversational and natural your interaction, the more structured your underlying data needs to be.

## Why Structure Enables Fluency

Consider two versions of the same task.

Without structure:
```
Me: Show me some people
AI: What do you mean by people? What format? What database?
    What columns? How many? Current state or historical?

[30 minutes of clarification follow]
```

With proper ERD structure:
```
Me: Show me a sample of 25 people
AI: SELECT * FROM 'temp/entities/people.parquet' LIMIT 25

┌────────────┬──────┬────────────┐
│ person_id  │ sex  │ birth_year │
├────────────┼──────┼────────────┤
│ PP148348   │ male │      1986  │
│ PP152901   │ male │      1978  │
│ ...        │      │            │
└────────────┴──────┴────────────┘
```

Instant result. No ambiguity. No back-and-forth.

The conversation becomes efficient precisely because the data is unambiguous. "People" means one thing in this project: the `people.parquet` entity table with its defined schema. There's no room for misinterpretation.

## Less Context is Better

You might think the solution is better prompts. Explain your project in detail. Provide extensive documentation. Give the AI all the context it could possibly need.

Research suggests the opposite.

During our hackathon, we experimented with removing instructions rather than adding them. Generic guidance that wasn't relevant to the current task actually hurt performance. It consumed the context window. It could mislead the model into applying irrelevant patterns.

The insight crystallized: what you're not saying is as important as what you're saying. The less you load into the AI's context, the better it performs on your actual task—provided your data structure carries the meaning instead.

This flips the usual intuition. Instead of writing more documentation, invest in better naming. Instead of explaining your schema in prose, let the schema explain itself through conventions.

## Self-Documenting Architecture

Good structure is self-documenting. Compare these approaches:

| Bad | Good |
|-----|------|
| `data1.csv` | `temp/entities/people.parquet` |
| `process.sql` | `code/create/people.sql` |
| `valid`, `invalid` | `valid_from`, `valid_till` |
| `id` | `person_id`, `frame_id` |

The second column requires no explanation. The path tells you it's a temporary entity table. The column names tell you it's SCD2. The suffix tells you it's a primary key or foreign key.

Industry standards help enormously here. SQL is in the training data. SCD2 patterns are documented everywhere. ERD conventions are ancient and widespread. The AI has seen them countless times.

Use what the AI already knows. Don't invent novel conventions when standard ones exist.

## The Two-Layer Approach

We settled on a workflow with two distinct layers:

**Layer 1: Natural language interaction.** This is where you work with the AI—iterating on problems, exploring options, asking questions. No special syntax required. Speak English.

**Layer 2: Structured artifacts.** The outputs of Layer 1 are structured: SQL scripts, Parquet files, Makefiles. These have precise semantics. They're version-controlled. They're testable.

The magic happens at the interface between these layers. The AI translates your natural language into structured artifacts. But it can only do this well if the target structure is clear.

This is why we spent hours on entity table design before writing a single line of SQL. The upfront investment in structure paid dividends in every subsequent interaction.

## The Practical Takeaway

Before your next AI-assisted project:

1. **Design your schema first.** Entity tables, relation tables, clear primary keys, standard naming. This work pays compound interest.

2. **Name things conventionally.** `create/` for creation scripts, `test/` for tests, `valid_from` for temporal bounds. Don't be creative with names.

3. **Use standard formats.** Parquet is self-describing. SQL is universal. Makefiles are ancient but well-understood. These aren't just technically good choices—they're choices the AI recognizes.

4. **Skip the lengthy prompts.** If you need a page of instructions to explain your data, your data structure is wrong. Fix the structure, not the prompt.

The irony is inescapable: preparing for AI assistance looks exactly like preparing for human collaboration. Clear organization. Standard conventions. Self-documenting names. What makes code readable by humans makes it readable by AI.

Structure becomes more important with conversational AI, not less. But with AI, good structure is also easier to create and maintain. The investment pays off faster than ever.

---

*Based on a hackathon session at CEU MicroData, February 2026.*
