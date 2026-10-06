"""
Roof cyclones (turbine roof ventilators): selling and repair.
Owner request, 6 October 2026. Merged into the seed data by
catalog/seed_pizza.py.

General facts here (how cyclones work, common faults) come from public
references; the sizes, materials and prices the business actually stocks
are NOT stated until confirmed (see docs/open-questions.md).
"""

CYCLONE_CATEGORY = {
    "short_code": "RC",
    "name": "Roof Cyclones",
    "slug": "roof-cyclones",
    "order": 5,
    "status": "published",
    "intro": (
        "Roof cyclones, also called turbine ventilators or whirlybirds, are wind-driven vents "
        "that draw hot, stale and humid air out of factories, warehouses, workshops, schools, "
        "churches and homes without using electricity. We supply roof cyclones and repair worn, "
        "noisy or leaking ones."
    ),
    "quote_checklist": (
        "Building type and approximate roof area\n"
        "Roof sheet profile and pitch\n"
        "Number of cyclones and throat size, if known\n"
        "Preferred material, if any (e.g. aluminium or stainless steel)\n"
        "Delivery location"
    ),
    "seo_title": "Roof Cyclones (Turbine Roof Ventilators) in Kenya",
    "seo_description": "Wind-driven roof cyclones for factories, warehouses and homes, plus roof cyclone repair. Supplied from Nairobi with delivery. Request a quote.",
}

CYCLONE_APPLICATION = {
    "slug": "roof-ventilation",
    "name": "Roof Ventilation for Factories, Warehouses & Homes",
    "order": 5,
    "status": "published",
    "summary": "Roof cyclones to move hot, humid air out of buildings, and repairs to keep them turning.",
    "intro": (
        "Metal roofs trap heat. Roof cyclones use the wind, helped by rising warm air, to pull "
        "hot and humid air out of the building through the roof. The number of cyclones needed "
        "depends on the building's size and use, so share your roof details for a quotation."
    ),
    "considerations": (
        "Building size and what it is used for\n"
        "Roof sheet profile and pitch\n"
        "Heat, humidity, fumes or dust you want to remove\n"
        "Existing cyclones that are noisy, stuck or leaking"
    ),
}

CYCLONE_PRODUCT_OVERRIDE = {
    "name": "Roof Cyclones (Turbine Roof Ventilators)",
    "primary_category": "RC",
    "additional_categories": [],
    "applications": ["roof-ventilation"],
    "synonyms": "roof cyclone, cyclone vent, turbine ventilator, whirlybird, roof turbine vent, wind turbine ventilator, wind driven ventilator, roof extractor",
    "short_summary": "Wind-driven turbine ventilators that pull hot, stale air out of roofs without electricity.",
    "description": (
        "A roof cyclone is a turbine ventilator mounted over an opening in the roof. Wind spins "
        "its curved vanes, creating low pressure above the opening that draws warm, stale and humid "
        "air out of the building, while rising warm air helps the flow. It needs no electricity "
        "and has no running cost.\n\n"
        "Cyclones are used on factories, warehouses, workshops, poultry houses, schools, churches "
        "and homes. Because they rely on wind, they work best where there is a regular breeze; on "
        "still days they act as a passive vent. Tell us your building size, roof profile and the "
        "number of cyclones you need, and we will quote."
    ),
    "selection_notes": (
        "Building type and roof area\n"
        "Roof sheet profile and pitch (for the base/flashing)\n"
        "Throat size and number of cyclones\n"
        "Preferred material, if any"
    ),
    "status": "published",
    "review_notes": (
        "Owner confirmed selling and repairing roof cyclones on 2026-10-06. Confirm the sizes "
        "(throat diameters), materials and base types actually stocked, and any prices, before "
        "adding variants or a price."
    ),
    "related": [],
    "seo_title": "Roof Cyclones for Sale in Kenya — Turbine Roof Ventilators",
    "seo_description": "Wind-driven roof cyclones (turbine ventilators) for factories, warehouses and homes. No electricity needed. Supplied from Nairobi with delivery and repair service.",
    "faqs": (
        "Q: What is a roof cyclone?\n"
        "A: A roof cyclone, also called a turbine ventilator or whirlybird, is a wind-driven vent on the roof. Its spinning vanes draw hot, stale and humid air out of the building.\n\n"
        "Q: Do roof cyclones need electricity?\n"
        "A: No. They are turned by the wind, helped by warm air rising inside the building, so there is no running cost.\n\n"
        "Q: Do roof cyclones work when there is no wind?\n"
        "A: They spin best in a breeze. On still days they still act as an open passive vent that lets rising warm air escape.\n\n"
        "Q: How many roof cyclones does my building need?\n"
        "A: It depends on the building's volume, use and how much air change you want. Send us the roof area, building type and roof profile and we will advise."
    ),
}

CYCLONE_SERVICE = {
    "slug": "roof-cyclone-repair",
    "name": "Roof Cyclone Repair",
    "order": 5,
    "status": "published",
    "summary": "Repairs to noisy, wobbling, stuck or leaking roof cyclones.",
    "description": (
        "Roof cyclones run day and night, so over time bearings wear, heads start to wobble or "
        "squeak, vanes get damaged and the seal where the base meets the roof can fail and let in "
        "rain. We repair roof cyclones and, where a repair is not worthwhile, can supply a "
        "replacement.\n\n"
        "Send us photos of the cyclone and describe the problem, and we will advise and quote."
    ),
    "includes": (
        "Assessing noisy, wobbling or stuck cyclones\n"
        "Bearing and spindle repairs\n"
        "Straightening or replacing damaged heads\n"
        "Resealing leaking bases\n"
        "Supply of replacement cyclones where needed"
    ),
    "request_checklist": (
        "Where the building is (town and site)\n"
        "Number of cyclones and the problem with each\n"
        "Photos of the cyclones and their bases\n"
        "Roof height and access\n"
        "When the work can be done"
    ),
    "related": ["roof-ventilators-roof-cyclones"],
    "review_notes": (
        "Owner confirmed cyclone repair on 2026-10-06. Confirm service area, whether roof access "
        "equipment is included, and whether new installations are offered before adding them."
    ),
    "seo_title": "Roof Cyclone Repair in Nairobi, Kenya",
    "seo_description": "Repair of squeaking, wobbling, stuck or leaking roof cyclones (turbine ventilators): bearings, heads and base seals. Send photos for a quote.",
    "faqs": (
        "Q: Why is my roof cyclone squeaking?\n"
        "A: Squeaking or grinding usually means the bearing is worn or has lost its lubrication. Left alone it can get louder and the head can start to wobble.\n\n"
        "Q: Why has my roof cyclone stopped spinning?\n"
        "A: Common causes are a seized or rusted bearing, a bent spindle, damaged vanes rubbing on the frame, or debris. A stuck cyclone still vents a little but much less.\n\n"
        "Q: My roof leaks around the cyclone. Can it be fixed?\n"
        "A: Leaks usually come from the seal where the cyclone base meets the roof sheet, or from loose fixings. Resealing the base normally fixes it.\n\n"
        "Q: Is it better to repair or replace a cyclone?\n"
        "A: If the head and vanes are sound, repairing the bearing or base is usually enough. Badly corroded or damaged heads are often better replaced. Send photos and we will advise."
    ),
}
