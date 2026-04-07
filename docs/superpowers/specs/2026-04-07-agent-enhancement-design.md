# Agent Enhancement Design: Richer Data + Human-Like Outreach

**Date:** 2026-04-07
**Status:** Approved
**Approach:** Tools + Skills (Approach 1)

## Problem

Outreach emails feel AI-generated and generic. The outreach agent lacks specific details about each lead's business to write personalized, human-like emails. The research agent only scrapes homepages for basic contact info, missing services, team names, and business-specific details.

## Goals

1. Research agent gathers richer data (services, team, about page, structured data)
2. Outreach agent uses analysis data + its own research to write human-like emails
3. Outreach agent recommends a **specific service** based on analysis findings (serviceGaps, opportunities)
4. Every email references at least 2 concrete details found on the lead's actual website

## Non-Goals

- Follow-up email sequences (separate feature)
- Multi-channel outreach (phone/SMS/LinkedIn)
- A/B testing or performance tracking
- New tool file creation (all tools already exist)

---

## Changes

### 1. Research Agent

#### 1a. New Tools (3)

Add to research agent's `toolNames` in `prisma/seed.ts`:

| Tool | File | What it does |
|------|------|-------------|
| `crawl_subpages` | `src/agents/tools/crawl-subpages.ts` | Crawls /about, /services, /team, /contact subpages. Returns content per page. |
| `extract_structured_data` | `src/agents/tools/extract-structured-data.ts` | Pulls Schema.org/JSON-LD data: LocalBusiness details, services, hours, price range. |
| `deep_place_details` | `src/agents/tools/deep-place-details.ts` | Rich Google Business Profile: review excerpts, Q&A, photo count, popular times. |

**toolNames:** `["web_search", "kvk_search", "google_places_search", "check_website", "scrape_page", "extract_emails", "check_mx", "extract_social_links", "get_place_details", "check_ssl", "save_lead", "crawl_subpages", "extract_structured_data", "deep_place_details"]` (14 tools)

#### 1b. New Skill: `deep_profiling`

```yaml
name: deep_profiling
description: "After basic enrichment, crawl subpages and extract structured data for rich business profiles"
toolNames: ["crawl_subpages", "extract_structured_data", "deep_place_details"]
promptAdd: |
  After saving the basic lead data, gather deeper business intelligence:
  1. Use crawl_subpages on the lead's website to get /about, /services, /team page content
  2. Use extract_structured_data to pull Schema.org business details (services, hours, price range)
  3. Use deep_place_details to get Google review excerpts and customer sentiment
  Save all this data in the lead's notes field as structured JSON with keys: services, aboutText, teamMembers, structuredData, reviewHighlights.
  This data will be used by the outreach agent to write highly personalized emails.
sortOrder: 4
isActive: true
```

#### 1c. IDENTITY.md Update

Add section after "Enrichment Cascade":

```markdown
## Deep Profiling (After Basic Enrichment)

Once a lead has a verified website and basic contact info:

1. **Crawl subpages**: Call `crawl_subpages` with maxDepth=2 to scrape /about, /services, /team pages
2. **Extract structured data**: Call `extract_structured_data` to pull Schema.org LocalBusiness data
3. **Deep Google details**: Call `deep_place_details` for review excerpts and popular times

Save all results in the lead's notes as JSON:
```json
{
  "services": ["web design", "SEO", "hosting"],
  "aboutText": "Founded in 2015 by Jan de Vries...",
  "teamMembers": ["Jan de Vries (founder)", "Lisa Bakker (designer)"],
  "structuredData": { ... },
  "reviewHighlights": ["Great service", "Quick response"]
}
```

Prioritize this deep profiling for the top 10 most promising leads (those with websites and email).
```

#### 1d. TOOLS.md Update

Add the 3 new tools to the documentation section and add a new step in the execution strategy:

```markdown
### Step 2.5: Deep Profiling (for leads with websites)
For the most promising leads (have website + email):
1. `crawl_subpages` — get about, services, team page content
2. `extract_structured_data` — pull Schema.org business details
3. `deep_place_details` — get Google review excerpts

Save results in the lead notes as structured JSON.
```

---

### 2. Outreach Agent

#### 2a. New Tools (4)

Add to outreach agent's `toolNames` in `prisma/seed.ts`:

