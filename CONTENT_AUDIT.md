# Networking Foundations Guide Content Audit

Status: Approved and implemented on July 28, 2026. This file remains as the decision record for the revision.

> **Later revision:** On July 29, 2026, the subnetting material was promoted from an appendix into Module 5. The former Modules 5–13 became Modules 6–14, and packet-capture material received its own **Packet Analysis** navigation section. The recommendations below describe the earlier audit and are retained as historical context.

Scope reviewed:

- `src/content/docs/index.md`
- Modules `01-layers.md` through `13-troubleshooting.md`
- `src/content/docs/appendix/glossary.md`
- `src/content/docs/appendix/port-reference.md`
- `src/content/docs/appendix/reading-a-capture.md`
- `src/content/docs/appendix/subnetting-practice.md`

The generated site, dependencies, repository metadata, and `404.md` were outside this content audit.

## Classification Rubric

| Category | Meaning in this audit |
| --- | --- |
| Foundation | Required to understand later concepts or troubleshoot common connectivity failures. |
| Useful Context | Supports the foundation but does not need equal emphasis during a first reading. |
| Explore Later | Safe to skip on a first reading and return to when the reader wants practice or detail. |
| Role-Specific | Primarily useful in system administration, cloud, DevOps, software, security, network engineering, or certification work. |

The recommended actions use the handoff vocabulary: **Keep**, **Shorten**, **Merge**, **Label as optional**, **Move to appendix**, and **Remove**. Combined actions such as “Shorten; label as optional” mean the material remains available but receives less first-pass emphasis.

## Executive Recommendation

The guide is technically strong and does not need a large deletion pass. Its main problem is presentation: foundational explanations, implementation detail, extended labs, and role-specific material often receive the same visual weight.

Recommended first-pass structure:

1. Keep Modules 1–11 and 13 as the core conceptual sequence.
2. Slim Module 2 to tools, tool verification, Wireshark safety, and a first capture. Move the full NETLAB build to a new appendix.
3. Keep `/24` subnet reasoning in Module 4. Consolidate non-`/24` calculations and the full prefix table in the existing Subnetting Practice appendix.
4. Keep the core NAT flow in Module 6. Move the detailed port-forwarding explanation and local VirtualBox port-forward lab to an appendix or clearly separated Explore Later page.
5. Mark Module 12 as **Optional: Role-Specific**. Module 13 does not depend on it.
6. Move the long Module 12 NGINX lab to an appendix.
7. Add explicit first-reading labels to optional labs, deeper protocol detail, cloud examples, and role-specific callouts.
8. Limit every Main Takeaways section to three short foundational statements. Add a Main Takeaways section to Module 13.
9. Add a Core Learning Path to the welcome page and give readers a direct route from Module 11 to Module 13, with Module 12 offered as an optional detour.
10. Do not renumber modules. Stable page addresses and existing links are more valuable than making the optional module disappear from the numbering.

No section needs outright removal based on breadth alone. The duplicated port and subnet reference material should be merged or shortened rather than maintained in two places.

## Proposed Core Learning Path

The welcome page should present this as a concise first-reading route:

| Step | First-reading focus | Safe to skip initially |
| --- | --- | --- |
| Module 1 | Layers and encapsulation | Detailed Open Systems Interconnection model comparison |
| Module 2 | Basic tools and how to read their purpose | Virtual machines and the full lab build |
| Module 3 | Frames, Media Access Control addresses, switches, and Address Resolution Protocol | Virtual local area network details and exercises |
| Module 4 | `/24`, subnet mask, local versus remote, gateway, and private ranges | Non-`/24` calculations |
| Module 5 | Routing table, connected route, longest prefix, default route, and traceroute | Routing protocols and virtual private network modes |
| Module 6 | Outbound Network Address Translation, return state, shared addresses, and inbound behavior | Port-forward implementation and edge cases |
| Module 7 | Ports, sockets, Transmission Control Protocol, and User Datagram Protocol | Extended port catalog and capture lab |
| Module 8 | Supplied settings, basic lease flow, and `169.254.x.x` symptoms | Server choices, relays, and enterprise implementation notes |
| Module 9 | Resolver, authoritative server, address records, caching, and tests | Specialized records and Active Directory detail |
| Module 10 | Web address, request/response, status, Hypertext Transfer Protocol Secure, and certificate checks | Detailed handshake, certificate chain, and Server Name Indication |
| Module 11 | Rule fields, direction, state, placement, and failure symptoms | Cloud-product comparison and lab |
| Module 13 | Repeatable troubleshooting method | Extended packet-capture work |

Module 12 should be shown separately as **Optional: Proxies and Load Balancers for systems administration, cloud, DevOps, and software roles**.

## Section-Level Audit

