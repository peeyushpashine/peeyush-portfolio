---
title: "Where does an engineer add value now?"
standfirst: "Agents got good fast. The benchmarks measure a contractor, and most of the argument is about a teammate."
date: "2026-08-20"
originallyAt: "X"
originallyUrl: "https://x.com/peeyushpashine/status/2091107292838269218"
---

"Do I add value to my work anymore?"

That was the first dilemma I ran into when agents and models started working in what looked like a utopian way, about eight months ago. What made it land harder was where it arrived from — a decade of being an ML engineer and a data scientist. Every skill I thought was niche, every thing I had learnt hands-on shipping projects across companies, started to feel easily replicated and automated. Software engineering, DevOps, ML engineering, even data science.

But this didn't start eight months ago for me.

It started when Cursor arrived and Claude Sonnet 3.5 was the model. Anyone who tinkered with that setup in the second half of 2024 had the same reaction: this is amazing. The first thing I did was take a major feature I had built a few years earlier — roughly three months of active development — and try to rebuild it. It took about a week.

I gave that result the benefit of the doubt at the time. I already knew the problem. I already knew what the architecture should look like, because I had been the one who arrived at it the first time round. That is not a small caveat, and I'll come back to it, because it turns out to be the whole argument.

## The tricks that stopped mattering

The early coding chats needed a lot of steering. Prompt hacks, custom memory management, rules files, context babysitting. It genuinely felt like AI-assisted coding rather than anything autonomous, and I don't think anyone was seriously using the word "agent" then. There were no thinking models. There was no harness.

Most of that scaffolding has since evaporated. The Claude 4 generation, then Sonnet 4.5, arrived with the surrounding ecosystem we now call harnessing, and Claude Code and Codex took over a large part of what people mean by autonomous software development. My memory bank repo, the rules, the elaborate prompt structures — a lot of it is dead weight now. The models got better and the scaffolding stopped earning its place.

I want to concede that fully before I argue anything, because I'm not interested in relitigating 2024. The tools are extraordinary and they are still getting better on a curve that shows no sign of bending.

So: where does the value go?

## We got faster at creating entropy

Here is what I actually observe.

We are generating an enormous amount of code and automated tests, and hardly any of it is being read by a human. Half-baked features ship as PoCs that improve optics rather than address anything an end user asked for. Who asked for a transformed feature surface? Who asked to chat with an agent bolted onto every workflow? There's AI slop documentation everywhere. Nobody is reading design specs, and nobody is discussing them properly.

None of these problems are new. What's new is the speed. Entropy is being generated at a rate that leaves no room for reflection — a checkbox gets ticked and everyone moves on.

So has AI changed the reality of software development, or mostly the day-to-day of it?

The engineering design complexity is unchanged. The cross-stack integration problems are unchanged. What has changed is that we no longer wait — for the implementation, the hand-written code, the Stack Overflow search, the opinion of someone who has been in the system for years. In my first job I stood next to a senior engineer's desk for two days waiting to get a code review. That wait is gone. Whatever the size of the codebase, you can now sit with it and understand it in an afternoon.

That's a real gain. It's also what I'd call the speed of creating entropy.

Because the thing about generating more, faster, is that the resulting loss function is not cheap to minimise. Generation capacity is scaling exponentially. Review capacity, comprehension, and shared understanding are flat — the same number of people, the same hours in a day. Meanwhile the number of interfaces between the things we're generating grows quadratically, and the number of people who actually understand any given pair of them is going down, not up.

That gap is not a bug in the tooling. It's where the work moved.

![Where the agent breaks: autonomous success rate against coordination surface](/diagrams/where-it-breaks.png)

## The benchmark measures a contractor

I want to be honest about the strongest counterargument, because it's a good one and the data is real.

METR has been measuring what they call the time horizon of frontier agents: the length of task, measured by how long a human expert takes, that a model can complete autonomously. That number has been doubling roughly every seven months since 2019 — from around nine seconds in 2020 to about fourteen and a half hours by early 2026. The trend hasn't plateaued. If anything it's accelerated.

Fourteen hours of autonomous expert work sounds like it settles the argument. It doesn't, for two reasons that sit inside METR's own methodology.

The first is the reliability threshold. That headline number is the 50% success rate — METR uses it because it's the level you can estimate most robustly, and they say plainly that real work often needs 80%, 99%, or better. An agent that completes a fourteen-hour task half the time has not completed a fourteen-hour task. It has created a fourteen-hour verification problem.

The second is more interesting, and it's the reason I'm writing this. METR designs its tasks to be self-contained and well-specified, deliberately, so they're fair to both the agent and the human baseline. They say so directly in their own FAQ: most real-world work draws on prior context, tacit knowledge, and familiarity with an existing codebase, and their two-hour tasks should be read as what someone with *no prior context* — a new hire, or a freelance contractor — could complete in two hours. Not what someone already inside the system could do.

The benchmark measures a contractor. Most of the argument about engineering value is about a teammate.

