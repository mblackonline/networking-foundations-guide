---
title: Glossary
description: Plain-language definitions and authoritative references for networking terms used throughout the guide.
---

Use this page when you encounter an unfamiliar term. You do not need to memorize every definition.

This glossary provides brief definitions of terms used throughout the guide. Select a linked term for a more detailed reference.

## Numbers

- <span id="4-tuple"></span>**[4-tuple](https://www.rfc-editor.org/info/rfc9293):** The source Internet Protocol (IP) address, source port, destination IP address, and destination port that identify a Transmission Control Protocol (TCP) connection.
- <span id="5-tuple"></span>**[5-tuple](https://csrc.nist.gov/pubs/sp/800/41/r1/final):** A 4-tuple plus the transport protocol, commonly used to describe traffic in firewall rules and network tools.

## A

- <span id="access-control-list-acl"></span>**[Access control list (ACL)](https://csrc.nist.gov/glossary/term/access_control_list):** An ordered or prioritized set of rules that permits or denies traffic. Exact behavior differs between products.
- <span id="acknowledgment-ack"></span>**[Acknowledgment (ACK)](https://en.wikipedia.org/wiki/Acknowledgement_(data_networks)):** A TCP flag used to confirm receipt of data or another TCP message.
- <span id="address-resolution-protocol-arp"></span>**[Address Resolution Protocol (ARP)](https://www.rfc-editor.org/info/rfc826):** The protocol an Internet Protocol version 4 (IPv4) device uses to find the media access control address associated with another local IPv4 address.
- <span id="application-layer"></span>**[Application layer](https://en.wikipedia.org/wiki/Application_layer):** The layer where protocols provide services to applications, such as web access, name resolution, and email.
- <span id="automatic-private-ip-addressing-apipa"></span>**[Automatic Private IP Addressing (APIPA)](https://learn.microsoft.com/en-us/windows-server/troubleshoot/how-to-use-automatic-tcpip-addressing-without-a-dh):** The Windows name for automatically assigning an IPv4 link-local address in `169.254.0.0/16` when normal address configuration is unavailable.
- <span id="authoritative-dns-server"></span>**[Authoritative Domain Name System server](https://en.wikipedia.org/wiki/Name_server#Authoritative_name_server):** A server that holds the official Domain Name System (DNS) records for a domain or zone.

## B

- <span id="backend"></span>**[Backend](https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-components#backend-pools):** A server behind a reverse proxy or load balancer that handles requests. It is also called an upstream server.
- <span id="border-gateway-protocol-bgp"></span>**[Border Gateway Protocol (BGP)](https://en.wikipedia.org/wiki/Border_Gateway_Protocol):** The routing protocol used to exchange reachability information between large networks, including networks that form the internet.
- <span id="broadcast"></span>**[Broadcast](https://en.wikipedia.org/wiki/Broadcasting_(networking)):** Traffic sent to every device in the same broadcast domain.
- <span id="broadcast-address"></span>**[Broadcast address](https://en.wikipedia.org/wiki/Broadcast_address):** The final address in a traditional IPv4 subnet, used to reach all IPv4 hosts on that subnet.
- <span id="broadcast-domain"></span>**[Broadcast domain](https://csrc.nist.gov/glossary/term/virtual_local_area_network):** The group of devices that receive one another's local broadcast traffic. Routers separate broadcast domains.

## C

- <span id="cache"></span>**[Cache](https://en.wikipedia.org/wiki/Cache_(computing)):** A temporary stored copy of information that can be reused instead of requesting it again.
- <span id="carrier-grade-nat-cgnat"></span>**[Carrier-grade network address translation (CGNAT)](https://en.wikipedia.org/wiki/Carrier-grade_NAT):** Network address translation performed by an internet provider so multiple customers can share public IPv4 addresses.
- <span id="certificate"></span>**[Certificate](https://en.wikipedia.org/wiki/Public_key_certificate):** A signed electronic document that connects a name or identity with a public key.
- <span id="certificate-authority-ca"></span>**[Certificate authority (CA)](https://csrc.nist.gov/glossary/term/Certificate_Authority):** An organization or system trusted to issue and sign certificates.
- <span id="classless-inter-domain-routing-cidr"></span>**[Classless Inter-Domain Routing (CIDR)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing):** A way to describe an IP network using an address and prefix length, such as `192.168.10.0/24`.
- <span id="client"></span>**[Client](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview):** A device or application that starts a request or connection to a server.

## D

- <span id="default-deny"></span>**[Default-deny](https://csrc.nist.gov/glossary/term/deny_by_default):** A filtering policy that blocks traffic unless a rule explicitly permits it.
- <span id="default-gateway"></span>**[Default gateway](https://en.wikipedia.org/wiki/Default_gateway):** The router a host sends traffic to when the destination is outside the local subnet.
- <span id="default-route"></span>**[Default route](https://en.wikipedia.org/wiki/Default_route):** The route used when no more specific route matches a destination.
- <span id="dynamic-host-configuration-protocol-dhcp"></span>**[Dynamic Host Configuration Protocol (DHCP)](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol):** A protocol that automatically supplies clients with IP addressing and other network settings.
- <span id="dhcp-lease"></span>**[DHCP lease](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol#Overview):** A time-limited assignment of network settings from a DHCP server to a client.
- <span id="dhcp-relay"></span>**[DHCP relay](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol#Relaying):** A device or service that forwards DHCP messages between clients and a DHCP server on another network.
- <span id="dora"></span>**[Discover, Offer, Request, Acknowledgment (DORA)](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol#Operation):** The four-message exchange commonly used when a client obtains a new DHCP lease for IPv4.
- <span id="domain-name"></span>**[Domain name](https://en.wikipedia.org/wiki/Domain_name):** A name in the DNS hierarchy, such as `example.com`.
- <span id="domain-name-system-dns"></span>**[Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System):** The distributed system that stores information about names, including the IP addresses associated with them.

## E

- <span id="encapsulation"></span>**[Encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(networking)):** The process of adding protocol information around data as it moves down the networking layers.
- <span id="ephemeral-port"></span>**[Ephemeral port](https://www.rfc-editor.org/info/rfc6335):** A temporary source port normally selected by the operating system for a client connection.
- <span id="ethernet"></span>**[Ethernet](https://en.wikipedia.org/wiki/Ethernet):** A common technology for moving frames across a local wired network.
- <span id="egress"></span>**[Egress](https://csrc.nist.gov/glossary/term/egress_filtering):** Traffic leaving a system or network boundary. It is also called outbound traffic.

## F

- <span id="firewall"></span>**[Firewall](https://csrc.nist.gov/glossary/term/firewall):** A control that permits or blocks network traffic according to rules.
- <span id="forward-proxy"></span>**[Forward proxy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Proxy_servers_and_tunneling):** A proxy that makes requests on behalf of clients.
- <span id="frame"></span>**[Frame](https://en.wikipedia.org/wiki/Ethernet_frame):** The unit of data carried across one local link, such as an Ethernet network.

## H

- <span id="health-check"></span>**[Health check](https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview):** A test a load balancer uses to decide whether a backend can receive traffic.
- <span id="host"></span>**[Host](https://www.rfc-editor.org/info/rfc1122):** A device with an IP address that can send or receive network traffic.
- <span id="hostname"></span>**[Hostname](https://www.rfc-editor.org/info/rfc1123):** A name assigned to a host. A hostname may be used as part of a complete domain name.
- <span id="hypertext-transfer-protocol-http"></span>**[Hypertext Transfer Protocol (HTTP)](https://developer.mozilla.org/en-US/docs/Glossary/HTTP):** An application protocol that uses requests and responses to transfer web content and other data.
- <span id="hypertext-transfer-protocol-secure-https"></span>**[Hypertext Transfer Protocol Secure (HTTPS)](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS):** HTTP protected by Transport Layer Security (TLS).

## I

- <span id="internet-assigned-numbers-authority-iana"></span>**[Internet Assigned Numbers Authority (IANA)](https://www.iana.org/about):** The organization that coordinates global protocol-number registries, including service names and port numbers.
- <span id="internet-control-message-protocol-icmp"></span>**[Internet Control Message Protocol (ICMP)](https://www.rfc-editor.org/info/rfc792):** A protocol used for network status and error messages, including messages used by `ping` and `traceroute`.
- <span id="internet-protocol-ip"></span>**[Internet Protocol (IP)](https://www.rfc-editor.org/info/rfc1122):** The protocol that addresses and routes packets between networks.
- <span id="internet-protocol-version-4-ipv4"></span>**[Internet Protocol version 4 (IPv4)](https://www.rfc-editor.org/info/rfc791):** The widely used IP version with 32-bit addresses written as four decimal numbers, such as `192.0.2.10`.
- <span id="internet-protocol-version-6-ipv6"></span>**[Internet Protocol version 6 (IPv6)](https://www.rfc-editor.org/info/rfc8200):** The newer IP version with 128-bit addresses, created to provide a much larger address space.
- <span id="ingress"></span>**[Ingress](https://csrc.nist.gov/glossary/term/Ingress_Filtering):** Traffic entering a system or network boundary. It is also called inbound traffic.

## L

- <span id="layer"></span>**[Layer](https://www.rfc-editor.org/info/rfc1122):** A group of related networking responsibilities. Layer numbers usually refer to the Open Systems Interconnection model.
- <span id="lease"></span>**[Lease](https://www.rfc-editor.org/info/rfc2131):** See **DHCP lease**.
- <span id="listening-socket"></span>**[Listening socket](https://learn.microsoft.com/en-us/windows/win32/winsock/listening-on-a-socket):** A socket waiting for new traffic on a local address and port.
- <span id="load-balancer"></span>**[Load balancer](https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview):** A system that distributes connections or requests among multiple backend servers.
- <span id="loopback"></span>**[Loopback](https://www.rfc-editor.org/info/rfc1122):** A special address used to reach the same host without sending traffic onto a physical network. IPv4 commonly uses `127.0.0.1`.

## M

- <span id="media-access-control-address-mac-address"></span>**[Media access control address (MAC address)](https://csrc.nist.gov/glossary/term/media_access_control_address):** An address used to deliver frames across a local link.
- <span id="maximum-transmission-unit-mtu"></span>**[Maximum transmission unit (MTU)](https://csrc.nist.gov/glossary/term/maximum_transmission_unit):** The largest IP packet an interface can send across a link without IP fragmentation.

## N

- <span id="network-address"></span>**[Network address](https://www.rfc-editor.org/info/rfc4632):** The first address in a traditional IPv4 subnet, used to identify the subnet itself.
- <span id="network-address-translation-nat"></span>**[Network address translation (NAT)](https://www.rfc-editor.org/info/rfc3022):** A gateway function that changes IP addressing information as traffic crosses a network boundary.
- <span id="next-hop"></span>**[Next hop](https://www.rfc-editor.org/info/rfc1812):** The next router or local destination to which a host or router sends a packet.

## O

- <span id="on-link"></span>**[On-link](https://www.rfc-editor.org/info/rfc1122):** Directly reachable on the local network without sending the packet through a router.
- <span id="open-systems-interconnection-osi-model"></span>**[Open Systems Interconnection (OSI) model](https://csrc.nist.gov/glossary/term/open_systems_interconnection):** A seven-layer reference model commonly used to describe where networking functions and problems occur.

## P

- <span id="packet"></span>**[Packet](https://en.wikipedia.org/wiki/Network_packet):** The unit of data carried by IP from a source host toward a destination host.
- <span id="port"></span>**[Port](https://www.rfc-editor.org/info/rfc6335):** A number used by TCP or User Datagram Protocol (UDP) to direct traffic to the correct application or service.
- <span id="port-address-translation-pat"></span>**[Port Address Translation (PAT)](https://www.rfc-editor.org/info/rfc2663):** A form of NAT that translates port numbers as well as addresses, allowing many private connections to share one public IPv4 address.
- <span id="port-forwarding"></span>**[Port forwarding](https://www.rfc-editor.org/info/rfc2663):** A rule that sends traffic arriving at one address and port to a chosen internal address and port.
- <span id="prefix-length"></span>**[Prefix length](https://www.rfc-editor.org/info/rfc4632):** The number after `/` in CIDR notation, showing how many leading address bits identify the network.
- <span id="private-ipv4-address"></span>**[Private IPv4 address](https://www.rfc-editor.org/info/rfc1918):** An address from a range reserved for private networks and not routed across the public internet.
- <span id="proxy"></span>**[Proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server):** A system that accepts one connection and creates another connection on behalf of a client or server.
- <span id="public-ip-address"></span>**[Public IP address](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml):** An IP address that may be globally routed, subject to allocation and network policy.

## R

- <span id="recursive-resolver"></span>**[Recursive resolver](https://www.rfc-editor.org/info/rfc1034):** A DNS server that accepts a client's query, finds the answer, and commonly caches it.
- <span id="request-for-comments-rfc"></span>**[Request for Comments (RFC)](https://www.rfc-editor.org/about/rfc-editor/):** A publication in the RFC series that documents internet standards, protocols, practices, or other technical information.
- <span id="resource-record"></span>**[Resource record](https://www.rfc-editor.org/info/rfc1035):** One item of DNS data, such as an address, mail-server, or alias record.
- <span id="reverse-proxy"></span>**[Reverse proxy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Proxy_servers_and_tunneling):** A proxy that accepts connections on behalf of one or more servers.
- <span id="route"></span>**[Route](https://www.rfc-editor.org/info/rfc1812):** An entry describing how traffic should reach a destination network or host.
- <span id="router"></span>**[Router](https://csrc.nist.gov/glossary/term/router):** A device or system that forwards IP packets between networks.
- <span id="routing-table"></span>**[Routing table](https://en.wikipedia.org/wiki/Routing_table):** The list of routes a host or router uses to select a path.

## S

- <span id="segment"></span>**[Segment](https://www.rfc-editor.org/info/rfc9293):** Depending on context, this can mean a TCP unit of data or a portion of a local network. The linked standard covers the TCP meaning.
- <span id="server"></span>**[Server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview):** A device or application that listens for and responds to client requests.
- <span id="server-name-indication-sni"></span>**[Server Name Indication (SNI)](https://www.rfc-editor.org/info/rfc6066):** Information sent during a TLS connection so a server can select the certificate for the requested hostname.
- <span id="session-persistence"></span>**[Session persistence](https://learn.microsoft.com/en-us/azure/load-balancer/distribution-mode-concepts):** A load-balancing behavior that repeatedly sends one client's traffic to the same backend. It is also called a sticky session.
- <span id="socket"></span>**[Socket](https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-start-page-2):** A communication endpoint an application uses to send or receive network data.
- <span id="stateful-firewall"></span>**[Stateful firewall](https://csrc.nist.gov/glossary/term/stateful_inspection):** A firewall that remembers active network flows and can recognize their return traffic.
- <span id="stateless-filter"></span>**[Stateless filter](https://csrc.nist.gov/glossary/term/Packet_Filtering):** A filter that evaluates packets without remembering an active connection.
- <span id="subnet"></span>**[Subnet](https://www.rfc-editor.org/info/rfc4632):** A range of IP addresses that share a network prefix.
- <span id="subnet-mask"></span>**[Subnet mask](https://www.rfc-editor.org/info/rfc950):** An IPv4 value that separates the network portion of an address from the host portion.
- <span id="switch"></span>**[Switch](https://csrc.nist.gov/glossary/term/switch):** A device that forwards frames between devices on a local network using MAC addresses.

## T

- <span id="transmission-control-protocol-tcp"></span>**[Transmission Control Protocol (TCP)](https://www.rfc-editor.org/info/rfc9293):** A connection-oriented transport protocol that provides ordered, reliable byte delivery.
- <span id="tcp-ip"></span>**[TCP/IP](https://www.rfc-editor.org/info/rfc1122):** The family of protocols used by the internet, named for the Transmission Control Protocol and Internet Protocol.
- <span id="transport-layer-security-tls"></span>**[Transport Layer Security (TLS)](https://www.rfc-editor.org/info/rfc9846):** A protocol that protects network traffic with encryption, integrity checking, and authentication.
- <span id="time-to-live-ttl"></span>**[Time to live (TTL)](https://www.rfc-editor.org/info/rfc1122):** In an IP packet, a value reduced by each router to prevent routing loops. In a DNS record, the same abbreviation means how long a cache may reuse that record, as defined in [RFC 1035](https://www.rfc-editor.org/info/rfc1035).

## U

- <span id="upstream-server"></span>**[Upstream server](https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-components#backend-pools):** See **backend**.
- <span id="user-datagram-protocol-udp"></span>**[User Datagram Protocol (UDP)](https://www.rfc-editor.org/info/rfc768):** A connectionless transport protocol that sends datagrams without TCP-style delivery, ordering, or retransmission guarantees.

## V

- <span id="virtual-local-area-network-vlan"></span>**[Virtual local area network (VLAN)](https://csrc.nist.gov/glossary/term/virtual_local_area_network):** A logical network that creates a separate broadcast domain while sharing physical switching equipment.
- <span id="virtual-private-cloud-vpc"></span>**[Virtual private cloud (VPC)](https://csrc.nist.gov/glossary/term/virtual_private_cloud):** A logically isolated virtual network provided by a cloud platform, usually containing subnets, routes, and traffic controls.
- <span id="virtual-private-network-vpn"></span>**[Virtual private network (VPN)](https://csrc.nist.gov/glossary/term/virtual_private_network):** A logical private connection carried across another network, commonly protected with encryption.

## Z

- <span id="zone"></span>**[Zone](https://www.rfc-editor.org/info/rfc1034):** An administratively managed portion of the DNS namespace containing authoritative records.

## Source and Copyright Note

This page links to source material; it does not reproduce source text, tables, or images. External material remains subject to its own copyright and license terms and is not included under this guide's MIT License.

The RFC Editor publishes an [information page for each RFC](https://www.rfc-editor.org/info/rfc9293), which is the stable landing page this glossary links to. [IANA's protocol registries use a Creative Commons Zero (CC0) public-domain dedication](https://www.iana.org/help/licensing-terms). [NIST describes most information on its sites as public information](https://www.nist.gov/copyrights-disclaimers). [Microsoft permits plain-text links to its content](https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/permissions).
