---
title: "Module 9: DNS"
description: Record types, the resolution path, caching and TTL, and the failures that look like everything else.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

## In This Module

- The resolution path from stub resolver to authoritative server
- Recursive versus authoritative, and which one you are talking to
- Record types you will actually use, A, AAAA, CNAME, MX, TXT, SRV, PTR
- Caching, TTL, and why a change did not take effect yet
- Split horizon, and why a name resolves differently inside and outside
- Reading `dig` and `nslookup` output

## Planned Coverage

- Follow one lookup all the way from the client to the root, then to TLD, then to authoritative
- Make the negative cache explicit, since it explains a lot of confusing delays
- CNAME rules and the common mistakes people make with them
- Frame DNS as the most frequent root cause of problems that get reported as something else

:::tip[Optional Lab]
Run a resolver on the Linux VM, point the Windows VM at it, and watch queries arrive as you browse. Change a TTL and observe the caching behavior.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
