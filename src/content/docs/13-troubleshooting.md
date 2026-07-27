---
title: "Module 13: Troubleshooting Method"
description: Use a repeatable process to identify where a network connection is failing.
---

When a user says, "The network is down," many different problems could be hiding behind that description.

The computer may have no network connection. A name may resolve to the wrong address. A firewall may block the required port. The server may be reachable while its application is stopped.

Troubleshooting means narrowing those possibilities with evidence. Start with the simplest checks, test one part of the connection at a time, and stop when you find the first failure.

## In This Module

- Turn a vague report into a specific problem
- Test a connection in a repeatable order, starting with the physical or wireless connection
- Use network layers to organize troubleshooting tests
- Understand what common tools prove
- Interpret common failure messages
- Record evidence and make one change at a time

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

Work from the client toward the application:

```text
1. Physical or wireless connection
2. Network interface and local settings
3. Destination name and address
4. Route toward the destination
5. Destination port
6. Application response
```

This sequence is guided by the TCP/IP layers, but it is not a strict trip from the bottom layer to the top. The physical connection, the network interface, and the local network involve the Link layer. IP addressing and routing involve the Internet layer. The destination port involves the Transport layer. DNS and the service response involve the Application layer. DNS is checked early because the client needs a destination address before it can test the route or service.

Layers do not identify the cause by themselves. They organize the checks and help you understand what each result does and does not rule out.

This order prevents an application error from being mistaken for a disconnected cable, or a Domain Name System (DNS) problem from being mistaken for a failed server.

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

Confirm that the network interface is connected and has the expected Internet Protocol (IP) address, subnet mask or prefix, default gateway, and DNS server.

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

### 3. Check Name Resolution

If the user connects by name, confirm which address that name returns.

On Windows:

```text
Resolve-DnsName portal.example.com
```

On Linux or macOS:

```text
dig portal.example.com
```

If name resolution fails, investigate DNS. If the name returns an address, confirm that it is the address you expected. A successful lookup can still return an old or incorrect address.

Testing the expected IP address separately can help distinguish a DNS problem from a connection problem. It is a diagnostic step, not a permanent substitute for fixing DNS.

### 4. Check the Route and Basic Reachability

The routing table shows where the client intends to send traffic.

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

You can also test whether a destination replies to an Internet Control Message Protocol (ICMP) echo request:

```text
ping <destination-address>
```

:::note
A successful `ping` proves that ICMP echo traffic made a round trip. It does not prove that a website or another service is working.

A failed `ping` does not prove that the destination is offline. A host or firewall may block ICMP while allowing the required service.
:::

If the destination is beyond the local network, `tracert` on Windows or `traceroute` on Linux and macOS can show some of the routers along the path. Missing replies from one router do not necessarily indicate a failure because routers may limit or ignore these probes.

### 5. Test the Required Port

Test the port used by the actual service. For example, a web server may respond on Transmission Control Protocol (TCP) port 443 even when it does not answer `ping`.

On Windows, test a specific TCP destination:

```text
Test-NetConnection -ComputerName portal.example.com -Port 443
```

`TcpTestSucceeded: True` confirms that Windows established a TCP connection to that address and port. It does not confirm that the application returned correct content.

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

### 6. Test the Application

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
| The client has an IP address | The address, mask, gateway, and DNS settings are all correct |
| DNS returns an address | The returned address is current or correct |
| `ping` succeeds | Every TCP or User Datagram Protocol (UDP) service is reachable |
| `ping` fails | The host or application is offline |
| A port is listening on the server | A remote client can pass every firewall and route to it |
| A TCP port test succeeds | The application is healthy |

:::note[When the Network Is Not the Problem, Look at Startup Order]
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

## When to Reach for a Packet Capture

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

- [Microsoft `Test-NetConnection` documentation](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection) explains its ping, TCP port, route tracing, and route-selection tests.
- [Microsoft `ping` documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping) documents Windows ICMP echo tests and their options.
- [Everything curl: verbose output](https://everything.curl.dev/usingcurl/verbose/) explains how `curl -v` exposes connection details for troubleshooting.
- [Wireshark User's Guide: display filters](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html) explains how to limit a capture view to relevant packets.

## Checklist Before Moving On

- [ ] You can turn a vague report into a specific, testable statement
- [ ] You check the physical or wireless connection before reading any configuration
- [ ] You can check local settings, DNS, routing, the destination port, and the application in order
- [ ] You can explain why a failed `ping` does not prove that a server is offline
- [ ] You know the difference between a timeout and a refused connection
- [ ] You can state what each troubleshooting test proves and what it does not
- [ ] You know why changes should be narrow, reversible, and made one at a time
- [ ] Optional: You diagnosed and restored the stopped SSH service in NETLAB

You now have a repeatable method for combining the concepts and tools from the entire guide.
