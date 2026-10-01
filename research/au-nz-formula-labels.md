# AU/NZ powdered infant formula labels: worked-example values

Research for issue #7 (child of #1). Accessed **2026-09-29**. All values come from manufacturer-owned pages and the pack images those pages host. **Nothing here has been checked against a physical tin yet.** Check every value against a tin before using it as a test fixture.

## Question

What do 2–3 current AU/NZ powdered infant formula labels state for energy per 100 g of powder, scoop size in grams, energy per 100 mL of prepared formula, and the mixing table (scoops + water → prepared volume)? From those, derive grams per scoop, kcal per scoop and displacement.

## Headline finding

**None of the three labels gives energy per 100 g of powder.** On all three, the Nutrition Information panel is per 100 mL of prepared feed only. So kcal per scoop can't be computed the way CONTEXT.md currently describes it ("energy per 100 g of powder × grams per scoop"). Instead it has to be worked backwards from energy per 100 mL, plus the label's reconstitution statement (how much prepared volume a known amount of powder makes). Both brands do print such a statement:

- **Nestlé NAN**: "1 Litre = 129g of powder + 900mL of water" and "Average scoop weight = 4.3g". This is exact enough to derive everything.
- **Nutricia (Aptamil, Karicare)**: "1 scoop of powder added to 50mL of water yields **approximately** 55mL of formula". Displacement and kcal per scoop derived from this carry the uncertainty of "approximately" and of rounding to the nearest mL.

## Summary table

| | Nestlé NAN OPTIPRO 1 (800 g, AU) | Aptamil Gold+ 1 (900 g, AU) | Karicare 1 "Gentle Nutrition" (900 g, AU) |
|---|---|---|---|
| **Label: energy per 100 g powder** | Not given | Not given | Not given |
| **Label: energy per 100 mL prepared** | 280 kJ / 67 Cal | 289 kJ / 69 kcal (pack image); 288 kJ / 69 kcal (brand page text) | 283 kJ / 68 kcal |
| **Label: scoop size** | "Average scoop weight = 4.3g" | "1 scoop = 7.5g of powder" | "1 scoop = 7.3g of powder" |
| **Label: mixing rule** | 30 mL water per scoop (table: 90 mL + 3 … 210 mL + 7) | 50 mL water per scoop (table: 50 mL + 1 … 200 mL + 4) | 50 mL water per scoop (table: 50 mL + 1 … 200 mL + 4) |
| **Label: prepared volume** | "1 Litre = 129g of powder + 900mL of water" | "1 scoop … added to 50mL of water yields approximately 55mL" | "1 scoop … added to 50mL of water yields approximately 55mL" |
| **Grams per scoop** | 4.3 g (stated). Cross-check: 129 g / 30 scoops = 4.3 g | 7.5 g (stated) | 7.3 g (stated) |
| **kcal per scoop** (derived) | 67 × 10 / 30 = **22.3 kcal** (93.3 kJ ÷ 4.184 = 22.3) | 69 × 0.55 = **38.0 kcal** (289 kJ × 0.55 = 158.9 kJ ÷ 4.184 = 38.0) | 68 × 0.55 = **37.4 kcal** (283 × 0.55 = 155.7 kJ ÷ 4.184 = 37.2) |
| **Energy per 100 g powder** (derived) | 670 kcal / 129 g = **519 kcal/100 g** (2171 kJ/100 g) | 37.95 / 7.5 × 100 = **506 kcal/100 g** (~2119 kJ/100 g) | 37.4 / 7.3 × 100 = **512 kcal/100 g** (~2132 kJ/100 g) |
| **Displacement per scoop** (derived) | (1000 − 900) / 30 = **3.33 mL** | (55 − 50) / 1 = **~5 mL** (approximate) | (55 − 50) / 1 = **~5 mL** (approximate) |
| **Concentration at label strength** | 67 × 0.3 = **20.1 kcal/30 mL** | 69 × 0.3 = **20.7 kcal/30 mL** | 68 × 0.3 = **20.4 kcal/30 mL** |

Derived values use the label's kcal figure where one is printed. The kJ ÷ 4.184 route is shown in brackets as a cross-check. The small gaps between the two routes come from the label rounding kJ and kcal separately.

Sensitivity for the Nutricia products: if the true yield is 54–56 mL instead of 55 mL, Aptamil's kcal per scoop is 37.3–38.6 and displacement is 4–6 mL. Displacement is the least certain value in this table.

## Per-product detail and sources

### 1. Nestlé NAN OPTIPRO 1, Stage 1 Formula From Birth – 800 g

- Product page: https://www.nestlefamilynes.com.au/nan-infant-formulas/nan-optipro-1
- Feeding table image (hosted on that page, alt text "Feeding table"): https://www.nestlefamilynes.com.au/sites/default/files/styles/content_media_product_tablet_retina/public/content_image/8_17.png
- Nutrition Information Panel image (alt text "Nutrition Information Panel"): https://www.nestlefamilynes.com.au/sites/default/files/styles/content_media_product_tablet_retina/public/content_image/11_0_0.png

Label values, read from the images:

