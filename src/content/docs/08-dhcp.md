---
title: "Module 8: DHCP"
description: How hosts get their addresses automatically, and what breaks when they do not.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

## In This Module

- The DORA exchange, discover, offer, request, acknowledge
- Leases, renewal, and what expiry looks like
- Options beyond the address, gateway, DNS servers, domain name
- Reservations versus static addressing
- Recognizing an APIPA address and what it tells you

## Planned Coverage

- Walk DORA as a capture, since it is broadcast and easy to observe
- Emphasize that DHCP delivers more than an address, which is why a bad DHCP option breaks DNS
- The 169.254 address as a diagnostic signal, not a random failure
- Release and renew commands on each platform

:::tip[Optional Lab]
Run a DHCP server on the Linux VM and let the Windows VM lease from it. Change an option, renew, and observe the change on the client.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
