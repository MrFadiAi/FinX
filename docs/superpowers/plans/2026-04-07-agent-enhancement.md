# Agent Enhancement: Richer Data + Human-Like Outreach

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give research and outreach agents more tools and skills so outreach emails use specific details from the lead's actual website and recommend a concrete service based on analysis gaps.

**Architecture:** Add existing tools to both agents' toolNames arrays, create new skills with targeted prompt patterns, update identity files with stronger writing rules, and wire richer analysis data through the orchestrator.

**Tech Stack:** TypeScript, Prisma seed, agent identity files (Markdown)

---

### Task 1: Update Research Agent toolNames

**Files:**
- Modify: `prisma/seed.ts:64`

- [ ] **Step 1: Update research agent toolNames**

In `prisma/seed.ts`, find the research agent's `toolNames` array at line 64:

```typescript
    toolNames: ["web_search", "kvk_search", "google_places_search", "scrape_page", "check_website", "extract_emails", "extract_social_links", "check_mx", "save_lead"],
```

Replace with:

```typescript
    toolNames: ["web_search", "kvk_search", "google_places_search", "scrape_page", "check_website", "extract_emails", "extract_social_links", "check_mx", "get_place_details", "check_ssl", "save_lead", "crawl_subpages", "extract_structured_data", "deep_place_details"],
```

This adds `get_place_details`, `check_ssl` (already used in enrichment but not declared), plus `crawl_subpages`, `extract_structured_data`, `deep_place_details`.

- [ ] **Step 2: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: add 5 tools to research agent for deep profiling"
```

---

### Task 2: Add Research Agent `deep_profiling` Skill

**Files:**
- Modify: `prisma/seed.ts:293` (after `website_verification` skill)

- [ ] **Step 1: Add the new skill to SKILLS array**

In `prisma/seed.ts`, after line 293 (the `website_verification` skill), add this new skill before the Analysis Agent Skills comment:

```typescript
  { agentName: "research", name: "deep_profiling", description: "After basic enrichment, crawl subpages and extract structured data for rich business profiles", toolNames: ["crawl_subpages", "extract_structured_data", "deep_place_details"], promptAdd: "After saving the basic lead data for the most promising leads (those with a website and email), gather deeper business intelligence:\n1. Use crawl_subpages on the lead's website (maxDepth=2) to scrape /about, /services, /team, /contact page content\n2. Use extract_structured_data to pull Schema.org business details (services offered, opening hours, price range)\n3. Use deep_place_details to get Google review excerpts, Q&A, and customer sentiment\n4. Save all results in the lead notes field as structured JSON with keys: services, aboutText, teamMembers, structuredData, reviewHighlights\nThis data is used by the outreach agent to write highly personalized emails. Prioritize deep profiling for the top 10 most promising leads.", sortOrder: 4, isActive: true },
```

- [ ] **Step 2: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: add deep_profiling skill to research agent"
```

---

### Task 3: Update Outreach Agent toolNames

**Files:**
- Modify: `prisma/seed.ts:283`

- [ ] **Step 1: Update outreach agent toolNames**

In `prisma/seed.ts`, find the outreach agent's `toolNames` at line 283:

```typescript
    toolNames: ["render_template", "save_outreach", "send_email", "extract_emails", "check_mx", "scrape_page", "web_search"],
```

Replace with:

```typescript
    toolNames: ["render_template", "save_outreach", "send_email", "extract_emails", "check_mx", "web_search", "scrape_page", "crawl_subpages", "extract_structured_data", "scrape_competitor_site", "analyze_forms_cta", "check_website"],
```

This adds `crawl_subpages`, `extract_structured_data`, `scrape_competitor_site`, `analyze_forms_cta`, `check_website` — tools the outreach agent needs to do its own research before writing.

