---
title: "Module 2: Your Toolkit and Optional Lab"
description: Verify the networking tools already on your computer, install Wireshark, and optionally build the two-VM lab.
---

This module gets your environment ready. Most of it takes a few minutes, because the majority of what you need is already installed on the computer you are using right now.

The optional lab at the end adds two virtual machines. You only need them for the exercises where the point is to break something on purpose, which is not something you want to do to your own machine.

## In This Module

- Confirm the networking tools already built into your operating system
- Install Wireshark and take a first capture
- Understand which exercises need the lab and which do not
- Optionally build the two-VM lab

## The Tools You Already Have

Every operating system ships with tools that answer the basic networking questions. The names differ, the questions do not.

| Question | Windows | Linux | macOS |
| --- | --- | --- | --- |
| What are my IP settings? | `ipconfig /all` | `ip addr` | `ifconfig` |
| How does my machine pick a route? | `route print` | `ip route` | `netstat -rn` |
| Who is on my local segment? | `arp -a` | `ip neigh` | `arp -a` |
| What is listening or connected? | `netstat -ano` | `ss -tulpn` | `netstat -an` |
| What does this name resolve to? | `nslookup` | `dig` | `dig` |
| What path does traffic take? | `tracert` | `traceroute` | `traceroute` |
| What does this server actually say? | `curl` | `curl` | `curl` |

This guide shows Windows commands first, with the others alongside, because most readers are on Windows. Nothing about the concepts changes between them.

A few notes before you start.

`dig` is not included with Windows. Use `nslookup`, or `Resolve-DnsName` in PowerShell, which produces more readable output. Module 9 shows both.

`traceroute` is not always installed on Linux. On Debian and Ubuntu, install it with `sudo apt install traceroute`.

`ss` has replaced `netstat` on most Linux distributions. If `ss` is missing, `netstat` usually still works.

## Verify Your Tools

Run these three on your own machine. You do not need to understand the output yet.

```text
ipconfig /all
nslookup example.com
curl -I https://example.com
```

On Linux or macOS:

```text
ip addr
dig example.com
curl -I https://example.com
```

If all three produce output rather than a "command not found" error, you are ready.

## Install Wireshark

Wireshark shows you the actual packets on the wire. Several modules use it to make an abstract exchange concrete.

