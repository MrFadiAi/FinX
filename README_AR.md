<div dir="rtl">

# FindX

<div align="center">
  **توقف عن الاتصال العشوائي. ابدأ بالبحث الذكي بالذكاء الاصطناعي.**

 FindX يكتشف الشركات، يحلل مواقعها الإلكترونية، ويكتب رسائل تواصل شخصية — كل ذلك تلقائياً باستخدام 3 وكلاء.

  <img src="images/dashboard.png" alt="لوحة تحكم FindX" width="100%" />


  العربية | [ English ](README.md)

  [![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ادعم%20المشروع-FFDD00?style=flat&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/mrarabai)

  --- 
</div>

<p align="center">
  <img src="images/agent-pipeline.png" alt="خط أنابيب الوكلاء" width="100%" />
</p>

## كيف يعمل

ثلاثة وكلاء ذكاء اصطناعي يعملون بالتسلسل، بشكل آلي بالكامل:

1. **وكيل البحث** — يجد الشركات المطابقة لاستعلامك عبر سجلات تجارية متعددة الدول (هولندا، بريطانيا، ألمانيا، فرنسا، بلجيكا، أمريكا، الإمارات، والمزيد) و Google Places. يدعم البحث بالإنجليزية والهولندية والعربية.
2. **وكيل التحليل** — يدقق كل موقع باستخدام Lighthouse، يكتشف التقنيات المستخدمة، يقيّم من 0–100، يحدد الفرص بما في ذلك إمكانات الأتمتة وتسريب الإيرادات
3. **وكيل التواصل** — يكتب رسائل تواصل شخصية بالإنجليزية أو الهولندية أو العربية تشير إلى نتائج محددة (مثل *"موقعك يحتاج 8.2 ثانية للتحميل"*)

**اكتشف ← حلل ← تواصل ← تتبع**

> **دعم متعدد اللغات**: ابحث بالإنجليزية أو الهولندية أو العربية. يتم إنشاء رسائل التواصل باللغة المختارة — مع دعم كامل للعربية للشركات في الشرق الأوسط وشمال أفريقيا.

<p align="center">
  <img src="images/pipeline-kanban.png" alt="لوحة كانبان" width="100%" />
</p>

أدِر كل عميل محتمل عبر لوحة كانبان بالسحب والإفلات — من الاكتشاف إلى الربح/الخسارة.

---

## المتطلبات الأساسية

| المتطلب | الإصدار | السبب |
|---------|---------|-------|
| **Node.js** | 20+ | بيئة تشغيل خادم API وأدوات البناء |
| **npm** | 10+ | مدير الحزم |
| **Docker** | الأحدث | يشغل PostgreSQL و Redis ومتصفح Lightpanda و SearXNG |
| **Git** | الأحدث | التحكم بالإصدارات |
| **مفتاح AI API** | — | واجهة GLM أو OpenAI لتوليد الرسائل |

## دليل التثبيت (خطوة بخطوة)

### الخطوة 1: النسخ والتثبيت

```bash
git clone https://github.com/MrFadiAi/FinX.git
cd FinX
npm install
```

### الخطوة 2: تشغيل البنية التحتية

```bash
docker compose up -d
```

هذا يشغل أربع حاويات Docker:

| الخدمة | المنفذ | الغرض |
|--------|--------|-------|
| PostgreSQL | 5432 | قاعدة البيانات |
| Redis | 6379 | طوابير المهام في الخلفية |
| Lightpanda | 9222 | متصفح خفيف لاستخراج البيانات |
| SearXNG | 8080 | محرك بحث موحد للبحث على الويب (يستخدمه الوكلاء) |

تحقق من تشغيلها:

```bash
docker compose ps
```

### الخطوة 3: إعداد البيئة

```bash
cp .env.example .env
```

افتح `.env` واملأ القيم **المطلوبة** كحد أدنى:

```env
# مطلوب — التطبيق لن يعمل بدونها
DATABASE_URL=postgresql://findx:findx@localhost:5432/findx
REDIS_URL=redis://localhost:6379

# مطلوب — ميزات الذكاء الاصطناعي
GLM_API_KEY=your-api-key-here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
GLM_MODEL=glm-5.1
```

**اختياري** (للوظائف الكاملة):

```env
# إرسال البريد — بدونه تُحفظ الرسائل كمسودات فقط
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=hello@yourdomain.com

# مصادر بيانات الأعمال (دعم دولي)
KVK_API_KEY=your-kvk-key
GOOGLE_MAPS_API_KEY=your-google-key
```

### الخطوة 4: إعداد قاعدة البيانات

```bash
npm run db:migrate
npm run db:seed
```

### الخطوة 5: تشغيل خادم API

```bash
npm run dev
```

خادم API يعمل على **http://localhost:3001**. تحقق:

```bash
curl http://localhost:3001/api/health
```

### الخطوة 6: تشغيل لوحة التحكم

افتح **طرفية جديدة** وشغّل:

```bash
npm run dev:web
```

لوحة التحكم تعمل على **http://localhost:3000**.

---

## ماذا يفعل FindX

1. **الاكتشاف** — يجد الشركات عبر سجلات تجارية متعددة (KVK, Companies House, Handelsregister) و Google Places
2. **التحليل** — يدقق المواقع بـ Lighthouse، يكتشف التقنيات، يقيّم من 0-100
3. **التواصل** — ينشئ رسائل تواصل شخصية بـ **الإنجليزية أو الهولندية أو العربية** باستخدام الذكاء الاصطناعي
4. **التتبع** — يراقب فتح الرسائل والردود والارتدادات عبر Resend

## استخدام التطبيق

### لوحة التحكم (`/`)

نظرة عامة على خط الأنابيب — إجمالي العملاء المحتملين، المحللين، المتواصل معهم، والمكاسب. رسم بياني لتوزيع النقاط.

### خط الأنابيب (`/pipeline`)

لوحة كانبان مع العملاء المحتملين عبر المراحل: مكتشف ← قيد التحليل ← محلل ← قيد التواصل ← تم الرد ← مؤهل ← ربح/خسارة.

### الوكلاء (`/agents`)

تبويبان:
- **خط الأنابيب** — شغّل خط تنقيب الذكاء الاصطناعي. أدخل استعلام بحث مثل "مطاعم في أمستردام"، اختر اللغة (**إنجليزية** أو **هولندية** أو **عربية**)، واضغط تشغيل.
- **الوكلاء** — عرض وتكوين كل وكيل (الهوية، الشخصية، الأدوات، المهارات).

### الإعدادات (`/settings`)

- **مزودو الذكاء الاصطناعي** — تكوين والتبديل بين 8 مزودي ذكاء اصطناعي (GLM, Anthropic, OpenAI, Ollama, DeepSeek, Groq, MiniMax, Kimi). اختبار الاتصال وتعيين المزود الافتراضي.
- **مزودو البريد الإلكتروني** — ربط Gmail (OAuth2)، تكوين SMTP (مثل Namecheap)، أو استخدام Resend. التبديل بين المزودين من لوحة التحكم.
- **إدارة البيانات** — مسح جميع البيانات، إعادة تهيئة الوكلاء، استيراد/تصدير CSV.

## دعم اللغات

يمكن توليد رسائل التواصل بثلاث لغات:

| اللغة | الرمز | النمط |
|-------|-------|-------|
| **الإنجليزية** | `en` | إنجليزية احترافية، تهجئة بريطانية |
| **الهولندية** | `nl` | هولندية رسمية (أسلوب u/uw)، عناوين هولندية |
| **العربية** | `ar` | عربية فصحى احترافية، دعم كامل للاتجاه من اليمين لليسار |

## الميزات الرئيسية

### نظام مزودي الذكاء الاصطناعي المتعدد

التبديل بين 8 مزودي ذكاء اصطناعي من لوحة التحكم — بدون تغيير الكود:

| المزود | البروتوكول | ملاحظات |
|--------|------------|---------|
| GLM / ZhipuAI | OpenAI | الافتراضي، مختبر جيداً |
| Anthropic | Messages API | نماذج Claude |
| OpenAI | OpenAI | نماذج GPT |
| Ollama | OpenAI | نماذج محلية، مجاني |
| DeepSeek | OpenAI | اقتصادي |
| Groq | OpenAI | استدلال سريع |
| MiniMax | OpenAI | السوق الصيني |
| Kimi / Moonshot | OpenAI | سياق طويل |

### نظام مزودي البريد الإلكتروني المتعدد

إرسال رسائل التواصل عبر 3 مزودين مختلفين:

- **Gmail** — تدفق OAuth2 كامل (تفويض، تحديث تلقائي للرموز)
- **SMTP** — أي خادم SMTP (Namecheap, Outlook, إلخ). إعدادات افتراضية لـ Namecheap
- **Resend** — إرسال بريد عبر API

### أدوات الوكلاء (21 أداة)

| الأداة | الغرض |
|-------|-------|
| `web_search` | البحث في الويب عبر SearXNG |
| `scrape_page` | استخراج محتوى الموقع |
| `check_website` | التحقق من عمل الموقع |
| `run_lighthouse` | تدقيق أداء Lighthouse |
| `detect_tech` | كشف التقنيات المستخدمة |
| `take_screenshot` | التقاط لقطة شاشة |
| `extract_emails` | البحث عن عناوين البريد |
| `extract_social_links` | البحث عن حسابات التواصل الاجتماعي |
| `check_ssl` | فحص شهادة SSL/TLS |
| `check_mx` | التحقق من سجلات MX للبريد |
| `check_mobile_friendly` | تقييم التوافق مع الهاتف |
| `domain_age_check` | فحص عمر النطاق |
| `get_place_details` | جلب ملف Google Business + التقييمات |
| `competitor_compare` | مقارنة المنافسين عبر SearXNG |
| `kvk_search` | بحث الغرفة التجارية الهولندية |
| `google_places_search` | بحث Google Places |
| `save_lead` | حفظ عميل محتمل |
| `save_analysis` | حفظ نتائج التحليل |
| `save_outreach` | حفظ مسودة البريد |
| `render_template` | تطبيق قالب بريد (EN/NL/AR) |
| `send_email` | إرسال بريد معتمد |

### نظام مهارات الوكلاء

حقن قواعد التحقق في مطالبات الوكلاء أثناء التشغيل:

| المهارة | الوكيل | الغرض |
|---------|--------|-------|
| جودة البريد الهولندي | التواصل | فحص التناسق الرسمي، الكشف عن التعابير الإنجليزية |
| خصوصية التواصل | التواصل | يتطلب مرجعين محددين على الأقل لكل بريد |
| اكتمال التحليل | التحليل | التحقق من الحقول المطلوبة والنتائج الرقمية |

### تسجيل النقاط التلقائي

تسجيل تلقائي للعملاء المحتملين على مقياس 0-100:

- **اكتمال البيانات (0-30)**: اسم الشركة، المدينة، القطاع، العنوان، رقم الغرفة التجارية
- **جودة الموقع (0-40)**: وجود موقع، نتيجة تحليل الموقع
- **قابلية التواصل (0-30)**: بريد، هاتف، سجلات MX صالحة، حسابات تواصل اجتماعي

يتم تصنيف العملاء كـ **بارد** (< 40)، **دافئ** (40-70)، أو **ساخن** (> 70).

### العمليات المجمعة

- **تحليل مجمّع** — جدولة تحليل لما يصل إلى 100 عميل محتمل لديهم مواقع
- **تواصل مجمّع** — جدولة إنشاء رسائل تواصل لما يصل إلى 100 عميل محلل
- **تحديث حالة مجمّع** — نقل مجموعة من العملاء بين المراحل
- **استيراد CSV** — استيراد عملاء مع اكتشاف تلقائي للعناوين (إنجليزي، هولندي، snake_case)
- **تصدير CSV** — تصدير العملاء والرسائل (مُصفّى، حتى 5000 صف)

### تقارير PDF

إنشاء تقارير PDF مُعلَّمة لأي تحليل — تتضمن تفصيل النقاط والنتائج والفرص والتوصيات.

## التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| API | Fastify (Node.js, TypeScript, ESM) |
| قاعدة البيانات | PostgreSQL 16 عبر Prisma ORM |
| الطوابير | BullMQ (مدعوم بـ Redis) |
| الذكاء الاصطناعي | متعدد المزودين: GLM, Anthropic, OpenAI, Ollama, DeepSeek, Groq, MiniMax, Kimi |
| البريد | متعدد المزودين: Gmail (OAuth2), SMTP (Nodemailer), Resend |
| المتصفح | Lightpanda (CDP) + Playwright Chromium |
| البحث | SearXNG (محرك بحث موحد، 70+ محرك) |
| الواجهة | Next.js 15, React 19, Tailwind 4 |
| استخراج البيانات | Cheerio + Playwright |
| بيانات الأعمال | KVK Open API, Google Places API |
| التدقيق | Lighthouse |
| التقارير | PDFKit (تقارير PDF مُعلَّمة) |

## الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل API مع إعادة التحميل (المنفذ 3001) |
| `npm run dev:web` | تشغيل لوحة تحكم Next.js (المنفذ 3000) |
| `npm run build` | فحص تجميع TypeScript |
| `npm run build:web` | بناء Next.js للإنتاج |
| `npm run db:migrate` | تشغيل ترحيلات Prisma |
| `npm run db:seed` | تهيئة المراحل + 3 وكلاء |
| `npm run db:studio` | فتح Prisma Studio |
| `npm run test` | تشغيل الاختبارات (Vitest) |
| `npm run typecheck` | فحص أنواع TypeScript |

## مثال الاستخدام

```bash
# تشغيل خط الأنابيب بالكامل (رسائل إنجليزية)
curl -X POST http://localhost:3001/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"query":"restaurants in Amsterdam","language":"en","maxResults":10}'

# تشغيل برسائل هولندية
curl -X POST http://localhost:3001/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"query":"tandartsen in Rotterdam","language":"nl","maxResults":5}'

# تشغيل برسائل عربية (مثال: شركات في دبي)
curl -X POST http://localhost:3001/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"query":"restaurants in Dubai","language":"ar","maxResults":5}'

# تحليل عميل واحد
curl -X POST http://localhost:3001/api/leads/{leadId}/analyze \
  -H "Content-Type: application/json" \
  -d '{"sync":true}'

# إنشاء وإرسال رسالة تواصل
curl -X POST http://localhost:3001/api/leads/{leadId}/outreach/generate \
  -H "Content-Type: application/json" \
  -d '{"sync":true,"tone":"professional","language":"nl"}'

# إضافة مزود ذكاء اصطناعي جديد
curl -X POST http://localhost:3001/api/ai-providers \
  -H "Content-Type: application/json" \
  -d '{"type":"openai","apiKey":"sk-...","baseUrl":"https://api.openai.com/v1","model":"gpt-4o"}'

# اختبار اتصال مزود
curl -X POST http://localhost:3001/api/ai-providers/{id}/test

# إعداد SMTP
curl -X POST http://localhost:3001/api/email/smtp \
  -H "Content-Type: application/json" \
  -d '{"host":"mail.privateemail.com","port":465,"user":"hello@yourdomain.com","password":"xxx","fromEmail":"hello@yourdomain.com","fromName":"FindX"}'

# استيراد عملاء من CSV
curl -X POST http://localhost:3001/api/leads/import \
  -F "file=@leads.csv"
```

## مخطط قاعدة البيانات

13 نموذج Prisma:

| النموذج | الوصف | الحقول الرئيسية |
|---------|-------|----------------|
| **Lead** | سجل الشركة | businessName, city, website, status, leadScore, kvkNumber, source |
| **Analysis** | نتائج تدقيق الموقع | score (0-100), findings, opportunities, techStack, socialPresence, competitors, serviceGaps, revenueImpact |
| **Outreach** | سجل البريد | subject, body, tone, language, status, personalizedDetails |
| **PipelineStage** | أعمدة كانبان | name, order |
| **Agent** | تكوين وكيل AI | identityMd, soulMd, toolsMd, toolNames, model, pipelineOrder |
| **AgentSkill** | قواعد التحقق من الوكيل | promptAdd, toolNames, sortOrder |
| **AgentLog** | سجلات التنفيذ | phase, tokens, duration, output |
| **AgentPipelineRun** | سجل تشغيل خط الأنابيب | query, status, leadsFound, leadsAnalyzed, emailsDrafted |
| **AiProvider** | تكوين مزود الذكاء الاصطناعي | type (8 أنواع), apiKey, baseUrl, model, isDefault |
| **SmtpConfig** | تكوين SMTP | host, port, user, fromEmail, fromName |
| **EmailSetting** | تفضيلات البريد | defaultProvider (gmail/smtp/resend) |
| **EmailProviderToken** | رموز OAuth2 | provider, accessToken, refreshToken, expiry |

**حالات العميل**: `discovered` ← `analyzing` ← `analyzed` ← `contacting` ← `responded` ← `qualified` ← `won` / `lost`

**حالات التواصل**: `draft` ← `pending_approval` ← `approved` ← `sent` ← `opened` / `replied` / `bounced` / `failed`

## خط أنابيب الوكلاء

جوهر FindX هو خط أنابيب من 3 مراحل مع 21 أداة و3 مهارات مُتحقَقة:

1. **وكيل البحث** — يأخذ استعلام بحث (مثل "مطاعم في أمستردام") ويجد الشركات المطابقة عبر عدة دول باستخدام بحث الويب (SearXNG)، سجلات الأعمال المحلية (KVK، Companies House، Handelsregister، إلخ)، و Google Places. يحفظهم كعملاء محتملين مع إزالة التكرار التلقائية.

2. **وكيل التحليل** — لكل عميل لديه موقع، يشغل تدقيقات Lighthouse، يكتشف التقنيات المستخدمة، يفحص SSL، يقيّم الموقع من 0-100، يفحص التوافق مع الهاتف، عمر النطاق، ويحدد فرص الأتمتة مع تقديرات تأثير الإيرادات. ينشئ تقارير PDF مُعلَّمة.

3. **وكيل التواصل** — يقرأ نتائج التحليل وينشئ رسائل تواصل شخصية بالإنجليزية (`en`) أو الهولندية (`nl`) أو العربية (`ar`) من 21 قالب ثلاثي اللغات (7 فئات × 3 لغات). يشير إلى نتائج محددة (مثل "موقعك يحتاج 8.2 ثانية للتحميل"). المهارات تتحقق من جودة البريد قبل الحفظ.

الوكلاء قابلة للتخصيص بالكامل عبر لوحة التحكم — تعديل الهوية والشخصية والأدوات والمهارات وحتى نموذج الذكاء الاصطناعي المستخدم لكل وكيل في `/agents/[name]`.

## نقاط نهاية API

جميع النقاط تحت `/api/`.

### العملاء المحتملون

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/leads/discover` | تشغيل اكتشاف العملاء |
| POST | `/api/leads` | إنشاء عميل يدوياً |
| GET | `/api/leads` | قائمة العملاء (صفحية، قابلة للتصفية) |
| GET | `/api/leads/:id` | عميل مع تحليلاته ورسائله |
| PATCH | `/api/leads/:id` | تحديث بيانات/حالة العميل |
| POST | `/api/leads/bulk/analyze` | تحليل مجموعة عملاء |
| POST | `/api/leads/bulk/outreach` | إنشاء رسائل لمجموعة |
| POST | `/api/leads/import` | استيراد عملاء من CSV |
| GET | `/api/leads/export` | تصدير العملاء كـ CSV |

### التحليل

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/leads/:id/analyze` | تشغيل تحليل الموقع |
| GET | `/api/leads/:id/analyses` | قائمة تحليلات العميل |
| GET | `/api/analyses/:id` | تحليل واحد |
| GET | `/api/analyses/:id/report` | تحميل تقرير PDF |

### التواصل

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/leads/:id/outreach/generate` | إنشاء بريد بالذكاء الاصطناعي |
| POST | `/api/leads/:id/outreach/send` | إرسال بريد معتمد |
| GET | `/api/leads/:id/outreaches` | سجل رسائل العميل |
| GET | `/api/outreaches` | جميع الرسائل (قابلة للتصفية) |
| GET | `/api/outreaches/:id` | رسالة واحدة |
| PATCH | `/api/outreaches/:id` | تحديث مسودة أو اعتماد |
| GET | `/api/outreach/rate-limit` | التحقق من حد الإرسال اليومي |

### خط أنابيب الوكلاء

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/agents/run` | تشغيل خط الأنابيب |
| GET | `/api/agents/runs` | قائمة عمليات التشغيل |
| GET | `/api/agents/runs/:id` | تفاصيل عملية تشغيل |
| GET | `/api/agents/runs/:id/emails` | مسودات رسائل العملية |
| POST | `/api/agents/runs/:id/cancel` | إلغاء عملية تشغيل |
| GET | `/api/agents` | جميع الوكلاء |
| GET | `/api/agents/name/:name` | وكيل بالاسم |
| PATCH | `/api/agents/name/:name` | تحديث تكوين الوكيل |
| POST | `/api/agents/seed` | إعادة تهيئة الوكلاء |
| GET | `/api/agents/tools` | جميع الأدوات المسجلة (21) |
| GET | `/api/agents/logs` | سجلات تنفيذ الوكلاء |
| GET | `/api/agents/:id/skills` | مهارات الوكيل |
| POST | `/api/agents/:id/skills` | إنشاء مهارة |
| PATCH | `/api/agents/:id/skills/:skillId` | تحديث مهارة |
| DELETE | `/api/agents/:id/skills/:skillId` | حذف مهارة |

### مزودو الذكاء الاصطناعي

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/api/ai-providers` | جميع المزودين المكوَّنين |
| POST | `/api/ai-providers` | إضافة مزود جديد |
| PATCH | `/api/ai-providers/:id` | تحديث تكوين المزود |
| DELETE | `/api/ai-providers/:id` | حذف مزود |
| POST | `/api/ai-providers/:id/test` | اختبار اتصال المزود |
| POST | `/api/ai-providers/:id/default` | تعيين كمزود افتراضي |
| GET | `/api/ai-providers/defaults` | الإعدادات الافتراضية |

### مزودو البريد الإلكتروني

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/api/email/provider` | حالة مزود البريد الحالي |
| GET | `/api/email/gmail/auth-url` | رابط تفويض Gmail OAuth2 |
| GET | `/api/email/gmail/callback` | استدعاء Gmail OAuth2 |
| DELETE | `/api/email/gmail` | فصل Gmail |
| GET | `/api/email/smtp` | تكوين SMTP |
| POST | `/api/email/smtp` | حفظ تكوين SMTP |
| POST | `/api/email/smtp/test` | إرسال بريد اختبار |
| GET | `/api/email/settings` | إعدادات البريد |
| POST | `/api/email/settings` | تعيين إعدادات البريد |

### أخرى

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/api/health` | فحص الصحة |
| GET | `/api/pipeline` | مراحل الأنابيب مع عدد العملاء |
| GET | `/api/dashboard/stats` | مقاييس لوحة التحكم |
| POST | `/api/webhooks/resend` | تتبع بريد Resend |

## حل المشاكل

### "المنفذ 3001 قيد الاستخدام"

```bash
netstat -ano | grep ":3001" | grep LISTENING
taskkill /F /PID <PID>
npm run dev
```

### "خطأ اتصال قاعدة البيانات"

```bash
docker compose ps
docker compose up -d
docker compose restart postgres
```

### "حاويات Docker لا تعمل"

```bash
docker compose down
docker compose up -d
docker compose logs postgres
```

## ادعم المشروع

إذا ساعدك FindX، فكر في دعمني بقهوة:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?logo=buymeacoffee&style=for-the-badge)](https://buymeacoffee.com/mrarabai)

## الترخيص

خاص — جميع الحقوق محفوظة.

</div>