### `src/content/docs/index.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Hero and page introduction | Foundation | Establishes the guide’s promise and starting point. | Keep; add a Core Learning Path action or section. |
| Work in Progress callout | Useful Context | Sets honest expectations without affecting the learning sequence. | Keep. |
| About This Guide | Useful Context | Explains authorship, artificial-intelligence assistance, and correction channels. | Keep. |
| Purpose and Audience | Useful Context | Identifies the broad audience but overlaps the hero and About section. | Merge with About This Guide. |
| What This Guide Covers | Useful Context | Defines scope and avoids overpromising completeness. | Keep. |
| How the Hands-On Parts Work | Explore Later | The lab supports learning but should not appear required for conceptual progress. | Shorten; label as optional; link to the proposed lab appendix. |
| Source and Reuse | Useful Context | Clearly states source availability and licensing. | Keep. |
| Proposed: Core Learning Path | Foundation | Readers currently receive no clear first-pass route or skip guidance. | Add using the path summarized above. |

### `src/content/docs/01-layers.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Explains why the vocabulary belongs to one system. | Keep. |
| In This Module | Useful Context | Previews the page but should reflect only the core ideas. | Shorten to layers, the two models, and encapsulation. |
| Why Layers Exist | Foundation | Provides the organizing model used throughout the guide and in troubleshooting. | Keep. |
| The TCP/IP Model | Foundation | Establishes the four responsibilities used by later modules. | Keep. |
| The OSI Model | Useful Context | Readers need to recognize layer numbers, but not study all seven layers on the first pass. | Shorten; label the detailed mapping as optional context. |
| Encapsulation | Foundation | Connects application data, segments, packets, frames, and local delivery. | Keep; qualify the statement that Internet Protocol addresses remain unchanged when Network Address Translation is present. |
| Further Learning | Explore Later | External material is intentionally deeper than the module. | Label as optional. |
| Main Takeaways | Foundation | Accurately summarizes the page’s three essential ideas. | Keep. |

### `src/content/docs/02-toolkit-and-lab.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Useful Context | Sets up tools, but “strongly recommended” competes with the claim that the lab is optional. | Shorten; make the two paths explicit: read-only and hands-on. |
| In This Module | Useful Context | Mixes a short tool orientation with a much larger environment build. | Shorten after moving the lab build. |
| The Tools You Already Have | Foundation | Introduces the questions each operating-system tool can answer. | Keep; shorten package-install notes or place them beside the exercises that require them. |
| Verify Your Tools | Foundation | Gives a low-risk readiness check without requiring interpretation yet. | Keep. |
| Install Wireshark | Useful Context | Packet capture is valuable but not required for every first-pass reader. | Keep; label as optional and retain the authorization warning. |
| Your First Capture | Explore Later | Makes Domain Name System traffic concrete but introduces capture detail before the DNS module. | Label as optional; keep as a short orientation. |
| About the Optional Lab | Explore Later | Explains the value and resource requirements of the lab. | Shorten; link to a dedicated lab appendix. |
| Build the Lab Network | Role-Specific | Hypervisor setup is implementation work rather than a networking prerequisite. | Move to appendix. |
| Build WINCLIENT | Role-Specific | Operating-system installation is lengthy and does not teach a core networking concept. | Move to appendix. |
| Build LINUXBOX | Role-Specific | Operating-system installation and package setup are lab implementation details. | Move to appendix. |
| Confirm the Two VMs Can See Each Other | Useful Context | Validates the lab but is relevant only after a reader builds it. | Move to appendix with the build. |
| Further Learning | Explore Later | Provides tool and platform references. | Label as optional. |
| Main Takeaways | Foundation | Correctly focuses on tool purpose rather than lab construction. | Keep. |

### `src/content/docs/03-local-network.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Establishes local-link scope before routing. | Keep. |
| In This Module | Useful Context | Good preview, but the virtual local area network item should be marked optional. | Shorten; label the virtual local area network item as optional. |
| Frames and MAC Addresses | Foundation | Explains local delivery and the scope difference from Internet Protocol addresses. | Shorten slightly; retain randomized-address caveat as useful context. |
| How a Switch Learns | Foundation | Explains forwarding, flooding, and what a capture normally sees. | Keep. |
| ARP | Foundation | Required to understand local IPv4 delivery and common failures. | Keep. |
| Broadcast Domains | Foundation | Establishes the boundary at which routing becomes necessary. | Shorten; remove the unsupported “few hundred versus few thousand” sizing generalization. |
| VLANs | Role-Specific | The concept is common in administration and networking but not required for the next module. | Keep concise; label as optional/role-specific. |
| Try It Yourself | Useful Context | Demonstrates Address Resolution Protocol without requiring the full lab. | Label as optional. |
| Optional Lab callout | Explore Later | Reinforces local-scope behavior inside NETLAB. | Keep; retain the optional label. |
| Further Learning | Explore Later | Includes standards, simulator, and detailed virtual local area network material. | Label as optional. |
| Main Takeaways | Foundation | Correctly prioritizes switches, Address Resolution Protocol, and routing boundaries. | Keep. |

