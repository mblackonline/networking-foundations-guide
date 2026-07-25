---
title: "Module 8: DHCP"
description: How devices receive IPv4 settings automatically, what can provide DHCP, and what common failures look like.
---

A device needs several settings before it can communicate on an IPv4 network. You could enter those settings by hand, but doing that for every laptop, phone, printer, and virtual machine would be slow and easy to get wrong.

The Dynamic Host Configuration Protocol (DHCP) supplies those settings automatically.

## In This Module

- What DHCP gives a client
- What kinds of devices and systems can provide DHCP
- How a new client requests an IPv4 configuration
- How leases and reservations work
- What a DHCP relay does
- What a `169.254.x.x` address means

## What DHCP Does

A device asking for network settings is a **DHCP client**. The service answering it is a **DHCP server**.

The server commonly supplies:

| Setting | Why the client needs it |
| --- | --- |
| IPv4 address | Identifies the client's interface on the network |
| Subnet mask | Tells the client which IPv4 destinations are local |
| Default gateway | Provides a path to destinations outside the local subnet |
| DNS server addresses | Tell the client where to send name-resolution requests |
| Lease time | States how long the client may use the address |

These settings must work together. A client can have a valid-looking address but still fail to reach other networks because it received the wrong mask or gateway. It may also reach IP addresses successfully while names fail because it received the wrong DNS settings.

The DHCP server keeps a range of addresses available for clients. This range is often called a **pool** or **scope**. When the server assigns one of those addresses, it records a **lease** so it does not give the same address to another client.

## What Can Provide DHCP?

DHCP is a service or role, not one particular type of physical device. Many different systems can run it.

| DHCP provider | Where you might see it |
| --- | --- |
| Home router or Wi-Fi gateway | Supplies settings to phones, computers, televisions, and other home devices |
| Firewall, router, or Layer 3 switch | Supplies settings to one or more business networks |
| Windows Server with the DHCP Server role | Common in Windows and Active Directory environments |
| Linux or another Unix-like server running DHCP software | Used in labs, businesses, service-provider networks, and custom environments |
| Virtualization platform | Supplies settings to virtual machines on a virtual network |
| Cloud provider's network service | Supplies settings to virtual machines and other cloud resources |

In this guide's lab, Oracle VirtualBox provides DHCP for the VirtualBox NAT Network named NETLAB. The Windows 11 virtual machine named WINCLIENT and the Debian virtual machine named LINUXBOX are both DHCP clients.

:::note[DHCP and Active Directory]
Active Directory Domain Services (AD DS) does not assign IP addresses by itself. A Windows Server can provide addresses after the separate **DHCP Server** role is installed and configured.

In an Active Directory domain, the DHCP server must also be authorized in AD DS. The DHCP role can run on a domain controller or on another Windows Server, but it remains a separate service from AD DS.
:::

Linux systems can also provide DHCP using software such as Kea or `dnsmasq`. The operating system or product is less important than the role it is performing:

```text
DHCP client asks for settings -> DHCP server supplies settings
```

Avoid running unrelated DHCP servers on the same subnet. A client may accept an offer from the wrong server and receive an incorrect address, gateway, or DNS configuration. Organizations can use multiple DHCP servers for planned redundancy, but those servers must be configured to work together.

## How a New Client Finds the Server

A new DHCP client has two immediate problems:

- It does not have a usable IPv4 address.
- It may not know the DHCP server's IPv4 address.

The client therefore sends a local broadcast that every device on the subnet can receive:

```text
Source IPv4 address (unconfigured client):  0.0.0.0
Source UDP port (DHCP client):               68
Destination IPv4 address (local broadcast): 255.255.255.255
Destination UDP port (DHCP server):          67
```

The DHCP server replies from UDP port 67 to the client's UDP port 68.

## The DORA Exchange

A client obtaining a new DHCPv4 lease normally completes four steps. Their first letters form **DORA**.

| Step | Message | Sent by | Meaning |
| ---: | --- | --- | --- |
| 1 | Discover | Client | Is a DHCP server available? |
| 2 | Offer | Server | I can offer this address and configuration. |
| 3 | Request | Client | I want to use the offered address. |
| 4 | Acknowledge | Server | The lease is approved. |

The actual DHCP message names are `DHCPDISCOVER`, `DHCPOFFER`, `DHCPREQUEST`, and `DHCPACK`.

The offer includes more than an address. It can include the subnet mask, default gateway, DNS servers, lease duration, and other values called **DHCP options**.

More than one server can make an offer. The client's request identifies the offer it selected so the other servers know that their offers were not accepted.

## Leases and Reservations

A DHCP lease lets a client use an address for a limited time. The client normally asks to renew the lease before it expires.

The first renewal attempt goes to the server that issued the lease. If that server does not answer, the client later broadcasts a request that another suitable DHCP server can answer. The client must stop using the address if the lease expires without being renewed.

This normally happens without interrupting the user. A renewal usually needs only a request and an acknowledgment; it does not repeat the complete DORA exchange.

A client may receive the same address after restarting or renewing. That is normal when the address remains available.

### Reservation Versus Static Address

Both methods can give a device a predictable address:

| Method | Where it is configured | How the client receives its settings |
| --- | --- | --- |
| DHCP reservation | On the DHCP server | The client still uses DHCP |
| Static address | On the client device | An administrator enters the settings manually |

