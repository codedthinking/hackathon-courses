---
title: Primary Keys and Foreign Keys
description: The glue that holds your data model together.
sidebar:
  order: 4
---

## Primary Keys: Identity

Every entity table needs a **primary key** - a column (or columns) that uniquely identifies each row.

```sql
-- Good: Each person has exactly one row
SELECT COUNT(*) as total,
       COUNT(DISTINCT person_id) as unique_pk
FROM people;
-- Should be equal!
```

| Table | Primary Key |
|-------|-------------|
| people | person_id |
| organizations | frame_id |
| addresses | address_id |

> "Verify that each row in each entity table has a distinct PK. This is quite important for ERD."

### The Duplicate Problem

In our hackathon, we found duplicates:

| Table | Total Rows | Unique PKs | Status |
|-------|------------|------------|--------|
| organizations | 1,284,668 | 1,284,668 | OK |
| people | 3,894,436 | 3,013,739 | **DUPLICATES** |
| addresses | 940,485 | 940,485 | OK |

The same person appeared multiple times with different `sex` or `birth_year` values (mostly NULL vs non-NULL).

**Fix**: Use `MODE()` to pick the most common value:

```sql
CREATE TABLE people AS
SELECT
    person_id,
    MODE(sex) AS sex,
    MODE(birth_year) AS birth_year
FROM raw_people
GROUP BY person_id;
```

## Foreign Keys: References

Relation tables use **foreign keys** to reference entity tables:

```sql
CREATE TABLE manages (
    frame_id VARCHAR,      -- FK to organizations
    person_id VARCHAR,     -- FK to people
    valid_from DATE,
    valid_till DATE
);
```

Every `frame_id` in `manages` should exist in `organizations`. Every `person_id` should exist in `people`.

### FK Integrity Tests

```sql
-- Test: All frame_ids in manages exist in organizations
SELECT 'manage.frame_id -> organizations' AS test,
    CASE WHEN (
        SELECT COUNT(DISTINCT frame_id)
        FROM manages
        WHERE frame_id NOT IN (SELECT frame_id FROM organizations)
    ) = 0 THEN 'PASS' ELSE 'FAIL' END AS result;
```

We run these tests automatically with `make test`.

## Meaningful vs Meaningless IDs

Software engineers prefer meaningless IDs:

> "Software engineers insist that IDs should be meaningless, either UUID or a counter. Because whenever you hang on to something meaningful, it's gonna change and you're gonna get screwed."

For example, using a tax ID as the primary key seems convenient - until the government changes the format.

But for research, meaningful IDs are convenient:

> "It's just so convenient to use these IDs from time to time."

**Our approach**: Use the source system's IDs (like `frame_id` from the company registry), but be prepared to maintain concordance tables when IDs change between versions.

## Composite Keys

Some tables have composite primary keys:

```sql
-- The "owns" relation is uniquely identified by:
-- firm + owner + start date
PRIMARY KEY (frame_id, person_id, valid_from)
```

This prevents duplicate entries for the same ownership period.

## The Concordance Problem

When integrating multiple data sources, you need concordance tables:

| our_id | source | source_id |
|--------|--------|-----------|
| 1 | opten | frame_123 |
| 1 | orbis | HU-456 |
| 2 | opten | frame_789 |

> "We would map that same ID to an Opten ID if they have one. And to a Parterre ID if they have one."

This lets you query across sources without losing track of which record came from where.
