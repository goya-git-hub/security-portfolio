# Service desk

How Wexmoor's IT support works: what staff can ask for, which request goes first, how a caller is verified, and the templates every ticket uses. Wexmoor is a fictional company; every detail here is invented.

## Service catalogue

| Request | Who approves | Target first response |
|-|-|-|
| New account | The new starter's manager | One business day |
| Laptop (new or replacement) | The manager, then the IT lead | Two business days |
| Access to a shared folder | The folder's owner | One business day |
| Printing (a new printer, or a fault) | None for a fault; the office manager for a new printer | Four business hours |
| Wi-Fi access (staff or guest) | The manager for staff; the office manager for a guest | One business day |
| Software | The manager, then the IT lead | Two business days |
| Password reset or MFA change | None, but the identity check below always applies | Thirty minutes |

## Priority matrix

Priority is impact (how many people, or how important a service, is affected) against urgency (how soon it must work again).

| | Urgent: work is blocked now | Not urgent: a workaround exists |
|-|-|-|
| **High impact:** many people, or a customer-facing system | P1: start at once | P2: same business day |
| **Low impact:** one person | P3: next in the queue | P4: when the queue is quiet |

## Identity check before any password reset or MFA change

1. Never act on the caller's word, title, or urgency. A senior name and a hurry are what an attacker uses.
2. Look the person up in the directory and call back on the number the directory holds. Never use a number the caller gives.
3. If the callback fails, or the person cannot be reached, make no change; open a ticket and tell the person's manager.
4. Record who asked, how identity was checked, and what was changed in the ticket.
5. After a reset, force a new password at next sign-in. After an MFA change, tell the user's other registered contact.

## Ticket template

- **Type:** incident, service request, problem, or change
- **Symptom:** what the user sees, in their words
- **Scope:** who and what is affected
- **Theory:** what you think is wrong
- **Test:** the check that separates the theories
- **Fix:** what was changed
- **How verified:** the evidence the fix worked
- **Reply to the user:** the answer in plain words

## Knowledge-base article template

- **Title:** the symptom, as a user would describe it
- **Applies to:** the system and version
- **Cause**
- **Fix:** numbered steps
- **How to check it worked**
- **Related tickets**

Every fix that could recur becomes an article.

## Change-request template

- **What changes:** the policy or server, and why
- **Who approves**
- **Risk:** what could go wrong, and who would notice
- **Rollback plan:** the exact steps to undo it, written before the change
- **Result:** what happened, and how it was verified

Every change to a policy or a server is a change request.

## Queue labels

The repository's issue tracker is the queue. Issue text is public, so it holds no real address, hostname, log line, or name.

- **Type:** incident, request, problem, change
- **Priority:** P1, P2, P3, P4
- **Status:** new, in progress, waiting on user, resolved
