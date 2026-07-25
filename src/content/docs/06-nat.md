---
title: "Module 6: NAT"
description: Network address translation, port forwarding, and why inbound is the hard direction.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

NAT explains the shape of nearly every network you will work in, from a home router to a cloud VPC to the container runtime on your laptop.

## In This Module

- Why NAT exists and what problem it solved
- Source NAT and port address translation
- The translation table, and how replies find their way back
- Port forwarding and destination NAT
- Why inbound connections are the hard direction
- How NAT complicates troubleshooting and logging

## Planned Coverage

- Connect back to module 4, private addresses cannot be routed on the internet, so something has to translate
- Walk one outbound connection through the translation table and back
- Make the asymmetry explicit, outbound creates state automatically, inbound requires configuration
- Practical consequences, source IPs in server logs, double NAT, CGNAT, and why "it works from outside but not inside" happens
- Name where the reader will meet this again, cloud NAT gateways, Docker bridge networks, VPN concentrators

:::tip[Optional Lab]
Make the Linux VM a NAT gateway for the Windows VM, then inspect the translation table while a connection is open.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
