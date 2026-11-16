/**
 * Pure Animation Engine
 * Receives the calculated data from the algorithm and handles DOM animations sequentially.
 */

let activeTimeouts = [];

/**
 * Animate Algorithm Execution
 * @param {Array<GridNode>} visitedNodesInOrder - List of nodes visited during search
 * @param {Array<GridNode>} shortestPathNodes - List of nodes on the reconstructed shortest path
 * @param {number} speedDelay - Delay in milliseconds per node step
 * @param {Function} onComplete - Callback executed when animation finishes
 */
function animateAlgorithm(visitedNodesInOrder, shortestPathNodes, speedDelay, onComplete) {
  // Clear any leftover pending animations
  clearAllTimeouts();

  const visitedCountElem = document.getElementById("visited-count");
  const pathCountElem = document.getElementById("path-count");
  const statusElem = document.getElementById("status-text");

  statusElem.textContent = "Searching...";

  // 1. Animate visited nodes sequentially
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      // Once visited nodes animation is done, start shortest path animation
      const timeout = setTimeout(() => {
        if (shortestPathNodes.length > 0) {
          statusElem.textContent = "Path Found!";
          animateShortestPath(shortestPathNodes, speedDelay, onComplete);
        } else {
          statusElem.textContent = "No Path Found!";
          if (onComplete) onComplete();
        }
      }, i * speedDelay);
      activeTimeouts.push(timeout);
      return;
    }

    const timeout = setTimeout(() => {
      const node = visitedNodesInOrder[i];
      visitedCountElem.textContent = (i + 1).toString();

      // Don't overwrite the special start/target styling
      if (!node.isStart && !node.isTarget) {
        const domCell = document.getElementById(`node-${node.row}-${node.col}`);
        if (domCell) {
          domCell.classList.add("node-visited");
        }
      }
    }, i * speedDelay);
    activeTimeouts.push(timeout);
  }
}

/**
 * Animate Shortest Path sequentially
 */
function animateShortestPath(shortestPathNodes, speedDelay, onComplete) {
  const pathCountElem = document.getElementById("path-count");
  const pathSpeed = Math.max(speedDelay * 2, 25); // Slightly slower for crisp path visualization

  for (let i = 0; i < shortestPathNodes.length; i++) {
    const timeout = setTimeout(() => {
      const node = shortestPathNodes[i];
      pathCountElem.textContent = (i + 1).toString();

      if (!node.isStart && !node.isTarget) {
        const domCell = document.getElementById(`node-${node.row}-${node.col}`);
        if (domCell) {
          domCell.classList.remove("node-visited");
          domCell.classList.add("node-path");
        }
      }

      // If finished animating path
      if (i === shortestPathNodes.length - 1) {
        if (onComplete) onComplete();
      }
    }, i * pathSpeed);
    activeTimeouts.push(timeout);
  }
}

/**
 * Animate Maze Walls sequentially
 */
function animateMaze(wallsToAnimate, onComplete) {
  clearAllTimeouts();
  const statusElem = document.getElementById("status-text");
  statusElem.textContent = "Generating Maze...";

  if (wallsToAnimate.length === 0) {
    statusElem.textContent = "Ready";
    if (onComplete) onComplete();
    return;
  }

  for (let i = 0; i < wallsToAnimate.length; i++) {
    const timeout = setTimeout(() => {
      const node = wallsToAnimate[i];
      if (!node.isStart && !node.isTarget) {
        node.isWall = true;
        const domCell = document.getElementById(`node-${node.row}-${node.col}`);
        if (domCell) {
          domCell.classList.add("node-wall");
        }
      }

      if (i === wallsToAnimate.length - 1) {
        statusElem.textContent = "Maze Ready";
        if (onComplete) onComplete();
      }
    }, i * 10); // Swift wall pop delay
    activeTimeouts.push(timeout);
  }
}

/**
 * Cancel and clear all active animation timeouts
 */
function clearAllTimeouts() {
  for (const timeoutId of activeTimeouts) {
    clearTimeout(timeoutId);
  }
  activeTimeouts = [];
}
