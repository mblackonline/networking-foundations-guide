---
title: "Module 9: DNS"
description: How DNS turns names into useful records, where answers come from, and how to troubleshoot common failures.
---

Which would be easier to remember when visiting a website: `portal.example.com` or `192.0.2.80`?

People prefer meaningful names, but network traffic needs an IP address as its destination. The [Domain Name System (DNS)](/appendix/glossary/#domain-name-system-dns) connects the two.

DNS is often compared to a phone book. You look up a person's name to find a phone number. A computer looks up a DNS name to find an IP address or another piece of information associated with that name.

The domain name and IPv4 address used here are reserved for documentation and do not identify real systems.

## In This Module

- What DNS does—and what it does not do
- The difference between a recursive resolver and an authoritative server
- How a lookup moves through the DNS hierarchy
- The record types worth recognizing
- How caching and time to live affect changes
- How to test DNS from Windows and Linux

## DNS in One Sentence

A client asks a DNS server a specific question about a name, and the server returns a DNS record as its answer.

For example:

```text
Question: What is the IPv4 address for www.example.com?
Answer:   Return the A record for www.example.com.
```

DNS can store many kinds of records, not just IP addresses. It can identify mail servers, aliases, authoritative name servers, and the locations of network services.

DNS does not carry the later web, email, or login traffic. After DNS returns an address, the application makes a separate connection to that address.

```text
DNS lookup returns an address -> Application connects to that address
```

## The DNS Server Your Client Uses

Your computer is configured with one or more DNS server addresses. Those addresses often arrive through DHCP, as described in Module 8.

The configured server might be:

- A home router that forwards DNS requests
- A resolver operated by an internet provider
- A public recursive DNS service
- A Windows or Linux DNS server operated by an organization
- A DNS service supplied by a cloud or virtualization platform

The server that accepts a client's request and finds the answer is called a **[recursive resolver](/appendix/glossary/#recursive-resolver)**. It performs the lookup work and caches results for reuse.

An **[authoritative DNS server](/appendix/glossary/#authoritative-dns-server)** is different. It stores the official DNS records for a domain or zone. A recursive resolver asks authoritative servers for information when the answer is not already cached.

| DNS role | Main job |
| --- | --- |
| Client | Asks a DNS question |
| Recursive resolver | Finds the answer and caches it |
| Authoritative server | Holds the official records for its zone |

:::note[DNS and Active Directory]
Active Directory Domain Services relies on DNS. Domain-joined Windows clients use DNS records to locate domain controllers and services.

Those clients should use the organization's Active Directory-aware DNS servers, not a public resolver directly. The internal DNS servers can resolve internal names and forward public questions when necessary.
:::

## Reading a Domain Name

DNS names form a hierarchy. In everyday use, you normally see:

```text
www.example.com
```

The same name can be written in its complete, absolute form with a dot at the end:

```text
www.example.com.
```

The final dot represents the **DNS root**, the top of the DNS hierarchy. Browsers and ordinary commands usually let you omit it. In DNS configuration files and some troubleshooting tools, the trailing dot makes it explicit that the name is complete and that no local DNS suffix should be added.

Read the complete name from right to left:

| Part | Meaning |
| --- | --- |
| `.` | DNS root |
| `com` | Top-level domain |
| `example.com` | Registered domain |
| `www` | A label beneath `example.com` |

The owner of `example.com` controls the DNS records below that name. The label `www` does not have to identify one physical server; it identifies whatever DNS records the domain owner configured for that name.

## One Lookup from Client to Answer

Suppose a browser needs the IPv4 address for `www.example.com`.

1. The browser asks the operating system to resolve the name.
2. The operating system checks its local DNS cache.
3. If no usable answer is cached, the operating system asks its configured recursive resolver.
4. The recursive resolver checks its own cache.
5. If necessary, the resolver asks a root DNS server where to find information about `.com`.
6. A `.com` top-level-domain server identifies the authoritative servers for `example.com`.
7. An authoritative server for `example.com` supplies the requested record.
8. The recursive resolver caches the answer and returns it to the client.

The browser can then connect to the returned address.

```text
Client
  -> Recursive resolver
     -> Root: Who handles .com?
     -> .com server: Who handles example.com?
     -> Authoritative server: What is www.example.com?
  <- Answer returned to client
```

This full path does not occur for every lookup. Recursive resolvers answer many requests from cache and may already know which authoritative servers to contact.

## Common DNS Record Types

DNS stores information in **[resource records](/appendix/glossary/#resource-record)**. You do not need to memorize every record type, but these appear frequently:

| Record | What it identifies |
| --- | --- |
| A | An IPv4 address for a name |
| AAAA | An IPv6 address for a name |
| CNAME | Another DNS name used as an alias |
| MX | The mail servers that accept email for a domain |
| NS | The authoritative DNS servers for a zone |
| PTR | A name associated with an IP address in reverse DNS |
| SRV | The host and port providing a particular service |
| TXT | Text used for verification, email policies, and other published data |

DNS supports both IP versions. An A record supplies an IPv4 address, while an AAAA record supplies an IPv6 address. A name can have one type or both. DNS is resolving the name to the requested record; it is not translating an IPv4 address into an IPv6 address.

An A record might be read as:

```text
server.example.com -> 192.0.2.20
```

A CNAME points to another name rather than directly to an address:

```text
www.example.com -> webhost.example.net
```

The resolver must then find the address records for `webhost.example.net`.

One name can have more than one A or AAAA record. Multiple answers may be used for redundancy or traffic distribution, so receiving several addresses is not automatically a problem.

SRV records are especially important in Active Directory. Windows clients use them to find domain controllers and services such as LDAP and Kerberos.

## DNS Uses UDP and TCP Port 53

Traditional DNS supports both UDP port 53 and TCP port 53.

Most ordinary queries begin with UDP because a short question and answer fit naturally in a datagram. If a UDP response is marked as truncated, the client can retry using TCP. DNS zone transfers and some other operations also use TCP.

A firewall that permits only UDP port 53 can therefore cause some DNS requests to work while others fail.

## Caching and TTL

DNS would be slow and place unnecessary load on authoritative servers if every request repeated the full lookup path. Clients and recursive resolvers therefore cache answers.

Each record has a **[time to live (TTL)](/appendix/glossary/#time-to-live-ttl)** expressed in seconds. The TTL tells a cache how long it may reuse that record before requesting a fresh copy.

```text
TTL 300 = cache the record for up to 300 seconds
```

Caching explains why a DNS change may not appear everywhere immediately. One resolver may have the old answer cached while another has already requested the new one.

An answer stating that a name does not exist can also be cached for a period of time. Correcting a missing record therefore may not appear immediately to every client.

On Windows, this command clears the local computer's DNS client cache:

```text
ipconfig /flushdns
```

It does not clear a browser's private cache or the cache on a recursive resolver elsewhere on the network.

## Query DNS on Windows

PowerShell provides `Resolve-DnsName`:

```powershell
Resolve-DnsName example.com -Type A -DnsOnly
```

Look for:

| Output field | Meaning |
| --- | --- |
| Name | The name returned in the answer |
| Type | The DNS record type |
| TTL | Remaining cache lifetime in seconds |
| IPAddress | The returned address for an A or AAAA record |

Windows also includes `nslookup`:

```text
nslookup example.com
```

The output identifies the DNS server that answered and the records it returned. `Resolve-DnsName` normally provides more structured output, while `nslookup` remains common across many older support procedures.

## Query DNS on Linux

Use `dig`:

```text
dig example.com A
```

The output contains several sections. Start with:

- **status**, which reports whether the query succeeded
- **QUESTION SECTION**, which shows the name and record type requested
- **ANSWER SECTION**, which contains matching records
- **SERVER**, which identifies the DNS server that answered

Ask for another record type by changing the final argument:

```text
dig example.com NS
```

## Common DNS Failure Clues

| Result or symptom | Likely meaning |
| --- | --- |
| Connecting by IP works, but connecting by name fails | DNS configuration or resolution is likely involved |
| `NXDOMAIN` | The DNS server reports that the requested name does not exist |
| `SERVFAIL` | The resolver could not complete the lookup |
| Query times out | The DNS server may be unreachable, blocked, or not responding |
| Corrected record still returns an old value | A client or resolver may still have the previous answer cached |
| Internal name fails while public names work | The client may be using the wrong DNS server |

Some organizations intentionally return different answers for the same name depending on whether the client is inside or outside the network. Before treating different answers as an error, confirm which DNS server each client queried.

## A Short Troubleshooting Order

1. Use `ipconfig /all` or the Linux resolver configuration to identify the DNS server the client is using.
2. Query a known public name to confirm that the resolver answers at all.
3. Query the failing name and requested record type.
4. Read the response status rather than looking only for an address.
5. If clients disagree, compare their DNS server addresses and the TTL values in their answers.
6. Confirm whether the name is supposed to exist only on an internal network.

:::tip[Optional Lab: Compare DNS Answers in NETLAB]
This exercise makes no configuration changes.

1. On the Windows 11 virtual machine named WINCLIENT, run:

   ```powershell
   ipconfig /all
   Resolve-DnsName example.com -Type A -DnsOnly
   Resolve-DnsName example.com -Type NS -DnsOnly
   ```

2. Record WINCLIENT's configured DNS server and identify the A and NS records returned.
3. On the Debian virtual machine named LINUXBOX, run:

   ```text
   cat /etc/resolv.conf
   dig example.com A
   dig example.com NS
   ```

4. Identify the DNS server, response status, and answer section in each `dig` result.
5. Compare the answers from both virtual machines.

Record order and TTL values may differ because of caching. Both clients should still receive valid records for the same requested types.
:::

## Further Learning

- [RFC 1034: Domain Names—Concepts and Facilities](https://www.rfc-editor.org/info/rfc1034/) explains the DNS hierarchy, resolvers, authoritative data, and caching.
- [RFC 1035: Domain Names—Implementation and Specification](https://www.rfc-editor.org/info/rfc1035/) defines DNS messages, common records, and UDP/TCP transport.
- [IANA DNS Parameters](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml) maintains the authoritative registry of DNS record types and other protocol values.
- [Microsoft DNS queries and lookups documentation](https://learn.microsoft.com/en-us/windows-server/networking/dns/queries-lookups) explains recursive and iterative lookups in Windows environments.
- [Microsoft `Resolve-DnsName` documentation](https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname) documents record queries and command options.
- [BIND 9 `dig` documentation](https://bind9.readthedocs.io/en/stable/manpages.html#dig-dns-lookup-utility) documents the Linux lookup tool used in this module.

## Checklist Before Moving On

- [ ] You can explain what DNS does before an application connects
- [ ] You can distinguish a recursive resolver from an authoritative server
- [ ] You can describe the root, top-level-domain, and authoritative steps
- [ ] You recognize A, AAAA, CNAME, MX, NS, PTR, SRV, and TXT records
- [ ] You know that traditional DNS uses both UDP and TCP port 53
- [ ] You can explain how TTL affects cached answers
- [ ] You queried an A record using a tool available on your operating system
- [ ] Optional: You compared DNS answers on WINCLIENT and LINUXBOX

Continue to Module 10 to see how HTTP and TLS use the addresses returned by DNS.
