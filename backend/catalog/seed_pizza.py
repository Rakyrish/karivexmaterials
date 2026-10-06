"""
Pizza-oven focus for the public site (owner decision, 6 October 2026).

The site sells pizza-oven materials and supplies and offers four services
confirmed by the owner: pizza oven building, oven repair & relining,
material selection advice, and delivery of materials. Everything else in
the supplied catalogue is kept in the database but hidden ("archived").

Copy here describes what each product is and how it is used in a pizza
oven. It makes no claims about prices, stock, temperature ratings, lead
times, guarantees, coverage areas or certifications — those stay open
until confirmed (see docs/open-questions.md).
"""

PIZZA_CATEGORIES = [
    {
        "short_code": "OF",
        "name": "Oven Floor & Hearth",
        "slug": "oven-floor-hearth",
        "order": 1,
        "status": "published",
        "intro": (
            "Materials for the cooking floor of a pizza oven and the insulated hearth beneath "
            "it: fire bricks or castable for the surface the pizza bakes on, with vermiculite "
            "or perlite insulation underneath so heat stays in the floor instead of soaking "
            "into the base."
        ),
        "quote_checklist": (
            "Internal oven floor size (width × depth) or diameter\n"
            "Whether the floor will be fire brick or cast\n"
            "The base the hearth sits on\n"
            "Number of ovens\n"
            "Delivery location"
        ),
    },
    {
        "short_code": "OD",
        "name": "Dome, Walls & Bonding",
        "slug": "dome-walls-bonding",
        "order": 2,
        "status": "published",
        "intro": (
            "Fire bricks, refractory castable, refractory cement and refractory mortar used to "
            "build and bond the dome or walls of a pizza oven, and to repair cracks and loose "
            "bricks in an existing one."
        ),
        "quote_checklist": (
            "Oven shape and internal size (dome diameter and height)\n"
            "Brick dome or cast dome\n"
            "New build or repair\n"
            "Delivery location"
        ),
    },
    {
        "short_code": "OI",
        "name": "Oven Insulation",
        "slug": "pizza-oven-insulation",
        "order": 3,
        "status": "published",
        "intro": (
            "Insulation for the outside of the dome and under the hearth: ceramic fibre blanket "
            "wrapped over the dome, and vermiculite or perlite for insulating layers and "
            "lightweight insulating mixes. Good insulation helps an oven hold heat and keeps "
            "the outer shell cooler."
        ),
        "quote_checklist": (
            "Dome size (to estimate blanket area)\n"
            "Hearth size (to estimate insulating fill)\n"
            "Planned insulation thickness, if known\n"
            "Delivery location"
        ),
    },
    {
        "short_code": "OS",
        "name": "Door Seals & Finishing",
        "slug": "door-seals-finishing",
        "order": 4,
        "status": "published",
        "intro": (
            "Ceramic fibre rope for oven door seals and high-temperature sealants and adhesives "
            "for joints around doors, flues and fittings."
        ),
        "quote_checklist": (
            "Door size or the length of seal needed\n"
            "Rope profile and size, if known\n"
            "What the sealant will join\n"
            "Delivery location"
        ),
    },
]

