---
title: "Module 7: Transport, Ports, and Sockets"
description: How ports identify network services, how TCP establishes reliable connections, and how UDP sends independent messages.
---

An Internet Protocol (IP) address gets network traffic to the correct device. A device may be running a web browser, an email client, a game, and many background services at the same time. The operating system still needs to deliver each piece of incoming data to the correct application.

Transport protocols and port numbers provide that next level of identification.

## In This Module

- How IP addresses and port numbers perform different jobs
- How one server handles many connections on the same port
- What a socket is
- How the Transmission Control Protocol (TCP) starts, maintains, and closes a connection
- How the User Datagram Protocol (UDP) differs from TCP
- How to view listening ports and current connections

## IP Addresses and Ports Do Different Jobs

Imagine the Windows 11 virtual machine named WINCLIENT opening a Secure Shell (SSH) connection to the Linux Mint virtual machine named LINUXBOX.

| Connection field | Example value | What it identifies |
| --- | --- | --- |
| Transport protocol | TCP | The transport rules used for the connection |
| Source Internet Protocol version 4 (IPv4) address | `10.0.20.15` | The Windows 11 virtual machine named WINCLIENT |
| Source TCP port | `51514` | A temporary port selected by WINCLIENT |
| Destination IPv4 address | `10.0.20.25` | The Linux virtual machine named LINUXBOX |
| Destination TCP port | `22` | The SSH service running on LINUXBOX |

The connection can be written in a shortened form:

```text
WINCLIENT: 10.0.20.15:51514 -> LINUXBOX: 10.0.20.25:22
```

In that line, the colon separates an IPv4 address from a port number. It does not mean that `10.0.20.15:51514` is one large address.

The source port is temporary. WINCLIENT's operating system selects it so replies can be delivered to the application that started the connection. The destination port is where the SSH server is waiting for connections.

When LINUXBOX replies, the source and destination are reversed:

```text
LINUXBOX: 10.0.20.25:22 -> WINCLIENT: 10.0.20.15:51514
```

## How Port Numbers Work

