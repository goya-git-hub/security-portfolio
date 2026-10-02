# Lab Environment Baseline

## Virtual Machine Inventory
| UTM Name | Hostname | Address | Network | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Linux Server | lab-linux | 192.168.64.3 | Shared | Web server lab, baseline tasks |
| SIEM Host | lab-siem | 192.168.64.5 | Shared | SIEM, from Phase 3 |

## Snapshot Policy
* Each VM has its original clean-install snapshot and a 2026-09-30-clean-synced-clock snapshot: correct clock, working internet.
* Snapshots are disk-only and taken with the VM shut down (`sudo poweroff`), by running `qemu-img snapshot -c <date>-<purpose> *.qcow2` in the VM's Data folder.
* To roll back: shut the VM down, then run `qemu-img snapshot -a <name> *.qcow2`.
* Name every snapshot by date and purpose. Shut VMs down rather than suspending them.

## Network Diagram
Mac (UTM host)
 └── Shared Network (NAT to the internet)
      ├── Linux Server (lab-linux)
      └── SIEM Host (lab-siem)

## Tool versions (checked 2026-10-02)

| Tool | Version | Where |
| :--- | :--- | :--- |
| git | 2.54.0 | Mac |
| Node | 24.15.0 | Mac |
| pipx | 1.11.1 | Mac |
| gitleaks | 8.30.1 | Mac |
| GitHub CLI (gh) | 2.102.0 | Mac |
| GNU nano | 9.2 | Mac |
| QEMU (qemu-img) | 11.1.1 | Mac |
| TShark (Wireshark) | 4.6.7 | Mac |
| Wrangler | 4.146.0 | Mac, through npx |
| Astro | 7.3.5 | site/ |
| @astrojs/cloudflare | 14.3.3 | site/ |
| Ubuntu Server | 26.04.1 LTS, ARM64 | both VMs |