### `src/content/docs/04-addressing-subnetting.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Correctly identifies local-versus-remote as the module’s central idea. | Keep. |
| In This Module | Useful Context | Currently gives detailed calculation goals equal weight with the central decision. | Shorten to address, prefix/mask, local versus remote, gateway, and `/24` range. |
| Four Octets, Thirty-Two Bits | Useful Context | Explains representation but is not itself needed for routine `/24` troubleshooting. | Shorten. |
| An Address Needs a Prefix | Foundation | Establishes why an address alone is incomplete. | Keep. |
| Local or Remote? | Foundation | Connects the mask to Address Resolution Protocol and the default gateway. | Keep. |
| What the Mask Is Doing | Foundation | Gives enough binary context to make the prefix meaningful. | Keep concise. |
| Moving the Boundary | Explore Later | Bit-place calculations are safe to postpone. | Move to the Subnetting Practice appendix. |
| Common Prefixes | Explore Later | The table duplicates the complete reference and exceeds first-pass needs. | Move/merge into the Subnetting Practice appendix; retain `/24` and a link. |
| Network, Broadcast, and Hosts | Foundation | Defines the addresses needed for common IPv4 troubleshooting. | Keep with the `/24` example. |
| Finding the Range of a /24 | Foundation | Provides the appropriate introductory calculation. | Keep. |
| Private IPv4 Addresses | Foundation | Private ranges recur in Network Address Translation, labs, homes, and cloud networks. | Keep. |
| Why Addresses Come in Ranges | Useful Context | Explains allocation, but the full address-space narrative is not required for later modules. | Shorten. |
| What a Wrong Mask Does | Foundation | Directly connects configuration errors with observed behavior. | Keep. |
| Try It Yourself | Useful Context | Applies the `/24` calculation to the reader’s system. | Keep; label as optional practice. |
| Optional Lab callout | Explore Later | Demonstrates a deliberately wrong mask and safe restoration. | Keep; retain the optional label. |
| Further Learning | Explore Later | Points to standards and calculation practice. | Label as optional. |
| Main Takeaways | Foundation | Correctly limits the summary to mask, prefix, and gateway decisions. | Keep. |

### `src/content/docs/05-routing.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Cleanly follows the local-versus-remote decision from Module 4. | Keep. |
| In This Module | Useful Context | Includes two optional subjects in the same list as core route selection. | Shorten; identify static/dynamic routing as optional context. |
| The Routing Table | Foundation | Defines destination, next hop, interface, and metric. | Keep. |
| Longest Prefix Match | Foundation | Required to understand actual route selection and overlapping routes. | Keep. |
| The Default Route | Foundation | Required for common workstation and gateway troubleshooting. | Keep. |
| View Your Routes | Foundation | Shows readers how the same concepts appear on three operating systems. | Keep. |
| Static and Dynamic Routes | Role-Specific | Useful for administrators and network engineers; protocol names need recognition, not first-pass study. | Shorten; label as optional/role-specific. |
| How a VPN Changes Routing | Useful Context | Virtual private network route changes are common but not required for the core route model. | Keep concise; label as optional. |
| Follow the Path With Traceroute | Foundation | Provides a common diagnostic tool and prevents overinterpreting silent hops. | Keep. |
| Try It Yourself | Useful Context | Reinforces connected and default routes with a read-only test. | Keep; label as optional practice. |
| Optional Lab callout | Explore Later | Demonstrates a host route and next-hop selection through a temporary change. | Keep; retain the optional label. |
| Further Learning | Explore Later | Goes deeper into route behavior and commands. | Label as optional. |
| Main Takeaways | Foundation | Accurately summarizes route entries, specificity, and traceroute. | Keep. |

