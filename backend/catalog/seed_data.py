"""
Source-of-truth catalogue seed data for KariVex Industrial Materials.

This encodes the mapping decisions recorded in docs/catalogue-mapping.md:
every item in the originally supplied catalogue list became a product,
a synonym on an existing product, a product variant, a category, an
application, or a documented cross-link/collection. Nothing here asserts
a specification, price, certification, or performance claim that was not
already definitional to the product's name — unverifiable facts are left
blank and flagged in `review_notes` instead.

Run via: python manage.py seed_catalog [--update]
"""

CATEGORIES = [
    {
        "short_code": "A",
        "name": "Building & Acoustic Insulation",
        "slug": "building-acoustic-insulation",
        "order": 1,
        "intro": (
            "Thermal and acoustic insulation materials for roofs, walls, ceilings and "
            "partitions, covering mineral wool, foam, polystyrene and reflective foil "
            "systems used across construction, industrial buildings and fit-out projects."
        ),
    },
    {
        "short_code": "B",
        "name": "Refractory & High-Temperature Materials",
        "slug": "refractory-high-temperature-materials",
        "order": 2,
        "intro": (
            "Cements, mortars, castables, bricks and ceramic fibre products used to line, "
            "build and insulate furnaces, kilns, ovens, boilers and other high-temperature "
            "industrial equipment."
        ),
    },
    {
        "short_code": "C",
        "name": "Roof Ventilation & Cladding",
        "slug": "roof-ventilation-cladding",
        "order": 3,
        "intro": (
            "Ventilation and cladding materials for industrial and commercial roofs, "
            "including passive roof ventilators and cladding products, cross-linked to "
            "our roof insulation range."
        ),
    },
    {
        "short_code": "D",
        "name": "EPS Packaging & Cold-Chain Boxes",
        "slug": "eps-packaging-cold-chain-boxes",
        "order": 4,
        "intro": (
            "Expanded polystyrene (EPS) boxes and insulated containers for fish, meat, "
            "produce, ice and general cold-chain packaging, including custom-made boxes "
            "to specification."
        ),
    },
    {
        "short_code": "E",
        "name": "Refrigeration & HVAC Materials",
        "slug": "refrigeration-hvac-materials",
        "order": 5,
        "intro": (
            "Pipe and sheet insulation, and copper pipe, for refrigeration, air "
            "conditioning and cold-room installation work."
        ),
    },
    {
        "short_code": "F",
        "name": "Industrial Tapes, Sealants & Electrical Insulation",
        "slug": "industrial-tapes-sealants-electrical-insulation",
        "order": 6,
        "intro": (
            "Thermal and heat-resistant tapes, aluminium tape, high-temperature adhesives "
            "and sealants, and electrical insulating mats for industrial and HVAC use."
        ),
    },
]

APPLICATIONS = [
    {
        "slug": "roofing-insulation",
        "name": "Roofing & Insulation",
        "order": 1,
        "intro": (
            "Roofing contractors and building owners select insulation based on the roof "
            "construction type, the required thermal and acoustic performance, and fire "
            "and moisture exposure. Share your roof type, area and specification with us "
            "and we will point you to the relevant materials in this catalogue — we do not "
            "offer installation services ourselves."
        ),
    },
    {
        "slug": "bakeries-pizza-ovens",
        "name": "Bakeries & Pizza Ovens",
        "order": 2,
        "intro": (
            "Oven builders and bakery operators use refractory cements, bricks, castables "
            "and ceramic fibre products for hearths, oven domes and insulation layers. "
            "Material choice depends on the oven design and operating temperature — "
            "confirm these with your oven builder before ordering."
        ),
    },
    {
        "slug": "industrial-furnaces",
        "name": "Industrial Furnaces",
        "order": 3,
        "intro": (
            "Furnace and kiln linings use refractory castables, bricks, ceramic fibre "
            "blanket, module and paper, plus vermiculite and perlite as lightweight "
            "insulating fill. We supply the materials on enquiry; temperature ratings "
            "and lining design should be confirmed against the manufacturer's datasheet "
            "for your specific application."
        ),
    },
    {
        "slug": "refrigeration-hvac",
        "name": "Refrigeration & HVAC",
        "order": 4,
        "intro": (
            "Refrigeration and HVAC installers use elastomeric foam pipe and sheet "
            "insulation, copper pipe, and insulation tape for cold rooms, chillers and "
            "air-conditioning lines. Confirm pipe diameters and wall thickness against "
            "your system design."
        ),
    },
    {
        "slug": "packaging-cold-chain",
        "name": "Packaging & Cold Chain",
        "order": 5,
        "intro": (
            "EPS boxes and insulated containers are used across fish, meat, produce and "
            "general cold-chain packaging. Suitability for specific regulated uses, such "
            "as pharmaceutical cold-chain transport, depends on validated performance data "
            "that must be confirmed before use — see the relevant product notes."
        ),
    },
]