- NIP header: "Average amount per 100mL made up formula†". Energy is 280 kJ / 67 Cal. Protein 1.3 g, fat 3.5 g, carbohydrate 7.6 g.
- NIP footnote: "†1 Litre = 129g of powder + 900mL of water". "Average scoop weight = 4.3g".
- Feeding table, "Previously boiled water (mL)" / "Level measuring scoops":

  | Age | Water (mL) | Scoops | Feeds/day |
  |---|---|---|---|
  | Up to 2 weeks | 90 | 3 | 6 |
  | 2–4 weeks | 120 | 4 | 5 |
  | 1–2 months | 150 | 5 | 5 |
  | 2–4 months | 180 | 6 | 5 |
  | 4–6 months | 210 | 7 | 5 |
  | 6–9 months | 210 | 7 | 4–3 (+1–2 others) |
  | Over 9 months | 210 | 7 | 3 (+2–3 others) |

- The feeding table itself doesn't state a prepared volume per row. Only the 1 L footnote does.
- The footnote and the scoop weight agree: 900 mL water at 30 mL per scoop is 30 scoops, and 30 × 4.3 g = 129 g.

### 2. Aptamil Gold+ 1 (Nutricia), 900 g

- Brand page: https://nutricia.com.au/aptamil/product/aptamil-gold-1/
- Nutricia Store page: https://www.nutriciastore.com.au/products/new-aptamil-gold-1-baby-infant-formula-from-birth-to-6-months-900g
- Pack images (barcode 9418783002820), hosted by the Nutricia Store:
  - Nutrition panel side: https://www.nutriciastore.com.au/content/dam/sn/local/anz/website-assets/nutriciastore/product-assets/192834/NUTR_9418783002820PROD4-3.jpg
  - Feeding guide side: https://www.nutriciastore.com.au/content/dam/sn/local/anz/website-assets/nutriciastore/product-assets/192834/NUTR_9418783002820PROD4-4.jpg

Label values:

- Pack NIP: "Avg Qty per 100mL of Prepared Feed". Energy is **289 kJ / 69 kcal**. Protein 1.5 g, fat 3.7 g, carbohydrate 7.0 g.
- Brand page NIP text: "AVERAGE QUANTITY PER 100ML OF PREPARED FEED". Energy is **288 kJ / 69 kcal**, carbohydrate 7.1 g. This is a small mismatch with the pack image, probably from a formulation or label revision.
- Pack feeding guide: Safe drinking water / Level scoops of powder is 50 mL / 1, 100 mL / 2, 150 mL / 3 (1–2 months and again for 3–4 months), and 200 mL / 4.
- Pack text: "1 scoop = 7.5g of powder. NOTE: 1 scoop of powder added to 50mL of water yields approximately 55mL of formula."
- **Conflict:** the Nutricia Store page text says "1 scoop = 7.3g of powder" for this product. The pack image and the brand page both say 7.5 g. The store text looks like it was copied from Karicare. Treat 7.5 g as the label value, and confirm on a tin.

### 3. Karicare 1 Infant Formula From Birth to 6 Months ("Gentle Nutrition"), 900 g

- Brand page: https://nutricia.com.au/karicare/products/infant-formula-0-6-months/
- HCP page (same values): https://nutricia.com.au/paediatrics/product/karicare-infant-formula/
- Nutricia Store page: https://www.nutriciastore.com.au/products/karicare-1-infant-formula-from-birth-to-6-months-900g
- Pack image (barcode 9418783003094), NIP and feeding guide side: https://www.nutriciastore.com.au/content/dam/sn/local/anz/website-assets/nutriciastore/product-assets/193852/NUTR_9418783003094PROD3-2.jpg

Label values:

- NIP, "Avg Qty per 100mL of Prepared Feed": energy **283 kJ / 68 kcal**. Protein 1.4 g, fat 3.5 g, carbohydrate 7.3 g. The pack image and the brand page agree.
- Feeding guide: 50 mL / 1, 100 mL / 2, 150 mL / 3 (1–2 months and again for 3–4 months), and 200 mL / 4.
- "1 scoop = 7.3g of powder. NOTE: 1 scoop of powder added to 50mL of water yields approximately 55mL of formula."

### Not covered: specialised or preterm formula

No AU/NZ manufacturer page for a preterm or post-discharge powder turned up quickly (for example PreNAN or an Aptamil preterm product). Search results only surfaced EU and India listings for PreNAN, and those aren't AU labels. This was optional and was left out.

## Observations for the product

1. **Energy per 100 g powder is not on the label** of any of the three. kcal per scoop has to be derived from energy per 100 mL and the reconstitution statement, or entered by the clinician from somewhere else (for example the manufacturer's HCP data sheet or careline). CONTEXT.md's definition of kcal per scoop ("derived from the label's energy per 100 g of powder") doesn't match what labels actually print.
2. **Two different mixing conventions:**
   - Nestlé uses 30 mL water per 4.3 g scoop.
   - Nutricia uses 50 mL water per 7.3–7.5 g scoop.

   So a "scoop" means very different amounts of powder and energy between brands (about 22 kcal compared with about 38 kcal). Rounding to whole scoops therefore costs much more precision with Nutricia products: one scoop is about 38 kcal.
3. **Displacement quality differs by brand.** Nestlé's "1 L = 129 g + 900 mL" gives an exact-looking 3.33 mL per scoop, which works out to 0.78 mL/g. Nutricia's "approximately 55 mL" gives about 5 mL per scoop (0.67–0.68 mL/g) with roughly ±1 mL of uncertainty. Measuring on real tins would tighten this.
4. **Labels change.** The Aptamil energy value differs between the brand page (288 kJ) and the pack image (289 kJ), and the store lists the wrong scoop weight. Label values should carry a version or date and be checked against the physical tin.
5. All three standard formulas come out at about 20–21 kcal/30 mL at label strength. That is the expected baseline for worked examples.
