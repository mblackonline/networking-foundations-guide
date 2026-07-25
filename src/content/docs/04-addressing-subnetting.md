---
title: "Module 4: IPv4 Addressing and Subnetting"
description: CIDR, subnet masks, network and broadcast addresses, private ranges, and the default gateway.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

This is the module people most often skip and most often regret skipping. Subnetting is the skill that separates someone who can read a network diagram from someone who cannot.

## In This Module

- The structure of an IPv4 address and what the subnet mask does
- CIDR notation and how to convert between mask and prefix length
- Network address, broadcast address, and usable host range
- Private address ranges from RFC 1918 and why they exist
- The default gateway, and how a host decides local versus remote

## Planned Coverage

- Build the mask concept in binary once, carefully, then give the reader shortcuts they can use without binary afterward
- Worked examples at /24, /25, /26, and /16, showing host counts and boundaries
- The host's decision process, compare destination against my own network, if local then ARP, if remote then send to the gateway
- Private ranges and why the same 192.168.1.0/24 exists in millions of homes, which sets up NAT in module 6
- Common failure mode, two hosts with the same address but different masks, and what that looks like from each side

:::tip[Optional Lab]
Change the Windows VM's subnet mask to a wrong value and observe exactly which connections break and which still work. This is the fastest way to understand what the mask does.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
