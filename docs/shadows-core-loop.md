flowchart TD
  %% ====== STYLES ======
  classDef phase fill:#0f172a,stroke:#94a3b8,color:#e2e8f0,stroke-width:1px,rx:6,ry:6;
  classDef action fill:#1e293b,stroke:#94a3b8,color:#e2e8f0,stroke-width:1px,rx:6,ry:6;
  classDef pos fill:#064e3b,stroke:#10b981,color:#ecfdf5,rx:6,ry:6,stroke-width:1px;
  classDef neg fill:#3f1d2e,stroke:#f472b6,color:#ffe4f1,rx:6,ry:6,stroke-width:1px;
  classDef note fill:#111827,stroke:#6b7280,color:#d1d5db,rx:6,ry:6,stroke-width:1px;
  classDef terminal fill:#111827,stroke:#f59e0b,color:#fff7ed,stroke-width:2px,rx:10,ry:10;

  %% ====== ENTRY ======
  A[Start Run]:::terminal --> B[Setup\n• Player deck (starter)\n• Market deck & row\n• Cruxflare deck\n• Dream Map nodes]:::note
  B --> C[Start Phase]:::phase

  %% ====== START PHASE ======
  C --> C1[Draw up to hand size]:::action
  C1 --> C2[Apply persistent effects\n(e.g., Fragment boost, blocks)]:::note
  C2 --> D[Action Phase]:::phase

  %% ====== ACTION PHASE ======
  subgraph Action_Phase[ ]
    direction TB
    D --> D1[Play Cards]:::action
    D1 --> D1a[Gain orbs 🎯]:::action
    D1 --> D1b[Move 👣 / Safe Move 🌀 / Teleport ✨]:::action
    D1 --> D1c[Special effects\n(Shadow Blocker 🛡️, Dream Echo ♻️, etc.)]:::action

    D1b --> D2[Resolve Movement]:::action
    D2 --> D2a[If on Fragment 🟡 → collect]:::pos
    D2 --> D2b[If on Encounter 🟣 → resolve\n(coin gain / orb loss)]:::neg
  end

  D2a --> E[Purchase Phase]:::phase
  D2b --> E

  %% ====== PURCHASE PHASE ======
  subgraph Purchase[ ]
    direction TB
    E --> E1[Spend orbs to buy from Market]:::action
    E1 --> E2[Purchased cards to discard]:::note
    E2 --> E3[Refill market row]:::note
  end

  E3 --> F[End Phase]:::phase

  %% ====== END PHASE ======
  subgraph End_Phase[ ]
    direction TB
    F --> F1[Reveal top Cruxflare card]:::neg
    F1 --> F2[Resolve effect\n• Remove market card\n• Shrink map node\n• Discard random card\n• Rearrange fragments\n• Final Darkness timer, etc.]:::neg
    F2 --> F3{Check Win / Loss?}
  end

  %% ====== OUTCOMES ======
  F3 -->|Win condition met:\nAll Fragments collected| WIN[You Win]:::terminal
  F3 -->|Final Darkness / deck exhausted\n(or other fail state)| LOSS[You Lose]:::terminal
  F3 -->|Otherwise| LOOP[New Turn]:::note

  LOOP --> C

  %% ====== PARALLEL SYSTEMS ======
  %% Map
  subgraph MAP[Dream Map System]
    direction TB
    M1[Node Types:\n• ⚪ Focus (safe)\n• 🟡 Fragment (goal)\n• 🟣 Encounter (chance)]:::note
    M2[Dynamic map:\n• Nodes can be removed by Cruxflare\n• Fragments may relocate to safe nodes]:::note
  end

  %% Cruxflare meter / danger
  subgraph CF[Cruxflare Deck & Danger]
    direction TB
    CF1[Separate event deck]:::note
    CF2[Triggers at End Phase each turn]:::neg
    CF3[Danger escalates as deck thins:\n• ≤2 cards → Danger music/UI]:::neg
    CF4[Player counters:\n• Shadow Blocker 🛡️, Spirit Guide 👣🛡️, Dream Sight 🔮]:::pos
  end

  %% Connect references
  B -. informs .- MAP
  B -. i
