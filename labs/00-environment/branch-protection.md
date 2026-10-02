# Branch protection on main

Date: 2026-10-01
Rule: ruleset "protect-main", Active, with an empty bypass list.
Enforces: a pull request for every change, no force pushes, no deletions.

## Test

A direct push to main was rejected, even from the repository owner:

remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
! [remote rejected] main -> main (push declined due to repository rule violations)
