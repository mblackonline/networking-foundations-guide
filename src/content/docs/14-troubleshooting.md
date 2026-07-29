---
title: "Module 14: Troubleshooting Method"
description: Use a short, repeatable process to identify where a network connection is failing.
---

When a user says, "The network is down," the computer may be disconnected, the client may have incorrect settings, a name may resolve incorrectly, or the application may be unavailable.

Troubleshooting means turning that vague report into a specific test and using the result to decide what to check next.

## In This Module

- Define the actual problem before changing anything
- Work outward from the local computer when the failure location is unknown
- Understand what each test proves and does not prove
- Make one change at a time, verify the result, and record the evidence

## Define the Problem

Start by identifying:

- **Affected client:** Which computer or device has the problem?
- **Destination:** Which server, website, or service is it trying to reach?
- **Expected result:** What should happen?
- **Actual result:** What happens instead, including the exact error?
- **Scope:** Does it affect one user, one device, one service, or many?
- **Timing:** When did it last work, and what changed?

For example:

```text
On WINCLIENT, https://portal.example.com times out.
Other websites open normally.
The problem began after the portal server restarted.
```

This report is more useful than "the network is broken" because it identifies the client, destination, symptom, scope, and a possible starting point.

## The Short Troubleshooting Path

When you do not know where the connection fails, work outward:

```text
1. Connection and IP configuration
2. Local TCP/IP stack and assigned address
3. Default gateway
4. Known remote address
5. Destination name
6. Destination port and application
7. Fix, verify, and record
```

This is a starting path, not a rule that every incident must begin at step 1. An HTTP `500` response already proves that the client reached an HTTP server or proxy, so checking the cable first would add little. Start closer to the evidence when the symptom is specific.

### 1. Check the Connection and IP Configuration

Confirm that Ethernet is connected or that Wi-Fi is on, joined to the expected network, and not in airplane mode. Being connected to the wrong guest or saved wireless network can produce valid-looking settings that do not reach the required resources.

Inspect the active interface:

| Operating system | Command |
| --- | --- |
| Windows | `ipconfig /all` |
| Linux | `ip addr` and `ip route` |
| macOS | `ifconfig` and `netstat -rn` |

Confirm the address, subnet mask or prefix, default gateway, and Domain Name System (DNS) servers. Compare them with documentation or a working device.

Useful warning signs include:

- A `169.254.x.x` address when Dynamic Host Configuration Protocol (DHCP) was expected
- A missing or incorrect default gateway
- A subnet mask that differs from working devices on the same network
- Unexpected DNS servers
- A virtual private network (VPN) or virtual adapter supplying a different route or DNS configuration

### 2. Test the Local TCP/IP Stack and Address

Test IPv4 loopback:

```text
ping 127.0.0.1
```

For IPv6 loopback:

```text
ping ::1
```

Loopback traffic stays inside the computer. A reply shows that the local IP stack processed the test, but it does not test the network adapter, cable, Wi-Fi, switch, or router.

Next, ping the address assigned to the active interface:

```text
ping <client-address>
```

A reply shows that the operating system recognizes the assigned address. This test can also complete inside the computer, so continue outward.

### 3. Test the Default Gateway

Use the gateway address shown in the active interface's configuration:

```text
ping <default-gateway-address>
```

A reply shows that Internet Control Message Protocol (ICMP) echo traffic crossed the local network to the router and returned. It does not prove that the router can forward traffic to other networks.

If the gateway does not reply, remember that it may be configured to ignore ICMP. Check whether the client learned the gateway's Media Access Control (MAC) address:

| Operating system | Command |
| --- | --- |
| Windows | `arp -a` |
| Linux | `ip neigh` |
| macOS | `arp -a` |

A missing or incomplete entry after the test points back toward the address, mask, Wi-Fi connection, virtual local area network (VLAN), cable, switch port, or gateway. When permitted, testing another known device on the same subnet can provide a useful comparison.

### 4. Test a Known Remote Address

Test a known, permitted address beyond the local subnet:

```text
ping <known-remote-address>
```

On a home or isolated lab network, `8.8.8.8` can be a convenient example. It is a Google Public DNS address, so reaching it proves a round trip to that destination—not that every internet destination, DNS server, or application works. Some organizations intentionally restrict traffic to public DNS services.

If the gateway replies but a known remote address does not, inspect the routing table and path:

| Operating system | Routing table | Path test without name lookups |
| --- | --- | --- |
| Windows | `route print` | `tracert -d <address>` |
| Linux | `ip route` | `traceroute -n <address>` |
| macOS | `netstat -rn` | `traceroute -n <address>` |

One silent router in a trace does not prove that router failed. Some routers limit or ignore these probes. Look for a consistent boundary and compare it with a working client when possible.

### 5. Test the Destination Name

Test the actual name the user or application needs:

