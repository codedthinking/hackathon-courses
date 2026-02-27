---
title: Entity Table Design
description: Extracting unique entities from relational data.
sidebar:
  order: 2
---

## The Goal

Extract unique entities from messy source files:

```mermaid
flowchart LR
    subgraph Sources["Raw CSVs"]
        s1["branch.csv<br/>~500K rows"]
        s2["hq.csv<br/>~1.3M rows"]
        s3["site.csv<br/>~200K rows"]
        s4["manage.csv<br/>~3M rows"]
        s5["own.csv<br/>~4M rows"]
    end

    subgraph Entities["Entity Tables"]
        org["organizations.parquet<br/>1,284,668 unique"]
        ppl["people.parquet<br/>3,013,739 unique"]
        addr["addresses.parquet<br/>940,485 unique"]
    end

    s1 & s2 & s3 & s4 & s5 --> org
    s4 & s5 --> ppl
    s1 & s2 & s3 & s4 & s5 --> addr
```

## Organizations

The simplest entity - just extract unique `frame_id` values:

```sql
-- code/create/organizations.sql
CREATE TABLE organizations AS
SELECT DISTINCT frame_id
FROM (
    SELECT frame_id FROM read_csv_auto('input/motherlode-opten_20250104/branch.csv')
    UNION ALL
    SELECT frame_id FROM read_csv_auto('input/motherlode-opten_20250104/hq.csv')
    UNION ALL
    SELECT frame_id FROM read_csv_auto('input/motherlode-opten_20250104/site.csv')
    UNION ALL
    SELECT frame_id FROM read_csv_auto('input/motherlode-opten_20250104/manage.csv')
    UNION ALL
    SELECT frame_id FROM read_csv_auto('input/motherlode-opten_20250104/own.csv')
);

COPY organizations TO 'temp/entities/organizations.parquet' (FORMAT PARQUET);
```

Result: 1,284,668 unique organizations.

## People

People are more complex - they appear in `manage.csv` and `own.csv` with attributes:

```mermaid
flowchart TD
    subgraph Sources["Source Files"]
        m["manage.csv<br/>manager_id, sex, birth_year"]
        o["own.csv<br/>owner_id, sex, birth_year"]
    end

    subgraph Problem["The Duplication Problem"]
        r1["PP148348 | male | 1986"]
        r2["PP148348 | male | NULL"]
        r3["PP148348 | NULL | 1986"]
    end

    m --> r1
    o --> r2
    m --> r3
```

```sql
-- First attempt (WRONG)
CREATE TABLE people AS
SELECT DISTINCT person_id, sex, birth_year FROM (
    SELECT manager_id AS person_id, sex, birth_year FROM read_csv_auto('input/motherlode-opten_20250104/manage.csv')
    UNION ALL
    SELECT owner_id AS person_id, sex, birth_year FROM read_csv_auto('input/motherlode-opten_20250104/own.csv')
);
```

**Problem**: 3,894,436 rows but only 3,013,739 unique person_ids!

The same person has different `sex` or `birth_year` values across records (mostly NULL vs non-NULL). SQL's `DISTINCT` treats `(male, 1986)` and `(male, NULL)` as different tuples.

### The Fix: MODE() Aggregation

```mermaid
flowchart LR
    subgraph Input["Multiple Records"]
        i1["male, 1986"]
        i2["male, NULL"]
        i3["NULL, 1986"]
    end

    mode["MODE()<br/>Pick most frequent"]

    subgraph Output["Single Record"]
        o1["male, 1986"]
    end

    i1 & i2 & i3 --> mode --> o1
```

```sql
-- code/create/people.sql (CORRECT)
CREATE TABLE people AS
SELECT
    person_id,
    MODE(sex) AS sex,
    MODE(birth_year) AS birth_year
FROM (
    SELECT manager_id AS person_id, sex, birth_year
    FROM read_csv_auto('input/motherlode-opten_20250104/manage.csv')
    WHERE manager_id IS NOT NULL
    UNION ALL
    SELECT owner_id AS person_id, sex, birth_year
    FROM read_csv_auto('input/motherlode-opten_20250104/own.csv')
    WHERE owner_id IS NOT NULL
)
GROUP BY person_id;

COPY people TO 'temp/entities/people.parquet' (FORMAT PARQUET);
```

`MODE()` picks the most frequent value, preferring non-NULL over NULL.

Result: 3,013,739 unique people. All PKs unique.

## Addresses

Initial design only included organization addresses:

```sql
-- First attempt (INCOMPLETE)
CREATE TABLE addresses AS
SELECT DISTINCT address_id, settlement, WGS84_lon, WGS84_lat, EOV_X, EOV_Y
FROM (
    SELECT ... FROM read_csv_auto('input/motherlode-opten_20250104/branch.csv')
    UNION ALL
    SELECT ... FROM read_csv_auto('input/motherlode-opten_20250104/hq.csv')
    UNION ALL
    SELECT ... FROM read_csv_auto('input/motherlode-opten_20250104/site.csv')
);
```

**Problem discovered later**: `manage.csv` and `own.csv` contain person home addresses. FK integrity test failed!

### The Fix: Include All Address Sources

```sql
-- code/create/addresses.sql (CORRECT)
CREATE TABLE addresses AS
SELECT DISTINCT address_id, settlement, WGS84_lon, WGS84_lat, EOV_X, EOV_Y
FROM (
    -- Organization addresses (with geo data)
    SELECT address_id, settlement, WGS84_lon, WGS84_lat, EOV_X, EOV_Y
    FROM read_csv_auto('input/motherlode-opten_20250104/branch.csv') WHERE address_id IS NOT NULL
    UNION ALL
    SELECT address_id, settlement, WGS84_lon, WGS84_lat, EOV_X, EOV_Y
    FROM read_csv_auto('input/motherlode-opten_20250104/hq.csv') WHERE address_id IS NOT NULL
    UNION ALL
    SELECT address_id, settlement, WGS84_lon, WGS84_lat, EOV_X, EOV_Y
    FROM read_csv_auto('input/motherlode-opten_20250104/site.csv') WHERE address_id IS NOT NULL
    UNION ALL
    -- Person addresses (no geo data in source)
    SELECT address_id, NULL, NULL, NULL, NULL, NULL
    FROM read_csv_auto('input/motherlode-opten_20250104/manage.csv') WHERE address_id IS NOT NULL
    UNION ALL
    SELECT address_id, NULL, NULL, NULL, NULL, NULL
    FROM read_csv_auto('input/motherlode-opten_20250104/own.csv') WHERE address_id IS NOT NULL
);

COPY addresses TO 'temp/entities/addresses.parquet' (FORMAT PARQUET);
```

Person addresses have NULL geo data because the source doesn't provide it.

## The Lesson

Entity extraction seems simple but hides complexity:
- Duplicates from multiple sources
- Conflicting attribute values
- Missing entities that only appear in relations

Always test PK uniqueness immediately after creating an entity table.
