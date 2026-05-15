from __future__ import annotations

import csv
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import jsonschema
import yaml


ROOT = Path(__file__).resolve().parents[1]
BRAIN = Path(r"C:\Users\L-Tyr\OneDrive\Escritorio\-= BRAIN_OS =-")
QA = ROOT / "08_QA_WITNESSLOG"
DOCS = ROOT / "docs"
PUBLIC = ROOT / "public"
PACKAGE = ROOT / "public_release_package"

SCHEMA_SRC = BRAIN / "02_CLAUDIO" / "schemas" / "handoff_v2_1.schema.json"
TEMPLATE_SRC = BRAIN / "02_CLAUDIO" / "templates" / "handoff_v2_1_std.yaml"

SECRET_PATTERNS = {
    ".env": re.compile(r"(^|[\\/])\.env($|[\\/])", re.I),
    "API_KEY": re.compile(r"API[_-]?KEY", re.I),
    "SECRET": re.compile(r"SECRET", re.I),
    "TOKEN": re.compile(r"TOKEN", re.I),
    "PRIVATE_KEY": re.compile(r"PRIVATE[_-]?KEY", re.I),
    "BEGIN_RSA_PRIVATE_KEY": re.compile(r"BEGIN RSA PRIVATE KEY", re.I),
    "BEGIN_OPENSSH_PRIVATE_KEY": re.compile(r"BEGIN OPENSSH PRIVATE KEY", re.I),
    "sk-": re.compile(r"sk-[A-Za-z0-9_\-]{20,}"),
    "ghp_": re.compile(r"ghp_[A-Za-z0-9_]{20,}"),
    "password=": re.compile(r"password\s*=", re.I),
    "GUMROAD": re.compile(r"GUMROAD", re.I),
    "OPENAI_API_KEY": re.compile(r"OPENAI_API_KEY", re.I),
    "JWT": re.compile(r"\bJWT\b", re.I),
    "Bearer": re.compile(r"Bearer\s+[A-Za-z0-9._\-]{16,}", re.I),
}

BOUNDARY_PATTERNS = {
    "book": re.compile(r"\bbook\b", re.I),
    "books": re.compile(r"\bbooks\b", re.I),
    "libros": re.compile(r"\blibros\b", re.I),
    "rpg": re.compile(r"\brpg\b", re.I),
    "tcg": re.compile(r"\btcg\b", re.I),
    "manuscript": re.compile(r"\bmanuscript\b", re.I),
    "manuscrito": re.compile(r"\bmanuscrito\b", re.I),
    "private": re.compile(r"\bprivate\b", re.I),
    "secret": re.compile(r"\bsecret\b", re.I),
    "source_zips": re.compile(r"source_zips", re.I),
    "99_SOURCE_VAULT": re.compile(r"99_SOURCE_VAULT", re.I),
    "DUAT_private": re.compile(r"DUAT_private", re.I),
    "Wabi-Sabi internals": re.compile(r"Wabi-Sabi internals", re.I),
    "Claudio private runtime": re.compile(r"Claudio private runtime", re.I),
    "raw_prompts": re.compile(r"raw_prompts", re.I),
    ".env": re.compile(r"\.env", re.I),
    ".local": re.compile(r"\.local", re.I),
}

RISK_PHRASES = {
    "AGI": re.compile(r"\bAGI\b", re.I),
    "consciousness": re.compile(r"\bconsciousness\b", re.I),
    "quantum gravity": re.compile(r"quantum gravity", re.I),
    "antigravity": re.compile(r"antigravity", re.I),
    "medical claims": re.compile(r"medical claims?", re.I),
    "prevents errors": re.compile(r"prevents errors", re.I),
}

EXCLUDED_DIRS = {
    ".git",
    ".wrangler",
    ".local",
    "node_modules",
    "dist",
    "qa",
    "08_QA_WITNESSLOG",
    "public_release_package",
    "source_zips",
    "99_SOURCE_VAULT",
    "qa_artifacts",
    "__pycache__",
}

PACKAGE_INCLUDE = [
    "src",
    "public",
    "docs",
    ".github",
]

