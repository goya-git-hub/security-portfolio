# Company Profile: Wexmoor

> Fictional data-analytics company created for Goya's security portfolio. All staff, customers, datasets, and files are fictional or synthetic. Systems described are scenario assumptions unless identified as implemented in the lab.

## 1. Overview

Wexmoor is a 40-person business-to-business data-analytics company in Canada. Customers upload operational data and query it in their own private workspace. At first its customers are retail and logistics companies.

## 2. Team and External Parties

### Internal Staff: 40 People
- 2 Founders (CEO and CTO)
- 1 Engineering Lead
- 10 Platform Engineers
- 7 Data Engineers
- 4 Solutions Engineers
- 4 Customer Success Managers
- 4 Sales
- 3 Finance and Operations (including the Operations Manager)
- 2 People Operations
- 2 Product and Design
- 1 IT Support and Security (the role Goya plays in this portfolio)

The founders make business-risk decisions. The Engineering Lead oversees the platform and receives security escalations. The Operations Manager handles supplier payments and financial records. The IT Support and Security role starts as a trainee and is promoted as the portfolio's phases are completed.

### External Parties
- **Customers:** upload data and query their own workspace.
- **Contractors:** work on one project at a time.
- **Auditors:** review controls and evidence on request.

## 3. Information and Sensitivity

- **Restricted:** customer datasets, platform secrets (API keys, service credentials), and staff personal data.
- **Confidential:** contracts, pricing, internal financials, and source code.
- **Internal:** runbooks, procedures, and meeting notes.
- **Public:** marketing pages and product documentation.

## 4. Customer Onboarding Workflow

1. Sales hands a signed contract to Customer Success.
2. A Platform Engineer creates the customer's workspace.
3. The customer's administrator is invited, signs in with multi-factor authentication, and adds their users.
4. The customer uploads data and receives an API key for automated uploads.
5. Staff see customer data only with a documented reason, an approver, a time limit, and a log entry.
6. At contract end, access is removed and the removal is verified.

## 5. Access Boundaries

- **Customers:** each customer sees only its own workspace.
- **Staff:** access to customer data follows step 5 above. Seniority alone grants nothing.
- **Administration:** engineers use separate administrator accounts for administrative tasks.
- **Contractors:** one project, removed and verified when the engagement ends.
- **Business records:** payroll and finance records are limited to designated staff.

## 6. Escalation

- Security incidents go to the Engineering Lead, then to a founder for business decisions.
- Any request to change payment or bank details is verified with the supplier through a contact already on file, and approved by the Operations Manager and a founder.
- Customer-facing notices about an incident are approved by a founder before they are sent.

## 7. Systems and Portfolio Scope

**Current, from Phase 0:** the public marketing site, Microsoft 365 email and documents, the code repositories and build pipeline, and the security logging.

**Planned, or local training only:** the customer application, its API, customer accounts, datasets, and workspace. These are built first as a local training app in Phase 4 and, optionally, as the capstone. Planned items stay labelled planned until tested.

## 8. Security Priorities

- A leaked API key used to pull data.
- One customer reaching another customer's data.
- Phishing, mailbox compromise, and payment-change fraud.
- Bulk downloads by a compromised or misused account.
- Compromise of the build pipeline.
- Ransomware and automated scanning.
