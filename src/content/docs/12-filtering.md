---
title: "Module 12: Firewalls and Filtering"
description: Understand firewall rules, stateful filtering, traffic direction, and common failure symptoms.
---

A [firewall](/appendix/glossary/#firewall) controls which network traffic may enter, leave, or pass through a system.

For example, a server may accept Secure Shell (SSH) connections from an administrator's network while blocking SSH connections from everywhere else. The firewall makes that decision before the SSH service can authenticate the user.

A firewall does not replace passwords, software updates, or application security. It provides another layer of control.

## In This Module

- How rule fields and direction describe matching traffic
- How connection state, rule order, and default behavior affect a decision
- Where independent filtering layers can exist
- How to interpret and troubleshoot common failure symptoms

## What a Firewall Examines

For the Transmission Control Protocol (TCP) and User Datagram Protocol (UDP), a filtering rule commonly examines five values:

| Field | Example | Meaning |
| --- | --- | --- |
| Transport protocol | `TCP` | The transport protocol being filtered |
| Source Internet Protocol (IP) address | `10.0.20.15` | The system sending the packet |
| Source port | `51514` | The sending application's port |
| Destination IP address | `10.0.20.25` | The system receiving the packet |
| Destination port | `22` | The receiving service's port |

Together, these values are called the **[5-tuple](/appendix/glossary/#5-tuple)**.

A rule may also examine:

- Whether the traffic is inbound or outbound
- Whether it belongs to an existing connection
- Which network interface received it
- Which application or user generated it

Not every protocol uses port numbers. Internet Control Message Protocol (ICMP), which includes the messages used by `ping`, uses message types instead.

## Reading a Firewall Rule

Consider this rule:

```text
Direction:        Inbound
Protocol:         TCP
Source network:   10.0.20.0/24
Destination:      LINUXBOX
Destination port: 22
Action:           Allow
```

The rule allows systems in the `10.0.20.0/24` network to start SSH connections to TCP port 22 on the Linux Mint virtual machine named LINUXBOX.

The rule does not allow every protocol or every destination port. It also does not make SSH listen on port 22. The service must be running separately.

## Inbound and Outbound Are About Perspective

Traffic direction is measured from the system or boundary where the rule is applied.

| Direction | Meaning |
| --- | --- |
| Inbound, also called [ingress](/appendix/glossary/#ingress) | Traffic entering the protected system or network |
| Outbound, also called [egress](/appendix/glossary/#egress) | Traffic leaving the protected system or network |

Suppose the Windows 11 virtual machine named WINCLIENT starts an SSH connection to LINUXBOX:

```text
WINCLIENT:51514 -> LINUXBOX:22
```

The first packet is:

- Outbound from WINCLIENT
- Inbound to LINUXBOX

The reply travels in the opposite direction. Always identify the device or boundary whose perspective the rule uses.

## Stateful Filtering

A **[stateful firewall](/appendix/glossary/#stateful-firewall)** remembers active network flows.

Suppose WINCLIENT opens a Hypertext Transfer Protocol Secure (HTTPS) connection:

```text
Outbound request:
  Source device:           WINCLIENT
  Source TCP port:         51514
  Destination device:      Public web server
  Destination TCP port:    443

Inbound reply:
  Source device:           Public web server
  Source TCP port:         443
  Destination device:      WINCLIENT
  Destination TCP port:    51514
```

An outbound rule permits the new connection. When the web server replies, a stateful firewall recognizes the return packets as part of that connection and permits them.

You do not need an inbound rule allowing destination port 51514 merely to receive those replies. You would need an inbound rule if an outside system were starting a new connection to a service on WINCLIENT.

A **[stateless filter](/appendix/glossary/#stateless-filter)** evaluates each packet without remembering the connection. Its rules must separately allow the request and the return traffic.

Stateful filtering simplifies rules, but it does not determine whether the application data is safe. It only recognizes the flow as permitted traffic.

## Rule Actions

Common actions include:

| Action | Result |
| --- | --- |
| Allow | Pass matching traffic |
| Drop | Discard matching traffic without replying |
| Reject | Block matching traffic and send an error response |
| Log | Record information about matching traffic |

Logging is useful during troubleshooting, but logging every packet can produce too much data. Log the specific traffic you are investigating.

## Rule Order and Default Behavior

Many firewalls process rules in order and stop at the first match. Others combine rules or use precedence rules. For example, Windows Firewall gives an explicit block rule precedence over a conflicting allow rule.

Do not assume that moving a rule higher will change every firewall. Check how that product evaluates rules.

A **[default-deny](/appendix/glossary/#default-deny)** policy blocks traffic that no rule explicitly permits. A common starting point is:

- Block new inbound connections unless a required service has a specific allow rule.
- Permit or restrict outbound connections according to the organization's policy.

Rules should be no broader than necessary. Prefer a known source network and required destination port over an allow rule for every address and port.

## Where Filtering Can Happen

A connection may pass through several independent controls:

| Control | Where it filters |
| --- | --- |
| Host firewall | On an individual computer, such as Windows Firewall or Linux `nftables` |
| Network firewall | Between networks, often on a router, firewall appliance, or virtual gateway |
| Cloud traffic control | On a cloud resource, network interface, or subnet |

A router may perform both Network Address Translation (NAT) and firewall filtering, but they remain different functions. NAT changes addressing information; a firewall permits or blocks traffic.

If one layer allows a connection and another blocks it, the connection still fails.

## Cloud Names for Similar Controls

:::note[Optional: Role-Specific]
These product mappings are useful for cloud work. The generic rule fields, direction, state, and placement concepts apply even if you skip this section.
:::

Cloud platforms apply the same basic ideas, but their rule behavior differs:

| Cloud control | Scope and behavior |
| --- | --- |
| Amazon Web Services (AWS) security group | Resource-level, stateful allow rules |
| AWS network [access control list (network ACL)](/appendix/glossary/#access-control-list-acl) | Subnet-level, ordered allow and deny rules; stateless |
| Microsoft Azure network security group (NSG) | Network-interface or subnet-level, stateful allow and deny rules evaluated by priority |

Do not copy a rule set between platforms without checking direction, statefulness, default rules, and evaluation order.

## What a Firewall Failure Looks Like

| Symptom | Possible explanation |
| --- | --- |
| The connection waits and eventually times out | A firewall may be silently dropping traffic, but routing loss or an unavailable host can look the same |
| The connection is refused immediately | The host is reachable, but no service is listening, or a firewall actively rejected it |
| An existing connection works but a new one fails | A rule change may affect new connections while existing state remains active |
| One source works and another fails | A rule may restrict the allowed source address or network |

These symptoms are clues, not proof. Confirm them with firewall logs, rule counters, packet captures, and the service's listening-port status.

## A Short Troubleshooting Order

1. Confirm the destination address, transport protocol, and port.
2. Confirm that the service is running and listening on the expected interface.
3. Identify every filtering layer between the client and server.
4. Check the rule from the perspective of each layer: inbound or outbound.
5. Compare the traffic's 5-tuple with the rule.
6. Check rule order, default behavior, logs, and counters.

:::caution
Do not disable an entire firewall as your first test. A narrow temporary rule limited by source, protocol, and destination port provides better evidence with less risk.
:::

:::tip[Optional Lab: Allow and Block Ping in NETLAB]
Run this exercise only on WINCLIENT inside the isolated NETLAB network. It creates two temporary Windows Firewall rules and removes them before the exercise ends.

1. On WINCLIENT, run `ipconfig` and record its `10.0.20.x` address.
2. Open PowerShell as Administrator on WINCLIENT. Create a rule allowing inbound Internet Control Message Protocol version 4 (ICMPv4) echo requests from NETLAB:

   ```text
   New-NetFirewallRule -DisplayName "NETGUIDE Temporary ICMP Allow" -Direction Inbound -Protocol ICMPv4 -IcmpType 8 -RemoteAddress 10.0.20.0/24 -Action Allow
   ```

3. On LINUXBOX, replace `<WINCLIENT-IP>` with the address from step 1:

   ```text
   ping -c 4 <WINCLIENT-IP>
   ```

   WINCLIENT should reply.

4. On WINCLIENT, add a conflicting block rule:

   ```text
   New-NetFirewallRule -DisplayName "NETGUIDE Temporary ICMP Block" -Direction Inbound -Protocol ICMPv4 -IcmpType 8 -RemoteAddress 10.0.20.0/24 -Action Block
   ```

5. Repeat the ping from LINUXBOX. It should time out because the explicit block rule takes precedence.
6. On WINCLIENT, remove both temporary rules:

   ```text
   Remove-NetFirewallRule -DisplayName "NETGUIDE Temporary ICMP Block"
   Remove-NetFirewallRule -DisplayName "NETGUIDE Temporary ICMP Allow"
   ```

The final ping behavior returns to whatever WINCLIENT's original firewall policy allowed.
:::

## Further Learning

- [National Institute of Standards and Technology (NIST) Special Publication 800-41 Revision 1](https://csrc.nist.gov/pubs/sp/800/41/r1/final) provides guidance on firewall technologies and policy.
- [Microsoft Windows Firewall rules](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/rules) explains Windows rule behavior and precedence.
- [AWS infrastructure security guidance](https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html) compares security groups with network access control lists.
- [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview) explains Azure rule fields, priority, and statefulness.

## Main Takeaways

- Firewalls compare traffic with rules based on values such as addresses, ports, protocols, direction, and connection state.
- Direction is measured from the system or boundary where a rule is applied, and stateful filtering can recognize return traffic.
- Every independent host, network, or cloud filtering layer must permit the connection.

Continue to [Module 13: Proxies and Load Balancers](/13-proxies-load-balancers/) if your work involves application delivery or cloud services. It is optional; otherwise, go directly to [Module 14: Troubleshooting Method](/14-troubleshooting/).