- [ ] **Step 2: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: add 5 research tools to outreach agent for pre-write research"
```

---

### Task 4: Add Outreach Agent `deep_personalization` and `service_recommendation` Skills

**Files:**
- Modify: `prisma/seed.ts:305` (after `competitor_leverage` skill)

- [ ] **Step 1: Add two new skills to SKILLS array**

In `prisma/seed.ts`, after line 305 (the `competitor_leverage` skill), before the closing `];` of the SKILLS array, add:

```typescript
  { agentName: "outreach", name: "deep_personalization", description: "Before writing the email, research the lead's website for specific personalization details", toolNames: ["scrape_page", "crawl_subpages", "extract_structured_data"], promptAdd: "BEFORE drafting the email, gather specific personalization material:\n1. Read the analysis data carefully — identify serviceGaps and opportunities\n2. Use scrape_page or crawl_subpages on the lead's website to find:\n   - Owner/founder name (check /about or /team pages)\n   - Specific services they offer (exact names from their site)\n   - Recent projects, blog posts, or news items\n   - Something unique about their business (awards, certifications, specialties)\n3. Use extract_structured_data for structured business details\n4. Use this data to write an email that proves you actually visited their site\n\nMANDATORY: Reference at least 1 thing found directly on their website (not from analysis scores).\nExample: \"I saw on your site you offer kappers behandelingen — your balayage portfolio looks great.\"\nNOT: \"I came across your website and noticed you could improve.\"", sortOrder: 4, isActive: true },
  { agentName: "outreach", name: "service_recommendation", description: "Use analysis serviceGaps and opportunities to recommend a specific service the outreach should offer", toolNames: ["save_outreach"], promptAdd: "When writing the email, use the analysis data to recommend ONE specific service:\n1. Read the analysis.serviceGaps — these are features/services the lead is missing\n2. Read the analysis.opportunities — these are improvement areas with estimated impact\n3. Match the BIGGEST gap to a concrete service you can offer:\n   - No contact form → \"I can set up a contact form with lead capture\"\n   - Slow website → \"I can rebuild your site to load under 3 seconds\"\n   - No Google Business Profile → \"I can set up and optimize your Google Business Profile\"\n   - Missing SEO → \"I can get you ranking for [city] [industry] searches\"\n   - No online booking → \"I can add an online booking system to your site\"\n   - Poor mobile experience → \"I can make your site work perfectly on phones\"\n4. Frame the email around that ONE specific service + the specific finding that supports it\n5. Include a concrete next step: \"Shall I send you a quick mockup?\" or \"Can I show you what this would look like?\"\n\nThe email should feel like: \"I found this specific problem, here's exactly what I'd do to fix it, want to see?\"", sortOrder: 5, isActive: true },
```

- [ ] **Step 2: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: add deep_personalization and service_recommendation skills to outreach agent"
```

---

### Task 5: Update Orchestrator Outreach Context

**Files:**
- Modify: `src/agents/orchestrator/orchestrator.ts:401-421`

- [ ] **Step 1: Add richer analysis fields to outreach context**

In `src/agents/orchestrator/orchestrator.ts`, find the outreach context JSON at lines 401-421:

```typescript
        const outreachContext = JSON.stringify({
          language: outreachLanguage,
          lead: {
            id: lead.id,
            businessName: lead.businessName,
            city: lead.city,
            industry: lead.industry,
            website: lead.website,
            email: lead.email,
            phone: lead.phone,
          },
          analysis: {
            score: latestAnalysis.score,
            findings: latestAnalysis.findings,
            opportunities: latestAnalysis.opportunities,
            socialPresence: latestAnalysis.socialPresence,
            competitors: latestAnalysis.competitors,
            serviceGaps: latestAnalysis.serviceGaps,
            revenueImpact: latestAnalysis.revenueImpact,
          },
        }, null, 2);
```

Replace with:

```typescript
        const outreachContext = JSON.stringify({
          language: outreachLanguage,
          lead: {
            id: lead.id,
            businessName: lead.businessName,
            city: lead.city,
            industry: lead.industry,
            website: lead.website,
            email: lead.email,
            phone: lead.phone,
            notes: lead.notes,
          },
          analysis: {
            score: latestAnalysis.score,
            findings: latestAnalysis.findings,
            opportunities: latestAnalysis.opportunities,
            socialPresence: latestAnalysis.socialPresence,
            competitors: latestAnalysis.competitors,
            serviceGaps: latestAnalysis.serviceGaps,
            revenueImpact: latestAnalysis.revenueImpact,
            crawlData: latestAnalysis.crawlData,
            structuredData: latestAnalysis.structuredData,
            competitorAnalysis: latestAnalysis.competitorAnalysis,
            contentAudit: latestAnalysis.contentAudit,
            seoAudit: latestAnalysis.seoAudit,
            formData: latestAnalysis.formData,
          },
        }, null, 2);
```