| Tool | File | What it does |
|------|------|-------------|
| `scrape_page` | `src/agents/tools/scrape-page.ts` | Scrape a specific page for content, contact info, metadata |
| `crawl_subpages` | `src/agents/tools/crawl-subpages.ts` | Crawl subpages for about, services, team content |
| `extract_structured_data` | `src/agents/tools/extract-structured-data.ts` | Pull Schema.org/JSON-LD business details |
| `scrape_competitor_site` | `src/agents/tools/scrape-competitor-site.ts` | Quick-scan a competitor site for comparison data |

**toolNames:** `["render_template", "save_outreach", "extract_emails", "check_mx", "web_search", "scrape_page", "crawl_subpages", "extract_structured_data", "scrape_competitor_site", "analyze_forms_cta", "check_website"]` (11 tools)

#### 2b. New Skills (2)

**Skill 1: `deep_personalization`**

```yaml
name: deep_personalization
description: "Before writing the email, research the lead's website for specific personalization details"
toolNames: ["scrape_page", "crawl_subpages", "extract_structured_data"]
promptAdd: |
  BEFORE drafting the email, gather specific personalization material:
  1. Read the analysis data carefully — identify serviceGaps and opportunities
  2. Use scrape_page or crawl_subpages on the lead's website to find:
     - Owner/founder name (check /about or /team pages)
     - Specific services they offer (exact names from their site)
     - Recent projects, blog posts, or news items
     - Something unique about their business (awards, certifications, specialties)
  3. Use extract_structured_data for structured business details
  4. Use this data to write an email that proves you actually visited their site

  MANDATORY: Reference at least 1 thing found directly on their website (not from analysis scores).
  Example: "I saw on your site you offer kappers behandelingen — your balayage portfolio looks great."
  NOT: "I came across your website and noticed you could improve."
sortOrder: 4
isActive: true
```

**Skill 2: `service_recommendation`**

```yaml
name: service_recommendation
description: "Use analysis serviceGaps and opportunities to recommend a specific service the outreach should offer"
toolNames: ["save_outreach"]
promptAdd: |
  When writing the email, use the analysis data to recommend ONE specific service:
  1. Read the analysis.serviceGaps — these are features/services the lead is missing
  2. Read the analysis.opportunities — these are improvement areas with estimated impact
  3. Match the BIGGEST gap to a concrete service you can offer:
     - No contact form → "I can set up a contact form with lead capture"
     - Slow website → "I can rebuild your site to load under 3 seconds"
     - No Google Business Profile → "I can set up and optimize your Google Business Profile"
     - Missing SEO → "I can get you ranking for [city] [industry] searches"
     - No online booking → "I can add an online booking system to your site"
     - Poor mobile experience → "I can make your site work perfectly on phones"
  4. Frame the email around that ONE specific service + the specific finding that supports it
  5. Include a concrete next step: "Shall I send you a quick mockup?" or "Can I show you what this would look like?"

  The email should feel like: "I found this specific problem, here's exactly what I'd do to fix it, want to see?"
sortOrder: 5
isActive: true
```

#### 2c. IDENTITY.md Update

Add after "Writing Style" section:

```markdown
## Analysis-Driven Service Recommendations

The analysis agent provides structured findings you MUST use:
- **serviceGaps**: Missing features/services the lead needs (e.g., "no contact form", "no online booking")
- **opportunities**: Improvement areas with estimated impact (e.g., "SEO optimization could increase traffic by 40%")
- **revenueImpact**: Estimated revenue loss from current issues

Your email should:
1. Pick the SINGLE highest-impact gap from serviceGaps
2. Match it to a specific service you offer
3. Frame the email around that ONE service + the supporting data point
4. Make a concrete, specific call to action

Example: "Your contact page has no form, and 68% of visitors expect one. I can add a lead capture form with automated follow-up. Want me to mock it up?"
```

Add to "Mandatory Specificity" section:

```markdown
### Proof of Visit
Every email must include at least ONE detail that proves you actually visited their website:
- Reference a specific service name as it appears on their site
- Mention a team member by name from their /team page
- Quote a specific phrase from their about page
- Reference a recent blog post or project by name
- Mention a specific page you found (e.g., "your /diensten page lists...")
```

#### 2d. SOUL.md Update

Add to "Behavioral Guidelines":

```markdown
### The Service-First Approach
Never write a generic "we can help you improve" email. Instead:
1. Read the analysis data to find the #1 gap
2. Match it to a concrete deliverable ("a contact form with lead tracking", "a Google Business Profile optimized for [city]")
3. Write the email around offering THAT specific thing
4. Close with a specific, low-commitment ask ("Can I show you a quick mockup?")

### Proof You Were There
Every email must pass the "clipboard test": if you replaced the business name with any other business, would the email still make sense? If yes, it's too generic. Include something only someone who visited their site would know.
```

