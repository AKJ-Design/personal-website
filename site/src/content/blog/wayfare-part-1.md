---
title: 'From "find me flights" to a travel app — Part 1'
date: 2026-08-15
eyebrow: 'Case study — Wayfare · Part 1 of 2'
excerpt: 'The very first thing I ever asked Claude to do was find me flights to Bangkok. Two months later, that throwaway prompt has somehow become a native iOS travel app.'
tags: [ai, cloudflare, travel]
next: 'Part 2 — chat to native iOS app · coming soon'
---

The very first thing I ever asked Claude to do was find me flights to Bangkok. Not "help me build an app" — just cheap flights in the next two months, with my usual list of picky requirements. Some back-and-forth later, I had flights that ticked every box. Boom, done.

<details class="prompt">
<summary>tap to see the actual prompt</summary>

```
I want you to search the internet for flight options.
Find return flight options from either Brisbane, Sydney or Melbourne to Bangkok, departing between now and end of August. Preference for Brisbane departure (home). Flights must depart on a wednesday, thursday or friday from australia.
Trip duration is 5 days, Ideal is thursday to tuesday.
flights must not arrive into bangkok later than 9pm.
No more than one stop, unless the stop is within australia.
Pricing below $1,800 return.
Preference is for Singapore airlines, to take advantage of related frequent flyer status, but willing to forgo this for a good flight deal on a decent carrier.

Ask questions first to clarify the search before starting.
```

<p class="prompt-thumb"><a href="/images/wayfare/flight-options.jpg" title="tap to enlarge"><img src="/images/wayfare/flight-options.jpg" alt="Claude's flight options readout: Singapore Airlines via Singapore recommended at around AUD 920–1,100 return, a direct Jetstar alternative, and a grid of eligible Thursday departure dates" width="1000" height="1445" loading="lazy" /></a></p>

</details>

Two months later, that throwaway prompt has somehow become a native iOS travel app with its own database, its own API, and a live connection to Claude.

This is Part 1 of that story: how I went from "find me things to do on my trip" to an interactive visual itinerary I could use on the go — and the two things it taught me about working with AI tools. First, they're very good at generating options to solve a problem, but you have to be clear that options are what you're asking for, or you'll get the quickest answer instead. And second, the richness, depth and quality of what you get out depends on, well, the richness, depth and quality of what you put in.

## Planning a trip in chat

Next came the trip planning; I had my dates, flights and hotel sorted. Now to fill in the gaps. I gave Claude the context and the ask — I was planning a trip, here's what's already locked in and what I want help with.

One valuable thing I've found with Claude: it asks clarifying questions rather than jumping to an answer, and the results are better for it.

After discussing some basics and getting settled on key topics across gym, eating out, relaxation days, spas, exploring, nightlife etc., we had a solid itinerary locked in, with rich detail on each activity, pricing and 'good to know' facts.

Ok, that's done right? By this stage I had used Claude to search across forums, blog posts, TripAdvisor and more, across a range of trip categories, and had landed on a curated and detailed itinerary… So, tick that off the list?