This adds `lead.notes` (where deep profiling data is stored) and 6 additional analysis fields (`crawlData`, `structuredData`, `competitorAnalysis`, `contentAudit`, `seoAudit`, `formData`) that already exist in the Analysis model.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors related to the changed file. Pre-existing test errors are OK.

- [ ] **Step 3: Commit**

```bash
git add src/agents/orchestrator/orchestrator.ts
git commit -m "feat: pass richer analysis data and lead notes to outreach agent context"
```

---

### Task 6: Update Research Agent IDENTITY.md

**Files:**
- Modify: `agents/research/IDENTITY.md`

- [ ] **Step 1: Add Deep Profiling section**

At the end of the file, add:

```markdown

## Deep Profiling (After Basic Enrichment)

Once a lead has a verified website and basic contact info, gather deeper business intelligence for the top 10 most promising leads:

1. **Crawl subpages**: Call `crawl_subpages` with maxDepth=2 to scrape /about, /services, /team pages
2. **Extract structured data**: Call `extract_structured_data` to pull Schema.org LocalBusiness data (services, hours, price range)
3. **Deep Google details**: Call `deep_place_details` for review excerpts and popular times

Save all results in the lead's notes as structured JSON:
```json
{
  "services": ["web design", "SEO", "hosting"],
  "aboutText": "Founded in 2015 by Jan de Vries...",
  "teamMembers": ["Jan de Vries (founder)", "Lisa Bakker (designer)"],
  "structuredData": { "openingHours": "...", "priceRange": "€€" },
  "reviewHighlights": ["Great service", "Quick response time"]
}
```

Prioritize deep profiling for leads with the most complete data (website + email + industry). This data is critical for the outreach agent to write personalized emails.
```

- [ ] **Step 2: Commit**

```bash
git add agents/research/IDENTITY.md
git commit -m "feat: add deep profiling section to research agent identity"
```

---

### Task 7: Update Research Agent TOOLS.md

**Files:**
- Modify: `agents/research/TOOLS.md`

- [ ] **Step 1: Add new tools to documentation**

Find the section `## Planned Tools (not yet available)` at the end of the file. Before that section, add:

```markdown

## Deep Profiling
- **crawl_subpages**: Crawl subpages of a website. Returns content from /about, /services, /team, /contact pages. Use maxDepth=2 for best results.
- **extract_structured_data**: Extract Schema.org/JSON-LD structured data from a webpage. Returns LocalBusiness details, services, opening hours, price range.
- **deep_place_details**: Get rich Google Business Profile data — review excerpts, Q&A, photo count, popular times, detailed category info.
- **get_place_details**: Fetch Google Business profile — rating, review count, reviews, opening hours, category. Pass businessName + city or placeId.
- **check_ssl**: Check SSL/TLS certificate validity, issuer, expiry date, days remaining.
```

Then update the execution strategy — add a new step after "### Step 3: Google Places enrichment":

```markdown

### Step 2.5: Deep Profiling (for leads with websites)
For the most promising leads (have website + email):
1. `crawl_subpages` — get about, services, team page content
2. `extract_structured_data` — pull Schema.org business details
3. `deep_place_details` — get Google review excerpts

Save results in the lead notes as structured JSON with keys: services, aboutText, teamMembers, structuredData, reviewHighlights.
```

- [ ] **Step 2: Remove the Planned Tools section**

Delete the `## Planned Tools (not yet available)` section entirely since `crawl_subpages` and `extract_structured_data` are now available, and `domain_age_check` and `competitor_compare` are no longer planned for research.

- [ ] **Step 3: Commit**

```bash
git add agents/research/TOOLS.md
git commit -m "feat: document deep profiling tools in research agent tools guide"
```

---

### Task 8: Update Outreach Agent IDENTITY.md

**Files:**
- Modify: `agents/outreach/IDENTITY.md`

- [ ] **Step 1: Add Analysis-Driven Service Recommendations section**

Find the section `## Industry-Specific Hooks` in the file. Before it, add:

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

- [ ] **Step 2: Add Proof of Visit to Quality Checklist**

Find the `## Quality Checklist` section. After the existing checklist items, add:

