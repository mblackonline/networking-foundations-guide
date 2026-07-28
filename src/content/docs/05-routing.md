---
title: "Module 5: Routing"
description: Reading a routing table, longest prefix match, next hop, and the default route.
---

Module 4 explained how a host decides whether a destination is local. Routing begins when the destination is not.

Every host and router has a [routing table](/appendix/glossary/#routing-table). It is a list of instructions that answers one question: where should this packet go next?

## In This Module

- What a routing table contains
- Connected routes, next hops, and interfaces
- Longest prefix match
- The default route
- Static and dynamic routes
- Following a path with traceroute

## The Routing Table

A route normally contains four useful pieces of information.

| Field | Meaning |
| --- | --- |
| Destination | The network or host the route matches |
| Next hop | The router that should receive the packet next |
| Interface | The local network interface used to send it |
| Metric | A value used to choose between equally specific routes |

Consider this simplified table:

| Destination | Next hop | Interface | Metric |
| --- | --- | --- | ---: |
| `192.168.10.0/24` | On-link | Ethernet | 25 |
| `10.20.5.0/24` | `192.168.10.2` | Ethernet | 50 |
| `10.20.0.0/16` | `192.168.10.1` | Ethernet | 10 |
| `0.0.0.0/0` | `192.168.10.1` | Ethernet | 25 |

**[On-link](/appendix/glossary/#on-link)** means the destination is directly reachable on the local network. The host uses the Address Resolution Protocol (ARP) to find the destination's media access control (MAC) address and sends the frame directly.

When a [next hop](/appendix/glossary/#next-hop) is listed, the host keeps the packet's final destination Internet Protocol (IP) address but sends the local frame to that router's MAC address.

## Longest Prefix Match

More than one route can match the same destination. The route with the longest prefix wins because it describes the smallest, most specific range.

Using the table above, consider `10.20.5.25`.

It matches:

- `10.20.5.0/24`
- `10.20.0.0/16`
- `0.0.0.0/0`

The `/24` route wins. It sends the packet to `192.168.10.2`, even though that route has a higher metric than the `/16`.

```text
Choose the longest matching prefix first.
Use the metric only to choose between equally specific routes.
```

This is the same idea as choosing a street address over a city name. Both describe the destination, but one is more precise.

## The Default Route

The route `0.0.0.0/0` is the [default route](/appendix/glossary/#default-route).

A `/0` fixes none of the address bits, so it matches every Internet Protocol version 4 (IPv4) destination. Because every more specific route has a longer prefix, the default is used only when nothing better matches.

On a workstation, the default route normally points to the default gateway learned from the Dynamic Host Configuration Protocol (DHCP) or configured manually.

```text
0.0.0.0/0 -> default gateway
```

Without a matching route or a default route, the host does not know where to send the packet.

## View Your Routes

On Windows:

```text
route print -4
```

Look under **IPv4 Route Table**. Windows displays the destination and subnet mask in separate columns. Together, they describe the prefix.

```text
Network Destination  Netmask          Gateway
0.0.0.0              0.0.0.0          192.168.1.1
192.168.1.0          255.255.255.0    On-link
```

The first line is the default route. The second is the connected `192.168.1.0/24` network.

On Linux:

```text
ip -4 route
```

A typical result looks like:

```text
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 scope link
```

Linux uses `default` instead of writing `0.0.0.0/0`. The word `via` identifies the next hop, and `dev` identifies the interface.

On macOS:

```text
netstat -rn -f inet
```

The formatting differs, but the same destination, gateway, interface, and metric ideas apply.

:::note
Your routing table may contain virtual private network (VPN) routes, virtual machine networks, loopback routes, and several entries created automatically by the operating system. Start by finding only the connected network and default route. You do not need to understand every line yet.
:::

## Static and Dynamic Routes

A **static route** is added manually. It stays the same until an administrator or automation changes it. Static routes are useful when the path is simple and predictable.

A **dynamic route** is learned from another router through a routing protocol. Dynamic routing lets routers adapt when networks or paths change.

Two names are worth recognizing:

- Open Shortest Path First (OSPF) commonly shares routes inside an organization.
- [Border Gateway Protocol (BGP)](/appendix/glossary/#border-gateway-protocol-bgp) exchanges reachability information between large networks and forms the routing foundation of the internet.

You do not need to configure either protocol for this guide. They still produce routing-table entries that are selected using the same longest-prefix rule.

## How a VPN Changes Routing

When a device connects to a virtual private network (VPN), the VPN software adds a virtual network interface and routing-table entries.

- **Split tunnel:** Only selected traffic, such as traffic for an organization's internal systems, goes through the VPN. Other traffic uses the device's normal network connection.
- **Full tunnel:** The VPN becomes the default path for regular network traffic, including internet traffic.

The routes added by the VPN determine which traffic uses the tunnel.

## Follow the Path With Traceroute

Traceroute shows the routers that respond along a path.

Each IP packet contains a [Time to Live (TTL)](/appendix/glossary/#time-to-live-ttl) value. Every router reduces it by at least one. When it reaches zero, the router discards the packet and normally returns an [Internet Control Message Protocol (ICMP)](/appendix/glossary/#internet-control-message-protocol-icmp) Time Exceeded message.

Traceroute uses that behavior deliberately:

1. Send a probe with a TTL of 1 to reveal the first router.
2. Send another with a TTL of 2 to reveal the second.
3. Continue increasing the TTL until the destination answers or the limit is reached.

On Windows:

```text
tracert -d example.com
```

On Linux or macOS:

```text
traceroute -n example.com
```

The `-d` and `-n` options skip name lookups, which makes the path display faster and keeps the first test focused on routing.

An asterisk does not prove that hop is broken. Some routers forward traffic normally but do not send traceroute replies. If later hops answer, packets clearly passed through the silent hop.

Traceroute also shows the forward path seen by its probes, not necessarily the path replies take back.

## Try It Yourself

Display your routing table and identify:

- Your connected local network
- Your default route
- The default gateway's address
- The interface used to reach it

Then run traceroute to `example.com`.

Compare its first responding hop with your default gateway. They are often the same on a home or lab network, although VPNs and some provider networks can make the result different.

Run the trace twice. Paths and response times can change because routing is dynamic and networks may have several valid paths.

:::tip[Optional Lab]
Add one temporary host route on WINCLIENT and watch it override the default route.

1. Find LINUXBOX's address with `ip -4 addr`.
2. Open Command Prompt as administrator on WINCLIENT.
3. Add a `/32` route for a documentation-only address, using LINUXBOX as the next hop:

   ```text
   route add 203.0.113.10 mask 255.255.255.255 <LINUXBOX-address>
   ```

4. Confirm the route appears:

   ```text
   route print 203.0.113.10
   ```

5. Start a Wireshark capture with the filter `arp or icmp`, then run:

   ```text
   arp -d <LINUXBOX-address>
   ping 203.0.113.10
   ```

6. WINCLIENT should send an ARP request for LINUXBOX, not for `203.0.113.10`. The packet's destination IP remains `203.0.113.10`, but the local frame goes to the next hop.
7. The ping does not need to succeed. LINUXBOX is not configured to route the packet. The exercise is about seeing which route WINCLIENT selected.
8. Remove the temporary route:

   ```text
   route delete 203.0.113.10
   ```

The route is not persistent, but delete it when finished rather than waiting for a restart.
:::

## Further Learning

- [Request for Comments (RFC) 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/info/rfc1812/) defines longest-prefix route selection and other router behavior.
- [Microsoft's `route` command reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008) documents how Windows displays and changes its IPv4 routing table.
- [Microsoft's TRACERT troubleshooting guide](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/trace-route-troubleshoot-tcp-ip-problems) explains how TTL and ICMP replies reveal a path.
- [Linux `ip-route` manual page](https://man7.org/linux/man-pages/man8/ip-route.8.html) documents Linux route display and management.
- [RFC 5737: IPv4 Address Blocks for Documentation](https://www.rfc-editor.org/info/rfc5737/) defines the example-only address used in the lab.

## Main Takeaways

- A routing table lists paths to destination networks through specific interfaces or next-hop routers.
- The most specific matching route is selected. The default route is used when no more specific route matches.
- Traceroute can reveal the routers along a path and where delays or failures may occur.

Continue to Module 6 to see how network address translation (NAT) changes addresses as packets cross a network boundary.
