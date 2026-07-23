# Manifest cache

Cached `CHATWRIGHT.md` front-matter snapshots for registered repositories,
one snapshot per `id@version`, refreshed by the scheduled liveness check
described in [`../README.md`](../README.md#liveness).

This directory is a **cache, never the source of truth**. The source of
truth for any repository's manifest is always the `CHATWRIGHT.md` file in
that repository, at the git tag matching its declared `version`. A snapshot
here exists only so a deleted, renamed, or force-pushed upstream repository
doesn't silently break every badge and demo that points at it elsewhere on
the web — the same lesson the Go module proxy learned: an immutable cache
survives origin death (see
[decision 0013](https://github.com/chatwright/chatwright/blob/main/spec/decisions/0013-chatwright-md-federation.md)).

Empty until the first repository registers in
[`../registry.json`](../registry.json) and its manifest is cached for the
first time.
