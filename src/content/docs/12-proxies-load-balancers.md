---
title: "Module 12: Proxies and Load Balancers"
description: Forward proxies, reverse proxies, layer 4 versus layer 7 balancing, and health checks.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

## In This Module

- Forward proxy versus reverse proxy, and who each one serves
- What a reverse proxy adds, TLS termination, routing, caching, and a single entry point
- Layer 4 versus layer 7 load balancing
- Health checks and how traffic is withdrawn from a failing backend
- Session persistence and when it is needed
- What the client's real IP looks like after passing through a proxy

## Planned Coverage

- Anchor with the shape the reader will meet in real work, one public name in front of several backends
- Layer 4 versus layer 7 explained by what the balancer is allowed to see and act on
- Health check behavior, including the failure mode where every backend is marked unhealthy at once
- X-Forwarded-For and why server logs stop showing real client addresses, connecting back to NAT in module 6

:::tip[Optional Lab]
Put a reverse proxy on the Linux VM in front of two simple backend services. Take one backend down and watch the health check remove it.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
