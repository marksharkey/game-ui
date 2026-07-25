# Deployment

This repository is a versioned package, not a standalone web service.

Changes are deployed by publishing a tagged Git release and updating the consuming game repositories. Do not copy source files directly into production. Each game must install the tagged package, pass its tests/build, and be deployed through that game's normal procedure.

The package has no database, server process, or production migration.