### `src/content/docs/06-nat.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Establishes why private IPv4 traffic is translated for public routing. | Keep. |
| In This Module | Useful Context | Port forwarding and edge cases currently appear equal to the core outbound flow. | Shorten to translation, return state, address sharing, inbound difference, and firewall distinction. |
| What Performs NAT? | Useful Context | Prevents readers from treating Network Address Translation as one appliance type. | Shorten. |
| One Outbound Request | Foundation | Clearly shows which address changes and which remains the destination. | Keep. |
| How the Reply Gets Back | Foundation | Explains why translation state is required. | Keep. |
| Sharing One Public Address | Foundation | Connects address-and-port state to multiple private clients. | Shorten slightly; keep Port Address Translation terminology as supporting context. |
| Why Inbound Is Different | Foundation | Explains why an unsolicited connection lacks a mapping. | Keep. |
| NAT Is Not a Firewall | Foundation | Corrects a common and consequential misconception. | Keep. |
| Common Places You Will See NAT | Useful Context | Connects the concept to homes, cloud, containers, and virtual private networks. | Shorten; use role labels for cloud/container examples. |
| Double NAT and Carrier-Grade NAT | Useful Context | Important troubleshooting clue but safe to skip during the first pass. | Keep concise; label as optional. |
| IPv6 callout | Useful Context | Prevents the IPv4 behavior from being generalized to all networking. | Keep. |
| Try It Yourself | Useful Context | Provides a simple observable comparison with an explicit privacy note. | Keep; label as optional practice. |
| Port Forwarding | Role-Specific | The definition is useful, while configuration and exposure decisions are administrative work. | Leave a short definition in the module; move the detailed section to an appendix. |
| Publishing a Container Port callout | Role-Specific | Primarily relevant to software and DevOps work. | Move with the port-forwarding detail; label as role-specific. |
| Optional Lab: A Local-Only VirtualBox Port Forward | Explore Later | Safe and well-scoped, but lengthy and not required for later concepts. | Move to appendix; retain the local-only safety constraints. |
| Further Learning | Explore Later | Contains implementation and standards references. | Label as optional. |
| Main Takeaways | Foundation | Correctly prioritizes translation, state, and firewall separation. | Keep. |

### `src/content/docs/07-transport.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Establishes why device addressing alone cannot identify an application. | Keep. |
| In This Module | Useful Context | Good preview but can be reduced to four central ideas. | Shorten. |
| IP Addresses and Ports Do Different Jobs | Foundation | Builds the endpoint model used by firewall, web, and troubleshooting modules. | Keep. |
| How Port Numbers Work | Foundation | Port spaces and ephemeral source ports are essential; the long service catalog is not. | Shorten; merge the extended catalog and SFTP/FTPS comparison with the Port and Protocol Reference appendix. |
| Sockets and Connection Identity | Foundation | Explains listening endpoints, connections, and four-/five-tuple identity. | Keep. |
| TCP: An Ordered, Reliable Stream | Foundation | Defines the behavior applications depend on. | Keep. |
| The Three-Way Handshake | Foundation | Required to interpret connection tests and captures. | Keep. |
| Closing or Rejecting a Connection | Useful Context | Finish and reset flags help interpret failures but need little detail. | Keep concise. |
| UDP: Independent Datagrams | Foundation | Provides the necessary contrast with Transmission Control Protocol without calling it inferior. | Keep. |
| Listening Ports and Active Connections | Foundation | Required to distinguish a local listener from a reachable remote service. | Keep. |
| Try It Yourself | Useful Context | Applies socket concepts using read-only inspection. | Keep; label as optional practice. |
| Optional Lab: Capture a TCP Handshake | Explore Later | Reinforces handshake flags through a safe lab capture. | Keep; retain the optional label. |
| Further Learning | Explore Later | Links specifications and command references. | Label as optional. |
| Main Takeaways | Foundation | Correctly prioritizes endpoints, transport behavior, and socket state. | Keep. |

### `src/content/docs/08-dhcp.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Explains the operational problem the protocol solves. | Keep. |
| In This Module | Useful Context | Server providers and relay behavior receive too much first-pass prominence. | Shorten to supplied settings, lease exchange, and failure clues. |
| What DHCP Does | Foundation | Defines the client configuration values and why they must agree. | Keep. |
| What Can Provide DHCP? | Useful Context | Correctly treats Dynamic Host Configuration Protocol as a role, but the provider catalog is implementation-oriented. | Shorten; label enterprise and cloud examples as role-specific. |
| DHCP and Active Directory callout | Role-Specific | Valuable to Windows administrators but unnecessary for a general first reading. | Keep; label as role-specific. |
| How a New Client Finds the Server | Foundation | Explains broadcast discovery before the client has normal settings. | Keep. |
| The Discover, Offer, Request, Acknowledgment Exchange | Foundation | Provides the recognizable lease-acquisition sequence. | Keep. |
| Leases and Reservations | Useful Context | Explains renewal and predictable assignments without requiring server configuration. | Keep. |
| Reservation Versus Static Address | Foundation | Prevents address conflicts and a common configuration misconception. | Keep. |
| What a DHCP Relay Does | Role-Specific | Mainly relevant to routed enterprise or campus networks. | Keep concise; label as optional/role-specific. |
| What a 169.254 Address Means | Foundation | Provides a common, high-value troubleshooting clue. | Keep. |
| Inspect a Windows DHCP Lease | Foundation | Shows how to verify the settings supplied to a client. | Keep. |
| Common DHCP Symptoms | Foundation | Maps visible symptoms to the correct settings and infrastructure. | Keep. |
| Optional Lab: Renew WINCLIENT’s NETLAB Lease | Explore Later | Safe, reversible practice that is not required for conceptual progress. | Keep; retain the optional label. |
| Further Learning | Explore Later | Covers protocol and implementation detail. | Label as optional. |
| Main Takeaways | Foundation | The current relay takeaway elevates optional infrastructure over common failure recognition. | Shorten/rewrite the third bullet around complete client configuration or link-local failure clues. |