<figure class="replay">
<div class="rp">
<div class="rp-cam">
<div class="rp-col">
<div class="rp-blk rp-b0"><div class="rp-line rp-l0">Perfect — that's a really solid Bangkok week. Train hard,</div><div class="rp-line rp-l1">eat well, one big Muay Thai night, a couple of clubs, and</div><div class="rp-line rp-l2">some exploring mixed in. Very doable.<span class="rp-cur" aria-hidden="true"><i></i></span></div></div>
<div class="rp-blk rp-b1"><div class="rp-line rp-l0">Let me pull together the best options for each piece.<span class="rp-cur" aria-hidden="true"><i></i></span></div></div>
<div class="rp-blk rp-b2"><span class="rp-pill"><span class="rp-dot"></span>Searched the web<span class="rp-shimmer"></span></span></div>
<div class="rp-blk rp-b3"><div class="rp-line rp-l0">Great — here's a proper Bangkok week framework built</div><div class="rp-line rp-l1">around your priorities.<span class="rp-cur" aria-hidden="true"><i></i></span></div></div>
<div class="rp-blk rp-b4"></div>
<div class="rp-blk rp-b5">Your Bangkok Week — July 2026</div>
<div class="rp-blk rp-b6"><span class="rp-hdot"></span>Muay Thai Night</div>
<div class="rp-blk rp-b7"><div class="rp-line rp-l0"><strong>Rajadamnern Stadium</strong> is your pick.</div></div>
<div class="rp-blk rp-b8"><span class="rp-hdot"></span>Street Food &amp; Night Markets</div>
<div class="rp-blk rp-b9"><div class="rp-line rp-l0"><strong>SW1 Market</strong> — right at the entrance of Sukhumvit Soi 12,</div><div class="rp-line rp-l1">with over 120 stalls of authentic Thai street food,</div><div class="rp-line rp-l2">vintage fashion, and local drinks. Your go-to for a</div><div class="rp-line rp-l3">casual evening.<span class="rp-chip">Gurulist</span></div></div>
<div class="rp-blk rp-b10"><div class="rp-line rp-l0"><strong>Jodd Fairs Ratchada</strong> — the big one. One MRT stop away,</div><div class="rp-line rp-l1">massive, packed with locals, and widely considered the</div><div class="rp-line rp-l2">best street food night market in Bangkok right now. Go</div><div class="rp-line rp-l3">hungry.</div></div>
<div class="rp-blk rp-b11"><div class="rp-line rp-l0"><strong>Yaowarat (Chinatown)</strong> — for a proper evening. One of the</div><div class="rp-line rp-l1">world's great street food strips. Grab the MRT to Hua</div><div class="rp-line rp-l2">Lamphong, and eat everything.</div></div>
<div class="rp-blk rp-b12"><span class="rp-hdot"></span>Exploring (lighter days / mornings)</div>
<div class="rp-blk rp-b13"><div class="rp-line rp-l0">Since you've done some temples already — a few things</div><div class="rp-line rp-l1">worth considering:</div></div>
<div class="rp-blk rp-b14"><div class="rp-line rp-l0"><span class="rp-bdot" aria-hidden="true"></span><strong>Chatuchak Weekend Market</strong> (if your dates include a</div><div class="rp-line rp-l1">Sat/Sun) — enormous, fun, great for a browse and cheap</div><div class="rp-line rp-l2">Thai food</div></div>
<div class="rp-blk rp-b15"><div class="rp-line rp-l0"><span class="rp-bdot" aria-hidden="true"></span><strong>Lumpini Park</strong> morning walk — popular with locals, a good</div><div class="rp-line rp-l1">wind-down from a training session</div></div>
<div class="rp-blk rp-b16"></div>
<div class="rp-blk rp-b17"><div class="rp-line rp-l0">Want me to pull this into an actual day-by-day itinerary</div><div class="rp-line rp-l1">for the week of 23 July? I can map it around gym sessions,</div><div class="rp-line rp-l2">the Muay Thai fight schedule, and club nights.<span class="rp-cur" aria-hidden="true"><i></i></span></div></div>
</div>
</div>
<div class="rp-fade-top" aria-hidden="true"></div>
<div class="rp-fade-bot" aria-hidden="true"></div>
<div class="rp-hdr">Claude<span class="rp-hdr-rule"></span></div>
<div class="rp-thread">Bangkok week — planning thread</div>
</div>
<figcaption>Replay — the itinerary taking shape in chat</figcaption>
</figure>

Well in past years using AI, that is probably where I would have left it. My last trip for example (four countries, five cities, a scuba diving certification and a trip to the North Korean border), I transferred my plan into an Excel sheet so I could keep track of everything and off I went.

Now have you ever tried to use an Excel sheet on your phone when on holiday? Sure, it was fine for remembering which hotels I had booked and what was and wasn't prepaid. But as an interactive tool mid-trip? Not a chance.

## Ask for options, not just an answer

So this time I gave Claude that challenge: Build a visual itinerary that I can keep updating as I do more planning and use on the go. What are some options?

It presented me with a few options and the readout on each: HTML artifact, Excel spreadsheet, Word doc and Markdown file. Its recommendation was for HTML artifact because in its words, "visually clean, can include a day-tracker, color tags per category, and is easy to glance at on your phone. I can keep modifying it in place as you firm up bookings (flights, Muay Thai night, club nights, etc.)."

