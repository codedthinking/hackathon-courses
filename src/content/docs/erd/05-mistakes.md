---
title: Common Mistakes
description: Anti-patterns in data modeling and how to avoid them.
sidebar:
  order: 5
---

## Mistake 1: The Single Table Too Early

> "If you don't do this, you create a single table too early, then you will keep chasing yourself around in recovery."

**Symptom**: You have one big table with everything. Analysis is "easy" - just filter and aggregate.

**Problem**: You lose track of what level the data is at.

> "Every single week, half of the meeting was about... this is supposed to be bid level, not tender level."

**Fix**: Keep entity and relation tables separate. Merge only at the last step, for a specific analysis.

## Mistake 2: Statistics Requires One Table

> "In statistics, everything is one table. You cannot do statistics... you're doing statistics on matrices."

**Reality**: Yes, you need one table for regression. But you should create that table from properly normalized sources.

```sql
-- Create analysis table from normalized sources
CREATE TABLE analysis AS
SELECT
    f.frame_id,
    f.industry,
    COUNT(DISTINCT o.person_id) as num_owners,
    SUM(o.share) as total_share
FROM organizations f
LEFT JOIN owns o ON f.frame_id = o.frame_id
WHERE o.valid_till IS NULL  -- current only
GROUP BY f.frame_id, f.industry;
```

Now you know exactly what you computed.

## Mistake 3: Mixing Entity and Relation Data

We made this mistake in the hackathon:

> "There is an error in the location tables. In own.csv and manage.csv, the address is the home address of the person."

We initially put person home addresses in the `location` table (which should only have organization locations).

**Fix**: Create separate relation tables:
- `location` - organization → address
- `person_address` - person → address

## Mistake 4: Not Testing PK Uniqueness

> "The people table has 3,894,436 total rows but only 3,013,739 unique person_ids. That means there are ~880,697 duplicate person_ids."

This breaks everything:
- Joins produce unexpected row multiplication
- Aggregations are wrong
- FK integrity checks fail silently

**Fix**: Test immediately after creating any entity table:

```sql
SELECT 'people: person_id unique' AS test,
    CASE WHEN COUNT(*) = COUNT(DISTINCT person_id)
         THEN 'PASS' ELSE 'FAIL' END AS result
FROM people;
```

## Mistake 5: Trusting the Agent

> "I always do these questions again and again: did you extract all variables? Did you extract all rows?"

The AI will confidently produce wrong results. It might:
- Filter out NULL values silently
- Use LIMIT without telling you
- Choose the wrong aggregation function

**Fix**: Always verify counts and samples.

## Mistake 6: Schemas in README

> "The schema is gonna be in the header of the parquet anyway. So that's another thing - why you shouldn't write these type of English [descriptions]... if they become out of sync, then your agent's gonna get confused."

Don't duplicate schema information in documentation. It will get stale. Let the data be self-documenting:
- Parquet files contain schema
- SQL files show the transformation
- Column names should be self-explanatory

## Mistake 7: Over-Engineering IDs

We debated this extensively:

> "Would you create a UUID for everyone? What about frame_id which is meaningful?"

**Practical advice**:
- Use source system IDs when they exist
- Create synthetic IDs only for entities without natural keys
- Maintain concordance tables for cross-source matching
- Don't over-engineer - you can always add complexity later
