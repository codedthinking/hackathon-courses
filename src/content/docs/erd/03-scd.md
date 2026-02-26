---
title: Slowly Changing Dimensions (SCD2)
description: Tracking historical changes in your data.
sidebar:
  order: 3
---

## The Problem: Things Change

A firm's manager changes. An owner sells their stake. A person moves.

If you just update the record, you lose history:

```sql
-- Before
UPDATE manages SET manager_id = 'Bob' WHERE firm_id = 1;
-- Now we don't know who managed before Bob
```

## SCD Type 2: Track History

Add `valid_from` and `valid_till` columns:

```sql
CREATE TABLE manages (
    firm_id VARCHAR,
    person_id VARCHAR,
    valid_from DATE,
    valid_till DATE
);
```

| firm_id | person_id | valid_from | valid_till |
|---------|-----------|------------|------------|
| 1 | Alice | 2020-01-01 | 2023-06-30 |
| 1 | Bob | 2023-07-01 | NULL |

Now you can query:
- **Current state**: `WHERE valid_till IS NULL`
- **Point in time**: `WHERE valid_from <= '2022-01-01' AND (valid_till IS NULL OR valid_till > '2022-01-01')`
- **Full history**: No filter

## Why "Slowly Changing"?

The term comes from data warehousing (Kimball methodology):

> "Dimensions vs facts... do a bit of Kimball. Star schema."

**Dimensions** are things that describe your data (who, what, where):
- People
- Firms
- Addresses
- Products

**Facts** are measurements (how much, how many):
- Sales
- Revenue
- Employment

Dimensions change slowly - a person's name rarely changes, but it can. Hence "slowly changing dimensions."

## AI Understands SCD

Here's the beautiful part: AI models are trained on this concept.

> "As soon as Haiku saw that the folder name was scd, it immediately realized that it's slowly changing dimension."

Name your folders and files conventionally:
- `temp/scd/` for relation tables with history
- `temp/entities/` for current-state entity tables
- `valid_from`, `valid_till` as column names

The AI will understand your intent without explanation.

## Implementation in SQL

```sql
-- Create SCD2 relation table
CREATE TABLE location AS
SELECT
    frame_id,
    address_id,
    valid_from,
    valid_till,
    loc_type
FROM (
    SELECT frame_id, address_id, valid_from, valid_till, 'hq' AS loc_type
    FROM read_csv_auto('input/hq.csv')
    UNION ALL
    SELECT frame_id, address_id, valid_from, valid_till, 'branch' AS loc_type
    FROM read_csv_auto('input/branch.csv')
);
```

## Querying SCD2 Tables

```sql
-- Current headquarters only
SELECT * FROM location
WHERE loc_type = 'hq' AND valid_till IS NULL;

-- All locations as of 2022
SELECT * FROM location
WHERE valid_from <= '2022-12-31'
  AND (valid_till IS NULL OR valid_till > '2022-12-31');

-- How many times has this firm moved?
SELECT frame_id, COUNT(*) as moves
FROM location
WHERE loc_type = 'hq'
GROUP BY frame_id
HAVING COUNT(*) > 1;
```
