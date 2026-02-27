# 7drl-2026

This is my entry for
[7DRL Challenge 2026](https://itch.io/jam/7drl-challenge-2026). It is my first
time participating in 7DRL although I've known about the event for a long time.

## Goals

Because this is my first time participating, my intention is to put together a
fairly minimal, vanilla Rogue-like. I'm using TypeScript + HTML canvas so that
the result will be easily playable in a browser without users needing to install
anything or run untrusted binary executables.

## Dev Setup

For first-time setup, run `npm install` and `npm run build`.

In a new shell, run `npm run dev` to start esbuild in watch mode. Alternatively,
use `npm run build` every time you want to build your changes.

In another shell run `npm run serve` to start the HTTP server.

If you edit files in `public/` then you'll need `npm run build` again to re-copy
them to `build/`.

## Statement on Use of AI

I am using VS Code with Copilot, which includes the use of LLM generated code to
speed up development. I do not consider this "vibe coding" since I am directing
Copilot to make small, incremental changes which I then manually correct to end
up with code similar to what I would have written myself.

I will NOT be using AI generated code for any complex maze generation,
pathfinding, or other algorithms used in this project. My goal is to avoid the
use of heavy algorithmic stuff altogether, and instead rely on simple rules.

I will NOT be using AI generated art assets. Any sprites, audio, etc. that I
include will be created by myself or another human with proper credit given.
