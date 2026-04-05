// AI-powered email generation with personalization
// Builds structured prompts referencing lead data and analysis findings

import type { EmailTone, EmailLanguage } from "./templates.js";
import { pickColdTemplate, renderTemplate, type TemplateVariables } from "./templates.js";
import { simpleChat } from "../../agents/core/client.js";

export interface LeadContext {
  businessName: string;
  industry?: string;
  city: string;
  hasWebsite: boolean;
  website?: string;
  contactName?: string;
  email?: string;
  findings?: Array<{
    category: string;
    title: string;
    description: string;
    severity: "critical" | "warning" | "info";
  }>;
  opportunities?: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  overallScore?: number;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  htmlBody: string;
  language: EmailLanguage;
  tone: EmailTone;
  personalizedDetails: {
    specificInsight: string;
    improvementArea: string;
    estimatedImpact: string;
    contactName: string;
  };
}

// Build the Claude prompt for personalized email generation
function buildGenerationPrompt(
  lead: LeadContext,
  tone: EmailTone,
  language: EmailLanguage,
): string {
  const langLabel = language === "nl" ? "Dutch" : language === "ar" ? "Arabic" : "English";
  const toneGuide = {
    professional: "Conversational and professional. Like a consultant who actually reviewed the site and is sharing what they found. Direct, factual, data-driven. In Dutch: use conversational 'je/jij' register (not formal 'u'). No superlatives, no jargon.",
    friendly: "Warm and approachable. Like a colleague sharing a helpful observation. Still factual. In Dutch: use 'je/jij'.",
    urgent: "Matter-of-fact emphasis on what is being lost right now. Stay respectful, not pushy. In Dutch: use 'je/jij'.",
  }[tone];

  const contactName = lead.contactName || lead.businessName;

  const findingsSummary = lead.findings?.length
    ? lead.findings
        .slice(0, 5)
        .map((f) => `- [${f.severity}] ${f.category}: ${f.title}: ${f.description}`)
        .join("\n")
    : "No detailed analysis available.";

  const opportunitiesSummary = lead.opportunities?.length
    ? lead.opportunities
        .slice(0, 3)
        .map((o) => `- ${o.title}: ${o.description} (Impact: ${o.impact})`)
        .join("\n")
    : "";

  const prompt = `You are writing a cold outreach email for someone who actually reviewed a business website. Based on real audit data, write three short, specific text snippets in ${langLabel}.

TONE: ${toneGuide}

LEAD DATA:
- Company: ${lead.businessName}
- Industry: ${lead.industry || "Unknown"}
- City: ${lead.city}
- Has website: ${lead.hasWebsite ? "Yes" : "No"}
${lead.website ? `- Website: ${lead.website}` : ""}
- Overall website score: ${lead.overallScore ?? "N/A"}/100

ANALYSIS FINDINGS:
${findingsSummary}
${opportunitiesSummary ? `\nOPPORTUNITIES:\n${opportunitiesSummary}` : ""}

YOUR TASK:
Write exactly these 3 fields. Sound like a real person who looked at their website, not a robot filling in a template. Reference real data.

Output a JSON object with exactly these fields:
{
  "specificInsight": "One concrete thing you noticed, written conversationally. Like you are telling a friend what you saw. Must reference an actual metric or fact. Not a generic compliment. Max 120 chars. NO em dashes.",
  "improvementArea": "The single most impactful action they can take. Phrase it as a natural suggestion, not corporate jargon. Max 100 chars.",
  "estimatedImpact": "A realistic, quantified benefit (e.g. '30% more requests via Google', '2x faster load time'). Keep it believable. Max 60 chars."
}

Rules:
- Reference actual findings. Every field must contain a specific, verifiable claim.
- For no-website leads: focus on the gap and what competitors gain from being online.
- For low-scoring websites: focus on the highest-severity finding.
- Write in ${langLabel}.
- No hype words (never use: 'geweldig', 'fantastisch', 'amazing', 'incredible', 'revolutionary', 'optimize', 'leverage').
- No vague promises ('more customers', 'betere resultaten'). Be precise.
- NEVER use em dashes (" -- " or " — ").
- "specificInsight" should sound like someone genuinely sharing what they found, not a salesperson.

Respond with ONLY the JSON object, no other text.`;

  return prompt;
}

function plainTextToHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, "<br>\n");
}

export async function generatePersonalizedEmail(
  lead: LeadContext,
  tone: EmailTone = "professional",
  language: EmailLanguage = "nl",
): Promise<GeneratedEmail> {
  // Step 1: Generate personalized details using Claude
  const prompt = buildGenerationPrompt(lead, tone, language);

  const raw = await simpleChat(prompt, { maxTokens: 512 });

  let details: { specificInsight: string; improvementArea: string; estimatedImpact: string };
  try {
    // Extract JSON from response (model may wrap in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    details = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  const contactName = lead.contactName || lead.businessName;

  // Step 2: Pick template and render with personalized details
  const template = pickColdTemplate(lead.hasWebsite, language);
  const vars: TemplateVariables = {
    companyName: lead.businessName,
    contactName,
    industry: lead.industry || "lokale markt",
    city: lead.city,
    specificInsight: details.specificInsight,
    improvementArea: details.improvementArea,
    estimatedImpact: details.estimatedImpact,
    overallScore: lead.overallScore != null ? String(lead.overallScore) : undefined,
    senderName: "FindX",
    meetingLink: "https://findx.nl/plan-gesprek",
  };

  const { subject, body } = renderTemplate(template, vars);

  return {
    subject,
    body,
    htmlBody: plainTextToHtml(body),
    language,
    tone,
    personalizedDetails: {
      specificInsight: details.specificInsight,
      improvementArea: details.improvementArea,
      estimatedImpact: details.estimatedImpact,
      contactName,
    },
  };
}

// Generate tone variants for A/B testing
export async function generateToneVariants(
  lead: LeadContext,
  language: EmailLanguage = "nl",
): Promise<Record<EmailTone, GeneratedEmail>> {
  const [professional, friendly, urgent] = await Promise.all([
    generatePersonalizedEmail(lead, "professional", language),
    generatePersonalizedEmail(lead, "friendly", language),
    generatePersonalizedEmail(lead, "urgent", language),
  ]);

  return { professional, friendly, urgent };
}
