---
title: "Module 12: Proxies and Load Balancers"
description: Understand forward proxies, reverse proxies, load balancing, health checks, and client addressing.
---

A client normally connects directly to a server:

```text
Client -> Server
```

A [proxy](/appendix/glossary/#proxy) stands between them:

```text
Client -> Proxy -> Server
```

The proxy accepts one connection and creates another connection toward the destination. This distinction explains why the server may see the proxy's Internet Protocol (IP) address instead of the client's address.

## In This Module

- The difference between a forward proxy and a reverse proxy
- Why a proxy always creates two separate connections
- What a load balancer does and how it selects a backend
- Layer 4 and layer 7 load balancing
- TLS termination, health checks, and session persistence
- Why a backend may log the proxy's address instead of the client's

## Forward and Reverse Proxies

The names describe which side the proxy represents.

| Proxy type | Represents | Common traffic direction |
| --- | --- | --- |
| Forward proxy | Clients | Client network toward outside servers |
| Reverse proxy | Servers | Outside clients toward internal services |

### Forward Proxy

A [forward proxy](/appendix/glossary/#forward-proxy) makes requests on behalf of clients:

```text
Employee laptop -> Forward proxy -> Public website
```

The laptop is configured to use the proxy. The public website receives a connection from the proxy rather than directly from the laptop.

Organizations may use forward proxies to apply access policies, record requests, cache content, or control how clients reach external services.

### Reverse Proxy

A [reverse proxy](/appendix/glossary/#reverse-proxy) accepts requests on behalf of servers:

```text
Internet client -> Reverse proxy -> Internal application server
```

The Domain Name System (DNS) record for the public service points clients to the reverse proxy. The client may not know which internal server ultimately handles the request.

A reverse proxy can provide:

- One public entry point for several internal services
- Transport Layer Security (TLS) certificate handling
- Routing based on a hostname or path
- Caching, compression, or request limits
- Load balancing across multiple servers

An internal destination behind a proxy is commonly called a **[backend](/appendix/glossary/#backend)** or **[upstream server](/appendix/glossary/#upstream-server)**.

## One Public Service with Two Backends

Suppose a company publishes `portal.example.com`:

| Component | Address and port | Role |
| --- | --- | --- |
| Public service name | `portal.example.com` | Name entered by the client |
| Reverse proxy | `198.51.100.20:443` | Accepts the public connection |
| Backend A | `10.0.20.31:8080` | Runs one copy of the application |
| Backend B | `10.0.20.32:8080` | Runs another copy of the application |

The proxy creates two separate connections:

```text
Connection 1:
  Source:      Internet client
  Destination: Reverse proxy at 198.51.100.20:443

Connection 2:
  Source:      Reverse proxy
  Destination: Backend A at 10.0.20.31:8080
```

The next request could be sent to Backend B instead.

The public IP addresses in this module are from documentation ranges and do not identify real services.

## What a Load Balancer Does

A [load balancer](/appendix/glossary/#load-balancer) selects a backend from a group of available servers.

Common selection methods include:

- **Round robin:** Send each new request or connection to the next backend.
- **Least connections:** Prefer the backend handling fewer active connections.

A reverse proxy can also be a load balancer, but the terms are not identical. A reverse proxy's defining job is accepting traffic for a server. A load balancer's defining job is distributing traffic among multiple servers.

## Layer 4 and Layer 7 Load Balancing

The layer determines which information the load balancer can use.

| Type | Information it can use | Example decision |
| --- | --- | --- |
| Layer 4, transport | Transmission Control Protocol (TCP) or User Datagram Protocol (UDP), IP addresses, and ports | Send a new TCP connection on port 443 to Backend A |
| Layer 7, application | Hypertext Transfer Protocol (HTTP) hostnames, paths, headers, and cookies | Send `/images` to one backend group and `/checkout` to another |

A layer 4 load balancer can pass encrypted traffic without reading the protected HTTP request. A layer 7 load balancer must understand the application protocol and commonly terminates TLS before inspecting HTTP information.

Layer 4 is not automatically better or worse than layer 7. The correct choice depends on what the service needs the load balancer to see and control.

## TLS Termination

When a reverse proxy **terminates TLS**, it presents the public certificate and decrypts the client's Hypertext Transfer Protocol Secure (HTTPS) connection.

The two connections may then be:

```text
Client -- HTTPS --> Reverse proxy -- HTTP or HTTPS --> Backend
```

The proxy-to-backend connection is a separate security decision. Some environments use HTTP on a trusted internal network. Others establish a second TLS connection so traffic remains protected between the proxy and backend.

A certificate error seen by the public client usually concerns the certificate presented by the reverse proxy, not a certificate installed on the backend.

## Health Checks

A load balancer should send traffic only to backends that can handle it. It tests them with a **[health check](/appendix/glossary/#health-check)**.

A health check might:

- Attempt a TCP connection to the service port
- Request an HTTP path such as `/health`
- Require a particular HTTP status code

After repeated failures, the load balancer marks the backend unhealthy and stops sending it new traffic. After repeated successful checks, it can return the backend to service.

Health-check configuration can also cause failures. A wrong port, path, expected status, firewall rule, or timeout can make every healthy backend appear unavailable.

## Session Persistence

Some applications store a user's session on one backend. A load balancer may use **[session persistence](/appendix/glossary/#session-persistence)**, also called a **sticky session**, to keep that user on the same backend.

Persistence can be based on a cookie or another client characteristic. It may be necessary for older applications, but it can distribute traffic unevenly and complicate recovery when a backend fails. Applications that share session state do not depend as heavily on persistence.

## Preserving the Client Address

The backend's network connection comes from the proxy, so its logs may show the proxy's IP address for every request.

For HTTP traffic, a trusted proxy can add the standardized `Forwarded` header or the widely used `X-Forwarded-For` header to carry the original client address.

```text
X-Forwarded-For: 192.0.2.50
```

The backend must trust these headers only when they come from a known proxy. An outside client can send a false `X-Forwarded-For` value if the proxy does not remove or replace untrusted values.

## Common Failure Clues

| Symptom | Possible cause |
| --- | --- |
| The public name resolves to the wrong address | DNS points somewhere other than the proxy |
| The client reports a certificate-name error | The proxy presented the wrong certificate |
| `502 Bad Gateway` | The proxy could not obtain a valid response from a backend |
| `503 Service Unavailable` | No backend is available or the service is intentionally unavailable |
| `504 Gateway Timeout` | A backend did not respond before the proxy's timeout |
| Backend logs show only one client address | The logs show the proxy address and are not using trusted forwarded-address information |

Status-code meanings can vary with the product and configuration. Check both the proxy logs and backend logs.

## A Short Troubleshooting Order

1. Confirm that DNS sends the client to the proxy.
2. Test the client-to-proxy connection and public TLS certificate.
3. Confirm that the proxy selected a backend.
4. Test the proxy-to-backend address, port, and protocol.
5. Check backend health and health-check results.
6. Compare proxy and backend logs for the same request.

Treat the client-to-proxy and proxy-to-backend connections as separate network paths.

:::tip[Optional Lab: A Reverse Proxy in NETLAB]
This exercise installs NGINX on LINUXBOX. The proxy listens only inside the isolated NETLAB network, and its backend listens only on LINUXBOX's loopback address.

1. On LINUXBOX, install NGINX and create a small backend page:

   ```text
   sudo -i
   apt update
   apt install nginx
   mkdir /var/www/netguide-backend
   echo "Response from the backend service" > /var/www/netguide-backend/index.html
   ```

   The `sudo -i` command opens an administrative shell. Leave this terminal open for the rest of the exercise. The final `exit` command closes the administrative shell.

2. Open a new configuration file:

   ```text
   nano /etc/nginx/sites-available/netguide
   ```

3. Enter this configuration, then save and close the file:

   ```text
   server {
       listen 127.0.0.1:8000;
       server_name _;
       root /var/www/netguide-backend;
   }

   server {
       listen 8080;
       server_name _;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

4. Enable the configuration and reload NGINX:

   ```text
   ln -s /etc/nginx/sites-available/netguide /etc/nginx/sites-enabled/netguide
   nginx -t
   systemctl reload nginx
   ip -4 addr
   ```

5. On WINCLIENT, replace `<LINUXBOX-IP>` with LINUXBOX's NETLAB address:

   ```text
   curl.exe http://<LINUXBOX-IP>:8080
   ```

   The response should say:

   ```text
   Response from the backend service
   ```

WINCLIENT connects to NGINX on TCP port 8080. NGINX creates a second connection to the backend on loopback TCP port 8000.

To remove the lab configuration on LINUXBOX:

```text
rm /etc/nginx/sites-enabled/netguide
rm /etc/nginx/sites-available/netguide
rm /var/www/netguide-backend/index.html
rmdir /var/www/netguide-backend
systemctl reload nginx
systemctl disable --now nginx
exit
```

These commands leave the NGINX package installed but stop and disable its service.
:::

## Further Learning

- [Request for Comments (RFC) 7239: Forwarded HTTP Extension](https://www.rfc-editor.org/info/rfc7239/) defines the standardized `Forwarded` header.
- [NGINX proxy module documentation](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) documents reverse-proxy settings.
- [NGINX HTTP load-balancing documentation](https://nginx.org/en/docs/http/load_balancing.html) explains backend groups and selection methods.
- [Traefik Proxy documentation](https://doc.traefik.io/traefik/) covers an alternative reverse proxy and load balancer designed for dynamic environments such as Docker and Kubernetes.
- [Caddy reverse-proxy quick start](https://caddyserver.com/docs/quick-starts/reverse-proxy) covers an alternative web server and reverse proxy known for concise configuration and automatic HTTPS.
- [Amazon Web Services Elastic Load Balancing documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html) describes a managed cloud load-balancing service.

## Main Takeaways

- Forward proxies act on behalf of clients. Reverse proxies and load balancers act on behalf of services.
- The client-to-proxy and proxy-to-backend connections are separate network paths.
- Filtering, Transport Layer Security (TLS), health checks, and failures can differ on each side of the proxy.

Continue to Module 13 to combine the guide's concepts into a repeatable troubleshooting method.
