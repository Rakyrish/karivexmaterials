"""
Source-of-truth catalogue seed data for KariVex Industrial Materials.

This encodes the mapping decisions recorded in docs/catalogue-mapping.md:
every item in the originally supplied catalogue list became a product, a
synonym on an existing product, a product variant, a category, an
application/collection, or a documented cross-link. Nothing here asserts a
specification, price, stock level, certification, brand or performance
claim that has not been confirmed — unverified facts are left blank and
flagged in `review_notes` (internal only) instead.

Run via: python manage.py seed_catalog [--update]
"""

CATEGORIES = [
    {
        "short_code": "A",
        "name": "Building & Acoustic Insulation",
        "slug": "building-acoustic-insulation",
        "order": 1,
        "intro": (
            "Thermal and acoustic insulation for roofs, walls, ceilings and partitions. The "
            "range covers mineral wool and glass wool, polyethylene and polyurethane foams, "
            "polystyrene board, acoustic foam and reflective foil — the materials contractors "
            "and building owners compare when they need to manage heat gain, condensation "
            "or noise in a building."
        ),
        "quote_checklist": (
            "Product type, or the problem you need to solve (heat, condensation, noise)\n"
            "Area to cover (m²) or number of sheets/rolls\n"
            "Required thickness and, if specified, density\n"
            "Roof or wall construction it will be installed in\n"
            "Delivery location and when you need the material"
        ),
    },
    {
        "short_code": "B",
        "name": "Refractory & High-Temperature Materials",
        "slug": "refractory-high-temperature-materials",
        "order": 2,
        "intro": (
            "Cements, mortars, castables, fire bricks and ceramic fibre products for building, "
            "lining and repairing furnaces, kilns, boilers, bakery ovens and pizza ovens, plus "
            "vermiculite and perlite for insulating hearths and backup layers. Refractory "
            "products are selected against the equipment's operating temperature and duty, so "
            "please share these with your enquiry."
        ),
        "quote_checklist": (
            "Equipment type (furnace, kiln, boiler, bakery or pizza oven, chimney)\n"
            "Maximum operating temperature, if known\n"
            "Whether you are building new or repairing an existing lining\n"
            "Quantities: bags, bricks, rolls or m² of lining\n"
            "Any grade or brand named in your drawings or specification"
        ),
    },
    {
        "short_code": "C",
        "name": "Roof Ventilation & Cladding",
        "slug": "roof-ventilation-cladding",
        "order": 3,
        "intro": (
            "Roof ventilators (roof cyclones) for industrial and commercial buildings, and "
            "cladding materials, with links to the roof insulation products that are often "
            "specified on the same project."
        ),
        "quote_checklist": (
            "Building type and approximate roof area\n"
            "Roof sheet profile where the ventilator will be fitted\n"
            "Number of units required\n"
            "Delivery location"
        ),
    },
    {
        "short_code": "D",
        "name": "EPS Packaging & Cold-Chain Boxes",
        "slug": "eps-packaging-cold-chain-boxes",
        "order": 4,
        "intro": (
            "Expanded polystyrene (EPS) boxes and insulated containers used to pack and move "
            "fish, meat, fresh produce, ice and other temperature-sensitive goods, plus "
            "made-to-order boxes for buyers with their own size requirements. Many buyers "
            "search for these as “Styrofoam boxes”; Styrofoam™ is a brand of "
            "extruded polystyrene (XPS) building insulation, so we describe these products by "
            "their actual material, EPS."
        ),
        "quote_checklist": (
            "What the box will carry (fish, meat, produce, ice, other)\n"
            "Required internal size or capacity\n"
            "Whether you need lids\n"
            "Number of boxes, and whether this is a one-off or regular order\n"
            "Delivery location"
        ),
    },
    {
        "short_code": "E",
        "name": "Refrigeration & HVAC Materials",
        "slug": "refrigeration-hvac-materials",
        "order": 5,
        "intro": (
            "Pipe and sheet insulation, insulation tape and copper pipe for refrigeration, "
            "air-conditioning and cold-room installation work. Tell us the pipe sizes and "
            "insulation thickness on your job and we will confirm what can be supplied."
        ),
        "quote_checklist": (
            "Copper pipe size(s) and the number of rolls\n"
            "Insulation form (pipe section or sheet) and the pipe size it must fit\n"
            "Required insulation wall thickness\n"
            "Any brand named in your specification\n"
            "Delivery location"
        ),
    },
    {
        "short_code": "F",
        "name": "Industrial Tapes, Sealants & Electrical Insulation",
        "slug": "industrial-tapes-sealants-electrical-insulation",
        "order": 6,
        "intro": (
            "Thermal insulation tape, heat-resistant tape, aluminium foil tape, "
            "high-temperature adhesives and sealants, and insulating mats for electrical "
            "rooms — the finishing and sealing materials that go with insulation, HVAC and "
            "furnace work."
        ),
        "quote_checklist": (
            "Tape or product type and width\n"
            "The surface or material it will be applied to\n"
            "Operating temperature (for heat-resistant products)\n"
            "For insulating mats: the voltage class your safety rules require, and mat size\n"
            "Quantity and delivery location"
        ),
    },
]

