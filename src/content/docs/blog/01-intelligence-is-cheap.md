---
title: "Intelligence is Cheap"
description: The AI landscape has fundamentally shifted. Here's what researchers need to know.
sidebar:
  order: 1
---

## The Commodity Thesis

A year ago, choosing an AI model was simple: GPT-4 for quality, GPT-3.5 for cost. Today, I count over 600 models on Open Router, with rankings that shift weekly.

> "AI intelligence is becoming a commodity. Lots of competition and very cheap."

This isn't hyperbole. Last week, MiniMax M2.5 processed 80 billion tokens - making it the most used model on the platform. Why? Because it was free that week. It's roughly comparable to models costing $25 per million tokens.

## The Numbers

| Model | Quality Tier | Price (per 1M output tokens) |
|-------|-------------|------------------------------|
| MiniMax M2.5 | Very good | $1 (often free) |
| Kimi K2.5 | Very good | $1 |
| GLM-5 | Very good | ~$1 |
| Claude Opus 4.6 | Best | $25 |

The best model costs 25x more. For most research tasks, the difference doesn't justify the cost.

## The Unbundling

The old model bundled everything: intelligence + interface + billing + ecosystem. Companies like Cursor built entire products on this assumption.

> "I think their time is over, honestly."

The new model unbundles. I use:
- **My favorite text editor** (VS Code, Sublime, whatever)
- **My favorite agent interface** (Open Code, terminal-based)
- **Whichever model is cheapest** (via Open Router)

Each layer can compete independently. When a better model appears, I switch in seconds.

## Practical Implications

**1. Don't lock in**

> "Don't sign up for Google AI stuff or ChatGPT AI stuff or Anthropic AI stuff."

Direct subscriptions lock you into one provider's ecosystem and pricing. Use aggregators like Open Router instead.

**2. Default to cheap**

For daily coding tasks, use Kimi K2.5 or MiniMax. Save Opus for genuinely complex reasoning.

**3. Test multiple models**

When something doesn't work, switch models before debugging your prompt. Often, a different model just handles it better.

**4. Expect prices to fall**

What costs $25 today will cost $1 next year. Don't optimize too hard for current pricing.

## For Researchers

This matters especially for us. Research computing budgets are limited. A pipeline that costs $500 in Opus could cost $20 in MiniMax - and probably work just as well.

The speed of change is disorienting, but the direction is clear: more capable, more competitive, cheaper. Build your workflows to take advantage of this.

---

*Based on a hackathon session at CEU MicroData, February 2026.*