#### 2e. TOOLS.md Update

Add the 4 new tools and update the execution strategy:

```markdown
## Pre-Write Research
- **scrape_page**: Get additional context from a specific page on the lead's site. Use when you need details beyond what the analysis provided.
- **crawl_subpages**: Crawl /about, /services, /team pages for owner names, service lists, and business story.
- **extract_structured_data**: Pull structured business data (services, hours, price range) from the lead's site.
- **scrape_competitor_site**: Quick-scan a competitor's website for comparison data.

### Updated Step 0: Pre-Write Research (NEW)
Before drafting, gather specific personalization material:
1. Read the analysis data — identify serviceGaps[0] (biggest gap) and opportunities[0] (biggest opportunity)
2. If the lead has a website, use crawl_subpages or scrape_page to find:
   - Owner/team member names
   - Exact service names as listed on their site
   - Something unique (awards, years in business, specialties)
3. Use extract_structured_data for structured details
4. You now have: specific finding + specific service to offer + proof you visited their site
```

---

### 3. Orchestrator Data Handoff

In `src/agents/orchestrator/orchestrator.ts`, update the outreach context to include richer analysis fields:

**Current outreach context includes:**
- `score`, `findings`, `opportunities`, `socialPresence`, `competitors`, `serviceGaps`, `revenueImpact`

**Add these fields:**
- `crawlData` — subpage content from research/analysis crawl_subpages calls
- `structuredData` — Schema.org data from extract_structured_data
- `competitorAnalysis` — competitor comparison from scrape_competitor_site
- `contentAudit` — content freshness data
- `seoAudit` — deep SEO audit data
- `formData` — form/CTA analysis
- `leadNotes` — the research agent's deep profiling notes (services, team, about text)

These fields already exist in the Analysis model. Just add them to the outreach context JSON.

---

### 4. Seed Data Changes

In `prisma/seed.ts`:

**Research agent** toolNames: 9 → 14 tools
```typescript
toolNames: [
  "web_search", "kvk_search", "google_places_search",
  "check_website", "scrape_page", "extract_emails", "check_mx",
  "extract_social_links", "get_place_details", "check_ssl",
  "save_lead",
  "crawl_subpages", "extract_structured_data", "deep_place_details"
]
```

**Research agent** skills: 3 → 4 skills (add `deep_profiling`)

**Outreach agent** toolNames: 7 → 11 tools
```typescript
toolNames: [
  "render_template", "save_outreach",
  "extract_emails", "check_mx", "web_search",
  "scrape_page", "crawl_subpages", "extract_structured_data",
  "scrape_competitor_site", "analyze_forms_cta", "check_website"
]
```

**Outreach agent** skills: 3 → 5 skills (add `deep_personalization`, `service_recommendation`)

---

## Acceptance Criteria

- [ ] Research agent has 14 tools registered (9 existing + 3 new + save_lead + check_ssl)
- [ ] Research agent has `deep_profiling` skill active
- [ ] Outreach agent has 11 tools registered (7 existing + 4 new)
- [ ] Outreach agent has `deep_personalization` and `service_recommendation` skills active
- [ ] Outreach context in orchestrator includes crawlData, structuredData, competitorAnalysis, leadNotes
- [ ] Outreach IDENTITY.md has "Analysis-Driven Service Recommendations" and "Proof of Visit" sections
- [ ] Outreach SOUL.md has "Service-First Approach" and "Proof You Were There" sections
- [ ] Research IDENTITY.md has "Deep Profiling" section
- [ ] TypeScript compiles with no new errors
- [ ] Database re-seeded with updated agent configs

## Assumptions

- All 15 analyzer tools are already implemented and registered in tool-registry.ts (done in prior session)
- The Analysis model already has JSON fields for crawlData, structuredData, competitorAnalysis, etc. (migrated in prior session)
- The tool-registry already imports and maps all 36 tools (verified in prior session)
- The orchestrator already fetches the Analysis record for outreach — just needs to pass more fields

## Technical Context

- Tools are registered in `src/agents/core/tool-registry.ts` via a central Map
- Agent configs are stored in the `Agent` database model, seeded from `prisma/seed.ts`
- Skills are stored in `AgentSkill` table, also seeded
- The orchestrator builds the outreach context JSON in `orchestrator.ts` lines ~372-438
- Agent identity files in `agents/{name}/IDENTITY.md` are the dev source of truth, seeded into DB