APPLICATIONS = [
    {
        "slug": "roofing-insulation",
        "name": "Roofing & Building Insulation",
        "order": 1,
        "summary": "Insulation, foil, ventilation and sealing materials for roofs, walls and ceilings.",
        "intro": (
            "Roofing contractors, factory owners and building owners use insulation to reduce "
            "heat gain through metal roofs, control condensation and dampen rain and machinery "
            "noise. Ventilators help move hot air out of the roof space. The right combination "
            "depends on the roof construction and what problem you are trying to solve. We "
            "supply materials; we do not offer installation services."
        ),
        "considerations": (
            "Roof construction: metal sheet, concrete slab or tiled roof\n"
            "Main goal: heat reduction, condensation control, noise reduction, or a mix\n"
            "Thickness or performance value stated in your drawings or specification\n"
            "Moisture and fire exposure in the space\n"
            "Joint sealing: matching tape for foil-faced products"
        ),
    },
    {
        "slug": "bakeries-pizza-ovens",
        "name": "Bakeries & Pizza Ovens",
        "order": 2,
        "summary": "Refractory cement, fire bricks, ceramic fibre and hearth insulation for oven builds.",
        "intro": (
            "Oven builders and bakery operators use refractory cements and mortars, fire "
            "bricks, castables and ceramic fibre to build oven floors (hearths), domes and "
            "insulating layers, and ceramic fibre rope to seal doors. Material choice depends "
            "on the oven design and operating temperature, which should come from your oven "
            "builder or design."
        ),
        "considerations": (
            "Oven type and size: deck, dome/pizza, or industrial tunnel oven\n"
            "Operating temperature and fuel (wood, gas, electric)\n"
            "New build or repair of an existing oven\n"
            "Hearth construction: brick, castable, and insulating layer underneath\n"
            "Door seals and joints that need rope or high-temperature sealant"
        ),
    },
    {
        "slug": "industrial-furnaces",
        "name": "Industrial Furnaces & Kilns",
        "order": 3,
        "summary": "Linings, insulating fibre, cements and fill for furnaces, kilns and boilers.",
        "intro": (
            "Furnace, kiln and boiler linings are built from refractory castables, bricks and "
            "mortars, with ceramic fibre blanket, modules and paper as insulating or backup "
            "layers, and vermiculite or perlite as lightweight fill. Temperature ratings and "
            "lining design must be confirmed against the manufacturer's datasheet for your "
            "application; ask us for the datasheet of the product we quote."
        ),
        "considerations": (
            "Maximum and continuous operating temperature\n"
            "Hot-face versus backup (insulating) layer\n"
            "Mechanical wear, abrasion or chemical attack at the hot face\n"
            "Installation method: bricked, cast, gunned or fibre-lined\n"
            "Shutdown window for repair work"
        ),
    },
    {
        "slug": "high-temperature-insulation",
        "name": "High-Temperature Insulation",
        "order": 4,
        "summary": "Ceramic fibre, mineral fill and sealing products for hot equipment and pipework.",
        "intro": (
            "A collection of the insulating products in our refractory range: ceramic fibre "
            "blanket, modules, paper, rope, yarn and gaskets, vermiculite and perlite fill, and "
            "high-temperature tapes and sealants. Use it to compare insulating options for "
            "furnaces, ovens, boilers, flues and hot pipework."
        ),
        "considerations": (
            "Maximum surface or operating temperature\n"
            "Form needed: flexible blanket, board/module, paper, rope or loose fill\n"
            "Whether the insulation is exposed to air flow, vibration or handling\n"
            "Thickness and area, or the gap/joint size to be sealed"
        ),
    },
    {
        "slug": "refrigeration-hvac",
        "name": "Refrigeration & HVAC",
        "order": 5,
        "summary": "Pipe insulation, copper pipe and tapes for cold rooms and air-conditioning.",
        "intro": (
            "Refrigeration and HVAC installers use elastomeric foam pipe and sheet insulation, "
            "copper pipe, and insulation tape on cold rooms, chillers and air-conditioning "
            "lines. Insulation sizes must match the pipe's outside size, and wall thickness is "
            "chosen to prevent condensation on the line — confirm both against your system "
            "design."
        ),
        "considerations": (
            "Copper pipe size(s) on the job\n"
            "Insulation wall thickness for the line temperature\n"
            "Indoor or outdoor (UV-exposed) runs\n"
            "Tape for joints and seams"
        ),
    },
    {
        "slug": "packaging-cold-chain",
        "name": "Packaging & Cold Chain",
        "order": 6,
        "summary": "EPS boxes and insulated containers for fish, meat, produce and cold storage.",
        "intro": (
            "EPS boxes and insulated containers are used across fish landing and export, meat "
            "distribution, fresh produce and general cold-chain packaging. How long goods stay "
            "cold depends on the box, the ice or coolant used, and the journey. Suitability for "
            "regulated uses, such as pharmaceutical or vaccine transport, requires validated "
            "performance data and is not claimed for our current range."
        ),
        "considerations": (
            "Product being packed and its weight per box\n"
            "Internal dimensions or capacity required\n"
            "Ice, gel packs or other coolant used\n"
            "Journey length and handling\n"
            "Any buyer or export packaging requirements you must meet"
        ),
    },
]

