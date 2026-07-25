// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Networking Foundations',
      description:
        'A beginner-friendly, vendor-agnostic networking guide for aspiring system administrators, DevOps engineers, and software developers.',
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Welcome', slug: '' },
            { label: 'Module 1: How Networks Are Layered', slug: '01-layers' },
            { label: 'Module 2: Your Toolkit and Optional Lab', slug: '02-toolkit-and-lab' },
          ],
        },
        {
          label: 'Foundations',
          items: [
            { label: 'Module 3: The Local Network', slug: '03-local-network' },
            { label: 'Module 4: IPv4 Addressing and Subnetting', slug: '04-addressing-subnetting' },
            { label: 'Module 5: Routing', slug: '05-routing' },
            { label: 'Module 6: NAT', slug: '06-nat' },
          ],
        },
        {
          label: 'Getting to a Service',
          items: [
            { label: 'Module 7: Transport, Ports, and Sockets', slug: '07-transport' },
            { label: 'Module 8: DHCP', slug: '08-dhcp' },
            { label: 'Module 9: DNS', slug: '09-dns' },
          ],
        },
        {
          label: 'Application and Security',
          items: [
            { label: 'Module 10: HTTP and TLS', slug: '10-http-tls' },
            { label: 'Module 11: Firewalls and Filtering', slug: '11-filtering' },
            { label: 'Module 12: Proxies and Load Balancers', slug: '12-proxies-load-balancers' },
          ],
        },
        {
          label: 'Working With It',
          items: [
            { label: 'Module 13: Troubleshooting Method', slug: '13-troubleshooting' },
            { label: 'Where This Shows Up in Real Work', slug: 'where-this-shows-up' },
          ],
        },
        {
          label: 'Appendix',
          items: [
            { label: 'Subnetting Practice', slug: 'appendix/subnetting-practice' },
            { label: 'Port and Protocol Reference', slug: 'appendix/port-reference' },
            { label: 'Reading a Packet Capture', slug: 'appendix/reading-a-capture' },
            { label: 'Glossary', slug: 'appendix/glossary' },
          ],
        },
      ],
    }),
  ],
});
