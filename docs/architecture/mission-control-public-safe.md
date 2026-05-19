# Mission Control Public-Safe Architecture

Mission Control is a local read-only aggregate surface for Wabi/Claudio operations.

Public-safe description:

- It shows operational state and evidence.
- It separates status from execution.
- It keeps private runtime and internal coordination local.
- It supports handoff and QA discipline.

Mission Control does not:

- execute workpacks;
- mutate scheduler state;
- publish or deploy;
- expose internal chat messages;
- expose local paths or credentials.

The public Hub may describe this architecture. The local Hub remains the actionable environment.

