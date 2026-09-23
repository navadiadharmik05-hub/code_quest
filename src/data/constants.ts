export interface VideoBriefing {
  id: string;
  gameId: string;
  gameLabel: string;
  title: string;
  duration: string;
  youtubeId: string;
  summary: string;
  schematicLines: string[];
  takeaways: string[];
  nodeKey: string;
}

export const VIDEO_BRIEFINGS: VideoBriefing[] = [
  {
    id: 'syntax-dungeon',
    gameId: '01',
    gameLabel: 'FOR GAME 01',
    title: 'JavaScript & Python Lexical Analysis',
    duration: '12:45',
    youtubeId: 'W6NZfCO5SIk',
    summary: 'Learn how AST parsers tokenize code and build abstract syntax trees.',
    schematicLines: [
      '> LEXER_TOKENIZE(stream)',
      "> [TOKEN_KW, 'const'] -> AST_LEAF",
      '> PARSE_TREE: OK'
    ],
    takeaways: [
      'Abstract Syntax Trees (AST) and token decomposition rules.',
      'Block scope semantics & variable declaration sanitization.'
    ],
    nodeKey: 'syntax-dungeon'
  },
  {
    id: 'execution-arena',
    gameId: '02',
    gameLabel: 'FOR GAME 02',
    title: 'Call Stack & Execution Context Deep Dive',
    duration: '15:30',
    youtubeId: 'iLWTnMzWtj4',
    summary: 'Understand call stack allocation, execution contexts, and frame unwinding.',
    schematicLines: [
      '> PUSH_STACK_FRAME: eval()',
      '> BASE_PTR: 0x7FFF5FBFF8',
      '> STACK_UNWIND: SUCCESS'
    ],
    takeaways: [
      'Activation frames memory allocation and lifecycles.',
      'Step-by-step unwinding of synchronous call hierarchies.'
    ],
    nodeKey: 'execution-arena'
  },
  {
    id: 'sort-arena',
    gameId: '03',
    gameLabel: 'FOR GAME 03',
    title: 'Bubble Sort & Pairwise Inversions Explained',
    duration: '18:05',
    youtubeId: 'kPRA0W1kECg',
    summary: 'Master adjacent pairwise comparisons and bubble sort loop termination invariants.',
    schematicLines: [
      '> CMP arr[j] > arr[j+1]',
      '> SWAP INVERSION DETECTED',
      '> INVARIANT: ORDERED TAIL'
    ],
    takeaways: [
      'Pivot selection balancing avoiding O(n²) worst-case boundaries.',
      'In-place pairwise swapping and boundary indices control.'
    ],
    nodeKey: 'sort-arena'
  },
  {
    id: 'tower-of-hanoi',
    gameId: '04',
    gameLabel: 'FOR GAME 04',
    title: 'Recursion & Tower of Hanoi Mathematical Proof',
    duration: '21:10',
    youtubeId: 'rf6uf3jNjbo',
    summary: 'Grasp recursive base cases and the minimal 2^n - 1 move proof.',
    schematicLines: [
      '> T(n) = 2T(n-1) + 1',
      '> MIN_BOUND: 2^n - 1',
      '> INDUCTION_HYPOTHESIS: OK'
    ],
    takeaways: [
      'Mathematical induction: base case n=1 and inductive disk step.',
      'Strictly optimal operation sequence bounded by 2^n - 1 moves.'
    ],
    nodeKey: 'tower-of-hanoi'
  },
  {
    id: 'bst-quest',
    gameId: '05',
    gameLabel: 'FOR GAME 05',
    title: 'Binary Search Trees: Insert, Delete & Traversal',
    duration: '14:50',
    youtubeId: 'pYT9F8_LFTM',
    summary: 'Explore left-sub-root invariants and sorted in-order traversal guarantees.',
    schematicLines: [
      '> INVARIANT: L < ROOT < R',
      '> INORDER_TRAVERSE: SORTED',
      '> TREE_BALANCE: STABLE'
    ],
    takeaways: [
      'BST invariant: Left Child < Parent Node < Right Child.',
      'Monotonic ascending ordering guarantee of in-order recursive passes.'
    ],
    nodeKey: 'bst-quest'
  },
  {
    id: 'stack-queue-boss',
    gameId: '06',
    gameLabel: 'FOR GAME 06',
    title: 'Stacks & Queues: Memory Buffer Mechanics',
    duration: '17:22',
    youtubeId: 'wjI1WNc4g08',
    summary: 'Differentiate LIFO call stacks from FIFO task queues under buffer constraints.',
    schematicLines: [
      '> BUFFER_MODE: FIFO_RING',
      '> PUSH / POP: O(1) LATENCY',
      '> LIFO_UNWIND: OK'
    ],
    takeaways: [
      'LIFO synchronous execution stacks vs FIFO task queues.',
      'Asymmetric backpressure mitigation and buffer saturation bounds.'
    ],
    nodeKey: 'stack-queue-boss'
  }
];

