---
title: Networking Foundations
description: A free, vendor-agnostic guide to networking fundamentals, practical troubleshooting, and optional hands-on labs.
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

The guide is intended for people exploring IT support, system administration, DevOps, software development, cybersecurity, and related technical roles. It assumes only basic familiarity with using a computer and installing software.

## Core Learning Path

The core path builds the knowledge needed to understand and troubleshoot a typical network connection. Read Modules 1 through 12 in order, then apply what you learned in Module 14.

| Stage | Modules | First-reading focus |
| --- | --- | --- |
| Learn the layers and tools | [1: Layers](/01-layers/), [2: Toolkit](/02-toolkit-and-lab/) | Relate protocols to layers and recognize the purpose of common tools |
| Move between devices and networks | [3: Local Network](/03-local-network/), [4: IPv4 Addressing](/04-addressing-subnetting/), [5: IPv4 Subnetting](/05-subnetting/), [6: Routing](/06-routing/), [7: NAT](/07-nat/) | Local delivery, address boundaries, local-versus-remote decisions, routes, gateways, and translation |
| Configure the client and reach services | [8: Transport](/08-transport/), [9: DHCP](/09-dhcp/), [10: DNS](/10-dns/) | Ports, connections, automatic configuration, and name resolution |
| Interpret application and security results | [11: HTTP and TLS](/11-http-tls/), [12: Firewalls](/12-filtering/) | Web responses, certificate checks, and filtering behavior |
| Apply the method | [14: Troubleshooting](/14-troubleshooting/) | Test one stage at a time and record what each result proves |

Optional and role-specific material is labeled when applicable so you can skip it on a first reading. [Module 13: Proxies and Load Balancers](/13-proxies-load-balancers/) is an optional, role-specific extension for systems administration, cloud, DevOps, and software work.

## What This Guide Covers

- A high-level overview of common networking concepts rather than every topic or advanced detail
- Vendor-agnostic concepts and standard protocols used across physical, virtual, and cloud environments
- Examples based on wired and Wi-Fi networks; mobile networks are outside the current scope

## How the Hands-On Parts Work

Commands are generally shown for Windows, with Linux or macOS equivalents included when practical. Exercises marked **Optional Lab** use a Windows Virtual Machine (WINCLIENT) and a Linux Virtual Machine (LINUXBOX) on the isolated VirtualBox network `NETLAB`.

You can complete the conceptual path without the lab. When you want hands-on practice, follow [Building the Optional NETLAB](/appendix/building-netlab/).

## Source, Reuse, and Feedback

This guide is an open, evolving project. The source files are available on [GitHub](https://github.com/mblackonline/networking-foundations-guide) under the [MIT License](https://github.com/mblackonline/networking-foundations-guide/blob/main/LICENSE), and you are welcome to fork, adapt, or expand them for your own use.

Artificial intelligence (AI) tools assisted with research, drafting, editing, and review. Although I reviewed and revised the material, errors or oversimplifications may remain. The Further Learning sections provide links to official documentation and other public resources for deeper study. If you find an error or have a suggestion, please open a [GitHub Issue](https://github.com/mblackonline/networking-foundations-guide/issues).