There's a related finding worth sitting with: long-context agents that succeed 40–50% of the time on short-horizon tasks drop below 10% when the identical task is embedded in a longer interaction history — even when all the relevant information is technically still inside the context window. Presence in context is not the same as usable context. A million tokens is not a million tokens of working memory.

## Everyone is building a perfect castle

In big tech it was never one microservice or one repo. There are hundreds of services on different stacks talking to each other, with specific teams holding the context for each one. Even where documentation is genuinely rich, an enormous amount of what matters lives in the handshaking — who owns what, why that decision was made three years ago, what broke last time someone tried this.

Everyone is now building their own castle, faster than before. Each castle is fine. The problem is what happens when they have to talk to each other. The architectural complexity between them hasn't reduced at all, and the time saved on generation gets spent on triage — resolving integration issues, understanding an unfamiliar codebase, hunting bugs across a boundary nobody owns.

Multi-agent orchestration handles simple cases. I build these systems; I'm not speculating. For genuinely complex software I don't think we have a way around this yet, and I don't think "more agents" is that way, because coordination cost grows faster than the number of agents you add.

Here's the pattern I keep seeing in my own work. I regularly run the strongest available models with a good harness over my own ML code, because I'm sincerely interested in the gaps — I want to know what I got wrong. Every single time, the suggested improvements are so utopian that all I can do is smile.

The problem is never the quality of the transformation the agent proposes. The problem is everything it can't see. Platform limitations. Access issues. Privacy and principal-auth constraints. The way an algorithm is written is often not a reflection of the developer's imagination — it's a reflection of the reality of an enterprise SaaS company. Who the users are, where they are in their journey, what they actually need right now versus what would be elegant. A utopian design doesn't extract business value from any of that.

We're talking about many ecosystems wired to each other in ways that were negotiated, not designed. No long-horizon agent is built to hold that, and I don't think it's a context-window problem — I think the tacit context runs out well before the context window does. Maybe one day. Not right now.

And this is where I found my own answer to the question I opened with.

What am I actually good at? Zero-to-one features. Onboarding onto an ML platform, understanding what it genuinely offers versus what the docs claim, and turning that into a feature ask. Becoming the pilot team for a capability that doesn't exist yet, which means months of collaboration with people who have their own roadmaps. Once that capability lands, every other team consumes it frictionlessly — but the first time through is almost entirely stakeholder management and nuance. That's true of any enterprise. I don't think an agent takes that over soon.

![Same prompt, different answer: conditioning versus sampling](/diagrams/same-prompt.png)

## Fewer iterations is not the win it looks like

A moderately complex task, or a spike that would have taken a week with proper architecture and planning, can now be done in a few hours. But watch what actually happens in that compression.

If a task would have taken you twenty or twenty-five iterations of thinking, and with a strong model and a good harness it takes one or two — the iterations didn't disappear. The thinking did. It moved. The code works, and you don't know why it's shaped the way it is. The architecture is what the model decided, and you weren't in the room.

Andrej Karpathy — who is more skeptical of agent autonomy than almost anyone with his track record, and who has argued for a "decade of agents" rather than a year of them — puts it better than I can: you can outsource thinking, but not understanding.

He's not saying don't use the tools. He ran a swarm of agents continuously for two days, 700 experiments, and got twenty real optimisations out of it. But note the shape of that: a narrow domain, a cheap and trustworthy verifier, and a human-defined objective. His framing is an autonomy slider — you earn the right to slide toward autonomy by making verification cheap first.

That's the difference between a fresher getting fast dopamine from working code and someone who has built these systems for twelve years. The model returns an answer conditioned on the context it was given. Change the context and the answer changes — not because the model is unreliable, but because that's what conditioning means. And what most people forget is that the model also supplies a *perspective*. Unless that perspective gets challenged by a real one, you never get to the meat.

Anyone who has spent serious hours in these tools knows the exchange: "Oh, you're absolutely right, I should have checked that." There's no reflective capacity behind that sentence. Nothing evaluated whether the approach was the right one. What you extract from these tools is bounded by what you're capable of asking, and by whether you can tell a good answer from a plausible one.

## Access was never the problem

There's a version of the future where none of the coordination friction I've described matters. No teams, flat hierarchy, no management layers — because shared context is no longer scarce. Anybody can pull whatever information they need from a central place. The hierarchy existed to move information between layers; remove the scarcity and you remove the reason for the layers.

I don't buy it, and the reason has nothing to do with technology.

The access was never the problem. The intention was.

Even with everything laid out in front of them, what guarantees that people have the skill or the will to go and look? I've watched well-documented systems get rebuilt from scratch by someone who never opened the doc. That's not an information retrieval failure.

The hardest parts of engineering were never the code. They were the negotiation, the conflict, the alignment across people who each hold a fragment of the picture and disagree about what it means. You could argue there are roles designed for that. On paper, yes. In practice, in most places, it falls to whoever is closest to the problem — which is the engineer.

That's the part I'd bet on. Not because agents are weak; they aren't. But because what they're good at and what actually gates shipping software have never been the same thing.
