# Part 10, Theme 8: Governance and Rights

*Ideas 171 to 185. Most of the previous themes are product features. This one is about the rules, institutions, and rights that would make those features stick and make them trustworthy. Good recommendation design for children is not only an engineering question; it is a question of who controls the data, who can audit the system, and what a child is owed. Several of these ideas are partly [ESTABLISHED] in emerging law (the UK Age Appropriate Design Code, the EU Digital Services Act), and we label that honestly.*

Feasibility labels follow the repository convention: **High**, **Medium**, **Low**, **Speculative**. See [`EPISTEMICS.md`](../../EPISTEMICS.md).

---

### 171. Children's Data Trusts

**How it would work.** A child's recommendation-relevant data is held by an independent trust with a fiduciary duty to the child, which licenses access to platforms under terms that serve the child's interests rather than the platform's. [SPECULATIVE]; data trusts are an active policy proposal.

**Problem it solves.** Children cannot bargain with platforms over their data; a trust supplies a fiduciary who can.

**Technical feasibility.** Low. The technology is feasible; the legal and institutional build is the hard part.

**Potential risks.** A trust can be captured or under-resourced; concentrates sensitive data.

**Educational value.** Medium.

---

### 172. Algorithmic Rights for Children

**How it would work.** A codified set of rights specific to recommendation (to an explanation, to non-manipulation, to a non-personalised option, to be forgotten, to a human appeal) that platforms serving children must honour. [INFERENCE]; partly grounded in [ESTABLISHED] codes like the AADC and DSA.

**Problem it solves.** Children's relationship to recommenders is currently rights-free; a charter establishes a floor.

**Technical feasibility.** Medium. Implementation follows law; the politics is the constraint.

**Potential risks.** Rights without enforcement are theatre; definitions can be gamed.

**Educational value.** High.

---

### 173. Independent Algorithm Auditing

**How it would work.** Accredited third parties get controlled access to test how a child-facing recommender behaves (what it amplifies, how it treats vulnerable users) and publish findings, like a food-safety inspector for feeds. [INFERENCE]; auditing provisions exist in the [ESTABLISHED] DSA.

**Problem it solves.** No one outside the company can currently verify what a recommender does to children.

**Technical feasibility.** Medium. Audit access and methods are developing.

**Potential risks.** Auditors need real access or it is hollow; commercial secrecy resists it.

**Educational value.** Medium.

---

### 174. Public-Interest Recommender APIs

**How it would work.** Platforms expose a vetted API so researchers, schools, and public bodies can build healthier feeds on top of the same content, breaking the monopoly on what ranking the public can experience. [SPECULATIVE].

**Problem it solves.** One company controls the only ranking a child can use; an API opens the door to public-interest alternatives.

**Technical feasibility.** Low. Technically possible; commercially and security-wise very hard.

**Potential risks.** Abuse of the API; privacy leakage; platform resistance.

**Educational value.** High.

---

### 175. Feed Portability

**How it would work.** A child can export their interest profile and preferences and import them into another service, so leaving a platform does not mean starting from zero and being locked in by sunk personalisation. [INFERENCE]; portability is partly [ESTABLISHED] (GDPR data portability).

**Problem it solves.** Personalisation is a lock-in moat; portability restores the freedom to leave.

**Technical feasibility.** Medium. A standard profile format is the missing piece.

**Potential risks.** Portable profiles are sensitive; standardisation is hard.

**Educational value.** Medium.

---

### 176. The Recommender Ombudsman

**How it would work.** An independent body a child or parent can appeal to when a feed has harmed them, with the power to investigate and require change, like an ombudsman for any other essential service. [SPECULATIVE].

**Problem it solves.** There is no neutral place to turn when a recommender harms a child; an ombudsman provides recourse.

**Technical feasibility.** Low. Institutional, not technical, and politically demanding.

**Potential risks.** Under-funded ombudsmen are toothless; jurisdiction is messy.

**Educational value.** Medium.

---

### 177. Open Objective Disclosure Standard

**How it would work.** A legally backed standard requiring child-facing platforms to disclose, in a common format, what their recommender optimises for, so objectives are comparable and accountable across services. [SPECULATIVE], policy-dependent.

**Problem it solves.** Objectives are secret and shifting; a disclosure standard makes them public and comparable.

**Technical feasibility.** Medium. The format is easy; mandating honesty is hard.

