---
title: "Module 10: HTTP and TLS"
description: Request and response structure, status codes, the TLS handshake, and certificate trust.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

## In This Module

- HTTP request and response anatomy, methods, headers, body
- Status codes grouped by what they tell you to do next
- Why TLS exists, and what it does and does not protect
- The TLS handshake, and where certificates fit
- Chains of trust, certificate authorities, and expiry
- SNI, and why one IP can serve many sites

## Planned Coverage

- Use `curl` with verbose output as the main teaching tool, since it shows the whole exchange in text
- Status codes taught as categories first, then the specific ones worth memorizing
- Certificate validation broken into its checks, name match, validity dates, chain to a trusted root
- Cover the errors people actually hit, expired certificate, name mismatch, incomplete chain, untrusted internal CA
- Note that TLS hides content but not destination, which matters for both privacy and troubleshooting

:::tip[Optional Lab]
Serve a page from the Linux VM over plain HTTP, then add a self-signed certificate. Watch the Windows VM reject it, then trust it deliberately and see the difference.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
