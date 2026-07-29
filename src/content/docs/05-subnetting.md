---
title: "Module 5: Understanding IPv4 Subnetting"
description: How prefixes divide IPv4 address space into network, broadcast, and usable host ranges.
---

Module 4 explained how an Internet Protocol version 4 (IPv4) address and subnet mask let a host decide whether a destination is local. This module looks at the boundary itself: how one address block is divided into smaller networks and how to describe each resulting range.

Subnetting is not primarily a memorization exercise. It is a way to answer practical questions:

- Which addresses belong to this network?
- Which address identifies the network?
- Which address is used for broadcast traffic?
- How many host addresses fit inside the range?
- Is a destination local, or must traffic use a router?

## In This Module

- Why networks are divided into subnets
- How a longer prefix creates a smaller address range
- How to find the network, broadcast, and usable host addresses
- How to choose a prefix for the number of addresses a network needs

## Why Subnetting Exists

A [subnet](/appendix/glossary/#subnet) is a range of Internet Protocol (IP) addresses that share a network prefix.

Suppose an organization chooses `192.168.10.0/24` for an internal network. It could use the entire range as one network, or divide it into smaller networks for different locations, device groups, or routing boundaries.

```text
One /24 network
        |
        +-- two /25 networks
        |
        +-- four /26 networks
```

Dividing the range does not create more addresses. It changes how the existing addresses are grouped. Each smaller subnet receives its own network address, broadcast address, and usable host range.

## Longer Prefix, Smaller Subnet

The prefix length states how many of the 32 address bits belong to the network.

- A `/24` uses 24 network bits and leaves 8 host bits.
- A `/25` uses 25 network bits and leaves 7 host bits.
- A `/26` uses 26 network bits and leaves 6 host bits.

Each bit moved from the host portion to the network portion doubles the number of subnets and halves the number of addresses in each subnet.

| Prefix | Equal ranges inside a `/24` | Addresses per range | Usually usable by hosts |
| --- | ---: | ---: | ---: |
| `/24` | 1 | 256 | 254 |
| `/25` | 2 | 128 | 126 |
| `/26` | 4 | 64 | 62 |
| `/27` | 8 | 32 | 30 |
| `/28` | 16 | 16 | 14 |
| `/29` | 32 | 8 | 6 |
| `/30` | 64 | 4 | 2 |

For ordinary IPv4 subnets through `/30`:

```text
Host bits = 32 - prefix length
Total addresses = 2^(host bits)
Usable host addresses = total addresses - 2
```

The subtraction reserves one address to identify the network and one for broadcast traffic.

## Network, Broadcast, and Usable Hosts

An ordinary IPv4 subnet contains:

- A **[network address](/appendix/glossary/#network-address)**, which identifies the subnet
- A **[broadcast address](/appendix/glossary/#broadcast-address)**, which reaches all IPv4 hosts on that subnet
- The **usable host addresses** between them

For `192.168.10.0/24`:

| Purpose | Address |
| --- | --- |
| Network address | `192.168.10.0` |
| First usable host | `192.168.10.1` |
| Last usable host | `192.168.10.254` |
| Broadcast address | `192.168.10.255` |

The first and last addresses have protocol roles, so ordinary hosts use the addresses between them.

## Dividing a /24 into /25 Networks

Changing `/24` to `/25` uses one more network bit. One additional bit has two possible values, so the `/24` becomes two equal ranges:

| Subnet | Complete range | Usable host range |
| --- | --- | --- |
| `192.168.10.0/25` | `.0` through `.127` | `.1` through `.126` |
| `192.168.10.128/25` | `.128` through `.255` | `.129` through `.254` |

Each range contains 128 total addresses. The first address is the network address, and the last is the broadcast address.

## Dividing a /24 into /26 Networks

Changing `/24` to `/26` uses two more network bits. Two bits have four possible values, so the `/24` becomes four equal ranges:

| Subnet | Complete range | Usable host range |
| --- | --- | --- |
| `192.168.10.0/26` | `.0` through `.63` | `.1` through `.62` |
| `192.168.10.64/26` | `.64` through `.127` | `.65` through `.126` |
| `192.168.10.128/26` | `.128` through `.191` | `.129` through `.190` |
| `192.168.10.192/26` | `.192` through `.255` | `.193` through `.254` |

Each `/26` contains 64 total addresses and normally provides 62 usable host addresses.

The boundaries occur every 64 addresses:

```text
0, 64, 128, 192
```

That distance between consecutive network addresses is called the **block size**.

## The Repeating Block-Size Pattern

When the subnet boundary is in the final octet, subtract that octet of the mask from 256:

```text
Block size = 256 - mask value
```

For `/26`:

```text
Subnet mask: 255.255.255.192
Block size:  256 - 192 = 64
```

The same pattern repeats as the prefix grows:

| Prefix | Final mask octet | Block size |
| --- | ---: | ---: |
| `/24` | 0 | 256 |
| `/25` | 128 | 128 |
| `/26` | 192 | 64 |
| `/27` | 224 | 32 |
| `/28` | 240 | 16 |
| `/29` | 248 | 8 |
| `/30` | 252 | 4 |

For prefixes whose boundary falls in an earlier octet, the same pattern applies in that changing octet.

## Find the Subnet Containing an Address

Consider the host:

```text
192.168.10.77/26
```

A `/26` has a block size of 64. Its network boundaries in the final octet are:

```text
0, 64, 128, 192
```

The host value `77` falls between `64` and `127`, so:

| Purpose | Address |
| --- | --- |
| Network address | `192.168.10.64` |
| First usable host | `192.168.10.65` |
| Host being examined | `192.168.10.77` |
| Last usable host | `192.168.10.126` |
| Broadcast address | `192.168.10.127` |

A destination from `.65` through `.126` is local to this host. A destination outside the `/26` is remote, even when the first three octets look the same.

For example, `192.168.10.150` would have been local in the larger `/24`, but it is remote from `192.168.10.77/26`.

## Choosing a Prefix

A network needs enough host bits for its devices plus the network and broadcast addresses.

Suppose a network needs at least 50 usable host addresses:

```text
5 host bits -> 2^5 = 32 total addresses -> not enough
6 host bits -> 2^6 = 64 total addresses -> 62 usable
```

Six host bits leave 26 network bits:

```text
32 total bits - 6 host bits = /26
```

A `/26` is therefore the smallest ordinary subnet that meets the requirement.

Real designs also allow room for growth and may reserve addresses for gateways, infrastructure, or platform-specific use. The smallest mathematical answer is not always the best operational design.

## Special Cases: /31 and /32

:::note[Useful Context]
These prefixes are worth recognizing, but they do not change the ordinary subnet model used above.
:::

- A `/31` contains two addresses. On an IPv4 point-to-point link, both can be used because that link does not need ordinary network and broadcast addresses.
- A `/32` identifies one exact IPv4 address. It commonly appears in host routes and firewall rules.

## How a Host Applies the Mask

:::note[Technical Detail]
The block-size method is easier for people to calculate. This section shows the bit operation a host performs underneath it.
:::

A host finds its network address by comparing its address and mask one bit at a time with a **bitwise AND** operation. A result bit is 1 only when both input bits are 1.

For `192.168.10.77/24`:

```text
Address   11000000.10101000.00001010.01001101   192.168.10.77
Mask      11111111.11111111.11111111.00000000   255.255.255.0
Result    11000000.10101000.00001010.00000000   192.168.10.0
```

Wherever the mask contains a 1, the address bit passes into the result. Wherever the mask contains a 0, the result becomes 0. What remains is the network address.

## Optional Lab: Observe a Wrong Mask

This exercise requires the [optional NETLAB environment](/appendix/building-netlab/).

On the Windows Virtual Machine (WINCLIENT), record the current address, mask, gateway, and Domain Name System (DNS) settings. Temporarily configure the same values with a broader `/16` mask.

Capture with the Wireshark display filter `arp`, clear the Address Resolution Protocol (ARP) cache with `arp -d *`, and ping `10.0.30.1`. WINCLIENT should send an unanswered ARP request because the wrong `/16` makes that address appear local.

Return the adapter to automatic Dynamic Host Configuration Protocol (DHCP) configuration afterward, run `ipconfig /renew`, and confirm that the original `/24` mask returns.

## Further Learning

- [Request for Comments (RFC) 4632: Classless Inter-Domain Routing](https://www.rfc-editor.org/info/rfc4632/) explains classless prefixes and address aggregation.
- [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/info/rfc3021/) defines the `/31` exception.
- [Ed Harmoush's Subnetting Mastery series](https://www.youtube.com/playlist?list=PLIFyRwBY_4bQUE4IB5c4VPRyDoLgOdExE) provides a structured video course with explanations and worked examples.
- [freeCodeCamp's Subnet Cheat Sheet](https://www.freecodecamp.org/news/subnet-cheat-sheet-24-subnet-mask-30-26-27-29-and-other-ip-address-cidr-network-references/) is a quick reference for CIDR prefixes, subnet masks, wildcard masks, and address counts.
- After the concepts make sense, [SubnetIPv4.com](https://subnetipv4.com/) provides randomly generated address, network, host-range, broadcast, and next-subnet problems for optional repetition.

## Main Takeaways

- Subnetting divides an address block into smaller networks without creating additional addresses.
- A longer prefix creates more subnets with fewer addresses in each subnet.
- The prefix determines the network, broadcast, and usable host range and therefore which destinations a host considers local.

Continue to [Module 6: Routing](/06-routing/) to see how packets move between the networks that subnetting defines.
