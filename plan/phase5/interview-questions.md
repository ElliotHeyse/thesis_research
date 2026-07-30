# Expert interview question bank

**Scope.** These questions serve the *second half* of the research question — "what are the implications for the role of the developer and the IT organization?" — not general opinions about AI in development. Every question is anchored either to a finding from the R0 data or to a specific implication about how developers and organizations should adopt (or resist) AI-assisted migration.

**Format.** Semi-structured. Pick 8–12 per interview based on the interviewee's role and where the conversation goes; don't try to cover all of them in one sitting. A cluster is a coherent block; you can drop a whole cluster if it doesn't fit the interviewee's context.

**A note on framing.** Where a question confronts the interviewee with your actual R0 findings, quote the finding as observed, not as claim — "in my six migrations, X happened" rather than "AI does X." Leave room for them to say your experience isn't representative; that pushback is itself data.

---

## Cluster A — Adoption reality in the interviewee's context

*Purpose: ground the interview in what this person actually deals with, before your findings enter the room. Good opening cluster.*

1. Where does legacy modernization sit on your organization's current priority list? Is it a background activity, a project with dedicated headcount, or something you keep meaning to do?
2. Has AI-assisted development changed how your organization thinks about legacy modernization specifically — has it made previously "too expensive" migrations look feasible, or is that framing overstated?
3. Which AI coding tools has your team actually adopted (as opposed to trialled)? What made the difference between the two?
4. Are there codebases or systems in your organization where AI assistance is explicitly *not* used, or forbidden? What's the logic there?

## Cluster B — Confronting the security finding

*Anchor: R0 SonarQube §5.1 — hard-coded database credentials appeared in three of six cells, and the pattern did not cleanly track methodology. It's a semi-stochastic failure the methodologies did not reliably suppress.*

5. In my six R0 migrations, hard-coded database credentials appeared in three cells regardless of how much planning preceded the migration. In your experience, are default-handling failures like this something teams can reliably prompt or plan away, or is this a category that always needs a separate guard (review, tooling, policy)?
6. If a team told you "we used AI to migrate a service, we prompted carefully, and it looks clean" — what would you still want to check before it went to production? What check is *not optional* for you?
7. Do you think organizations are currently trusting AI-generated code too much, too little, or approximately right? What signal are they using to decide?
8. How does secret-handling in AI-generated code get caught in your workflow today — by tooling, review, both, or is it a known gap?

## Cluster C — Confronting the model-familiarity finding

*Anchor: R0 SonarQube §5.4 — the Blazor migrations produced near-identical static-analysis results across all three methodologies. Methodology variation did essentially nothing on that stack, while it produced (weak) signal on Next.js. The plan flags this as the "model familiarity" confound.*

9. In my data, the methodology I used mattered on the Next.js stack but barely mattered on the Blazor stack. My reading is that for less-mainstream frameworks, prompting variation has less to work with. Does that match your intuition — or does it read differently to you?
10. If your organization is on a less-mainstream stack (older .NET, Delphi, COBOL, in-house DSLs), does that change how you'd approach AI-assisted work — more human involvement, different tooling, or something else?
11. Have you seen a stack where AI assistance is genuinely worse than working without it? What made it worse?
12. When AI output is uniformly mediocre across a stack, is that a signal to invest more in prompting/structuring, or a signal to accept AI as a lower-value tool there and staff differently?

## Cluster D — The developer's role: from writer to reviewer, or something else

*Anchor: your research question's second half. The plan (§3, planning-authority ladder) frames methodology as varying where the developer sits — reactive fixer, autonomous-plan approver, directed-plan architect. This cluster asks what a good developer looks like under each stance.*

13. If more of the code your team writes originates from an AI agent, what does "senior developer" mean in five years? What are they doing that a mid-level isn't?
14. Reviewing AI-generated code is different from reviewing a colleague's PR. What makes it different? Is your team good at it?
15. My design distinguishes three modes: no planning (agent just writes), autonomous planning (agent plans then writes), and directed planning (developer specifies how the agent should plan). Which of those best describes how your team actually operates? Why?
16. Is "planning what the agent should do" a skill you hire for, train for, or assume?
17. Does AI assistance make junior developers more productive, or does it make it harder for them to develop the judgment they need to catch AI mistakes? Is this something you've observed directly?

## Cluster E — Migration-specific: what AI can and can't be trusted with

*Anchor: your primary dimension (completeness — what AI can migrate without human intervention). The R0 data suggests every cell contains at least one runtime-risk issue and stack-level defaults get reproduced regardless of methodology.*

18. In your experience or judgment, what kinds of legacy code translate well to AI-assisted migration, and what kinds don't?
19. Migrations touch business logic, framework conventions, security defaults, and infrastructure wiring in one job. Are AI tools uniformly bad at all of these, uniformly acceptable, or is there a specific category that's much weaker or stronger than the others?
20. If a team gave you a two-week window and one AI-fluent engineer to migrate a small legacy app, what would you consider a *successful outcome*? What outcome would make you say "the AI didn't buy you anything here"?
21. The migrations I generated all "run" and superficially look complete, but static analysis found real runtime risks in every one. What does that suggest about the risk of a migrated system reaching production without exhaustive testing?

## Cluster F — Organizational implications

*Anchor: your valorization deliverable — a decision framework for IT professionals considering AI-assisted migration.*

22. If someone asked you tomorrow "should we use AI to migrate this system?" — what three things would you want to know before answering?
23. Where does responsibility for AI-generated code sit in your organization — with the prompt-writer, the reviewer, the team lead, the vendor of the AI tool? Is that clear, or contested?
24. What does a *bad* organizational adoption of AI coding tools look like? Have you seen one?
25. If AI-assisted migration becomes cheap and fast enough to try on any legacy system, does that change what "technical debt" means to your organization? Do you treat un-migrated systems as more urgent, or less?
26. Would you rather have an AI-migrated system with full test coverage or a hand-migrated system with less coverage? Why?

## Cluster G — Closing / forward-looking (short cluster, use one)

*Pick one to close on. Good final questions leave the interviewee with the last word on something meaningful.*

27. If you were building a checklist for "before we let AI migrate one of our systems," what's on it that you don't think most teams have?
28. What's a piece of advice you'd give someone about to do their first AI-assisted migration — that they wouldn't hear from the AI vendors?
29. Where do you think this is going in the next two or three years — will "AI-assisted migration" still be a distinct category, or will it just be "migration"?

---

## Question-selection guide (per interviewee role)

Rough mapping so you can pick faster on the day. Not prescriptive — follow the conversation.

- **Individual developer:** A (open), D (their role), E (technical judgment), G (close). Skip or lightly touch F.
- **Tech lead:** A, B or C (their choice of finding), D, E, F. Close on G.
- **IT manager / architect:** A, B, C, F (heaviest), G. Lighter on E's technical specifics.

## Things to do regardless of who you're talking to

- Bring **one concrete example from your data** to every interview — pick the finding that fits the interviewee's role. Don't summarize all six cells; pick one striking thing and use it as your anchor.
- Ask permission to record and take notes; get consent explicitly if the interview will feature in the thesis.
- End every interview with: *"is there anything I should have asked but didn't?"* — often produces your best material.
- Note the interviewee's role and years of experience *before* you interpret their answers; a 3-year dev and a 15-year architect answering question 13 are different data points, not conflicting ones.
