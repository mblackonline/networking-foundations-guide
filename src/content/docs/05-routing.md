---
title: "Module 5: Routing"
description: Reading a routing table, longest prefix match, next hop, and the default route.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

Routing is how traffic leaves your subnet and reaches everything else. The mechanics are simpler than the reputation suggests.

## In This Module

- Reading the routing table on your own machine
- Next hop, interface, and metric
- Longest prefix match, the rule that decides which route wins
- The default route and what 0.0.0.0/0 means
- Static versus dynamic routing at a concept level
- Following a path with traceroute

## Planned Coverage

- Start with the reader's real routing table, `route print` on Windows and `ip route` on Linux, and annotate every column
- Longest prefix match with a table containing overlapping routes, walk one destination through it
- Default route as the catch-all, and what happens when there is not one
- Dynamic routing protocols named and placed in context only, enough to know what OSPF and BGP are for without configuring either
- Traceroute mechanics, TTL expiry, and why some hops show as timeouts without meaning failure

:::tip[Optional Lab]
Give the Linux VM a second network, enable IP forwarding, and route the Windows VM through it. Watch the traffic path change in traceroute.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
