---
title: "Module 7: Transport, Ports, and Sockets"
description: TCP versus UDP, the handshake, connection states, ports and sockets, and MTU.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

Everything up to now moved data between machines. This module is about getting it to the right program on that machine, reliably or quickly, depending on what you need.

## In This Module

- What a port identifies, and what makes up a socket
- TCP, the three-way handshake, sequencing, retransmission, and teardown
- UDP, and when giving up reliability is the right trade
- Reading connection states with `netstat` and `ss`
- MTU, fragmentation, and the failures they cause
- Well known, registered, and ephemeral port ranges

## Planned Coverage

- Define the socket as the four-tuple, which explains how one server port serves thousands of clients at once
- Handshake walked through in a capture, then a teardown, then a refused connection so the reader sees RST
- TIME_WAIT and CLOSE_WAIT explained, because both show up in real incidents and confuse people
- UDP use cases, DNS, DHCP, VoIP, QUIC, and the point that reliability moved up a layer rather than disappearing
- MTU and path MTU discovery, the classic symptom of small requests working while large ones hang

:::tip[Optional Lab]
Run a listener on the Linux VM, connect from the Windows VM, and watch the handshake and connection states from both ends.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
