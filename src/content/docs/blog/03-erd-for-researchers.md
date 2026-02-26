---
title: "The 50-Year-Old Idea Every Researcher Should Know"
description: Entity Relational Modeling isn't new. But most economists never learned it.
sidebar:
  order: 3
---

Three months into a procurement data project, we were still arguing about units of observation.

"This is supposed to be bid-level, not tender-level."

"It's tender-part level."

"Is this bidder level?"

Every week, half the meeting went to untangling the same confusion. We had built our analysis table early, merged everything together, and lost track of what each row represented. Every join introduced ambiguity. Every aggregation could be wrong.

This was a team of PhD economists. We knew econometrics, time series, causal inference. We didn't know data modeling.

## The Gap

Entity Relational Modeling is foundational in computer science and data engineering. The concept is 50 years old. It's taught in every introductory database course. Data engineers use it daily.

Yet in economics, there's almost no mention of it. The textbooks skip it. The courses don't teach it. We learn to manipulate matrices, not to design schemas.

I think everybody should have understood this already. The gap costs us.

## The Single-Table Trap

Economics training teaches us to think in matrices. Regressions operate on matrices. Stata loads one dataset at a time. The workflow is: create one big table, run commands on it, publish results.

So we create the analysis table early and work with it throughout the project. This seems efficient. It isn't.

The problem is that a single merged table obscures its origins. What did we aggregate? What did we join? What got dropped in the merge? The table exists, but its meaning is lost.

The procurement project was extreme, but not unusual. I've seen the same pattern in firm-level datasets, linked employer-employee data, network analysis. Merge early, regret later.

## Entities and Relations

The core insight of ERD is simple: separate things from connections.

**Entities** are nouns—things that exist independently:
- Firms
- People
- Addresses
- Products

Each entity gets its own table. Each row represents one instance. Each has a primary key—a unique identifier.

**Relations** are verbs—connections between entities:
- manages (firm ← person)
- owns (firm ← person)
- located_at (firm ← address)

Each relation gets its own table. Each row represents one connection. Each references entity tables through foreign keys.

This seems abstract until you try to represent a many-to-many relationship without it.

## Why Separate Tables?

Consider people and addresses. The same person can live at different addresses over time. The same address can house different people. This is many-to-many.

You cannot represent this by adding columns to either table. How many address columns does a person need? How many person columns does an address need? The numbers vary by row. The structure breaks.

The only clean solution is a junction table:

```
lives_at(person_id, address_id, valid_from, valid_till)
```

One row per person-address combination. Clear semantics. No structural ambiguity.

In our hackathon data, we had four such relations:
- `location`: org ↔ address (HQ, branches, sites)
- `manage`: org ↔ person (management roles)
- `own`: org ↔ person (ownership stakes)
- `person_address`: person ↔ address (home addresses)

All many-to-many. All requiring separate tables.

## Historical Tracking

Things change. Managers leave. Owners sell. Firms relocate.

If you just update records, you lose history. When did the change happen? What was the previous state? You don't know.

SCD Type 2 (Slowly Changing Dimensions) adds time bounds:

| frame_id | person_id | valid_from | valid_till |
|----------|-----------|------------|------------|
| 1 | Alice | 2020-01-01 | 2023-06-30 |
| 1 | Bob | 2023-07-01 | NULL |

Alice managed firm 1 from 2020 until June 2023. Bob has managed it since July 2023 (NULL means still active).

Now you can query any point in time. Who managed firm 1 in February 2022? Alice. The data knows.

This is a standard pattern from data warehousing. Ralph Kimball documented it decades ago. Every serious data infrastructure uses it. Most researchers have never heard of it.

## When to Merge

Eventually you need one table for regression. The point isn't to avoid merging—it's to merge late and deliberately.

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

Now you know exactly what you computed. The unit of observation is unambiguous: one row per organization. The query is explicit: counting distinct current owners. The aggregation is visible: GROUP BY.

This is reproducible. Reviewers can follow it. Future you can understand it. The procurement confusion doesn't happen.

## AI Makes It Easier

The good news: AI understands ERD patterns. Once your data is properly structured, queries become natural language:

```
Me: How many firms have more than one owner?
AI: SELECT COUNT(*) FROM (
      SELECT frame_id FROM owns
      WHERE valid_till IS NULL
      GROUP BY frame_id HAVING COUNT(*) > 1
    );
```

The AI generates correct SQL because the structure is unambiguous. There's no confusion about what "firms" means (organizations table), what "owners" means (owns relation), what "current" means (valid_till IS NULL).

Structure becomes more important with AI, not less. But with AI, the investment in structure pays off faster. You design the schema once, and every subsequent query flows naturally.

AI can't design your schema for you, though. That requires understanding your domain, your research questions, and these fundamental concepts that economics training skipped.

## Getting Started

1. **Read Kimball.** "The Data Warehouse Toolkit" is the classic. It's written for practitioners, not theorists.

2. **Learn SQL properly.** JOINs, GROUP BY, window functions. This is the language of structured data.

3. **Practice with DuckDB.** It's fast, modern, and designed for analytical work. Good for datasets from thousands to billions of rows.

4. **Draw your ERD first.** Before writing any code. Entity boxes, relation lines, primary keys, foreign keys. Make the structure explicit.

The ideas are 50 years old. They're still right. We just need to learn them.

---

*Based on a hackathon session at CEU MicroData, February 2026.*
