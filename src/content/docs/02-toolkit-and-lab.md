---
title: "Module 2: Your Networking Toolkit"
description: Verify the networking tools already on your computer and optionally use Wireshark to observe a first exchange.
---

This module introduces the tools used to inspect a network connection. There is very little to install because most of what you need already ships with the operating system (OS) on the computer you are using.

The guide has two paths:

- **Core reading:** Use the tools already on your computer. No virtual machines are required.
- **Optional hands-on practice:** Install Wireshark or build the isolated NETLAB environment when you want to observe and change network behavior.

## In This Module

- Confirm the networking tools already built into your operating system
- Understand the question each tool answers
- Optionally install Wireshark and take a first capture
- Find the separate instructions for building NETLAB

## The Tools You Already Have

Every operating system ships with tools that answer the basic networking questions. The names differ, the questions do not.

| Question | Windows | Linux | macOS |
| --- | --- | --- | --- |
| What are my Internet Protocol (IP) settings? | `ipconfig /all` | `ip addr` | `ifconfig` |
| How does my machine pick a route? | `route print` | `ip route` | `netstat -rn` |
| Who is on my local segment? | `arp -a` | `ip neigh` | `arp -a` |
| What is listening or connected? | `netstat -ano` | `ss -tulpn` | `netstat -an` |
| What does this name resolve to? | `nslookup` | `dig` | `dig` |
| What path does traffic take? | `tracert` | `traceroute` | `traceroute` |
| What does this server actually say? | `curl` | `curl` | `curl` |

This guide shows Windows commands first, with the others alongside, because most readers are on Windows. Nothing about the concepts changes between them.

A few notes before you start.

`dig` is not included with Windows. Use `nslookup`, or `Resolve-DnsName` in PowerShell, which produces more readable output. Module 9 shows both.

`dig` is not always installed on Linux either. On Linux Mint and Ubuntu it comes from the `dnsutils` package, which you can install with `sudo apt install dnsutils`.

`traceroute` is not always installed on Linux. On Linux Mint and Ubuntu, install it with `sudo apt install traceroute`.

`ss` has replaced `netstat` on most Linux distributions. If `ss` is missing, `netstat` usually still works.

## Verify Your Tools

Run these three on your own machine. You do not need to understand the output yet.

```text
ipconfig /all
nslookup example.com
curl -I https://example.com
```

On Linux or macOS:

```text
ip addr
dig example.com
curl -I https://example.com
```

If all three produce output rather than a "command not found" error, you are ready.

## Install Wireshark

:::note[Optional: Explore Later]
Wireshark makes network exchanges visible, but it is not required to continue through the conceptual guide.
:::

Wireshark shows you the actual packets your machine sends and receives. Several modules use it to make an abstract exchange concrete.

1. Download it from [wireshark.org](https://www.wireshark.org/download.html). Use the official site rather than a download portal.
2. Run the installer and accept the defaults.
3. On Windows, the installer offers to install Npcap. Accept it. Wireshark cannot capture without it.
4. On Windows, restart after the install so the capture driver loads.

:::caution
Wireshark records everything reaching the interface you select, not just the traffic you generated. On a typical switched network that means your own traffic plus broadcast and multicast, though some designs expose more.

Unencrypted traffic is readable in full, credentials included. Encrypted traffic stays protected, but a capture still shows which systems communicated, when, and how much.

Capture only on networks you own or are authorized to work on. Doing so without permission can violate policy or law. Every capture in this guide is on your own machine or your own lab.
:::

## Your First Capture

:::note[Optional Practice]
This exercise uses Wireshark to observe one Domain Name System (DNS) exchange. Skip it if you did not install Wireshark.
:::

1. Open Wireshark.
2. Double-click your active network interface. The one with a moving line graph beside it is the one carrying traffic.
3. Packets start scrolling immediately. That is normal, and it is a lot.
4. In the display filter bar at the top, type `dns` and press Enter.
5. Open a Command Prompt and run `nslookup example.com`.
6. Switch back to Wireshark. New rows appear at the bottom of the list.
7. Click the red square to stop the capture.

Each row is one packet, and the **Info** column at the far right summarizes it in plain language. Your lookup is at the bottom, since Wireshark adds rows as they arrive. Everything above it is background traffic from other programs on your computer.

Look for a pair of rows like these:

```text
Standard query 0x8f3a A www.example.com
Standard query response 0x8f3a A www.example.com A 192.0.2.10
```

The first is your question, the second is the answer, and the matching number pairs them. Their **Source** and **Destination** columns swap, because your machine asked your Domain Name System (DNS) server and the server replied.

You will probably see more than two rows, which is normal. Module 9 explains what all of them mean.

This capture shows DNS turning a name into an address. The display filter narrows the results to the packets relevant to that exchange.

## Optional: Build NETLAB

The optional lab provides a safe place to change addresses, routes, services, and firewall rules without disrupting your everyday computer.

It uses:

| System | Role |
| --- | --- |
| Windows Virtual Machine (WINCLIENT) | Client used for Windows commands and tests |
| Linux Virtual Machine (LINUXBOX) | Linux Mint Xfce server used as the other endpoint |
| VirtualBox network `NETLAB` | Isolated NAT Network using `10.0.20.0/24` |

Follow [Building the Optional NETLAB](/appendix/building-netlab/) when you want to add the hands-on path. Every exercise that needs these systems is labeled **Optional Lab**.

## Further Learning

- [Windows Commands reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands) documents every built-in command in the table above, including the options this guide does not use.
- [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/) covers capture options, display filters, and interface selection in far more depth than this guide needs.
- [Building the Optional NETLAB](/appendix/building-netlab/) contains the VirtualBox and operating-system setup steps.

## Main Takeaways

- Operating systems include tools for inspecting addresses, routes, name resolution, connections, and web responses.
- Wireshark displays the packets traveling through a network interface.
- Different tools reveal different parts of network communication, so troubleshooting often requires comparing their results.

Continue to Module 3 to look at what happens inside your own network segment.
