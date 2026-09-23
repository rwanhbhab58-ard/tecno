# تكنو إنجاز | Techno Enjaz — الموقع الرسمي (v3)

موقع ثابت ثنائي اللغة (العربية أولاً RTL + الإنجليزية) لمكتب **تكنو إنجاز** الهندسي في حماة، سوريا.
أُعيد بناؤه من الصفر بـ **Astro + TypeScript صارم**: كل صفحة ملف HTML حقيقي مُولَّد مسبقاً بمحتواه الكامل وبياناته الوصفية، دون الاعتماد على JavaScript لعرض المحتوى.

> خطة إعادة البناء وتشخيص النسخة القديمة: [`REBUILD-PLAN.md`](./REBUILD-PLAN.md)

## المتطلبات

- Node.js **22.12 أو أحدث** (مُختبر على Node 24)
- npm 9+

## التشغيل محلياً

```bash
npm install
npm run dev        # http://localhost:4321
```

## البناء والتحقق

```bash
npm run build      # astro check (TypeScript صارم) ثم astro build → dist/
npm run verify     # فحص آلي لكل صفحات dist/
npm run preview    # معاينة نسخة الإنتاج محلياً
```

يفحص `npm run verify` كل صفحة HTML ناتجة: وجود `title` و`description` و`canonical` و Open Graph بروابط مطلقة، وصحة JSON-LD (Organization, WebSite, BreadcrumbList, Article, FAQPage, Person, VideoObject…)، وأزواج `hreflang`، وصحة `lang`/`dir`، ووجود H1 واحد، وسلامة الروابط الداخلية والصور، وتطابق `sitemap.xml` و`robots.txt` و`llms.txt` مع الصفحات الموجودة فعلاً.

### النطاق (Domain)

الرابط الأساسي افتراضياً `https://technoenjaz.com`. لتغييره عند البناء:

```bash
SITE_URL=https://example.com npm run build
```

يُستخدم هذا المتغير في `canonical` و`hreflang` و Open Graph و JSON-LD و`sitemap.xml` و`robots.txt` و`llms.txt`.

## النشر

المخرجات في `dist/` ملفات ثابتة بالكامل ويمكن نشرها على أي استضافة ثابتة.

| المنصة | أمر البناء | مجلد النشر |
|---|---|---|
| Cloudflare Pages | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |
| Vercel | `npm run build` | `dist` |
| أي خادم (Nginx/Apache) | `npm run build` ثم رفع محتوى `dist/` | — |

- `public/_headers` يضبط ترويسات الأمان والتخزين المؤقت الطويل لملفات `/_astro/*` (Cloudflare Pages و Netlify).
- `public/_redirects` لإعادة توجيه روابط قديمة.
- اضبط متغير البيئة `SITE_URL` في لوحة الاستضافة إذا كان النطاق مختلفاً.
- على Nginx: فعّل `try_files $uri $uri/ =404;` واجعل `error_page 404 /404.html;`.

## البنية

```
src/
  assets/            صور تُحسَّن آلياً (AVIF/WebP متجاوبة) عبر astro:assets
  components/        مكونات صغيرة: Header, Footer, بطاقات، FAQ، مشغّل فيديو خفيف…
  content/articles/  المقالات (Markdown + frontmatter مُتحقق بمخطط Zod)
  data/              حقائق المؤسسة، المشاريع، مشاريع الويب، الفيديوهات، الفريق، الخدمات، الأسئلة الشائعة
  i18n/              نصوص الواجهة ومساعدات المسارات للغتين
  layouts/           BaseLayout: الـ head كاملاً (SEO + OG + hreflang + JSON-LD)
  lib/               articles.ts, schema.ts (JSON-LD), llms.ts, icons.ts
  pages/             الصفحات العربية + /en/ + sitemap.xml, robots.txt, llms.txt, llms-full.txt
  views/             تنفيذ كل صفحة مرة واحدة ويستقبل lang
  styles/            نظام التصميم (global.css) وتنسيق القراءة (prose.css)
scripts/
  verify-build.mjs   فحص ما بعد البناء
  brand-assets.py    توليد الأيقونات وصورة المشاركة الافتراضية من الشعار
  legacy/            سكربتات الترحيل لمرة واحدة من النسخة القديمة
docs/seo-packages/   حزم SEO التحريرية الداخلية لكل مقال (غير منشورة)
```

## الصفحات

| الصفحة | العربية | English |
|---|---|---|
| الرئيسية | `/` | `/en/` |
| الخدمات | `/services/` | `/en/services/` |
| المشاريع الهندسية | `/projects/` | `/en/projects/` |
| مشاريع الويب | `/web-projects/` | `/en/web-projects/` |
| الفيديوهات | `/videos/` | `/en/videos/` |
| المقالات | `/articles/` | `/en/articles/` |
| مقال (×12، عربي فقط) | `/articles/{slug}/` | — |
| من نحن | `/about/` | `/en/about/` |
| الأسئلة الشائعة | `/faq/` | `/en/faq/` |
| تواصل معنا | `/contact/` | `/en/contact/` |

## تحرير المحتوى

- **مقال جديد**: أضف ملف `src/content/articles/<slug>.md` مع الحقول الموجودة في المقالات الحالية (title, seoTitle, description, excerpt, titleEn, excerptEn, category, categoryEn, publishedAt, cover, tags, related). قسم `## الأسئلة الشائعة` بأسئلة `###` يتحول آلياً إلى `FAQPage` في JSON-LD وإلى `llms-full.txt`.
- **مشروع / موقع / فيديو / سؤال شائع**: عدّل الملف المناسب في `src/data/`. الصفحات و sitemap و llms.txt تُحدَّث تلقائياً.
- **بيانات التواصل**: `src/data/site.ts` هو المصدر الوحيد.

## التواصل

- هاتف / واتساب: `+963 958 794 195`
- البريد: `info@technoenjaz.com`
- إنستغرام: [@TECHNO_ENJAZ](https://www.instagram.com/TECHNO_ENJAZ)
- العنوان: حماة، ساحة العاصي، بناء الخاني، بجوار أفران السلام، الطابق الرابع