PIZZA_APPLICATIONS = [
    {
        "slug": "new-pizza-oven-builds",
        "name": "New Pizza Oven Builds",
        "order": 1,
        "status": "published",
        "summary": "Everything that goes into a new oven: floor, hearth insulation, dome, insulation and door seal.",
        "intro": (
            "A pizza oven is built in layers: an insulated hearth, a refractory cooking floor, "
            "a dome or walls of fire brick or castable, insulation over the dome, and a sealed "
            "door. Use the materials below for your own build, or ask us to build the oven for "
            "you."
        ),
        "considerations": (
            "Who the oven is for: pizzeria, restaurant, hotel, bakery or home\n"
            "Internal size, or how many pizzas you want to bake at once\n"
            "Fuel you plan to use\n"
            "Indoor or outdoor installation, and the base it will sit on\n"
            "Whether you want materials only or a built oven"
        ),
    },
    {
        "slug": "pizza-oven-repair",
        "name": "Pizza Oven Repair & Relining",
        "order": 2,
        "status": "published",
        "summary": "Materials for cracked domes, worn floors, failed insulation and door seals.",
        "intro": (
            "Ovens wear with use: floor bricks crack or loosen, domes develop cracks, insulation "
            "settles and door seals harden. Matching the repair material to the oven's original "
            "construction matters, so share photos and what you have noticed."
        ),
        "considerations": (
            "Which part is damaged: floor, dome, insulation or door seal\n"
            "How the oven was built (brick or cast) and its size\n"
            "Photos of the damage\n"
            "Whether you want materials only or a repair service"
        ),
    },
    {
        "slug": "pizzerias-restaurants",
        "name": "Pizzerias, Restaurants & Hotels",
        "order": 3,
        "status": "published",
        "summary": "Materials and support for ovens in commercial kitchens that bake every day.",
        "intro": (
            "Commercial ovens run for long hours, so floors, seals and insulation are worth "
            "planning carefully. We supply the materials, and can build or repair ovens and "
            "deliver to your site."
        ),
        "considerations": (
            "Daily baking volume and opening hours\n"
            "Available space and access for building or repair work\n"
            "When the oven can be out of use for repairs"
        ),
    },
    {
        "slug": "home-garden-pizza-ovens",
        "name": "Home & Garden Pizza Ovens",
        "order": 4,
        "status": "published",
        "summary": "Materials for building or repairing a pizza oven at home.",
        "intro": (
            "Building your own oven? Tell us the size you are planning and we will help you "
            "work out the bricks, mortar, insulation and seals you need — or we can build it "
            "for you."
        ),
        "considerations": (
            "Planned internal size\n"
            "Base or stand the oven will sit on\n"
            "Indoor, covered or open-air location"
        ),
    },
]

