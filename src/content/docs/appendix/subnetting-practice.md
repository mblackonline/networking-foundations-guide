---
title: Subnetting Practice
description: A complete CIDR reference, calculation shortcuts, and practice problems with answers.
---

Use this appendix after Module 4 when you want more subnetting practice or a complete reference. You do not need to memorize the tables before continuing through the guide.

## Complete IPv4 CIDR Reference

| Prefix | Subnet mask | Total addresses | Usually usable by hosts |
| --- | --- | ---: | ---: |
| `/8` | `255.0.0.0` | 16,777,216 | 16,777,214 |
| `/9` | `255.128.0.0` | 8,388,608 | 8,388,606 |
| `/10` | `255.192.0.0` | 4,194,304 | 4,194,302 |
| `/11` | `255.224.0.0` | 2,097,152 | 2,097,150 |
| `/12` | `255.240.0.0` | 1,048,576 | 1,048,574 |
| `/13` | `255.248.0.0` | 524,288 | 524,286 |
| `/14` | `255.252.0.0` | 262,144 | 262,142 |
| `/15` | `255.254.0.0` | 131,072 | 131,070 |
| `/16` | `255.255.0.0` | 65,536 | 65,534 |
| `/17` | `255.255.128.0` | 32,768 | 32,766 |
| `/18` | `255.255.192.0` | 16,384 | 16,382 |
| `/19` | `255.255.224.0` | 8,192 | 8,190 |
| `/20` | `255.255.240.0` | 4,096 | 4,094 |
| `/21` | `255.255.248.0` | 2,048 | 2,046 |
| `/22` | `255.255.252.0` | 1,024 | 1,022 |
| `/23` | `255.255.254.0` | 512 | 510 |
| `/24` | `255.255.255.0` | 256 | 254 |
| `/25` | `255.255.255.128` | 128 | 126 |
| `/26` | `255.255.255.192` | 64 | 62 |
| `/27` | `255.255.255.224` | 32 | 30 |
| `/28` | `255.255.255.240` | 16 | 14 |
| `/29` | `255.255.255.248` | 8 | 6 |
| `/30` | `255.255.255.252` | 4 | 2 |
| `/31` | `255.255.255.254` | 2 | 2 on a point-to-point link |
| `/32` | `255.255.255.255` | 1 | 1 exact address |

For ordinary subnets through `/30`:

```text
Host bits = 32 - prefix length
Total addresses = 2^(host bits)
Usable hosts = total addresses - 2
```

## The Repeating Octet Pattern

The same mask and block-size pattern repeats in every octet.

| Network bits added in one octet | Mask value | Block size | Equal child subnets |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 256 | 1 |
| 1 | 128 | 128 | 2 |
| 2 | 192 | 64 | 4 |
| 3 | 224 | 32 | 8 |
| 4 | 240 | 16 | 16 |
| 5 | 248 | 8 | 32 |
| 6 | 252 | 4 | 64 |
| 7 | 254 | 2 | 128 |
| 8 | 255 | 1 | 256 |

The mask values come from adding binary place values from left to right:

```text
128, 64, 32, 16, 8, 4, 2, 1
```

For example, six network bits give:

```text
128 + 64 + 32 + 16 + 8 + 4 = 252
256 - 252 = a block size of 4
```

That produces `/22` when the changing octet is the third or `/30` when it is the fourth.

## Counting Child Subnets

When a parent network is divided into equal-size children:

```text
Borrowed bits = child prefix - parent prefix
Child subnets = 2^(borrowed bits)
```

Divide `172.30.0.0/16` into `/24` subnets:

```text
Borrowed bits: 24 - 16 = 8
Child subnets: 2^8 = 256

Host bits:     32 - 24 = 8
Usable hosts:  2^8 - 2 = 254 per child subnet
```

The parent prefix must be known. A `/24` by itself is one subnet, not 256 subnets.

## Choosing a Prefix

Suppose `172.21.0.0/16` must provide at least 850 equal-size subnets with at least 50 usable hosts in each.

Find the smallest power of two that satisfies the subnet requirement:

```text
2^9  = 512    not enough
2^10 = 1,024  enough
```

Borrowing ten bits from `/16` gives `/26`.

Now verify the hosts:

```text
32 - 26 = 6 host bits
2^6 - 2 = 62 usable hosts
```

A `/26` satisfies both requirements.

## Legacy Classful Questions

Older certification questions sometimes infer a parent prefix from the first octet:

| Historical class | First octet | Assumed parent |
| --- | --- | --- |
| A | 1 through 126 | `/8` |
| B | 128 through 191 | `/16` |
| C | 192 through 223 | `/24` |

For example, an older question may present `172.22.0.0/25` and expect the class B `/16` parent:

```text
Borrowed bits: 25 - 16 = 9
Child subnets: 2^9 = 512

Host bits:     32 - 25 = 7
Usable hosts:  2^7 - 2 = 126
```

In modern networking, do not infer a prefix from the first octet. Use the parent prefix stated in the design or question.

## Practice

Try these without looking at the reference table.

1. Find the network, broadcast, and usable range for `192.168.4.70/26`.
2. Find the network, broadcast, and usable range for `10.20.5.200/27`.
3. How many `/26` child subnets fit inside a `/24`?
4. How many usable hosts are in an ordinary `/28`?
5. What prefix provides at least 50 usable host addresses?
6. Assuming an older class B `/16` parent, how many `/25` child subnets can be created?

<details>
<summary>Show answers</summary>

1. Network `192.168.4.64`, broadcast `192.168.4.127`, hosts `192.168.4.65` through `192.168.4.126`.
2. Network `10.20.5.192`, broadcast `10.20.5.223`, hosts `10.20.5.193` through `10.20.5.222`.
3. Four. A `/26` borrows two bits from a `/24`, and `2^2 = 4`.
4. Fourteen. A `/28` has four host bits, and `2^4 - 2 = 14`.
5. `/26`, which provides 62 usable host addresses.
6. 512. A `/25` borrows nine bits from `/16`, and `2^9 = 512`.

</details>

## Further Practice

Ed Harmoush's free [Subnetting Mastery video series](https://www.practicalnetworking.net/stand-alone/subnetting-mastery/) teaches a detailed hand-calculation method and links to an interactive IPv4 question generator.