### `src/content/docs/09-dns.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Establishes names versus network destinations and the limits of the analogy. | Keep. |
| In This Module | Useful Context | Includes specialized records at the same level as the resolver model. | Shorten. |
| DNS in One Sentence | Foundation | Clearly separates name lookup from the later application connection. | Keep. |
| The DNS Server Your Client Uses | Foundation | Defines client, recursive resolver, and authoritative server roles. | Keep. |
| DNS and Active Directory callout | Role-Specific | Important to Windows administration but not part of the general resolver path. | Keep; label as role-specific. |
| Reading a Domain Name | Useful Context | The hierarchy helps explain delegation, but the trailing-dot detail can be secondary. | Shorten slightly; label the fully qualified trailing-dot detail as optional context. |
| One Lookup from Client to Answer | Foundation | Provides the resolver/cache/hierarchy model required for troubleshooting. | Keep. |
| Common DNS Record Types | Foundation | Address and alias records are core; mail, service, and policy records are role-specific. | Shorten the first-pass list to A, AAAA, and CNAME; place MX, NS, PTR, SRV, and TXT in a clearly optional block. |
| DNS Uses UDP and TCP Port 53 | Foundation | Prevents incomplete firewall rules and explains inconsistent failures. | Keep. |
| Caching and Time to Live | Foundation | Required to understand delayed changes and differing client answers. | Keep. |
| Query DNS on Windows | Foundation | Provides the Windows diagnostic path. | Merge with the Linux section under a cross-platform “Query DNS” heading. |
| Query DNS on Linux | Foundation | Provides the Linux diagnostic path. | Merge with the Windows section. |
| Common DNS Failure Clues | Foundation | Maps response states and split/internal behavior to likely causes. | Keep. |
| A Short Troubleshooting Order | Foundation | Converts the model into a repeatable diagnostic sequence. | Keep. |
| Optional Lab: Compare DNS Answers in NETLAB | Explore Later | Read-only practice that reinforces server and record comparison. | Keep; retain the optional label. |
| Further Learning | Explore Later | Goes into protocol specifications and platform behavior. | Label as optional. |
| Main Takeaways | Foundation | Correctly prioritizes records, resolver/authority roles, and caching. | Keep. |

### `src/content/docs/10-http-tls.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Connects Domain Name System, transport, Transport Layer Security, and application response stages. | Keep. |
| In This Module | Useful Context | Can emphasize request/response, status, protection, and certificate validation. | Shorten. |
| Reading a Web Address | Foundation | Establishes scheme, hostname, and path for later tests. | Keep. |
| HTTP Is a Request and Response Protocol | Foundation | Shows the application exchange that follows connectivity. | Keep. |
| Common HTTP Methods | Useful Context | Recognition is useful, but a beginner does not need equal emphasis on every method. | Shorten. |
| Reading an HTTP Response | Foundation | Provides the evidence needed to distinguish transport from application behavior. | Keep. |
| HTTP Status Codes | Foundation | Status families are high-value troubleshooting signals. | Keep; retain only the most useful examples. |
| HTTPS Adds TLS Protection | Foundation | Defines protections and limitations without claiming that encryption makes content safe. | Keep. |
| A Simplified TLS Handshake | Explore Later | The ordering is useful, but key-establishment detail is not required for first-pass troubleshooting. | Shorten; label as optional. |
| What the Certificate Proves | Foundation | Name, time, and trust are the essential certificate checks. | Keep those three checks; shorten the chain detail. |
| Why One IP Address Can Host Many Websites | Role-Specific | Server Name Indication is useful for administrators, cloud, DevOps, and web developers. | Keep concise; label as optional/role-specific. |
| Find the Layer That Failed | Foundation | Directly maps symptoms to Domain Name System, connection, Transport Layer Security, and Hypertext Transfer Protocol stages. | Keep. |
| Inspect an HTTPS Exchange with curl | Useful Context | A strong diagnostic exercise but not required to understand the page. | Keep; label as optional practice. |
| Further Learning | Explore Later | Links current specifications and command documentation. | Label as optional. |
| Main Takeaways | Foundation | Correctly summarizes the request/response, protection, and failure-stage model. | Keep. |

