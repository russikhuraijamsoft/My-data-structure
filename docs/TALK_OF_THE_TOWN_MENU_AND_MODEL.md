# Talk of the Town — Menu, Business Model & Brand Ideology (Draft)

Prepared 5 October 2026 for the Imphal, Manipur QSR. This is an operating draft, not a claim that every price, recipe, tax treatment, supplier, or trademark has been approved. The POS fallback catalogue uses the existing project price/cost entries for the core menu; the hero concepts below are deliberately not activated in the POS.

## 1. App-ready core menu

All listed prices are ₹. Chowmein and fried-rice rows use Small / Medium / Large variants. The prices and recipe-cost figures currently in the code are preserved; verify them against the owner's current menu before publishing. Each POS product now has a short customer-facing description and explicit size records.

### Wok Chowmein

| POS name | Description | Small | Medium | Large |
|---|---|---:|---:|---:|
| Veg Chowmein | Fresh wok-tossed noodles with seasonal vegetables, aromatics and Talk of the Town house seasoning. | 30 | 45 | 70 |
| Egg Chowmein | Wok-tossed noodles with egg, vegetables and house seasoning. | 40 | 55 | 75 |
| Chicken Chowmein | Made-to-order noodles with chicken, crisp vegetables and a savoury house wok sauce. | 45 | 70 | 105 |
| Pork Chowmein | Wok-tossed noodles with pork, fresh vegetables and a peppery house seasoning. | 55 | 90 | 135 |
| Mixed Chowmein (Chicken + Pork) | Chicken and pork wok-tossed with noodles and seasonal vegetables. | 50 | 80 | 120 |

### Wok Fried Rice

| POS name | Description | Small | Medium | Large |
|---|---|---:|---:|---:|
| Veg Fried Rice | Freshly wok-fried rice with seasonal vegetables and house seasoning. | 30 | 45 | 60 |
| Egg Fried Rice | Wok-fried rice with egg, vegetables and a light savoury seasoning. | 35 | 50 | 70 |
| Chicken Fried Rice | Made-to-order wok-fried rice with chicken, vegetables and house seasoning. | 40 | 65 | 100 |
| Pork Fried Rice | Wok-fried rice with pork, vegetables and a peppery finish. | 55 | 85 | 130 |
| Mixed Fried Rice (Chicken + Pork) | A chicken-and-pork mix wok-fried with rice and seasonal vegetables. | 45 | 75 | 115 |

### Signature Chilly — Standard portion, choose style

| POS name / variant | Description | Price |
|---|---|---:|
| Chilly Chicken — Gravy | Chicken in a glossy chilli-garlic gravy. | 260 |
| Chilly Chicken — Dry | Crisp-edged chicken tossed dry in a bold chilli-garlic wok sauce. | 250 |
| Chilly Pork — Gravy | Pork in a savoury chilli-garlic gravy with a balanced sweet-sour finish. | 290 |
| Chilly Pork — Dry | Pork finished dry in a punchy chilli-garlic wok sauce. | 280 |
| Chilly Chicken Bites (combo component) | Small side portion for the Signature Combo; kept hidden from the normal menu grid. | 50 |

### Combo meals

| POS name | Includes | Price |
|---|---|---:|
| Duo Combo | Small Chicken Chowmein + Small Chicken Fried Rice. | 75 |
| Signature Combo | Choose Medium Chicken Chowmein or Fried Rice + Chilly Chicken Bites. | 110 |
| Family Combo | Choose Large Chicken Chowmein or Fried Rice + Chilly Chicken Dry. | 330 |

The combo choice is stored as a choice component in the POS so the kitchen ticket records which base the customer selected. Ingredient deductions must come from the component products' recipes/stock mappings, not from the product IDs themselves.

### Three trademark-product concepts (test as limited specials first)

These are concepts, not approved recipes or live prices. Cost each recipe, test service speed, taste with local customers, confirm ingredient sourcing/allergens, and only then add/activate in POS.

