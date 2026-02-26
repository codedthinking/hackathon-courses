---
title: What is Entity Relational Modeling?
description: A 50-year-old concept that every researcher should understand.
sidebar:
  order: 1
---

## The Basics

Entity Relational Modeling (ERD) is a way of organizing data into:

1. **Entities** - Things that exist (people, firms, addresses)
2. **Relations** - Connections between things (manages, owns, lives_at)

> "It's a 50-year-old concept. It's very well researched. I think everybody should have understood this already."

Yet in economics and social sciences, ERD knowledge is rare:

> "There's very little knowledge of any of this in econ."

## Why This Matters

Without ERD, you end up with the "single table trap":

```
firm_id | firm_name | owner_id | owner_name | manager_id | manager_name | address
```

This seems convenient until:
- A firm has multiple owners
- An owner changes over time
- Someone asks "how many firms does this person own?"

Then you're constantly chasing yourself:

> "Every single week, half of the meeting was about... this is supposed to be bid level, not tender level. It's tender part level. Is this bidder level? No, it's bid level."

## The Solution: Separate Tables

**Entities** (nouns):
- `people` - one row per person
- `organizations` - one row per firm
- `addresses` - one row per address

**Relations** (verbs):
- `manages` - who manages which firm, when
- `owns` - who owns which firm, when, what share
- `location` - which firm is at which address, when

> "In a typical entity relational database, there are many more relation tables than entity tables."

## A Simple Example

Instead of:

| firm | owner | manager |
|------|-------|---------|
| Acme | Alice | Bob |
| Acme | Carol | Bob |

You have:

**firms**
| firm_id | name |
|---------|------|
| 1 | Acme |

**people**
| person_id | name |
|-----------|------|
| 1 | Alice |
| 2 | Bob |
| 3 | Carol |

**owns**
| firm_id | person_id |
|---------|-----------|
| 1 | 1 |
| 1 | 3 |

**manages**
| firm_id | person_id |
|---------|-----------|
| 1 | 2 |

Now queries are unambiguous:
```sql
-- How many owners does Acme have?
SELECT COUNT(*) FROM owns WHERE firm_id = 1;
-- Answer: 2

-- Who manages Acme?
SELECT p.name FROM manages m
JOIN people p ON m.person_id = p.person_id
WHERE m.firm_id = 1;
-- Answer: Bob
```
