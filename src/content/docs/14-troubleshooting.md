---
title: "Module 14: Troubleshooting Method"
description: Use a repeatable process to identify where a network connection is failing.
---

When a user says, "The network is down," many different problems could be hiding behind that description.

The computer may have no network connection. A name may resolve to the wrong address. A firewall may block the required port. The server may be reachable while its application is stopped.

Troubleshooting means narrowing those possibilities with evidence. Start with the simplest checks and test one part of the connection at a time. Treat the first unexpected result as a boundary to investigate, but confirm it with another appropriate test before deciding what caused it.

## In This Module

- Turn a vague report into a specific problem
- Work outward from the local computer when the location of a failure is unknown
- Understand what each test proves and does not prove
- Make one narrow change at a time, verify the result, and record the evidence

## Define the Problem First

Before changing anything, identify:

- **Affected client:** Which computer or device has the problem?
- **Destination:** Which server, website, or service is it trying to reach?
- **Expected result:** What should happen?
- **Actual result:** What happens instead, including the exact error?
- **Scope:** Does the problem affect one user, one device, one service, or many?
- **Timing:** When did it last work, and what changed?

Compare these two reports:

```text
Vague:
The network is broken.

Specific:
On WINCLIENT, https://portal.example.com times out.
Other websites open normally.
The problem began after the portal server restarted.
```

The specific report identifies a client, destination, symptom, scope, and possible starting point.

## Follow the Connection

When you do not yet know which part of a connection failed, work outward from the client:

```text
1. Physical or wireless connection
2. Network interface and local settings
3. Local TCP/IP stack and assigned address
4. Local network and default gateway
5. Remote address and route
6. Name resolution
7. Destination port
8. Application response
```

This is a starting sequence, not a ritual. If an application reports that a name does not exist, begin with Domain Name System (DNS). If it returns an HTTP `500` response, the physical connection, routing, and destination port already worked well enough to reach an HTTP server, so begin closer to the application.

The sequence is guided by the Transmission Control Protocol/Internet Protocol (TCP/IP) layers. The physical connection, the network interface, and the local network involve the Link layer. Internet Protocol (IP) addressing and routing involve the Internet layer. The destination port involves the Transport layer. DNS resolution and the service response involve the Application layer.

Layers do not identify the cause by themselves. They organize the checks and help you understand what each result does and does not rule out. The first five steps can also be performed with numeric addresses, which keeps DNS out of the test until basic IP connectivity has been checked.

### 1. Check the Physical or Wireless Connection

Before running any command, confirm the device is actually attached to a network.

On a wired connection, check that the cable is seated at both ends, that the link light on the switch port or wall jack is lit, and that the cable is not damaged. A cable that works elsewhere is better evidence than a cable that looks fine.

On Wi-Fi, check that wireless is turned on, that the device is not in airplane mode, and that it joined the network you expect. A device that automatically connected to a guest network, a neighboring network, or an old saved network will still show a complete and valid-looking configuration in the next step. Every command will succeed while nothing the user needs works.

The operating system can confirm whether the interface is up.

On Windows, a disconnected adapter reports `Media disconnected`:

```text
ipconfig
```

On Linux, look for `state UP` or `state DOWN` on the interface:

```text
ip link
```

On macOS:

```text
ifconfig
```

A connected interface does not prove the device is on the right network. Confirm the network name as well as the connection state.

### 2. Check the Client's Network Settings

Confirm that the network interface is connected and has the expected IP address, subnet mask or prefix, default gateway, and DNS server.

On Windows:

```text
ipconfig /all
```

On Linux:

```text
ip addr
ip route
```

On macOS:

```text
ifconfig
netstat -rn
```

An address by itself does not prove that the settings are correct. Compare the results with a working device or the network's documented configuration.

Look for a few high-value warning signs:

- If DHCP was expected, a `169.254.x.x` address usually means the client configured an IPv4 link-local address because it did not receive a lease.
- A missing default gateway normally limits the client to directly connected networks.
- A wrong subnet mask changes which destinations the client treats as local.
- An unexpected DNS server can produce missing, incorrect, or internal-only answers.
- A virtual private network (VPN), virtual machine platform, or security product may add interfaces, DNS settings, and routes. Confirm that you are reading the interface that actually carries the connection.

### 3. Test the Local TCP/IP Stack and Address

