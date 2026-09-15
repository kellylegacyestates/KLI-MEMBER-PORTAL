@AGENTS.md

# Claude Repository Instructions

Claude must follow all requirements in `AGENTS.md`.

Before implementation:

1. Read the current controlled work instruction.
2. Confirm the starting commit.
3. Confirm the active branch.
4. Inspect existing implementation before writing code.
5. Identify the exact authorized files.
6. Do not infer obsolete architecture from repository history.

During implementation:

- remain within scope
- preserve fail-closed security behavior
- preserve institutional domain distinctions
- do not introduce hidden persistence or schema changes
- do not modify `main` directly
- do not deploy to production unless explicitly authorized
- do not merge pull requests
- do not convert LDIE output into authoritative institutional determinations

Before completion, run:

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
```

Final response must identify:

```text
starting commit
ending commit
branch
files created
files modified
files deleted
tests added or changed
test result
lint result
build result
diff-check result
known defects
scope deviations
conformity determination
```

If implementation conflicts with institutional documentation, stop and report the conflict instead of redefining the architecture.