<figure class="shot">
  <a href="/images/wayfare/options-readout.jpg" title="tap to enlarge"><img src="/images/wayfare/options-readout.jpg" alt="Claude's options readout comparing an HTML artifact, an Excel spreadsheet, a Word doc and a Markdown file — recommending the HTML artifact for a visual, phone-friendly itinerary" width="1200" height="809" loading="lazy" /></a>
  <figcaption>Screenshot — options readout in chat</figcaption>
</figure>

## iPhones hate HTML

<figure class="shot">
  <a href="/images/wayfare/html-itinerary.jpg" title="tap to enlarge"><img src="/images/wayfare/html-itinerary.jpg" alt="Claude delivering the Bangkok itinerary as an HTML file — day pills to flip between the eight days, colour-tagged categories, and a note field on every card" width="1200" height="823" loading="lazy" /></a>
  <figcaption>Screenshot — the itinerary, delivered as an HTML file</figcaption>
</figure>

There I had it, an interactive, visually appealing, mobile friendly and usable itinerary that presented as a webpage. It had colour coded activities, tabs for each day, a notes section to type in booking references or other info and important facts like walking distance from my hotel and what to wear (some places had a dress code). But there was one annoying issue: iPhones don't like HTML files. Nothing built into iOS would open my itinerary — Safari on my Mac rendered it happily, Safari on my iPhone wouldn't touch it. I ended up installing Microsoft Edge, one of the few iPhone browsers that would open the file at all.

It worked, but it was clunky. Every time Claude and I updated the plan, out came a fresh HTML file, and off I went to open it in Edge again. The root cause: iOS won't render a bare HTML file handed to it directly — but serve the exact same file over HTTPS and it's perfectly happy. In other words: make my static file a website, and the problem disappears.

And that's what I did. I had Claude compare free hosting options — and how much effort each would take to set up — and we landed on Cloudflare Pages. Free, reachable from any device like any other website, and I could add security (an email one-time passcode) so only I could see my itinerary.

Now my itinerary lived at its own private URL. I even used Safari's "Add to Home Screen", which made it look and behave like an app — the technical name is a Progressive Web App, or PWA. One downside remained: every time Claude generated an update, I had to drop the new file into Cloudflare myself. A sixty-second job. Not seamless, but low effort.

<figure class="shot portrait">
  <a href="/images/wayfare/pwa-home-screen.jpg" title="tap to enlarge"><img src="/images/wayfare/pwa-home-screen.jpg" alt="An iPhone Home Screen with the itinerary saved as an app named Travel" width="800" height="1738" loading="lazy" /></a>
  <figcaption>Screenshot — the PWA on the Home Screen</figcaption>
</figure>

## An idea, a goal and a plan

But I kept thinking… What if I could close this manual loop? Would it be possible to use Claude to chat and plan new activities for my itinerary, anywhere, anytime? Then have those changes automatically appear in my itinerary? No manual files, no uploading, no friction and of course, no cost.

Enter the world of APIs, JavaScript, SQL databases, OAuth and MCPs… Does that sound foreign? Don't worry — it did to me too! But it's far more approachable than you might think.

