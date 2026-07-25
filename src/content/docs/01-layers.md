---
title: "Module 1: How Networks Are Layered"
description: The TCP/IP and OSI models, encapsulation, and how to use layers as a troubleshooting map.
---

Networking looks like a pile of unrelated facts until you see the structure underneath it. That structure is layering, and it is the single idea that makes everything else in this guide fit together.

Every module that follows sits at one layer or another. Once you know where a topic lives, you know what it can and cannot explain, and you know where to look when something breaks.

## In This Module

- Why networks are built in layers at all
- The four layers of the TCP/IP model
- The OSI model, and how it maps onto TCP/IP
- Encapsulation, or what wraps what as data leaves your machine
- Using layers as a deliberate troubleshooting order

## Why Layers Exist

Think about mailing a letter. You write it, put it in an envelope, address the envelope, and drop it in a box. You do not know which trucks carry it, which sorting facilities it passes through, or whether part of the trip happens by plane. You do not need to know. The postal system handles delivery, and you handle the message.

Networks work the same way, and for the same reason. Each layer solves one problem and trusts the layer below it to solve the next one down.

The payoff is that layers can change independently. Your web browser works identically over Wi-Fi, over Ethernet, and over a mobile connection, because the browser never deals with radios or cables. Someone can invent a faster physical medium without anyone rewriting web servers.

The other payoff is the one you will use daily. When something breaks, layers tell you where to look.

## The TCP/IP Model

This is the model the internet actually runs on. It takes its name from the Transmission Control Protocol (TCP) and the Internet Protocol (IP), and it has four layers.

| Layer | Its job | Examples |
| --- | --- | --- |
| Application | Do something useful for the user | HTTP, DNS, SSH, SMTP |
| Transport | Deliver data to the right program, reliably or not | TCP, UDP |
| Internet | Get a packet from one network to another | IP, ICMP |
| Link | Move data across one physical hop | Ethernet, Wi-Fi, ARP |

The examples above in full are the Hypertext Transfer Protocol (HTTP), the Domain Name System (DNS), Secure Shell (SSH), the Simple Mail Transfer Protocol (SMTP), the User Datagram Protocol (UDP), the Internet Control Message Protocol (ICMP), and the Address Resolution Protocol (ARP). Each one gets its own treatment later.

Read it from the bottom up and it tells a story. The link layer moves data between two devices that can see each other directly. The internet layer chains those hops together so data can cross networks it has never seen. The transport layer makes sure it reaches the right program on the far machine. The application layer does something meaningful with it.

## The OSI Model

The Open Systems Interconnection (OSI) model is older, has seven layers, and describes roughly the same thing in more detail.

| OSI layer | Name | Maps to TCP/IP |
| --- | --- | --- |
| 7 | Application | Application |
| 6 | Presentation | Application |
| 5 | Session | Application |
| 4 | Transport | Transport |
| 3 | Network | Internet |
| 2 | Data Link | Link |
| 1 | Physical | Link |

You will meet both models, and the reason is worth knowing. Systems are built to the TCP/IP model, but people talk using OSI numbers. Someone says a load balancer is "layer 7" or that a problem is "layer 3", and they mean the OSI numbering.

For practical work, four numbers carry almost all the conversation.

- **Layer 1** is the physical side, cables, radios, and ports
- **Layer 2** is the local hop, media access control (MAC) addresses and switches
- **Layer 3** is addressing and routing, IP
- **Layer 4** is ports and connections, TCP and UDP
- **Layer 7** is the application itself, usually HTTP

Layers 5 and 6 come up rarely in day-to-day work. Do not spend memorization effort there.

## Encapsulation

Encapsulation is what layering looks like in practice. As your data heads down the stack, each layer wraps it in a header carrying the information that layer needs.

Say your browser requests a web page.

1. The **application** layer produces the HTTP request, the actual text of what you want.
2. The **transport** layer wraps it in a TCP header carrying the source and destination ports, which identify the programs on each end. The result is a segment.
3. The **internet** layer wraps that in an IP header carrying the source and destination IP addresses, which identify the machines. The result is a packet.
4. The **link** layer wraps that in an Ethernet header carrying MAC addresses, which identify the next device on the local network. The result is a frame.
5. The frame goes out as electrical signals, light, or radio waves.

On the receiving machine the process runs in reverse. Each layer strips its own header, reads it, and hands the contents up.

One detail here explains a great deal of later material. The IP addresses stay the same for the whole journey, but the Ethernet header is rebuilt at every hop. Each router strips the frame it received, decides where the packet goes next, and builds a new frame for that next hop. The envelope changes repeatedly. The letter inside does not.

That is why MAC addresses only matter locally and IP addresses matter end to end, and it is the reason Modules 3 and 5 are separate topics.

## Layers as a Troubleshooting Order

Working the layers in order is faster than guessing, because a working upper layer means nothing if a lower one is broken. There is no point testing a web request from a machine with no IP address.

Start at the bottom and stop at the first thing that fails.

| Layer | Question to answer | Covered in |
| --- | --- | --- |
| 1 and 2 | Is there a link, and can I reach anything locally? | Module 3 |
| 3 | Do I have a valid address, and do I know how to leave my network? | Modules 4 and 5 |
| 3 | Is address translation involved? | Module 6 |
| 4 | Is the port open, and is something listening? | Module 7 |
| Support | Did I get my settings automatically, and are they right? | Module 8 |
| Support | Does the name resolve to the address I expect? | Module 9 |
| 7 | Is the application itself answering correctly? | Module 10 |
| Any | Is something deliberately blocking this? | Modules 11 and 12 |

That table is also a map of this guide. Module 13 turns it into a repeatable method.

## Try It Yourself

You can watch two different layers succeed and fail independently using tools already on your computer.

Open a Command Prompt on Windows, or a terminal on Linux or macOS, and run:

```text
ping example.com
```

That is a layer 3 test. It asks whether packets can reach the machine and come back. It says nothing about whether a website is running there.

Now run:

```text
curl -I https://example.com
```

That is a layer 7 test. It asks the web server to respond to an actual HTTP request.

The useful case is when these disagree. A host that answers ping but refuses the HTTP request is reachable but not serving, which points at the application or a filter, not at the network. A host that fails both is more likely a routing, addressing, or name resolution problem. That distinction alone will save you hours later.

:::note
Some hosts are configured not to answer ping at all. A failed ping is evidence, not proof. Module 13 covers what each tool actually proves.
:::

## Further Learning

These optional references go deeper than this module needs.

- [RFC 1122: Requirements for Internet Hosts](https://www.rfc-editor.org/info/rfc1122/) is the specification that defines the internet layering model and what each layer is responsible for.
- [What is the OSI Model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/) walks all seven layers with an example message travelling down and back up the stack.
- [What is the network layer?](https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/) explains headers, packets, and how the OSI and TCP/IP models compare.
- If you prefer video, Ed Harmoush's [Networking Fundamentals YouTube series](https://www.youtube.com/playlist?list=PLIFyRwBY_4bRLmKfP1KnZA6rZbRHtxmXi) is one of my favorites and covers a wide range of topics.

## Checklist Before Moving On

- [ ] You can name the four TCP/IP layers and what each one does
- [ ] You know what layers 2, 3, 4, and 7 refer to in conversation
- [ ] You can explain why a router changes the Ethernet header but not the IP addresses
- [ ] You know why troubleshooting works from the bottom layer upward
- [ ] `ping` and `curl` both ran on your machine, and you understand why they test different things

Continue to Module 2 to set up the tools used throughout the guide, and optionally build the lab.
