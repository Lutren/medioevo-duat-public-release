import base64
import json
import shutil
import subprocess
import tempfile
import time
from pathlib import Path

import requests
import websocket

REPO = Path(__file__).resolve().parents[2]
OUT_DIR = REPO / "qa_artifacts" / "debug_closure_v0_9"
SCREENSHOT_DIR = OUT_DIR / "screenshots"
BASE_URL = "http://127.0.0.1:4173"
LANGUAGE_STORAGE_KEY = "medioevo-duat-language"

ROUTES = [
    "/",
    "/landing",
    "/about",
    "/books",
    "/store",
    "/despertar-preview",
    "/despertar-preview.html",
    "/gumroad",
    "/products",
    "/audit",
    "/commercial-audit",
    "/status",
    "/boundary",
    "/canon",
    "/tools",
    "/duat",
    "/telecom",
    "/teleco",
    "/handoff",
    "/handoff-hub",
    "/handoff-engine",
    "/duat-devday",
    "/duat-city",
    "/docs",
]

VISUAL_ROUTES = ["/landing", "/duat-city", "/duat-devday", "/tools", "/handoff-engine"]

VIEWPORTS = {
    "mobile": {"width": 390, "height": 844, "mobile": True},
    "tablet": {"width": 768, "height": 1024, "mobile": True},
    "desktop": {"width": 1440, "height": 900, "mobile": False},
    "wide": {"width": 1920, "height": 1080, "mobile": False},
}

LANGUAGES = ["en", "es", "ru", "zh"]


