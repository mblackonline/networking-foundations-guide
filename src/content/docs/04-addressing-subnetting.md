---
title: "Module 4: IPv4 Addressing and Subnetting"
description: CIDR, subnet masks, network and broadcast addresses, private ranges, and the default gateway.
---

An IPv4 address identifies a device, but the address alone is not enough. A subnet mask tells the device which addresses are nearby and which ones must be reached through a router.

That local-or-remote decision is the main idea in this module. The calculations help you describe the boundary.

## In This Module

- What an IPv4 address and subnet mask each do
- How CIDR notation describes a subnet
- How to find the network, broadcast, and usable host range
- The private IPv4 ranges
- How a host decides whether to use its default gateway

## An Address Needs a Prefix

An IPv4 address is 32 bits long and is written as four decimal numbers:

```text
192.168.10.77
```

The prefix length after the slash tells you how many of those 32 bits identify the network.

```text
192.168.10.77/24
```

In this example, 24 bits identify the network and the remaining 8 bits identify a host inside it.

The prefix can also be written as a subnet mask:

```text
/24 = 255.255.255.0
```

These are two ways of saying the same thing.

## Common Prefixes

Start with the common prefixes below. The complete `/8` through `/32` table is in the [Subnetting Practice appendix](/appendix/subnetting-practice/).

| Prefix | Subnet mask | Total addresses | Usually usable by hosts |
| --- | --- | ---: | ---: |
| `/16` | `255.255.0.0` | 65,536 | 65,534 |
| `/24` | `255.255.255.0` | 256 | 254 |
| `/25` | `255.255.255.128` | 128 | 126 |
| `/26` | `255.255.255.192` | 64 | 62 |
| `/27` | `255.255.255.224` | 32 | 30 |
| `/28` | `255.255.255.240` | 16 | 14 |
| `/29` | `255.255.255.248` | 8 | 6 |
| `/30` | `255.255.255.252` | 4 | 2 |
| `/31` | `255.255.255.254` | 2 | 2 on a point-to-point link |
| `/32` | `255.255.255.255` | 1 | 1 exact address |

The basic calculation is:

```text
Host bits = 32 - prefix length
Total addresses = 2^(host bits)
Usable hosts = total addresses - 2
```

The subtraction reserves one address for the network and one for the broadcast.

There are two useful exceptions. A `/31` can use both addresses on a point-to-point link. A `/32` identifies one exact address and often appears in host routes and firewall rules.

## Network, Broadcast, and Hosts

An ordinary IPv4 subnet contains:

- A **network address**, which names the subnet
- A **broadcast address**, which reaches every IPv4 host on that subnet
- The **usable host addresses** between them

For `192.168.10.0/24`:

| Purpose | Address |
| --- | --- |
| Network Address | `192.168.10.0` |
| First usable host | `192.168.10.1` |
| Last usable host | `192.168.10.254` |
| Broadcast Address | `192.168.10.255` |

The subnet contains 256 total addresses and 254 usable host addresses.

## Finding the Range of a /24

With a `/24`, the subnet mask is:

```text
255.255.255.0
```

The first three octets identify the network. The last octet identifies an address inside it.

For the host `192.168.10.77/24`:

1. Keep the first three octets: `192.168.10`.
2. Set the last octet to `0` for the network address: `192.168.10.0`.
3. Set the last octet to `255` for the broadcast address: `192.168.10.255`.
4. The usable host addresses are `192.168.10.1` through `192.168.10.254`.

This octet-aligned boundary is why `/24` is a good place to begin. Smaller subnets such as `/25` and `/26` divide the final octet into multiple ranges. The appendix covers those calculations when you are ready for them.

:::note[About Older Exam Questions]
Some certification questions assume historical classful masks: `/8` for class A, `/16` for class B, and `/24` for class C. Modern networks use the prefix that is explicitly stated.

For example, `172.22.0.0/25` is one `/25` subnet unless the question also tells you to divide a larger parent network, or clearly expects the old class B `/16` assumption. The appendix explains that exam-style calculation separately.
:::

## Local or Remote?

Before sending a packet, a host compares the destination with its own network.

Suppose the host is `192.168.10.77/24`.

- `192.168.10.100` is in the same `/24`, so the host uses ARP to find that destination's MAC address.
- `192.168.11.20` is outside the `/24`, so the host sends the frame to its default gateway.

The destination IP address remains `192.168.11.20`. Only the local frame is addressed to the gateway's MAC address.

```text
Local destination  -> ARP for the destination
Remote destination -> ARP for the default gateway
```

This is why the subnet mask matters. It tells the host which of those two actions to take.

## Private IPv4 Addresses

Three address blocks are reserved for private networks:

| Private block | Address range |
| --- | --- |
| `10.0.0.0/8` | `10.0.0.0` through `10.255.255.255` |
| `172.16.0.0/12` | `172.16.0.0` through `172.31.255.255` |
| `192.168.0.0/16` | `192.168.0.0` through `192.168.255.255` |

These addresses can be reused in homes, businesses, labs, and cloud networks because they are not routed across the public internet.

Private does not mean secure. It describes how an address is allocated and routed, not who is allowed to reach it. Module 6 covers the network address translation (NAT) commonly used when private hosts access public services.

## What a Wrong Mask Does

A wrong mask changes which destinations the host considers local.

- If the mask is too broad, the host treats some remote destinations as local and sends ARP requests for them instead of using its gateway.
- If the mask is too narrow, the host treats some local destinations as remote and sends their traffic to its gateway.

When two nearby hosts cannot communicate, compare their IP addresses and subnet masks before investigating the application.

## Try It Yourself

Find the IPv4 address, subnet mask, and default gateway on your active interface.

On Windows:

```text
ipconfig /all
```

On Linux:

```text
ip -4 addr
ip route
```

On macOS:

```text
ifconfig
route -n get default
```

Use the address and mask to find:

- The network address
- The broadcast address
- The first and last usable host addresses

Then compare your default gateway with that range. The gateway should be reachable on the local subnet.

:::tip[Optional Lab]
On WINCLIENT, record the current address, mask, gateway, and DNS settings. Temporarily configure the same values with a broader `/16` mask.

Capture with the Wireshark filter `arp`, clear the ARP cache with `arp -d *`, and ping `10.0.30.1`. WINCLIENT should send an unanswered ARP request because the wrong `/16` makes that address appear local.

Return the adapter to automatic DHCP afterward, run `ipconfig /renew`, and confirm the original `/24` mask returns.
:::

## Further Learning

- [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/info/rfc1918/) defines the private IPv4 ranges.
- [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/info/rfc3021/) explains the `/31` exception.
- [IANA IPv4 Special-Purpose Address Space](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) lists private, loopback, link-local, and other special ranges.
- Ed Harmoush's free [Subnetting Mastery video series](https://www.practicalnetworking.net/stand-alone/subnetting-mastery/) provides additional calculation methods and practice.

## Checklist Before Moving On

- [ ] You can explain what the prefix length tells a host
- [ ] You can identify the network, broadcast, and host range of a subnet
- [ ] You can find the network and host range for a `/24`
- [ ] You understand the special purpose of `/31` and `/32`
- [ ] You know the three private IPv4 ranges
- [ ] You can explain when a host sends traffic to its default gateway

Continue to Module 5 to see how routers choose the next network in a path.
