import json, sys, time, argparse
from pathlib import Path
from urllib.parse import urljoin
import requests

SEEDBANK_DOMAINS = {
    "Sensi Seeds":"sensiseeds.com","Sensi Seeds Research":"sensiseeds.com","Nirvana":"nirvanashop.com",
    "Greenhouse":"greenhouseseeds.nl","Serious Seeds":"seriousseeds.com","Spliff Seeds":"spliffseeds.nl",
    "Ace Seeds":"aceseeds.org","Anaconda Seeds":"anacondaseeds.com","Annabelle's Garden":"",
    "Barney’s Farm":"barneysfarm.com","Blimburn Seeds":"blimburnseeds.com","Bulk Seed Bank":"bulkseedbank.org",
    "Bulldog Seeds":"thebulldogseeds.com","Cannabella Genetics":"cannabellagenetics.com","CBD Crew":"cbdcrew.org",
    "Chronic & Caviar":"","Delicious Seeds":"deliciousseeds.com","DNA Genetics":"dnagenetics.com",
    "Dr. Underground Seeds":"drunderground.com","Dutch Passion":"dutch-passion.com","Empire Seeds":"empireseeds.com",
    "Exotic Seeds":"exoticseed.eu","Fast Buds":"fastbuds.com","Female Seeds":"femaleseeds.nl","G13 Labs":"g13labs.com",
    "Genehtik Seeds":"genehtik.com","Green Bodhi":"greenbodhi.org","House of the Great Gardener":"houseofthegreatgardener.com",
    "Humboldt Seed Company":"humboldtseedcompany.com","Humboldt Seeds":"humboldtseeds.net","Hyp3rids":"hyp3rids.com",
    "Kalashnikov Seeds":"kalashnikov-seeds.com","Kannabia":"kannabia.com","K.C. Brains":"kcbrains.com",
    "krauTHCollective":"krauthcollective.com","La Semilla Automatica":"lasemillaautomatica.com","Mallorca Seeds":"mallorcaseeds.com",
    "Mandala":"mandalaseeds.com","Medical Seeds Co.":"medicalseeds.com","Ministry of Cannabis":"ministryofcannabis.com",
    "Paradise Seeds":"paradise-seeds.com","Philosopher Seeds":"philosopherseeds.com","Positronics":"positronicseeds.com",
    "Prana Medical Seeds":"pranamedicalseeds.com","Pyramid Seeds":"pyramidseeds.com","Regular Seeds French Legacy":"regularseeds.fr",
    "Resin Seeds":"resinseeds.net","Ripper Seeds":"ripperseeds.com","Royal Queen Seeds":"royalqueenseeds.com",
    "Samsara Seeds":"samsaraseeds.com","Seedsman":"seedsman.com","Seed Stockers":"seedstockers.com","Seedy Simon":"seedysimon.com",
    "Silent Seeds":"silent-seeds.com","Söllner - Vadda's Marijuanabam":"","Strain Hunters Seedbank":"strainhunters.com",
    "Sumo Seeds":"sumoseeds.com","Super Sativa Seed Club":"supersativaseedclub.com","Super Strains":"superstrains.com",
    "Sweet Seeds":"sweetseeds.com","The Cali Connection":"thecaliconnection.com","The North Coast Genetics":"northcoastgenetics.com",
    "The Plug Seedbank":"theplugseedbank.com","T.H. Seeds":"thseeds.com","Top Tao Seeds":"toptaoseeds.com",
    "Victory Seeds":"victory-seeds.com","Vision Seeds":"visionseeds.nl","White Label Seeds":"white-label-seeds.com",
    "World of Seeds":"worldofseeds.com","CBD Nutzhanfsamen":""
}

POSSIBLE_PATHS = ["/api/","/api","/wp-json/","/wp-json/wp/v2/","/products.json",
                  "/feed.xml","/feed","/data.json","/rest/products","/ajax/product","/json/"]
HEADERS={"User-Agent":"Mozilla/5.0 (Windows NT 10.0) SeedScan/1.0"}

def load_existing(path):
    p = Path(path)
    if not p.is_file():
        return {}
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}

    # Neuer Standard: Dict {seedbank: {path: info}}
    if isinstance(data, dict):
        return data

    # Altformat: Liste von Einträgen mit Keys: seedbank, path, status, is_json, ...
    if isinstance(data, list):
        result = {}
        for item in data:
            name = (item or {}).get("seedbank") or "UNKNOWN"
            path = (item or {}).get("path") or ""
            info = {}
            for k in ("status", "is_json", "length", "url", "error"):
                if k in (item or {}):
                    info[k] = item[k]
            if path:
                result.setdefault(name, {})[path] = info
        return result

    return {}


def save(path,data):
    tmp=Path(path).with_suffix(".tmp")
    tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    tmp.replace(path)

def check_endpoint(base,path,timeout):
    url=urljoin(base,path)
    try:
        r=requests.get(url,headers=HEADERS,timeout=timeout,allow_redirects=True)
        ct=r.headers.get("Content-Type","")
        is_json=("application/json" in ct) or r.text.strip().startswith("{") or r.text.strip().startswith("[")
        return {"status":r.status_code,"is_json":bool(is_json),"length":len(r.text),"url":url}
    except Exception as e:
        return {"error":str(e)}

def main():
    import argparse
    ap=argparse.ArgumentParser()
    ap.add_argument("--json",default="results.json")
    ap.add_argument("--timeout",type=float,default=5.0)
    ap.add_argument("--delay",type=float,default=0.3)
    ap.add_argument("--resume",action="store_true")
    args=ap.parse_args()

    results=load_existing(args.json) if args.resume else {}
    names=list(SEEDBANK_DOMAINS.keys()); total=len(names)

    for idx,name in enumerate(names,1):
        domain=SEEDBANK_DOMAINS[name]
        if not domain: 
            print(f"[{idx}/{total}] SKIP  {name} (kein Domain-Eintrag)")
            continue
        if args.resume and name in results and isinstance(results[name],dict) and len(results[name])>=len(POSSIBLE_PATHS):
            print(f"[{idx}/{total}] SKIP  {name} ({domain})")
            continue

        base=f"https://{domain}"
        print(f"[{idx}/{total}] SCAN  {name} ({domain})")
        per={}
        for p in POSSIBLE_PATHS:
            per[p]=check_endpoint(base,p,args.timeout)
            time.sleep(args.delay)
        results[name]=per
        save(args.json,results)
        hits=[pp for pp,info in per.items() if isinstance(info,dict) and info.get("status")==200 and info.get("is_json")]
        print("  → JSON Endpoints: "+(", ".join(hits) if hits else "keine"))

    print("\nKandidaten mit JSON 200:")
    for n,paths in results.items():
        if not isinstance(paths,dict): continue
        for p,info in paths.items():
            if isinstance(info,dict) and info.get("status")==200 and info.get("is_json"):
                print(f"- {n}: https://{SEEDBANK_DOMAINS[n]}{p}")

if __name__=="__main__":
    main()

