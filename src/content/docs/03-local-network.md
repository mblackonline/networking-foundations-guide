---
title: "Module 3: The Local Network"
description: How Ethernet frames, hardware addresses, switches, and broadcasts move local traffic.
---

Before data can cross the internet, it has to leave your machine and reach whatever it connects to first, usually a switch or an access point. This module covers the layer 2 hop, which is how traffic moves inside your own network segment.

This module describes wired and Wi-Fi networks. A phone on cellular data connects differently and will not show the behavior described here.

## In This Module

- How media access control (MAC) addresses and switches deliver local frames
- How the Address Resolution Protocol (ARP) begins a local Internet Protocol (IP) conversation
- How a broadcast domain creates the boundary that makes routing necessary
- Optional context about virtual local area networks (VLANs)

## Frames and MAC Addresses

At layer 2, the unit of data is a [frame](/appendix/glossary/#frame), and the addresses are [media access control (MAC) addresses](/appendix/glossary/#media-access-control-address-mac-address).

A typical Ethernet MAC address is 48 bits, usually written as six pairs of hexadecimal digits like `00:1A:2B:3C:4D:5E`. The address belongs to a network interface rather than to the entire machine, so a laptop with Wi-Fi and Ethernet has a separate address for each interface.

For many globally assigned addresses, a prefix registered by the Institute of Electrical and Electronics Engineers (IEEE) identifies the organization that received the address block. However, operating systems can use locally administered or randomized MAC addresses. A prefix can provide a clue about a device, but it does not always identify its manufacturer.

The critical property is scope. A MAC address only has meaning on the local segment. It never crosses a router. Recall the point from Module 1, where the IP addresses stay fixed for the whole journey while the Ethernet header is rebuilt at every hop. MAC addresses are what live in that rebuilt header.

To see your own:

```text
ipconfig /all
```

Look for **Physical Address**. On Linux use `ip link`, and on macOS use `ifconfig`.

## How a Switch Learns

A switch connects devices on a local network. The physical sockets where network cables connect are called ports. You normally do not have to tell the switch which device is connected to each port. It learns those locations automatically by reading the source MAC addresses in the frames it receives.

This automatic learning does not mean that a switch has no configuration. A managed switch can also be configured for security, separate networks, or fixed MAC-address entries.

When a frame arrives, the switch reads the source MAC address and records which port it came from. This builds a MAC address table that maps addresses to ports.

When a frame needs forwarding, the switch looks up the destination MAC address in that table.

- If the address is in the table, the switch forwards the frame toward the recorded port.
- If it is not, the switch floods the frame to the other ports in the same layer 2 network. When the destination sends a frame, the switch learns its location from that frame's source address.

This simplified learning process explains a useful diagnostic fact. A switch normally does not send one device unicast traffic intended for another device. A packet capture therefore usually shows your own traffic, broadcasts, and some multicast or unknown-destination traffic rather than every conversation on the network.

Some switches, called layer 3 switches, can also route traffic between IP networks. They still use MAC-address learning when switching local traffic. Module 5 covers routing.

## ARP

Here is the gap. Your machine wants to reach `10.0.20.15`. It has an IP address for the destination, but the frame it is about to build needs a MAC address. It does not have one.

The [Address Resolution Protocol (ARP)](/appendix/glossary/#address-resolution-protocol-arp) fills that gap.

1. Your machine broadcasts an ARP request to every device on the segment, asking who has `10.0.20.15`.
2. Every machine receives it. The one holding that address replies directly with its MAC address.
3. Your machine stores the answer in its ARP cache and builds the frame.
4. Subsequent traffic skips this step until the cache entry expires.

The request is a broadcast because your machine has no idea which device to ask. The reply is unicast, because by then the responder knows exactly who asked.

To see your cache:

```text
arp -a
```

On Linux use `ip neigh`.

This is worth internalizing because ARP failures do not look like ARP failures. When a machine cannot reach something on its own subnet and everything else looks correct, an empty or wrong ARP entry is a strong suspect.

## Broadcast Domains

ARP works by broadcasting, and broadcasts have a limit. The set of devices that receive each other's broadcasts is a [broadcast domain](/appendix/glossary/#broadcast-domain).

Switches forward broadcasts. Routers do not. That single difference defines the boundary.

Everything inside one broadcast domain can be reached by ARP, and therefore directly by MAC address. Anything outside it cannot be, no matter how correct the IP address is. To reach it, your machine has to hand the frame to a router instead, which is exactly the subject of Module 5.

Broadcast domains also explain why networks get divided. Every device in a domain processes its broadcast traffic, and one misbehaving device can affect the entire domain. An appropriate size depends on the traffic, devices, failure boundaries, and operational design rather than one universal device count.

## VLANs

:::note[Optional: Role-Specific]
Virtual local area networks are common in systems and network administration, but their configuration is not required for the core path.
:::

A [virtual local area network (VLAN)](/appendix/glossary/#virtual-local-area-network-vlan) lets one physical switch carry several separate networks. Each port is assigned to a VLAN, and the switch does not forward traffic from one VLAN to ports in another.

The effect is that each VLAN is its own broadcast domain, with its own ARP traffic, isolated from the others even though they share hardware. Moving traffic between VLANs requires a router, exactly as if they were on separate switches.

The link between two switches is the one place a single port carries more than one VLAN. Each frame crossing it is tagged with the VLAN it belongs to, so the switch at the far end can sort it back out.

Configuring VLANs is vendor-specific, so this guide stops at the concept. The underlying standard is IEEE 802.1Q, and the Further Learning section below points to a fuller explanation and to a free simulator where you can configure VLANs yourself.

## Try It Yourself

:::note[Optional Practice]
This exercise makes the Address Resolution Protocol exchange visible but is not required to continue.
:::

Watch ARP happen on your own machine.

1. Open Wireshark and start capturing on your active interface.
2. Set the display filter to `arp`.
3. Open a Command Prompt as administrator and clear the cache:

   ```text
   arp -d *
   ```

4. Now check your default gateway's address:

   ```text
   ipconfig
   ```

5. Ping the gateway address shown in that output.
6. In Wireshark you should see a request asking who has that address, followed by a reply.
7. Run `arp -a` and confirm the entry is back in your cache.

You just watched your machine discover, at layer 2, the hardware address of the device it uses for everything outside your network.

:::tip[Optional Lab]
Do the same thing between WINCLIENT and LINUXBOX. Find each machine's address with `ipconfig` and `ip addr`, clear the ARP cache on WINCLIENT, then ping LINUXBOX and capture the exchange.

Then compare the two entries in the cache. The gateway and LINUXBOX are both reachable by ARP, which tells you they are in the same broadcast domain. Anything on the internet will not appear in that cache at all, no matter how much traffic you send it.
:::

## Further Learning

- [Request for Comments (RFC) 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/info/rfc826/) is the original ARP specification, and it is short enough to read in one sitting.
- [arp command reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp) documents the Windows options for viewing, adding, and deleting cache entries.
- [IEEE Registration Authority: MAC Address Block Large](https://standards.ieee.org/products-programs/regauth/oui/) explains how organizational prefixes are used to create globally unique MAC addresses.
- [National Institute of Standards and Technology switch glossary entry](https://csrc.nist.gov/glossary/term/switch) provides a concise definition of a network switch.
- [Cisco Packet Tracer](https://www.netacad.com/cisco-packet-tracer) lets you build switches, assign ports to VLANs, and configure trunk links in a simulator. It is free, though Cisco distributes it only through a no-cost Networking Academy account. The commands are Cisco-specific, but the behavior you observe is not.
- [Virtual Local Area Networks (VLANs)](https://www.practicalnetworking.net/stand-alone/vlans/) by Ed Harmoush at Practical Networking covers access ports, trunk ports, tagging, and the native VLAN, and it maps the Cisco terms to the tagged and untagged terms other vendors use. Free to read and there is a video version at the bottom if you learn better that way.

## Main Takeaways

- Switches use Media Access Control (MAC) address tables to forward frames within a local network.
- The Address Resolution Protocol (ARP) maps local IPv4 addresses to MAC addresses.
- Routers forward packets between different IP networks, from nearby subnets to networks across the internet.

Continue to Module 4, where addressing determines whether a destination is inside your broadcast domain at all.
