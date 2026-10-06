"""
Roof cyclones (turbine roof ventilators): selling, installation and repair.
Owner confirmed on 6 October 2026: stock is 600 mm stainless steel cyclones;
the business supplies, installs and repairs them. Merged into the seed data
by catalog/seed_pizza.py.

General facts (how cyclones work, common faults) come from public
references. Prices are NOT stated until confirmed.
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
        "churches and homes without using electricity. We stock 600 mm stainless steel roof "
        "cyclones, install them, and repair worn, noisy or leaking ones."
    ),
    "quote_checklist": (
        "Building type and approximate roof area\n"
        "Roof sheet profile and pitch\n"
        "Number of cyclones (we stock 600 mm stainless steel)\n"
        "Supply only, or supply and installation\n"
        "Site location"
    ),
    "seo_title": "Roof Cyclones (Turbine Roof Ventilators) in Kenya",
    "seo_description": "600 mm stainless steel roof cyclones for factories, warehouses and homes, supplied, installed and repaired from Nairobi. Request a quote.",
}

CYCLONE_APPLICATION = {
    "slug": "roof-ventilation",
    "name": "Roof Ventilation for Factories, Warehouses & Homes",
    "order": 5,
    "status": "published",
    "summary": "Roof cyclones supplied and installed to move hot, humid air out of buildings, and repaired to keep them turning.",
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
    "name": "600 mm Stainless Steel Roof Cyclones",
    "primary_category": "RC",
    "additional_categories": [],
    "applications": ["roof-ventilation"],
    "synonyms": "roof cyclone, cyclone vent, turbine ventilator, whirlybird, roof turbine vent, wind turbine ventilator, wind driven ventilator, roof extractor",
    "short_summary": "600 mm stainless steel turbine ventilators that pull hot, stale air out of roofs without electricity. Supply and installation.",
    "description": (
        "A roof cyclone is a turbine ventilator mounted over an opening in the roof. Wind spins "
        "its curved vanes, creating low pressure above the opening that draws warm, stale and humid "
        "air out of the building, while rising warm air helps the flow. It needs no electricity "
        "and has no running cost.\n\n"
        "We stock 600 mm (throat diameter) roof cyclones in stainless steel, which resists rust "
        "and weathering on exposed roofs. We can supply them on their own or install them for "
        "you, fitting the base to your roof profile and sealing it against rain.\n\n"
        "Cyclones are used on factories, warehouses, workshops, poultry houses, schools, churches "
        "and homes. Because they rely on wind, they work best where there is a regular breeze; on "
        "still days they act as a passive vent. Tell us your building size, roof profile and the "
        "number of cyclones you need, and whether you want installation, and we will quote."
    ),
    "selection_notes": (
        "Building type and roof area\n"
        "Roof sheet profile and pitch (for the base)\n"
        "Number of cyclones\n"
        "Supply only, or supply and installation"
    ),
    "sales_unit": "cyclone",
    "status": "published",
    "review_notes": (
        "Owner confirmed 2026-10-06: 600 mm stainless steel cyclones stocked; supply, "
        "installation and repair offered. Confirm base types and prices before adding them."
    ),
    "related": [],
    "specifications": [
        {"label": "Throat diameter", "value": "600", "unit": "mm"},
        {"label": "Material", "value": "Stainless steel", "unit": ""},
        {"label": "Power", "value": "Wind-driven (no electricity)", "unit": ""},
    ],
    "variants": [
        {"label": "600 mm stainless steel", "diameter": "600 mm"},
    ],
    "seo_title": "600mm Stainless Steel Roof Cyclones for Sale in Kenya",
    "seo_description": "600 mm stainless steel roof cyclones (turbine ventilators) for factories, warehouses and homes. No electricity needed. Supply, installation and repair from Nairobi.",
    "faqs": (
        "Q: What is a roof cyclone?\n"
        "A: A roof cyclone, also called a turbine ventilator or whirlybird, is a wind-driven vent on the roof. Its spinning vanes draw hot, stale and humid air out of the building.\n\n"
        "Q: Do roof cyclones need electricity?\n"
        "A: No. They are turned by the wind, helped by warm air rising inside the building, so there is no running cost.\n\n"
        "Q: Do roof cyclones work when there is no wind?\n"
        "A: They spin best in a breeze. On still days they still act as an open passive vent that lets rising warm air escape.\n\n"
        "Q: What size and material are your roof cyclones?\n"
        "A: We stock 600 mm (throat diameter) roof cyclones made of stainless steel.\n\n"
        "Q: Do you install roof cyclones?\n"
        "A: Yes. We can supply cyclones only, or supply and install them, fitting the base to your roof profile and sealing it.\n\n"
        "Q: How many roof cyclones does my building need?\n"
        "A: It depends on the building's volume, use and how much air change you want. Send us the roof area, building type and roof profile and we will advise."
    ),
}

CYCLONE_SERVICE = {
    "slug": "roof-cyclone-repair",
    "name": "Roof Cyclone Repair",
    "order": 6,
    "status": "published",
    "summary": "Repairs to noisy, wobbling, stuck or leaking roof cyclones, or a new cyclone fitted.",
    "description": (
        "Roof cyclones run day and night, so over time bearings wear, heads start to wobble or "
        "squeak, vanes get damaged and the seal where the base meets the roof can fail and let in "
        "rain. We repair roof cyclones and, where a repair is not worthwhile, supply and fit a "
        "new 600 mm stainless steel cyclone.\n\n"
        "Send us photos of the cyclone and describe the problem, and we will advise and quote."
    ),
    "includes": (
        "Assessing noisy, wobbling or stuck cyclones\n"
        "Bearing and spindle repairs\n"
        "Straightening or replacing damaged heads\n"
        "Resealing leaking bases\n"
        "Supplying and fitting a new cyclone where needed"
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
        "Owner confirmed repair and installation on 2026-10-06. Confirm service area and roof "
        "access arrangements before adding them."
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
        "A: If the head and vanes are sound, repairing the bearing or base is usually enough. Badly corroded or damaged heads are often better replaced — we can supply and fit a new 600 mm stainless steel cyclone. Send photos and we will advise."
    ),
}

CYCLONE_INSTALL_SERVICE = {
    "slug": "roof-cyclone-installation",
    "name": "Roof Cyclone Installation",
    "order": 5,
    "status": "published",
    "summary": "Supply and installation of 600 mm stainless steel roof cyclones.",
    "description": (
        "We supply and install 600 mm stainless steel roof cyclones on factories, warehouses, "
        "workshops, schools, churches and homes. Each cyclone is fitted on a base matched to your "
        "roof sheet profile and pitch, and sealed so the roof stays watertight.\n\n"
        "Tell us about the building and roof and we will advise how many cyclones you need, "
        "where to place them, and quote the supply and installation."
    ),
    "includes": (
        "Advice on the number and placement of cyclones\n"
        "Supply of 600 mm stainless steel cyclones\n"
        "Cutting the roof opening and fitting the base to your roof profile\n"
        "Sealing the base against rain\n"
        "Fitting the cyclone and checking it turns freely"
    ),
    "request_checklist": (
        "Where the building is (town and site)\n"
        "Building type, size and roof area\n"
        "Roof sheet profile and pitch, with photos if possible\n"
        "How many cyclones you have in mind, if any\n"
        "When you would like the work done"
    ),
    "related": ["roof-ventilators-roof-cyclones"],
    "review_notes": (
        "Owner confirmed installation on 2026-10-06. Confirm service area, roof types covered "
        "and any access requirements before adding them. No prices or timelines published."
    ),
    "seo_title": "Roof Cyclone Installation in Nairobi, Kenya",
    "seo_description": "Supply and installation of 600 mm stainless steel roof cyclones (turbine ventilators) for factories, warehouses and homes, sealed against leaks. Request a quote.",
    "faqs": (
        "Q: How many roof cyclones should be installed?\n"
        "A: It depends on the building's size, use and how much hot or humid air needs removing. Send the roof area and building type and we will advise.\n\n"
        "Q: Where on the roof should cyclones go?\n"
        "A: Usually high on the roof, near the ridge, spread evenly so the whole space is ventilated.\n\n"
        "Q: Will installing a cyclone make my roof leak?\n"
        "A: Not when the base is matched to the roof profile and properly sealed, which is part of our installation.\n\n"
        "Q: Can you install cyclones on an existing roof?\n"
        "A: Yes. Cyclones are commonly added to existing metal roofs. Send photos of the roof so we can plan the work."
    ),
}