```markdown
- [ ] Includes at least 1 detail found directly on the lead's website (not from analysis scores)
- [ ] Recommends ONE specific service tied to a specific finding from the analysis
```

- [ ] **Step 3: Commit**

```bash
git add agents/outreach/IDENTITY.md
git commit -m "feat: add service recommendations and proof-of-visit rules to outreach identity"
```

---

### Task 9: Update Outreach Agent SOUL.md

**Files:**
- Modify: `agents/outreach/SOUL.md`

- [ ] **Step 1: Add service-first and proof-of-visit sections**

Find the `### Opportunity Framing` section. After it, add:

```markdown

### The Service-First Approach
Never write a generic "we can help you improve" email. Instead:
1. Read the analysis data to find the #1 gap
2. Match it to a concrete deliverable ("a contact form with lead tracking", "a Google Business Profile optimized for [city]")
3. Write the email around offering THAT specific thing
4. Close with a specific, low-commitment ask ("Can I show you a quick mockup?")

### Proof You Were There
Every email must pass the "clipboard test": if you replaced the business name with any other business, would the email still make sense? If yes, it's too generic. Include something only someone who visited their site would know:
- Reference a specific service name exactly as it appears on their site
- Mention a team member by name from their /team page
- Quote a specific phrase from their about page
- Reference a recent blog post or project by name
```

- [ ] **Step 2: Commit**

```bash
git add agents/outreach/SOUL.md
git commit -m "feat: add service-first approach and proof-you-were-there rules to outreach soul"
```

---

### Task 10: Update Outreach Agent TOOLS.md

**Files:**
- Modify: `agents/outreach/TOOLS.md`

- [ ] **Step 1: Add new tools and pre-write research step**

Find the `## CRITICAL: No Send Capability` section. Before it, add:

```markdown

## Pre-Write Research
- **scrape_page**: Get additional context from a specific page on the lead's site. Use when you need details beyond what the analysis provided.
- **crawl_subpages**: Crawl /about, /services, /team pages for owner names, service lists, and business story.
- **extract_structured_data**: Pull structured business data (services, hours, price range) from the lead's site.
- **scrape_competitor_site**: Quick-scan a competitor's website for comparison data.
- **analyze_forms_cta**: Analyze forms and call-to-action buttons on the lead's site.
- **check_website**: Verify a website URL is accessible.

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

- [ ] **Step 2: Commit**

```bash
git add agents/outreach/TOOLS.md
git commit -m "feat: add pre-write research tools and execution step to outreach agent tools guide"
```

---

### Task 11: TypeScript Compile Check + Re-seed Database

**Files:**
- None (verification only)

- [ ] **Step 1: Run TypeScript compile check**

Run: `npx tsc --noEmit 2>&1 | grep -v "node_modules" | grep -v ".test.ts" | head -20`
Expected: No errors in source files (test file errors are pre-existing and acceptable).

- [ ] **Step 2: Re-seed the database**

Run: `npx tsx prisma/seed.ts`
Expected output: `Seeded X pipeline stages`, `Seeded 3 agents`, `Seeded X skills` (should show more skills than before: research 4, outreach 5).

- [ ] **Step 3: Verify agent tool counts**

Run the following query to verify:
```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const research = await prisma.agent.findUnique({ where: { name: 'research' } });
  const outreach = await prisma.agent.findUnique({ where: { name: 'outreach' } });
  console.log('Research tools:', research.toolNames.length, research.toolNames);
  console.log('Outreach tools:', outreach.toolNames.length, outreach.toolNames);
  const rSkills = await prisma.agentSkill.findMany({ where: { agentId: research.id } });
  const oSkills = await prisma.agentSkill.findMany({ where: { agentId: outreach.id } });
  console.log('Research skills:', rSkills.map(s => s.name));
  console.log('Outreach skills:', oSkills.map(s => s.name));
  await prisma.\$disconnect();
}
check();
"
```

Expected:
- Research: 14 tools, 4 skills (local_search, contact_extraction, website_verification, deep_profiling)
- Outreach: 12 tools, 5 skills (consultant_email, email_verification, competitor_leverage, deep_personalization, service_recommendation)

- [ ] **Step 4: Final commit if any fixes needed, or push**

```bash
git push origin main
```
