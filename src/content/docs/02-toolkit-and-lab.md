---
title: "Module 2: Your Toolkit and Optional Lab"
description: Verify the networking tools already on your computer, install Wireshark, and optionally build a two-machine virtual lab.
---

This module gets your environment ready. Most of it takes a few minutes, because the majority of what you need is already installed with the operating system (OS) on the computer you are using right now.

The optional lab at the end adds two virtual machines (VMs): a Windows virtual machine (WINCLIENT) and a Linux virtual machine (LINUXBOX). You can read the guide without them, but building the lab is strongly recommended because many later modules use it for hands-on exercises.

## In This Module

- Confirm the networking tools already built into your operating system
- Install Wireshark and take a first capture
- Understand which exercises need the lab and which do not
- Optionally build the two-virtual-machine lab

## The Tools You Already Have

Every operating system ships with tools that answer the basic networking questions. The names differ, the questions do not.

| Question | Windows | Linux | macOS |
| --- | --- | --- | --- |
| What are my Internet Protocol (IP) settings? | `ipconfig /all` | `ip addr` | `ifconfig` |
| How does my machine pick a route? | `route print` | `ip route` | `netstat -rn` |
| Who is on my local segment? | `arp -a` | `ip neigh` | `arp -a` |
| What is listening or connected? | `netstat -ano` | `ss -tulpn` | `netstat -an` |
| What does this name resolve to? | `nslookup` | `dig` | `dig` |
| What path does traffic take? | `tracert` | `traceroute` | `traceroute` |
| What does this server actually say? | `curl` | `curl` | `curl` |

This guide shows Windows commands first, with the others alongside, because most readers are on Windows. Nothing about the concepts changes between them.

A few notes before you start.

`dig` is not included with Windows. Use `nslookup`, or `Resolve-DnsName` in PowerShell, which produces more readable output. Module 9 shows both.

`dig` is not always installed on Linux either. On Linux Mint and Ubuntu it comes from the `dnsutils` package, which you can install with `sudo apt install dnsutils`.

`traceroute` is not always installed on Linux. On Linux Mint and Ubuntu, install it with `sudo apt install traceroute`.

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
Wireshark records everything reaching the interface you select, not just the traffic you generated. On a typical switched network that means your own traffic plus broadcast and multicast, though some designs expose more.

Unencrypted traffic is readable in full, credentials included. Encrypted traffic stays protected, but a capture still shows which systems communicated, when, and how much.

Capture only on networks you own or are authorized to work on. Doing so without permission can violate policy or law. Every capture in this guide is on your own machine or your own lab.
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
The lab is optional, and you can read the guide without building it. However, building it is strongly recommended. Many later modules use the Windows virtual machine (WINCLIENT) and Linux virtual machine (LINUXBOX) for hands-on exercises that reinforce the concepts and provide practical experience.
:::

The lab also gives you a safe place to change addresses, routes, services, and firewall rules without disrupting your everyday computer.

It is two virtual machines.

**WINCLIENT** is a Windows 11 Enterprise evaluation. It is the machine you configure through the familiar graphical settings, and it plays the client in every exercise.

**LINUXBOX** runs Linux Mint with the Xfce desktop. It plays the other end, acting as a server, router, network address translation (NAT) gateway, and reverse proxy in later modules. The graphical desktop makes the system approachable for someone new to Linux, while the exercises introduce the terminal commands needed for networking work.

The two VMs are assigned a total of 6 gigabytes (GB) of memory and 89 GB of virtual disk capacity. With VirtualBox's default dynamically allocated disks, the VM files grow as data is stored rather than immediately using all 89 GB. A machine with 16 GB of random-access memory (RAM) is recommended. An 8 GB machine may run the lab slowly and leave little memory for the host operating system.

Both operating systems are free to obtain. Linux Mint is free to download and use. Windows 11 Enterprise is a 90-day evaluation, so note the date you install it.

## Build the Lab Network

The lab uses an Internet Protocol version 4 (IPv4) network in VirtualBox. The VirtualBox base package is free and open source under the GNU General Public License (GPL) version 3. The optional Extension Pack uses a separate license and is not required for this lab. VirtualBox's Dynamic Host Configuration Protocol (DHCP) service supplies the lab addresses automatically.

These x64 virtual machines require an Intel or AMD host. The steps are not written for Arm-based Macs or Windows devices. Other hypervisors can work, but the steps below are written for VirtualBox.

