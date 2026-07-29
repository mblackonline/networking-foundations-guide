---
title: Port Forwarding and a Local-Only Lab
description: Explore destination network address translation and practice a loopback-only VirtualBox port forward.
---

:::note[Optional: Role-Specific]
This appendix is useful for systems administration, cloud, DevOps, and software work. It is not required for the core learning path.
:::

A [port forward](/appendix/glossary/#port-forwarding) tells a Network Address Translation (NAT) device which private destination should receive a particular inbound connection.

| Incoming public destination | Forwarded private destination |
| --- | --- |
| NAT device: `198.51.100.20:8443` | Hypertext Transfer Protocol Secure (HTTPS) service on laptop: `10.0.20.15:443` |

For matching inbound packets, the NAT device changes the destination Internet Protocol (IP) address and port before forwarding them. This behavior is called destination network address translation (DNAT).

The private service can listen on a different port from the one exposed publicly. In this example, an outside client connects to Transmission Control Protocol (TCP) port 8443 on the NAT device. The NAT device forwards that connection to TCP port 443 on the laptop.

This example explains the translation. It is not an instruction to configure a port forward on a home router, workplace firewall, cloud firewall, or another internet-facing device.

## Port Forwarding Is Not the Entire Access Decision

A translation rule selects an internal destination. It does not by itself prove that:

- The service is running and listening
- Host and network firewalls permit the traffic
- The source is authorized
- The application is patched, authenticated, or safe to expose
- An upstream router or carrier-grade NAT service will forward the connection

Treat publishing a service as an access-control and security decision, not merely an address translation.

## Publishing a Container Port

Publishing a container port maps an address and port on the container host to a port inside the container:

```text
Host address and port -> Container address and port
```

This is the same destination-translation idea applied on one machine. Depending on the address it binds to and the host firewall, publishing a port can make the service reachable from beyond the container host.

## Local-Only VirtualBox Port Forward

:::caution
This exercise listens only on `127.0.0.1`, the Windows host's loopback address. Do not leave the Host IP field blank and do not substitute an address assigned to a physical network interface.
:::

The exercise requires the two virtual machines (VMs) in the [optional NETLAB environment](/appendix/building-netlab/). It forwards a port on the Windows host to the Secure Shell (SSH) service on LINUXBOX without opening the service to the physical network or the internet.

1. On LINUXBOX, find the IPv4 address assigned to its NETLAB interface:

   ```text
   ip -4 addr
   ```

2. In VirtualBox Manager, open **File > Tools > Network Manager**. Select **NAT Networks**, select `NETLAB`, and open **Port Forwarding**.
3. Add this rule, replacing `<LINUXBOX-IP>` with the address from step 1:

   | Setting | Value |
   | --- | --- |
   | Name | `natlab-ssh` |
   | Protocol | `TCP` |
   | Host IP | `127.0.0.1` |
   | Host Port | `18022` |
   | Guest IP | `<LINUXBOX-IP>` |
   | Guest Port | `22` |

4. On the Windows host—not inside either VM—open PowerShell and test the forwarded port:

   ```text
   Test-NetConnection 127.0.0.1 -Port 18022
   ```

5. Find `TcpTestSucceeded : True` in the result. The test contacted TCP port 18022 on the Windows host, and VirtualBox forwarded the connection to TCP port 22 on LINUXBOX.
6. In VirtualBox Network Manager, delete the `natlab-ssh` rule.
7. Repeat the test:

   ```text
   Test-NetConnection 127.0.0.1 -Port 18022
   ```

   It should now fail because nothing is listening on that host port.

Removing the rule returns NETLAB to its previous configuration.

## Further Learning

- [Module 6: Network Address Translation](/06-nat/) explains the outbound translation and return-state model.
- [Module 11: Firewalls and Filtering](/11-filtering/) explains why a translation rule and a filtering rule are separate controls.
- [Oracle VirtualBox networking documentation](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/networkingdetails.html) documents NAT Network port-forwarding rules.
- [Request for Comments (RFC) 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/info/rfc3022/) describes basic NAT, port translation, and translation state.