1. **Town Ember Chicken Chowmein** — Small / Medium / Large. Finish with **Town Ember Sauce**: a house blend led by roasted garlic, chilli and a savoury soy-style base, wok-glossed at order time. Serve in the same signature bowl with a crisp noodle garnish and scallion. Suggested trial prices: ₹55 / ₹80 / ₹115 (₹10 above the current Chicken Chowmein ladder; validate recipe cost and customer acceptance first).
2. **Imphal Umorok Chilly Chicken** — Dry / Gravy, Standard. A controlled-heat version of the signature Chilly Chicken using a measured amount of locally sourced umorok (king chilli), with the heat level stated clearly; offer a milder house-chilli option. Suggested trial prices: ₹280 dry / ₹290 gravy. Use only after sourcing, heat testing, recipe costing and a clear spice warning.
3. **Town Pepper-Smoke Pork Fried Rice** — Small / Medium / Large. Pork fried rice finished with a smoked-black-pepper seasoning and fried-garlic crunch. Suggested trial prices: ₹65 / ₹95 / ₹140. Keep the garnish and wok finish consistent and fast; validate the extra ₹10 premium against actual food cost.

Do not describe a product as “authentic Manipuri” unless the recipe and local partners substantiate that claim. Names and “Town Ember” should receive a trademark search before brand investment.

## 2. One-page business model

**Customer promise.** Fresh, made-to-order wok food with dependable portions, quick service and a recognisable Manipur-rooted identity. Lead with chowmein, fried rice and Chilly Chicken/Pork; use the ₹75 / ₹110 / ₹330 combos to make ordering and family sharing easy.

**Revenue streams.** (1) Dine-in at the Imphal flagship; (2) takeaway and direct phone/WhatsApp ordering; (3) delivery through Zomato and Swiggy; (4) later, office/group trays, catering and event orders if the kitchen can fulfil them without harming counter speed. Treat each channel as its own P&L because platform commissions, promotions, packaging and discounts differ.

**Cost structure.** Food ingredients and yield/waste; kitchen and counter labour; rent and utilities (especially fuel); packaging; aggregator commissions, discounts and sponsored placement; payment fees; cleaning, repairs and smallwares; marketing; licences, tax/accounting and POS/cloud services. Maintain a recipe card and actual purchase cost for each dish, record waste and staff meals, and reconcile aggregator settlement statements to gross sales and refunds.

**Margin discipline.** The owner’s working target is roughly **45–55% gross margin**, varying by size. Use gross margin = (net menu revenue − recipe-level food cost) ÷ net menu revenue; exclude GST from revenue and cost each edible portion with actual ingredient quantities, yield loss and garnish. The current seed cost/price pairs imply about **49–55% for chowmein, 49–53% for fried rice, and 44–58% across chilly dishes/combos** before labour, rent, packaging and channel charges; these are code estimates, not measured actuals. Set a second, channel-specific contribution-margin floor after packaging, aggregator charges, promos and payment fees. Review selling price/portion/yield when actual costs fall outside range rather than relying on blended averages.

**Single outlet to chain.** First make the Imphal flagship the reference kitchen: lock recipes by size and variant, portion tools, sauce batches, food-safety/allergen controls, prep/par levels, opening/closing checklists, training, vendor specs, POS/KDS workflows and daily cash/stock/settlement reconciliations. Track repeat orders, ticket times, waste, contribution by channel and customer feedback through several stable trading cycles. Next prove the playbook in one or two company-operated outlets in nearby markets; centralise only shelf-stable or safely controlled prep (such as measured sauce bases) when quality and cold-chain economics are proven. Franchise only after more than one outlet can hit the same product, service, food-safety and unit-economics standards without owner heroics. Then grow by region with approved suppliers, site criteria, training/certification, audit rights, technology/reporting, franchisee support and a local marketing fund; enter other cities and countries through staged pilots and localised sourcing while keeping core recipes, quality and brand standards non-negotiable.

## 3. Brand ideology / mission

Talk of the Town brings the care of a home kitchen to every order: fresh ingredients, food cooked to order, and honest portions served with warmth. Rooted in Imphal and proud of Manipur, we turn the energy of the wok and the flavours our community loves into a distinct everyday QSR experience. We aim to grow from one neighbourhood kitchen into a trusted multi-city and eventually multinational brand, without losing our local identity. Wherever we go, consistent quality, safe food and respect for the people and places behind each plate come first.
