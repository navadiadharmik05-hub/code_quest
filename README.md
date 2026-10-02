```
 ██████╗ ██████╗ ██████╗ ███████╗ ██████╗ ██╗   ██╗███████╗███████╗████████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝
██║     ██║   ██║██║  ██║█████╗  ██║   ██║██║   ██║█████╗  ███████╗   ██║
██║     ██║   ██║██║  ██║██╔══╝  ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║
╚██████╗╚██████╔╝██████╔╝███████╗╚██████╔╝╚██████╔╝███████╗███████║   ██║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝
```

<div align="center">

**`CodeQuest // Archival Laboratory`**

*A retro-futurist interactive learning terminal for foundational computer science.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Overview

**CodeQuest** is a browser-based, gamified CS education platform built as a single-page application. Players progress through six interactive game modules arranged in a dependency-ordered DAG (Directed Acyclic Graph), each targeting a distinct foundational algorithm or data-structure concept. Clearing a node unlocks its successors — simulating prerequisite gating in a real curriculum.

The aesthetic is deliberately **archival terminal**: dark background (`#07080A`), amber/orange accent (`#DE5C34`), monospaced readouts, and procedurally synthesised Web Audio sound effects. There are no external audio files — every click, chime, and damage cue is generated in-browser via the Web Audio API.

Progress (cleared quests, XP totals, SFX preference) survives page reloads through **localStorage persistence** with no backend required.

---

## DAG Skill-Tree Topology

Nodes unlock sequentially according to the following dependency graph. Each game is a **gate** — you must clear it to proceed to its downstream modules.

```
                    ┌────────────────────┐
                    │  NODE 1 · Tier 1   │
                    │  Syntax Dungeon    │  ← always unlocked
                    └────────┬───────────┘
                             │ clear Gate 01 (+150 XP)
              ┌──────────────┴──────────────┐
              ▼                             ▼
  ┌───────────────────┐         ┌───────────────────┐
  │  NODE 2 · Tier 2  │         │  NODE 3 · Tier 3  │
  │  Execution Arena  │         │    Sort Arena      │
  └─────────┬─────────┘         └─────────┬──────────┘
            │ clear Gate 02 (+280 XP)      │ clear Gate 03 (+320 XP)
            ▼                             ▼
  ┌───────────────────┐         ┌───────────────────┐
  │  NODE 4 · Tier 4  │         │  NODE 5 · Tier 4  │
  │  Tower of Hanoi   │         │    BST Quest       │
  └─────────┬─────────┘         └─────────┬──────────┘
            │ clear BOTH Gate 04 (+450 XP) │
            │ AND Gate 05 (+500 XP)        │
            └──────────────┬───────────────┘
                           ▼
               ┌───────────────────────┐
               │    NODE 6 · Tier 5    │
               │  Stack & Queue Boss   │  ← Apex completion (+750 XP)
               └───────────────────────┘
```

**Lock rules** (from `src/hooks/useProgression.ts`):

| Node | Prerequisite |
|------|-------------|
| Node 1 — Syntax Dungeon | Always unlocked |
| Node 2 — Execution Arena | Node 1 cleared |
| Node 3 — Sort Arena | Node 1 cleared |
| Node 4 — Tower of Hanoi | Node 2 cleared |
| Node 5 — BST Quest | Node 3 cleared |
| Node 6 — Stack & Queue Boss | **Both** Node 4 AND Node 5 cleared |

---

## Game Modules

Six interactive modules live under `src/screens/games/`. Each has its own component, game state, hearts system, and XP reward:

| # | File | Game Name | CS Concept | Gate XP |
|---|------|-----------|-----------|---------|
| 01 | `SyntaxDungeonGame.tsx` | **Syntax Dungeon** | Lexical analysis, AST tokenisation, bracket matching, keyword sanitisation | +150 XP |
| 02 | `ExecutionArenaGame.tsx` | **Execution Arena** | Call stack simulation, stack frame push/pop, LIFO depth limits, frame unwinding | +280 XP |
| 03 | `SortArenaGame.tsx` | **Sort Arena** | Quicksort pivot selection, partition steps, pairwise inversion, boundary invariants | +320 XP |
| 04 | `HanoiGame.tsx` | **Tower of Hanoi** | Recursion, base cases, minimal-move proof (`2ⁿ − 1`), mathematical induction | +450 XP |
| 05 | `BstQuestGame.tsx` | **BST Quest** | Binary Search Tree insert/search, BST invariant (`L < root < R`), in-order traversal, AVL balance invariants | +500 XP |
| 06 | `StackQueueGame.tsx` | **Stack & Queue Boss** | LIFO stack vs FIFO queue semantics, ring buffer mechanics, O(1) push/pop, backpressure and overflow | +750 XP |