### `src/content/docs/11-filtering.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | Defines the control boundary and correctly separates it from application security. | Keep. |
| In This Module | Useful Context | Can be reduced to rule fields, perspective, state, placement, and symptoms. | Shorten. |
| What a Firewall Examines | Foundation | Connects five-tuple fields with real filtering decisions. | Keep. |
| Reading a Firewall Rule | Foundation | Teaches readers to translate a rule into actual permitted traffic. | Keep. |
| Inbound and Outbound Are About Perspective | Foundation | Corrects one of the most common rule-reading mistakes. | Keep. |
| Stateful Filtering | Foundation | Explains why return traffic often works without a separate broad inbound rule. | Keep. |
| Rule Actions | Useful Context | Drop versus reject provides helpful symptom context. | Keep concise. |
| Rule Order and Default Behavior | Foundation | Required to understand why an apparently correct rule may not take effect. | Keep. |
| Where Filtering Can Happen | Foundation | Establishes that every independent layer must permit the connection. | Keep. |
| Cloud Names for Similar Controls | Role-Specific | Product mappings are valuable for cloud roles but not required for the generic model. | Keep; label as role-specific. |
| What a Firewall Failure Looks Like | Foundation | Gives appropriately cautious symptom interpretations. | Keep. |
| A Short Troubleshooting Order | Foundation | Provides a concrete, safe diagnostic sequence. | Keep. |
| Optional Lab: Allow and Block Ping in NETLAB | Explore Later | Demonstrates precedence with temporary scoped rules and cleanup. | Keep; retain the optional label. |
| Further Learning | Explore Later | Provides policy and vendor implementation references. | Label as optional. |
| Main Takeaways | Foundation | Good summary, but statefulness and perspective are more foundational than enumerating all actions. | Shorten/rewrite around fields, perspective/state, and independent filtering layers. |

### `src/content/docs/12-proxies-load-balancers.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Role-Specific | Proxy and load-balancer architecture is not required by Module 13 or basic host troubleshooting. | Label the entire module as Optional: Role-Specific. Correct the absolute claim that every load balancer creates two connections. |
| In This Module | Role-Specific | All listed topics primarily serve systems, cloud, DevOps, and software roles. | Keep under the module-level optional label. |
| Forward and Reverse Proxies | Useful Context | The directional distinction is the most broadly useful part of the module. | Keep concise. |
| Forward Proxy | Useful Context | Helps readers recognize client-side intermediaries. | Keep. |
| Reverse Proxy | Role-Specific | Common in application delivery and administration. | Keep. |
| One Public Service with Two Backends | Role-Specific | Provides the architecture model used by the rest of the module. | Keep; qualify that it describes a connection-terminating proxy design. |
| What a Load Balancer Does | Role-Specific | Selection and backend pools are operational architecture concepts. | Keep. |
| Layer 4 and Layer 7 Load Balancing | Role-Specific | Useful for selecting and diagnosing application-delivery components. | Keep; distinguish pass-through from terminating load balancers. |
| TLS Termination | Role-Specific | Relevant to certificate placement and backend security decisions. | Keep. |
| Health Checks | Role-Specific | Essential for diagnosing managed and self-hosted load balancers. | Keep. |
| Session Persistence | Role-Specific | Important for stateful applications but safe to postpone even within this module. | Shorten; label as Explore Later. |
| Preserving the Client Address | Role-Specific | Required for trustworthy logs and proxy-aware applications. | Keep. |
| Common Failure Clues | Role-Specific | Provides high-value mappings for proxy and upstream failures. | Keep. |
| A Short Troubleshooting Order | Role-Specific | Correctly treats the public and backend paths separately for a terminating proxy. | Keep; state the assumed proxy architecture. |
| Optional Lab: A Reverse Proxy in NETLAB | Explore Later | The NGINX installation and configuration are lengthy implementation work. | Move to appendix; retain explicit cleanup steps. |
| Further Learning | Explore Later | Covers products and implementation details. | Label as optional. |
| Main Takeaways | Role-Specific | Appropriate for readers who choose the optional module. | Keep after correcting the architecture qualification. |

### `src/content/docs/13-troubleshooting.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Foundation | States the evidence-based method that the entire guide builds toward. | Keep. |
| In This Module | Useful Context | Good overview but can be reduced to problem definition, ordered tests, evidence limits, and safe changes. | Shorten. |
| Define the Problem First | Foundation | Turns an untestable complaint into a scoped technical symptom. | Keep. |
| Follow the Connection | Foundation | Provides the repeatable sequence and explains its relationship to layers. | Keep. |
| 1. Check the Physical or Wireless Connection | Foundation | Prevents wasted higher-layer investigation when the attachment is wrong. | Keep. |
| 2. Check the Client’s Network Settings | Foundation | Verifies address, prefix, gateway, and resolver configuration. | Keep. |
| 3. Check Name Resolution | Foundation | Separates name errors from path and service errors. | Keep. |
| 4. Check the Route and Basic Reachability | Foundation | Uses route, ping, and traceroute without overstating what they prove. | Keep. |
| 5. Test the Required Port | Foundation | Distinguishes host reachability, listening state, and remote reachability. | Keep. |
| 6. Test the Application | Foundation | Confirms the final protocol stage and preserves evidence from status responses. | Keep. |
| What Each Result Tells You | Foundation | Maps common results to bounded hypotheses rather than definitive causes. | Keep. |
| Know What a Test Does Not Prove | Foundation | Directly teaches disciplined interpretation. | Keep. |
| When the Network Is Not the Problem, Look at Startup Order callout | Role-Specific | Valuable for systems, DevOps, and software operations but not part of the general network sequence. | Keep; label as role-specific. |
| Change One Thing at a Time | Foundation | Provides a safe, evidence-preserving change method. | Keep. |
| When to Reach for a Packet Capture | Useful Context | Helps escalate diagnosis while the appendix contains the detailed capture workflow. | Shorten; link prominently to Reading a Packet Capture; label as optional. |
| Record the Evidence | Foundation | Makes troubleshooting repeatable and transferable. | Keep. |
| Optional Lab: Find a Stopped Service | Explore Later | Safely demonstrates client and server evidence around a stopped listener. | Keep; retain the optional label. |
| Further Learning | Explore Later | Provides tool-specific follow-up material. | Label as optional. |
| Proposed: Main Takeaways | Foundation | Every core module should close with the few ideas that matter most. | Add three bullets before Where to Go Next. |
| Where to Go Next | Role-Specific | Gives appropriate next steps without making them prerequisites. | Keep. |

