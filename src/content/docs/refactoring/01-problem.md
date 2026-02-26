---
title: The Problem
description: Master data management for Hungarian company registry data.
sidebar:
  order: 1
---

## The Data Sources

We have Hungarian company registry data in CSV files:

| File | Contents |
|------|----------|
| `branch.csv` | Branch office locations |
| `hq.csv` | Headquarters locations |
| `site.csv` | Other sites |
| `manage.csv` | Management relationships |
| `own.csv` | Ownership relationships |

These come from Opten, a commercial data provider. The data is loaded via `bead`:

```bash
bead input load motherlode-opten_20250104
```

## The Problem

The raw CSVs are not properly normalized:
- Same person appears in both `manage.csv` and `own.csv`
- Addresses are mixed: organization addresses (HQ, branch) and person addresses (home)
- No explicit entity tables - entities are embedded in relations
- Duplicates everywhere

## What We Need

A proper relational model:

**Entity Tables** (temp/entities/):
- `organizations.parquet` - unique firms
- `people.parquet` - unique people
- `addresses.parquet` - unique addresses

**Relation Tables** (temp/scd/):
- `location.parquet` - org → address
- `manage.parquet` - org → person (manager)
- `own.parquet` - org → person (owner)
- `person_address.parquet` - person → address (home)

## The Scale

| Entity | Count |
|--------|-------|
| Organizations | 1,284,668 |
| People | 3,013,739 |
| Addresses | 940,485+ |

This is manageable with DuckDB on a laptop. No need for distributed systems.

## The Tools

- **DuckDB**: Fast analytical SQL database
- **Parquet**: Columnar storage format
- **Make**: Build orchestration
- **SQL scripts**: One per output table

```makefile
# Example Makefile recipe
temp/entities/people.parquet: code/create/people.sql input/manage.csv input/own.csv
    mkdir -p $(dir $@)
    duckdb < $<
```

## The Approach

1. Explore the raw data
2. Design the entity tables
3. Design the relation tables
4. Write SQL scripts for each table
5. Test PK uniqueness and FK integrity
6. Iterate when bugs are found
