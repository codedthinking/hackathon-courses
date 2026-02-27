---
title: A Practical Workflow
description: How to actually use AI for research coding, with real examples.
sidebar:
  order: 4
---

## The Two-Layer Approach

Working with AI agents involves two very different modes:

1. **Natural language** - You talk to the agent in plain English
2. **Structured output** - The agent produces well-organized code and data

> "We're doing things at very different levels of abstraction. One is we're talking English to the agent... The other is a lot of structure."

The key insight: **the more structure you have underneath, the better the natural language interaction works**.

## Example: Querying Data

Without structure:
```
User: Show me some people
Agent: What do you mean by people? What format? What database?
       What columns? How many?
[30 minutes of back and forth]
```

With proper ERD structure:
```
User: show me a sample of 25 people
Agent: [runs immediately]
SELECT * FROM 'temp/entities/people.parquet' LIMIT 25
```

> "By this stage, it's not confusing to the agent at all because people, we have an entity relational model, I have an entity table called people. So that's what you mean."

## The AGENTS.md Debate

Should you put instructions in an `AGENTS.md` file that gets loaded into every conversation?

Recent research says: probably not.

> "What you're not saying is as important as what you're saying... If you say something that's not relevant or misleading, it will mislead it."

Generic instructions that aren't useful for the current task actually hurt performance.

**Exception**: If you're using niche tools the AI wasn't trained on:

> "Data or, you know, by default we're using some non-standard stuff that they were not really trained on. So telling them about this is useful."

For example: explaining what `bead` is, or how your specific Makefile structure works.

This is also where tiny operational details matter. If the tool is niche, the agent will not guess correctly (for example, how your team indexes data catalogs, or which command updates metadata). Put only the minimum needed for it to stop being confused.

## The Escape-Enter Workflow

The most common keyboard pattern when working with AI agents:

> "There are these memes where you have a very small keyboard and escape and then enter. I think it's very close to the agentic coding experience."

- **Enter**: Submit prompt, let it run
- **Escape**: Stop it when it's going wrong
- **Review**: Check the diff, accept or reject

## When the Agent Gets Confused

Sometimes the agent goes down the wrong path:

> "Sometimes you get so far in the argument that it becomes a toxic environment and you just refresh. Like, forget everything I said and start again."

This is because of the context window:

> "If you get closer to 100% [of context], then it will start summarizing and compacting... Better just delete it. It's like, forget it, it didn't happen."

**Practical tip**: Start a new session when things get messy. Don't try to fix a confused agent.

## Save What You Learn

After solving a problem, capture it:

> "You run, you solve a problem... but you want to save what you learned. So for example, if the skill was wrong, now it's updating the skill."

The workflow:
1. Solve the immediate problem
2. Ask the agent to update its skills
3. Commit the code
4. The next session starts smarter

## Testing as You Go

Don't wait until the end to test:

```sql
-- Verify PK uniqueness immediately after creating table
SELECT 'people: person_id unique' AS test,
    CASE WHEN COUNT(*) = COUNT(DISTINCT person_id)
         THEN 'PASS' ELSE 'FAIL' END AS result
FROM 'temp/entities/people.parquet';
```

> "This is good practice to save tests and run them from time to time."

Put tests in `code/test/`, run them with `make test`. The agent can write the tests for you.