**Potential risks.** Disclosed objectives can be sanitised; needs audit to verify.

**Educational value.** High.

---

### 178. Child Assent Registers

**How it would work.** A standing, revisable record of what a child has actually agreed to regarding their feed, distinct from a parent's one-time consent, that the system must check and honour as the child grows. [SPECULATIVE].

**Problem it solves.** Consent is currently a parent's single tick; a child's evolving assent is ignored. A register centres it.

**Technical feasibility.** Medium.

**Potential risks.** Assent can be coerced or rushed; meaningfulness is the challenge.

**Educational value.** High.

---

### 179. Algorithmic Impact Assessments for Kids

**How it would work.** Before deploying a recommender change to children, a platform must assess and document the likely effect on child wellbeing, publish a summary, and be accountable for it, like an environmental impact assessment. [INFERENCE]; risk assessment duties exist under the [ESTABLISHED] DSA and AADC.

**Problem it solves.** Changes ship to millions of children with no prior wellbeing scrutiny.

**Technical feasibility.** Medium.

**Potential risks.** Box-ticking assessments that change nothing; needs teeth.

**Educational value.** Medium.

---

### 180. The Public Recommender Commons

**How it would work.** A non-profit, publicly funded recommendation system for children, built transparently and optimised openly for declared educational and wellbeing goals, offered as a genuine alternative to commercial feeds. [SPECULATIVE].

**Problem it solves.** Every recommender a child meets is commercial; a public-service option offers a different incentive structure entirely.

**Technical feasibility.** Low. Buildable but expensive and politically demanding to sustain.

**Potential risks.** Public systems can also be captured or stagnate; funding is fragile.

**Educational value.** High.

---

### 181. Data Minimisation by Default

**How it would work.** Child-facing recommenders are required to collect the least data needed for a decent feed, with profiling off unless specifically justified, making restraint the legal default. [INFERENCE]; data minimisation is [ESTABLISHED] in GDPR and the AADC.

**Problem it solves.** Maximal data collection is the norm; minimisation flips the default toward the child.

**Technical feasibility.** Medium. Less-data recommenders are buildable, with some quality cost.

**Potential risks.** Quality trade-off used as an excuse to over-collect; enforcement is hard.

**Educational value.** Medium.

---

### 182. The Right to a Non-Personalised Feed

**How it would work.** Every child-facing service must offer, prominently and permanently, a fully non-personalised chronological or curated option, so personalisation is always escapable. [INFERENCE]; the [ESTABLISHED] DSA already requires a non-profiling option from very large platforms.

**Problem it solves.** Children are trapped inside personalisation with no exit; a guaranteed plain feed restores choice.

**Technical feasibility.** High. The non-personalised feed is the easy part; making it prominent is the fight.

**Potential risks.** Buried or degraded to discourage use; needs prominence rules.

**Educational value.** High.

---

### 183. Recommender Incident Reporting

**How it would work.** When a recommender is found to have systematically harmed children (amplifying self-harm content, say), the platform must report it to a register, like aviation incident reporting, so the field learns from failures. [SPECULATIVE].

**Problem it solves.** Recommender harms are hidden and repeated; a register turns failures into shared learning.

**Technical feasibility.** Medium.

**Potential risks.** Under-reporting; defining a reportable incident is contested.

**Educational value.** Medium.

---

### 184. Algorithmic Sandboxes for Regulators

**How it would work.** Regulators get a safe testing environment to probe a child-facing recommender's behaviour under controlled conditions before and after deployment, without disrupting real children. [SPECULATIVE].

**Problem it solves.** Regulators currently judge recommenders from the outside; a sandbox lets them test from within.

**Technical feasibility.** Low. Faithful sandboxes of production systems are hard to build.

**Potential risks.** Sandbox behaviour may not match production; resource-intensive.

**Educational value.** Low.

---

### 185. Sunset Clauses on Profiles

**How it would work.** A child's accumulated recommendation profile automatically expires and must be rebuilt periodically unless actively retained, so no permanent dossier follows a child from age seven into adulthood. [SPECULATIVE].

**Problem it solves.** Profiles persist indefinitely, fossilising a child's earliest, least considered behaviour into a lasting record.

**Technical feasibility.** Medium. Timed profile expiry is feasible with some quality cost.

**Potential risks.** Frequent rebuilds degrade feed quality; defining the right interval is hard.

**Educational value.** Medium.