### `src/content/docs/appendix/glossary.md`

The alphabetical headings are navigation rather than a learning sequence. The appendix as a whole is **Useful Context** and should remain a lookup page.

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Useful Context | Explicitly tells readers not to memorize the page. | Keep. |
| Numbers | Useful Context | Defines four- and five-tuple references used in core modules. | Keep. |
| A | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| B | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| C | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| D | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| E | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| F | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| H | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| I | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| L | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| M | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| N | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| O | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| P | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| R | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| S | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| T | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| U | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| V | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| Z | Useful Context | Contains referenced definitions and stable anchors. | Keep. |
| Source and Copyright Note | Useful Context | Correctly distinguishes links from reproduced third-party content. | Keep. |

Do not move glossary entries merely because their topics are role-specific. A reference page benefits from one alphabetical location, and many modules link directly to its explicit anchors.

### `src/content/docs/appendix/port-reference.md`

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Useful Context | Correctly frames ports as clues rather than a memorization or security list. | Keep. |
| Port Number Ranges | Useful Context | Provides the authoritative range model and supports Module 7. | Keep; make this the single detailed range table. |
| Core Network Services | Useful Context | Common troubleshooting reference for Domain Name System, Dynamic Host Configuration Protocol, and time. | Keep. |
| Web Services | Useful Context | Common reference for web diagnostics. | Keep. |
| Remote Access and File Services | Role-Specific | Primarily useful to support and systems administrators. | Keep under the reference-page framing. |
| SFTP Is Not FTPS | Useful Context | Corrects a common operational naming mistake. | Keep here; remove duplicated detail from Module 7. |
| Email Services | Role-Specific | Useful to messaging and systems roles but not a core-course requirement. | Keep. |
| Directory and Authentication Services | Role-Specific | Useful to identity and Windows administration. | Keep. |
| Monitoring and Logging | Role-Specific | Useful to operations and security roles. | Keep. |
| Common Database Defaults | Role-Specific | Useful to application and database operations. | Keep. |
| Protocols Without Ports | Foundation | Prevents invalid assumptions about Internet Control Message Protocol and firewall rules. | Keep. |
| A Port Number Is Not a Security Decision | Foundation | Prevents unsafe use of the reference. | Keep. |
| Further Learning | Explore Later | Points to authoritative registries and platform-specific requirements. | Label as optional. |

### `src/content/docs/appendix/reading-a-capture.md`

The whole appendix should be labeled **Optional: Explore Later**. Its safety guidance remains mandatory whenever a reader chooses to capture traffic.

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Explore Later | Establishes a question-driven capture mindset. | Keep; add an Optional: Explore Later label. |
| Choose the Right Interface | Explore Later | Necessary practical context for a useful capture. | Keep. |
| Capture Filters and Display Filters | Explore Later | Prevents a common tool-usage error. | Keep. |
| Understand the Three Panes | Explore Later | Gives the minimum interface orientation. | Keep. |
| Useful Display Filters | Explore Later | Provides a compact diagnostic reference used by labs. | Keep. |
| Recognize a TCP Connection | Explore Later | Applies Module 7 to packet evidence. | Keep. |
| Recognize a DNS Failure | Explore Later | Applies Module 9 to packet evidence. | Keep. |
| Follow One Conversation | Explore Later | Useful Wireshark workflow after basic filtering. | Keep. |
| A Simple Workflow | Explore Later | Provides a disciplined capture process. | Keep. |
| Protect the Capture | Foundation | Authorization and sensitive-data handling are required whenever captures are used. | Keep with strong visibility. |
| Further Learning | Explore Later | Provides tool documentation beyond the appendix. | Label as optional. |