Start with the IPv4 [loopback](/appendix/glossary/#loopback) address:

```text
ping 127.0.0.1
```

If you are checking IPv6 as well:

```text
ping ::1
```

Loopback traffic stays inside the computer. A reply confirms that the local IP stack can process that loopback traffic. It does not test the network adapter, cable, Wi-Fi connection, switch, or router.

Next, ping the address assigned to the active interface:

```text
ping <client-address>
```

A reply confirms that the operating system recognizes the assigned address. This test can also be satisfied entirely inside the computer, so it still does not prove that frames can cross the physical or wireless network.

An unexpected failure at either local test points toward the local operating system, its network configuration, or software that interacts with the network stack. Record the exact error before resetting anything.

### 4. Test the Local Network and Default Gateway

The default gateway is normally on the same local subnet as the client. Test the address shown in the client's active configuration:

```text
ping <default-gateway-address>
```

A reply shows that Internet Control Message Protocol (ICMP) echo traffic reached the router's local interface and returned. It does not prove that the router can forward traffic to other networks.

A failed ping is not conclusive because the gateway may ignore ICMP. After attempting the connection, inspect the client's IPv4 neighbor information.

Windows:

```text
arp -a
```

Linux:

```text
ip neigh
```

macOS:

```text
arp -a
```

An entry that maps the gateway's IP address to a Media Access Control (MAC) address shows that local address resolution succeeded recently. A missing or incomplete entry after a test suggests investigating the client address and mask, Wi-Fi association, virtual local area network (VLAN), cable, switch port, or gateway configuration.

When permitted, testing a second known device on the same subnet can help distinguish a gateway-specific problem from a broader local-network problem.

### 5. Test a Remote Address and the Route

The routing table shows where the client intends to send remote traffic.

On Windows:

```text
route print
```

On Linux:

```text
ip route
```

On macOS:

```text
netstat -rn
```

Then test a known, permitted address outside the local subnet:

```text
ping <known-remote-address>
```

On a home or isolated lab network, `8.8.8.8` is sometimes used as an example:

```text
ping 8.8.8.8
```

`8.8.8.8` is a Google Public DNS address. Reaching it proves that ICMP completed a round trip to that one destination. It does not prove that every internet destination, DNS service, or application works. An organization may also intentionally restrict traffic to public DNS services, so use a target appropriate for the network you are testing.

If the gateway replies but a known remote address does not, inspect the selected route, upstream routing, Network Address Translation (NAT), and filtering. A numeric target keeps DNS out of this test.

To examine the path without adding hostname lookups, use:

Windows:

```text
tracert -d <known-remote-address>
```

Linux or macOS:

```text
traceroute -n <known-remote-address>
```

Missing replies from one router do not necessarily indicate a failure because routers may limit or ignore these probes. Look for a consistent boundary and compare it with a working client when possible.

### 6. Check Name Resolution

After testing with numeric addresses, test the actual name the user or application needs.

On Windows:

```text
Resolve-DnsName portal.example.com
```

On Linux or macOS:

```text
dig portal.example.com
```

If name resolution fails, investigate the configured DNS servers and the path to them. If the name returns one or more addresses, confirm that they are expected. A successful lookup can still return an old or incorrect address.

`ping google.com` is a convenient combined test, but it mixes name resolution with ICMP reachability. A DNS query followed by a separate address or port test provides clearer evidence.

### 7. Test the Required Port

Test the port used by the actual service. For example, a web server may respond on Transmission Control Protocol (TCP) port 443 even when it does not answer `ping`.

On Windows, test a specific TCP destination:

```text
Test-NetConnection -ComputerName portal.example.com -Port 443
```

`TcpTestSucceeded: True` confirms that Windows established a TCP connection to that address and port. It does not confirm that the application returned correct content.

On Linux or macOS, if Netcat is installed:

```text
nc -vz portal.example.com 443
```

A port test that uses a name still depends on DNS. When you need to separate the two, test the expected numeric address first and then repeat with the name. Use the hostname again for the real application test because protocols such as HTTPS depend on the requested name.

On the server, confirm that a process is listening on the expected address and port.

Windows:

```text
netstat -ano
```

Linux:

```text
ss -lntup
```

A listening process confirms that the service opened the port locally. It does not prove that firewalls, routing, or cloud controls allow a remote client to reach it.

### 8. Test the Application

Use a tool that speaks the application's protocol. For Hypertext Transfer Protocol (HTTP) and Hypertext Transfer Protocol Secure (HTTPS), `curl` can show the response.

On Windows:

```text
curl.exe -v https://portal.example.com
```

On Linux or macOS:

```text
curl -v https://portal.example.com
```

Verbose output can show the resolved address, connection attempt, Transport Layer Security (TLS) negotiation, request, and response. It may also expose headers or other details, so review the output before sharing it.

If the application responds with an HTTP status code, the request reached an HTTP server or proxy. The response may still report a problem with authentication, the application, or a backend service.

## What Each Result Tells You

| Result | What it suggests |
| --- | --- |
| Loopback ping fails | The local IP stack did not complete the test; investigate the operating system, local configuration, or security software |
| The gateway is absent or incomplete in the neighbor table | The client did not complete local IPv4 address resolution for the gateway |
| The gateway replies but a known remote address does not | The local path to the gateway works; investigate the selected route, upstream path, translation, or filtering |
| A known remote address works but a DNS query fails | Basic connectivity to that remote target works; investigate the DNS configuration, resolver, or path to the resolver |
| Name not found or name resolution failed | The client could not obtain an address through DNS |
| Connection timed out | No usable response arrived before the timeout; routing, filtering, or an unavailable service are possibilities |
| Connection refused | The destination was reached, but the port was closed or the connection was actively rejected |
| Connection reset | The destination or an intermediate device ended an established or attempted connection |
| Certificate warning | The client reached a TLS service, but the certificate name, trust, validity period, or configuration did not pass validation |
| HTTP `4xx` response | The HTTP server received the request and reported a client-side or access-related problem |
| HTTP `5xx` response | The HTTP server or proxy received the request but could not complete it successfully |

These results narrow the search; they do not always identify the exact cause. Check the client, server, firewall, proxy, and application logs that apply to that connection.

## Know What a Test Does Not Prove

Avoid conclusions that go beyond the evidence:

| Test result | Do not assume |
| --- | --- |
| Loopback responds | The network adapter or local network is working |
| The assigned local address responds | Traffic can cross the physical or wireless interface |
| The default gateway responds | The gateway can forward traffic to other networks |
| One remote address responds | Every remote network or internet service is reachable |
| The client has an IP address | The address, mask, gateway, and DNS settings are all correct |
| DNS returns an address | The returned address is current or correct |
| `ping` succeeds | Every TCP or User Datagram Protocol (UDP) service is reachable |
| `ping` fails | The host or application is offline |
| A port is listening on the server | A remote client can pass every firewall and route to it |
| A TCP port test succeeds | The application is healthy |

:::note[Role-Specific: When the Network Is Not the Problem, Look at Startup Order]
A test that passes now does not prove the dependency was reachable when the application started. Many applications try their dependencies once at startup and do not retry, so an application can stay broken long after the path recovers.

Suspect startup order when the dependency is reachable, the application still reports a connection error, and restarting the application fixes it with no other change. A listening port is also not the same as a ready service, since a database may accept connections while it is still starting and unable to answer queries.
:::

## Change One Thing at a Time

Changing several settings at once makes the result difficult to interpret. Instead:

1. Record the current behavior.
2. Form one testable explanation.
3. Make one narrow, reversible change.
4. Repeat the same test.
5. Keep the change only if the evidence supports it.

For example, do not disable an entire firewall, change DNS servers, and restart the application together. A temporary rule for one required port is a safer and more useful test than disabling all filtering.

## Confirm the Fix

A successful diagnostic command is not the same as a resolved user problem.

After making a fix:

1. Repeat the exact action that originally failed.
2. Confirm the expected result from the affected client.
3. Test one closely related function to make sure the change did not create another problem.
4. Remove temporary rules, address overrides, captures, or other test-only changes.
5. Record the cause, permanent fix, and any follow-up that could prevent the problem from returning.

If the problem was intermittent, observe it long enough to distinguish a real fix from a temporary recovery.

## When the Problem Is Slow or Intermittent

A single successful reply shows only that one exchange worked. Use a bounded series of tests and compare the local and remote paths.

Windows:

```text
ping -n 20 <default-gateway-address>
ping -n 20 <known-remote-address>
```

Linux or macOS:

```text
ping -c 20 <default-gateway-address>
ping -c 20 <known-remote-address>
```

Loss or large response-time changes to the gateway suggest looking closely at the local link, Wi-Fi conditions, switching, or gateway load. A stable gateway test with poor remote results suggests looking beyond the local network. ICMP may be handled differently from application traffic, so confirm important findings with the affected application or a port-specific test.

Interface counters can reveal errors or dropped traffic that increase while the problem is reproduced.

Windows PowerShell:

```text
Get-NetAdapterStatistics
```

Linux:

```text
ip -s link
```

macOS:

```text
netstat -ib
```

Compare counters before and after a short, controlled test. A large lifetime total without a baseline does not show when the errors occurred.

## When to Reach for a Packet Capture

:::note[Optional Diagnostic Technique]
Use this escalation step when simpler checks do not reveal where an exchange stops. The [Reading a Packet Capture](/appendix/reading-a-capture/) appendix provides the complete workflow.
:::

Use Wireshark when the earlier checks do not show where the exchange stops. Decide what you need to learn before starting the capture.

Examples:

| Question | Wireshark display filter |
| --- | --- |
| Did the client send a DNS query and receive a response? | `dns` |
| Did ICMP echo traffic receive a reply? | `icmp` |
| What happened to traffic using TCP port 443? | `tcp.port == 443` |
| What traffic involved one Internet Protocol version 4 (IPv4) address? | `ip.addr == 10.0.20.25` |

Capture on the interface that carries the connection, reproduce the problem once, and stop the capture. A capture taken on the client shows what the client sent and received. It does not automatically show what arrived at the server or what an intermediate firewall discarded.

:::caution
Packet captures can contain credentials, cookies, names, addresses, and application data. Capture only traffic you are authorized to inspect, and protect the saved file.
:::

## Record the Evidence

A useful troubleshooting note includes:

- Date, time, and timezone
- Affected client and destination
- Expected and actual behavior
- Exact commands and relevant output
- Tests that succeeded as well as tests that failed
- Changes made and whether they were reversed
- The cause and final fix, if known
- How the original user action and related functions were verified afterward

Good notes let another person continue the investigation without repeating every test.

:::tip[Optional Lab: Find a Stopped Service]
This exercise temporarily stops Secure Shell (SSH) on LINUXBOX. Use the VirtualBox console for LINUXBOX so stopping SSH does not disconnect the session you need to restore it.

1. On LINUXBOX, find its NETLAB address:

   ```text
   ip -4 addr
   ```

2. On WINCLIENT, replace `<LINUXBOX-IP>` with that address and confirm TCP port 22 is reachable:

   ```text
   Test-NetConnection -ComputerName <LINUXBOX-IP> -Port 22
   ```

   The result should show `TcpTestSucceeded: True`.

3. From the LINUXBOX VirtualBox console, stop SSH:

   ```text
   sudo systemctl stop ssh
   ```

4. Repeat the same `Test-NetConnection` command on WINCLIENT. The TCP test should now fail.
5. On LINUXBOX, check whether any process is listening on TCP port 22:

   ```text
   sudo ss -lntp
   ```

   Port 22 should be absent. This is evidence that the service is not listening locally.

6. Restore the service:

   ```text
   sudo systemctl start ssh
   sudo systemctl status ssh --no-pager
   ```

7. Repeat `Test-NetConnection` on WINCLIENT. It should succeed again.

The client test located the failure at the destination port. The server test then showed why, because no process was listening.
:::

## Further Learning

- [Microsoft TCP/IP communication troubleshooting guidance](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-tcp-ip-communication-guidance) provides a detailed example of testing local configuration, the default gateway, remote systems, and application ports.
- [Microsoft `Test-NetConnection` documentation](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection) explains its ping, TCP port, route tracing, and route-selection tests.
- [Microsoft `ping` documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping) documents Windows ICMP echo tests and their options.
- [RFC 1122: Requirements for Internet Hosts](https://www.rfc-editor.org/info/rfc1122) defines the IPv4 loopback range and other host behavior.
- [Google Public DNS documentation](https://developers.google.com/speed/public-dns) identifies the service behind `8.8.8.8`.
- [Everything curl: verbose output](https://everything.curl.dev/usingcurl/verbose/) explains how `curl -v` exposes connection details for troubleshooting.
- [Wireshark User's Guide: display filters](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html) explains how to limit a capture view to relevant packets.

You now have a repeatable method for combining the concepts and tools from the entire guide.

## Main Takeaways

- Define the client, destination, expected result, actual result, scope, and timing before changing anything.
- When the location of a failure is unknown, work outward from the local stack to the gateway, remote address, DNS, destination port, and application.
- Treat an unexpected result as a boundary to investigate, confirm it with an appropriate second test, and avoid conclusions that exceed the evidence.
- Change one thing at a time, verify the original user action after the fix, remove temporary changes, and record the outcome.

## Where to Go Next

Choose the next topic that matches the work you want to do:

- For IT Support or system administration, continue with wireless networking, virtual local area network (VLAN) configuration, and deeper Windows or Linux troubleshooting.
- For DevOps, cloud, or application operations, read the optional [Proxies and Load Balancers module](/13-proxies-load-balancers/), build a small private network in one cloud platform, then study container networking.
- For software development, explore HTTP diagnostics, certificates, application timeouts, and connection pooling.
- For cybersecurity, continue with network segmentation, firewall management, secure remote access, and packet analysis.
- For every path, add Internet Protocol version 6 (IPv6) addressing and routing to the IPv4 foundation in this guide.