By this point I'd already been experimenting with Claude Code, which had moved me beyond chatting into actually writing, deploying and monitoring real code. I'd used it to build my first app experiment, a basic iOS Sudoku game (that story's coming in another post). You can still talk to it in plain natural language — what changes is what it can produce.

Back to my itinerary and I already had some idea that having live links and data in sync would mean APIs and some sort of database, but that was the extent of my knowledge. It sounded hard, but I thought honestly… I'm paying for a superior AI subscription, so why not just find out what would be involved, because who knows.

That was the challenge I gave. But here's the key — and it's back to what I mentioned at the start. If you want options and not just the quickest answer, say so. And be as detailed and clear about your problem and your goal as you can. During one of the itinerary chat sessions, I mentioned my annoyance with the static HTML files. The response? Essentially, "well, stop exporting it and just view it within the chat here. That way it's always live". Ok, technically true, but didn't meet my actual goal. Being clear on my problems, use case and goals was what unlocked an actual solution.

I used Claude Code to embark on this next phase. First off in Claude Code I set it on 'Plan' mode. This gives it clear guidance that it isn't building anything yet, it is creating a plan only:

<pre><span class="prompt-label">The actual prompt</span>referencing my existing travel itinerary project we have built together, I want options to make this feel like a real production app experience. I want to be able to use Claude chat to research, get activity ideas and add them to the itinerary. Then have those changes instantly appear in the itinerary without any work from me. The goal is that I can use Claude chat on the go, from any device, to edit the itinerary. Then it just appears and I can use the itinerary web app during my travels, and it is all in sync. I want to be able to use this flow to add new trips and have those appear in the web app too. And I should be able to make notes in the web app, move activities around, and it all syncs, so next time I use Claude chat to make a change, it also knows the latest. Surface different options to facilitate this, then create a project plan for design and implementation. Clarify any unknowns before generating the plan.</pre>

The solution? Since I was already hosting the static HTML on Cloudflare, continuing to use Cloudflare was a sensible choice. It offered the range of tools needed to facilitate this, all available on the free tier plan, since this was just for me to use.

## Building the loop

The plan was set. We would utilise Cloudflare Workers + D1, a powerful combination that provides JavaScript computing and a native, lightweight SQL database as the 'backend'. A secure API connection to link the database information to the web app (what appears on my screen). A remote MCP server, built on Cloudflare's MCP template, providing the tools for Claude chat to read and edit the itinerary in real time. Proper OAuth, to ensure all these connections were secret and secure, only working for me and the tools I specifically granted access for.

<figure class="diagram">
  <img src="/images/wayfare-loop.svg" alt="Diagram of the loop: Claude in chat talks to the MCP server over OAuth, the MCP server reads and writes the Workers + D1 backend, and the same backend serves the itinerary app on the Home Screen — so a change made in chat appears in the app seconds later" width="660" height="190" loading="lazy" />
  <figcaption>The loop — Claude ↔ MCP ↔ Workers + D1 ↔ the app</figcaption>
</figure>

I also wanted to make the design my own, changing the look, feel and usability of some elements, adding elements such as map pins for Google Maps links on the activities and a live trip countdown on the Home Screen. I utilised Claude Design to mockup the key screens.

Claude Code built a detailed project build and implementation plan and we got to work. This wasn't just a set and forget activity though. Particularly because it involved secret API keys and a passphrase for the MCP server, some actions had to be done by me. Take note of this if you ever embark on something similar — always be in the driving seat for any logins, account creation, passwords, secret keys etc. AI chat models will generally enforce that you do those actions, but all of those secrets should stay out of any chat and only ever be touched by you, otherwise you put your security at risk.

During the build, Claude Code was also good at catching errors. It would test what it had just built or deployed, and if it didn't work it would stop and triage, rather than waiting until the end and finding out that something from an earlier phase was broken.

## It works!

There I had it… my own interactive travel itinerary app, sitting as an 'app' (web app) on my Home Screen. Designed with exactly the functionality I wanted to use.

If I had a new idea — say, a walking food tour for day 3 of my trip — I could be anywhere and use Claude chat to research options. It would scan TripAdvisor reviews, read blog posts and search Google to present a few ideas, with details like how far it was from the hotel and the price. I'd decide or amend and then it would automatically add it to my itinerary. And it was there, seconds later, in my itinerary app, with no further effort from me. It was simple, fun and legitimately useful — both while planning and mid-trip.

<figure class="shot portrait">
  <a href="/images/wayfare/finished-app.jpg" title="tap to enlarge"><img src="/images/wayfare/finished-app.jpg" alt="The itinerary app's Today view mid-trip — hotel and flight details pixelated at source" width="640" height="800" loading="lazy" /></a>
  <figcaption>Screenshot — the finished itinerary app</figcaption>
</figure>

But then I started to think, what if I made this into a native iOS app? Could I then build custom widgets and use Live Activities? All from this little idea of an interactive itinerary…? Well the answer is yes, and the easier half of the story when you have a clear goal.

And that is Part 2, how I went from planning a trip to building a native iOS travel app called 'Wayfare'.
