---
title: "Module 3: The Local Network"
description: Ethernet frames, MAC addresses, switching, ARP, and broadcast domains.
---

Before data can go anywhere in the world, it has to get off your machine and onto the wire. This module covers the layer 2 hop, which is everything that happens inside your own network segment.

This is also where a common misunderstanding gets cleared up. People often think an IP address is how one machine finds another. On your local network, it is not. It is how the conversation gets started, but the actual delivery uses something else entirely.

## In This Module

- What a MAC address identifies, and how it differs from an IP address
- How a switch learns where devices are
- ARP, and why every local IP conversation begins with a layer 2 question
- Broadcast domains, and the boundary that makes routing necessary
- A conceptual look at VLANs

## Frames and MAC Addresses

At layer 2, the unit of data is a frame, and the addresses are media access control (MAC) addresses.

A MAC address is 48 bits, usually written as six pairs of hex digits like `00:1A:2B:3C:4D:5E`. It is assigned to the network interface itself rather than to the machine, so a laptop with Wi-Fi and Ethernet has two of them.

The first three bytes identify the manufacturer and come from a block registered with the Institute of Electrical and Electronics Engineers (IEEE). The remaining three are assigned by that manufacturer. That is why you can often tell what kind of device you are looking at from its MAC address alone, which is useful when you are staring at an unfamiliar network.

The critical property is scope. A MAC address only has meaning on the local segment. It never crosses a router. Recall the point from Module 1, where the IP addresses stay fixed for the whole journey while the Ethernet header is rebuilt at every hop. MAC addresses are what live in that rebuilt header.

To see your own:

```text
ipconfig /all
```

Look for **Physical Address**. On Linux use `ip link`, and on macOS use `ifconfig`.

## How a Switch Learns

A switch has no configuration telling it where anything is. It works it out by watching.

When a frame arrives, the switch reads the source MAC address and records which port it came from. That builds a table mapping addresses to ports.

When a frame needs forwarding, the switch looks up the destination MAC address in that table.

- If the address is in the table, the frame goes out that one port only.
- If it is not, the switch floods the frame out every port except the one it arrived on. Whichever device replies teaches the switch where it lives, and the next frame is forwarded normally.

This is the whole algorithm, and it explains a useful diagnostic fact. A switch normally does not send you traffic destined for other machines, which is why a packet capture on a switched network shows your own traffic plus broadcasts rather than everything on the network.

The older device this replaced was a hub, which repeated every frame to every port with no table at all. Hubs are gone, but the vocabulary survives in phrases like putting a port "in hub mode" for monitoring.

## ARP

Here is the gap. Your machine wants to reach `10.0.20.15`. It has an IP address for the destination, but the frame it is about to build needs a MAC address. It does not have one.

The Address Resolution Protocol (ARP) fills that gap.

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

ARP works by broadcasting, and broadcasts have a limit. The set of devices that receive each other's broadcasts is a broadcast domain.

Switches forward broadcasts. Routers do not. That single difference defines the boundary.

Everything inside one broadcast domain can be reached by ARP, and therefore directly by MAC address. Anything outside it cannot be, no matter how correct the IP address is. To reach it, your machine has to hand the frame to a router instead, which is exactly the subject of Module 5.

Broadcast domains also explain why networks get divided up at all. Every device in a domain processes every broadcast in it. A few hundred machines is fine. A few thousand wastes real time on every one of them, and one misbehaving device affects everybody.

## VLANs, Briefly

A virtual local area network (VLAN) lets one physical switch carry several separate networks. Ports are assigned to a VLAN, and frames in one VLAN are never forwarded to ports in another.

The effect is that each VLAN is its own broadcast domain, with its own ARP traffic, isolated from the others even though they share hardware. Moving traffic between VLANs requires a router, exactly as if they were on separate switches.

That is as far as this guide goes on VLANs. Configuring them is vendor-specific, and the concept is what matters for understanding a network you did not build.

## Try It Yourself

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

- [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/info/rfc826/) is the original ARP specification, and it is short enough to read in one sitting.
- [arp command reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp) documents the Windows options for viewing, adding, and deleting cache entries.
- [MAC address](https://en.wikipedia.org/wiki/MAC_address) covers address structure, the manufacturer prefix, and the difference between unicast, multicast, and broadcast addresses.
- [Network switch](https://en.wikipedia.org/wiki/Network_switch) covers switch behavior, address tables, and how switching compares with the hubs it replaced.

## Checklist Before Moving On

- [ ] You can find your own MAC address and explain why it differs from your IP address
- [ ] You can describe how a switch builds its address table
- [ ] You can explain why an ARP request is broadcast but the reply is not
- [ ] You viewed your ARP cache and watched an entry get created
- [ ] You can state what defines the edge of a broadcast domain
- [ ] You understand why a VLAN needs a router to reach another VLAN

Continue to Module 4, where addressing determines whether a destination is inside your broadcast domain at all.