# Each product dict:
#   slug, name, primary_category (short_code), additional_categories ([short_code,...]),
#   applications ([slug,...]), brand, synonyms, short_summary, description,
#   selection_notes, status ("draft"/"published"), review_notes,
#   specifications ([{label,value,unit}]),
#   variants ([{label, thickness, dimensions, density, diameter, box_capacity, pack_size}]),
#   related ([slug,...]) — curated cross-links
PRODUCTS = [
    # --- A. Building & Acoustic Insulation ---
    {
        "slug": "rockwool-insulation",
        "name": "Rock Wool (Mineral Wool) Insulation",
        "primary_category": "A",
        "additional_categories": ["B"],
        "applications": ["roofing-insulation", "high-temperature-insulation"],
        "synonyms": "rockwool, rock wool, mineral wool, stone wool insulation",
        "short_summary": "Stone/mineral wool insulation for thermal and acoustic control in roofs, walls and partitions.",
        "description": (
            "Rock wool, also called mineral wool or stone wool, is a fibrous insulation made "
            "from melted rock spun into fibres. It is used for thermal and acoustic insulation "
            "in roofs, walls, ceilings and partitions, and for insulating industrial equipment.\n\n"
            "It is generally supplied as slabs, batts or rolls. Tell us the form, thickness and "
            "density in your specification and we will confirm what is available."
        ),
        "selection_notes": (
            "Form: slab, batt or roll\n"
            "Thickness and density from your specification\n"
            "Facing required (plain or foil-faced), if any\n"
            "Area to cover or number of pieces"
        ),
        "status": "published",
        "review_notes": (
            "Confirm whether the supplied product is ROCKWOOL(TM)-branded or another "
            "manufacturer's mineral wool before adding a brand. 'Rockwool' is kept as a "
            "search synonym only."
        ),
        "related": ["fibreglass-insulation", "aluminium-tape", "reflective-foil-insulation"],
    },
    {
        "slug": "fibreglass-insulation",
        "name": "Fibreglass (Glass Wool) Insulation",
        "primary_category": "A",
        "applications": ["roofing-insulation"],
        "synonyms": "fiberglass insulation, glass wool, fibre glass, fiber glass, glasswool",
        "short_summary": "Glass-fibre insulation for roofs, walls, ceilings and ductwork.",
        "description": (
            "Fibreglass (glass wool) insulation is a lightweight fibrous insulation used for "
            "thermal and acoustic insulation of roofs, walls, ceilings and ducting. It is "
            "commonly supplied in rolls or batts, plain or with a foil facing.\n\n"
            "Share the thickness, density and facing called for in your project and we will "
            "confirm the options we can supply."
        ),
        "selection_notes": (
            "Thickness and density\n"
            "Plain or foil-faced\n"
            "Roll or batt\n"
            "Area to cover (m²)"
        ),
        "status": "published",
        "review_notes": "",
        "related": ["rockwool-insulation", "aluminium-tape", "reflective-foil-insulation"],
    },
    {
        "slug": "polyethylene-foam-insulation",
        "name": "Polyethylene Foam Insulation",
        "primary_category": "A",
        "additional_categories": ["E"],
        "applications": ["roofing-insulation", "refrigeration-hvac"],
        "synonyms": "PE foam insulation, closed-cell PE foam, polyethylene foam roll",
        "short_summary": "Lightweight polyethylene foam sheet or roll insulation, plain or foil-faced.",
        "description": (
            "Polyethylene (PE) foam insulation is a lightweight, flexible foam used as a thermal "
            "and vapour-control layer under roofing and in walls, and in some pipe insulation "
            "applications. It is supplied as rolls or sheets, often with an aluminium foil "
            "facing on one or both sides.\n\n"
            "Let us know the thickness, facing and roll size you need."
        ),
        "selection_notes": (
            "Thickness\n"
            "Facing: none, single-sided or double-sided foil\n"
            "Roll width and length, or total area\n"
            "Where it will be installed"
        ),
        "status": "published",
        "review_notes": "Confirm supplied thicknesses/facings and roll sizes, then add as variants.",
        "related": ["reflective-foil-insulation", "aluminium-tape"],
    },
    {
        "slug": "polystyrene-insulation-sheets",
        "name": "Polystyrene Insulation Sheets (EPS / XPS)",
        "primary_category": "A",
        "additional_categories": ["D"],
        "applications": ["roofing-insulation"],
        "synonyms": "polystyrene sheets, foam board insulation, EPS sheets, XPS board",
        "short_summary": "Rigid polystyrene insulation board — EPS or XPS type pending verification.",
        "description": (
            "Rigid polystyrene insulation sheets are used as board insulation in walls, roofs "
            "and floors. Polystyrene board is made either as expanded polystyrene (EPS) or "
            "extruded polystyrene (XPS). The two are manufactured differently, have different "
            "properties and are not interchangeable; Styrofoam™ is a brand of XPS."
        ),
        "selection_notes": "EPS or XPS\nThickness and sheet size\nNumber of sheets",
        "status": "draft",
        "review_notes": (
            "Confirm whether the supplied sheets are EPS, XPS, or both, before publishing. Split "
            "into separate 'EPS Insulation Sheets' and 'XPS Insulation Sheets' products once "
            "confirmed — do not publish one page claiming both without verification. Also "
            "confirm whether EPS sheets are supplied for packaging use (cross-link to D)."
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
            "Polyurethane (PU) spray foam is applied as a liquid that expands and cures into a "
            "seamless insulation layer bonded to the surface it is sprayed onto. It is used on "
            "roofs, walls and cold-storage structures where a continuous layer without joints "
            "is wanted.\n\n"
            "Spray foam is applied with dedicated equipment. Tell us whether you need the "
            "material for your own applicator, along with the area and target thickness."
        ),
        "selection_notes": (
            "Surface to be sprayed and total area (m²)\n"
            "Target thickness\n"
            "Whether you have your own spray equipment/applicator"
        ),
        "status": "published",
        "review_notes": (
            "Confirm what is actually supplied (two-component spray system, canned foam, or "
            "both) and whether any application service is offered. The page currently makes "
            "no installation-service claim."
        ),
    },
    {
        "slug": "acoustic-insulation-foam",
        "name": "Acoustic Insulation Foam",
        "primary_category": "A",
        "applications": ["roofing-insulation"],
        "synonyms": "sound insulation foam, noise insulation foam, acoustic foam, soundproofing foam",
        "short_summary": "Foam sheets for sound absorption in rooms, ceilings and plant enclosures.",
        "description": (
            "Acoustic foam is an open-cell foam used to absorb sound and reduce echo and "
            "reverberation in rooms, studios, offices, ceilings and machinery enclosures. "
            "It is supplied in sheets or panels that can be cut to size.\n\n"
            "Blocking sound from passing through a wall usually needs mass and sealing as well "
            "as absorption, so describe the noise problem and we will suggest suitable "
            "materials from the catalogue."
        ),
        "selection_notes": (
            "Room or enclosure type, and the noise problem\n"
            "Sheet thickness and finish/profile\n"
            "Area to cover"
        ),
        "status": "published",
        "review_notes": "Confirm the supplied foam type(s), thicknesses and profiles; add as variants.",
        "related": ["rockwool-insulation", "fibreglass-insulation"],
    },
    {
        "slug": "reflective-foil-insulation",
        "name": "Reflective Foil Insulation (Sisalation)",
        "primary_category": "A",
        "additional_categories": ["C"],
        "applications": ["roofing-insulation"],
        "synonyms": "sisalation, foil insulation, radiant barrier, reflective roof foil",
        "short_summary": "Reflective foil laminate used as a radiant barrier and moisture layer under roofing.",
        "description": (
            "Reflective foil insulation is a foil laminate installed under roof sheeting or "
            "tiles to reflect radiant heat and act as a secondary moisture barrier. In the "
            "region it is widely known as “sisalation”.\n\n"
            "It is often combined with bulk insulation such as glass wool or foam, and joints "
            "are sealed with aluminium foil tape."
        ),
        "selection_notes": (
            "Roll size and total roof area\n"
            "Single- or double-sided foil\n"
            "Matching aluminium foil tape for joints"
        ),
        "status": "published",
        "review_notes": (
            "Confirm the actual manufacturer/brand of the supplied foil before naming a brand. "
            "'Sisalation' is used as the common market term and search synonym, not as a "
            "verified brand claim."
        ),
        "related": ["aluminium-tape", "fibreglass-insulation", "roof-ventilators-roof-cyclones"],
    },

    # --- B. Refractory & High-Temperature Materials ---
    {
        "slug": "refractory-cement",
        "name": "Refractory Cement",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "fireproof cement, fire cement, heat-resistant cement, fire-resistant cement",
        "short_summary": "Heat-resistant cement for building and repairing furnaces, kilns and ovens.",
        "description": (
            "Refractory cement is a heat-resistant cement used to build, patch and repair "
            "furnaces, kilns, ovens, fireplaces and chimneys that run at sustained high "
            "temperatures. Many buyers ask for it as “fireproof cement”.\n\n"
            "Refractory cements differ in maximum service temperature and in how they are "
            "mixed, set and cured, so share your equipment and operating temperature and ask "
            "for the datasheet of the product we quote."
        ),
        "selection_notes": (
            "Equipment and maximum operating temperature\n"
            "Use: bonding bricks, patching, or casting\n"
            "Number of bags"
        ),
        "status": "published",
        "review_notes": (
            "'Fireproof cement' is mapped here as a customer search synonym. Confirm "
            "manufacturer, grade and maximum service temperature from the supplier datasheet "
            "before adding specifications."
        ),
        "related": ["refractory-mortar", "fire-bricks-refractory-bricks", "refractory-castables"],
    },
    {
        "slug": "fondu-cement",
        "name": "Fondu Cement",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "ciment fondu, calcium aluminate cement",
        "short_summary": "Calcium aluminate cement — supplied grade and manufacturer pending confirmation.",
        "description": (
            "Fondu refers to a calcium aluminate cement, a different class of material from "
            "ordinary Portland cement, used in refractory concretes and where rapid strength "
            "gain is needed."
        ),
        "status": "draft",
        "review_notes": (
            "Confirm exact supplied product, manufacturer and grade from the bag label/datasheet "
            "before publishing ('Ciment Fondu' is a trade name). Do not treat as equivalent to "
            "MAX-50 or the Maxheat products without supplier confirmation."
        ),
    },
    {
        "slug": "max-50",
        "name": "MAX-50",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "max 50, max50",
        "short_summary": "Trade-named refractory product — category and manufacturer pending confirmation.",
        "description": (
            "MAX-50 is a supplied trade name awaiting identification against the manufacturer's "
            "label or datasheet."
        ),
        "status": "draft",
        "review_notes": (
            "Unresolved trade name. Obtain supplier label/datasheet (product type, manufacturer, "
            "service temperature) before publishing. Keep distinct from Fondu and Maxheat."
        ),
    },
    {
        "slug": "maxheat-k",
        "name": "Maxheat K",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "maxheat",
        "short_summary": "Trade-named refractory product — category and manufacturer pending confirmation.",
        "description": (
            "Maxheat K is a supplied trade name awaiting identification against the "
            "manufacturer's label or datasheet."
        ),
        "status": "draft",
        "review_notes": (
            "Unresolved trade name — keep distinguishable from Maxheat A and MAX-50 until "
            "datasheets confirm whether these are different grades or products."
        ),
    },
    {
        "slug": "maxheat-a",
        "name": "Maxheat A",
        "primary_category": "B",
        "applications": ["industrial-furnaces"],
        "synonyms": "maxheat",
        "short_summary": "Trade-named refractory product — category and manufacturer pending confirmation.",
        "description": (
            "Maxheat A is a supplied trade name awaiting identification against the "
            "manufacturer's label or datasheet."
        ),
        "status": "draft",
        "review_notes": (
            "Unresolved trade name — keep distinguishable from Maxheat K and MAX-50 until "
            "datasheets confirm whether these are different grades or products."
        ),
    },
    {
        "slug": "refractory-mortar",
        "name": "Refractory Mortar",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "heat-resistant mortar, fire mortar, fireclay mortar, jointing mortar",
        "short_summary": "Heat-resistant mortar for laying and jointing fire bricks.",
        "description": (
            "Refractory mortar is used to bed and joint fire bricks in furnaces, kilns, ovens, "
            "fireplaces and chimneys. Joints in refractory brickwork are kept thin, and the "
            "mortar should be compatible with the brick and the operating temperature.\n\n"
            "Tell us which bricks you are laying and how many, and we will suggest a suitable "
            "quantity of mortar."
        ),
        "selection_notes": (
            "Type of fire brick being laid\n"
            "Operating temperature\n"
            "Number of bricks or wall area"
        ),
        "status": "published",
        "review_notes": "Confirm supplied form (dry powder vs ready-mixed), bag size and rating.",
        "related": ["fire-bricks-refractory-bricks", "refractory-cement"],
    },
    {
        "slug": "fire-bricks-refractory-bricks",
        "name": "Fire Bricks / Refractory Bricks",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "firebrick, fire brick, refractory brick, oven bricks, kiln bricks",
        "short_summary": "Fire bricks for lining furnaces, kilns, ovens and fireplaces.",
        "description": (
            "Fire bricks (refractory bricks) are used to build the inner lining of furnaces, "
            "kilns, ovens, fireplaces and chimneys. “Fire brick” and “refractory "
            "brick” are two names for the same product family.\n\n"
            "Within that family there are different product types — dense bricks for the hot "
            "face and lighter insulating bricks for backup layers — so tell us where the bricks "
            "will be used, the operating temperature, and any shapes or sizes you need."
        ),
        "selection_notes": (
            "Hot-face lining or insulating backup layer\n"
            "Operating temperature\n"
            "Brick size/shape and number of bricks\n"
            "Matching refractory mortar"
        ),
        "status": "published",
        "review_notes": (
            "Synonyms here are true synonyms only. Insulating firebrick (IFB) is a distinct "
            "product type: add dense and insulating grades as separate variants or products "
            "once the supplied range (and their temperature classes) is confirmed."
        ),
        "related": ["refractory-mortar", "refractory-castables", "hearth-materials"],
    },
    {
        "slug": "refractory-castables",
        "name": "Refractory Castables",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens"],
        "synonyms": "castable refractory, refractory concrete, castable",
        "short_summary": "Refractory concrete cast or trowelled into place as a jointless lining.",
        "description": (
            "Refractory castables are dry refractory mixes that are mixed with water and cast, "
            "vibrated or trowelled into place to form a jointless (monolithic) lining. They are "
            "used for furnace linings, burner blocks, oven floors and repairs to shapes that "
            "are hard to build in brick.\n\n"
            "Castables are made in dense and insulating types for different temperatures, so "
            "share the operating temperature and lining thickness with your enquiry."
        ),
        "selection_notes": (
            "Operating temperature\n"
            "Dense (hot-face) or insulating castable\n"
            "Lining area and thickness, or number of bags"
        ),
        "status": "published",
        "review_notes": "Confirm supplied castable grades, bag size and temperature classes.",
        "related": ["refractory-cement", "fire-bricks-refractory-bricks", "ceramic-fibre-blanket"],
    },
    {
        "slug": "ceramic-fibre-blanket",
        "name": "Ceramic Fibre Blanket",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens", "high-temperature-insulation"],
        "synonyms": "ceramic fiber blanket, refractory ceramic fibre blanket, RCF blanket",
        "short_summary": "Flexible ceramic fibre insulation for furnace, kiln, oven and boiler linings.",
        "description": (
            "Ceramic fibre blanket is a lightweight, flexible insulating blanket made from "
            "high-temperature ceramic fibres. It is used as a furnace or kiln lining, as backup "
            "insulation behind brick or castable, to insulate oven domes and boilers, and to "
            "wrap hot pipework.\n\n"
            "Blankets come in different thicknesses, densities and temperature grades. Wear "
            "suitable protection when cutting and handling fibre products and follow the "
            "manufacturer's safety data sheet."
        ),
        "selection_notes": (
            "Thickness and density\n"
            "Temperature grade required\n"
            "Number of rolls or area to cover"
        ),
        "status": "published",
        "review_notes": "Confirm supplied thickness/density/temperature grades and roll size; add as variants.",
        "related": ["ceramic-fibre-modules", "ceramic-fibre-paper", "ceramic-fibre-rope"],
    },
    {
        "slug": "ceramic-fibre-modules",
        "name": "Ceramic Fibre Modules",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "high-temperature-insulation"],
        "synonyms": "ceramic fiber modules, folded ceramic fibre modules, stacked ceramic fibre modules",
        "short_summary": "Pre-folded ceramic fibre blocks for faster furnace and kiln lining.",
        "description": (
            "Ceramic fibre modules are blocks of folded or stacked ceramic fibre blanket, "
            "compressed and fitted with anchoring hardware, used to line furnace and kiln walls "
            "and roofs faster than layering loose blanket.\n\n"
            "Module size, density, temperature grade and anchor type are chosen to suit the "
            "furnace shell, so share drawings or dimensions with your enquiry."
        ),
        "selection_notes": (
            "Module size and thickness\n"
            "Temperature grade\n"
            "Anchor system / furnace shell details\n"
            "Lining area"
        ),
        "status": "published",
        "review_notes": "",
        "related": ["ceramic-fibre-blanket"],
    },
    {
        "slug": "ceramic-fibre-paper",
        "name": "Ceramic Fibre Paper",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "high-temperature-insulation"],
        "synonyms": "ceramic fiber paper",
        "short_summary": "Thin ceramic fibre sheet for gaskets, seals, expansion joints and backup insulation.",
        "description": (
            "Ceramic fibre paper is a thin, flexible sheet of ceramic fibre used to cut gaskets "
            "and seals, fill expansion joints, and add a thin insulating layer behind linings "
            "or in appliances."
        ),
        "selection_notes": "Thickness\nRoll width and length\nTemperature grade",
        "status": "published",
        "review_notes": "",
        "related": ["ceramic-fibre-gaskets", "ceramic-fibre-blanket"],
    },
    {
        "slug": "ceramic-fibre-rope",
        "name": "Ceramic Fibre Rope",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens", "high-temperature-insulation"],
        "synonyms": "ceramic fiber rope, oven door rope, furnace door seal rope",
        "short_summary": "Braided or twisted ceramic fibre rope for oven, furnace and boiler door seals.",
        "description": (
            "Ceramic fibre rope is a braided or twisted rope used to seal oven, furnace, kiln "
            "and boiler doors, flanges and other high-temperature joints. It is available in "
            "round and square profiles in a range of diameters."
        ),
        "selection_notes": (
            "Profile (round or square) and diameter/size\n"
            "Length required\n"
            "Operating temperature"
        ),
        "status": "published",
        "review_notes": "Confirm supplied sizes/profiles and reinforcement; add as variants.",
        "related": ["ceramic-fibre-yarn", "high-temperature-adhesives-sealants"],
    },
    {
        "slug": "ceramic-fibre-yarn",
        "name": "Ceramic Fibre Yarn",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "high-temperature-insulation"],
        "synonyms": "ceramic fiber yarn",
        "short_summary": "Continuous ceramic fibre yarn for weaving, wrapping and sewing high-temperature items.",
        "description": (
            "Ceramic fibre yarn is a continuous textile yarn used to weave, braid, wrap or sew "
            "high-temperature insulation and sealing products."
        ),
        "selection_notes": "Yarn type/reinforcement\nQuantity (by weight or spool)",
        "status": "published",
        "review_notes": "Confirm reinforcement (glass or wire) and spool sizes supplied.",
        "related": ["ceramic-fibre-rope"],
    },
    {
        "slug": "ceramic-fibre-gaskets",
        "name": "Ceramic Fibre Gaskets",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "high-temperature-insulation"],
        "synonyms": "ceramic fiber gaskets, high-temperature gaskets",
        "short_summary": "Ceramic fibre gaskets for sealing furnace, burner and flue joints.",
        "description": (
            "Ceramic fibre gaskets are cut from ceramic fibre paper or board to seal flanges, "
            "burner plates, doors and flue joints on high-temperature equipment."
        ),
        "selection_notes": (
            "Gasket dimensions or a drawing/sample\n"
            "Thickness\n"
            "Quantity"
        ),
        "status": "published",
        "review_notes": "Confirm whether gaskets are cut to order or stocked in standard sizes.",
        "related": ["ceramic-fibre-paper", "ceramic-fibre-rope"],
    },
    {
        "slug": "vermiculite",
        "name": "Vermiculite",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens", "high-temperature-insulation"],
        "synonyms": "exfoliated vermiculite, vermiculite insulation, expanded vermiculite",
        "short_summary": "Lightweight exfoliated mineral used as insulating fill and in insulating concrete.",
        "description": (
            "Vermiculite is a natural mineral that expands (exfoliates) when heated into light, "
            "granular particles. It is used as loose insulating fill and mixed with cement to "
            "make lightweight insulating concrete, for example under pizza oven and furnace "
            "hearths."
        ),
        "selection_notes": "Grade/particle size\nNumber of bags\nIntended use (loose fill or insulating concrete)",
        "status": "published",
        "review_notes": "Confirm grade and bag size supplied.",
        "related": ["perlite", "hearth-materials"],
    },
    {
        "slug": "perlite",
        "name": "Perlite",
        "primary_category": "B",
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens", "high-temperature-insulation"],
        "synonyms": "expanded perlite, perlite insulation",
        "short_summary": "Lightweight expanded volcanic mineral for insulating fill and lightweight mixes.",
        "description": (
            "Perlite is a volcanic glass that is expanded by heating into very light white "
            "granules. It is used as loose insulating fill and in lightweight insulating "
            "concrete and plaster mixes, including under oven and furnace hearths."
        ),
        "selection_notes": "Grade/particle size\nNumber of bags\nIntended use",
        "status": "published",
        "review_notes": "Confirm grade and bag size supplied.",
        "related": ["vermiculite", "hearth-materials"],
    },
    {
        "slug": "hearth-materials",
        "name": "Hearth Materials",
        "primary_category": "B",
        "applications": ["bakeries-pizza-ovens", "industrial-furnaces"],
        "synonyms": "oven hearth materials, pizza oven hearth, oven floor, furnace hearth",
        "short_summary": "Materials for building insulated oven and furnace floors (hearths).",
        "description": (
            "An oven or furnace hearth is usually built in layers: a dense cooking or working "
            "surface of fire brick or castable, on top of an insulating layer such as "
            "vermiculite or perlite concrete or insulating board, on a structural base.\n\n"
            "Send us your hearth dimensions and intended build-up and we will quote the "
            "materials for each layer from this catalogue."
        ),
        "selection_notes": (
            "Hearth dimensions\n"
            "Planned layers (surface, insulation, base)\n"
            "Operating temperature"
        ),
        "status": "published",
        "review_notes": (
            "Collection-style product describing hearth build-ups; no single proprietary "
            "'hearth material' is claimed."
        ),
        "related": ["fire-bricks-refractory-bricks", "vermiculite", "perlite", "refractory-castables"],
    },

    # --- C. Roof Ventilation & Cladding ---
    {
        "slug": "roof-ventilators-roof-cyclones",
        "name": "Roof Ventilators (Roof Cyclones)",
        "primary_category": "C",
        "applications": ["roofing-insulation"],
        "synonyms": "roof cyclone, turbine ventilator, whirlybird, roof turbine vent, wind turbine ventilator",
        "short_summary": "Wind-driven turbine ventilators that draw hot air out of roof spaces.",
        "description": (
            "Roof ventilators, widely called roof cyclones, are wind-driven turbine vents fixed "
            "to industrial, warehouse and commercial roofs. As the turbine turns, it draws hot "
            "air and moisture out of the building without using electricity.\n\n"
            "The number of units depends on the building volume and how much air change is "
            "wanted. Share your roof area, building use and roof sheet profile."
        ),
        "selection_notes": (
            "Building size and use\n"
            "Roof sheet profile and pitch\n"
            "Number of ventilators and throat size"
        ),
        "status": "published",
        "review_notes": "Confirm supplied sizes (throat diameter), material and base types; add as variants.",
        "related": ["reflective-foil-insulation", "fibreglass-insulation"],
    },
    {
        "slug": "cladding-materials",
        "name": "Cladding Materials",
        "primary_category": "C",
        "applications": ["roofing-insulation"],
        "synonyms": "roof cladding, wall cladding",
        "short_summary": "Roof and wall cladding materials — specific product range pending confirmation.",
        "description": (
            "Cladding materials cover roof and wall sheeting and panel products used in "
            "industrial and commercial construction."
        ),
        "status": "draft",
        "review_notes": (
            "'Cladding materials' is a broad heading; confirm the specific supplied product "
            "types (e.g. profiled sheet, insulated panel) before publishing them as distinct "
            "products."
        ),
    },

    # --- D. EPS Packaging & Cold-Chain Boxes ---
    {
        "slug": "eps-boxes",
        "name": "EPS Boxes (Polystyrene Boxes)",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "styrofoam boxes, polystyrene boxes, thermocol boxes, EPS packaging, fish box, meat box, vegetable box, produce box, ice box, cooler box",
        "short_summary": "Expanded polystyrene boxes for fish, meat, produce, ice and general cold-chain packing.",
        "description": (
            "EPS boxes are moulded expanded polystyrene boxes with lids, used to pack and "
            "transport fish, meat, fruit and vegetables, ice and other goods that need to stay "
            "cool or be protected in transit. EPS is light, insulating and cushioning.\n\n"
            "Buyers often call these “Styrofoam boxes”. Styrofoam™ is a trade mark "
            "for an extruded polystyrene (XPS) insulation product line, which is a different "
            "material; these boxes are EPS. Choose the use below and tell us the size or "
            "capacity and quantity you need."
        ),
        "selection_notes": (
            "Use: fish, meat, produce, ice or general cooler\n"
            "Internal size or capacity\n"
            "With or without lids\n"
            "Quantity, and how often you order"
        ),
        "status": "published",
        "review_notes": (
            "Fish/meat/produce/ice/cooler are modelled as variants (uses) of one EPS box "
            "product because no size/design differences are confirmed. If the supplied boxes "
            "differ materially, split them into separate products. Confirm sizes/capacities. "
            "No food-contact certification is claimed."
        ),
        "variants": [
            {"label": "Fish box"},
            {"label": "Meat box"},
            {"label": "Vegetable & produce box"},
            {"label": "Ice box"},
            {"label": "Cooler box"},
        ],
        "related": ["custom-eps-packaging-boxes", "insulated-food-containers"],
    },
    {
        "slug": "custom-eps-packaging-boxes",
        "name": "Custom EPS Packaging Boxes",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "custom packaging boxes, made-to-order EPS boxes, custom polystyrene boxes, EPS packaging",
        "short_summary": "EPS boxes and packaging made to a buyer's size, shape or capacity.",
        "description": (
            "When a standard box does not fit your product, EPS packaging can be produced to "
            "a specified size, capacity or shape. Custom work is quoted on the design and the "
            "order quantity.\n\n"
            "Send us the internal dimensions, what the box will carry, any drawings or samples, "
            "and the quantity you expect to order."
        ),
        "selection_notes": (
            "Internal dimensions or a drawing/sample\n"
            "What the packaging will carry\n"
            "Order quantity and frequency"
        ),
        "status": "published",
        "review_notes": "Confirm whether custom moulding/cutting is offered directly or through a partner, and any minimum order.",
        "related": ["eps-boxes"],
    },
    {
        "slug": "insulated-food-containers",
        "name": "Insulated Food Containers",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "insulated food boxes, food delivery boxes, EPS food containers",
        "short_summary": "EPS insulated containers for carrying food short distances.",
        "description": (
            "Insulated food containers are EPS containers used by caterers, food businesses "
            "and distributors to help keep food warm or cool while it is carried from one place "
            "to another."
        ),
        "selection_notes": "Size or capacity\nQuantity",
        "status": "published",
        "review_notes": "No food-contact certification is claimed; confirm with supplier before adding one.",
        "related": ["eps-boxes"],
    },
    {
        "slug": "pharmaceutical-cold-chain-boxes",
        "name": "Pharmaceutical Cold-Chain EPS Boxes",
        "primary_category": "D",
        "applications": ["packaging-cold-chain"],
        "synonyms": "pharma cold chain boxes, vaccine cold box",
        "short_summary": "EPS boxes for pharmaceutical cold-chain use — suitability pending verification.",
        "description": (
            "Pharmaceutical cold-chain boxes are insulated shippers intended for "
            "temperature-sensitive medicines."
        ),
        "status": "draft",
        "review_notes": (
            "Do not publish or claim pharmaceutical/vaccine cold-chain suitability without "
            "validated thermal test data or supplier certification. Keep in draft until "
            "confirmed."
        ),
    },

    # --- E. Refrigeration & HVAC Materials ---
    {
        "slug": "elastomeric-foam-pipe-sheet-insulation",
        "name": "Elastomeric Foam Pipe & Sheet Insulation",
        "primary_category": "E",
        "applications": ["refrigeration-hvac"],
        "synonyms": "Armaflex, armaflex sheet, armaflex pipe, rubber foam insulation, nitrile rubber insulation, elastomeric pipe insulation, refrigeration pipe insulation, AC pipe insulation",
        "short_summary": "Flexible closed-cell rubber foam insulation for refrigeration and air-conditioning lines.",
        "description": (
            "Elastomeric foam is a flexible, closed-cell synthetic rubber insulation used on "
            "refrigeration and air-conditioning pipework (as pre-formed pipe sections) and on "
            "ducts, tanks and equipment (as sheets). Its closed-cell structure helps prevent "
            "condensation on cold lines. Many installers ask for this product by the brand "
            "name Armaflex.\n\n"
            "For pipe sections, tell us the pipe size the insulation must fit and the wall "
            "thickness required; for sheets, the thickness and area."
        ),
        "selection_notes": (
            "Form: pipe section or sheet\n"
            "Pipe size the section must fit (for pipe insulation)\n"
            "Insulation wall thickness\n"
            "Self-adhesive or plain (sheets)\n"
            "Any brand named in your specification"
        ),
        "status": "published",
        "review_notes": (
            "Confirm the actual supplied manufacturer/brand before naming Armaflex (an "
            "Armacell brand) as the brand. Until confirmed, 'Armaflex' is a search synonym "
            "only. If genuine Armaflex sheet, pipe and tape are supplied, set the brand and "
            "consider separate products per the catalogue mapping."
        ),
        "variants": [
            {"label": "Pipe insulation (size to suit your pipe)"},
            {"label": "Sheet insulation (thickness to order)"},
        ],
        "related": ["copper-pipe-rolls", "thermal-insulation-tape", "polyethylene-foam-insulation"],
    },
    {
        "slug": "copper-pipe-rolls",
        "name": "Copper Pipe Rolls",
        "primary_category": "E",
        "applications": ["refrigeration-hvac"],
        "synonyms": "copper tubing, refrigeration copper pipe, copper coil, AC copper pipe, pancake coil",
        "short_summary": "Coiled copper pipe for refrigeration and air-conditioning, including 1/4 inch (6.35 mm).",
        "description": (
            "Copper pipe rolls (coils) are soft copper tubing used to run refrigerant lines for "
            "air-conditioning and refrigeration systems. Supplied sizes include 1/4 inch "
            "(6.35 mm).\n\n"
            "Tell us each size you need and the number of rolls. Note that pipe size is "
            "different from insulation thickness: insulation is ordered to fit the pipe size, "
            "with its own wall thickness."
        ),
        "selection_notes": (
            "Pipe size(s) and number of rolls\n"
            "Wall thickness or standard, if your specification states one\n"
            "Matching pipe insulation"
        ),
        "status": "published",
        "review_notes": (
            "1/4 in (6.35 mm) is the supplied size. Whether this is an OD or ID figure, the "
            "copper wall thickness and the roll length are NOT established by the supplied "
            "specification — confirm before quoting against a customer's ID/OD requirement or "
            "adding those fields."
        ),
        "specifications": [
            {"label": "Pipe size (as supplied)", "value": "1/4 in (6.35 mm)", "unit": ""},
        ],
        "variants": [
            {"label": "1/4 inch (6.35 mm)", "diameter": "1/4 in (6.35 mm)"},
        ],
        "related": ["elastomeric-foam-pipe-sheet-insulation", "thermal-insulation-tape"],
    },

    # --- F. Industrial Tapes, Sealants & Electrical Insulation ---
    {
        "slug": "thermal-insulation-tape",
        "name": "Thermal Insulation Tape",
        "primary_category": "F",
        "additional_categories": ["E"],
        "applications": ["refrigeration-hvac"],
        "synonyms": "Armaflex tape, HVAC insulation tape, foam insulation tape, AC insulation tape",
        "short_summary": "Self-adhesive foam tape for sealing joints on pipe and sheet insulation.",
        "description": (
            "Thermal insulation tape is a self-adhesive foam tape used to wrap and seal joints, "
            "seams and fittings on pipe and sheet insulation in refrigeration and HVAC "
            "installations, so the insulation stays continuous along the line."
        ),
        "selection_notes": "Tape width and thickness\nNumber of rolls\nInsulation it will be used with",
        "status": "published",
        "review_notes": "'Armaflex tape' is a search synonym only — not a verified brand claim.",
        "related": ["elastomeric-foam-pipe-sheet-insulation", "aluminium-tape"],
    },
    {
        "slug": "heat-resistant-tape",
        "name": "Heat-Resistant Tape",
        "primary_category": "F",
        "applications": ["industrial-furnaces", "high-temperature-insulation"],
        "synonyms": "high-temperature tape, high temp tape",
        "short_summary": "Tape for wrapping, masking and sealing where normal tape would fail from heat.",
        "description": (
            "Heat-resistant tapes are used for wrapping, bundling, masking and sealing in hot "
            "industrial environments where ordinary adhesive tapes would soften or fail. "
            "Different tapes are made for different temperature ranges, so share the "
            "temperature and use with your enquiry."
        ),
        "selection_notes": "Operating temperature\nTape width\nUse (wrapping, masking, sealing)\nNumber of rolls",
        "status": "published",
        "review_notes": "Temperature rating and tape construction not confirmed — add from supplier datasheet.",
        "related": ["high-temperature-adhesives-sealants", "aluminium-tape"],
    },
    {
        "slug": "aluminium-tape",
        "name": "Aluminium Foil Tape",
        "primary_category": "F",
        "additional_categories": ["A", "E"],
        "applications": ["roofing-insulation", "refrigeration-hvac"],
        "synonyms": "aluminum tape, foil tape, HVAC foil tape, duct tape foil",
        "short_summary": "Self-adhesive aluminium foil tape for sealing foil-faced insulation and ductwork.",
        "description": (
            "Aluminium foil tape is a self-adhesive foil tape used to seal joints and seams on "
            "foil-faced insulation, reflective foil, ductwork and HVAC insulation, keeping the "
            "foil layer continuous."
        ),
        "selection_notes": "Tape width\nNumber of rolls\nMaterial it will be applied to",
        "status": "published",
        "review_notes": "Confirm supplied widths/roll lengths; add as variants.",
        "related": ["reflective-foil-insulation", "fibreglass-insulation", "thermal-insulation-tape"],
    },
    {
        "slug": "high-temperature-adhesives-sealants",
        "name": "High-Temperature Adhesives & Sealants",
        "primary_category": "F",
        "additional_categories": ["B"],
        "applications": ["industrial-furnaces", "bakeries-pizza-ovens", "high-temperature-insulation"],
        "synonyms": "refractory adhesive, high-temp sealant, fire sealant, furnace cement sealant, heat-resistant silicone",
        "short_summary": "Adhesives and sealants for bonding and sealing parts on hot equipment.",
        "description": (
            "High-temperature adhesives and sealants bond and seal refractory, ceramic fibre "
            "and metal parts on ovens, furnaces, boilers, flues and stoves where normal "
            "sealants would break down. Products range from flexible silicones for moderate "
            "heat to refractory-type sealants for higher temperatures.\n\n"
            "Share the operating temperature and the materials being joined."
        ),
        "selection_notes": "Operating temperature\nMaterials being bonded or sealed\nCartridge/tub size and quantity",
        "status": "published",
        "review_notes": "Maximum temperature ratings not confirmed — add from supplier datasheets.",
        "related": ["ceramic-fibre-rope", "heat-resistant-tape", "refractory-cement"],
    },
    {
        "slug": "high-voltage-insulating-mats",
        "name": "High-Voltage Insulating Mats",
        "primary_category": "F",
        "applications": [],
        "synonyms": "electrical insulating mats, switchboard mats, rubber insulating mats, switchgear mats",
        "short_summary": "Insulating rubber matting for the floor in front of switchgear and electrical panels.",
        "description": (
            "Electrical insulating mats are laid on the floor in front of switchgear, "
            "distribution boards and control panels as one part of protecting people working "
            "on electrical equipment.\n\n"
            "Insulating mats are made and tested for specific voltage classes. Tell us the "
            "voltage class your safety rules require and the mat size, and we will confirm the "
            "rating and test documentation for the mat we quote before you order."
        ),
        "selection_notes": (
            "Required voltage class / standard\n"
            "Mat length, width and thickness\n"
            "Quantity"
        ),
        "status": "published",
        "review_notes": (
            "Do not publish a voltage rating/class or safety-standard compliance until "
            "confirmed against the specific supplied product and its test certificate."
        ),
    },
]