| Operating system | Command |
| --- | --- |
| Windows | `Resolve-DnsName portal.example.com` |
| Linux or macOS | `dig portal.example.com` |

If the query fails, check the configured DNS servers and the path to them. If it succeeds, confirm that the returned address is expected. A successful query can still return an old or incorrect address.

`ping google.com` is a convenient combined test, but it mixes DNS with ICMP reachability. A DNS query followed by a separate address or port test makes the result easier to interpret.

### 6. Test the Port and Application

A host may be reachable while the required service is unavailable. On Windows, test the service's actual TCP port:

```text
Test-NetConnection -ComputerName portal.example.com -Port 443
```

On Linux or macOS, if Netcat is installed:

```text
nc -vz portal.example.com 443
```

A successful port test shows that a TCP connection was established. It does not prove that the application returned the expected result.

Use a protocol-aware tool for the final test. For HTTP and HTTPS:

```text
curl -v https://portal.example.com
```

Verbose output can show the resolved address, connection attempt, Transport Layer Security (TLS) negotiation, and HTTP response. Review it before sharing because it may contain sensitive headers or other details.

If you administer the server, also confirm that a process is listening on the expected address and port with `netstat -ano` on Windows or `ss -lntup` on Linux.

## Interpret the Boundary

Use the first meaningful difference to decide where to investigate:

| Result | Likely investigation area |
| --- | --- |
| Loopback fails | Local operating system, IP stack, configuration, or security software |
| Local tests pass but the gateway cannot be reached | Client configuration, local link, VLAN, switching, or gateway |
| Gateway works but a known remote address does not | Route selection, upstream path, Network Address Translation (NAT), or filtering |
| Remote address works but the destination name does not | DNS configuration, resolver, or DNS records |
| Name resolves but the required port fails | Service state, host or network firewall, routing to that destination, or cloud controls |
| TCP port works but the application fails | TLS, authentication, proxy, application, or backend dependency |

These results narrow the search; they do not always prove one exact cause.

:::note[Do Not Overread Ping]
A successful `ping` proves that ICMP echo traffic completed a round trip. It does not prove that a TCP or User Datagram Protocol (UDP) application works.

A failed `ping` does not prove that a host is offline. A firewall or host may ignore ICMP while allowing the required service.
:::

## Change, Verify, and Record

Once the evidence points toward a cause:

1. Record the current behavior.
2. Form one testable explanation.
3. Make one narrow, reversible change.
4. Repeat the same diagnostic test.
5. Repeat the exact action that originally failed.
6. Remove temporary rules, overrides, or other test-only changes.
7. Record the cause, permanent fix, and verification result.

Do not disable an entire firewall, change DNS servers, and restart an application together. Several simultaneous changes make the result difficult to interpret. A temporary rule for one required port provides safer and more useful evidence than disabling all filtering.

## Additional Troubleshooting Guides and Practice

The following resources extend the core method with focused troubleshooting guidance and hands-on practice:

- See the [Slow or Intermittent Connections troubleshooting guide](/appendix/performance-troubleshooting/) when a connection works sometimes but suffers from delay, loss, or inconsistent behavior.
- Refer to the [Reading a Packet Capture guide](/appendix/reading-a-capture/) when simpler tests do not show where an exchange stops.

Packet captures and diagnostic output can contain names, addresses, credentials, cookies, tokens, and application data. Collect only what you are authorized to inspect, protect saved files, and review output before sharing it.

## Further Learning

- [Microsoft TCP/IP communication troubleshooting guidance](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-tcp-ip-communication-guidance) provides a detailed example of testing local configuration, the gateway, remote systems, and application ports.
- [Microsoft `Test-NetConnection` documentation](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection) explains its ping, TCP port, route tracing, and route-selection tests.
- [Microsoft `ping` documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping) documents Windows ICMP echo tests and their options.
- [Everything curl: verbose output](https://everything.curl.dev/usingcurl/verbose/) explains how `curl -v` exposes connection details.

## Main Takeaways

- Define the affected client, destination, expected result, actual result, scope, and timing before changing anything.
- When the failure location is unknown, work outward from the client to the gateway, remote address, DNS, port, and application.
- Treat a failed test as a boundary to investigate, and confirm it with another relevant piece of evidence.
- Change one thing at a time, repeat the original user action after the fix, and remove temporary changes.

## Where to Go Next

Choose the next topic that matches the work you want to do:

- For IT support or system administration, continue with wireless networking, VLAN configuration, and deeper Windows or Linux troubleshooting.
- For DevOps, cloud, or application operations, read the optional [Proxies and Load Balancers module](/13-proxies-load-balancers/), build a small private network in one cloud platform, then study container networking.
- For software development, explore HTTP diagnostics, certificates, application timeouts, and connection pooling.
- For cybersecurity, continue with network segmentation, firewall management, secure remote access, and packet analysis.
- For every path, add IPv6 addressing and routing to the IPv4 foundation in this guide.
