<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the docs-cost-calculator app. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+). A reverse proxy is configured in `next.config.js` so that PostHog requests route through `/ingest` rather than directly to PostHog's servers, making them less likely to be blocked by ad blockers. Five user-action events are captured in `app/page.tsx`, covering every meaningful interaction on the single-page app.

| Event name | Description | File |
|---|---|---|
| `documentation_analyzed` | User clicks "Calculate cost" and the analysis completes, capturing format, token count, and pricing model. | `app/page.tsx` |
| `example_loaded` | User clicks one of the example buttons to populate the input with a sample document. | `app/page.tsx` |
| `pricing_model_changed` | User selects a different pricing model from the dropdown while a document is loaded. | `app/page.tsx` |
| `documentation_cleared` | User clicks the Clear button to reset the input and results. | `app/page.tsx` |
| `external_link_clicked` | User clicks an outbound link to the research site or author page. | `app/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/509250/dashboard/1840283)
- [Analyses over time (wizard)](https://us.posthog.com/project/509250/insights/PXGv3G7q)
- [Analyses by pricing model (wizard)](https://us.posthog.com/project/509250/insights/9ixURlMv)
- [Example loads by type (wizard)](https://us.posthog.com/project/509250/insights/4hL6o3uh)
- [Pricing model switches (wizard)](https://us.posthog.com/project/509250/insights/ySwqHV7S)
- [External link clicks (wizard)](https://us.posthog.com/project/509250/insights/CoUx8Jbe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
