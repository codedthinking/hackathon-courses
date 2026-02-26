---
title: "The 50-Year-Old Idea Every Researcher Should Know"
description: Entity Relational Modeling isn't new. But most economists never learned it.
sidebar:
  order: 3
---

## The Gap

> "It's a 50-year-old concept. It's very well researched. I think everybody should have understood this already."

Entity Relational Modeling (ERD) is foundational in computer science and data engineering. Yet in economics:

> "There's very little knowledge of any of this in econ."

We learn econometrics, time series, causal inference. We rarely learn data modeling. This gap costs us.

## The Single-Table Trap

Economics training teaches us matrices. Regressions operate on matrices. Stata loads one dataset at a time.

> "In statistics, everything is one table. You cannot do statistics... you're doing statistics on matrices."

So we create one big table early and work with it throughout the project. This seems efficient until:

> "Every single week, half of the meeting was about... this is supposed to be bid level, not tender level. It's tender part level. Is this bidder level?"

The procurement project that inspired this quote spent months untangling unit-of-observation confusion. A proper ERD would have prevented it.

## Entities and Relations

The core insight is simple:

**Entities** (nouns) - things that exist:
- Firms
- People
- Addresses
- Products

**Relations** (verbs) - connections between things:
- manages (firm ← person)
- owns (firm ← person)
- located_at (firm ← address)

Each gets its own table. Entity tables have one row per entity. Relation tables connect entity PKs.

## Why Separate Tables?

Because relationships are often many-to-many:

> "The same person can live at different addresses. And at the same address, different people can live."

You cannot represent this by adding columns. The only clean solution is a junction table:

```
lives_at(person_id, address_id, valid_from, valid_till)
```

## Historical Tracking (SCD2)

Things change. Managers leave. Owners sell. Firms move.

If you just update records, you lose history. SCD Type 2 adds time dimensions:

| frame_id | person_id | valid_from | valid_till |
|----------|-----------|------------|------------|
| 1 | Alice | 2020-01-01 | 2023-06-30 |
| 1 | Bob | 2023-07-01 | NULL |

Now you can query any point in time. This is called "Slowly Changing Dimensions" - a standard pattern from data warehousing.

## The Kimball Connection

Data warehousing has developed these ideas extensively. Ralph Kimball's work on dimensional modeling distinguishes:

**Dimensions** - descriptive attributes (who, what, where)
**Facts** - measurements (how much, how many)

> "I want to explain dimensions versus facts. So do a bit of Kimball. Star schema."

Understanding this vocabulary helps you communicate with data engineers and use tools designed around these concepts.

## When to Merge

Eventually you need one table for regression. The key is: merge late.

> "If you don't do this, you create a single table too early, then you will keep chasing yourself around in recovery."

Build your analysis table from normalized sources with explicit SQL:

```sql
CREATE TABLE analysis AS
SELECT
    f.frame_id,
    f.industry,
    COUNT(DISTINCT o.person_id) as num_owners
FROM organizations f
LEFT JOIN owns o ON f.frame_id = o.frame_id
WHERE o.valid_till IS NULL
GROUP BY f.frame_id, f.industry;
```

Now you know exactly what you computed. The unit of observation is clear.

## AI Makes It Easier

The good news: AI can write the SQL. AI understands ERD patterns. Once your data is structured properly, queries become natural language:

```
Me: How many firms have more than one owner?
AI: SELECT COUNT(*) FROM (
      SELECT frame_id FROM owns
      WHERE valid_till IS NULL
      GROUP BY frame_id HAVING COUNT(*) > 1
    );
```

> "Structure becomes more important with conversational and agentic AI, not less important."

But AI can't design your schema for you. That requires understanding your domain, your research questions, and these fundamental concepts.

## Getting Started

1. **Read Kimball** - "The Data Warehouse Toolkit" is the classic
2. **Learn SQL properly** - JOINs, GROUP BY, window functions
3. **Practice with DuckDB** - Fast, modern, great for research
4. **Draw your ERD first** - Before writing any code

The 50-year-old ideas are still the right ones. We just need to learn them.

---

*Based on a hackathon session at CEU MicroData, February 2026.*