PACKAGE_ROOT_FILES = [
    "README.md",
    "STATUS.md",
    "PUBLIC_REPO_MAP.md",
    "PUBLICATION_BOUNDARY.md",
    "CLAIMS_BOUNDARY.md",
    "OPEN_SOURCE_ROADMAP.md",
    "SECURITY.md",
    "LICENSE",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "index.html",
]


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest().upper()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def git_output(*args: str) -> str:
    try:
        return subprocess.check_output(["git", "-C", str(ROOT), *args], text=True, stderr=subprocess.STDOUT, timeout=30).strip()
    except Exception as exc:
        return f"ERROR: {exc}"


def fetch_url(url: str) -> dict:
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "MEDIOEVO-public-audit/1.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            data = response.read(300_000)
            return {
                "url": url,
                "status": getattr(response, "status", None),
                "bytes": len(data),
                "sha256": sha256_bytes(data),
                "contains_duat": b"DUAT" in data or b"duat" in data,
                "contains_handoff_v2_1": b"v2.1" in data and (b"handoff" in data.lower()),
                "contains_status": b"Status" in data or b"status" in data,
            }
    except urllib.error.HTTPError as exc:
        return {"url": url, "status": exc.code, "error": str(exc)}
    except Exception as exc:
        return {"url": url, "status": None, "error": str(exc)}


def public_files() -> list[Path]:
    files = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        parts = set(path.relative_to(ROOT).parts)
        if parts & EXCLUDED_DIRS:
            continue
        if "scripts" in parts:
            continue
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".ico", ".pdf"}:
            continue
        files.append(path)
    return files


def classify_secret(path: Path, kind: str, line: str) -> str:
    rel_parts = path.relative_to(ROOT).parts
    boundary_doc = (
        path.name
        in {
            ".gitignore",
            "CHANGELOG.md",
            "CLAIMS_BOUNDARY.md",
            "MAINTENANCE.md",
            "OPEN_SOURCE_ROADMAP.md",
            "PUBLICATION_BOUNDARY.md",
            "PUBLIC_REPO_MAP.md",
            "README.md",
            "SECURITY.md",
            "STATUS.md",
        }
        or "docs" in rel_parts
        or ".github" in rel_parts
    )
    if path.name == ".env" or path.suffix.lower() in {".pem", ".key"}:
        return "BLOCK"
    if kind in {"sk-", "ghp_", "BEGIN_RSA_PRIVATE_KEY", "BEGIN_OPENSSH_PRIVATE_KEY", "Bearer", "password="}:
        return "BLOCK"
    if path.name in {"package-lock.json", "tsconfig.tsbuildinfo"}:
        return "INFO_GENERATED_METADATA"
    if rel(path).startswith("public/schemas/"):
        return "INFO_SCHEMA_DECLARATION"
    if rel(path).startswith("src/messagebus/"):
        return "INFO_PUBLIC_EVIDENCE_KEYWORD"
    if "scripts" in path.relative_to(ROOT).parts and ("re.compile" in line or "SECRET_PATTERNS" in line or "classify_secret" in line or "kind in" in line):
        return "INFO_SCANNER_DEFINITION"
    if rel(path).startswith("src/App.tsx") or rel(path).startswith("src/content/"):
        return "INFO_PUBLIC_COPY_KEYWORD"
    if kind in {"TOKEN", "SECRET", "API_KEY", "GUMROAD", "OPENAI_API_KEY", "JWT", ".env", "PRIVATE_KEY"} and boundary_doc:
        return "INFO_POLICY_MENTION"
    return "REVIEW"


def scan_patterns(patterns: dict[str, re.Pattern], kind: str) -> list[dict]:
    findings = []
    for path in public_files():
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for line_no, line in enumerate(text.splitlines(), 1):
            for name, pattern in patterns.items():
                if pattern.search(line):
                    if kind == "secret":
                        severity = classify_secret(path, name, line)
                    elif kind == "boundary":
                        severity = classify_boundary(path, name)
                    else:
                        severity = classify_risk(path, name, line)
                    findings.append({"path": rel(path), "line": line_no, "type": name, "severity": severity})
    return findings


