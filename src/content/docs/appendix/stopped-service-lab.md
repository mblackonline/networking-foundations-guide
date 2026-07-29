---
title: Troubleshooting a Stopped Service
description: Use the optional NETLAB environment to distinguish network reachability from a service that is not listening.
---

This exercise uses the [optional NETLAB environment](/appendix/building-netlab/). It temporarily stops Secure Shell (SSH) on LINUXBOX, then uses client-side and server-side evidence to locate the failure.

Use the VirtualBox console for LINUXBOX so stopping SSH does not disconnect the session you need to restore it.

## Confirm the Starting State

1. On LINUXBOX, find its NETLAB address:

   ```text
   ip -4 addr
   ```

2. On WINCLIENT, replace `<LINUXBOX-IP>` with that address and confirm that TCP port 22 is reachable:

   ```text
   Test-NetConnection -ComputerName <LINUXBOX-IP> -Port 22
   ```

   The result should show `TcpTestSucceeded: True`.

Do not continue until the starting test succeeds. Otherwise, you would be adding a second problem to an unknown starting condition.

## Stop the Service and Locate the Failure

1. From the LINUXBOX VirtualBox console, stop SSH:

   ```text
   sudo systemctl stop ssh
   ```

2. Repeat the same `Test-NetConnection` command on WINCLIENT. The TCP test should now fail.
3. On LINUXBOX, check whether any process is listening on TCP port 22:

   ```text
   sudo ss -lntp
   ```

   Port 22 should be absent. The client showed that the destination port was unavailable, and the server showed why: no process was listening.

## Restore and Verify

1. Restore SSH on LINUXBOX:

   ```text
   sudo systemctl start ssh
   sudo systemctl status ssh --no-pager
   ```

2. Repeat the client test:

   ```text
   Test-NetConnection -ComputerName <LINUXBOX-IP> -Port 22
   ```

   It should show `TcpTestSucceeded: True` again.

3. Confirm that SSH is listening:

   ```text
   sudo ss -lntp
   ```

The repeated client test verifies the original behavior, while the server check confirms that the expected listener returned.

## What This Lab Demonstrates

- A reachable host can still have an unavailable application port.
- A client-side port test locates the failed stage but does not explain the server-side cause.
- Listener state on the server provides a second piece of evidence.
- Restoring a service is not enough; repeat the original client test afterward.
