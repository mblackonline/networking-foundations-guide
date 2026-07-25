---
title: "Module 3: The Local Network"
description: Ethernet frames, MAC addresses, switching, ARP, and broadcast domains.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

Before a packet can go anywhere, it has to get off your machine and onto the wire. This module covers what happens inside your own network segment.

## In This Module

- Ethernet frames and what a MAC address actually identifies
- How a switch learns where devices are
- ARP, and why every IP conversation starts with a layer 2 question
- Broadcast domains, and a conceptual look at VLANs
- Watching ARP happen in a packet capture

## Planned Coverage

- Distinguish the MAC address, which is local and never leaves the segment, from the IP address, which is end to end
- Switch MAC address table, learning by source address, flooding when unknown
- ARP request and reply walkthrough, then view the local ARP cache
- Broadcast domain as the boundary ARP cannot cross, which sets up the need for routing in module 5
- VLANs introduced conceptually only, as logical separation on shared hardware, no vendor configuration

:::tip[Optional Lab]
Ping between the two lab VMs, then inspect each machine's ARP cache to see the other's MAC address appear. Clear the cache and capture the exchange in Wireshark.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
