"""Exercise every ThaiStat control in a real browser and report pass/fail."""
import subprocess
import time
import urllib.request
from pathlib import Path

BUILD = Path(__file__).resolve().parent
PORT = 8082
BASE = f"http://127.0.0.1:{PORT}"

server = subprocess.Popen(["node", "serve.ts", "--port", str(PORT)], cwd=str(BUILD),
                          stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
results = []
try:
    for _ in range(50):
        try:
            urllib.request.urlopen(BASE + "/", timeout=1)
            break
        except Exception:
            time.sleep(0.2)

    from playwright.sync_api import sync_playwright

    def check(name, ok, extra=""):
        results.append((name, ok, extra))
        print(("PASS" if ok else "FAIL"), name, extra)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)

        page.goto(BASE + "/#/", wait_until="networkidle")
        check("home renders KPI", "71.67" in page.content())
        check("home hero", "Thailand in numbers" in page.content())

        # Year picker on overview
        page.select_option("#yearpick", "2019")
        page.wait_for_timeout(200)
        check("year picker 2019", "39.9" in page.content() and "2019" in page.content())

        # Nav to economy, toggle chart kind
        page.click('a[href="#/economy"]')
        page.wait_for_timeout(200)
        check("economy route", "The economy: size" in page.content())
        page.click('button[data-kind="line"]')
        page.wait_for_timeout(200)
        check("line toggle", "polyline" in page.content())
        page.click('button[data-kind="bar"]')
        page.wait_for_timeout(200)
        check("bar toggle back", page.content().count("<rect") > 5)

        # People
        page.click('a[href="#/people"]')
        page.wait_for_timeout(200)
        check("people route", "getting older" in page.content())
        check("age table", "65+ years" in page.content())

        # Trade tabs
        page.click('a[href="#/trade"]')
        page.wait_for_timeout(200)
        check("trade products default", "Electrical machinery" in page.content())
        page.click('button[data-tab="partners"]')
        page.wait_for_timeout(200)
        check("partners tab", "United States" in page.content() and "18.3%" in page.content())
        page.click('button[data-tab="tourism"]')
        page.wait_for_timeout(200)
        check("tourism tab", "6.73" in page.content())

        # Provinces: search, region filter, sort
        page.click('a[href="#/provinces"]')
        page.wait_for_timeout(200)
        page.fill("#prov-search", "Chiang")
        page.wait_for_timeout(300)
        tbl = page.locator("table.data tbody").inner_text()
        check("province search filters", "Chiang Mai" in tbl and "Bangkok" not in tbl, tbl[:80])
        page.fill("#prov-search", "")
        page.wait_for_timeout(300)
        page.select_option('[data-control="prov-region"]', "South")
        page.wait_for_timeout(300)
        tbl = page.locator("table.data tbody").inner_text()
        check("region filter", "Songkhla" in tbl and "Bangkok" not in tbl, tbl[:80])
        page.select_option('[data-control="prov-region"]', "All regions")
        page.wait_for_timeout(300)
        page.click('button[data-sort="name"]')
        page.wait_for_timeout(300)
        check("sort A-Z", page.content().index("Bangkok") < page.content().index("Chiang Mai"))

        # Explorer: indicator + range + CSV
        page.click('a[href="#/explorer"]')
        page.wait_for_timeout(200)
        check("explorer default", "GDP, current prices" in page.content())
        page.select_option("#ex-ind", "tourists")
        page.wait_for_timeout(300)
        check("explorer indicator switch", "International tourist arrivals" in page.content() and "35.5" in page.content())
        page.select_option("#ex-from", "2020")
        page.select_option("#ex-to", "2022")
        page.wait_for_timeout(300)
        check("explorer range", "2020" in page.content() and "11.2" in page.content())
        with page.expect_download() as dl:
            page.click('[data-control="ex-csv"]')
        dl = dl.value
        path = "/tmp/thaistat-test.csv"
        dl.save_as(path)
        csv = Path(path).read_text()
        check("CSV download", csv.startswith("year,International tourist arrivals") and "2022,11.2" in csv, csv.splitlines()[0])

        # Sources + unknown route
        page.click('a[href="#/sources"]')
        page.wait_for_timeout(200)
        check("sources route", "Release calendar" in page.content())
        page.goto(BASE + "/#/nope", wait_until="networkidle")
        page.wait_for_timeout(200)
        check("unknown route 404 page", "Page not found" in page.content())

        # Phone viewport: nav wraps, no horizontal overflow
        mob = browser.new_page(viewport={"width": 390, "height": 844})
        mob.goto(BASE + "/#/economy", wait_until="networkidle")
        mob.wait_for_timeout(300)
        overflow = mob.evaluate("document.documentElement.scrollWidth > 391")
        check("phone no horizontal overflow", not overflow)
        check("phone KPI visible", "526.5" in mob.content())
        mob.close()

        check("no page/console errors", not errs, "; ".join(errs[:3]))
        browser.close()
finally:
    server.terminate()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
raise SystemExit(1 if failed else 0)
