// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://networking-foundations-guide.netlify.app',
  integrations: [
    starlight({
      title: 'Networking Foundations',
      description:
        'A free, vendor-agnostic guide to networking fundamentals, practical troubleshooting, and optional hands-on labs.',
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Welcome', slug: '' },
            { label: 'Module 1: How Networks Are Layered', slug: '01-layers' },
            { label: 'Module 2: Your Networking Toolkit', slug: '02-toolkit-and-lab' },
          ],
        },
        {
          label: 'Foundations',
          items: [
            { label: 'Module 3: The Local Network', slug: '03-local-network' },
            { label: 'Module 4: IPv4 Addressing', slug: '04-addressing-subnetting' },
            { label: 'Module 5: Understanding IPv4 Subnetting', slug: '05-subnetting' },
            { label: 'Module 6: Routing', slug: '06-routing' },
            { label: 'Module 7: Network Address Translation (NAT)', slug: '07-nat' },
          ],
        },
        {
          label: 'Getting to a Service',
          items: [
            { label: 'Module 8: Transport, Ports, and Sockets', slug: '08-transport' },
            { label: 'Module 9: Dynamic Host Configuration Protocol (DHCP)', slug: '09-dhcp' },
            { label: 'Module 10: Domain Name System (DNS)', slug: '10-dns' },
          ],
        },
        {
          label: 'Application and Security',
          items: [
            { label: 'Module 11: HTTP and TLS', slug: '11-http-tls' },
            { label: 'Module 12: Firewalls and Filtering', slug: '12-filtering' },
            { label: 'Module 13 (Optional): Proxies and Load Balancers', slug: '13-proxies-load-balancers' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [
            { label: 'Module 14: Troubleshooting Method', slug: '14-troubleshooting' },
            { label: 'Slow or Intermittent Connections', slug: 'appendix/performance-troubleshooting' },
          ],
        },
        {
          label: 'Optional Hands-On Labs',
          items: [
            { label: 'Build NETLAB', slug: 'appendix/building-netlab' },
            { label: 'Stopped Service Troubleshooting', slug: 'appendix/stopped-service-lab' },
            { label: 'Local Port Forwarding', slug: 'appendix/local-port-forwarding' },
            { label: 'Reverse Proxy Lab', slug: 'appendix/reverse-proxy-lab' },
          ],
        },
        {
          label: 'Packet Analysis',
          items: [
            { label: 'Reading a Packet Capture', slug: 'appendix/reading-a-capture' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Port and Protocol Reference', slug: 'appendix/port-reference' },
            { label: 'Glossary', slug: 'appendix/glossary' },
          ],
        },
      ],
    }),
  ],
});
