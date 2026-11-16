/**
 * Grid Management & User Interactions
 * Handles initializing the 2D node matrix, rendering cells to the DOM,
 * and mouse interactions (drawing walls, dragging start/target).
 */

const GRID_CONFIG = {
  ROWS: 21,
  COLS: 45,
  START_ROW: 10,
  START_COL: 10,
  TARGET_ROW: 10,
  TARGET_COL: 34,
};

// Global application state
let grid = [];
let startNode = null;
let targetNode = null;

// Mouse tracking state for drawing & dragging
let isMouseDown = false;
let isMovingStart = false;
let isMovingTarget = false;
let isVisualizing = false; // Lock interactions during animation

/**
 * 1. Initialize the 2D array of GridNode instances
 */
function createGridData() {
  const newGrid = [];
  for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
    const currentRow = [];
    for (let c = 0; c < GRID_CONFIG.COLS; c++) {
      const node = new GridNode(r, c);
      if (r === GRID_CONFIG.START_ROW && c === GRID_CONFIG.START_COL) {
        node.isStart = true;
        startNode = node;
      } else if (r === GRID_CONFIG.TARGET_ROW && c === GRID_CONFIG.TARGET_COL) {
        node.isTarget = true;
        targetNode = node;
      }
      currentRow.push(node);
    }
    newGrid.push(currentRow);
  }
  return newGrid;
}

/**
 * 2. Render the grid elements to the DOM
 */
function renderGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";
  gridElement.style.gridTemplateColumns = `repeat(${GRID_CONFIG.COLS}, 25px)`;

  for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
    for (let c = 0; c < GRID_CONFIG.COLS; c++) {
      const nodeData = grid[r][c];
      const cell = document.createElement("div");
      cell.id = `node-${r}-${c}`;
      cell.className = "node";

      if (nodeData.isStart) cell.classList.add("node-start");
      if (nodeData.isTarget) cell.classList.add("node-target");
      if (nodeData.isWall) cell.classList.add("node-wall");

      // Attach mouse listeners for interactive drawing
      attachCellEventListeners(cell, nodeData);

      gridElement.appendChild(cell);
    }
  }
}

/**
 * 3. Mouse Event Listeners for drawing walls and moving Start/Target
 */
function attachCellEventListeners(cell, nodeData) {
  cell.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (isVisualizing) return;

    isMouseDown = true;
    if (nodeData.isStart) {
      isMovingStart = true;
    } else if (nodeData.isTarget) {
      isMovingTarget = true;
    } else {
      toggleWall(nodeData);
    }
  });

  cell.addEventListener("mouseenter", () => {
    if (isVisualizing || !isMouseDown) return;

    if (isMovingStart) {
      if (!nodeData.isTarget && !nodeData.isWall) {
        moveStartNode(nodeData);
      }
    } else if (isMovingTarget) {
      if (!nodeData.isStart && !nodeData.isWall) {
        moveTargetNode(nodeData);
      }
    } else {
      toggleWall(nodeData);
    }
  });
}

// Global mouseup to stop drawing when releasing click anywhere on page
window.addEventListener("mouseup", () => {
  isMouseDown = false;
  isMovingStart = false;
  isMovingTarget = false;
});

/**
 * Helper: Toggle wall on a node
 */
function toggleWall(node) {
  if (node.isStart || node.isTarget) return;
  node.isWall = !node.isWall;
  const domCell = document.getElementById(`node-${node.row}-${node.col}`);
  domCell.classList.toggle("node-wall", node.isWall);
}

/**
 * Helper: Move Start Node to new location
 */
function moveStartNode(newStart) {
  // Clear old start
  startNode.isStart = false;
  const oldCell = document.getElementById(`node-${startNode.row}-${startNode.col}`);
  oldCell.classList.remove("node-start");

  // Assign new start
  newStart.isStart = true;
  startNode = newStart;
  const newCell = document.getElementById(`node-${newStart.row}-${newStart.col}`);
  newCell.classList.add("node-start");
}

/**
 * Helper: Move Target Node to new location
 */
function moveTargetNode(newTarget) {
  // Clear old target
  targetNode.isTarget = false;
  const oldCell = document.getElementById(`node-${targetNode.row}-${targetNode.col}`);
  oldCell.classList.remove("node-target");

  // Assign new target
  newTarget.isTarget = true;
  targetNode = newTarget;
  const newCell = document.getElementById(`node-${newTarget.row}-${newTarget.col}`);
  newCell.classList.add("node-target");
}

/**
 * Helper: Get 4-directional cardinal neighbors (Up, Right, Down, Left)
 * Used directly by your pathfinding algorithms!
 */
function getNeighbors(gridMatrix, node) {
  const neighbors = [];
  const { row, col } = node;

  // Up, Right, Down, Left
  const directions = [
    [-1, 0], // Up
    [0, 1],  // Right
    [1, 0],  // Down
    [0, -1]  // Left
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    // Check bounds
    if (newRow >= 0 && newRow < GRID_CONFIG.ROWS && newCol >= 0 && newCol < GRID_CONFIG.COLS) {
      neighbors.push(gridMatrix[newRow][newCol]);
    }
  }

  return neighbors;
}

/**
 * Clear Path: Resets algorithm visual classes (visited, path) and node search data,
 * but keeps walls intact.
 */
function clearPath() {
  if (isVisualizing) return;

  for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
    for (let c = 0; c < GRID_CONFIG.COLS; c++) {
      const node = grid[r][c];
      node.resetSearchState();

      const domCell = document.getElementById(`node-${r}-${c}`);
      if (domCell) {
        domCell.classList.remove("node-visited", "node-path");
      }
    }
  }

  document.getElementById("visited-count").textContent = "0";
  document.getElementById("path-count").textContent = "0";
  document.getElementById("status-text").textContent = "Ready";
}

/**
 * Clear Board: Resets all walls, search paths, and restores blank grid.
 */
function clearBoard() {
  if (isVisualizing) return;

  for (let r = 0; r < GRID_CONFIG.ROWS; r++) {
    for (let c = 0; c < GRID_CONFIG.COLS; c++) {
      const node = grid[r][c];
      node.isWall = false;
      node.resetSearchState();

      const domCell = document.getElementById(`node-${r}-${c}`);
      if (domCell) {
        domCell.className = "node";
        if (node.isStart) domCell.classList.add("node-start");
        if (node.isTarget) domCell.classList.add("node-target");
      }
    }
  }

  document.getElementById("visited-count").textContent = "0";
  document.getElementById("path-count").textContent = "0";
  document.getElementById("status-text").textContent = "Ready";
}
