### Ticket 001: Web Server Outage

* **Setup / Baseline:** Installed `nginx` and verfied baseline availability with `curl -I http://localhost` (HTTP 200 OK). Simulated an outage by stopping the service via `sudo systemctl stop nginx`.
* **Symptom:** Web server inaccessible. `curl -I http://localhost` returned `curl: (7) Failed to connect to localhost port 80: Could not connect to server`.
* **Cause:** Inspected service state using `sudo systemctl status nginx`. Service was `inactive (dead)` with log entry: `Sep 25 20:59:12 lab-linux systemd[1]: Stopped nginx.service - A high performance web server and a reverse proxy server`.
* **Fix:** Started the service using `sudo systemctl start nginx`.
* **Verified:** Verified service recovery via `curl -I http://localhost`, receiving `HTTP/1.1 200 OK` from `nginx/1.28.3 (Ubutntu)`. 


### Ticket 002: Permission Error
* **Setup / Baseline:** Created groiup `datateam` and test accounts `user1` and `user2` in that group. Created directory `/srv/shared` owned by `root:datateam`. Simulated access failure by restricting permissions to `700` (`drwx------`).
* **Symptom:** User `user1` reported `Permission denied` when attempting to list directory `/srv/shared`.
* **Cause:** Inspected directory permissions with `ls -ld /srv/shared`. Permissions were `drwx------`, leaving the `datateam` group with no read or traversal rights (`---`).
* **Fix:** Applied least privilege permissions via `sudo chmod 750 /srv/shared` (granting `r-x` to group `datateam` while keeping others at `---`).
* **Verified:** Switched to `user1` (`sudo su - user1`) and successfully ran `ls -la /srv/shared` without errors.


### Ticket 003: Access Lifecycle (Onboarding & Offboarding)
* **Setup / Baseline:** Hired a temporary consultant requiring access to the restricted `/srv/shared` directory.
* **Onboarding:** Created user `consultant1` with a home directory (`sudo useradd -m consultant1`) and added them to the `datateam` group (`sudo usermod -a -G datateam consultant1`).
* **Verification (Access Granted):** Switched to user (`sudo su - consultant1`) and successfully executed `ls -l /srv/shared`, confirming the `r-x` group permissions allowed traversal and listing.
* **Offboarding:** Contract ended. Completely removed the user account and wiped their home directory using `sudo userdel -r consultant1`.
* **Verification (Access Revoked):** Confirmed user deletion using `id consultant1` (returned no such user).


### Ticket 004: Find the Right Log
* **Task:** Show the last five times `sudo` was use and by whom.
* **Action:** Searched the system authentication log using `sudo grep "sudo" /var/log/auth.log | tail -n 5`.
* **Result:** Successfully retrieved the last five `sudo` events. The logs confirmed the user `analyst` escalated privileges to execute administrative commands, including `userdel` and `grep`.


### Ticket 005: Restore a Deleted File
* **Task:** Create a backup of a file, delete the original, and restore it while proving integrity.
* **Action:** Created a `important_data.txt` and copied it to `backup_dir`. Recorded the SHA256	has (`sha256sum`). Deleted the original using `rm`, then restored it using `cp backup_dir/important_data.txt .`.
* **Result:** Verified the integrity of the restored file by comparing its `sha256sum` hash to the backup, confirming a perfect byte-for-byte recovery.


### Ticket 006:



### Ticket 007:


