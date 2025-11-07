"""
seedbank_api_checker.py
========================

This script is designed to help you audit a long list of seed banks for
potentially accessible JSON or REST‑style endpoints.  Given a mapping of
seed bank names to their primary domains, it iterates over a set of
common endpoint paths (``/api``, ``/products.json``, etc.) and reports
HTTP status codes and whether a JSON payload is returned.

**Important:** This program performs HTTP GET requests against the
supplied domains.  In certain execution environments (including the
ChatGPT container used to author this file) outbound requests may be
restricted or blocked.  Before running this script, ensure that your
network configuration permits HTTP traffic and that you have legal
permission to probe the target sites.

If a seed bank does not have a public API, the probe will likely
return a ``404`` (Not Found) or ``403`` (Forbidden) status.  The
``is_json`` flag simply tests whether the response includes a
``Content‑Type: application/json`` header or starts with a curly brace.
You should treat these results as hints rather than definitive proof
of an API.  Many commercial seed vendors use Shopify or WooCommerce
stores that expose ``/products.json`` endpoints; others have no
machine‑readable interface at all.

To add, remove or correct domains, edit the ``SEEDBANK_DOMAINS``
dictionary below.  Entries with an empty string as the domain will be
skipped.
"""

from __future__ import annotations

import logging
import requests
from urllib.parse import urljoin
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional


logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Configuration
#
# Mapping of seed bank names to the domain you want to probe.  Some names
# below are speculative: if you know the exact e‑commerce domain used by
# a breeder, update the value accordingly.  Leave the value as an empty
# string ("") if the domain is unknown.  The script will skip entries
# with empty domains.
SEEDBANK_DOMAINS: Dict[str, str] = {
    "Sensi Seeds": "sensiseeds.com",
    "Sensi Seeds Research": "sensiseeds.com",
    "Nirvana": "nirvanashop.com",
    "Greenhouse": "greenhouseseeds.nl",
    "Serious Seeds": "seriousseeds.com",
    "Spliff Seeds": "spliffseeds.nl",
    "Ace Seeds": "aceseeds.org",
    "Anaconda Seeds": "anacondaseeds.com",
    "Annabelle's Garden": "",
    "Barney's Farm": "barneysfarm.com",
    "Blimburn Seeds": "blimburnseeds.com",
    "Bulk Seed Bank": "bulkseedbank.org",
    "Bulldog Seeds": "thebulldogseeds.com",
    "Cannabella Genetics": "cannabellagenetics.com",
    "CBD Crew": "cbdcrew.org",
    "Chronic & Caviar": "",
    "Delicious Seeds": "deliciousseeds.com",
    "DNA Genetics": "dnagenetics.com",
    "Dr. Underground Seeds": "drunderground.com",
    "Dutch Passion": "dutch-passion.com",
    "Empire Seeds": "empireseeds.com",
    "Exotic Seeds": "exoticseed.eu",
    "Fast Buds": "fastbuds.com",
    "Female Seeds": "femaleseeds.nl",
    "G13 Labs": "g13labs.com",
    "Genehtik Seeds": "genehtik.com",
    "Green Bodhi": "greenbodhi.org",
    "House of the Great Gardener": "houseofthegreatgardener.com",
    "Humboldt Seed Company": "humboldtseedcompany.com",
    "Humboldt Seeds": "humboldtseeds.net",
    "Hyp3rids": "hyp3rids.com",
    "Kalashnikov Seeds": "kalashnikov-seeds.com",
    "Kannabia": "kannabia.com",
    "K.C. Brains": "kcbrains.com",
    "krauTHCollective": "krauthcollective.com",
    "La Semilla Automatica": "lasemillaautomatica.com",
    "Mallorca Seeds": "mallorcaseeds.com",
    "Mandala": "mandalaseeds.com",
    "Medical Seeds Co.": "medicalseeds.com",
    "Ministry of Cannabis": "ministryofcannabis.com",
    "Paradise Seeds": "paradise-seeds.com",
    "Philosopher Seeds": "philosopherseeds.com",
    "Positronics": "positronicseeds.com",
    "Prana Medical Seeds": "pranamedicalseeds.com",
    "Pyramid Seeds": "pyramidseeds.com",
    "Regular Seeds French Legacy": "regularseeds.fr",
    "Resin Seeds": "resinseeds.net",
    "Ripper Seeds": "ripperseeds.com",
    "Royal Queen Seeds": "royalqueenseeds.com",
    "Samsara Seeds": "samsaraseeds.com",
    "Seedsman": "seedsman.com",
    "Seed Stockers": "seedstockers.com",
    "Seedy Simon": "seedysimon.com",
    "Silent Seeds": "silent-seeds.com",
    "Söllner - Vadda's Marijuanabam": "",
    "Strain Hunters Seedbank": "strainhunters.com",
    "Sumo Seeds": "sumoseeds.com",
    "Super Sativa Seed Club": "supersativaseedclub.com",
    "Super Strains": "superstrains.com",
    "Sweet Seeds": "sweetseeds.com",
    "The Cali Connection": "thecaliconnection.com",
    "The North Coast Genetics": "northcoastgenetics.com",
    "The Plug Seedbank": "theplugseedbank.com",
    "T.H. Seeds": "thseeds.com",
    "Top Tao Seeds": "toptaoseeds.com",
    "Victory Seeds": "victory-seeds.com",
    "Vision Seeds": "visionseeds.nl",
    "White Label Seeds": "white-label-seeds.com",
    "World of Seeds": "worldofseeds.com",
    "CBD Nutzhanfsamen": ""
}


# Endpoint candidates that will be appended to each base domain.  The order
# matters only for readability; the script will test each path in the
# sequence provided here.
ENDPOINTS: List[str] = [
    "/api/",
    "/api",
    "/products.json",
    "/feed.xml",
    "/data.json",
    "/productdata",
    "/wp-json/wp/v2/",
    "/wp-json/",
    "/ajax/product",
    "/rest/products"
]


@dataclass
class EndpointResult:
    """Data structure to hold probe results for a single endpoint."""

    seedbank: str
    domain: str
    path: str
    status: Optional[int] = None
    is_json: bool = False
    error: Optional[str] = None

    def as_dict(self) -> dict:
        return asdict(self)


def probe_domain(domain: str, paths: List[str], timeout: int = 8) -> List[EndpointResult]:
    """Probe a domain for a list of paths.

    Parameters
    ----------
    domain: str
        The base domain (without protocol) to test.
    paths: List[str]
        A list of relative paths (should start with a slash) to append to the domain.
    timeout: int, optional
        How many seconds to wait before giving up on a request.  Defaults to 8.

    Returns
    -------
    List[EndpointResult]
        A list of results describing each attempted probe.
    """
    results: List[EndpointResult] = []
    base_url = f"https://{domain.strip('/')}"
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; seedbank-probe/1.0)",
        "Accept": "*/*",
    }
    for path in paths:
        result = EndpointResult(seedbank="", domain=domain, path=path)
        url = urljoin(base_url, path)
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            result.status = response.status_code
            content_type = response.headers.get("Content-Type", "").lower()
            # crude JSON test: either declared as JSON or starts with "{".
            if ("application/json" in content_type) or response.text.lstrip().startswith("{"):
                result.is_json = True
        except Exception as exc:  # noqa: BLE001
            result.error = str(exc)
        results.append(result)
    return results


def run_probe() -> List[EndpointResult]:
    """Iterate through all seed banks and probe their domains.

    Returns
    -------
    List[EndpointResult]
        A flattened list of all results for every seed bank and endpoint.
    """
    aggregated_results: List[EndpointResult] = []
    for seedbank, domain in SEEDBANK_DOMAINS.items():
        if not domain:
            logger.info("Skipping %s because no domain is specified.", seedbank)
            continue
        logger.info("Probing %s (%s)", seedbank, domain)
        try:
            results = probe_domain(domain, ENDPOINTS)
            for r in results:
                r.seedbank = seedbank
            aggregated_results.extend(results)
        except Exception as exc:  # noqa: BLE001
            logger.error("Unexpected error while probing %s: %s", domain, exc)
            aggregated_results.append(
                EndpointResult(seedbank=seedbank, domain=domain, path="", error=str(exc))
            )
    return aggregated_results


def main() -> None:
    import argparse
    import json
    parser = argparse.ArgumentParser(
        description="Probe a list of seed banks for potential API endpoints."
    )
    parser.add_argument(
        "--json",
        dest="json_path",
        default=None,
        help="If provided, write the full results to this JSON file."
    )
    args = parser.parse_args()
    results = run_probe()
    # Print a condensed table to stdout
    print(f"{'Seedbank':30} {'Domain':25} {'Path':30} {'Status':7} {'JSON?':5} {'Error'}")
    for res in results:
        status = res.status if res.status is not None else "-"
        is_json = "Y" if res.is_json else "N"
        print(f"{res.seedbank:30} {res.domain:25} {res.path:30} {status:7} {is_json:5} {res.error or ''}")
    if args.json_path:
        with open(args.json_path, "w", encoding="utf-8") as f:
            json.dump([r.as_dict() for r in results], f, ensure_ascii=False, indent=2)
        print(f"\nDetailed results written to {args.json_path}")


if __name__ == "__main__":
    main()