PIZZA_SERVICES = [
    {
        "slug": "pizza-oven-building",
        "name": "Pizza Oven Building",
        "order": 1,
        "status": "published",
        "summary": "We build pizza ovens for pizzerias, restaurants, hotels, bakeries and homes.",
        "description": (
            "We build pizza ovens using the refractory and insulation materials in our "
            "catalogue. Each oven is planned around how it will be used — how many pizzas you "
            "bake, the space available and the fuel you want to use.\n\n"
            "Every build is quoted individually once we understand the site and the oven you "
            "need. Send us the details below, with photos of the site if you can."
        ),
        "includes": (
            "Discussing your requirements and the site\n"
            "Insulated hearth and refractory cooking floor\n"
            "Dome or walls in fire brick or refractory castable\n"
            "Insulation over the dome\n"
            "Door opening and door seal"
        ),
        "request_checklist": (
            "Where the oven will be built (town and site)\n"
            "Who it is for: pizzeria, restaurant, hotel, bakery or home\n"
            "Internal size, or how many pizzas at once\n"
            "Fuel you plan to use\n"
            "Indoor or outdoor, and photos of the site\n"
            "When you would like the oven ready"
        ),
        "related": [
            "fire-bricks-refractory-bricks", "refractory-mortar", "refractory-castables",
            "ceramic-fibre-blanket", "vermiculite", "ceramic-fibre-rope",
        ],
        "review_notes": (
            "Owner confirmed the building service on 2026-10-06. Confirm scope before adding "
            "details: fuels covered, flue/chimney work, finishing/render, base construction, "
            "service area, typical lead time. No prices, timelines or guarantees are published."
        ),
    },
    {
        "slug": "pizza-oven-repair-relining",
        "name": "Pizza Oven Repair & Relining",
        "order": 2,
        "status": "published",
        "summary": "Repairs to floors, domes, insulation and door seals of existing pizza ovens.",
        "description": (
            "We repair and reline existing pizza ovens: replacing cracked or worn floor bricks, "
            "repairing dome cracks, renewing insulation and replacing door seals, using "
            "refractory materials suited to the oven's construction.\n\n"
            "Send photos of the oven and describe the problem. We will tell you what is needed "
            "and quote the repair."
        ),
        "includes": (
            "Assessing the oven's condition\n"
            "Replacing cracked or loose floor bricks\n"
            "Repairing dome and wall cracks\n"
            "Renewing insulation\n"
            "Replacing door rope seals"
        ),
        "request_checklist": (
            "Where the oven is (town and site)\n"
            "What is wrong: floor, dome, insulation, door seal, heat loss\n"
            "Photos of the damage\n"
            "Oven size and how it was built, if known\n"
            "When the oven can be taken out of use"
        ),
        "related": [
            "fire-bricks-refractory-bricks", "refractory-mortar", "refractory-cement",
            "ceramic-fibre-blanket", "ceramic-fibre-rope", "high-temperature-adhesives-sealants",
        ],
        "review_notes": "Owner confirmed repair & relining on 2026-10-06. Confirm service area and any exclusions.",
    },
    {
        "slug": "pizza-oven-material-advice",
        "name": "Material Selection Advice",
        "order": 3,
        "status": "published",
        "summary": "Help choosing the right materials and quantities for your own oven project.",
        "description": (
            "Building or repairing an oven yourself? Tell us the oven's size and design and we "
            "will help you choose the right bricks, mortar, castable, insulation and seals, and "
            "estimate how much of each you need, so you can order everything at once."
        ),
        "includes": (
            "Matching materials to each part of the oven\n"
            "Estimating quantities from your dimensions or drawings\n"
            "A single quotation for all the materials"
        ),
        "request_checklist": (
            "Oven internal size and shape\n"
            "Drawings or photos, if you have them\n"
            "New build or repair\n"
            "Delivery location"
        ),
        "related": [
            "fire-bricks-refractory-bricks", "refractory-mortar", "hearth-materials",
            "ceramic-fibre-blanket", "vermiculite", "perlite",
        ],
        "review_notes": "Owner confirmed supply-only advice on 2026-10-06. Do not describe it as free unless confirmed.",
    },
    {
        "slug": "delivery-of-materials",
        "name": "Delivery of Materials",
        "order": 4,
        "status": "published",
        "summary": "Delivery of your oven materials to your site.",
        "description": (
            "We can deliver pizza oven materials to your site. Delivery is quoted with your "
            "order, based on the location and the quantity of materials."
        ),
        "includes": (
            "Delivery of ordered materials to your site\n"
            "Delivery cost included in your quotation"
        ),
        "request_checklist": (
            "Delivery address or town\n"
            "Materials and quantities, or your quote basket\n"
            "Any access restrictions at the site\n"
            "When you need the materials"
        ),
        "related": [],
        "review_notes": "Owner confirmed delivery on 2026-10-06. Confirm delivery area and lead times before publishing them.",
    },
]

