---
title: Building the Optional NETLAB
description: Build the isolated VirtualBox network and the Windows and Linux virtual machines used by optional exercises.
---

:::note[Optional: Explore Later]
The conceptual guide does not require this lab. Build it if you want an isolated place to observe traffic and practice changing network settings.
:::

The lab contains two virtual machines (VMs):

- A Windows Virtual Machine (WINCLIENT)
- A Linux Virtual Machine (LINUXBOX) running Linux Mint Xfce

Both attach to a VirtualBox Network Address Translation (NAT) Network named `NETLAB` using the Internet Protocol version 4 (IPv4) range `10.0.20.0/24`.

WINCLIENT plays the client in the exercises. LINUXBOX acts as a server, router, NAT gateway, or reverse proxy when an exercise needs one.

The two VMs are assigned a total of 6 gigabytes (GB) of memory and 89 GB of virtual disk capacity. With VirtualBox's default dynamically allocated disks, the VM files grow as data is stored rather than immediately using all 89 GB. A machine with 16 GB of random-access memory (RAM) is recommended. An 8 GB machine may run the lab slowly and leave little memory for the host operating system.

Both operating systems are free to obtain. Linux Mint is free to download and use. Windows 11 Enterprise is a 90-day evaluation, so note the date you install it.

## Build the Lab Network

The VirtualBox base package is free and open source under the GNU General Public License (GPL) version 3. The optional Extension Pack uses a separate license and is not required for this lab. VirtualBox's Dynamic Host Configuration Protocol (DHCP) service supplies the lab addresses automatically.

These x64 virtual machines require an Intel or AMD host. The steps are not written for Arm-based Macs or Windows devices. Other hypervisors can work, but the steps below are written for VirtualBox.

1. Download and install the base package from the official [VirtualBox Downloads page](https://www.virtualbox.org/wiki/Downloads). Accept the installer defaults.
2. In VirtualBox Manager, open **File > Tools > Network Manager**.
3. Select the **NAT Networks** tab, then select **Create**.
4. Select the new network and set:
   - **Name:** `NETLAB`
   - **IPv4 Prefix:** `10.0.20.0/24`
   - **Enable DHCP:** checked
5. Select **Apply** and close Network Manager.

VirtualBox calls this a NAT Network. Both VMs can reach each other and the internet through it. Systems on the physical home or workplace network cannot initiate connections to the VMs unless you deliberately add another adapter or forwarding rule.

:::note
DHCP remains enabled so the VMs receive their network settings without running another server. [Module 9](/09-dhcp/) explains what the service supplies.

If you also built a lab from an Active Directory guide, keep this network's distinct name and address range so the two labs do not collide.
:::

## Build WINCLIENT

An installation-disc image, commonly called an ISO image, contains the files used to install an operating system. Windows 11 also requires Extensible Firmware Interface (EFI) firmware, Secure Boot, and a Trusted Platform Module (TPM). EFI replaces the traditional Basic Input/Output System (BIOS).

1. Download the Windows 11 Enterprise evaluation ISO from the [Microsoft Evaluation Center](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise). Choose the x64 image used by ordinary Intel or AMD computers, not the ARM64 image intended for Arm-based computers.
2. In VirtualBox Manager, select **New** and set:
   - **Name:** `WINCLIENT`
   - **ISO Image:** the Windows 11 ISO
   - Choose a manual installation. Depending on the VirtualBox version, either check **Skip Unattended Installation** or clear **Install OS Using Unattended Installation**
   - **Base Memory:** 4096 megabytes (MB)
   - **Processors:** 2
   - Check **Enable EFI**
   - **Hard Disk:** 64 GB
3. Before starting it, open **Settings > System** and confirm **TPM Version** is 2.0 and **Enable Secure Boot** is checked. Windows 11 setup refuses to run without both.
4. Open **Settings > Network** and set Adapter 1 to **NAT Network**, name **NETLAB**.
5. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum.
6. Start the VM and install Windows. When setup asks you to sign in, choose **Sign-in options**, then the option to create a local account, and name it `labuser`.
7. After reaching the desktop, install Guest Additions from **Devices > Insert Guest Additions CD image**, run the installer from the CD drive, and restart.

## Build LINUXBOX

1. Open the official [Linux Mint download page](https://linuxmint.com/download.php), find the **Xfce Edition**, and download its 64-bit ISO image.
2. In VirtualBox Manager, select **New** and set:
   - **Name:** `LINUXBOX`
   - **ISO Image:** the Linux Mint Xfce ISO
   - Choose a manual installation
   - **Base Memory:** 2048 MB
   - **Processors:** 2
   - **Hard Disk:** 25 GB
3. Open **Settings > Network** and set Adapter 1 to **NAT Network**, name **NETLAB**.
4. Open **Settings > Display > Screen** and move the **Video Memory** slider to the maximum.
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

Install the tools used by later exercises:

```text
sudo apt update
sudo apt install openssh-server traceroute dnsutils tcpdump curl
sudo systemctl enable --now ssh
```

The `sudo` command runs an administrative command after you enter the `labuser` password. Linux does not display dots or other characters while you type the password; that is normal.

## Confirm the Lab

With both VMs running, find each machine's address.

On WINCLIENT:

```text
ipconfig
```

On LINUXBOX:

```text
ip -4 addr
```

Both should have an address beginning with `10.0.20.` and a `/24` prefix, shown as subnet mask `255.255.255.0` on Windows.

From WINCLIENT, replace `<LINUXBOX-IP>` with the address found on LINUXBOX:

```text
ping <LINUXBOX-IP>
Test-NetConnection <LINUXBOX-IP> -Port 22
```

The ping and Transmission Control Protocol (TCP) port test should normally succeed. If the ping fails but the TCP test succeeds, do not treat the lab as broken; a firewall can permit one protocol while blocking another.

A ping from LINUXBOX to WINCLIENT may fail because Windows Firewall blocks incoming ping by default. Leave that setting unchanged. [Module 12](/12-filtering/) explains the behavior and contains an optional, temporary firewall exercise.

## Lab Safety and Cleanup

- Make configuration changes only on WINCLIENT, LINUXBOX, or the `NETLAB` network unless an exercise explicitly identifies the Windows host.
- Do not bridge the lab VMs to an untrusted or workplace network.
- Take a VirtualBox snapshot before an exercise if you want an easy rollback point.
- Stop both VMs when they are not in use.
- Delete the VMs through VirtualBox only when you no longer want the lab. Confirm the VM names before deleting their virtual disks.

## Further Learning

- [Windows 11 Enterprise evaluation](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise) provides the time-limited Windows image used by WINCLIENT.
- [Linux Mint Installation Guide](https://linuxmint-installation-guide.readthedocs.io/en/latest/) provides additional installation and troubleshooting details.
- [Oracle VirtualBox User Guide](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/) documents virtual machine settings, networking modes, snapshots, and Guest Additions.