A reservation tells the DHCP server to give a particular client the same address. It is useful for printers, servers, and other devices that should remain predictable while still receiving centrally managed settings.

A static address does not come from DHCP. Manually assigned addresses should be outside the dynamic pool or excluded from it. Otherwise, the server could lease that address to another device and create an address conflict.

## What a DHCP Relay Does

The client's initial broadcast stays on its local subnet. Routers do not normally forward broadcasts, so a DHCP server on another subnet would not receive it directly.

A **DHCP relay** listens for the local broadcast and forwards it to the real DHCP server:

```text
Client broadcast -> DHCP relay -> DHCP server on another subnet
```

The relay also tells the server which subnet the request came from, allowing the server to select the correct address pool.

Routers, firewalls, and many Layer 3 switches can act as DHCP relays. Windows Server can also provide a relay through its Remote Access role. The relay is an intermediary; it is not the server that owns the address pool.

If DHCP works on several subnets but fails on only one, check that subnet's DHCP pool, VLAN, and relay configuration.

## What a 169.254 Address Means

When a Windows client is configured to obtain an IPv4 address automatically but cannot obtain a normal DHCP lease, it may assign itself an address such as:

```text
169.254.36.8
```

Windows calls this Automatic Private IP Addressing (APIPA). The standards term is an **IPv4 link-local address**.

An IPv4 link-local address can communicate only with compatible devices on the same local link. Routers do not forward it to other networks or the internet.

Seeing `169.254.x.x` usually means:

```text
This interface did not obtain its expected IPv4 configuration.
```

It is a clue, not the complete diagnosis. The cause could be the network connection, VLAN, DHCP server, relay, or an empty address pool.

## Inspect a Windows DHCP Lease

On Windows, run:

```text
ipconfig /all
```

Find the active network adapter and identify:

- **DHCP Enabled**
- **IPv4 Address**
- **Subnet Mask**
- **Default Gateway**
- **DHCP Server**
- **DNS Servers**
- **Lease Obtained**
- **Lease Expires**

Do not assume that the first adapter is the active one. VPN and virtualization software can create several adapters.

On Linux, these commands show the assigned IPv4 addresses, routes, and current DNS configuration:

```text
ip -4 addr
ip route
cat /etc/resolv.conf
```

## Common DHCP Symptoms

| Symptom | What to check |
| --- | --- |
| Address begins with `169.254` | Network connection, VLAN, DHCP server, relay, and available pool |
| Correct address but no remote connectivity | Subnet mask and default gateway |
| IP connections work but names fail | DNS server addresses supplied by DHCP |
| Only one subnet cannot get leases | That subnet's pool and relay configuration |
| Duplicate-address warning | Static addresses that overlap the DHCP pool |

Record the current configuration before repeatedly releasing or changing it. The incorrect value may be the clue that identifies the problem.

:::tip[Optional Lab: Renew WINCLIENT's NETLAB Lease]
This exercise changes only the Windows 11 virtual machine named WINCLIENT. Do not release an address on a production computer or through a remote session, because the command temporarily disconnects the interface.

1. On WINCLIENT, open Command Prompt and display its current lease:

   ```text
   ipconfig /all
   ```

2. Record the NETLAB adapter's IPv4 address, subnet mask, default gateway, DHCP server, DNS servers, and lease times.
3. Release the lease:

   ```text
   ipconfig /release
   ```

4. Request a lease:

   ```text
   ipconfig /renew
   ```

5. Run `ipconfig /all` again. Confirm that the IPv4 address begins with `10.0.20.` and the subnet mask is `255.255.255.0`.
6. Compare the new settings and lease times with the values recorded in step 2.

WINCLIENT may receive the same IPv4 address again. That is normal and does not mean the exercise failed.
:::

## Further Learning

- [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/info/rfc2131/) defines DHCPv4 client, server, relay, and lease behavior.
- [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/info/rfc2132/) defines the configuration options carried by DHCPv4.
- [RFC 3927: Dynamic Configuration of IPv4 Link-Local Addresses](https://www.rfc-editor.org/info/rfc3927/) defines the `169.254.0.0/16` link-local range.
- [Microsoft Windows Server DHCP documentation](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server) explains the DHCP Server role and authorization in an Active Directory domain.
- [Microsoft DHCP relay documentation](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-deploy-relay-agent) explains the separate Windows Server relay role.
- [Oracle VirtualBox networking documentation](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/networkingdetails.html) explains the DHCP service integrated into VirtualBox.

## Checklist Before Moving On

- [ ] You can list the core IPv4 settings supplied by DHCP
- [ ] You can name several systems that can provide DHCP
- [ ] You know that AD DS and the Windows DHCP Server role are separate services
- [ ] You know that DHCPv4 servers use UDP port 67 and clients use UDP port 68
- [ ] You can identify the Discover, Offer, Request, and Acknowledge steps
- [ ] You can distinguish a DHCP server from a DHCP relay
- [ ] You can distinguish a reservation from a static address
- [ ] You know what a `169.254.x.x` address indicates
- [ ] Optional: You released and renewed WINCLIENT's NETLAB lease

Continue to Module 9 to see how DNS translates names into addresses.
