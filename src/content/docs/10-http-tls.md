---
title: "Module 10: HTTP and TLS"
description: Understand web requests, responses, status codes, protected connections, and certificate trust.
---

[Hypertext Transfer Protocol (HTTP)](/appendix/glossary/#hypertext-transfer-protocol-http) defines how web clients and servers exchange requests and responses. [Transport Layer Security (TLS)](/appendix/glossary/#transport-layer-security-tls) protects that exchange. HTTP protected by TLS is called [Hypertext Transfer Protocol Secure (HTTPS)](/appendix/glossary/#hypertext-transfer-protocol-secure-https).

When you open a website, several things happen before the page appears:

1. The Domain Name System (DNS) finds an Internet Protocol (IP) address for the website's name.
2. The client connects to the server.
3. If the web address uses HTTPS, the client and server establish a protected TLS connection.
4. The client sends an HTTP request.
5. The server returns an HTTP response.

This module focuses on the last three steps.

## In This Module

- How a web address becomes an HTTP request and response
- What common methods and status-code groups mean
- What TLS protects, and what it does not
- What a server certificate proves

## Reading a Web Address

Consider this Uniform Resource Locator (URL):

```text
https://portal.example.com/account
```

| URL part | Example | Meaning |
| --- | --- | --- |
| Scheme | `https` | Use HTTP protected by TLS |
| Hostname | `portal.example.com` | The server name that DNS resolves |
| Path | `/account` | The resource requested from that server |

The hostname helps the client find and identify the server. The path tells the server which resource the client wants.

## HTTP Is a Request and Response Protocol

The client sends a **request**, and the server returns a **response**.

For example, a browser requesting a Hypertext Markup Language (HTML) page might send:

```text
GET /account HTTP/1.1
Host: portal.example.com
Accept: text/html
```

The fields are:

| Request field | Example | Meaning |
| --- | --- | --- |
| Method | `GET` | The action the client is requesting |
| Path | `/account` | The resource the client wants |
| HTTP version | `HTTP/1.1` | The message format being used |
| `Host` header | `portal.example.com` | The website the client wants |
| `Accept` header | `text/html` | A type of content the client can use |

A request can also contain a **body** after the headers. A blank line separates the headers from that body. For example, a form submission may place entered data in the request body.

### Common HTTP Methods

:::note[Useful Context]
For a first reading, recognize `GET` and `POST`. The other methods use the same request-and-response model.
:::

| Method | Common purpose |
| --- | --- |
| `GET` | Retrieve a resource |
| `POST` | Submit data or request an action |
| `PUT` or `PATCH` | Update a resource |
| `DELETE` | Remove a resource |
| `HEAD` | Request headers without the response body |

The application decides what each path and method actually does. A successful network connection does not guarantee that the application will accept the request.

## Reading an HTTP Response

The server might answer:

```text
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1250

<html>...</html>
```

| Response field | Example | Meaning |
| --- | --- | --- |
| HTTP version | `HTTP/1.1` | The message format being used |
| Status code | `200` | The numeric result |
| Reason phrase | `OK` | A short description of the result |
| `Content-Type` header | `text/html` | The format of the response body |
| `Content-Length` header | `1250` | The body length in bytes |
| Body | `<html>...</html>` | The content returned to the client |

HTTP/2 and HTTP/3 encode messages differently, but they still use the same request methods, headers, responses, and status codes.

## HTTP Status Codes

The first digit identifies the general result:

| Range | Category | General meaning |
| --- | --- | --- |
| `100`–`199` | Informational | The exchange is continuing |
| `200`–`299` | Success | The request succeeded |
| `300`–`399` | Redirection | The client should use another location |
| `400`–`499` | Client request | The server rejected something about the request |
| `500`–`599` | Server failure | The server or an upstream service failed |

Common examples include:

| Code | Meaning |
| --- | --- |
| `200 OK` | The request succeeded |
| `301` or `302` | The resource is available at another location |
| `400 Bad Request` | The server could not understand or accept the request |
| `401 Unauthorized` | Authentication is required or failed |
| `403 Forbidden` | The server understood the request but refuses access |
| `404 Not Found` | The requested resource was not found |
| `500 Internal Server Error` | The application encountered an unexpected failure |
| `502`, `503`, or `504` | A server, service, or upstream connection is unavailable or failing |

A `404` response proves that HTTP reached a server and received an answer. The problem is not the same as a DNS failure or connection timeout.

## HTTPS Adds TLS Protection

HTTPS means that HTTP is exchanged through a TLS-protected connection.

Most HTTP and HTTPS connections use the Transmission Control Protocol (TCP).

| Protocol | Common destination port | Protection |
| --- | --- | --- |
| HTTP | TCP 80 | HTTP content is not encrypted |
| HTTPS | TCP 443 | TLS protects the HTTP content |

HTTP/3 uses a transport protocol named QUIC over User Datagram Protocol (UDP) port 443, but the HTTP concepts in this module remain the same.

TLS provides three important protections:

- **Confidentiality:** Other systems carrying the traffic cannot read the protected HTTP content.
- **Integrity:** Changes made in transit can be detected.
- **Authentication:** The client can verify the server's identity.

TLS does not prove that a website is honest or free from malicious content. It also does not hide every connection detail. The destination IP address, timing, and amount of traffic can still be visible.

## A Simplified TLS Handshake

:::note[Optional: Explore Later]
For core troubleshooting, remember that Transport Layer Security must succeed before the server can return a protected Hypertext Transfer Protocol response.
:::

Before sending protected HTTP data, the client and server establish TLS:

1. The client offers supported TLS options and usually identifies the requested hostname.
2. The server selects compatible options and sends information used to establish shared encryption keys.
3. The server proves its identity with a [certificate](/appendix/glossary/#certificate).
4. The client validates the certificate.
5. Both sides derive session keys and begin exchanging protected HTTP data.

The real handshake contains additional fields and security checks. For troubleshooting, the important distinction is that TLS must succeed before the server can return an HTTPS response.

## What the Certificate Proves

A server certificate connects a hostname to a public key. The client normally checks:

1. **Name:** The requested hostname is covered by the certificate.
2. **Time:** The certificate is currently within its valid date range.
3. **Trust:** The certificate leads through a valid chain to a [certificate authority](/appendix/glossary/#certificate-authority-ca) the client trusts.

A typical chain contains a server certificate and one or more Certificate Authority (CA) certificates:

| Certificate | Role |
| --- | --- |
| Server certificate | Identifies the website |
| Intermediate CA certificate | Connects the server certificate to a trusted authority |
| Root CA certificate | Acts as a trust anchor in the client's trust store |

Common failures include an expired certificate, a hostname mismatch, a missing intermediate certificate, an untrusted internal CA, or an incorrect client clock.

:::caution
Do not treat `curl --insecure` or a browser's certificate-warning bypass as a permanent fix. Those actions skip identity validation and can hide the real configuration problem.
:::

## Why One IP Address Can Host Many Websites

:::note[Optional: Role-Specific]
This detail is most useful when administering web servers, proxies, certificates, or cloud application endpoints.
:::

Multiple websites can share one server IP address. The hostname in the HTTP request tells the web server which site the client wants.

For HTTPS, the server usually needs that name earlier so it can select the correct certificate. The client supplies it during the TLS handshake using **[Server Name Indication (SNI)](/appendix/glossary/#server-name-indication-sni)**.

If a client connects by IP address or supplies the wrong hostname, the server may present a default certificate that does not match.

## Find the Layer That Failed

| Symptom | Layer to investigate first |
| --- | --- |
| The name does not resolve | DNS |
| The connection times out or is refused | Routing, firewall, or listening service |
| The client reports a certificate error | TLS, certificate, hostname, or client time |
| The server returns a `400`-range code | HTTP request, authentication, or permissions |
| The server returns a `500`-range code | Web server, application, or upstream service |

Work from the lowest failing layer upward. Changing certificates will not fix a DNS failure, and changing DNS will not fix a `403 Forbidden` response.

## Inspect an HTTPS Exchange with curl

:::note[Optional Practice]
This read-only exercise exposes the separate connection, Transport Layer Security, and Hypertext Transfer Protocol stages.
:::

This read-only exercise requests the public documentation site `example.com` and discards the page body.

On the Windows 11 virtual machine named WINCLIENT, run:

```text
curl.exe --verbose --output NUL https://example.com
```

On the Linux Mint virtual machine named LINUXBOX, run:

```text
curl --verbose --output /dev/null https://example.com
```

Look for:

- A connection to an IP address on port 443
- TLS and certificate information
- A line beginning with `>` that shows the HTTP request
- A line beginning with `<` that shows the HTTP response
- A successful status such as `200`

The exact TLS and HTTP versions may differ between the two systems. Verbose output from authenticated websites can contain sensitive headers, so do not share it without checking for credentials or session data.

## Further Learning

- [Request for Comments (RFC) 9110: HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/) defines HTTP methods, fields, and status codes.
- [RFC 9112: HTTP/1.1](https://www.rfc-editor.org/info/rfc9112/) defines the text-based HTTP/1.1 message format used in the examples.
- [RFC 9846: TLS 1.3](https://www.rfc-editor.org/info/rfc9846/) defines the current TLS 1.3 protocol.
- [RFC 5280: Internet X.509 Public Key Infrastructure](https://www.rfc-editor.org/info/rfc5280/) defines certificate and certification-path validation.
- [curl command-line documentation](https://curl.se/docs/manpage.html) explains the options used in the exercise.

## Main Takeaways

- The Hypertext Transfer Protocol (HTTP) defines requests and responses between clients and web services.
- Hypertext Transfer Protocol Secure (HTTPS) uses Transport Layer Security (TLS) to protect data in transit and authenticate the server.
- DNS, connection, TLS, and HTTP failures occur at separate stages of the exchange.

Continue to Module 11 to see how firewalls decide which traffic is permitted or blocked.
