# Wabi MCP Bridge Public-Safe Architecture

The Wabi MCP Bridge is planned as a local-first bridge that exposes safe tools to compatible agents.

It keeps Wabi as the local runtime and Claudio as the gatekeeper.

## Modes

1. **Read-only**
   - Mission Control.
   - Agent state.
   - Chat search summaries.
   - Workpack and scheduler status.
   - BrowserBridge status.
   - Provider and evidence status.

2. **Prepare-only**
   - TaskSpec drafts.
   - Workpack drafts.
   - Handoff drafts.
   - Message-to-task conversion.

3. **Gated-write**
   - Future local sandbox/docs tasks only.
   - Requires TaskSpec, GhostGate, rollback and WitnessLog.

## Exclusions

No tool is planned for public execution, private workspace upload, credential handling, direct delete, publication, push, deploy, protected source access or internal chat publication.