def find_chrome() -> Path:
    candidates = [
        Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise SystemExit("No Chromium browser found")


class CDP:
    def __init__(self, ws_url: str):
        self.ws = websocket.create_connection(ws_url, timeout=8)
        self.counter = 0
        self.events = []

    def close(self):
        self.ws.close()

    def record_event(self, data):
        method = data.get("method")
        params = data.get("params", {})
        if method in {
            "Runtime.consoleAPICalled",
            "Runtime.exceptionThrown",
            "Log.entryAdded",
            "Network.loadingFailed",
            "Network.responseReceived",
        }:
            self.events.append({"method": method, "params": params})

    def call(self, method: str, params=None):
        self.counter += 1
        message = {"id": self.counter, "method": method}
        if params is not None:
            message["params"] = params
        self.ws.send(json.dumps(message))
        while True:
            data = json.loads(self.ws.recv())
            if data.get("id") == self.counter:
                return data
            self.record_event(data)

    def drain_events(self, seconds=0.35):
        old_timeout = self.ws.gettimeout()
        self.ws.settimeout(0.1)
        end = time.time() + seconds
        try:
            while time.time() < end:
                try:
                    self.record_event(json.loads(self.ws.recv()))
                except Exception:
                    break
        finally:
            self.ws.settimeout(old_timeout)

    def pop_events(self):
        events = self.events
        self.events = []
        return events


def sanitize_route(route: str) -> str:
    return "root" if route == "/" else route.strip("/").replace("/", "_").replace(".", "_")


def event_summary(events):
    console_errors = []
    network_errors = []
    runtime_errors = []
    for event in events:
        method = event["method"]
        params = event.get("params", {})
        if method == "Runtime.exceptionThrown":
            details = params.get("exceptionDetails", {})
            runtime_errors.append(details.get("text") or details.get("exception", {}).get("description") or "exception")
        elif method == "Runtime.consoleAPICalled" and params.get("type") in {"error", "assert"}:
            args = params.get("args", [])
            console_errors.append(" ".join(str(arg.get("value") or arg.get("description") or "") for arg in args).strip())
        elif method == "Log.entryAdded" and params.get("entry", {}).get("level") in {"error", "warning"}:
            entry = params.get("entry", {})
            if entry.get("level") == "error":
                console_errors.append(entry.get("text", "log error"))
        elif method == "Network.loadingFailed":
            network_errors.append(params.get("errorText", "network failed"))
        elif method == "Network.responseReceived":
            response = params.get("response", {})
            status = int(response.get("status", 0))
            url = response.get("url", "")
            if status >= 400 and not url.endswith("/favicon.ico"):
                network_errors.append(f"{status} {url}")
    if not network_errors:
        console_errors = [item for item in console_errors if not item.startswith("Failed to load resource:")]
    return {
        "console_errors": [item for item in console_errors if item],
        "network_errors": [item for item in network_errors if item],
        "runtime_errors": [item for item in runtime_errors if item],
    }


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    chrome = find_chrome()
    profile = Path(tempfile.mkdtemp(prefix="duat-debug-cdp-"))
    port = 9231
    proc = subprocess.Popen(
        [
            str(chrome),
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            f"--user-data-dir={profile}",
            f"--remote-debugging-port={port}",
            "--remote-allow-origins=*",
            "about:blank",
        ],
        cwd=REPO,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    results = {"routes": [], "visual": [], "i18n": [], "command_shell": None}
    try:
        for _ in range(80):
            try:
                tabs = requests.get(f"http://127.0.0.1:{port}/json", timeout=1).json()
                break
            except Exception:
                time.sleep(0.1)
        else:
            raise SystemExit("CDP did not start")
        page = next(tab for tab in tabs if tab.get("type") == "page")
        cdp = CDP(page["webSocketDebuggerUrl"])
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")
        cdp.call("Log.enable")
        cdp.call("Network.enable")

        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})
        for route in ROUTES:
            cdp.pop_events()
            cdp.call("Page.navigate", {"url": f"{BASE_URL}{route}?debug-route=1"})
            time.sleep(1.0)
            cdp.call("Runtime.evaluate", {"expression": "document.fonts && document.fonts.ready", "awaitPromise": True})
            cdp.drain_events()
            metrics_expr = r"""(() => {
              const root = document.documentElement;
              const bodyText = document.body ? document.body.innerText : "";
              const interactive = Array.from(document.querySelectorAll('a, button, input, select, textarea'));
              const unnamed = interactive.filter((el) => {
                const label = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('alt') || el.getAttribute('placeholder') || '').trim();
                return !label;
              }).map((el) => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ').join('.') : ''));
              return {
                title: document.title,
                h1: Array.from(document.querySelectorAll('h1')).map((el) => el.innerText),
                bodyTextLength: bodyText.length,
                mainExists: Boolean(document.querySelector('main')),
                navExists: Boolean(document.querySelector('nav[aria-label]')),
                horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
                whiteScreen: bodyText.length < 20 && !document.querySelector('canvas'),
                activeElementCount: interactive.length,
                unnamedInteractive: unnamed.slice(0, 12),
                backButton: Boolean(document.querySelector('.back-button')),
                simpleMode: Boolean(document.querySelector('[data-testid="simple-mode-landing"]')),
                advancedToggle: Boolean(document.querySelector('[aria-expanded][aria-controls]')),
                duatCity: Boolean(document.querySelector('.duat-city-page')),
                districtCards: document.querySelectorAll('.duat-city-card').length,
                commandShell: Boolean(document.querySelector('.duat-command-shell')),
                languageSelect: Boolean(document.querySelector('.language-select select')),
                storageKeys: Object.keys(localStorage)
              };
            })()"""
            metrics = cdp.call("Runtime.evaluate", {"expression": metrics_expr, "returnByValue": True})["result"]["result"]["value"]
            errors = event_summary(cdp.pop_events())
            ok = not metrics["whiteScreen"] and not metrics["horizontalOverflow"] and not errors["runtime_errors"] and not errors["console_errors"] and not errors["network_errors"]
            results["routes"].append({"route": route, "ok": ok, "metrics": metrics, "errors": errors})

        for viewport, cfg in VIEWPORTS.items():
            cdp.call("Emulation.setDeviceMetricsOverride", {
                "width": cfg["width"],
                "height": cfg["height"],
                "deviceScaleFactor": 1,
                "mobile": cfg["mobile"],
            })
            for route in VISUAL_ROUTES:
                cdp.pop_events()
                cdp.call("Page.navigate", {"url": f"{BASE_URL}{route}?visual-debug=1"})
                time.sleep(1.0)
                cdp.call("Runtime.evaluate", {"expression": "document.fonts && document.fonts.ready", "awaitPromise": True})
                metrics = cdp.call("Runtime.evaluate", {
                    "expression": "(() => ({overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, text: document.body.innerText.length, title: document.querySelector('h1')?.innerText || null}))()",
                    "returnByValue": True,
                })["result"]["result"]["value"]
                shot = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True})["result"]["data"]
                path = SCREENSHOT_DIR / f"{viewport}_{sanitize_route(route)}.png"
                path.write_bytes(base64.b64decode(shot))
                results["visual"].append({
                    "route": route,
                    "viewport": viewport,
                    "size": f"{cfg['width']}x{cfg['height']}",
                    "path": str(path.relative_to(REPO)),
                    "bytes": path.stat().st_size,
                    "ok": path.stat().st_size > 0 and not metrics["overflow"] and metrics["text"] > 20,
                    "metrics": metrics,
                })

        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 1, "mobile": True})
        for language in LANGUAGES:
            cdp.call("Runtime.evaluate", {
                "expression": f"localStorage.setItem('{LANGUAGE_STORAGE_KEY}', '{language}')",
                "returnByValue": True,
            })
            cdp.call("Page.navigate", {"url": f"{BASE_URL}/duat-city?i18n={language}"})
            time.sleep(1.0)
            metrics = cdp.call("Runtime.evaluate", {
                "expression": r"""(() => ({
                  lang: document.documentElement.lang,
                  selected: document.querySelector('.language-select select')?.value,
                  cityTitle: document.querySelector('.duat-city-hero h1')?.innerText || '',
                  navText: document.querySelector('nav')?.innerText || '',
                  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                  commandShell: Boolean(document.querySelector('.duat-command-shell'))
                }))()""",
                "returnByValue": True,
            })["result"]["result"]["value"]
            shot = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True})["result"]["data"]
            path = SCREENSHOT_DIR / f"i18n_{language}_duat-city_mobile.png"
            path.write_bytes(base64.b64decode(shot))
            results["i18n"].append({"language": language, "ok": metrics["selected"] == language and not metrics["overflow"], "metrics": metrics, "path": str(path.relative_to(REPO))})

        command_result = cdp.call("Runtime.evaluate", {
            "expression": r"""(() => {
              const input = document.querySelector('.command-form input');
              const button = document.querySelector('.command-form button');
              if (!input || !button) return {ok: false, reason: 'missing form'};
              input.value = 'inspect';
              input.dispatchEvent(new Event('input', {bubbles: true}));
              button.click();
              return {ok: true, transcript: document.querySelector('.command-transcript')?.innerText || ''};
            })()""",
            "returnByValue": True,
        })["result"]["result"]["value"]
        results["command_shell"] = command_result

        cdp.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
        shutil.rmtree(profile, ignore_errors=True)

    (OUT_DIR / "browser_debug_probe.json").write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    failures = []
    failures.extend([{"type": "route", **item} for item in results["routes"] if not item["ok"]])
    failures.extend([{"type": "visual", **item} for item in results["visual"] if not item["ok"]])
    failures.extend([{"type": "i18n", **item} for item in results["i18n"] if not item["ok"]])
    if not results["command_shell"] or not results["command_shell"].get("ok"):
      failures.append({"type": "command_shell", "item": results["command_shell"]})
    (OUT_DIR / "browser_debug_failures.json").write_text(json.dumps(failures, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"routes": len(results["routes"]), "visual": len(results["visual"]), "i18n": len(results["i18n"]), "failures": len(failures)}, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
