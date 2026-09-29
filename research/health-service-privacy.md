# Does the calculator make the site a health service under AU and NZ privacy law?

Research for [Research whether the calculator makes the site a health service under the Australian Privacy Act](https://github.com/shmauk/formula-concentration/issues/13), part of the [map](https://github.com/shmauk/formula-concentration/issues/1). It follows on from [Research ad networks, hosting and AU/NZ privacy rules for an infant-formula site with ads](https://github.com/shmauk/formula-concentration/issues/5) (`research/ads-hosting-privacy.md`). Researched 2026-09-30. This is not legal advice. Primary sources are linked inline.

## TL;DR

- **Australia: not caught.** The small business exemption is lost only if an operator **both** "provides a health service to another individual" **and** "holds any health information" (Privacy Act 1988 s 6D(4)(b)). The site fails the second limb outright: the calculator runs in the browser, so the operator holds no record of any Target volume, Target concentration or formula values, and no names. It is also doubtful the site meets the first limb, because s 6FB describes an activity "performed in relation to an individual". The site gives a clinician a generic tool and does not assess or treat anyone. The clinician provides the health service.
- **New Zealand: the Health Information Privacy Code does not apply in practice.** The code only applies to "information about an identifiable individual" that is health information (cl 4(1)). The site collects none. The ordinary Privacy Act 2020 still applies, with no size exemption, to whatever personal information the site or its ad tag collects, such as IP addresses and cookie IDs. That was already the finding in the earlier ads research.
- **What changes: nothing, as long as the calculator stays client-side.** The privacy policy, the first-visit notice banner and AdSense with non-personalised ads, as recommended in `research/ads-hosting-privacy.md` section 5.4, remain the right posture. They are good practice and an AdSense contract requirement, not an Australian Privacy Act obligation.
- **Tripwires.** Any of these would reopen the question: storing or sending calculator inputs (saved recipes, server-side calculation, analytics events carrying input values); collecting names, patient identifiers or free-text notes; giving individualised feeding advice; or turning on personalised ads or third-party pixels on calculator pages.

---

## 1. Australia: Privacy Act 1988 (Cth)

Text is quoted from the [Privacy Act 1988, Compilation No. 99 (14 Oct 2024), Federal Register of Legislation](https://www.legislation.gov.au/C2004A03712/2024-10-14/2024-10-14/text/original/epub/OEBPS/document_1/document_1.html). No later compilation was checked, because the Register's version list did not render for automated fetch. The Privacy and Other Legislation Amendment Act 2024 is not known to have changed ss 6D, 6FA or 6FB, but this was not verified against a later compilation.

### 1.1 The small business exemption and its health carve-out

- A small business operator is **not** an "organisation" (s 6C(1)), so the APPs do not bind it.
- A business is small if its annual turnover is $3,000,000 or less (s 6D(1)). A new business uses the current year's turnover (s 6D(2)).
- s 6D(4) lists who is **not** a small business operator despite turnover. The relevant limbs:
  - **(b)** "provides a health service to another individual **and** holds any health information except in an employee record";
  - **(c)** "discloses personal information about another individual to anyone else for a benefit, service or advantage";
  - **(d)** "provides a benefit, service or advantage to collect personal information about another individual from anyone else".
- The OAIC summarises (b) the same way: "An organisation that provides a health service **and holds health information** is covered by the Privacy Act 1988, even if they're a small business or providing a health service is not their primary activity" ([OAIC: What is a health service provider?](https://www.oaic.gov.au/privacy/your-privacy-rights/health-information/what-is-a-health-service-provider); see also [OAIC: Small business](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business)).

The test is **conjunctive**. Both limbs must be met.

### 1.2 Limb 1: is the calculator a "health service"? (s 6FB)

s 6FB(1): "An activity performed **in relation to an individual** is a health service if the activity is intended or claimed (expressly or otherwise) by the individual or the person performing it:
(a) to assess, maintain or improve the individual's health; or
(b) where the individual's health cannot be maintained or improved—to manage the individual's health; or
(c) to diagnose the individual's illness, disability or injury; or
(d) to treat the individual's illness, disability or injury or suspected illness, disability or injury; or
(e) to record the individual's health for the purposes of assessing, maintaining, improving or managing the individual's health."

s 6FB(3)(a) adds that "health" includes physical or psychological health.

Applying it:

- **Against a health service.** The site performs no activity "in relation to an individual". It publishes a generic arithmetic tool and tutorials. The clinician decides the Target concentration, applies the Recipe, and performs the health service for the infant. The site does not assess, diagnose, treat or record anyone. Its closest analogue is a reference text or a dosing table, not a practitioner.
- **For a health service.** The "intended or claimed (expressly or otherwise) by the individual" wording is broad. A parent who uses the calculator to make up their own infant's bottle might say they used it "to maintain or improve" the infant's health. The OAIC lists "an online health service (such as counselling, **advice**, medicines)" as a health service provider ([OAIC: What is a health service provider?](https://www.oaic.gov.au/privacy/your-privacy-rights/health-information/what-is-a-health-service-provider); [OAIC Guide to health privacy: introduction and key concepts](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/health-service-providers/guide-to-health-privacy/introduction-and-key-concepts)). Online advice aimed at a particular person's health could qualify.
- **Assessment.** Probably not a health service for a clinician audience, but limb 1 is genuinely arguable. That is why limb 2 carries the answer. The site can reduce the risk on limb 1 by positioning the calculator as a professional reference tool, for example with a "for health professionals; not individual advice" statement. The copy should not claim the site assesses or advises on a particular baby.

### 1.3 Limb 2: does the operator "hold" any "health information"?

- **holds**: "an entity holds personal information if the entity has possession or control of a record that contains the personal information" (s 6(1)).
- **health information** (s 6FA) must be **personal information**: information about health "that is also personal information", or "other personal information collected to provide, or in providing, a health service to an individual".
- **personal information**: "information or an opinion about an identified individual, or an individual who is reasonably identifiable" (s 6(1)).

Applying it:

- A Target volume, a Target concentration and formula values, with no name or identifier, are not about an identified or reasonably identifiable individual. They are not personal information even while they sit in the visitor's browser.
- The inputs never leave the browser, so the operator has no "possession or control of a record" of them. There is nothing to hold.
- The operator does not receive or store the ad-serving data (cookie IDs, IP addresses). Google collects and holds it. Cloudflare Web Analytics is cookieless and aggregate. So the operator holds no personal information at all, let alone health information.

**Limb 2 fails, so s 6D(4)(b) does not apply,** whatever the answer on limb 1.

### 1.4 The other carve-outs: trading in personal information (s 6D(4)(c), (d))

This was left open in the earlier ads research. With **non-personalised ads**, Google says the ads "are not based on a user's past behavior". They are targeted on "contextual information, including coarse geo-targeting (such as city-level)", and cookies are used only for "frequency capping and aggregated ad reporting" ([AdSense: ads personalization settings](https://support.google.com/adsense/answer/9007336)). The operator does not hand over any personal information it holds in return for a benefit. Google collects its own data under its own policies. The OAIC reads "trading" as selling or swapping personal information, for example "where a small business sells their customer list to a marketing company" ([OAIC: Small business](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business)). A publisher embedding a non-personalised ad tag is a weak fit. It is not settled law, but the risk is low. Personalised ads would make the argument stronger, which is another reason to stay non-personalised.

### 1.5 Would being covered change the practical obligations?

If the site ever became a covered entity, for example because turnover passed A$3M or inputs started being stored, it would need an APP 1 privacy policy and APP 5 collection notices. If it held health information, that information would be sensitive (s 6(1) "sensitive information" (b)), so it could only be collected with consent (APP 3.3). The OAIC's [tracking-pixel guidance](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/tracking-pixels-and-privacy-obligations) says the deploying organisation is responsible for how pixels are configured. It also says a visitor "may also reveal sensitive information about themselves solely by visiting a website, for example, a website providing mental health or counselling services". It favours a banner or pop-up that notifies visitors, linked to fuller privacy information. The posture already recommended (policy, notice banner, non-personalised ads, no other pixels, cookieless analytics) meets that bar. So even in the worst case, the site's design barely changes. What would change is **legal exposure**: complaints, OAIC determinations and penalties.

## 2. New Zealand

### 2.1 Privacy Act 2020

Text is from the [Privacy Act 2020 (legislation.govt.nz, latest version)](https://www.legislation.govt.nz/act/public/2020/0031/latest/whole.html).

- It applies to overseas agencies "in the course of carrying on business in New Zealand", even without "being a commercial operation", a place of business in NZ, or "receiving any monetary payment" (s 4(1)(b), (3)). There is no small business exemption.
- **personal information** "means information about an identifiable individual" (s 7(1)). Anonymous calculator inputs that stay in the browser are not collected at all, so no IPP is engaged by the calculator itself.
- **IPP 3A** (in force for information collected from 1 May 2026; s 25A) requires reasonable steps to make people aware of the fact of indirect collection, its purpose, the intended recipients, the name and address of the collecting and holding agencies, and access and correction rights. IPP 3A(3) excuses this if the individual "has previously been made aware by any means". A privacy policy linked from the first-visit banner is the practical way to satisfy IPP 3 and 3A for whatever the ad tag collects.

### 2.2 Health Information Privacy Code 2020

Text is from the [HIPC 2020, website consolidation incorporating Amendment No 2 (in force 1 May 2026)](https://www.privacy.org.nz/assets/Codes-of-Practice-2020/Health-Information-Privacy-Code-2020-website-version.pdf) ([OPC code page](https://www.privacy.org.nz/privacy-act-2020/codes-of-practice/hipc2020/)).

- **What information it covers (cl 4(1)).** It covers only "information or classes of information **about an identifiable individual**": the individual's health, disabilities, health services provided to them, donation information, or information "collected before or in the course of, and incidental to, the provision of any health service" to them.
- **Which agencies it covers (cl 4(2)).** These include "(a) an agency which provides health or disability support services" and "(j) an agency which provides services in respect of health information". "Personal health services" means "goods, services and facilities provided **to an individual** for the purpose of improving or protecting the health of that individual" (cl 3(1)).
- **Applying it.** Both conditions must hold for the code's rules to bite: a health agency, and health information about an identifiable individual. On cl 4(2)(a), the calculator is arguably a "facility" used in a health service, but it is provided to the clinician, not to the infant whose health is concerned. The same weakness applies as in s 6FB. Cl 4(2)(j) does not fit either, because the site does not store or process anyone's health information. Even if the site were a health agency, the code has nothing to act on: the site collects no information about an identifiable infant or parent. Visitor IP addresses and cookie IDs collected by the ad tag are about the visitor (usually a clinician), not about their health or a health service provided to them.
- **Result.** The HIPC does not change anything. The ordinary IPPs under the Privacy Act 2020 cover the ad tag's collection, as already found in the earlier ads research.

## 3. What this means for the site

| Item | Required by AU Privacy Act? | Required by NZ law? | Required by AdSense? | Recommendation |
|---|---|---|---|---|
| **Privacy policy** | No, while small and not a health service provider | Yes in substance: IPP 3/3A awareness for ad-tag collection | **Yes** ([Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10437486)) | Keep. Also state that calculator inputs never leave the browser and are not stored. Describe the site as a reference tool for health professionals, not individual advice. |
| **First-visit notice banner** | No | A practical way to meet IPP 3A(3) "previously been made aware" | No (EU consent is needed only for EEA/UK/CH traffic) | Keep as a **notice**, not a consent wall. It is enough while ads are non-personalised. |
| **AdSense, non-personalised** | Not affected | Not affected | Allowed in any region | Keep. Personalised ads would strengthen the "trading" argument (s 6D(4)(c)) and the OAIC health-pixel concerns, so they would need opt-in consent. |

## 4. Tripwires that would reopen this

1. **Storing or transmitting calculator inputs.** Examples: saved Recipes or accounts, server-side calculation, error logging, or analytics events that carry the Target volume, Target concentration or formula values. Together with any identifier, this could create "health information" that the operator "holds".
2. **Collecting identifiers or free text**, such as a patient name, a bed number, an infant's weight or date of birth, or a notes field.
3. **Individualised advice**, such as "your baby needs 24 kcal/30 mL". This moves the site towards s 6FB(1)(a) and cl 4(2)(a).
4. **Turning on personalised ads or adding third-party pixels** (Meta, TikTok, Google Analytics with ad features).
5. **Turnover passing A$3M**, or opting in under s 6EA. The APPs would then apply regardless.
6. **Law reform.** The earlier ads research notes that the 2026 exposure draft does not yet remove the small business exemption. Removing it would make the APPs apply regardless of the health-service question. Re-check before launch.

## Open questions

- Limb 1 (s 6FB) has not been tested by the OAIC or a court for a generic clinician calculator. The conclusion rests on limb 2 (holds no health information), which is robust while the calculator stays client-side.
- A later compilation of the Privacy Act 1988 than 14 Oct 2024 was not checked for changes to ss 6D, 6FA and 6FB.