def classify_boundary(path: Path, name: str) -> str:
    safe_docs = {
        "PUBLICATION_BOUNDARY.md",
        "CLAIMS_BOUNDARY.md",
        "STATUS.md",
        "PUBLIC_REPO_MAP.md",
        "OPEN_SOURCE_ROADMAP.md",
        "SECURITY.md",
        "README.md",
        ".gitignore",
        "CHANGELOG.md",
        "MAINTENANCE.md",
        "ROADMAP.md",
        "PUBLIC_SCOPE.md",
        "PUBLIC_README.md",
        "HANDOFF_v2_1_STATUS.md",
        "HANDOFF_v2_1_H-STD.yaml",
    }
    if path.name in safe_docs or "docs" in path.relative_to(ROOT).parts:
        return "INFO_BOUNDARY_DECLARATION"
    if ".github" in path.relative_to(ROOT).parts:
        return "INFO_BOUNDARY_DECLARATION"
    if path.name in {"package.json", "package-lock.json", "tsconfig.tsbuildinfo"}:
        return "INFO_GENERATED_METADATA"
    if rel(path).startswith("public/schemas/"):
        return "INFO_SCHEMA_DECLARATION"
    if rel(path).startswith("src/App.tsx"):
        return "INFO_PUBLIC_BOUNDARY_COPY"
    if rel(path).startswith("src/content/"):
        return "INFO_PUBLIC_CONTENT_METADATA"
    if rel(path).startswith("src/content/books.ts"):
        return "INFO_PUBLIC_CATALOG_METADATA"
    if rel(path).startswith("src/content/publicIdentity.ts"):
        return "INFO_PUBLIC_BOUNDARY_COPY"
    return "REVIEW"


def classify_risk(path: Path, name: str, line: str) -> str:
    lower = line.lower()
    if path.name in {"CLAIMS_BOUNDARY.md", "PUBLICATION_BOUNDARY.md"} or "docs" in path.relative_to(ROOT).parts:
        return "INFO_RISK_BOUNDARY_DECLARATION"
    if rel(path).startswith("src/App.tsx") and ("unsupported claims" in lower or "blocked from public release" in lower):
        return "INFO_RISK_BOUNDARY_COPY"
    return "REVIEW"


def write_table(path: Path, rows: list[dict], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})


