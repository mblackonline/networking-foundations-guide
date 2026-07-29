---
title: Reverse Proxy Lab
description: Build a local NGINX reverse proxy and loopback-only backend inside the optional NETLAB environment.
---

:::note[Optional: Role-Specific]
This lab is intended for systems administration, cloud, DevOps, and software-development practice. Complete [Module 12](/12-proxies-load-balancers/) first.
:::

This exercise installs NGINX on LINUXBOX. The proxy listens only inside the isolated NETLAB network, and its backend listens only on LINUXBOX's loopback address.

The exercise requires the [optional NETLAB environment](/appendix/building-netlab/).

## Build the Backend and Proxy

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

5. On WINCLIENT, replace `<LINUXBOX-IP>` with LINUXBOX's NETLAB Internet Protocol (IP) address:

   ```text
   curl.exe http://<LINUXBOX-IP>:8080
   ```

   The response should say:

   ```text
   Response from the backend service
   ```

WINCLIENT connects to NGINX on Transmission Control Protocol (TCP) port 8080. NGINX terminates that connection and creates a separate connection to the backend on loopback TCP port 8000.

## Verify the Two Listeners

On LINUXBOX:

```text
ss -lnt
```

Find:

- `0.0.0.0:8080`, which accepts connections through LINUXBOX's NETLAB interface
- `127.0.0.1:8000`, which accepts connections only from LINUXBOX itself

This difference is why WINCLIENT can contact the proxy but cannot connect directly to the backend.

## Remove the Lab Configuration

Run these commands from the administrative shell opened earlier:

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

Confirm that the listener has been removed:

```text
ss -lnt
```

TCP ports 8000 and 8080 should no longer appear.

## Further Learning

- [NGINX proxy module documentation](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) documents the settings used by the lab.
- [NGINX beginner's guide](https://nginx.org/en/docs/beginners_guide.html) explains configuration files and service control.
