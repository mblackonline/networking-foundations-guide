---
title: Networking Foundations
description: A beginner-friendly, vendor-agnostic networking guide for information technology support, system administration, DevOps, software development, and cybersecurity.
template: splash
hero:
  tagline: Learn the networking concepts behind common systems you may build, support, or troubleshoot. No vendor certifications or prior networking experience required.
  actions:
    - text: Start the Guide
      link: /01-layers/
      icon: right-arrow
      variant: primary
    - text: View Source on GitHub
      link: https://github.com/mblackonline/networking-foundations-guide
      variant: secondary
---

:::note[Work in Progress]
This guide is still a work in progress. I will continue reviewing and updating it as time permits.
:::

## About This Guide

As I gain experience working in information technology (IT), I continue to see how often networking fundamentals matter in day-to-day technical work. I created this guide to reinforce my own understanding and share what I have learned with others.

Artificial intelligence (AI) tools assisted with research, drafting, editing, and review. I reviewed and revised the material, but errors or oversimplifications may remain. The Further Learning sections link to official documentation and other public resources for deeper study. Corrections and suggestions are welcome through [GitHub Issues](https://github.com/mblackonline/networking-foundations-guide/issues).

The guide is intended for people exploring IT support, system administration, DevOps, software development, cybersecurity, and related technical roles. It assumes only basic familiarity with using a computer and installing software.

## Core Learning Path

The core path explains the concepts needed to follow and troubleshoot a typical connection. Read Modules 1 through 11 in order, then complete Module 13.

| Stage | Modules | First-reading focus |
| --- | --- | --- |
| Organize the network | [1: Layers](/01-layers/), [2: Toolkit](/02-toolkit-and-lab/) | Relate protocols to layers and recognize the purpose of common tools |
| Move between devices and networks | [3: Local Network](/03-local-network/), [4: IPv4 Addressing](/04-addressing-subnetting/), [5: Routing](/05-routing/), [6: NAT](/06-nat/) | Local delivery, local-versus-remote decisions, routes, gateways, and translation |
| Reach the correct service | [7: Transport](/07-transport/), [8: DHCP](/08-dhcp/), [9: DNS](/09-dns/) | Ports, connections, automatic configuration, and name resolution |
| Interpret application and security results | [10: HTTP and TLS](/10-http-tls/), [11: Firewalls](/11-filtering/) | Web responses, certificate checks, and filtering behavior |
| Apply the method | [13: Troubleshooting](/13-troubleshooting/) | Test one stage at a time and record what each result proves |

Each page labels material that can be skipped during a first reading. [Module 12: Proxies and Load Balancers](/12-proxies-load-balancers/) is an optional, role-specific extension for systems administration, cloud, DevOps, and software work.

## What This Guide Covers

- A high-level overview of common networking concepts rather than every topic or advanced detail
- Vendor-agnostic concepts and standard protocols used across physical, virtual, and cloud environments
- Examples based on wired and Wi-Fi networks; mobile networks are outside the current scope

## How the Hands-On Parts Work

Commands are generally shown for Windows, with Linux or macOS equivalents included when practical. Exercises marked **Optional Lab** use a Windows Virtual Machine (WINCLIENT) and a Linux Virtual Machine (LINUXBOX) on the isolated VirtualBox network `NETLAB`.

You can complete the conceptual path without the lab. When you want hands-on practice, follow [Building the Optional NETLAB](/appendix/building-netlab/).

## Source and Reuse

The source files for this guide are available on [GitHub](https://github.com/mblackonline/networking-foundations-guide) under the [MIT License](https://github.com/mblackonline/networking-foundations-guide/blob/main/LICENSE). You are welcome to fork the repository and adapt or expand it for your own use.
