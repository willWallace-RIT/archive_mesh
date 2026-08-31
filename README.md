# archive_mesh
Untested ai slop coding Infrastructure foundation to operate an fan online service using preexisting LAN infrastructure in decommissioned games

# Project Archive-Mesh: Infrastructure Foundation

A lightweight, virtual-LAN-backed routing and stub-API framework designed to capture, redirect, and host legacy online services locally without modifying native client binaries.

This repository outlines the foundational setup for establishing an isolated Layer 2/3 virtual network space paired with local DNS interception.

---

## Step 1: Virtual LAN Mesh Configuration (The Transport Layer)

Before routing application traffic, establish an isolated virtual network space so all target nodes and the master infrastructure server reside on a unified virtual subnet.

### 1.1 Deploy the Mesh Coordinator
* Initialize a private tailnet via **Tailscale** or set up a controller network via **ZeroTier One**.
* Connect all participant nodes (including the master server host and client routing gateways) to the mesh.

### 1.2 Assign Virtual IPs
* Map out a predictable static private IP block for your infrastructure nodes (e.g., `10.147.20.0/24`).
* Assign a static virtual IP to your master server host (e.g., `10.147.20.10`).

### 1.3 Configure a Gateway / Bridge (For Physical Hardware)
If routing traffic from physical consoles or non-virtualized devices through the mesh, configure a Linux host on the physical subnet to act as a router/gateway bridge using `iptables` and `MASQUERADE` rules:

# Enable packet forwarding in the kernel
sudo sysctl -w net.ipv4.ip_forward=1

# Configure NAT and masquerading across the virtual tunnel interface
sudo iptables -t nat -A POSTROUTING -o tailscale0 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o tailscale0 -j ACCEPT
sudo iptables -A FORWARD -i tailscale0 -o eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT

(Note: Replace tailscale0 with your actual virtual interface name and eth0 with your physical interface name).
Step 2: Local DNS Interception (The Traffic Redirection Layer)
To capture outgoing telemetry, asset requests, or master server lookups transparently without modifying client code, configure a local DNS resolver (such as dnsmasq) inside the virtual network.
2.1 Install and Configure dnsmasq
Install dnsmasq on your master server or designated DNS gateway node, then configure domain redirection rules to point official target endpoints to your local master infrastructure IP (10.147.20.10).
Create or edit your dnsmasq.conf configuration file:
# Bind to the virtual network interface address
listen-address=10.147.20.10
bind-interfaces

# Upstream fallback DNS servers (e.g., Cloudflare / Google)
server=1.1.1.1
server=8.8.8.8

# Intercept target production domains and point them to the local backend
address=/[suckerpunch.com/10.147.20.10](https://suckerpunch.com/10.147.20.10)
address=/[infamous2.api.sony.com/10.147.20.10](https://infamous2.api.sony.com/10.147.20.10)

2.2 Client DNS Override
 * Configure the client machines, emulator network adapters, or console network settings to use 10.147.20.10 as their primary DNS nameserver.
 * This ensures all domain lookups for the targeted services resolve directly to your internal routing infrastructure.

