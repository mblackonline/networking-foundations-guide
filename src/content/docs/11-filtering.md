---
title: "Module 11: Firewalls and Filtering"
description: Stateful filtering, ACLs, host firewalls, and cloud security groups.
---

:::note[Draft]
This module is not written yet. The outline below is the planned coverage.
:::

## In This Module

- What stateful means, and why it changes the rules you have to write
- Ingress versus egress, and why most people only think about one
- Rule evaluation order and default deny
- Host firewalls compared with network firewalls
- Cloud security groups and network ACLs as the same ideas with different names
- Telling a firewall drop apart from other failures

## Planned Coverage

- Build the mental model first, a rule matches on the four-tuple plus direction and state
- Make the stateful point concrete, an allowed outbound connection does not need a matching inbound rule
- Diagnostic signal worth teaching, silent timeout usually means dropped, immediate refusal usually means nothing is listening
- Map the vocabulary across environments so the reader recognizes the same concept under different names

:::tip[Optional Lab]
Block a port on the Linux VM's firewall and connect from the Windows VM. Compare the symptom with stopping the service entirely, then compare both with a drop rule versus a reject rule.
:::

## Further Learning

To be added.

## Checklist Before Moving On

To be added.
