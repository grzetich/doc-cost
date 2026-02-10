# Docs Cost Calculator

**What your documentation costs AI to read.**

Paste API documentation in any structured format (JSON, YAML, OpenAPI specs) and instantly see the token cost across format alternatives. Understand how format choices compound at scale when AI systems consume your docs thousands of times per day.

## Why this exists

Every AI-assisted developer tool, from code completion to chatbots with tool use, consumes your documentation as tokens. The format you choose for that documentation has a direct, measurable impact on how much it costs to process.

Most teams don't think about this. They should.

This tool makes the invisible visible: paste your docs, see the cost, compare formats, and project the difference at scale.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **js-tiktoken** (client-side BPE tokenization)
- **js-yaml** (format conversion)
- Deployed on **Vercel**

## Getting started

```bash
git clone https://github.com/grzetich/docs-cost-calculator.git
cd docs-cost-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys needed. All tokenization happens client-side.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/grzetich/docs-cost-calculator)

## How it works

1. Paste structured documentation (JSON, YAML, or plain text)
2. The app detects the format and generates equivalent representations in alternative formats
3. Each format is tokenized using cl100k_base encoding (the same tokenizer used by GPT-4 and Claude)
4. Results show token counts, cost estimates, and savings projections at scale

## What I learned building this

This project grew out of ongoing research into how AI systems consume API documentation. Some findings that informed the design:

- Format choice can reduce token consumption significantly, but the "cheapest" format isn't always the most effective for LLM comprehension
- Structural clarity (consistent schemas, predictable nesting) often matters more than raw token count
- The real cost isn't a single API call. It's the compound effect across thousands of daily interactions between AI tools and your documentation

More on my research: [grzeti.ch](https://grzeti.ch)

## License

MIT
