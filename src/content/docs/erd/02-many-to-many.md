---
title: Why Relations Need Separate Tables
description: Understanding many-to-many relationships and why you can't just add columns.
sidebar:
  order: 2
---

## The Many-to-Many Problem

Consider people living at addresses:

> "The same person can live at different addresses. And at the same address, different people can live."

This is a **many-to-many** relationship. You cannot represent it by adding columns to either table:

**Won't work - adding addresses to people:**
```
person_id | name  | address_1 | address_2 | address_3 | ...
```
How many columns? What if someone has 10 addresses?

**Won't work - adding people to addresses:**
```
address_id | street | person_1 | person_2 | person_3 | ...
```
Same problem in reverse.

## The Solution: Junction Tables

Create a third table that connects the two:

**people**
| person_id | name |
|-----------|------|
| 1 | Alice |
| 2 | Bob |

**addresses**
| address_id | street |
|------------|--------|
| 101 | Main St |
| 102 | Oak Ave |

**lives_at** (junction table)
| person_id | address_id |
|-----------|------------|
| 1 | 101 |
| 1 | 102 |
| 2 | 101 |

Now:
- Alice lives at Main St AND Oak Ave
- Bob lives at Main St
- Main St has two residents

> "That's why it's this relationship is becoming three tables, like the person table, the address table, and then the lives relationship."

## When You Can Embed

**One-to-one** relationships can be embedded:

```
person_id | name | mother_name
```

> "Everybody has one mother. At least in Hungary. And so then you could directly write it in the entity table."

**One-to-many** can sometimes be embedded:

```
firm_id | name | sole_owner_id
```

> "A solo entrepreneur has exactly one owner. So you could treat the sole entrepreneur as a firm but also record the person who's the owner right there."

But be careful:
- "One-to-many" often becomes "many-to-many" later
- Embedded relationships are harder to query aggregations
- When in doubt, use a junction table

## The Rule

If there's any chance the relationship could be many-to-many, make it a separate table from the start. It's easier to simplify later than to refactor a denormalized mess.