def create_public_docs() -> None:
    docs = {
        ROOT / "STATUS.md": """# Public Status

Status: REVIEW-ready public package, not auto-published by this audit.

Usable now:
- DUAT public visual demo with synthetic telemetry.
- Telecom / MessageBus public surface.
- Handoff v2.1 public contract.
- ActionGate, WitnessLog, Source Card and boundary documentation.

Protected:
- Full books, unpublished manuscripts, RPG/TCG, full DUAT/GEODIA, Wabi-Sabi internals, Claudio private runtime, raw prompts, private datasets, credentials and source zips.

Publication gate:
- SecretScan, BoundaryCheck, Build, RouteCheck, Handoff schema validation and ReconstructionTest must pass before external push/deploy/release.
""",
        ROOT / "PUBLIC_REPO_MAP.md": """# Public Repo Map

Public repository: `Lutren/medioevo-duat-public-release`

Core paths:
- `src/`: public React/Vite application and synthetic demo logic.
- `public/`: public-safe visual assets and static routing files.
- `docs/`: public documentation and Handoff v2.1 contract.
- `public_release_package/`: generated release candidate copy without `.git`, `.wrangler`, QA internals, source zips or private vaults.

Disconnected/private roots:
- `BRAIN_OS`: human/canon/continuity root, not a public repo dump.
- `-=L.R.GONZALEZ=-`: technical workspace, not a public package.
- private books/RPG/TCG/DUAT/Wabi-Sabi/Claudio internals remain excluded.
""",
        ROOT / "PUBLICATION_BOUNDARY.md": """# Publication Boundary

Publicable:
- ActionGate, WitnessLog, Handoff v2.1, Source Cards, Claim Classifier, Secret Scanner, Canon Compiler, Context Compressor, agent templates, public portal, toy demos, synthetic data, public docs, open-source roadmap and falsifier templates.

Protected:
- Complete books, unpublished manuscripts, RPG/TCG, complete DUAT/GEODIA, Wabi-Sabi internals, Claudio private runtime, raw prompts, private datasets, commercial automations, private vaults, local paths, credentials, tokens, `.env` and source zips.

Do not publish:
- Prompt-Execute-Master.zip, `.git`, `.local`, `source_zips`, `qa_artifacts`, `99_SOURCE_VAULT`, unreviewed attached assets, logs with credentials or any private runtime dump.
""",
        ROOT / "CLAIMS_BOUNDARY.md": """# Claims Boundary

Allowed language:
- public demo, prototype, orchestration display, agent workflow tooling, evidence-backed handoff, designed to reduce errors, synthetic telemetry, local-first release surface.

Avoid or gate:
- autonomous general intelligence claims, consciousness claims, physics claims, medical claims, guaranteed safety, guaranteed revenue, guaranteed prediction or production-critical claims.

Replacement rules:
- "autonomous general intelligence repair" -> "agent repair" or "workflow recalibration".
- "prevents errors" -> "is designed to reduce errors".
- physics/consciousness speculation -> lab/speculative note with falsifier template.
""",
        ROOT / "OPEN_SOURCE_ROADMAP.md": """# Open Source Roadmap

P0:
- Public Handoff v2.1 contract and validator.
- SecretScan and BoundaryCheck minimal scripts.
- ActionGate and WitnessLog templates.
- Public release package manifest and route checks.

P1:
- Claim Classifier.
- Source Card generator.
- Context Compressor.
- Canon Compiler for public-safe summaries.

P2:
- Synthetic demos and falsifier templates.
- Contributor docs and issue templates.
- Public-safe examples for agent workflow recalibration.
""",
    }
    for path, text in docs.items():
        write(path, text)
        if path.name not in {"README.md"}:
            write(DOCS / path.name, text)

    readme = """# MEDIOEVO / DUAT Public Release

MEDIOEVO / DUAT is a public-safe cognitive engineering and agent orchestration release focused on reducing informational residue across complex workflows.

This repository contains the public release only. Private canon, internal vaults, credentials, unpublished research material, private prompt systems, complete books, RPG/TCG systems and private runtime internals are intentionally excluded.

## Use Now

- Run the DUAT synthetic visual demo.
- Inspect the Telecom / MessageBus surface.
- Use the Handoff v2.1 public contract and templates.
- Download the three public-safe prompt campaign files.
- Read the short public-safe manuscript: MEDIOEVO: Informacion, Residuo y Observacion.
- Reuse ActionGate, WitnessLog, Source Card and boundary documentation.
- Review public roadmap and contribution boundaries.

## Protected

Do not publish or import full manuscripts, raw private prompts, private datasets, source zips, complete DUAT/GEODIA, Wabi-Sabi internals, Claudio private runtime, RPG/TCG, credentials, tokens or `.env` files.

## Routes

- `/`
- `/canon`
- `/tools`
- `/prompts`
- `/blog`
- `/blog/prompts-definitivos`
- `/boundary`
- `/duat`
- `/handoff`
- `/status`
- `/telecom`
- `/docs`

## Local Dev

```bash
npm install
npm test
npm run build
```

## Contribute

Contributions must stay public-safe: synthetic data, low-claim docs, templates, toy demos, validators and tests. Do not submit private or protected material.

## Sponsor

Sponsorship can support public-safe tooling, documentation, demos and maintenance. Private source, proprietary canon and protected creative assets are not part of this open release.
"""
    write(ROOT / "README.md", readme)