Each game exposes a uniform `onComplete(stars, xp)` / `onDamage()` callback interface consumed by `App.tsx`.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| UI Framework | **React 19** | Functional components, hooks throughout |
| Language | **TypeScript 7** | Strict typing; `tsconfig.json` enforces `noEmit` lint |
| Bundler | **Vite 8** | Dev server on port 3001; HMR toggled via `DISABLE_HMR` env var |
| Styling | **Tailwind CSS v4** | Vite plugin (`@tailwindcss/vite`); design-token naming convention (`surface-container-*`, `on-surface`, etc.) |
| Animation | **Motion** (`motion` v12) | Frame-rate-independent spring/tween transitions |
| Icons | **Lucide React** | SVG icon primitives |
| Sound | **Web Audio API** | Zero-dependency synth in `src/utils/audio.ts` — sine, triangle oscillators; no audio files |
| Persistence | **localStorage** | Keys: `cq_cleared_quests`, `cq_xp`, `cq_sfx_enabled` |
| AI (optional) | **@google/genai** | Gemini SDK available if `GEMINI_API_KEY` is set (not required for core gameplay) |

---

## Key File Paths

```
code_quest-main/
├── index.html                         # Vite entry point
├── vite.config.ts                     # Vite + Tailwind + React plugin config
├── package.json                       # Scripts and dependency manifest
├── src/
│   ├── main.tsx                       # React DOM root mount
│   ├── App.tsx                        # Root component — screen router + progression hub
│   ├── types.ts                       # Shared TypeScript types (PlayerState, ScreenType…)
│   ├── index.css                      # Global CSS / Tailwind base import
│   │
│   ├── hooks/
│   │   └── useProgression.ts          # localStorage hydration, XP, hearts, node-lock logic
│   │
│   ├── data/
│   │   └── constants.ts               # VIDEO_BRIEFINGS[] + ACCOLADES[] master data
│   │
│   ├── utils/
│   │   └── audio.ts                   # Web Audio API synth (tick, chime, error, success, accolade)
│   │
│   ├── components/
│   │   ├── TopNavbar.tsx              # Persistent top bar (XP, hearts, SFX toggle, nav tabs)
│   │   ├── Header.tsx                 # Page-level header block
│   │   ├── Footer.tsx                 # Footer bar
│   │   └── BriefingModal.tsx          # Pre-game video briefing overlay
│   │
│   └── screens/
│       ├── DashboardScreen.tsx        # Main quest roadmap — DAG node cards + briefing launch
│       ├── AccoladesScreen.tsx        # Trophy / badge gallery (gate + mastery accolades)
│       ├── IntelCodexScreen.tsx       # Video codex — concept library
│       ├── SkillTreeScreen.tsx        # DAG node inspector + quest launcher
│       ├── PracticeArenaScreen.tsx    # Open practice mode
│       ├── TrophyHallScreen.tsx       # Hall of records
│       └── games/
│           ├── GameTypes.ts           # Shared game prop types
│           ├── GameArenaScreen.tsx    # Game shell / wrapper
│           ├── SyntaxDungeonGame.tsx  # Game 01 — token stream lexer
│           ├── ExecutionArenaGame.tsx # Game 02 — call stack simulator
│           ├── SortArenaGame.tsx      # Game 03 — quicksort partitioner
│           ├── HanoiGame.tsx          # Game 04 — Tower of Hanoi
│           ├── BstQuestGame.tsx       # Game 05 — BST operations
│           └── StackQueueGame.tsx     # Game 06 — stack / queue boss fight
```

---

## Local Development

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set Gemini API key if you want AI features
cp .env.example .env.local
# then edit .env.local and add: GEMINI_API_KEY=your_key_here