1. Download it from [wireshark.org](https://www.wireshark.org/download.html). Use the official site rather than a download portal.
2. Run the installer and accept the defaults.
3. On Windows, the installer offers to install Npcap. Accept it. Wireshark cannot capture without it.
4. On Windows, restart after the install so the capture driver loads.

:::caution
Wireshark shows everything crossing the interface you select, including traffic that is not yours. Capture only on networks you own or are authorized to work on. Capturing on a corporate or public network without permission can violate policy or law. Everything in this guide is done on your own machine or your own lab.
:::

## Your First Capture

1. Open Wireshark.
2. Double-click your active network interface. The one with a moving line graph beside it is the one carrying traffic.
3. Packets start scrolling immediately. That is normal, and it is a lot.
4. In the display filter bar at the top, type `dns` and press Enter.
5. Open a Command Prompt and run `nslookup example.com`.
6. Switch back to Wireshark. You should see your query and the response.
7. Click the red square to stop the capture.

You just watched the Domain Name System (DNS) turn a name into an address. Module 9 explains what those packets mean. For now the point is that the tool works and you know how to filter it, since an unfiltered capture is unreadable.

## About the Optional Lab

:::tip[Optional Lab]
Lab sections appear in callouts like this one throughout the guide. Every module is written so that skipping all of them still leaves you with a complete understanding. Nothing later depends on having built the lab.
:::

Some things cannot be learned on your own machine. You cannot safely put a wrong subnet mask on your work laptop, turn it into a router, or block your own traffic to see what a firewall drop looks like. The lab exists for exactly those exercises.

It is two virtual machines.

**WINCLIENT** is a Windows 11 Enterprise evaluation. It is the machine you configure through the familiar graphical settings, and it plays the client in every exercise.

**LINUXBOX** is a minimal Debian install with no desktop. It plays the other end, acting as server, router, NAT gateway, and reverse proxy in later modules. Every command for it is given as copy and paste, so no prior Linux experience is assumed.

The footprint is roughly 5 GB of memory while both run, and about 75 GB of disk. A machine with 16 GB of RAM is comfortable. With 8 GB it works, but close other applications and expect it to be slow.

Both operating systems are free to obtain. Debian is free software. Windows 11 Enterprise is a 90 day evaluation, so note the date you install it.

## Build the Lab Network

The lab uses VirtualBox, which is free, open source under the GNU General Public License (GPL) version 3, and available for Windows, Linux, and Intel-based Macs. Other hypervisors work equally well, but the steps below are written for VirtualBox.

1. Download and install VirtualBox from [virtualbox.org](https://www.virtualbox.org/). Accept the installer defaults.
2. In VirtualBox Manager, open **File > Tools > Network Manager**.
3. Click the **NAT Networks** tab, then click **Create**.
4. Select the new network and set:
   - **Name:** `NETLAB`
   - **IPv4 Prefix:** `10.0.20.0/24`
   - **Enable DHCP:** checked
5. Click **Apply** and close Network Manager.

VirtualBox calls this a NAT Network. Network address translation (NAT) is covered in Module 6. Both VMs attach to this network. They can reach each other and the internet, and your home devices cannot reach into the lab.

:::note
The Dynamic Host Configuration Protocol (DHCP) is what supplies addresses automatically. It stays enabled so the VMs receive their network settings without running another server. Module 8 explains what VirtualBox supplies and includes an optional lease-renewal exercise on WINCLIENT. If you also built the lab from an Active Directory guide, note that this network uses a different name and address range so the two labs do not collide.
:::

## Build WINCLIENT

1. Download the Windows 11 Enterprise evaluation ISO from the [Microsoft Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise). Choose the x64 ISO, not ARM64.
2. In VirtualBox Manager, click **New** and set:
   - **Name:** `WINCLIENT`
   - **ISO Image:** the Windows 11 ISO
   - Choose a manual installation. Depending on your VirtualBox version, either check **Skip Unattended Installation** or clear **Install OS Using Unattended Installation**
   - **Base Memory:** 4096 MB
   - **Processors:** 2
   - Check **Enable EFI**
   - **Hard Disk:** 64 GB
3. Before starting it, open **Settings > System** and confirm **TPM Version** is 2.0 and **Enable Secure Boot** is checked. Windows 11 setup refuses to run without both. EFI is the Extensible Firmware Interface, the modern replacement for the traditional BIOS, and a TPM is a Trusted Platform Module, a chip that stores encryption keys.
4. Open **Settings > Network** and set Adapter 1 to **NAT Network**, name **NETLAB**.
5. Start the VM and install Windows. When setup asks you to sign in, choose **Sign-in options**, then the option to create a local account, and name it `labuser`.
6. After reaching the desktop, install Guest Additions from **Devices > Insert Guest Additions CD image**, run the installer from the CD drive, and restart.

## Build LINUXBOX

1. Download the Debian netinst ISO from [debian.org](https://www.debian.org/distrib/netinst). Choose the 64-bit amd64 image.
2. In VirtualBox Manager, click **New** and set:
   - **Name:** `LINUXBOX`
   - **ISO Image:** the Debian ISO
   - Choose a manual installation
   - **Base Memory:** 1024 MB
   - **Processors:** 1
   - **Hard Disk:** 10 GB
3. Open **Settings > Network** and set Adapter 1 to **NAT Network**, name **NETLAB**.
4. Start the VM and run the installer. Accept the defaults for language, location, and disk partitioning.
5. Set a root password and create a normal user named `labuser`.
6. At the software selection screen, clear every desktop environment and leave only **SSH server** and **standard system utilities** checked. This keeps the VM small and fast.
7. When the install finishes and the VM reboots, log in as `labuser`.

Install the handful of tools the later modules use:

```text
su -
apt update
apt install traceroute dnsutils tcpdump curl
exit
```

## Confirm the Two VMs Can See Each Other

With both VMs running, find each machine's address.

On WINCLIENT:

```text
ipconfig
```

On LINUXBOX:

```text
ip addr
```

Both should have an address in the `10.0.20.0/24` range. Then ping each one from the other, substituting the addresses you just found.

If the ping from WINCLIENT to LINUXBOX fails, that is expected on a fresh Windows install in one direction only. Windows Firewall blocks incoming ping by default, so LINUXBOX pinging WINCLIENT may fail while the reverse works. Leave that alone for now. Module 11 covers exactly why, and it is a better example than anything written in advance.

## Further Learning

- [Windows Commands reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands) documents every built-in command in the table above, including the options this guide does not use.
- [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/) covers capture options, display filters, and interface selection in far more depth than this guide needs.
- [Debian Installation Guide](https://www.debian.org/releases/stable/installmanual) walks the installer screen by screen if any step above is unclear.
- [Oracle VirtualBox User Guide](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/) documents virtual machine settings, networking modes, and Guest Additions.

## Checklist Before Moving On

- [ ] `ipconfig /all`, `nslookup`, and `curl` all run on your own machine
- [ ] Wireshark is installed and can capture on your active interface
- [ ] You captured a DNS query using the `dns` display filter
- [ ] Optional: the NETLAB NAT Network exists at 10.0.20.0/24
- [ ] Optional: WINCLIENT and LINUXBOX both have addresses in that range
- [ ] Optional: LINUXBOX can ping WINCLIENT, or you understand why it might not

Continue to Module 3 to look at what happens inside your own network segment.
