---
title: "Intelligence is Cheap"
description: The AI landscape has fundamentally shifted. Here's what researchers need to know.
sidebar:
  order: 1
---

Last Tuesday morning, I opened Open Router to check the model rankings. MiniMax M2.5 had processed 2.7 trillion tokens the previous week, making it the most-used model on the platform. Not GPT-4. Not Claude. A Chinese model most researchers have never heard of.

Why? Because it was free that week.

This single fact tells you everything about where AI is heading. Intelligence has become a commodity.

## The Commodity Thesis

A year ago, choosing an AI model was simple: GPT-4 for quality, GPT-3.5 for cost. Today, I count over 600 models on Open Router, with rankings that shift weekly. Kimi K2.5, GLM-5, DeepSeek, Qwen—names that sound like knockoff electronics brands are producing output quality indistinguishable from the big players.

The numbers are stark:

| Model | Quality Tier | Price (per 1M output tokens) |
|-------|-------------|------------------------------|
| MiniMax M2.5 | Very good | $1 (often free) |
| Kimi K2.5 | Very good | $1 |
| GLM-5 | Very good | ~$1 |
| Claude Opus 4.6 | Best | $25 |

The best model costs 25x more. For most research tasks—data cleaning, code generation, text analysis—the difference doesn't justify the cost.

This isn't a quirk of the moment. The trend is structural. Model architectures are converging. Training techniques spread through research papers. Compute costs fall. Competition from China intensifies. The gap between "very good" and "best" shrinks while the price gap persists.

## The Unbundling

The old model bundled everything together: intelligence + interface + billing + ecosystem. Companies like Cursor built entire products on this assumption—a beautiful IDE that happened to lock you into one model provider and their pricing.

I used to recommend Cursor enthusiastically. Now I think their time is over.

The new model unbundles. I use:
- **My favorite text editor** (VS Code, Sublime, whatever feels comfortable)
- **My favorite agent interface** (Open Code, a terminal-based tool)
- **Whichever model is cheapest** (via Open Router's aggregation)

Each layer can compete independently. When MiniMax runs a free promotion, I switch in seconds. When a new model appears on the benchmarks, I test it immediately. No subscription lock-in, no ecosystem friction.

This is how commodity markets work. When the underlying product becomes interchangeable, the competition shifts to distribution and interface. The intelligence itself becomes plumbing.

## The Aggregator Play

Open Router sits in the middle, routing requests to hundreds of models through a single API. You get one bill, one interface, and access to everything from free research models to the most expensive frontier systems.

For researchers, this matters. Our computing budgets are limited. A pipeline that costs $500 in Opus could cost $20 in MiniMax—and probably work just as well. The aggregator model lets you find out.

Beyond cost, aggregation solves the reliability problem. If one model is down or slow, traffic routes elsewhere. If a provider raises prices, alternatives exist. The monopolistic lock-in that characterized the first wave of AI products is disappearing.

## Practical Implications

**Don't lock in.** I've stopped recommending that people sign up for Google AI stuff or ChatGPT subscriptions or Anthropic credits directly. These lock you into one provider's ecosystem and pricing. Use aggregators instead.

**Default to cheap.** For daily coding tasks—writing SQL, cleaning data, generating boilerplate—use Kimi K2.5 or MiniMax. Save Opus for genuinely complex reasoning where quality differences matter.

**Test multiple models.** When something doesn't work, switch models before debugging your prompt. Often, a different model just handles the problem better. Some models are stronger at code, others at reasoning, others at following precise instructions. The optimal choice varies by task.

**Expect prices to fall.** What costs $25 today will cost $1 next year. What's cutting-edge now will be a free tier later. Don't optimize too hard for current pricing—build systems flexible enough to take advantage of the price drops that are coming.

## For Researchers

This matters especially for us. Research computing has always required making uncomfortable trade-offs between cost and capability. The cloud providers charge what the market will bear. High-performance computing requires either institutional access or painful budget negotiations.

AI is heading somewhere different. The competition is fierce. The marginal cost of intelligence is approaching zero. The most capable models will remain expensive, but "good enough" models will be essentially free.

Build your workflows to take advantage of this. Use open architectures. Avoid proprietary lock-in. Default to the cheapest option that works.

The speed of change is disorienting, but the direction is clear: more capable, more competitive, cheaper. Intelligence is becoming a commodity. Act accordingly.

---

*Based on a hackathon session at CEU MicroData, February 2026.*
