---
title: Slow or Intermittent Connections
description: Compare local and remote behavior when a connection works sometimes but is slow, unstable, or inconsistent.
---

Use this guide after [Module 14: Troubleshooting Method](/14-troubleshooting/) when a connection succeeds sometimes but performs poorly or fails unpredictably.

A single successful request proves only that one exchange worked. Intermittent problems require repeated observations, timestamps, and comparisons with a known working path.

## Define the Pattern

Before collecting data, ask:

- Is the problem constant, periodic, or random?
- Does it affect one client, one application, or many users?
- Does it happen on Wi-Fi, Ethernet, a virtual private network (VPN), or all connections?
- Is it tied to a location, time of day, large transfer, or application action?
- Did latency, packet loss, or throughput change from a known baseline?

Record the time and timezone of each occurrence. This lets an administrator compare the client symptoms with interface, firewall, access-point, server, and application logs.

## Compare the Gateway and a Remote Address

Run a bounded series of tests instead of leaving `ping` running indefinitely.

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

Compare the results:

| Pattern | Where to look next |
| --- | --- |
| Loss or large response-time changes begin at the gateway | Local Wi-Fi or Ethernet, switching, the client, or gateway load |
| Gateway results are stable but remote results are poor | Routing beyond the local network, an upstream provider, or the remote path |
| Both tests are stable but the application is slow | DNS, the destination port, Transport Layer Security (TLS), the application, or a backend dependency |
| Only one client is affected | That client's interface, driver, VPN, security software, configuration, or physical location |

These patterns narrow the investigation but do not prove the cause. Internet Control Message Protocol (ICMP) traffic may be handled differently from application traffic.

## Check Interface Counters

Interface counters can reveal errors or dropped traffic that increase while the problem occurs.

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

Record the counters, reproduce the problem for a short period, and check them again. A large lifetime total without a before-and-after comparison does not show when the errors occurred.

## Compare Wi-Fi and Ethernet

If practical, compare the same client and application over Ethernet and Wi-Fi.

- Poor Wi-Fi with stable Ethernet points toward signal strength, interference, channel use, roaming, or the wireless adapter.
- Poor results on both connections point elsewhere, although both paths may still share the same gateway or internet connection.
- A problem limited to one physical location may involve coverage or interference rather than the application.

Do not make several wireless changes at once. Record the original configuration and compare one controlled change at a time.

## Test the Actual Application

Ping does not measure application health. Repeat the exact operation that users report as slow, and compare it with a simpler protocol-specific test.

For a website:

```text
curl -v https://portal.example.com
```

Verbose output can show whether time was spent resolving the name, opening the connection, negotiating TLS, or waiting for an HTTP response. Review the output before sharing it because headers and other details may be sensitive.

If the application uses a different protocol, use a client or health check that speaks that protocol.

## Escalate with Focused Evidence

If the earlier comparisons do not locate the delay:

- Run `tracert` or `traceroute` and look for a consistent change, not one silent router.
- Compare an affected client with a working client at the same time.
- Check client, network-device, server, and application logs for the same timestamp.
- Use [Reading a Packet Capture](/appendix/reading-a-capture/) when you have a specific question about loss, retransmissions, connection setup, or response timing.

## Further Learning

- [Microsoft `ping` documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping) describes Windows packet-count and timeout options.
- [Microsoft `Get-NetAdapterStatistics` documentation](https://learn.microsoft.com/en-us/powershell/module/netadapter/get-netadapterstatistics?view=windowsserver2025-ps) describes Windows network-adapter statistics.
- [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/) covers packet capture and analysis in more depth.

## Main Takeaways

- Intermittent problems require repeated, timestamped observations rather than one successful test.
- Comparing the gateway, a remote destination, and the actual application helps locate where performance changes begin.
- Use before-and-after counters and a working comparison instead of drawing conclusions from isolated totals.
