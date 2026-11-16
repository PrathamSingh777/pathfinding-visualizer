/**
 * Application Entry Point & Event Wiring
 * Connects DOM controls (buttons, dropdowns, slider) to Grid and Animation engine.
 */

// Global speed delay in ms (derived from slider value)
let animationSpeed = 15;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize data grid and render DOM
  grid = createGridData();
  renderGrid();

  // 2. Cache DOM Elements
  const visualizeBtn = document.getElementById("visualize-btn");
  const mazeBtn = document.getElementById("maze-btn");
  const clearPathBtn = document.getElementById("clear-path-btn");
  const clearBoardBtn = document.getElementById("clear-board-btn");
  const algorithmSelect = document.getElementById("algorithm-select");
  const speedSlider = document.getElementById("speed-slider");
  const speedLabel = document.getElementById("speed-label");

  // 3. Speed slider handler
  speedSlider.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    // Invert value so higher slider = faster animation (smaller ms delay)
    // Slider min: 1 (50ms delay), max: 50 (5ms delay)
    animationSpeed = Math.max(5, 55 - val);

    if (val < 15) speedLabel.textContent = "Slow";
    else if (val < 35) speedLabel.textContent = "Medium";
    else speedLabel.textContent = "Fast";
  });

  // 4. Visualize button click handler
  visualizeBtn.addEventListener("click", () => {
    if (isVisualizing) return;

    // Clear previous search visual artifacts while preserving walls
    clearPath();

    const selectedAlgo = algorithmSelect.value;
    let result = null;

    // Check if algorithm function is implemented
    if (typeof window[selectedAlgo] !== "function") {
      alert(`The algorithm "${selectedAlgo}" is not implemented yet in algorithms.js!`);
      return;
    }

    // Lock UI during animation
    setUILocked(true);

    // Run pure algorithm computation
    result = window[selectedAlgo](grid, startNode, targetNode);

    // Safeguard check for proper return contract
    if (!result || !Array.isArray(result.visitedInOrder) || !Array.isArray(result.shortestPath)) {
      alert("Algorithm must return an object with { visitedInOrder: [], shortestPath: [] }!");
      setUILocked(false);
      return;
    }

    // Trigger visualizer
    animateAlgorithm(result.visitedInOrder, result.shortestPath, animationSpeed, () => {
      // Re-enable UI when animation finishes
      setUILocked(false);
    });
  });

  // 5. Maze generator button handler
  mazeBtn.addEventListener("click", () => {
    if (isVisualizing) return;
    clearBoard();

    if (typeof window.generateRandomMaze !== "function") {
      alert("Maze generator is not implemented yet in js/maze.js!");
      return;
    }

    setUILocked(true);
    const walls = window.generateRandomMaze(grid, startNode, targetNode);
    animateMaze(walls, () => {
      setUILocked(false);
    });
  });

  // 6. Clear buttons
  clearPathBtn.addEventListener("click", () => {
    if (!isVisualizing) clearPath();
  });

  clearBoardBtn.addEventListener("click", () => {
    if (!isVisualizing) clearBoard();
  });

  /**
   * Helper to enable/disable UI controls during visualization
   */
  function setUILocked(locked) {
    isVisualizing = locked;
    visualizeBtn.disabled = locked;
    mazeBtn.disabled = locked;
    clearPathBtn.disabled = locked;
    clearBoardBtn.disabled = locked;
    algorithmSelect.disabled = locked;
    speedSlider.disabled = locked;
  }
});
