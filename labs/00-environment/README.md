# Lab Environment Baseline

## Virtual Machine Inventory
| Hostname | Operating System | IP Address | Resources |
| :--- | :--- | :--- | :--- |
| Linux Server | Ubuntu 26.04.1 LTS ARM64 | 192.168.64.3 | 2 vCPU, 4GB RAM |
| SIEM Host | Ubuntu 26.04.1 LTS ARM64 | 192.168.64.5 | 2 vCPU, 4GB RAM |

## Snapshot Policy
* **Baseline Snapshots:** A `clean-install` snapshot was successfully taken for both the Linux Server and SIEM Host immediately following initial configuration, SSH setup, and system updates.
* **Recovery Protocol:** In the event that a destructive lab exercise critically damages a machine, the procedure is to revert to the `clean-install` snapshot using `qemu-img` to immediately restore base functionality without requiring an OS reinstall.

## Network Diagram
*(Network diagram image will be placed here)*
