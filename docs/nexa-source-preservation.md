# Nexa Agenda source preservation

Recorded on 2026-10-13.

This branch preserves the local Nexa Agenda source previously used for the
0.0.3 release. It is based on origin/main at
8c5fce2dce96ea8b2484ecb17b8da93b51407c1c and includes the local team management,
team event creation, branding, translations and Docker build adjustments.

Previously published image: nexadigi/cal-diy:0.0.3
Digest: sha256:ec2fdd09fd4da9a29f5338ba13a97e31248f70eb2b8258c80c62f0928ef6ecaf

The image publication was verified earlier in this task history. This source
snapshot has not been rebuilt to prove byte-for-byte reproducibility of that
image, and the current VPS deployment has not been inspected on this date.

Validation on preservation:

- The source was compared against the fetched GitHub main branch.
- Private .env files and gh.env are excluded from the published tree.
- Type checking was attempted, but Yarn reported missing node_modules state.
  Dependencies had been removed during the approved local cleanup.
- Existing whitespace warnings in getReplyToHeader.ts and its test were retained.

This is an archive branch, not a new validated release. Run dependency
installation, lint, type checks and relevant tests before integrating changes
into main or building a new release.

The accompanying Swarm template uses environment variable placeholders.
Deployment requires separately stored database, authentication, SMTP and Google
OAuth credentials. Those credentials, database volumes and production backups
are not included in Git. Preserve them before deleting the local workspace.