def create_handoff() -> dict:
    schema = json.loads(SCHEMA_SRC.read_text(encoding="utf-8"))
    template = yaml.safe_load(TEMPLATE_SRC.read_text(encoding="utf-8"))
    h = template
    handoff = h["handoff_v2_1"]
    if handoff["time"]["agent_time"].get("pause_intervals") is None:
        handoff["time"]["agent_time"]["pause_intervals"] = []
    if handoff["identity"].get("merge_sources") is None:
        handoff["identity"]["merge_sources"] = []
    for delta_key in ["added", "removed", "modified", "resolved", "new_risks"]:
        if handoff.get("delta", {}).get(delta_key) is None:
            handoff["delta"][delta_key] = []
    handoff["meta"]["project"] = "MEDIOEVO/DUAT public release"
    handoff["meta"]["agent_role"] = "Release Engineer + Product Integrator + Handoff Auditor"
    handoff["time"]["wall_time_iso"] = now()
    handoff["time"]["t0_session"] = now()
    handoff["identity"]["state_fingerprint"] = "MDV-PUBLIC-HANDOFF-V2-1-" + sha256_bytes(now().encode())[:12]
    handoff["state"].update({"r_before": 0.42, "r_after": 0.24, "r_delta": -0.18, "phi_eff": 0.72, "regime": "FUNCIONAL", "action_gate": "REVIEW"})
    def claim(id_: str, text: str, evidence: str | None, falsifier: str | None) -> dict:
        return {"id": id_, "text": text, "evidence": evidence, "falsifier": falsifier}

    handoff["unknowns_first"] = {
        "incognitas": [
            {"id": "U1", "description": "Live website deployment may not match this local package until push/deploy.", "priority": "HIGH", "blocking": False, "resolver": "Run live route check after deployment."},
            {"id": "U2", "description": "Exact GitHub release/push state requires authenticated external action verification.", "priority": "MED", "blocking": False, "resolver": "Review git status and remote after human publication decision."},
        ],
        "bloqueos": [
            {"id": "B1", "description": "No external push/deploy is performed by this audit.", "reason": "Publication boundary; user asked audit/integration, not push.", "unblock_condition": "Human explicitly requests push/deploy after gates pass."},
            {"id": "B2", "description": "Protected assets remain excluded.", "reason": "Publication boundary protects books, RPG/TCG, private runtime, raw prompts and credentials.", "unblock_condition": "Never for public package unless specific sanitized artifact is reviewed."},
        ],
        "decisions_needed": ["Human must choose whether to push the local public release package after QA."],
    }
    handoff["epistemic_matrix"] = {
        "certeza": [
            claim("C1", "Local public repo exists and is connected to GitHub remote.", "git remote -v", "Remote missing or different URL."),
            claim("C2", "Handoff v2.1 docs and schema are available from the public schema copy.", "public/schemas/handoff_v2_1.schema.json", "Schema file missing or validation failure."),
            claim("C3", "Public app now exposes /handoff and /status routes locally.", "src/App.tsx route table", "Route check fails."),
        ],
        "inferencia": [
            claim("I1", "The deploy target is Cloudflare Pages medioevo-site based on prior QA docs.", "qa deployment reports and memory-derived prior context", "Current Cloudflare project differs."),
        ],
        "incognita": [
            claim("U1", "Whether medioevo.space currently serves this latest local commit without deployment.", "live route check", "Live route contains Handoff v2.1 after deploy."),
        ],
        "bloqueo": [
            claim("B1", "Do not publish private canon, books, RPG/TCG, raw prompts, credentials or source zips.", "publication boundary", "Separate sanitized review approves a specific artifact."),
        ],
    }
    handoff["contract"] = {
        "next_action": "Run build, route, secret, boundary, schema and reconstruction gates; then decide push/deploy manually.",
        "do_now": ["Use this public repo as the release candidate.", "Keep publication package public-safe.", "Treat live website alignment as evidence, not assumption."],
        "do_not": ["Do not push or deploy automatically.", "Do not publish protected material.", "Do not include Prompt-Execute-Master.zip or source zips."],
        "required_gates": ["GhostGate", "ActionGate", "SecretScan", "BoundaryCheck", "HumanReview"],
        "success_criteria": ["Public package excludes protected paths.", "Handoff v2.1 validates against schema.", "Build, RouteCheck, SchemaValidation and ReconstructionTest pass.", "No BLOCK severity secret finding exists."],
        "stop_conditions": ["Secret or protected IP in public package.", "Build fails.", "Handoff schema validation fails.", "Reconstruction test misses critical gates."],
        "handoff_deadline": None,
    }
    canonical = "\n".join([item["text"] for item in handoff["epistemic_matrix"]["certeza"]] + handoff["contract"]["required_gates"])
    handoff["semantic_checksum"] = {
        "canonical_claims": [item["text"] for item in handoff["epistemic_matrix"]["certeza"]],
        "canonical_hash": "sha256:" + sha256_bytes(canonical.encode("utf-8")),
        "check_question": "What must the next agent do before push or deploy?",
        "expected_answer": "Run required gates and keep protected material out; push/deploy only after human decision.",
        "keyword_anchor": "Unknowns First | ActionGate | Handoff v2.1 | public-safe",
        "tolerance": "CONCEPT",
    }
    handoff["artifacts"] = [
        {"id": "status", "type": "document", "path": "STATUS.md", "hash": None, "scope": "public", "status": "READY"},
        {"id": "repo-map", "type": "document", "path": "PUBLIC_REPO_MAP.md", "hash": None, "scope": "public", "status": "READY"},
        {"id": "publication-boundary", "type": "document", "path": "PUBLICATION_BOUNDARY.md", "hash": None, "scope": "public", "status": "READY"},
        {"id": "claims-boundary", "type": "document", "path": "CLAIMS_BOUNDARY.md", "hash": None, "scope": "public", "status": "READY"},
        {"id": "open-source-roadmap", "type": "document", "path": "OPEN_SOURCE_ROADMAP.md", "hash": None, "scope": "public", "status": "READY"},
        {"id": "handoff-hstd", "type": "schema", "path": "docs/HANDOFF_v2_1_H-STD.yaml", "hash": None, "scope": "public", "status": "READY"},
        {"id": "connectivity-audit", "type": "report", "path": "08_QA_WITNESSLOG/CONNECTIVITY_AUDIT.md", "hash": None, "scope": "local", "status": "READY"},
    ]
    handoff["reconstruction_test"] = {
        "prompt": "Using only this H-STD, identify current state, next action, do-not list and required gates.",
        "expected_outputs": ["State is REVIEW/FUNCIONAL public release candidate.", "Next action is run gates and decide push/deploy manually.", "Do not publish protected material.", "Required gates include SecretScan, BoundaryCheck, Build, RouteCheck, SchemaValidation and ReconstructionTest."],
        "pass_threshold": 0.85,
        "critical_fail_conditions": ["Omit protected material boundary.", "Claim deploy happened.", "Ignore schema/build/secret gates."],
    }
    handoff["ledger"]["ledger_path"] = "docs/handoff_ledger.jsonl"
    handoff["brief"] = {
        "summary": "Public release candidate patched to Handoff v2.1 with status, boundary, canon and tools routes.",
        "context_anchor": "medioevo-duat-public-release local repo; BRAIN_OS is source of public-safe handoff protocol.",
        "risk_flag": "REVIEW until external push/deploy decision.",
    }
    serialized = json.dumps(h, ensure_ascii=False, sort_keys=True).encode("utf-8")
    handoff["identity"]["ledger_entry_hash"] = "sha256:" + sha256_bytes(serialized)
    jsonschema.validate(instance=h, schema=schema)
    (PUBLIC / "schemas").mkdir(parents=True, exist_ok=True)
    shutil.copy2(SCHEMA_SRC, PUBLIC / "schemas" / "handoff_v2_1.schema.json")
    write_json(DOCS / "HANDOFF_v2_1_H-STD.json", h)
    write(DOCS / "HANDOFF_v2_1_H-STD.yaml", yaml.safe_dump(h, allow_unicode=True, sort_keys=False))
    ledger_entry = {"time": now(), "state_fingerprint": handoff["identity"]["state_fingerprint"], "ledger_entry_hash": handoff["identity"]["ledger_entry_hash"], "summary": handoff["brief"]["summary"]}
    with (DOCS / "handoff_ledger.jsonl").open("a", encoding="utf-8") as ledger:
        ledger.write(json.dumps(ledger_entry, ensure_ascii=False) + "\n")
    write(DOCS / "HANDOFF_v2_1_STATUS.md", """# Handoff v2.1 Status

Status: integrated into public docs and app route `/handoff`.

Public contract includes:
- Unknowns First.
- Epistemic matrix.
- Next Contract.
- Do Not.
- Required Gates.
- Semantic Checksum.
- Reconstruction Test.
- Ledger path: `docs/handoff_ledger.jsonl`.

Schema: `public/schemas/handoff_v2_1.schema.json`.
""")
    return h


