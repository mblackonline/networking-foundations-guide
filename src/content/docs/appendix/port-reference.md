---
title: Port and Protocol Reference
description: Common network ports grouped by the jobs they perform.
---

Use this page as a lookup, not a memorization list. A port number is a clue about the expected service; it does not prove which application is using the port or whether the traffic is safe.

The tables list common destination ports. A client normally connects from a temporary, or [ephemeral](/appendix/glossary/#ephemeral-port), source port.

## Port Number Ranges

[Transmission Control Protocol (TCP)](/appendix/glossary/#transmission-control-protocol-tcp) and [User Datagram Protocol (UDP)](/appendix/glossary/#user-datagram-protocol-udp) each have ports numbered `0` through `65535`. The [Internet Assigned Numbers Authority (IANA)](/appendix/glossary/#internet-assigned-numbers-authority-iana) divides them into three ranges:

| Port range | IANA name | Common description |
| --- | --- | --- |
| `0–1023` | System Ports | Often called well-known ports |
| `1024–49151` | User Ports | Often called registered ports |
| `49152–65535` | Dynamic or Private Ports | Commonly available for temporary or private use |

IANA does not assign Dynamic or Private Ports. Operating systems commonly use this range for client source ports, although the exact ephemeral range depends on the operating system.

## Core Network Services

| Service | Port | Transport | Purpose |
| --- | ---: | --- | --- |
| Domain Name System (DNS) | `53` | UDP and TCP | Resolves names and transfers DNS data |
| Dynamic Host Configuration Protocol version 4 (DHCPv4) server | `67` | UDP | Receives requests from DHCP clients |
| DHCPv4 client | `68` | UDP | Receives replies from a DHCP server |
| Network Time Protocol (NTP) | `123` | UDP | Synchronizes system clocks |

Both DHCP ports matter: clients send to UDP port 67 on the server, and servers send to UDP port 68 on the client.

DNS commonly uses UDP for ordinary queries and TCP when needed, including some large responses and zone transfers. A firewall rule that permits only UDP port 53 can therefore cause inconsistent failures.

## Web Services

| Service | Port | Transport | Purpose and protection |
| --- | ---: | --- | --- |
| Hypertext Transfer Protocol (HTTP) | `80` | TCP | Web traffic without Transport Layer Security (TLS) protection |
| Hypertext Transfer Protocol Secure (HTTPS) | `443` | TCP | HTTP protected by TLS |
| HTTP/3 | `443` | UDP | HTTP carried through QUIC with built-in TLS protection |

Ports `8080` and `8443` are commonly used as alternate web or proxy ports, but their use is a convention rather than proof of HTTP or HTTPS.

## Remote Access and File Services

| Service | Port | Transport | Purpose and protection |
| --- | ---: | --- | --- |
| File Transfer Protocol (FTP) data | `20` | TCP | Default data connection for active-mode FTP |
| File Transfer Protocol (FTP) and explicit File Transfer Protocol Secure (FTPS) control | `21` | TCP | FTP control connection; explicit FTPS can upgrade it to TLS |
| Secure Shell (SSH), SSH File Transfer Protocol (SFTP), and Secure Copy Protocol (SCP) | `22` | TCP | Protected remote access and file transfer |
| Telnet | `23` | TCP | Legacy remote text session without encryption |
| FTP protected by TLS (implicit FTPS) | `990` | TCP | FTPS control connection that begins with TLS |
| Server Message Block (SMB) | `445` | TCP | Windows file sharing, printer sharing, and related services |
| Network File System (NFS) | `2049` | TCP and UDP | File sharing commonly used by Linux and Unix-like systems |
| Remote Desktop Protocol (RDP) | `3389` | TCP and UDP | Windows graphical remote access |
| Windows Remote Management (WinRM) | `5985` | TCP | Windows remote management using HTTP transport |
| WinRM | `5986` | TCP | Windows remote management using HTTPS transport |

### SFTP Is Not FTPS

- **SFTP** runs through SSH, normally on TCP port 22.
- **FTPS** is FTP protected by TLS. Explicit FTPS normally starts on TCP port 21; implicit FTPS commonly uses TCP port 990.

FTP can use additional data ports. Active mode traditionally uses TCP port 20 from the server. Passive mode uses a port selected by the server, so allowing only TCP ports 20 and 21 may not be enough for every FTP configuration.

## Email Services

| Service | Port | Transport | Purpose and protection |
| --- | ---: | --- | --- |
| Simple Mail Transfer Protocol (SMTP) | `25` | TCP | Transfers email between mail servers |
| Message submission over TLS | `465` | TCP | Accepts client email through TLS from the start |
| Message submission | `587` | TCP | Accepts client email; commonly upgrades to TLS with `STARTTLS` |
| Post Office Protocol version 3 (POP3) | `110` | TCP | Retrieves email without TLS by default |
| POP3 over TLS | `995` | TCP | Retrieves email through TLS |
| Internet Message Access Protocol (IMAP) | `143` | TCP | Accesses server-stored email; can upgrade with `STARTTLS` |
| IMAP over TLS | `993` | TCP | Accesses server-stored email through TLS |

Port 25 is normally used for server-to-server delivery. Email clients normally submit outgoing messages on port 465 or 587 according to their provider's configuration.

## Directory and Authentication Services

| Service | Port | Transport | Purpose and protection |
| --- | ---: | --- | --- |
| Kerberos | `88` | TCP and UDP | Network authentication used by environments such as Active Directory |
| Lightweight Directory Access Protocol (LDAP) | `389` | TCP and UDP | Directory queries and updates; TCP connections can upgrade with `STARTTLS` |
| LDAP over TLS, often called LDAPS | `636` | TCP | Directory access protected by TLS from the start |

Active Directory uses several protocols and dynamic ports. Opening only the three ports above is not enough for every domain operation.

## Monitoring and Logging

| Service | Port | Transport | Purpose and protection |
| --- | ---: | --- | --- |
| Simple Network Management Protocol (SNMP) requests | `161` | UDP | Queries and manages network devices |
| SNMP notifications, often called traps | `162` | UDP | Sends device events to a monitoring system |
| Syslog | `514` | UDP | Sends log messages without TLS protection |
| Syslog over TLS | `6514` | TCP | Sends log messages through TLS |

SNMP security depends on its version and configuration. Do not assume that traffic on ports 161 or 162 is encrypted.

## Common Database Defaults

Structured Query Language (SQL) databases commonly use these default ports:

| Database service | Port | Transport |
| --- | ---: | --- |
| Microsoft SQL Server | `1433` | TCP |
| MySQL | `3306` | TCP |
| PostgreSQL | `5432` | TCP |

Database ports are defaults and can be changed. A reachable database port also does not prove that authentication will succeed or that the database is healthy.

## Protocols Without Ports

Not every network protocol uses a TCP or UDP port. The [Internet Control Message Protocol (ICMP)](/appendix/glossary/#internet-control-message-protocol-icmp), used by tools such as `ping`, uses message types instead of port numbers.

When writing a firewall rule, first identify the protocol. Asking for the port number of ICMP traffic is the wrong question.

## A Port Number Is Not a Security Decision

A registered port does not make traffic safe, and seeing a port number does not identify the application with certainty. Services can listen on nonstandard ports, and unrelated applications can use familiar ports.

Do not create a firewall rule or port forward merely because a service appears in this reference. Permit only services that are required, and limit administrative, file-sharing, and database access to the sources that need it.

## Further Learning

- [IANA Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml) is the authoritative registry for assigned service names, ports, and transports.
- [Request for Comments (RFC) 6335: Service Name and Port Number Procedures](https://www.rfc-editor.org/info/rfc6335/) defines the System, User, and Dynamic or Private port ranges.
- [RFC 4253: Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/info/rfc4253/) documents SSH's normal use of TCP port 22.
- [RFC 8314: Cleartext Considered Obsolete](https://www.rfc-editor.org/info/rfc8314/) explains the TLS-protected email submission and access ports.
- [Microsoft Windows service port requirements](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements) lists ports used by Windows Server roles and services.
- [Microsoft Remote Desktop Services port documentation](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/ports-used-by-rds) documents RDP's use of TCP and UDP port 3389.
