# Offline Assets Reference

This document describes how to consume Figma-derived assets without calling MCP tools.

## Source Of Truth

- Manifest: `docs/ia/figma/assets-manifest.json`
- Public files: `public/figma-assets/raw`
- Public URL prefix: `/figma-assets/raw`

## What The Manifest Provides

Each asset entry includes:

- `nodeId`: original Figma node id.
- `imageRef`: original Figma imageRef.
- `styleRef`: style token used in Figma (for example `fill_XJ1M1B`).
- `fileName`: local resolved file name.
- `relativePath`: URL-safe path to be used by frontend components.
- `dimensions`: PNG width and height.
- `needsCropping` and `cropTransform`: crop metadata from Figma.
- `exists`: whether the local file is present.

## Recommended Workflow

1. Resolve the asset by `styleRef` first.
2. Fallback to `nodeId` when style is ambiguous.
3. Use `relativePath` directly in `img`, `Image`, CSS backgrounds, or mocks.
4. Use `dimensions` for placeholder sizing and consistent layout.
5. Only use MCP download when the needed asset is missing from the manifest.
