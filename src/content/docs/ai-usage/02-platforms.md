---
title: Inference Platforms
description: How to access AI models without vendor lock-in.
sidebar:
  order: 2
---

## The Problem with Direct Subscriptions

If you sign up directly with OpenAI, Anthropic, or Google, you're locked into their ecosystem:

> "Don't sign up for Google AI stuff or ChatGPT AI stuff or Anthropic AI stuff. Because AI services are going to be buying on the open market for a very low price."

Direct subscriptions mean:
- You can only use their models
- You pay their prices (often higher)
- Switching costs are high
- You miss out on competition

## Open Router: The Aggregator Approach

[Open Router](https://openrouter.ai) provides access to 635+ models through a single API:

```bash
# Same API, any model
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "minimax/minimax-01",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Why This Matters

1. **Single billing** - One account, all models
2. **Easy switching** - Change model name, that's it
3. **Transparent pricing** - 5% markup, that's all
4. **Competition** - Route to cheapest provider automatically

### Price Comparison Tool

Use [models.dev](https://models.dev) to compare pricing across models. It's maintained by the Open Router team and shows real-time prices.

## Free Model Promotions

New models often launch with free tiers to gather training data:

> "New models, as they come out, they need more training data... they give it to inference platforms for one or two weeks for free."

This means you can often use cutting-edge models for free if you're willing to experiment.

## Anonymous Models

Some platforms offer "anonymous" models:

> "Picol is a name for an unknown model. If you're feeling adventurous, you can try Big Pico, and then maybe next week it's going to turn out it was Facebook's newest open source model."

These are often pre-release models being tested. Fun for experimentation, not for production.

## Recommendation

1. **Get an Open Router account** - It's the most flexible option
2. **Set a budget** - Easy to track spending
3. **Default to cheap models** - MiniMax, Kimi for daily work
4. **Route to expensive models** only for complex tasks
