# ⬡ Pathfinding Algorithm Visualizer

An interactive, responsive 2D graph pathfinding visualizer built with **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)**. No external frameworks, build tools, or npm dependencies.

Designed with a clean, decoupled software architecture that separates graph algorithms from DOM rendering via an asynchronous animation pipeline.

---

## 🚀 Live Demo & Preview
- **Live Demo:** [Click here to preview](#) *(Add your GitHub Pages / Vercel link here)*
- **Supported Browsers:** Chrome, Firefox, Safari, Edge

---

## ✨ Features

- **4 Core Pathfinding Algorithms:**
  - **Breadth-First Search (BFS):** Unweighted shortest-path guarantee ($O(V + E)$).
  - **Depth-First Search (DFS):** Deep traversal exploration ($O(V + E)$); does not guarantee shortest path.
  - **Dijkstra's Algorithm:** Father of pathfinding; guarantees shortest path on weighted/unweighted graphs.
  - **A\* Search:** Informed heuristic search using **Manhattan Distance** ($f(n) = g(n) + h(n)$); cuts search exploration by $\sim$60% over Dijkstra.
- **Procedural Maze Generation:** Generate random barrier obstacles with a single click.
- **Interactive Board:**
  - Click & drag to draw or erase custom walls.
  - Drag and drop green **Start** and red **Target** nodes anywhere on the grid.
- **Animation Speed Slider:** Control traversal playback speed (Slow, Medium, Fast).
- **Decoupled Architecture:** Pure graph computation returns execution history; animations run asynchronously using timer queues without freezing the UI thread.
- **Live Metrics Counter:** Real-time counters displaying total visited nodes and reconstructed shortest-path length.

---

## 📊 Algorithm Comparison

| Algorithm | Data Structure | Guarantees Shortest Path? | Weighted Graphs? | Time Complexity | Space Complexity |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **BFS** | Queue (FIFO) | **Yes** | No (Unweighted only) | $O(V + E)$ | $O(V)$ |
| **DFS** | Stack (LIFO) | **No** | No | $O(V + E)$ | $O(V)$ |
| **Dijkstra** | Priority Queue / Min-Sort | **Yes** | **Yes** (Non-negative) | $O((V + E) \log V)$ | $O(V)$ |
| **A\* Search** | Priority Queue ($f = g + h$) | **Yes** (Admissible heuristic) | **Yes** (Non-negative) | $O((V + E) \log V)$ | $O(V)$ |

---

## 🏛️ System Architecture

```text
[ User Interaction / Controls ]
               │
               ▼
   ┌───────────────────────┐
   │       main.js         │  <--- Orchestrator & Event Listener Hub
   └───────────┬───────────┘
               │ Reads Matrix
               ▼
   ┌───────────────────────┐
   │     algorithms.js     │  <--- Pure Computation Engine (Zero DOM Manipulation)
   └───────────┬───────────┘
               │ Returns: { visitedInOrder: [...], shortestPath: [...] }
               ▼
   ┌───────────────────────┐
   │      animate.js       │  <--- Staggered setTimeout Animation Engine
   └───────────┬───────────┘
               │ Mutates CSS classes (.node-visited, .node-path)
               ▼
   ┌───────────────────────┐
   │      DOM Grid         │  <--- 21 x 45 CSS Grid Canvas
   └───────────────────────┘
```

---

## 📁 Project Structure

```text
algorithm-visualizer/
│
├── index.html          # Semantic HTML layout, controls, grid container
├── style.css           # Dark theme design system, grid styles, keyframe animations
├── README.md           # Documentation
├── .gitignore          # Git ignore rules
│
└── js/
    ├── node.js         # GridNode class (coordinates, distance, previousNode pointer)
    ├── grid.js         # Grid matrix initialization, mouse drawing & dragging handlers
    ├── maze.js         # Procedural maze generation logic
    ├── algorithms.js   # Pure implementations of BFS, DFS, Dijkstra, and A*
    ├── animate.js      # Timeout-based animation engine for visited nodes & shortest path
    └── main.js         # Application entry point wiring UI buttons to algorithms
```

---

## 🛠️ Setup & Running Locally

Because this project is built entirely with vanilla web technologies, no installation or npm packages are needed:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PrathamSingh777/pathfinding-visualizer.git
   cd pathfinding-visualizer
   ```

2. **Open `index.html`:**
   - Double-click `index.html` in your file explorer, OR
   - Run a simple local server:
     ```bash
     python3 -m http.server 3000
     ```
     Then open `http://localhost:3000` in your browser.

---

## 👤 Author

**Pratham Singh**
- GitHub: [@PrathamSingh777](https://github.com/PrathamSingh777)
- LinkedIn: [Pratham Singh](https://linkedin.com/in/pratham-singh-3313902aa)