### `src/content/docs/appendix/subnetting-practice.md`

The whole appendix should remain **Optional: Explore Later** and become the single home for non-`/24` calculation detail.

| Section | Category | Reason | Recommended action |
| --- | --- | --- | --- |
| Page introduction | Explore Later | Correctly states that the tables are not prerequisites. | Keep; add a visible Optional: Explore Later label. |
| Complete IPv4 CIDR Reference | Explore Later | Useful lookup that is too broad for Module 4. | Keep; merge Module 4’s duplicate prefix table here. |
| The Repeating Octet Pattern | Explore Later | Provides a calculation shortcut for readers who want depth. | Keep; merge Module 4’s Moving the Boundary detail here. |
| Counting Child Subnets | Role-Specific | Primarily useful for network design and certification practice. | Keep. |
| Choosing a Prefix | Role-Specific | Applies sizing constraints used in network design. | Keep. |
| Legacy Classful Questions | Role-Specific | Relevant mainly to older material and some certification questions. | Keep; label clearly as certification/legacy context. |
| Practice | Explore Later | Gives optional repetition with answers. | Keep. |
| How a Host Applies the Mask | Explore Later | Explains the underlying bitwise operation after the practical shortcut. | Keep. |
| Further Practice and Learning | Explore Later | Provides free external practice resources. | Label as optional. |

## Dependency and Cross-Reference Findings

The current module sequence has sound conceptual dependencies:

```text
Layers
  -> local frames and Address Resolution Protocol
  -> IPv4 local/remote decision
  -> routing
  -> Network Address Translation
  -> ports and transport
  -> Dynamic Host Configuration Protocol and Domain Name System
  -> Hypertext Transfer Protocol/Transport Layer Security and firewalls
  -> troubleshooting
```

Key findings:

- Module 12 is not a prerequisite for Module 13. It can be marked optional without leaving an unexplained concept in the troubleshooting method.
- Module 2’s lab build has forward references to Network Address Translation, Dynamic Host Configuration Protocol, and firewall behavior, but later conceptual modules do not depend on the build instructions being on the main path.
- The full lab build can move to an appendix if Module 2 retains the lab names, topology, and a clear link.
- Later modules require readers to understand prefixes and `/32` specificity, but they do not require non-`/24` range calculations. Moving those calculations does not break routing or filtering explanations.
- Module 7 and the Port and Protocol Reference duplicate service tables and file-transfer distinctions. The appendix should be authoritative; Module 7 should retain only a few examples needed to explain source and destination ports.
- Module 6 can retain a concise port-forward definition while moving configuration and the VirtualBox exercise. Later modules do not require the implementation steps.
- Most internal links target explicit glossary anchors. Preserve those `id` values during wording edits.
- If headings move, leave a concise replacement section or update every inbound link before deleting the original heading.

## Technical and Editorial Corrections to Include During Implementation

These are small corrections discovered during the category audit, not a separate full technical fact-check:

1. In Module 1, qualify “The IP addresses stay the same for the whole journey.” Network Address Translation deliberately changes address fields. A beginner-safe version is: “IP addresses normally describe the end-to-end source and destination, although Network Address Translation or another middlebox can change them in transit.”
2. In Module 3, remove the statement that a few hundred devices in a broadcast domain are fine while a few thousand necessarily waste time. Acceptable size depends on traffic, device behavior, failure domain, and design requirements.
3. In Module 12, do not state that every proxy/load balancer always creates two connections. A connection-terminating application proxy does; a pass-through layer 4 load balancer can select a backend without terminating and recreating the client connection.
4. In Module 12, scope the “client-to-proxy and proxy-to-backend” troubleshooting model to connection-terminating proxy designs.
5. In Module 2, make “optional” and “strongly recommended” consistent. Prefer: “The lab is optional. Build it if you want isolated hands-on practice; the conceptual path does not require it.”
6. In Module 3, spell out Internet Protocol the first time it appears in the body.
7. In Module 1, spell out the application protocol abbreviations used in the first model table or replace them with linked, reader-friendly names.
8. Preserve the current RFC 9846 link for Transport Layer Security 1.3. It is the current RFC and obsoletes RFC 8446 as of July 2026.

## Implemented Structural Decisions

The user approved these structural changes before implementation:

1. Move the Module 2 virtual-machine build into a new lab appendix.
2. Consolidate Module 4’s advanced subnet content into the existing Subnetting Practice appendix.
3. Move Module 6’s detailed port-forwarding material and local lab to an appendix.
4. Mark Module 12 as Optional: Role-Specific and move its NGINX lab into an appendix.
5. Add a Core Learning Path to the welcome page and let readers go directly from Module 11 to Module 13.

The implementation also applied the associated labeling, shortening, deduplication, takeaway cleanup, navigation updates, and small technical corrections while preserving module URLs and glossary anchors.