A [port number](/appendix/glossary/#port) is a 16-bit value from `0` through `65535`. TCP and UDP maintain separate port-number spaces. TCP port 53 and UDP port 53 are therefore different endpoints, even though both are commonly used by the Domain Name System (DNS).

The Internet Assigned Numbers Authority (IANA) divides port numbers into three ranges:

| Port range | IANA name | Common description |
| --- | --- | --- |
| `0–1023` | System Ports | Ports assigned to widely used services |
| `1024–49151` | User Ports | Ports available for registered services and applications |
| `49152–65535` | Dynamic or Private Ports | Ports commonly available for temporary or private use |

Operating systems select temporary, or **[ephemeral](/appendix/glossary/#ephemeral-port)**, client ports automatically. The exact range used by an operating system can differ from the IANA Dynamic or Private range.

Some port numbers are worth recognizing:

| Service | Common port | Transport |
| --- | --- | --- |
| File Transfer Protocol (FTP) and explicit File Transfer Protocol Secure (FTPS) control connection | 21 | TCP |
| SSH remote access, SSH File Transfer Protocol (SFTP), and Secure Copy Protocol (SCP) | 22 | TCP |
| DNS name resolution | 53 | UDP and TCP |
| Dynamic Host Configuration Protocol version 4 (DHCPv4) address assignment | 67 for servers and 68 for clients | UDP |
| Hypertext Transfer Protocol (HTTP) web traffic | 80 | TCP |
| Network Time Protocol (NTP) time synchronization | 123 | UDP |
| Hypertext Transfer Protocol Secure (HTTPS) web traffic | 443 | Usually TCP; HTTP/3 uses QUIC over UDP |
| Server Message Block (SMB) Windows file sharing | 445 | TCP |
| Remote Desktop Protocol (RDP) Windows remote desktop | 3389 | TCP and UDP |

These numbers are conventions, not restrictions. An administrator can configure an SSH server to listen on TCP port 2222, for example. A port number is a useful clue about the expected service, but it does not prove which application is running or whether the traffic is safe.

Both DHCPv4 port numbers matter. A client sends DHCP messages to UDP port 67 on the server. The server sends messages to UDP port 68 on the client.

Do not confuse similarly named file-transfer protocols:

- **SFTP** is the SSH File Transfer Protocol. It normally runs through SSH on TCP port 22.
- **FTPS** is FTP protected with Transport Layer Security (TLS). Explicit FTPS begins on the normal FTP control port, TCP 21.

## Sockets and Connection Identity

A **[socket](/appendix/glossary/#socket)** is a communication endpoint created and managed by the operating system. An application uses a socket to send or receive network data.

A listening server socket is associated with a transport protocol, a local address, and a local port. A connected TCP session has both a local endpoint and a remote endpoint.

The following four values identify one TCP connection:

```text
Source IP address:      10.0.20.15
Source TCP port:        51514
Destination IP address: 10.0.20.25
Destination TCP port:   22
```

These values are commonly called the TCP **[4-tuple](/appendix/glossary/#4-tuple)**. When the transport protocol is included, network tools and firewall rules often refer to a **[5-tuple](/appendix/glossary/#5-tuple)**.

A server can support many clients on one listening port because every connection has a different four-tuple. Two clients may both connect to `10.0.20.25:22`, but their source addresses, source ports, or both will differ.

## TCP: An Ordered, Reliable Stream

[Transmission Control Protocol (TCP)](/appendix/glossary/#transmission-control-protocol-tcp) is connection-oriented. The two endpoints establish a connection before exchanging application data.

TCP provides:

- Data delivered to the application in order
- Detection and retransmission of missing data
- Flow control so a fast sender does not overwhelm the receiver
- Congestion control so senders respond to network conditions

TCP presents data to the application as a continuous stream of bytes. It does not preserve the boundaries between individual writes made by the sending application.

### The Three-Way Handshake

TCP normally establishes a connection with three packets. For the SSH example:

The flags used here are synchronize (SYN) and acknowledgment (ACK).

| Step | TCP flags | Direction | Meaning |
| --- | --- | --- | --- |
| 1 | SYN | WINCLIENT `10.0.20.15:51514` → LINUXBOX `10.0.20.25:22` | WINCLIENT requests a new connection |
| 2 | SYN, ACK | LINUXBOX `10.0.20.25:22` → WINCLIENT `10.0.20.15:51514` | LINUXBOX accepts and acknowledges the request |
| 3 | ACK | WINCLIENT `10.0.20.15:51514` → LINUXBOX `10.0.20.25:22` | WINCLIENT acknowledges the response |

SYN and ACK are control flags in the TCP header. After the third step, the connection is established and the applications can exchange data.

TCP numbers the bytes in its stream. The receiver acknowledges what arrived, and the sender retransmits data that is not acknowledged. Sequence numbers also let the receiver place data back in order if packets take different paths or arrive out of order.

Reliable delivery does not mean that a connection will always succeed. If the network remains unavailable, TCP eventually reports a failure. TCP also does not encrypt data or prove that the receiving application processed it successfully.

### Closing or Rejecting a Connection

A normal TCP close uses the finish (FIN) and ACK flags so each endpoint can finish sending and acknowledge the other side. A reset (RST) in a packet capture ends or rejects a connection immediately. One common reason for a reset is reaching a device successfully when no application is listening on the requested TCP port.

## UDP: Independent Datagrams

[User Datagram Protocol (UDP)](/appendix/glossary/#user-datagram-protocol-udp) is connectionless. It sends each application message as an independent datagram without first performing a handshake.

UDP itself does not:

- Confirm that a datagram arrived
- Retransmit a missing datagram
- Put datagrams back in order
- Prevent duplicate delivery

That does not make UDP defective or limited to unreliable applications. An application can add the confirmation, retransmission, timing, or ordering behavior it needs. QUIC, the transport used by HTTP/3, builds features such as reliable delivery and security above UDP.

UDP is useful when a short request and response is sufficient, when broadcasting is required, or when late data would no longer be useful. DNS queries, DHCP, live voice, and online games are common examples.

| Behavior | TCP | UDP |
| --- | --- | --- |
| Connection setup | Three-way handshake | No transport handshake |
| Delivery and ordering | Built into TCP | Must be handled by the application if needed |
| Data presented as | Byte stream | Separate datagrams |
| Transport overhead | More state and control traffic | Less built-in state and control traffic |
| Typical uses | SSH, web traffic, email | DNS queries, DHCP, real-time media |

The application chooses the transport that fits its requirements. UDP is not automatically faster in every situation, and TCP is not automatically the better choice whenever data matters.

## Listening Ports and Active Connections

A **[listening socket](/appendix/glossary/#listening-socket)** waits for new traffic on a local port. An **established connection** represents an active TCP conversation between a local endpoint and a remote endpoint.

Example entries might look like:

```text
TCP  0.0.0.0:22          LISTEN
TCP  10.0.20.25:22       10.0.20.15:51514       ESTABLISHED
```

In the first line, `0.0.0.0:22` means the service is listening on TCP port 22 on every local IPv4 interface. It does not mean that the remote address is `0.0.0.0`.

Common TCP states include:

| State | Meaning |
| --- | --- |
| LISTEN or LISTENING | A service is waiting for new connections |
| SYN_SENT | The local device sent a connection request and is waiting |
| ESTABLISHED | The TCP handshake completed |
| TIME_WAIT | A recently closed connection is waiting for delayed packets to expire |

TIME_WAIT is a normal part of TCP cleanup. Seeing it does not by itself indicate a fault.

On Windows, display connections, listening ports, numeric addresses, and process IDs:

```text
netstat -ano
```

On Linux, display listening TCP and UDP sockets without resolving names:

```text
ss -lntu
```

Display current TCP connections on Linux:

```text
ss -tn
```

UDP has no handshake and therefore does not have TCP states such as SYN_SENT or ESTABLISHED.

## Try It Yourself

Run the command for your operating system and choose one listening entry.

Identify:

1. Whether it uses TCP or UDP
2. The local IP address
3. The local port number
4. Whether it listens on one address or every local address
5. The process ID, if the command displays one

Do not stop or reconfigure an unfamiliar process merely because it has a listening socket. First identify what owns it and why it is running.

:::tip[Optional Lab: Capture a TCP Handshake]
This exercise uses the SSH server already installed on the Linux Mint virtual machine named LINUXBOX and stays entirely within NETLAB.

1. On LINUXBOX, record its NETLAB IPv4 address and confirm that SSH is listening on TCP port 22:

   ```text
   ip -4 addr
   ss -lnt
   ```

2. On LINUXBOX, start a packet capture:

   ```text
   sudo tcpdump -n -i any 'tcp port 22'
   ```

3. On the Windows 11 virtual machine named WINCLIENT, open PowerShell and replace `<LINUXBOX-IP>` with the address from step 1:

   ```powershell
   Test-NetConnection <LINUXBOX-IP> -Port 22
   ```

4. Confirm that PowerShell reports `TcpTestSucceeded : True`.
5. Return to LINUXBOX and press **Ctrl+C** to stop the capture.
6. Find the first three TCP packets in the output:
   - `Flags [S]` is the SYN from WINCLIENT.
   - `Flags [S.]` is the SYN and ACK from LINUXBOX.
   - `Flags [.]` is the final ACK from WINCLIENT.

`Test-NetConnection` tests whether it can establish the TCP connection. It does not log in to the SSH service.
:::

## Further Learning

- [Request for Comments (RFC) 9293: Transmission Control Protocol](https://www.rfc-editor.org/info/rfc9293/) is the current core TCP specification.
- [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/info/rfc768/) defines UDP.
- [RFC 8095: Services Provided by Internet Engineering Task Force (IETF) Transport Protocols](https://www.rfc-editor.org/info/rfc8095/) compares the behavior offered by TCP, UDP, and other transports.
- [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/info/rfc4253/) documents SSH's normal use of TCP port 22.
- [IANA Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml) lists assigned service names and port ranges.
- [Microsoft Remote Desktop Services port documentation](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/ports-used-by-rds) identifies TCP and UDP port 3389 as the standard RDP port.
- [Microsoft netstat documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat) explains the Windows command and its options.
- [Linux `ss` manual page](https://man7.org/linux/man-pages/man8/ss.8.html) documents socket filters and output options.

## Checklist Before Moving On

- [ ] You can explain the different jobs performed by an IP address and a port number
- [ ] You can identify the source and destination endpoints in an address-and-port pair
- [ ] You know why a client normally uses a temporary source port
- [ ] You can describe the SYN, SYN-ACK, and ACK handshake
- [ ] You can explain the main difference between TCP and UDP
- [ ] You can distinguish a listening socket from an established connection
- [ ] You inspected the listening ports on your computer
- [ ] Optional: You captured the TCP handshake between WINCLIENT and LINUXBOX

Continue to Module 8 to see how DHCP automatically supplies a device with its IP configuration.