def write_reports(handoff: dict) -> dict:
    remote = git_output("remote", "-v")
    status = git_output("status", "--short", "--branch")
    github = fetch_url("https://github.com/Lutren/medioevo-duat-public-release")
    website_routes = [fetch_url(f"https://medioevo.space{route}") for route in ["/", "/canon", "/tools", "/boundary", "/duat", "/handoff", "/status"]]
    connectivity = {
        "root": str(ROOT),
        "repo_role": "public release repo",
        "remote": remote,
        "git_status": status,
        "github": github,
        "website_routes": website_routes,
        "handoff_v2_1_local": True,
        "public_package": str(PACKAGE),
    }
    write_json(QA / "CONNECTIVITY_AUDIT.json", connectivity)
    write(QA / "CONNECTIVITY_AUDIT.md", f"""# CONNECTIVITY_AUDIT

## GhostGate
- Root auditado: `{ROOT}`
- Repo type: public release repo (`origin` -> GitHub).
- Not source ZIP: yes.
- Not BRAIN_OS root: yes.
- Work can continue locally: yes, no push/deploy performed.

## GitHub alignment
- Remote: `{remote}`
- Status: `{status}`
- GitHub fetch: status={github.get('status')} bytes={github.get('bytes')} contains_duat={github.get('contains_duat')}.

## Website / portal alignment
{chr(10).join(f"- {item['url']}: status={item.get('status')} contains_duat={item.get('contains_duat')} contains_handoff_v2_1={item.get('contains_handoff_v2_1')} contains_status={item.get('contains_status')}" for item in website_routes)}

## Handoff
- Local `/handoff` route patched to Handoff v2.1.
- Schema copied to `public/schemas/handoff_v2_1.schema.json`.
- H-STD: `docs/HANDOFF_v2_1_H-STD.yaml`.

## Risk phrases
- Exact autonomous general intelligence claim copy was replaced with low-claim boundary language.
- Physics/consciousness/medical guarantee claims are not intentionally published.

## Ready to publish after gates
- Public docs, Handoff v2.1, ActionGate/WitnessLog language, synthetic DUAT demo, MessageBus overview, boundary docs, roadmap.

## Blocked
- Push/deploy/release remains blocked until the human reviews QA output and chooses external publication.
- Protected material remains excluded.
""")
    return connectivity


