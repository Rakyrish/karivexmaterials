"""Catalogue search that tolerates common spelling/terminology variants
(fibre/fiber, fibreglass/fiberglass/glass wool, aluminium/aluminum...)."""

import re

from django.db.models import Q

# Each group lists interchangeable search terms. A query word matching any
# member is expanded to all members.
EQUIVALENT_TERMS = [
    ["fibre", "fiber"],
    ["fibreglass", "fiberglass", "fibre glass", "fiber glass", "glass wool", "glasswool"],
    ["aluminium", "aluminum"],
    ["rockwool", "rock wool", "mineral wool", "stone wool"],
    ["styrofoam", "polystyrene", "eps", "thermocol"],
    ["fireproof", "fire proof", "refractory", "heat resistant", "heat-resistant"],
    ["firebrick", "fire brick", "refractory brick"],
    ["cyclone", "turbine ventilator", "roof ventilator", "whirlybird"],
    ["armaflex", "elastomeric", "rubber foam", "nitrile rubber"],
    ["pu", "polyurethane", "puf"],
    ["pe", "polyethylene"],
    ["sisalation", "reflective foil", "foil insulation"],
    ["ceramic", "rcf"],
    ["mortar", "jointing"],
    ["colour", "color"],
]

SEARCH_FIELDS = ["name", "synonyms", "short_summary", "description", "brand", "sku"]

_lookup = {}
for group in EQUIVALENT_TERMS:
    for term in group:
        _lookup.setdefault(term, set()).update(group)


def expand_term(term):
    term = term.lower()
    variants = set(_lookup.get(term, {term}))
    # Partial-word spelling: "fiber" inside "fiberglass" etc.
    for a, b in (("fiber", "fibre"), ("fibre", "fiber"), ("aluminum", "aluminium")):
        if a in term:
            variants.add(term.replace(a, b))
    return variants


def tokenize(query):
    query = query.lower().strip()
    tokens = []
    # Keep known multi-word phrases together.
    for phrase in sorted((t for t in _lookup if " " in t), key=len, reverse=True):
        if phrase in query:
            tokens.append(phrase)
            query = query.replace(phrase, " ")
    tokens += [w for w in re.split(r"[^\w/.-]+", query) if len(w) > 1 or w.isdigit()]
    return tokens[:8]


def search_q(query):
    """AND across query words, OR across each word's equivalents and fields."""
    combined = Q()
    for token in tokenize(query):
        token_q = Q()
        for variant in expand_term(token):
            for field in SEARCH_FIELDS:
                token_q |= Q(**{f"{field}__icontains": variant})
        combined &= token_q
    return combined