1. Download and install the base package from the official [VirtualBox Downloads page](https://www.virtualbox.org/wiki/Downloads). Accept the installer defaults.
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

An ISO image is a file containing the contents of an installation disc. Windows 11 also requires the Extensible Firmware Interface (EFI), Secure Boot, and a Trusted Platform Module (TPM). EFI replaces the traditional Basic Input/Output System (BIOS).

1. Download the Windows 11 Enterprise evaluation ISO from the [Microsoft Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise). Choose the x64 image used by ordinary Intel or AMD computers, not the ARM64 image intended for Arm-based computers.
2. In VirtualBox Manager, click **New** and set:
   - **Name:** `WINCLIENT`
   - **ISO Image:** the Windows 11 ISO
   - Choose a manual installation. Depending on your VirtualBox version, either check **Skip Unattended Installation** or clear **Install OS Using Unattended Installation**
   - **Base Memory:** 4096 megabytes (MB)
   - **Processors:** 2
   - Check **Enable EFI**
   - **Hard Disk:** 64 GB
3. Before starting it, open **Settings > System** and confirm **TPM Version** is 2.0 and **Enable Secure Boot** is checked. Windows 11 setup refuses to run without both.
4. Open **Settings > Network** and set Adapter 1 to **NAT Network**, name **NETLAB**.
5. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum. This provides enough video memory for higher resolutions and full-screen mode.
6. Start the VM and install Windows. When setup asks you to sign in, choose **Sign-in options**, then the option to create a local account, and name it `labuser`.
7. After reaching the desktop, install Guest Additions from **Devices > Insert Guest Additions CD image**, run the installer from the CD drive, and restart.

## Build LINUXBOX

1. Open the official [Linux Mint download page](https://linuxmint.com/download.php), find the **Xfce Edition**, and download its 64-bit ISO image.
2. In VirtualBox Manager, click **New** and set:
   - **Name:** `LINUXBOX`
   - **ISO Image:** the Linux Mint Xfce ISO
   - Choose a manual installation
   - **Base Memory:** 2048 MB
   - **Processors:** 2
   - **Hard Disk:** 25 GB
3. Open **Settings > Network** and set Adapter 1 to **NAT Network**, name **NETLAB**.
4. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum. This provides enough video memory for higher resolutions and full-screen mode.
5. Start the VM. At the boot menu, start Linux Mint, then double-click **Install Linux Mint** on the desktop.
6. Select your language and keyboard layout.
7. If the installer offers to install multimedia codecs, leave that option unchecked. They are not needed for this lab.
8. At **Installation type**, select **Erase disk and install Linux Mint**. This erases only the empty virtual disk created for LINUXBOX; it does not erase the host computer's disk.
9. Select your time zone.
10. Create the account with:
   - **Your name:** `Lab User`
   - **Your computer's name:** `linuxbox`
   - **Username:** `labuser`
   - Choose a password you will remember
   - Select **Require my password to log in**
11. Complete the installation and choose **Restart Now**. If prompted to remove the installation medium, use **Devices > Optical Drives > Remove disk from virtual drive** in the VirtualBox window, then press Enter.
12. Log in as `labuser`, then open the Terminal application from the desktop menu.

Install the handful of tools the later modules use:

```text
sudo apt update
sudo apt install openssh-server traceroute dnsutils tcpdump curl
sudo systemctl enable --now ssh
```

The `sudo` command runs an administrative command after you enter the `labuser` password. Linux does not display dots or other characters while you type the password; that is normal.

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

WINCLIENT should normally be able to ping LINUXBOX. A ping from LINUXBOX to WINCLIENT may fail because Windows Firewall blocks incoming ping by default. Leave that alone for now. Module 11 covers exactly why, and it is a better example than anything written in advance.

## Further Learning

- [Windows Commands reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands) documents every built-in command in the table above, including the options this guide does not use.
- [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/) covers capture options, display filters, and interface selection in far more depth than this guide needs.
- [Linux Mint Installation Guide](https://linuxmint-installation-guide.readthedocs.io/en/latest/) provides additional installation and troubleshooting details.
- [Oracle VirtualBox User Guide](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/) documents virtual machine settings, networking modes, and Guest Additions.

## Checklist Before Moving On

- [ ] `ipconfig /all`, `nslookup`, and `curl` all run on your own machine
- [ ] Wireshark is installed and can capture on your active interface
- [ ] You captured a DNS query using the `dns` display filter
- [ ] Optional: the NETLAB NAT Network exists at 10.0.20.0/24
- [ ] Optional: WINCLIENT and LINUXBOX both have addresses in that range
- [ ] Optional: LINUXBOX can ping WINCLIENT, or you understand why it might not

Continue to Module 3 to look at what happens inside your own network segment.