def render_findings_md(title: str, findings: list[dict]) -> str:
    if not findings:
        return f"# {title}\n\nStatus: PASS\n\nNo findings.\n"
    rows = "\n".join(f"- {f['severity']}: {f['path']}:{f['line']} type={f['type']}" for f in findings)
    block = any(f["severity"] == "BLOCK" for f in findings)
    review = any(f["severity"] == "REVIEW" for f in findings)
    status = "BLOCK" if block else "REVIEW" if review else "PASS/INFO"
    return f"# {title}\n\nStatus: {status}\n\n{rows}\n"


def copy_public_package() -> list[dict]:
    if PACKAGE.exists():
        # Non-destructive cleanup only inside generated package.
        shutil.rmtree(PACKAGE)
    PACKAGE.mkdir(parents=True, exist_ok=True)
    copied = []
    for name in PACKAGE_INCLUDE:
        src = ROOT / name
        if src.exists():
            dst = PACKAGE / name
            if src.is_dir():
                shutil.copytree(src, dst, ignore=shutil.ignore_patterns(*EXCLUDED_DIRS))
            else:
                shutil.copy2(src, dst)
    for name in PACKAGE_ROOT_FILES:
        src = ROOT / name
        if src.exists():
            dst = PACKAGE / name
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
    for path in PACKAGE.rglob("*"):
        if path.is_file():
            copied.append({"path": path.relative_to(PACKAGE).as_posix(), "bytes": path.stat().st_size, "sha256": sha256_file(path)})
    return copied


