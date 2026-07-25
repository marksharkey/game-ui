# PrecisionPros Game UI

Shared React components and styles used by the PrecisionPros game frontends.

## Purpose

Keep game branding, status pages, buttons, and responsive layout consistent. Game-specific behavior stays in each game repository; reusable presentation and routines belong here.

## Release procedure

1. Run the package tests/build checks in each consuming game.
2. Commit and push the shared change.
3. Create and push a version tag such as `v0.3.0`.
4. Update each consumer's package dependency and lockfile.
5. Build and deploy each affected game.
