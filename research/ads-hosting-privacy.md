# Ads, hosting and AU/NZ privacy rules for an infant-formula site with ads

Research for [#5](https://github.com/shmauk/formula-concentration/issues/5), part of map [#1](https://github.com/shmauk/formula-concentration/issues/1). Researched 2026-09-29. This is not legal advice. Primary sources are linked inline. Where only a secondary source was available, it is marked **(secondary)**.

## TL;DR

- **Hosting:** use **Cloudflare Pages** or **Netlify (Free)**. Both allow commercial and ad-supported sites. **Vercel Hobby explicitly bans ads** (you would need Pro). **GitHub Pages** is a grey area: it does not name ads, but it is "not intended for" running an online business, so avoid it for a site built around ad revenue.
- **Ad network:** in practice, **Google AdSense** at launch. It has no traffic minimum and accepts health content. The premium networks need traffic first: Journey by Mediavine needs 1,000 Tier-1 sessions a month, Raptive needs 25k pageviews a month, and Ezoic now needs 250k monthly active users.
- **Could infant formula ads appear? Yes.** Google has no infant-formula ad ban and leaves it to local law. **Australia currently has no infant-formula marketing framework at all.** The MAIF Agreement expired on 28 Feb 2025, and legislation to replace it is still being drafted. NZ's INC Code is voluntary and binds only INC member manufacturers and importers, not publishers or retailers. The WHO Code binds governments and manufacturers, not publishers. Toddler milks, bottles and teats, and retailer ads are the likeliest to show. On a formula-mixing page, contextual targeting makes them *more* likely.
- **Blocking them:** in AdSense, use Brand safety, then Blocking controls. Block the **general category "Baby Feeding"** (Google taxonomy ID 11022, under "Baby"), add **advertiser URL blocks** for formula brand and manufacturer domains, and use the **Ad review center** to remove any that slip through. Classification is automatic, so blocking reduces formula ads but cannot guarantee zero.
- **Privacy:** there is no cookie-consent statute in either country. But (a) **AdSense requires a privacy policy** that discloses third-party cookies. (b) AU: a site under A$3M turnover is usually exempt from the Privacy Act, but the OAIC's pixel guidance and its June 2026 determinations treat tracking on **health-related** sites as sensitive information that needs express opt-in consent. (c) NZ: the Privacy Act 2020 applies to agencies of any size, including overseas agencies carrying on business in NZ, and the new IPP3A covers indirect collection. **Recommendation:** publish a privacy policy, show a notice or consent banner, and consider **non-personalised ads only**. AdSense allows this in any region.

---

## 1. Static hosts: are ad-supported sites allowed?

| Host | Ads allowed on free tier? | Source |
|---|---|---|
| **Cloudflare Pages** | Yes. No commercial or ad restriction found in the Terms or the Developer Platform service-specific terms. | [Cloudflare Terms](https://www.cloudflare.com/terms/), [Developer Platform terms](https://www.cloudflare.com/service-specific-terms-developer-platform/) |
| **Netlify Free** | Yes. "On the Free plan, you can deploy commercial projects, personal sites, or other creative explorations." | [Netlify: Introducing the Free plan](https://www.netlify.com/blog/introducing-netlify-free-plan/), [Self-Serve Subscription Agreement](https://www.netlify.com/legal/self-serve-subscription-agreement/) |
| **Vercel Hobby** | **No.** Hobby is "restricted to non-commercial personal use only". Commercial usage explicitly includes "The inclusion of advertisements, including but not limited to online advertising platforms like Google AdSense". Needs the Pro plan. | [Vercel Fair Use Guidelines, Commercial usage](https://vercel.com/docs/limits/fair-use-guidelines) |
| **GitHub Pages** | Grey area. "GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS)." The Acceptable Use Policies say GitHub does "not generally prohibit use of GitHub for advertising", but content should not be *primarily* advertising. An informational site with ads is arguably not "primarily directed at commercial transactions", but the map says the site is "designed around ad slots", so it is risky. | [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [GitHub Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) |

**Recommendation:** Cloudflare Pages. It is free, allows ads, and has no bandwidth-based commercial cap. Netlify Free is the fallback.

## 2. Ad networks that would accept this site

| Network | Entry bar | Notes | Source |
|---|---|---|---|
| **Google AdSense** | 18+, original high-quality content, control of the site's HTML. **No traffic minimum.** | Health content is allowed. Publisher Policies ban "harmful health claims" and content that contradicts scientific consensus on a major health crisis. Nothing in the Publisher Policies restricts infant-feeding content. | [AdSense eligibility](https://support.google.com/adsense/answer/9724), [Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10437486) |
| **Journey by Mediavine** | 1,000 sessions in 30 days from Tier-1 countries (US, CA, UK, **AU**). Main Mediavine needs about $5k a year in ad revenue. | Must be "in good standing with Google AdSense and AdExchange". | [Mediavine requirements](https://www.mediavine.com/mediavine-requirements/) |
| **Raptive** | 25,000 pageviews a month. At 25k–99k, 50% of traffic must come from US/CA/UK/AU/NZ. | | [Raptive eligibility](https://help.raptive.com/hc/en-us/articles/360032840891-Who-is-eligible-for-Raptive) |
| **Ezoic** | 250k monthly active users for new sites since 19 Feb 2026. There is an Incubator programme below that. | | [Ezoic requirements](https://support.ezoic.com/kb/article/getting-started-ezoics-requirements?id=getting-started-ezoics-requirements&lang=en-US) (secondary summary via search) |

A niche clinician site will realistically launch on **AdSense**. It can move to Journey by Mediavine or Raptive if traffic grows. No network found specialises in clinician-facing infant-feeding content. HCP-targeted pharma networks usually need verified-HCP audiences, and the site has none.

## 3. Could infant formula ads be served, and what rules apply?

### 3.1 Google's own ad policies

- Google Ads has **no infant-formula or breast-milk-substitute policy**. Advertisers must follow local law in every place they target. See [Google Ads: Legal requirements](https://support.google.com/adspolicy/answer/6023676) and [Google Ads policies](https://support.google.com/adspolicy/answer/6008942). So the only restraint on formula ads in AU/NZ is local law and codes. As section 3.2 shows, those barely reach an AdSense advertiser today.
- The AdSense **sensitive categories** that can be blocked (Birth control, Drugs & supplements, Weight loss, Sexual and reproductive health, and so on) include **no baby or infant category**. See [Block sensitive categories](https://support.google.com/adsense/answer/164131).

### 3.2 Australia: MAIF Agreement is gone, legislation is pending

- The ACCC decided on 6 Feb 2025 not to reauthorise the MAIF Agreement, and **it expired on 28 Feb 2025**. The MAIF Complaints Committee has ceased. See the [Department of Health, Disability and Ageing: Marketing infant formula in Australia](https://www.health.gov.au/topics/pregnancy-birth-and-baby/breastfeeding-infant-nutrition/marketing-infant-formula) (updated 11 May 2026) and [ACCC final determination](https://www.accc.gov.au/media-release/accc-denies-authorisation-for-industry-code-on-marketing-of-infant-formula).
- In the Department's words: "With no current framework in place to restrict infant formula marketing in Australia, the Government strongly encourages infant formula manufacturers and importers from continuing to refrain from engaging in marketing practices."
- **Mandatory legislation is being developed.** A public consultation closed on 17 Apr 2026. The law is expected to cover at least MAIF's scope, meaning it restricts **manufacturers and importers** from "engaging in all forms of marketing of infant formula, including on digital platforms such as social media" and from giving incentives to health professionals. A separate Nous Group review looked at **retailer** marketing. No bill has been published yet.
- MAIF only ever covered infant formula for infants **up to 12 months**, and it bound **signatory manufacturers and importers**. It never bound publishers, retailers or ad networks. Toddler milks were outside it.

### 3.3 New Zealand: INC Code of Practice

- The Code is "a voluntary self-regulatory code of conduct which applies to the manufacturers and importers of infant formula who are members of INC", for formula for infants **up to 12 months**. See the [INC Code of Practice (PDF)](https://www.infantnutritioncouncil.com/wp-content/uploads/2018/11/INC-Code-of-Practice-151118-5mmbl-crops-A5.pdf) and [INC marketing codes](https://www.infantnutritioncouncil.com/marketing-codes/).
- Art 5.1: "The advertising of infant formula to the general public, prepared by or under the local control of INC companies through mass media, including ... the electronic media ... should be avoided." "Advertising" is defined to include "the internet".
- Art 7.1: information to health workers "should be restricted to scientific and factual matters".
- It **does not bind publishers**. A formula ad on this site would be the member company's breach, and only if the company is an INC member. Complaints go to the Ministry of Health's compliance panel. See the [Ministry of Health NZ page](https://www.health.govt.nz/strategies-initiatives/programmes-and-initiatives/who-code-for-breast-milk-substitutes/inc-code-of-practice). This page returned 403 to automated fetch, so its content is summarised via the INC site.

### 3.4 WHO International Code (1981) and follow-ups

- The Code is addressed to governments and to manufacturers and distributors. Art 5.1 says there should be "no advertising or other form of promotion to the general public" of products in scope: breast-milk substitutes, feeding bottles and teats. Art 7.2 limits information given to health workers to "scientific and factual matters". See the [WHO Code publication page](https://www.who.int/publications/i/item/9241541601). The PDF is a scan, so the article wording is quoted from the Code as widely reproduced.
- In 2023 WHO published [guidance on restricting *digital* marketing of breast-milk substitutes](https://www.who.int/publications/i/item/9789240084490), and WHA78 (2025) adopted a [resolution on digital marketing](https://pmnch.who.int/news-and-events/news/item/27-05-2025-wha78-resolution-on-regulating-the-digital-marketing-of-breast-milk-substitutes). Both push member states to regulate platforms and digital ads. Neither creates a publisher obligation in AU or NZ law today.
- [WHA69.9 guidance (2016)](https://apps.who.int/gb/ebwha/pdf_files/WHA69/A69_7Add1-en.pdf) asks health workers and professional associations to avoid conflicts of interest with companies marketing foods for infants and young children. This matters for **credibility with dietitians and NICU staff**. A clinician tool showing formula brand ads would look conflicted, even where it is legal.

### 3.5 Bottom line on formula ads

**Legally**, nothing in AU or NZ currently stops Google from serving formula-adjacent ads on this site, and nothing puts an obligation on the publisher. The most likely sources are retailers, toddler-milk brands, and bottle or teat brands. **Reputationally**, formula ads on a clinician tool conflict with the WHO Code's intent and the WHA69.9 conflict-of-interest guidance. AU mandatory controls are coming, but their exact scope for publishers or platforms is unknown. **Block them.**

## 4. How to block infant-formula ads (AdSense)

Blocking controls live under **Brand safety, then Blocking controls**, and can be set for all sites or per site. See the [AdSense guide to allow and block ads](https://support.google.com/adsense/answer/180609).

1. **General categories.** Block up to 200 categories. Google notes: "Our system classifies ads automatically, and we don't rely solely on advertiser-provided categorization." ([Block general categories](https://support.google.com/adsense/answer/186376)). Google's ad product category taxonomy includes **`11022 Baby Feeding`**, `10235 Baby`, `10030 Baby, Parenting & Family` and `10052 Baby Care & Hygiene` (from [Google's ad-product-categories dictionary](https://storage.googleapis.com/adx-rtb-dictionaries/ad-product-categories.txt)). Block **Baby Feeding** at least. Consider blocking the whole **Baby** branch if leakage persists. I did not confirm in a live account that the AdSense UI exposes "Baby Feeding" as a separate node.
2. **Advertiser URLs.** Block the brand and manufacturer domains for products sold in AU/NZ. The list needs curating, for example Nestlé/NAN, Aptamil/Danone/Nutricia, a2 Milk, Bellamy's, Abbott/Similac, Karicare, Alula and Oli6. Blocking a domain also blocks ads from its subdomains.
3. **Ad review center.** Review and block individual creatives that get past the category and URL blocks.
4. **Sensitive categories** do not help here, because there is no infant category.

Caveat: classification is automatic, so this reduces formula ads but cannot guarantee zero. Every block also shrinks demand and lowers RPM. If the site moves to Mediavine or Raptive, the same exclusions must be asked for through their brand-safety settings.

## 5. Privacy obligations

### 5.1 Australia: Privacy Act 1988 (Cth)

- **Small business exemption.** Businesses with annual turnover of A$3M or less are generally not covered. The exemption does not apply if the business is a **health service provider**, **trades in personal information**, or has opted in. See [OAIC: Small business](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business). Two points are unclear here: whether a calculator for clinicians is a "health service", and whether enabling Google's ad cookies counts as "trading" (see Open questions).
- **OAIC tracking-pixel guidance** ([4 Nov 2024](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/tracking-pixels-and-privacy-obligations)) says:
  - An individual "may also reveal sensitive information about themselves solely by visiting a website". For such sites, "it may be preferable to avoid the use of third-party tracking pixels".
  - "An organisation should generally seek express opt-in consent" where sensitive information is likely to go to third-party platforms.
  - "A privacy policy is not meant to be a substitute for notification requirements under APP 5." Use a banner or pop-up at or before collection.
  - The site operator is responsible for how third-party pixels are configured.
- **OAIC determinations, 11 Jun 2026** (Medmate, Monash IVF). Both breached APP 3.3 (sensitive information without consent), APP 5.1 (notice) and APP 7 (direct marketing) through ad pixels on health sites. The Commissioner used "individuation" as the test for personal information. Source: [Allens summary](https://www.allens.com.au/insights-news/insights/2026/07/tracking-pixels-targeted-advertising-and-compliance-lessons-from-recent-oaic-determinations/) **(secondary)**.
- **Reform.** The Exposure Draft Privacy Amendment (Personal Data Protection) Bill 2026 was released on 31 Aug 2026, and consultation closed on 18 Sep 2026 ([AGD consultation](https://consultations.ag.gov.au/rights-and-protections/privacy-reform/)). Secondary sources say it does **not** yet remove the small business exemption. That removal is still a proposal ([Lexology](https://www.lexology.com/library/detail.aspx?g=8aca0f2c-6ce9-4a6c-954e-3228c2d96eef), **secondary**).
- There is **no cookie-consent statute** in Australia. Consent obligations come from the APPs (sensitive information and direct marketing) when the Act applies.

### 5.2 New Zealand: Privacy Act 2020

- The Act applies to any "agency", public or private, **with no size exemption**. It also applies to overseas agencies "in the course of carrying on business in New Zealand", which does not require a physical presence or payment. See the [Privacy Act 2020 (legislation.govt.nz)](https://www.legislation.govt.nz/act/public/2020/0031/latest/whole.html) and [FPF analysis](https://fpf.org/blog/a-deep-dive-into-new-zealands-new-privacy-law-extraterritorial-effect-cross-border-data-transfers-restrictions-and-new-powers-of-the-privacy-commissioner/) **(secondary)**. legislation.govt.nz returned 403 to automated fetch.
- **IPP3** requires notice when collecting from the individual. **IPP3A** has been in force since May 2026 and requires notice when collecting personal information indirectly: the fact of collection, its purpose, recipients, the agency's name and address, and access and correction rights. See [OPC: IPP3A](https://www.privacy.org.nz/privacy-principles/3a/) and [OPC: privacy principles](https://www.privacy.org.nz/privacy-act-2020/privacy-principles/).
- There is **no cookie-consent statute** in NZ either.

### 5.3 Contractual: Google

- The Google Publisher Policies require publishers to "have and abide by a privacy policy that clearly discloses any data collection, sharing, and usage that takes place as a consequence of your use of Google products and services". The policy must disclose that "third parties may be placing and reading cookies on your users' browsers, or using web beacons or IP addresses to collect information as a result of ad serving on your website." See [Google Publisher Policies, Privacy-related policies](https://support.google.com/publisherpolicies/answer/10437486).
- Google's [EU user consent policy](https://www.google.com/about/company/user-consent-policy/) (a certified CMP) applies only to EEA, UK and CH traffic. It is not required for AU/NZ, but it is needed if meaningful traffic comes from there.
- "Ads personalization settings can be managed in any region globally, not just in the EEA, the UK, or Switzerland." See [AdSense: ads personalization](https://support.google.com/adsense/answer/9007336). This means the site can choose to serve **non-personalised ads** everywhere.

### 5.4 Recommended privacy posture

1. Publish a **privacy policy page** that meets Google's disclosure requirement and covers APP 1/APP 5 and IPP3/IPP3A. It should name Google as the third party, cover cookies, web beacons and IP addresses, give the purpose, overseas disclosure (APP 8 / IPP12), a contact, and access and correction rights.
2. Show a **notice banner** on first visit, linking to the policy.
3. Serve **non-personalised ads** by default. This keeps the site clear of the OAIC health-pixel concerns, at some cost in revenue. If personalised ads are wanted, use **express opt-in** through a consent banner.
4. Add **no other third-party pixels**, such as Meta or TikTok. Use cookieless analytics, for example Cloudflare Web Analytics, if analytics are needed.
5. The calculator runs in the browser, so no inputs are sent anywhere. State this in the privacy policy, because it is a trust signal for clinicians.

## Open questions and fog

- **Health service provider?** Does a clinician-facing calculator and tutorial site count as a "health service" under s 6FB of the Privacy Act? If it does, the small business exemption is lost. This probably needs a lawyer's view. Recommendation 5.4 makes it mostly moot.
- **Trading in personal information?** Does enabling AdSense's personalised-ads cookies count as "trading" for the small business exemption? Non-personalised ads sidestep this.
- **Is a visit to this site "sensitive information"?** For a clinician audience it probably is not. But a parent using the calculator could reveal that their infant needs concentrated feeds. This is fog, and non-personalised ads reduce it.
- **AU mandatory-controls bill.** Its scope for publishers and platforms is unknown until the bill is published. Re-check before launch.
- **Blocking effectiveness.** Whether "Baby Feeding" appears as its own node in the AdSense UI, and how much leaks through, can only be checked once an AdSense account exists.
- **Ad slot next to the calculator result.** No rule forbids it. Clinicians' perception of an ad sitting next to a feeding Recipe is a design question for the layout ticket.
