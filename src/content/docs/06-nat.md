---
title: "Module 6: Network Address Translation (NAT)"
description: Network address translation, port forwarding, and why inbound is the hard direction.
---

The private Internet Protocol version 4 (IPv4) address on your computer cannot be routed across the public internet. On a typical IPv4 network, a gateway replaces that address with one that can be routed publicly before sending the packet onward.

That replacement is [network address translation (NAT)](/appendix/glossary/#network-address-translation-nat).

## In This Module

- What NAT changes in a packet
- How many private hosts share one public address
- How replies are translated back
- Why inbound connections require configuration
- Port forwarding
- Double NAT and carrier-grade NAT

## One Outbound Request

Imagine a laptop opening a website.

| Device or interface | IPv4 address | Address type |
| --- | --- | --- |
| Laptop requesting the website | `10.0.20.15` | Private |
| NAT gateway's inside interface, the laptop's default gateway | `10.0.20.1` | Private |
| NAT gateway's outside, internet-facing interface | `198.51.100.20` | Public |
| Web server hosting the website | `198.51.100.80` | Public |

The NAT gateway connects the private network to the public internet. Its inside interface communicates with the laptop using private addresses. Its outside interface communicates with the web server using public addresses.

The laptop creates a packet with these IPv4 addresses:

```text
Source IPv4 address (laptop):          10.0.20.15
Destination IPv4 address (web server): 198.51.100.80
```

Because the server is outside the local subnet, the laptop sends the packet to its default gateway at `10.0.20.1`. Before forwarding it to the internet, the gateway replaces the laptop's private source address with the public address of its outside interface, `198.51.100.20`.

| IPv4 packet field | Before NAT | After NAT |
| --- | --- | --- |
| Source IPv4 address | `10.0.20.15` (laptop) | `198.51.100.20` (NAT gateway's outside interface) |
| Destination IPv4 address | `198.51.100.80` (web server) | `198.51.100.80` (web server) |

The source changed. The destination stayed the same.

The web server now sees the request as coming from the NAT gateway's public address, `198.51.100.20`, and sends its reply there. It never sees the laptop's private address, `10.0.20.15`.

:::note
The public addresses in this example come from ranges reserved for documentation. They do not identify real systems.
:::

## How the Reply Gets Back

The reply reaches the NAT gateway, not the laptop directly. The gateway must remember which private device started the request.

It records the translation when the outbound connection begins. When the reply arrives, the gateway changes the destination from its public address back to the laptop's private address and forwards the packet to the laptop.

```text
Outbound packet: Laptop (10.0.20.15) -> NAT gateway -> Web server (198.51.100.80)
Reply packet:    Web server (198.51.100.80) -> NAT gateway -> Laptop (10.0.20.15)
```

This works easily for one device. A real gateway may have many devices making connections at the same time, so it needs another way to keep them separate.

## Sharing One Public Address

Port numbers identify individual network conversations. Module 7 covers them in detail. For now, read `10.0.20.15:51514` as Internet Protocol (IP) address `10.0.20.15` using port `51514`.

For the laptop's Hypertext Transfer Protocol Secure (HTTPS) connection, the complete address-and-port translation might be:

HTTPS normally uses the Transmission Control Protocol (TCP).

| Laptop's private source | Gateway's translated public source | Web server destination |
| --- | --- | --- |
| `10.0.20.15:51514` | `198.51.100.20:40001` | `198.51.100.80:443` |

- `10.0.20.15:51514` is the laptop's private IPv4 address and temporary source port.
- `198.51.100.20:40001` is the NAT gateway's public IPv4 address and translated source port.
- `198.51.100.80:443` is the web server's public IPv4 address and HTTPS destination port.

The gateway records these values in a translation table. A reply sent to the gateway at `198.51.100.20:40001` can then be translated and delivered to the laptop at `10.0.20.15:51514`.

The gateway can give another client a different public port:

| Private client and source port | Gateway's public address and translated port |
| --- | --- |
| Laptop: `10.0.20.15:51514` | NAT gateway: `198.51.100.20:40001` |
| Second client: `10.0.20.25:51514` | NAT gateway: `198.51.100.20:40002` |

Both clients share one public address, but the different public ports keep their replies separate.

This address-and-port translation is formally called Network Address Port Translation (NAPT), and is also commonly called [Port Address Translation (PAT)](/appendix/glossary/#port-address-translation-pat). In everyday conversation, people usually call the entire process NAT.

Translation entries are temporary. The gateway removes an entry after its connection ends or remains idle long enough.

## Why Inbound Is Different

Outbound traffic creates a translation entry automatically. Unrequested inbound traffic has no entry.

Suppose a new connection arrives with this destination:

```text
Destination IPv4 address (NAT gateway's public address): 198.51.100.20
Destination TCP port (HTTPS):                            443
```

The gateway may represent dozens of private hosts. Without a rule, it cannot know whether to send the connection to the laptop at `10.0.20.15`, the second client at `10.0.20.25`, another private device, or a service on the gateway itself.

This is why inbound connections require an explicit mapping.

## NAT Is Not a Firewall

NAT and firewalls are commonly built into the same gateway, but they perform different jobs.

- NAT changes source or destination addresses and sometimes port numbers.
- A firewall decides whether traffic is allowed to pass.

Traditional outbound NAT makes unsolicited inbound connections difficult because they have no translation entry. That is useful behavior, but it does not inspect whether an allowed connection is safe. Module 11 covers filtering directly.

## Common Places You Will See NAT

- Home routers let many devices share one public IPv4 address.
- Cloud NAT gateways give private virtual machines outbound access.
- Container platforms translate traffic between container and host networks.
- Virtual private network (VPN) gateways may translate traffic when connected networks use overlapping addresses.

NAT also affects logs. A public server normally records the NAT gateway's translated public source address, not the private address of the client that started the connection.

## Double NAT and Carrier-Grade NAT

**Double NAT** means traffic crosses two NAT gateways. A virtual machine behind a home router is a common example: the virtualization platform translates the VM's address first, and the home router translates it again before the packet reaches the internet.

Outbound traffic usually still works. Inbound access is harder because each NAT gateway may need its own port-forwarding rule.

**[Carrier-grade network address translation (CGNAT)](/appendix/glossary/#carrier-grade-nat-cgnat)** is a NAT gateway operated by an internet provider. It lets many customers share public IPv4 addresses. Because the customer does not control the provider's gateway, ordinary inbound port forwarding may not be available.

When an inbound service fails despite a correct local port forward, check whether another router or CGNAT exists upstream.

:::note[Internet Protocol Version 6 (IPv6)]
This module describes IPv4 NAT. IPv6 provides a much larger address space and does not require NAT for address conservation. IPv6 services still need firewall rules and other access controls.
:::

## Try It Yourself

Compare the IPv4 address assigned to your computer with the public source address seen by an external service.

On Windows, display the IPv4 addresses assigned to the computer:

```text
ipconfig
```

Then display the public source IPv4 address seen by ipify:

```text
curl https://api.ipify.org
```

On Linux, display the IPv4 addresses assigned to the computer:

```text
ip -4 addr
```

Then display the public source IPv4 address seen by ipify:

```text
curl https://api.ipify.org
```

On macOS, display the addresses assigned to the computer:

```text
ifconfig
```

Then display the public source IPv4 address seen by ipify:

```text
curl https://api.ipify.org
```

Compare the active network interface's IPv4 address from the first command with the single public address printed by the second command. If they differ, NAT is the usual reason. On a typical home network, the first translation occurs at the home router. A VPN or web proxy can also change the address seen by the service.

The public address check sends a normal HTTPS request to ipify. Like any external service you contact, ipify can see the public address from which the request arrived.

## Port Forwarding

A [port forward](/appendix/glossary/#port-forwarding) tells the gateway which private destination should receive a particular inbound connection.

| Incoming public destination | Forwarded private destination |
| --- | --- |
| NAT gateway: `198.51.100.20:8443` | HTTPS service on laptop: `10.0.20.15:443` |

For matching inbound packets, the gateway changes the destination address and port before forwarding them. This is destination NAT (DNAT).

The private service can listen on a different port from the one exposed publicly. In this example, an outside client connects to TCP port 8443 on the NAT gateway. The gateway forwards that connection to the laptop's HTTPS service on TCP port 443.

This example explains what port forwarding does. It is not an instruction to configure a port forward on a home router, workplace firewall, cloud firewall, or other internet-facing device.

:::note[Publishing a Container Port]
Publishing a container port maps an address and port on the container host to a port inside the container. It is the same destination NAT idea applied on a single machine.

```text
Host address and port -> Container address and port
```

Depending on the address it binds to and the host's firewall, publishing a port can make the service reachable from beyond the container host. Treat it as an access-control decision, not merely an application setting.
:::

:::tip[Optional Lab: A Local-Only VirtualBox Port Forward]
You can practice the idea with the `NETLAB` NAT Network in VirtualBox. The rule below listens only on `127.0.0.1`, the Windows host's loopback address. It does not open a port on your physical network interface or make the service available from the internet.

1. On LINUXBOX, find the IPv4 address assigned to its NETLAB interface:

   ```text
   ip -4 addr
   ```

2. In VirtualBox Manager, open **File → Tools → Network Manager**. Select **NAT Networks**, select `NETLAB`, and open **Port Forwarding**.
3. Add this rule, replacing `<LINUXBOX-IP>` with the address from step 1:

   | Setting | Value |
   | --- | --- |
   | Name | `natlab-ssh` |
   | Protocol | `TCP` |
   | Host IP | `127.0.0.1` |
   | Host Port | `18022` |
   | Guest IP | `<LINUXBOX-IP>` |
   | Guest Port | `22` |

   Do not leave **Host IP** blank. The explicit `127.0.0.1` value keeps the listening address local to the Windows host.

4. On the Windows host—not inside either VM—open PowerShell and test the forwarded port:

   ```text
   Test-NetConnection 127.0.0.1 -Port 18022
   ```

5. Find `TcpTestSucceeded : True` in the result. The test contacted Transmission Control Protocol (TCP) port 18022 on the Windows host, and VirtualBox forwarded the connection to the Secure Shell (SSH) service on TCP port 22 on LINUXBOX.
6. When finished, delete the `natlab-ssh` rule in VirtualBox. Removing it returns NETLAB to its previous configuration.
:::

## Further Learning

- [Oracle VirtualBox networking documentation](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/networkingdetails.html) explains NAT Network port-forwarding rules and how to remove them.
- [Request for Comments (RFC) 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/info/rfc3022/) describes basic NAT, port translation, and translation state.
- [RFC 2663: NAT Terminology and Considerations](https://www.rfc-editor.org/info/rfc2663/) defines common NAT terms and behaviors.
- [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/info/rfc6888/) explains provider-operated address sharing.
- [RFC 5737: IPv4 Address Blocks for Documentation](https://www.rfc-editor.org/info/rfc5737/) defines the example addresses used in this module.
- [ipify](https://www.ipify.org/) documents the free public-address application programming interface (API) used in the exercise.

## Checklist Before Moving On

- [ ] You can describe what changes during an outbound NAT translation
- [ ] You know how ports let several private hosts share one public address
- [ ] You can explain how the translation table directs a reply
- [ ] You know why a new inbound connection needs a mapping
- [ ] You can distinguish NAT from firewall filtering
- [ ] You compared a private address with the public address seen externally
- [ ] Optional: You created and removed a local-only VirtualBox port-forwarding rule

Continue to Module 7 to see how TCP, User Datagram Protocol (UDP), ports, and sockets identify individual conversations.
