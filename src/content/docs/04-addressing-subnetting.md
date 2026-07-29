---
title: "Module 4: IPv4 Addressing and Subnetting"
description: CIDR, subnet masks, network and broadcast addresses, private ranges, and the default gateway.
---

An [Internet Protocol version 4 (IPv4) address](/appendix/glossary/#internet-protocol-version-4-ipv4) identifies a device, but the address alone is not enough. A [subnet mask](/appendix/glossary/#subnet-mask) tells the device which addresses are nearby and which ones must be reached through a router.

That local-or-remote decision is the main idea in this module. The calculations help you describe the boundary.

## In This Module

- How an IPv4 address, prefix, and subnet mask describe a network
- How Classless Inter-Domain Routing (CIDR) notation describes a subnet
- How a host decides whether to use its default gateway
- How to find a `/24` range and recognize private IPv4 addresses

## Four Octets, Thirty-Two Bits

An IPv4 address is 32 bits long. The familiar dotted form splits those bits into four 8-bit groups called [octets](/appendix/glossary/#octet), written in [decimal](/appendix/glossary/#decimal), the everyday base-10 numbers, because that is easier to read and type than a row of ones and zeros.

```text
192.168.10.77
11000000.10101000.00001010.01001101
```

Eight bits produce 256 possible combinations, counted from 0 to 255. That is the entire reason an octet never goes higher than 255. An address such as `192.168.10.300` is not valid, because eight bits cannot count that high.

The dots are a display convenience. The 32 bits are continuous, and a subnet boundary does not have to land on a dot.

## An Address Needs a Prefix

The address by itself does not say where the network ends and the hosts begin.

The [prefix length](/appendix/glossary/#prefix-length) after the slash tells you how many of those 32 bits identify the network.

```text
192.168.10.77/24
```

In this example, 24 bits identify the network and the remaining 8 bits identify a host inside it.

The prefix can also be written as a subnet mask:

```text
/24 = 255.255.255.0
```

These are two ways of saying the same thing.

## Local or Remote?

Before sending a packet, a host compares the destination with its own network.

Suppose the host is `192.168.10.77/24`.

- `192.168.10.100` is in the same `/24`, so the host uses the Address Resolution Protocol (ARP) to find that destination's media access control (MAC) address.
- `192.168.11.20` is outside the `/24`, so the host sends the frame to its [default gateway](/appendix/glossary/#default-gateway).

The destination Internet Protocol (IP) address remains `192.168.11.20`. Only the local frame is addressed to the gateway's MAC address.

```text
Local destination  -> ARP for the destination
Remote destination -> ARP for the default gateway
```

This is why the subnet mask matters. It tells the host which of those two actions to take.

## What the Mask Is Doing

A `255` in an octet is `11111111` in binary, so the mask has a bit pattern of its own:

```text
255.255.255.0
11111111.11111111.11111111.00000000
```

A `1` marks a bit that belongs to the network. A `0` marks a bit left over to identify a host inside that network. Lining the mask up under the address shows the split:

```text
Address   11000000.10101000.00001010.01001101   192.168.10.77
Mask      11111111.11111111.11111111.00000000   255.255.255.0
          |-------- network -------| | host |
```

Counting the ones gives you the prefix length. Twenty-four ones is a `/24`.

## Optional: Prefixes Beyond /24

:::note[Optional: Explore Later]
You do not need to calculate smaller subnets before continuing. The rest of the core guide requires only the local-versus-remote decision and an understanding that a longer prefix describes a more specific range.
:::

A subnet boundary does not have to fall between octets. Prefixes such as `/25`, `/26`, and `/27` divide the final octet into progressively smaller ranges. `/31` and `/32` also have special uses in routing.

The [Subnetting Practice appendix](/appendix/subnetting-practice/) contains the complete prefix table, binary place-value pattern, worked calculations, and practice problems.

## Network, Broadcast, and Hosts

An ordinary IPv4 subnet contains:

- A **[network address](/appendix/glossary/#network-address)**, which names the subnet
- A **[broadcast address](/appendix/glossary/#broadcast-address)**, which reaches every IPv4 host on that subnet
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

This octet-aligned boundary is why `/24` is a good place to begin. Smaller subnets such as `/25` and `/26` divide the final octet into multiple ranges. The appendix covers those calculations, along with the older classful conventions that some certification questions still assume, when you are ready for them.

## [Private IPv4 Addresses](/appendix/glossary/#private-ipv4-address)

Three address blocks are reserved for private networks:

| Private block | Address range |
| --- | --- |
| `10.0.0.0/8` | `10.0.0.0` through `10.255.255.255` |
| `172.16.0.0/12` | `172.16.0.0` through `172.31.255.255` |
| `192.168.0.0/16` | `192.168.0.0` through `192.168.255.255` |

These addresses can be reused in homes, businesses, labs, and cloud networks because they are not routed across the public internet.

Private does not mean secure. It describes how an address is allocated and routed, not who is allowed to reach it. Module 6 covers the network address translation (NAT) commonly used when private hosts access public services.

## Why Addresses Come in Ranges

IPv4 contains a fixed set of 32-bit addresses. Prefix lengths let registries, providers, and organizations allocate that space in blocks instead of handing out unrelated individual addresses.

The private ranges above are reserved blocks. Loopback, link-local, documentation, and other special-purpose ranges are additional blocks. Subnetting applies the same idea inside a network by dividing an assigned range into smaller ranges.

## What a Wrong Mask Does

A wrong mask changes which destinations the host considers local.

- If the mask is too broad, the host treats some remote destinations as local and sends ARP requests for them instead of using its gateway.
- If the mask is too narrow, the host treats some local destinations as remote and sends their traffic to its gateway.

When two nearby hosts cannot communicate, compare their IP addresses and subnet masks before investigating the application.

## Try It Yourself

:::note[Optional Practice]
This exercise reinforces the `/24` range used throughout the guide. It is not required to continue.
:::

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
On WINCLIENT, record the current address, mask, gateway, and Domain Name System (DNS) settings. Temporarily configure the same values with a broader `/16` mask.

Capture with the Wireshark filter `arp`, clear the ARP cache with `arp -d *`, and ping `10.0.30.1`. WINCLIENT should send an unanswered ARP request because the wrong `/16` makes that address appear local.

Return the adapter to automatic Dynamic Host Configuration Protocol (DHCP) afterward, run `ipconfig /renew`, and confirm the original `/24` mask returns.
:::

## Further Learning

- [Request for Comments (RFC) 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/info/rfc1918/) defines the private IPv4 ranges.
- [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/info/rfc3021/) explains the `/31` exception.
- [Internet Assigned Numbers Authority (IANA) IPv4 Special-Purpose Address Space](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) lists private, loopback, link-local, and other special ranges.
- The [Subnetting Practice appendix](/appendix/subnetting-practice/) has the complete CIDR reference, worked calculations, practice problems, and video and drill recommendations.

## Main Takeaways

- A subnet mask separates the network portion of an IPv4 address from the host portion.
- Classless Inter-Domain Routing (CIDR) notation is a shorter way to write a subnet mask. For example, `/24` means `255.255.255.0`.
- A device uses its IPv4 address and subnet mask to determine whether traffic stays on the local network or goes through the default gateway.

Continue to Module 5 to see how routers choose the next network in a path.