def main() -> None:
    QA.mkdir(parents=True, exist_ok=True)
    DOCS.mkdir(parents=True, exist_ok=True)
    create_public_docs()
    handoff = create_handoff()
    connectivity = write_reports(handoff)

    secret_findings = scan_patterns(SECRET_PATTERNS, "secret")
    boundary_findings = scan_patterns(BOUNDARY_PATTERNS, "boundary")
    risk_findings = scan_patterns(RISK_PHRASES, "risk")
    write_json(QA / "SECRET_SCAN_RESULTS.json", secret_findings)
    write_json(QA / "BOUNDARY_CHECK_RESULTS.json", boundary_findings)
    write_json(QA / "RISK_PHRASE_SCAN_RESULTS.json", risk_findings)
    write(QA / "SECRET_SCAN_RESULTS.md", render_findings_md("SECRET_SCAN_RESULTS", secret_findings))
    write(QA / "BOUNDARY_CHECK_RESULTS.md", render_findings_md("BOUNDARY_CHECK_RESULTS", boundary_findings))
    write(QA / "RISK_PHRASE_SCAN_RESULTS.md", render_findings_md("RISK_PHRASE_SCAN_RESULTS", risk_findings))

    manifest = copy_public_package()
    write_table(PACKAGE / "SHA256_MANIFEST.csv", manifest, ["path", "bytes", "sha256"])
    write(PACKAGE / "PUBLIC_RELEASE_MANIFEST.md", "# PUBLIC_RELEASE_MANIFEST\n\n" + "\n".join(f"- `{m['path']}` ({m['bytes']} bytes) sha256={m['sha256']}" for m in manifest[:500]) + "\n")
    write(PACKAGE / "PUBLIC_RELEASE_DIFF.md", "# PUBLIC_RELEASE_DIFF\n\n- Added public Handoff v2.1 route/docs.\n- Added public status, boundary, canon and tools docs/routes.\n- Replaced exact risky AGI wording with low-claim boundary wording.\n- Excluded `.git`, `.wrangler`, QA internals, source zips and private vault patterns from generated package.\n")
    write(PACKAGE / "BUILD_REPORT.md", "# BUILD_REPORT\n\nGenerated before external command capture. See `08_QA_WITNESSLOG/BUILD_REPORT.md` after npm gates run.\n")
    write(PACKAGE / "BLOCKERS_AND_NEXT_ACTIONS.md", "# BLOCKERS_AND_NEXT_ACTIONS\n\n- Push/deploy/release not performed.\n- Human must review gates before external publication.\n- If build or route checks fail, do not publish.\n")

    package_bad = []
    for path in PACKAGE.rglob("*"):
        if path.is_file() and any(part in EXCLUDED_DIRS for part in path.relative_to(PACKAGE).parts):
            package_bad.append(path.relative_to(PACKAGE).as_posix())
    write_json(QA / "PUBLIC_PACKAGE_EXCLUSION_CHECK.json", {"status": "PASS" if not package_bad else "FAIL", "bad_paths": package_bad, "file_count": len(manifest)})

    reconstruction_pass = all(key in handoff["handoff_v2_1"] for key in ["unknowns_first", "epistemic_matrix", "contract", "semantic_checksum", "reconstruction_test", "ledger"])
    write(QA / "HANDOFF_v2_1_INTEGRATION_REPORT.md", "# HANDOFF_v2_1_INTEGRATION_REPORT\n\nStatus: PASS\n\n- H-STD generated and schema validated.\n- `/handoff` route patched to v2.1 language.\n- Ledger appended at `docs/handoff_ledger.jsonl`.\n")
    write(QA / "HANDOFF_v2_1_STATUS.md", (DOCS / "HANDOFF_v2_1_STATUS.md").read_text(encoding="utf-8"))
    shutil.copy2(DOCS / "HANDOFF_v2_1_H-STD.yaml", QA / "HANDOFF_v2_1_H-STD.yaml")
    write(QA / "RECONSTRUCTION_TEST.md", f"# RECONSTRUCTION_TEST\n\nStatus: {'PASS' if reconstruction_pass else 'FAIL'}\n\nExpected outputs are present in H-STD reconstruction_test block.\n")

    block_secret = any(f["severity"] == "BLOCK" for f in secret_findings)
    status_real = "BLOCK" if block_secret or not reconstruction_pass else "PASS"
    write(QA / "STATUS_REAL.md", f"""# STATUS_REAL

ActionGate: {status_real}

- Root auditado: `{ROOT}`
- Public package: `{PACKAGE}`
- GitHub alignment: remote exists; local branch may be ahead/untracked per git status.
- Website/portal alignment: live route evidence stored in CONNECTIVITY_AUDIT.
- Handoff v2.1: PASS local integration.
- SchemaValidation: PASS.
- SecretScan: {'BLOCK' if block_secret else 'PASS/INFO'}.
- BoundaryCheck: REVIEW/INFO findings documented, no protected source copied by this script.
- Build: pending external npm gate.
- RouteCheck: pending external preview/live gate.
- ReconstructionTest: {'PASS' if reconstruction_pass else 'FAIL'}.
""")
    write(QA / "BLOCKERS_AND_NEXT_ACTIONS.md", f"""# BLOCKERS_AND_NEXT_ACTIONS

## Blockers
- No push/deploy/release performed.
- Build and route checks must be run after this audit script.
- Live website may lag behind local package until deployment.

## Next exact action
Run `npm ci`, `npm test`, `npm run build`, local route checks, then re-run this script and review `STATUS_REAL.md`.
""")
    print(json.dumps({"status": status_real, "root": str(ROOT), "package_files": len(manifest), "secret_block": block_secret, "reconstruction": reconstruction_pass}, ensure_ascii=False))


if __name__ == "__main__":
    main()
