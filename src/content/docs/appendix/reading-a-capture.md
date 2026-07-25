---
title: Reading a Packet Capture
description: Use Wireshark to answer common networking questions without learning every feature.
---

A packet capture records network traffic seen by one interface. Wireshark displays that traffic one packet at a time.

You do not need to understand every packet. Start with one question:

- Did the client ask the Domain Name System (DNS) server for an address?
- Did the server answer?
- Did a Transmission Control Protocol (TCP) connection start?
- Did either device end or reject the connection?

Capture only traffic you own or are authorized to inspect.

## Choose the Right Interface

An **interface** is the connection that carries the traffic. Common examples include Wi-Fi, Ethernet, a virtual private network (VPN), and a VirtualBox network adapter.

Before starting:

1. Find the interface whose activity graph changes when you use the network.
2. Check that the interface has the Internet Protocol (IP) address you expect.
3. Start the capture, generate one known request, and confirm that new packets appear.

If a laptop reaches the internet through Wi-Fi, capturing on an unused Ethernet interface will not show that traffic. Traffic between virtual machines may use a VirtualBox interface instead.

A capture also shows only one point of view. A capture on the client proves what the client sent and received. It does not prove what reached the server or what an intermediate firewall discarded.

## Capture Filters and Display Filters

Wireshark has two different kinds of filters:

| Filter type | When it acts | Example | Important result |
| --- | --- | --- | --- |
| **Capture filter** | While packets are being recorded | `host 10.0.20.25 and port 443` | Packets that do not match are never saved. |
| **Display filter** | After packets have been recorded | `ip.addr == 10.0.20.25 && tcp.port == 443` | All captured packets remain available. Only the current view changes. |

The two filter types use different syntax. A filter that works in one field may not work in the other.

For a short capture on a quiet lab network, beginners can usually leave the capture filter blank. Stop after reproducing the issue once, then use display filters to narrow the view.

## Understand the Three Panes

When you select a packet, Wireshark normally shows three panes:

1. **Packet List:** One row for each packet, including its source, destination, protocol, and summary.
2. **Packet Details:** Expandable sections for Ethernet, IP, TCP, and other protocols.
3. **Packet Bytes:** The raw bytes that created the selected packet. Beginners rarely need to start here.

Begin with the **Info** column in the Packet List. Select an interesting row, then expand only the relevant section in Packet Details.

## Useful Display Filters

Enter a display filter above the Packet List and press Enter.

| What you want to see | Display filter |
| --- | --- |
| Address Resolution Protocol (ARP) traffic | `arp` |
| DNS queries and responses | `dns` |
| Internet Control Message Protocol (ICMP) traffic, including common `ping` traffic | `icmp` |
| Traffic to or from one Internet Protocol version 4 (IPv4) address | `ip.addr == 10.0.20.25` |
| TCP traffic using port 443 | `tcp.port == 443` |
| Packets with the TCP synchronize (SYN) flag | `tcp.flags.syn == 1` |
| Packets with the TCP reset (RST) flag | `tcp.flags.reset == 1` |
| Packets Wireshark identifies as retransmissions | `tcp.analysis.retransmission` |
| DNS responses that report a nonexistent name | `dns.flags.rcode == 3` |

You can combine conditions:

```text
ip.addr == 10.0.20.25 && tcp.port == 443
```

`&&` means **and**. Only packets that meet both conditions are displayed.

## Recognize a TCP Connection

A normal TCP connection begins with a three-step handshake. The flags are synchronize (SYN) and acknowledgment (ACK):

```text
Client  -> Server: SYN
Server  -> Client: SYN, ACK
Client  -> Server: ACK
```

ACK confirms receipt. After the handshake, the applications can exchange data.

Common patterns provide clues:

| What the capture shows | What it suggests |
| --- | --- |
| Repeated SYN packets with no reply | The client sent connection requests but did not see a response. The cause could be packet loss, filtering, routing, or an unavailable destination. |
| SYN followed by RST and ACK | A device replied, but the connection was rejected or nothing was accepting it on that port. |
| The complete handshake | TCP connectivity worked at that moment. The application can still fail afterward. |
| Retransmissions | Wireshark believes data was sent again. Loss or delay may be involved, but an incomplete capture can produce the same clue. |

A graceful TCP close commonly uses the finish (FIN) and ACK flags. An RST ends a connection immediately. Neither flag explains the cause by itself; consider the packets that came before it.

## Recognize a DNS Failure

Apply the `dns` display filter and match each query with its response.

- A response marked **NoError** means the DNS server processed the query without a DNS error. It does not guarantee that the returned address is correct for the application.
- A response marked **Name Error** or **NXDOMAIN** means the requested name does not exist according to that server.
- Repeated queries with no response show that the client did not receive an answer in this capture. They do not identify where the response was lost.

Use `dns.flags.rcode == 3` to show only NXDOMAIN responses. Other DNS failures use different response codes, so this filter does not find every possible DNS problem.

## Follow One Conversation

To isolate one TCP conversation:

1. Select a packet from the connection.
2. Right-click it.
3. Select **Follow**, then **TCP Stream**.

Wireshark applies a display filter for that stream and shows the data in each direction. Close the stream window when finished, then clear the display filter to return to the full capture.

If the application uses Transport Layer Security (TLS), its protected content will normally remain encrypted. The capture can still show addresses, ports, timing, the TCP handshake, and connection failures.

## A Simple Workflow

When investigating a problem:

1. State one question.
2. Capture on the interface carrying the traffic.
3. Reproduce the problem once.
4. Stop the capture.
5. Apply the narrowest useful display filter.
6. Read the packets in time order.
7. Record what the capture proves and what it does not prove.

For example, if a website does not open, first use `dns` to check the name lookup. Then use `tcp.port == 443` to check whether the Hypertext Transfer Protocol Secure (HTTPS) connection begins.

## Protect the Capture

Packet captures can contain names, addresses, credentials, cookies, tokens, and application data. Even encrypted traffic can reveal which systems communicated, when they communicated, and how much data they exchanged.

Keep captures short, store them securely, and review them before sharing. If a capture includes unrelated sensitive traffic, make a new, narrower capture when possible.

## Further Learning

- [Wireshark User's Guide: selecting an interface](https://www.wireshark.org/docs/wsug_html_chunked/ChCapInterfaceSection.html) explains the interface list and activity graphs.
- [Wireshark User's Guide: capture filters](https://www.wireshark.org/docs/wsug_html_chunked/ChCapCaptureFilterSection.html) explains how to limit the packets that are recorded.
- [Wireshark User's Guide: display filters](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html) explains how to narrow the packets currently displayed.
- [Wireshark User's Guide: following protocol streams](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html) covers TCP and other supported stream types.
- [Wireshark Display Filter Reference](https://www.wireshark.org/docs/dfref/) lists fields available to display filters.