# 3. Start the dev server (http://localhost:3001)
npm run dev

# 4. Production build
npm run build

# 5. Preview the production build locally
npm run preview

# 6. TypeScript type-check (no emit)
npm run lint
```

---

## Debug & Reset Commands

Run these in the **browser DevTools console** (`F12 → Console`) to reset progression state:

```js
// ── Reset ALL progress (Day-0 state) ──────────────────────────────────────
localStorage.removeItem('cq_cleared_quests');
localStorage.removeItem('cq_xp');
localStorage.removeItem('cq_sfx_enabled');
location.reload();

// ── Inspect current cleared quests ────────────────────────────────────────
JSON.parse(localStorage.getItem('cq_cleared_quests') || '[]');

// ── Inspect current XP ────────────────────────────────────────────────────
Number(localStorage.getItem('cq_xp'));

// ── Manually mark a quest as cleared (bypass gameplay) ────────────────────
// Replace 'syntax-dungeon' with any quest ID (see table above)
const cleared = JSON.parse(localStorage.getItem('cq_cleared_quests') || '[]');
cleared.push('syntax-dungeon');
localStorage.setItem('cq_cleared_quests', JSON.stringify(cleared));
location.reload();

// ── Force-unlock all nodes (set all 6 quests cleared) ─────────────────────
const ALL = ['syntax-dungeon','execution-arena','sort-arena','tower-of-hanoi','bst-quest','stack-queue-boss'];
localStorage.setItem('cq_cleared_quests', JSON.stringify(ALL));
localStorage.setItem('cq_xp', '2450');
location.reload();

// ── Disable SFX ───────────────────────────────────────────────────────────
localStorage.setItem('cq_sfx_enabled', 'false');
location.reload();
```

---

## Accolade System

Completing each gate awards a **Gate Milestone** accolade; flawless clears award a **Mastery · 3-Star** badge. The apex trophy is **Void Sentinel** (Stack & Queue Boss, zero buffer slips, no life loss).

| Accolade | Type | Requirement | XP |
|----------|------|-------------|-----|
| Token Splicer | Gate 01 | Clear Syntax Dungeon | +150 |
| Trace Walker | Gate 02 | Clear Execution Arena | +280 |
| Partition Knight | Gate 03 | Clear Sort Arena | +320 |
| Recursion Artisan | Gate 04 | Clear Tower of Hanoi | +450 |
| Tree Whisperer | Gate 05 | Clear BST Quest | +500 |
| Apex Defragmenter | Gate 06 · Apex | Clear Stack & Queue Boss | +750 |
| Syntax Surgeon | Mastery · 3-Star | Flawless Syntax Dungeon (5/5 hearts) | +100 |
| Zero Allocator | Mastery · 3-Star | Flawless Execution Arena (no frame faults) | +180 |
| Inversion Master | Mastery · 3-Star | Flawless Sort Arena (zero erroneous swaps) | +200 |
| Optimal Mover | Mastery · 3-Star | Hanoi in minimal `2ⁿ − 1` moves | +250 |
| Balanced Root | Mastery · 3-Star | BST AVL balance in `[−1, +1]` throughout | +300 |
| Void Sentinel | Apex Trophy | Flawless Stack & Queue Boss | +500 |

**Total possible XP: 4,030**

---

## Sound Design

All audio is synthesised at runtime via the **Web Audio API** (`src/utils/audio.ts`) — no audio files are bundled:

| Function | Waveform | Frequency | Use |
|----------|---------|-----------|-----|
| `playTactileTick()` | Sine | 780 Hz, 20 ms | UI button clicks |
| `playUnlockChime()` | Triangle + Sine | E5 (659 Hz) → B5 (988 Hz) | Node unlock |
| `playSuccessChime()` | Sine arpeggio | C5–E5–G5–C6 | Quest completion |
| `playErrorThump()` / `playDamageCue()` | Triangle | 140 Hz → 45 Hz descending | Wrong answer / heart loss |
| `playAccoladeChime()` | Triangle arpeggio | A4–C#5–E5–A5 | Badge award |

SFX can be toggled in the top navigation bar; the setting persists to `localStorage`.

---

<div align="center">

*Built on the Foundation Core Arc — Archival Laboratory Edition.*

</div>