export interface AccoladeItem {
  id: string;
  title: string;
  type: string;
  category: 'gate' | 'mastery';
  badgeChip: string;
  xp: string;
  xpValue: number;
  icon: string;
  shortDesc: string;
  criteria: string;
  footerLeft: {
    icon: string;
    text: string;
  };
  downstream: string;
  nodeKey?: string;
}

export const ACCOLADES: AccoladeItem[] = [
  {
    id: 'gate_01',
    title: 'Token Splicer',
    type: 'Gate Milestone',
    category: 'gate',
    badgeChip: 'Gate 01',
    xp: '+150 XP',
    xpValue: 150,
    icon: 'code_blocks',
    shortDesc: 'Clear Game 01: Syntax Dungeon',
    criteria: 'Clear Game 01: Syntax Dungeon. Complete all lexical parsing rooms to restore the parser runtime.',
    footerLeft: { icon: 'lock_open', text: 'Unlocks G02' },
    downstream: 'Unlocks downstream: Game 02 / Execution Arena',
    nodeKey: 'syntax-dungeon'
  },
  {
    id: 'gate_02',
    title: 'Trace Walker',
    type: 'Gate Milestone',
    category: 'gate',
    badgeChip: 'Gate 02',
    xp: '+280 XP',
    xpValue: 280,
    icon: 'linear_scale',
    shortDesc: 'Clear Game 02: Execution Arena',
    criteria: 'Clear Game 02: Execution Arena. Trace variable frames and dynamic loop invariants without program panic.',
    footerLeft: { icon: 'lock_open', text: 'Unlocks G03' },
    downstream: 'Unlocks downstream: Game 03 / Sort Arena',
    nodeKey: 'execution-arena'
  },
  {
    id: 'gate_03',
    title: 'Partition Knight',
    type: 'Gate Milestone',
    category: 'gate',
    badgeChip: 'Gate 03',
    xp: '+320 XP',
    xpValue: 320,
    icon: 'switch_access_shortcut',
    shortDesc: 'Clear Game 03: Sort Arena',
    criteria: 'Clear Game 03: Sort Arena. Successfully complete pivot partition and array ordering passes.',
    footerLeft: { icon: 'lock_open', text: 'Unlocks G04' },
    downstream: 'Unlocks downstream: Game 04 / Tower of Hanoi',
    nodeKey: 'sort-arena'
  },
  {
    id: 'gate_04',
    title: 'Recursion Artisan',
    type: 'Gate Milestone',
    category: 'gate',
    badgeChip: 'Gate 04',
    xp: '+450 XP',
    xpValue: 450,
    icon: 'account_tree',
    shortDesc: 'Clear Game 04: Tower of Hanoi',
    criteria: 'Clear Game 04: Tower of Hanoi. Resolve recursive stack frame migrations up to depth 5.',
    footerLeft: { icon: 'lock_open', text: 'Unlocks G05' },
    downstream: 'Unlocks downstream: Game 05 / BST Quest',
    nodeKey: 'tower-of-hanoi'
  },
  {
    id: 'gate_05',
    title: 'Tree Whisperer',
    type: 'Gate Milestone',
    category: 'gate',
    badgeChip: 'Gate 05',
    xp: '+500 XP',
    xpValue: 500,
    icon: 'alt_route',
    shortDesc: 'Clear Game 05: BST Quest',
    criteria: 'Clear Game 05: BST Quest. Execute tree node insertion, search, and AVL rebalancing sweeps.',
    footerLeft: { icon: 'lock_open', text: 'Unlocks G06' },
    downstream: 'Unlocks downstream: Game 06 / Stack & Queue Boss',
    nodeKey: 'bst-quest'
  },
  {
    id: 'gate_06',
    title: 'Apex Defragmenter',
    type: 'Gate Milestone',
    category: 'gate',
    badgeChip: 'Gate 06 · Apex',
    xp: '+750 XP',
    xpValue: 750,
    icon: 'layers',
    shortDesc: 'Clear Game 06: Stack & Queue Boss',
    criteria: 'Clear Game 06: Stack & Queue Boss. Neutralize buffer overflow anomalies in zero-latency queue scheduling.',
    footerLeft: { icon: 'verified', text: 'Master Completion' },
    downstream: 'Master Completion: Completes the Foundation Core Arc',
    nodeKey: 'stack-queue-boss'
  },
  {
    id: 'mastery_01',
    title: 'Syntax Surgeon',
    type: 'Mastery · 3-Star',
    category: 'mastery',
    badgeChip: 'Mastery · 3-Star',
    xp: '+100 XP',
    xpValue: 100,
    icon: 'military_tech',
    shortDesc: 'Flawless 3-star clear on Syntax Dungeon (5/5 Hearts)',
    criteria: 'Flawless 3-star victory on Syntax Dungeon with 5/5 Hearts preserved across all AST traversal sequences.',
    footerLeft: { icon: 'favorite', text: 'Zero Damage' },
    downstream: 'Awards Flawless Syntax Ribbon in profile showcase'
  },
  {
    id: 'mastery_02',
    title: 'Zero Allocator',
    type: 'Mastery · 3-Star',
    category: 'mastery',
    badgeChip: 'Mastery · 3-Star',
    xp: '+180 XP',
    xpValue: 180,
    icon: 'memory',
    shortDesc: 'Flawless 3-star clear on Execution Arena without frame faults',
    criteria: 'Flawless 3-star victory on Execution Arena without a single frame fault or memory boundary miss.',
    footerLeft: { icon: 'verified_user', text: 'No Frame Faults' },
    downstream: 'Awards Zero Allocator Telemetry Seal'
  },
  {
    id: 'mastery_03',
    title: 'Inversion Master',
    type: 'Mastery · 3-Star',
    category: 'mastery',
    badgeChip: 'Mastery · 3-Star',
    xp: '+200 XP',
    xpValue: 200,
    icon: 'swap_calls',
    shortDesc: 'Flawless 3-star clear on Sort Arena with zero erroneous swaps',
    criteria: 'Flawless 3-star victory on Sort Arena with strictly zero erroneous array swaps and full speed quota.',
    footerLeft: { icon: 'sync_alt', text: 'Zero Error Swaps' },
    downstream: 'Awards Inversion Knight Crest'
  },
  {
    id: 'mastery_04',
    title: 'Optimal Mover',
    type: 'Mastery · 3-Star',
    category: 'mastery',
    badgeChip: 'Mastery · 3-Star',
    xp: '+250 XP',
    xpValue: 250,
    icon: 'workspace_premium',
    shortDesc: 'Complete Tower of Hanoi in minimal moves (2^n - 1)',
    criteria: 'Complete Tower of Hanoi in theoretical minimal moves (2^n - 1) with zero invalid disk stackings.',
    footerLeft: { icon: 'functions', text: 'Minimal Moves' },
    downstream: 'Awards Minimalist Recursion Seal'
  },
  {
    id: 'mastery_05',
    title: 'Balanced Root',
    type: 'Mastery · 3-Star',
    category: 'mastery',
    badgeChip: 'Mastery · 3-Star',
    xp: '+300 XP',
    xpValue: 300,
    icon: 'balance',
    shortDesc: 'Maintain AVL balance invariants on BST Quest',
    criteria: 'Maintain AVL balance factor invariants strictly within [-1, +1] across all insertion bursts without re-tries.',
    footerLeft: { icon: 'shield', text: 'Invariant Guard' },
    downstream: 'Awards Golden Equilibrium Emblem'
  },
  {
    id: 'mastery_06',
    title: 'Void Sentinel',
    type: 'Apex Trophy',
    category: 'mastery',
    badgeChip: 'Apex Trophy',
    xp: '+500 XP',
    xpValue: 500,
    icon: 'star_half',
    shortDesc: 'Flawless clear on Stack & Queue Boss with zero buffer slips',
    criteria: 'Flawless clear on Stack & Queue Boss with zero buffer slips, no life loss, and sub-second IPC queue response rate.',
    footerLeft: { icon: 'stars', text: 'Apex Mastery' },
    downstream: 'Awards Archival Apex Ring Badge'
  }
];
