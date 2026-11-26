"""Take ThaiStat screenshots with Playwright: desktop overview, economy, trade
and a phone-size view. Serves app/ on :8080 first (start `node serve.ts`
before running, or this script starts it)."""
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
BUILD = HERE
SHOTS = json.loads((BUILD / "shots.json").read_text())

PORT = 8081
BASE = f"http://127.0.0.1:{PORT}"

server = subprocess.Popen(
    ["node", "serve.ts", "--port", str(PORT)],
    cwd=str(BUILD),
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
)
try:
    for _ in range(50):
        try:
            urllib.request.urlopen(BASE + "/", timeout=1)
            break
        except Exception:
            time.sleep(0.2)
    else:
        raise SystemExit("server did not come up")

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        errors = []
        for shot in SHOTS:
            page = browser.new_page(viewport=shot["viewport"])
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(BASE + "/" + shot["path"], wait_until="networkidle")
            page.wait_for_timeout(400)
            out = BUILD / "screenshots" / shot["file"]
            page.screenshot(path=str(out), type="jpeg", quality=82)
            print(out, out.stat().st_size, "bytes")
            page.close()
        browser.close()
    if errors:
        print("CONSOLE/PAGE ERRORS:")
        for e in errors:
            print(" -", e)
    else:
        print("no console/page errors")
finally:
    server.terminate()
