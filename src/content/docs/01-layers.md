---
title: "Module 1: How Networks Are Layered"
description: How networking layers organize communication and carry data between applications.
---

Networking can feel like a long list of terms and protocols with nothing giving them structure. Layering is what gives them structure, and much of what follows makes more sense once you understand it.

Cables, addresses, ports, and names all belong to different layers, and each one solves a different part of getting data from one machine to another. Once you know which layer something lives at, you know what it can and cannot explain, and you know where to look when something breaks.

## In This Module

- Why networks are built in layers at all
- The four layers of the Transmission Control Protocol/Internet Protocol (TCP/IP) model
- The Open Systems Interconnection (OSI) model, and how it maps onto TCP/IP
- Encapsulation, or what wraps what as data leaves your machine

## Why Layers Exist

Think about mailing a letter. You write it, put it in an envelope, address the envelope, and drop it in a box. You do not know which trucks carry it, which sorting facilities it passes through, or whether part of the trip happens by plane. You do not need to know. The postal system handles delivery, and you handle the message.

Networks work the same way, and for the same reason. Each layer solves one problem and trusts the layer below it to solve the next one down.

The payoff is that layers can change independently. Your web browser works identically over Wi-Fi, over Ethernet, and over a mobile connection, because the browser never deals with radios or cables. Someone can invent a faster physical medium without anyone rewriting web servers.

The other payoff is the one you will use daily. When something breaks, layers help you narrow down where to look.

## The TCP/IP Model

This is the model the internet actually runs on. It takes its name from the [Transmission Control Protocol (TCP)](/appendix/glossary/#transmission-control-protocol-tcp) and the [Internet Protocol (IP)](/appendix/glossary/#internet-protocol-ip), and it has four layers.

| Layer | Its job | Examples |
| --- | --- | --- |
| Application | Provide network services used by applications | HTTP, DNS, SSH, SMTP |
| Transport | Deliver data to the correct application process | TCP, UDP |
| Internet | Address and route packets between networks | IP, ICMP |
| Link | Deliver frames and resolve addresses on a local link | Ethernet, Wi-Fi, ARP |

Each example gets its own treatment later.

ARP is included in the Link layer because it finds the media access control (MAC) address associated with an IPv4 address on the local network. That MAC address is needed to deliver the frame to the next device.

Read the table from the bottom up and it tells a story.

- The Link layer moves frames between devices on the same local network.
- The Internet layer routes packets between networks.
- The Transport layer delivers data to the correct application on the destination device. TCP provides reliability when it is needed.
- The Application layer provides network services that software can use.

## The OSI Model

The [Open Systems Interconnection (OSI) model](/appendix/glossary/#open-systems-interconnection-osi-model) is older, has seven layers, and describes roughly the same thing in more detail.

| OSI layer | Name | Maps to TCP/IP | What it covers |
| --- | --- | --- | --- |
| 7 | Application | Application | Network services used by applications, including HTTP and DNS |
| 6 | Presentation | Application | Data formatting, encoding, compression, and encryption |
| 5 | Session | Application | Communication sessions between applications |
| 4 | Transport | Transport | Delivery between applications, including TCP, UDP, and port numbers |
| 3 | Network | Internet | IP addressing and routing between networks |
| 2 | Data Link | Link | Frames, MAC addresses, and switches on the local network |
| 1 | Physical | Link | Transmission through cables, radios, and network interfaces |

You will meet both models, and the reason is worth knowing. Systems use the TCP/IP model, but people often use OSI numbers when talking about networking. A load balancer described as "layer 7" works with application traffic. A "layer 3" problem involves IP addressing or routing.

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

That is why MAC addresses are used for delivery on the local network, while IP addresses are used to deliver packets between networks.

## Further Learning

These optional references go deeper than this module needs.

- [Request for Comments (RFC) 1122: Requirements for Internet Hosts](https://www.rfc-editor.org/info/rfc1122/) is the specification that defines the internet layering model and what each layer is responsible for.
- [What is the OSI Model?](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/) walks all seven layers with an example message travelling down and back up the stack.
- [What is the network layer?](https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/) explains headers, packets, and how the OSI and TCP/IP models compare.
- If you prefer video, Ed Harmoush's [Networking Fundamentals YouTube series](https://www.youtube.com/playlist?list=PLIFyRwBY_4bRLmKfP1KnZA6rZbRHtxmXi) is one of my favorites and covers a wide range of topics.

## Checklist Before Moving On

- [ ] You can name the four TCP/IP layers and what each one does
- [ ] You know what layers 2, 3, 4, and 7 refer to in conversation
- [ ] You can explain why a router changes the Ethernet header but not the IP addresses

Continue to Module 2 to set up the tools used throughout the guide, and optionally build the lab.