# Each product dict:
#   slug, name, primary_category (short_code), additional_categories ([short_code,...]),
#   applications ([slug,...]), brand, synonyms, short_summary, description,
#   status ("draft"/"published"), review_notes, specifications ([{label,value,unit}]),
#   variants ([{label, thickness, dimensions, density, diameter, box_capacity, pack_size}])
PRODUCTS = [
    # --- A. Building & Acoustic Insulation ---
    {
        "slug": "rockwool-insulation",
        "name": "Rockwool (Mineral Wool) Insulation",
        "primary_category": "A",
        "applications": ["roofing-insulation"],
        "synonyms": "rock wool, mineral wool, stone wool insulation",
        "short_summary": "Stone/mineral wool insulation for thermal and acoustic control in roofs, walls and partitions.",
        "description": (
            "Rockwool, also known as mineral or stone wool, is a fibrous insulation "
            "material used for thermal and acoustic insulation in roofs, walls, "
            "ceilings and industrial applications. It is supplied in slab, batt or "
            "roll form depending on the project."
        ),
        "status": "published",
        "review_notes": (
            "Confirm whether the supplied product is the ROCKWOOL(TM) branded product "
            "or a generic/other-manufacturer mineral wool before adding a brand field "
            "or using the capitalised brand name in marketing copy."
        ),
    },
    {
        "slug": "fibreglass-insulation",
        "name": "Fibreglass Insulation",
        "primary_category": "A",
        "applications": ["roofing-insulation"],
        "synonyms": "fiberglass insulation, glass wool, fibre glass, glasswool",
        "short_summary": "Glass-fibre insulation for roofs, walls and ductwork thermal and acoustic control.",
        "description": (
            "Fibreglass (glass wool) insulation is a lightweight, fibrous insulation "
            "material used for thermal and acoustic insulation of roofs, walls, "
            "ceilings and ducting. It is typically supplied in roll or batt form."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "polyethylene-foam-insulation",
        "name": "Polyethylene Foam Insulation",
        "primary_category": "A",
        "additional_categories": ["E"],
        "applications": ["roofing-insulation", "refrigeration-hvac"],
        "synonyms": "PE foam insulation, closed-cell PE foam",
        "short_summary": "Closed-cell polyethylene foam sheet/roll insulation for thermal and moisture control.",
        "description": (
            "Closed-cell polyethylene foam insulation is used as a lightweight thermal "
            "and vapour barrier layer in roofing, wall and pipe insulation systems. It "
            "is supplied in sheet or roll form."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "polystyrene-insulation-sheets",
        "name": "Polystyrene Insulation Sheets (EPS / XPS)",
        "primary_category": "A",
        "additional_categories": ["D"],
        "applications": ["roofing-insulation"],
        "synonyms": "polystyrene sheets, foam board insulation",
        "short_summary": "Rigid polystyrene insulation board for building insulation — type pending verification.",
        "description": (
            "Rigid polystyrene insulation sheets are used as board insulation in walls, "
            "roofs and floors. Polystyrene insulation is manufactured as either expanded "
            "polystyrene (EPS) or extruded polystyrene (XPS); these materials have "
            "different manufacturing processes and performance characteristics and are "
            "not interchangeable. See DuPont's reference on Styrofoam (an XPS brand) for "
            "background: https://www.dupont.com/building/styrofoam.html."
        ),
        "status": "draft",
        "review_notes": (
            "Confirm whether the supplied sheets are EPS, XPS, or both, before "
            "publishing. Split into separate 'EPS Insulation Sheets' and 'XPS "
            "Insulation Sheets' products once confirmed, per the canonical-URL rule — "
            "do not publish a single page claiming both without verification."
        ),
    },
    {
        "slug": "pu-spray-foam-insulation",
        "name": "PU Spray Foam Insulation",
        "primary_category": "A",
        "additional_categories": ["E"],
        "applications": ["roofing-insulation", "refrigeration-hvac"],
        "synonyms": "PU insulation foam, polyurethane spray foam, PUF insulation, spray polyurethane foam",
        "short_summary": "Sprayed polyurethane foam insulation for roofs, walls and cold-store envelopes.",
        "description": (
            "Polyurethane (PU) spray foam is applied as a seamless, adhered insulation "
            "layer on roofs, walls and cold-storage structures, expanding on "
            "application to fill the surface it is sprayed onto."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "acoustic-insulation-foam",
        "name": "Acoustic Insulation Foam",
        "primary_category": "A",
        "applications": ["roofing-insulation"],
        "synonyms": "sound insulation foam, noise insulation foam, acoustic foam",
        "short_summary": "Foam insulation selected for sound absorption/attenuation in buildings and plant rooms.",
        "description": (
            "Acoustic insulation foam is used to reduce sound transmission or "
            "reverberation in walls, ceilings and plant enclosures. It is supplied in "
            "sheet form for cutting to the required panel size."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "reflective-foil-insulation",
        "name": "Reflective Foil Insulation (Sisalation)",
        "primary_category": "A",
        "additional_categories": ["C"],
        "applications": ["roofing-insulation"],
        "synonyms": "sisalation, foil insulation, radiant barrier",
        "short_summary": "Reflective foil/foil-faced insulation used as a radiant barrier under roofing.",
        "description": (
            "Reflective foil insulation is installed under roofing as a radiant "
            "barrier and secondary moisture layer. 'Sisalation' is a widely used "
            "market name for this product category in the region."
        ),
        "status": "published",
        "review_notes": (
            "Confirm the actual manufacturer/brand of the supplied foil before "
            "asserting 'Sisalation' as the brand rather than a generic market term — "
            "currently used only as a search synonym, not a verified brand claim."
        ),
    },

    # --- B. Refractory & High-Temperature Materials ---
    {
        "slug": "refractory-cement",
        "name": "Refractory Cement",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "fireproof cement, heat-resistant cement",
        "short_summary": "Heat-resistant cement for furnace, kiln and oven construction and repair.",
        "description": (
            "Refractory cement is a heat-resistant cement used for building and "
            "repairing furnaces, kilns, ovens and fireplaces, where it is exposed to "
            "sustained high temperatures."
        ),
        "status": "published",
        "review_notes": "'Fireproof cement' is treated as a customer search synonym for this product.",
    },
    {
        "slug": "fondu-cement",
        "name": "Fondu Cement",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "ciment fondu, calcium aluminate cement",
        "short_summary": "Calcium aluminate cement grade — supplier/manufacturer identity pending confirmation.",
        "description": (
            "Fondu cement refers to a calcium aluminate cement, a different material "
            "class from standard refractory/fireclay cement, used in refractory and "
            "rapid-strength applications."
        ),
        "status": "draft",
        "review_notes": (
            "Confirm the exact supplied grade and manufacturer before publishing. Do "
            "not treat as equivalent to MAX-50 or the Maxheat products without "
            "supplier confirmation."
        ),
    },
    {
        "slug": "max-50",
        "name": "MAX-50",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "",
        "short_summary": "Trade-named refractory product — category and manufacturer pending confirmation.",
        "description": (
            "MAX-50 is a supplied trade name pending identification against a "
            "manufacturer datasheet. A full description will be published once the "
            "product category and specification are confirmed."
        ),
        "status": "draft",
        "review_notes": "Unresolved trade name. Obtain supplier datasheet before publishing specifications.",
    },
    {
        "slug": "maxheat-k",
        "name": "Maxheat K",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "",
        "short_summary": "Trade-named refractory product — category and manufacturer pending confirmation.",
        "description": (
            "Maxheat K is a supplied trade name pending identification against a "
            "manufacturer datasheet. A full description will be published once the "
            "product category and specification are confirmed."
        ),
        "status": "draft",
        "review_notes": (
            "Unresolved trade name — keep distinguishable from Maxheat A and MAX-50 "
            "until datasheets confirm whether these are different grades."
        ),
    },
    {
        "slug": "maxheat-a",
        "name": "Maxheat A",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "",
        "short_summary": "Trade-named refractory product — category and manufacturer pending confirmation.",
        "description": (
            "Maxheat A is a supplied trade name pending identification against a "
            "manufacturer datasheet. A full description will be published once the "
            "product category and specification are confirmed."
        ),
        "status": "draft",
        "review_notes": (
            "Unresolved trade name — keep distinguishable from Maxheat K and MAX-50 "
            "until datasheets confirm whether these are different grades."
        ),
    },
    {
        "slug": "refractory-mortar",
        "name": "Refractory Mortar",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "heat-resistant mortar, fire mortar",
        "short_summary": "Heat-resistant mortar for jointing fire bricks and refractory brickwork.",
        "description": (
            "Refractory mortar is used to bed and joint fire bricks and refractory "
            "brickwork in furnaces, kilns, ovens and chimneys."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "fire-bricks-refractory-bricks",
        "name": "Fire Bricks / Refractory Bricks",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "firebrick, refractory brick, insulating firebrick, IFB",
        "short_summary": "Dense and insulating fire brick for furnace, kiln and oven linings.",
        "description": (
            "Fire bricks (refractory bricks) are used to build the inner linings of "
            "furnaces, kilns, ovens and fireplaces. 'Fire brick' and 'refractory "
            "brick' are used interchangeably by most buyers; dense and lightweight "
            "insulating grades exist as different product types."
        ),
        "status": "published",
        "review_notes": (
            "Add separate dense-vs-insulating-grade variants once the supplied range "
            "is confirmed."
        ),
    },
    {
        "slug": "refractory-castables",
        "name": "Refractory Castables",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "castable refractory, refractory concrete",
        "short_summary": "Pourable/trowel-applied refractory lining material for furnaces and kilns.",
        "description": (
            "Refractory castables are cast or trowel-applied refractory linings used "
            "where a monolithic (jointless) furnace or kiln lining is required."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "ceramic-fibre-blanket",
        "name": "Ceramic Fibre Blanket",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens"],
        "synonyms": "ceramic fiber blanket, refractory ceramic fibre blanket, RCF blanket",
        "short_summary": "Flexible ceramic fibre blanket insulation for furnace, kiln and oven linings.",
        "description": (
            "Ceramic fibre blanket is a lightweight, flexible insulation material used "
            "as a lining or backup insulation layer in furnaces, kilns and high-"
            "temperature equipment."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "ceramic-fibre-modules",
        "name": "Ceramic Fibre Modules",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "ceramic fiber modules, folded/stacked ceramic fibre modules",
        "short_summary": "Pre-folded ceramic fibre modules for fast furnace and kiln lining installation.",
        "description": (
            "Ceramic fibre modules are pre-cut, folded or stacked ceramic fibre "
            "blanket assemblies designed for faster installation of furnace and kiln "
            "linings compared to loose blanket."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "ceramic-fibre-paper",
        "name": "Ceramic Fibre Paper",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "ceramic fiber paper",
        "short_summary": "Thin ceramic fibre sheet for gaskets, seals and backup insulation.",
        "description": (
            "Ceramic fibre paper is a thin, flexible refractory sheet material used "
            "for gaskets, seals, expansion joints and backup insulation layers."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "ceramic-fibre-rope",
        "name": "Ceramic Fibre Rope",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens"],
        "synonyms": "ceramic fiber rope",
        "short_summary": "Braided or twisted ceramic fibre rope for door seals and high-temperature sealing.",
        "description": (
            "Ceramic fibre rope is a braided or twisted sealing rope used around "
            "furnace, kiln and oven door openings and other high-temperature joints."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "ceramic-fibre-yarn",
        "name": "Ceramic Fibre Yarn",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "ceramic fiber yarn",
        "short_summary": "Continuous ceramic fibre yarn for weaving, wrapping and reinforcement.",
        "description": (
            "Ceramic fibre yarn is a continuous textile-form fibre used for weaving, "
            "wrapping and reinforcing high-temperature insulation components."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "ceramic-fibre-gaskets",
        "name": "Ceramic Fibre Gaskets",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "ceramic fiber gaskets",
        "short_summary": "Cut ceramic fibre gaskets for sealing furnace and flue joints.",
        "description": (
            "Ceramic fibre gaskets are cut or die-formed sealing components used at "
            "flanges, doors and flue joints on high-temperature equipment."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "vermiculite",
        "name": "Vermiculite",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens"],
        "synonyms": "exfoliated vermiculite, vermiculite insulation",
        "short_summary": "Lightweight mineral insulation fill used under hearths and in furnace linings.",
        "description": (
            "Vermiculite is a lightweight, exfoliated mineral material used as "
            "loose-fill insulation under oven and furnace hearths and within "
            "refractory lining systems."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "perlite",
        "name": "Perlite",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "expanded perlite, perlite insulation",
        "short_summary": "Lightweight expanded mineral insulation fill for high-temperature applications.",
        "description": (
            "Perlite is a lightweight expanded volcanic mineral used as loose-fill "
            "thermal insulation, including under furnace and oven hearths."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "hearth-materials",
        "name": "Hearth Materials",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "oven hearth materials, pizza oven hearth, furnace hearth",
        "short_summary": "Materials used to build insulated hearths for ovens and furnaces.",
        "description": (
            "Hearth materials are the refractory and insulating products — such as "
            "fire brick, castable, vermiculite and perlite fill — used to build the "
            "floor (hearth) of an oven or furnace."
        ),
        "status": "published",
        "review_notes": "",
    },

    # --- C. Roof Ventilation & Cladding ---
    {
        "slug": "roof-ventilators-roof-cyclones",
        "name": "Roof Ventilators (Roof Cyclones)",
        "primary_category": "C",
        "applications": ["roofing-insulation"],
        "synonyms": "roof cyclone, turbine ventilator, whirlybird, roof turbine vent",
        "short_summary": "Wind-driven roof ventilators for passive extraction of hot air from industrial roofs.",
        "description": (
            "Roof ventilators (roof cyclones) are wind-driven turbine vents fitted to "
            "industrial and commercial roofs to passively extract hot air and improve "
            "ventilation."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "cladding-materials",
        "name": "Cladding Materials",
        "primary_category": "C",
        "applications": ["roofing-insulation"],
        "synonyms": "roof cladding, wall cladding",
        "short_summary": "Roof and wall cladding materials — specific product range pending confirmation.",
        "description": (
            "Cladding materials cover roof and wall sheeting and panel products used "
            "in industrial and commercial construction. The specific materials "
            "supplied under this heading are pending confirmation."
        ),
        "status": "draft",
        "review_notes": (
            "'Cladding materials' is a broad heading; confirm the specific supplied "
            "product types (e.g. profiled sheet, insulated panel) before publishing "
            "as distinct products."
        ),
    },

    # --- D. EPS Packaging & Cold-Chain Boxes ---
    {
        "slug": "eps-boxes",
        "name": "EPS Boxes",
        "primary_category": "D",
        "additional_categories": ["A"],
        "applications": ["packaging-cold-chain"],
        "synonyms": "styrofoam boxes, polystyrene boxes, thermocol boxes, EPS packaging",
        "short_summary": "Expanded polystyrene boxes for fish, meat, produce, ice and general cold-chain packaging.",
        "description": (
            "EPS boxes are expanded polystyrene foam boxes used for insulated "
            "packaging and transport of fish, meat, produce, ice and other "
            "temperature-sensitive goods. Note: 'Styrofoam' is a registered trade "
            "mark (historically DuPont, now Owens Corning) for an extruded "
            "polystyrene (XPS) foam product line, which is a different material from "
            "generic expanded polystyrene (EPS) — see "
            "https://www.dupont.com/building/styrofoam.html. These boxes are EPS "
            "products; we use 'Styrofoam boxes' here only as a commonly searched term, "
            "not as a brand claim."
        ),
        "status": "published",
        "review_notes": "",
        "variants": [
            {"label": "Fish Box"},
            {"label": "Meat Box"},
            {"label": "Vegetable & Produce Box"},
            {"label": "Ice Box"},
            {"label": "Cooler Box"},
        ],
    },
    {
        "slug": "custom-eps-packaging-boxes",
        "name": "Custom EPS Packaging Boxes",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "custom packaging boxes, made-to-order EPS boxes",
        "short_summary": "EPS boxes made to a buyer's specified size, shape or capacity.",
        "description": (
            "Custom EPS packaging boxes are produced to a buyer's specified "
            "dimensions or capacity for applications not covered by our standard box "
            "range. Share your required size, quantity and use case via an enquiry."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "insulated-food-containers",
        "name": "Insulated Food Containers",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "insulated food boxes, food delivery boxes",
        "short_summary": "EPS insulated containers for keeping food at temperature during transport.",
        "description": (
            "Insulated food containers are EPS foam containers used to help maintain "
            "food temperature during short-distance transport and delivery."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "pharmaceutical-cold-chain-boxes",
        "name": "Pharmaceutical Cold-Chain EPS Boxes",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "pharma cold chain boxes, vaccine cold box",
        "short_summary": "EPS boxes for pharmaceutical cold-chain use — suitability pending verification.",
        "description": (
            "Pharmaceutical cold-chain boxes are EPS containers intended for "
            "temperature-sensitive pharmaceutical transport. Suitability for "
            "regulated pharmaceutical or vaccine cold-chain use depends on validated "
            "performance data and is not yet confirmed for this range."
        ),
        "status": "draft",
        "review_notes": (
            "Do not publish or claim pharmaceutical/vaccine cold-chain suitability "
            "without validated test data or supplier certification. Keep in draft "
            "until confirmed."
        ),
    },

    # --- E. Refrigeration & HVAC Materials ---
    {
        "slug": "elastomeric-foam-pipe-sheet-insulation",
        "name": "Elastomeric Foam Pipe & Sheet Insulation",
        "primary_category": "E",
        "applications": ["refrigeration-hvac"],
        "synonyms": "Armaflex, rubber foam insulation, nitrile rubber insulation, elastomeric pipe insulation",
        "short_summary": "Flexible closed-cell elastomeric foam insulation for refrigeration and HVAC pipework and sheet metal.",
        "description": (
            "Elastomeric foam insulation is a flexible, closed-cell rubber foam "
            "material used to insulate refrigeration and air-conditioning pipework "
            "(pipe form) and ductwork/equipment surfaces (sheet form). 'Armaflex' is "
            "a widely used market name for this product category."
        ),
        "status": "published",
        "review_notes": (
            "Confirm the actual supplied manufacturer/brand before asserting "
            "'Armaflex' as a verified brand rather than a generic market search term."
        ),
        "variants": [
            {"label": "Sheet — thickness to be confirmed per order"},
            {"label": "Pipe — diameter to be confirmed per order"},
        ],
    },
    {
        "slug": "copper-pipe-rolls",
        "name": "Copper Pipe Rolls",
        "primary_category": "E",
        "applications": ["refrigeration-hvac"],
        "synonyms": "copper tubing, refrigeration copper pipe, copper coil",
        "short_summary": "Coiled copper pipe for refrigeration and air-conditioning pipework, including 1/4 inch (6.35mm).",
        "description": (
            "Copper pipe rolls are coiled copper tubing used for refrigeration and "
            "air-conditioning pipework runs, including the 1/4 inch (6.35 mm) size."
        ),
        "status": "published",
        "review_notes": (
            "Diameter is stated without an inside/outside-diameter convention — this "
            "was not established in the supplied specification. Confirm before "
            "quoting against a customer's ID/OD requirement."
        ),
        "variants": [
            {"label": "1/4 inch (6.35 mm)", "diameter": "1/4 in (6.35 mm)"},
        ],
    },

    # --- F. Industrial Tapes, Sealants & Electrical Insulation ---
    {
        "slug": "thermal-insulation-tape",
        "name": "Thermal Insulation Tape",
        "primary_category": "F",
        "additional_categories": ["E"],
        "applications": ["refrigeration-hvac"],
        "synonyms": "Armaflex tape, HVAC insulation tape, foam insulation tape",
        "short_summary": "Self-adhesive foam tape for sealing joints on pipe and sheet insulation.",
        "description": (
            "Thermal insulation tape is a self-adhesive foam tape used to seal joints "
            "and seams on pipe and sheet insulation in refrigeration and HVAC "
            "installations."
        ),
        "status": "published",
        "review_notes": "Brand name used only as a market search synonym — not a verified brand claim.",
    },
    {
        "slug": "heat-resistant-tape",
        "name": "Heat-Resistant Tape",
        "primary_category": "F",
        "applications": ["industrial-furnaces"],
        "synonyms": "high-temperature tape",
        "short_summary": "Tape rated for use in elevated-temperature industrial environments.",
        "description": (
            "Heat-resistant tape is used for bundling, masking and sealing in "
            "elevated-temperature industrial environments."
        ),
        "status": "published",
        "review_notes": "Temperature rating not stated — confirm with supplier datasheet before publishing a figure.",
    },
    {
        "slug": "aluminium-tape",
        "name": "Aluminium Foil Tape",
        "primary_category": "F",
        "additional_categories": ["A"],
        "applications": ["roofing-insulation", "refrigeration-hvac"],
        "synonyms": "aluminum tape, foil tape, HVAC foil tape",
        "short_summary": "Aluminium foil tape for sealing joints on foil-faced and duct insulation.",
        "description": (
            "Aluminium foil tape is used to seal joints and seams on foil-faced "
            "insulation, ductwork and reflective insulation systems."
        ),
        "status": "published",
        "review_notes": "",
    },
    {
        "slug": "high-temperature-adhesives-sealants",
        "name": "High-Temperature Adhesives & Sealants",
        "primary_category": "F",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens"],
        "synonyms": "refractory adhesive, high-temp sealant",
        "short_summary": "Adhesives and sealants formulated for high-temperature industrial bonding and sealing.",
        "description": (
            "High-temperature adhesives and sealants are used to bond and seal "
            "refractory, insulation and furnace components exposed to elevated "
            "temperatures."
        ),
        "status": "published",
        "review_notes": "Maximum temperature rating not stated — confirm before publishing a figure.",
    },
    {
        "slug": "high-voltage-insulating-mats",
        "name": "High-Voltage Insulating Mats",
        "primary_category": "F",
        "applications": [],
        "synonyms": "electrical insulating mats, switchboard mats, rubber insulating mats",
        "short_summary": "Rubber matting used for electrical insulation in front of switchgear and panels.",
        "description": (
            "High-voltage insulating mats are rubber mats placed in front of "
            "switchgear, distribution boards and electrical panels to provide "
            "insulation for personnel. Voltage class and compliance ratings vary by "
            "product and must be confirmed before a mat is selected for a specific "
            "voltage duty."
        ),
        "status": "published",
        "review_notes": (
            "Do not publish a voltage rating/class or safety-compliance claim until "
            "confirmed against the specific supplied product and its test "
            "certificate."
        ),
    },
]
