// Email template system for FindX outreach
// Supports Dutch (default) and English with tone variants
// Dutch templates use formal "u" register for professional business communication

export type EmailTone = "professional" | "friendly" | "urgent";
export type EmailLanguage = "en" | "nl" | "ar";

export interface TemplateVariables {
  companyName: string;
  contactName: string;
  industry?: string;
  city: string;
  specificInsight: string;
  improvementArea: string;
  estimatedImpact: string;
  overallScore?: string;
  senderName: string;
  meetingLink: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: "cold_no_website" | "cold_has_website" | "followup_1" | "followup_2" | "breakup" | "meeting_confirm" | "proposal_followup";
  language: EmailLanguage;
  subject: string;
  body: string;
}

const TEMPLATES: EmailTemplate[] = [
  // --- Dutch templates (conversational, professional) ---
  {
    id: "nl_cold_no_website",
    name: "Cold Outreach, geen website (NL)",
    category: "cold_no_website",
    language: "nl",
    subject: "{{companyName}} online vindbaar maken",
    body: `Hi {{contactName}},

Ik keek recent naar de online aanwezigheid van {{industry}}-bedrijven in {{city}}. Wat me opviel: {{companyName}} heeft geen website.

In de {{industry}} zoekt 7 van de 10 klanten online naar een aanbieder. Zonder website bereikt u die groep niet. Concurrenten in {{city}} met een website krijgen die aanvragen al binnen.

Ik kan voor {{companyName}} een website opzetten die:
- Gevonden wordt bij lokale zoekopdrachten in {{city}}
- Past bij uw bedrijfsvoering
- Binnen twee weken online staat

Zullen we kort bellen? 15 minuten is genoeg om de mogelijkheden te bespreken.

[Plan een gesprek]({{meetingLink}})

Groet,
{{senderName}}`,
  },
  {
    id: "nl_cold_has_website",
    name: "Cold Outreach, verbetermogelijkheden (NL)",
    category: "cold_has_website",
    language: "nl",
    subject: "Iets opgevallen aan de site van {{companyName}}",
    body: `Hi {{contactName}},

Ik bekeek de website van {{companyName}} en één ding viel me op: {{specificInsight}}.

Bedrijven in de {{industry}} die dit soort punten aanpakken zien gemiddeld {{estimatedImpact}}. De logische volgende stap voor {{companyName}}: {{improvementArea}}.

Ik heb de volledige analyse met aanbevelingen klaar. Zullen we 15 min bellen zodat ik de bevindingen kan laten zien?

[Plan een gesprek]({{meetingLink}})

Groet,
{{senderName}}`,
  },
  {
    id: "nl_followup_1",
    name: "Follow-Up 1, 3 dagen (NL)",
    category: "followup_1",
    language: "nl",
    subject: "Re: {{originalSubject}}",
    body: `Hi {{contactName}},

Korte follow-up naar aanleiding van mijn analyse van {{companyName}}. Ik snap dat u het druk heeft, daarom houd ik het kort.

De bevindingen blijven actueel. Als het uitkomt plan ik graag een moment dat beter past.

[Plan een gesprek]({{meetingLink}})

Groet,
{{senderName}}`,
  },
  {
    id: "nl_followup_2",
    name: "Follow-Up 2, 7 dagen (NL)",
    category: "followup_2",
    language: "nl",
    subject: "Nog één ding over {{companyName}}",
    body: `Hi {{contactName}},

Nog één ding. Bij vergelijking met andere {{industry}}-bedrijven in {{city}} mist {{companyName}} een duidelijke kans: {{specificInsight}}.

Bedrijven die dit oppakken zien doorgaans {{estimatedImpact}}. Ik bewaar de analyse voor u.

Mocht u later geïnteresseerd zijn: [15 min bellen]({{meetingLink}}). Zo niet, dan stuur ik niets meer.

Groet,
{{senderName}}`,
  },
  {
    id: "nl_breakup",
    name: "Break-Up, 14 dagen (NL)",
    category: "breakup",
    language: "nl",
    subject: "Analyse {{companyName}} bewaard",
    body: `Hi {{contactName}},

Dit is mijn laatste bericht. Ik begrijp dat de timing nu niet uitkomt.

De analyse van {{companyName}} bewaar ik. Als u later de online aanwezigheid wilt verbeteren kunt u de bevindingen [hier bekijken]({{meetingLink}}).

Veel succes met {{companyName}}.

Groet,
{{senderName}}`,
  },
  {
    id: "nl_meeting_confirm",
    name: "Afspraakbevestiging (NL)",
    category: "meeting_confirm",
    language: "nl",
    subject: "Afspraak bevestigd: {{companyName}}",
    body: `Hi {{contactName}},

Bedankt voor uw tijd. Onze afspraak om de website-analyse van {{companyName}} te bespreken staat hierbij bevestigd.

Ik loop u door de bevindingen en geef concrete suggesties. Max 15 minuten.

[Bevestig de afspraak]({{meetingLink}})

Groet,
{{senderName}}`,
  },
  {
    id: "nl_proposal_followup",
    name: "Voorstel follow-up (NL)",
    category: "proposal_followup",
    language: "nl",
    subject: "Samenvatting voorstel voor {{companyName}}",
    body: `Hi {{contactName}},

Naar aanleiding van ons gesprek stuur ik u een samenvatting van de verbeterpunten voor {{companyName}}:

{{improvementArea}}

Verwachte impact: {{estimatedImpact}}.

Laat me weten of u hiermee verder wilt gaan.

[Bekijk het voorstel]({{meetingLink}})

Groet,
{{senderName}}`,
  },

  // --- English templates (conversational, professional) ---
  {
    id: "en_cold_no_website",
    name: "Cold Outreach, no website (EN)",
    category: "cold_no_website",
    language: "en",
    subject: "Getting {{companyName}} found online",
    body: `Hi {{contactName}},

I was recently looking at the online presence of {{industry}} businesses in {{city}}. One thing stood out: {{companyName}} doesn't have a website.

In the {{industry}}, 7 out of 10 customers search online for a provider. Without a website, those potential clients find your competitors instead. Businesses in {{city}} with a web presence get those inquiries on autopilot.

I can set up a website for {{companyName}} that:
- Ranks for local searches in {{city}}
- Fits your brand and professionalism
- Goes live within two weeks

Worth a quick chat? 15 minutes is all I need to walk you through it.

[Book a call]({{meetingLink}})

Best,
{{senderName}}`,
  },
  {
    id: "en_cold_has_website",
    name: "Cold Outreach, improvement opportunities (EN)",
    category: "cold_has_website",
    language: "en",
    subject: "Something I noticed about {{companyName}}'s site",
    body: `Hi {{contactName}},

I was looking at {{companyName}}'s website and one thing caught my eye: {{specificInsight}}.

Businesses in {{industry}} that fix this typically see {{estimatedImpact}}. The most impactful next step for {{companyName}}: {{improvementArea}}.

I've got the full analysis with concrete recommendations ready. Want to jump on a 15-minute call so I can show you what I found?

[Book a call]({{meetingLink}})

Best,
{{senderName}}`,
  },
  {
    id: "en_followup_1",
    name: "Follow-Up 1, 3 days (EN)",
    category: "followup_1",
    language: "en",
    subject: "Re: {{originalSubject}}",
    body: `Hi {{contactName}},

Quick follow-up on my analysis of {{companyName}}. I know you're busy so I'll keep it brief.

The findings are still relevant. Happy to find a time that works better for you.

[Book a call]({{meetingLink}})

Best,
{{senderName}}`,
  },
  {
    id: "en_followup_2",
    name: "Follow-Up 2, 7 days (EN)",
    category: "followup_2",
    language: "en",
    subject: "One more thing about {{companyName}}",
    body: `Hi {{contactName}},

One more thing. Comparing {{companyName}} to other {{industry}} businesses in {{city}}, there's a clear missed opportunity: {{specificInsight}}.

Companies that act on this typically see {{estimatedImpact}}. I'll keep the full analysis on file for you.

If you'd like to discuss later: [15-minute call]({{meetingLink}}). If not, no worries, I won't follow up again.

Best,
{{senderName}}`,
  },
  {
    id: "en_breakup",
    name: "Break-Up, 14 days (EN)",
    category: "breakup",
    language: "en",
    subject: "Saved the analysis for {{companyName}}",
    body: `Hi {{contactName}},

This is my last message. I get that the timing might not be right.

The analysis of {{companyName}} is saved. If you ever want to work on your online presence, you can [review the findings here]({{meetingLink}}).

Wishing {{companyName}} all the best.

Best,
{{senderName}}`,
  },
  {
    id: "en_meeting_confirm",
    name: "Meeting Confirmation (EN)",
    category: "meeting_confirm",
    language: "en",
    subject: "Confirmed: call about {{companyName}}",
    body: `Hi {{contactName}},

Thanks for your time. Our call to discuss the website analysis of {{companyName}} is confirmed.

I'll walk you through the findings with concrete suggestions. 15 minutes max.

[Confirm the appointment]({{meetingLink}})

Best,
{{senderName}}`,
  },
  {
    id: "en_proposal_followup",
    name: "Proposal Follow-Up (EN)",
    category: "proposal_followup",
    language: "en",
    subject: "Proposal summary for {{companyName}}",
    body: `Hi {{contactName}},

Following our conversation, here's a summary of what we discussed for {{companyName}}:

{{improvementArea}}

Expected impact: {{estimatedImpact}}.

Let me know if you'd like to move forward with this.

[View the proposal]({{meetingLink}})

Best,
{{senderName}}`,
  },

  // --- Arabic templates (conversational, professional) ---
  {
    id: "ar_cold_no_website",
    name: "Cold Outreach, لا يوجد موقع (AR)",
    category: "cold_no_website",
    language: "ar",
    subject: "جعل {{companyName}} ظاهرًا على الإنترنت",
    body: `مرحبًا {{contactName}},

كنت أبحث مؤخرًا في التواجد الرقمي لشركات {{industry}} في {{city}}. لاحظت أن {{companyName}} لا يمتلك موقعًا إلكترونيًا.

في مجال {{industry}}، يبحث 7 من كل 10 عملاء عبر الإنترنت عن مزوّد خدمة. بدون موقع، يذهب هؤلاء العملاء إلى المنافسين مباشرة.

يمكنني إنشاء موقع لـ {{companyName}}:
- يظهر في نتائج البحث المحلية في {{city}}
- يعكس هوية شركتكم
- يكون جاهزًا خلال أسبوعين

مكالمة قصيرة مدتها 15 دقيقة كافية لمناقشة الخيارات.

[احجز مكالمة]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_cold_has_website",
    name: "Cold Outreach, فرص تحسين (AR)",
    category: "cold_has_website",
    language: "ar",
    subject: "لاحظت شيئًا عن موقع {{companyName}}",
    body: `مرحبًا {{contactName}},

كنت أتصفح موقع {{companyName}} الإلكتروني ولاحظت أمرًا واحدًا: {{specificInsight}}.

الشركات في مجال {{industry}} التي تعالج هذه النقطة تشهد عادةً {{estimatedImpact}}. الخطوة التالية المنطقية لـ {{companyName}}: {{improvementArea}}.

لديّ التحليل الكامل مع توصيات عملية جاهزة. هل نجري مكالمة مدتها 15 دقيقة لأعرض عليكم النتائج؟

[احجز مكالمة]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_followup_1",
    name: "Follow-Up 1, 3 أيام (AR)",
    category: "followup_1",
    language: "ar",
    subject: "رد: {{originalSubject}}",
    body: `مرحبًا {{contactName}},

متابعة سريعة بخصوص تحليلي لـ {{companyName}}. أفهم أنكم مشغولون، سأكون موجزًا.

النتائج لا تزال ذات صلة. يسعدني تحديد موعد يناسبكم بشكل أفضل.

[احجز مكالمة]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_followup_2",
    name: "Follow-Up 2, 7 أيام (AR)",
    category: "followup_2",
    language: "ar",
    subject: "شيء أخير بخصوص {{companyName}}",
    body: `مرحبًا {{contactName}},

شيء أخير. عند مقارنة {{companyName}} ببقية شركات {{industry}} في {{city}}، هناك فرصة واضحة ضائعة: {{specificInsight}}.

الشركات التي تتحرك في هذا الاتجاه تشهد عادةً {{estimatedImpact}}. سأحتفظ بالتحليل الكامل لكم.

إذا رغبتم في المناقشة لاحقًا: [مكالمة 15 دقيقة]({{meetingLink}}). وإلا، لن أتواصل معكم مجددًا.

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_breakup",
    name: "Break-Up, 14 يوم (AR)",
    category: "breakup",
    language: "ar",
    subject: "حفظت تحليل {{companyName}}",
    body: `مرحبًا {{contactName}},

هذه رسالتي الأخيرة. أفهم أن التوقيت قد لا يكون مناسبًا الآن.

تحليل {{companyName}} محفوظ. إذا أردتم مستقبلًا تحسين التواجد الرقمي، يمكنكم [مراجعة النتائج هنا]({{meetingLink}}).

أتمنى لـ {{companyName}} كل التوفيق.

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_meeting_confirm",
    name: "تأكيد الموعد (AR)",
    category: "meeting_confirm",
    language: "ar",
    subject: "تأكيد: مكالمة بخصوص {{companyName}}",
    body: `مرحبًا {{contactName}},

شكرًا على وقتكم. مكالمتنا لمناقشة تحليل موقع {{companyName}} الإلكتروني مؤكدة.

سأعرض عليكم النتائج مع توصيات عملية. 15 دقيقة كحد أقصى.

[تأكيد الموعد]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_proposal_followup",
    name: "متابعة العرض (AR)",
    category: "proposal_followup",
    language: "ar",
    subject: "ملخص العرض لـ {{companyName}}",
    body: `مرحبًا {{contactName}},

بناءً على محادثتنا، إليكم ملخص نقاط التحسين لـ {{companyName}}:

{{improvementArea}}

الأثر المتوقع: {{estimatedImpact}}.

أخبروني إذا كنتم ترغبون في المضي قدمًا.

[عرض العرض]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
];

export function getTemplates(
  language: EmailLanguage = "en",
  category?: EmailTemplate["category"],
): EmailTemplate[] {
  let filtered = TEMPLATES.filter((t) => t.language === language);
  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }
  return filtered;
}

export function getTemplate(id: string): EmailTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function renderTemplate(
  template: EmailTemplate,
  vars: TemplateVariables,
): { subject: string; body: string } {
  let { subject, body } = template;
  const allVars: Record<string, string> = {
    ...vars,
    originalSubject: vars.specificInsight, // fallback for follow-ups
    overallScore: vars.overallScore ?? "—",
  };

  for (const [key, value] of Object.entries(allVars)) {
    const placeholder = `{{${key}}}`;
    subject = subject.replaceAll(placeholder, value);
    body = body.replaceAll(placeholder, value);
  }

  return { subject, body };
}

export function pickColdTemplate(
  hasWebsite: boolean,
  language: EmailLanguage = "en",
): EmailTemplate {
  const category = hasWebsite ? "cold_has_website" : "cold_no_website";
  const template = TEMPLATES.find(
    (t) => t.language === language && t.category === category,
  );
  if (!template) {
    throw new Error(`No cold template found for ${category} in ${language}`);
  }
  return template;
}