# Products shown on the pizza-oven site. Values here replace the matching
# fields of the base catalogue entry; every other product is hidden.
PIZZA_PRODUCT_OVERRIDES = {
    "fire-bricks-refractory-bricks": {
        "name": "Fire Bricks for Pizza Ovens",
        "primary_category": "OF",
        "additional_categories": ["OD"],
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "pizzerias-restaurants", "home-garden-pizza-ovens"],
        "synonyms": "firebrick, fire brick, refractory brick, oven bricks, pizza oven bricks, oven floor bricks",
        "short_summary": "Fire bricks for pizza oven floors, domes and walls.",
        "description": (
            "Fire bricks (refractory bricks) are used for the cooking floor of a pizza oven and to "
            "build its dome or walls. They are made to withstand the repeated heating and cooling "
            "of daily baking.\n\n"
            "Dense bricks are used where the fire and pizzas touch; lighter insulating bricks are a "
            "different product used behind them. Tell us your oven size so we can estimate the "
            "number of bricks."
        ),
        "selection_notes": (
            "Oven floor size and dome size\n"
            "Floor only, dome only, or both\n"
            "Brick size, if your design specifies one\n"
            "Matching refractory mortar"
        ),
        "related": ["refractory-mortar", "hearth-materials", "refractory-castables"],
    },
    "hearth-materials": {
        "name": "Pizza Oven Hearth Materials",
        "primary_category": "OF",
        "additional_categories": ["OI"],
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "home-garden-pizza-ovens"],
        "synonyms": "oven hearth materials, pizza oven hearth, oven floor, pizza oven floor, hearth insulation",
        "short_summary": "The layers of a pizza oven floor: cooking surface plus the insulation beneath.",
        "description": (
            "A pizza oven hearth is built in layers: a cooking surface of fire brick or castable "
            "on top, an insulating layer of vermiculite or perlite concrete or similar underneath, "
            "all on a solid base. The insulation stops heat draining out of the floor, so pizzas "
            "keep baking evenly from below.\n\n"
            "Send us your hearth dimensions and planned layers and we will quote the materials for "
            "each one."
        ),
        "selection_notes": "Hearth dimensions\nPlanned layers and thicknesses\nThe base it sits on",
        "related": ["fire-bricks-refractory-bricks", "vermiculite", "perlite", "refractory-castables"],
    },
    "refractory-castables": {
        "name": "Refractory Castable for Pizza Ovens",
        "primary_category": "OD",
        "additional_categories": ["OF"],
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "pizzerias-restaurants"],
        "synonyms": "castable refractory, refractory concrete, castable, pizza oven castable",
        "short_summary": "Refractory concrete for cast domes, floor slabs and oven repairs.",
        "description": (
            "Refractory castable is mixed with water and cast or trowelled into shape. In pizza "
            "ovens it is used to cast a dome over a former, to cast floor slabs, and to rebuild "
            "damaged areas that are hard to repair in brick.\n\n"
            "Tell us the dome size and planned thickness so we can estimate the number of bags."
        ),
        "selection_notes": "Dome or slab size and thickness\nNew build or repair\nNumber of bags, if known",
        "related": ["fire-bricks-refractory-bricks", "ceramic-fibre-blanket", "refractory-cement"],
    },
    "refractory-cement": {
        "name": "Refractory Cement",
        "primary_category": "OD",
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "home-garden-pizza-ovens"],
        "synonyms": "fireproof cement, fire cement, heat-resistant cement, oven cement, pizza oven cement",
        "short_summary": "Heat-resistant cement for building and patching pizza ovens.",
        "description": (
            "Refractory cement is a heat-resistant cement used in pizza oven construction and for "
            "patching cracks and gaps in domes, walls and flue joints. Many buyers ask for it as "
            "“fireproof cement”.\n\n"
            "Refractory cements differ in how they are mixed and cured, so ask us for the "
            "datasheet of the product we quote."
        ),
        "selection_notes": "Use: bonding bricks, patching cracks, or a refractory mix\nNumber of bags",
        "related": ["refractory-mortar", "fire-bricks-refractory-bricks", "high-temperature-adhesives-sealants"],
    },
    "refractory-mortar": {
        "name": "Refractory Mortar",
        "primary_category": "OD",
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "home-garden-pizza-ovens"],
        "synonyms": "heat-resistant mortar, fire mortar, fireclay mortar, jointing mortar, pizza oven mortar",
        "short_summary": "Heat-resistant mortar for laying fire bricks in oven floors and domes.",
        "description": (
            "Refractory mortar bonds fire bricks in the dome and walls of a pizza oven, and is "
            "used to re-point loose bricks during repairs. Ordinary building mortar breaks down "
            "under oven heat, so the joints in the hot part of an oven need refractory mortar.\n\n"
            "Tell us how many bricks you are laying and we will suggest a quantity."
        ),
        "selection_notes": "Number of bricks or dome size\nNew build or repair",
        "related": ["fire-bricks-refractory-bricks", "refractory-cement"],
    },
    "ceramic-fibre-blanket": {
        "name": "Ceramic Fibre Blanket for Oven Insulation",
        "primary_category": "OI",
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "pizzerias-restaurants", "home-garden-pizza-ovens"],
        "synonyms": "ceramic fiber blanket, refractory ceramic fibre blanket, RCF blanket, oven insulation blanket, dome insulation",
        "short_summary": "Flexible insulation blanket wrapped over a pizza oven dome.",
        "description": (
            "Ceramic fibre blanket is a lightweight, flexible insulation wrapped over the outside "
            "of a pizza oven dome, under the outer render or enclosure. It helps the oven hold heat "
            "and keeps the outside cooler.\n\n"
            "Blankets come in different thicknesses and densities. Wear gloves and a dust mask "
            "when cutting and handling, and follow the manufacturer's safety data sheet."
        ),
        "selection_notes": "Dome diameter and height (to estimate area)\nPlanned insulation thickness\nNumber of rolls, if known",
        "related": ["vermiculite", "perlite", "ceramic-fibre-rope"],
    },
    "vermiculite": {
        "name": "Vermiculite",
        "primary_category": "OI",
        "additional_categories": ["OF"],
        "applications": ["new-pizza-oven-builds", "home-garden-pizza-ovens"],
        "synonyms": "exfoliated vermiculite, vermiculite insulation, vermiculite concrete, hearth insulation",
        "short_summary": "Lightweight mineral for insulating hearths and domes.",
        "description": (
            "Vermiculite is a natural mineral expanded into light granules. Mixed with cement it "
            "makes a lightweight insulating concrete for the layer under a pizza oven floor; it is "
            "also used as loose insulating fill around domes."
        ),
        "selection_notes": "Hearth size and insulating layer thickness\nNumber of bags",
        "related": ["perlite", "hearth-materials", "ceramic-fibre-blanket"],
    },
    "perlite": {
        "name": "Perlite",
        "primary_category": "OI",
        "additional_categories": ["OF"],
        "applications": ["new-pizza-oven-builds", "home-garden-pizza-ovens"],
        "synonyms": "expanded perlite, perlite insulation, perlite concrete, hearth insulation",
        "short_summary": "Expanded volcanic mineral for lightweight insulating mixes and fill.",
        "description": (
            "Perlite is volcanic glass expanded into very light white granules. Like vermiculite, "
            "it is mixed with cement to make insulating concrete under an oven floor, or used as "
            "loose insulating fill."
        ),
        "selection_notes": "Hearth size and insulating layer thickness\nNumber of bags",
        "related": ["vermiculite", "hearth-materials"],
    },
    "ceramic-fibre-rope": {
        "name": "Ceramic Fibre Rope (Oven Door Seal)",
        "primary_category": "OS",
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair", "pizzerias-restaurants"],
        "synonyms": "ceramic fiber rope, oven door rope, oven door seal, door gasket rope",
        "short_summary": "Heat-resistant rope for sealing pizza oven doors.",
        "description": (
            "Ceramic fibre rope seals the gap around a pizza oven door so heat stays in the oven. "
            "It is available in round and square profiles in different sizes; worn or hardened "
            "rope can be replaced during servicing."
        ),
        "selection_notes": "Rope profile (round or square) and size\nLength needed (door perimeter)",
        "related": ["high-temperature-adhesives-sealants", "ceramic-fibre-blanket"],
    },
    "high-temperature-adhesives-sealants": {
        "name": "High-Temperature Sealants & Adhesives",
        "primary_category": "OS",
        "applications": ["new-pizza-oven-builds", "pizza-oven-repair"],
        "synonyms": "refractory adhesive, high-temp sealant, fire sealant, oven sealant, rope adhesive",
        "short_summary": "Sealants and adhesives for joints and door seals on hot ovens.",
        "description": (
            "High-temperature sealants and adhesives seal joints around oven doors, flues and "
            "metal fittings, and fix door rope in place, where ordinary sealants would break "
            "down. Tell us what you need to seal and how hot that area runs."
        ),
        "selection_notes": "What is being sealed or bonded\nHow hot that area gets\nNumber of cartridges or tubs",
        "related": ["ceramic-fibre-rope", "refractory-cement"],
    },
    "fondu-cement": {
        "primary_category": "OD",
        "applications": ["new-pizza-oven-builds"],
        "status": "draft",
    },
}


# Search titles, descriptions and FAQs (see catalog/seed_pizza_seo.py).
from .seed_pizza_seo import CATEGORY_SEO, PRODUCT_SEO, SERVICE_SEO  # noqa: E402

for _slug, _extra in PRODUCT_SEO.items():
    PIZZA_PRODUCT_OVERRIDES[_slug].update(_extra)
for _service in PIZZA_SERVICES:
    _service.update(SERVICE_SEO.get(_service["slug"], {}))
for _category in PIZZA_CATEGORIES:
    _category.update(CATEGORY_SEO.get(_category["slug"], {}))
