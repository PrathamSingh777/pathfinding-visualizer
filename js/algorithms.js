/**
 * ==========================================================================
 * GRAPH & PATHFINDING ALGORITHMS (YOUR CODE GOES HERE!)
 * ==========================================================================
 * 
 * THE CONTRACT:
 * Every algorithm function receives:
 *   - grid: 2D array of GridNode objects (matrix: grid[row][col])
 *   - startNode: The starting GridNode instance
 *   - targetNode: The target/destination GridNode instance
 * 
 * Every algorithm MUST return an object of the exact shape:
 *   {
 *     visitedInOrder: [Node, Node, ...],  // Array of all visited nodes in exploration order
 *     shortestPath:   [Node, Node, ...]   // Array of nodes from startNode to targetNode
 *   }
 * 
 * HELPER AVAILABLE:
 *   getNeighbors(grid, currentNode) -> returns an array of up to 4 adjacent [Up, Right, Down, Left] GridNode objects.
 * 
 * NODE PROPERTIES AVAILABLE (from node.js):
 *   - node.row, node.col
 *   - node.isWall (boolean)
 *   - node.isVisited (boolean)
 *   - node.previousNode (GridNode pointer - use this to backtrack from targetNode to startNode!)
 *   - node.distance (number - for Dijkstra / A*)
 *   - node.totalDistance (number - for A*)
 * 
 * GOLDEN RULE:
 *   DO NOT modify the DOM (no document.getElementById, no classList, etc.).
 *   Only operate on the node objects and return the two arrays!
 */

/**
 * 1. Breadth-First Search (BFS)
 * Guarantees the shortest path on unweighted graphs.
 * Uses a Queue (FIFO).
 */
function bfs(grid, startNode, targetNode) {
  const visitedInOrder = [];
  const queue = [];

  // 1. Initialize:
  startNode.isVisited = true;
  queue.push(startNode);

  // 2. Loop while the queue is not empty (queue.length > 0):
  while (queue.length > 0) {
    // a. Pull the first node from the queue (hint: queue.shift())
    const current = queue.shift();

    // b. Record that we visited it for the animation:
    visitedInOrder.push(current);

    // c. Did we hit the target?
    if (current === targetNode) {
      return {
        visitedInOrder,
        shortestPath: reconstructPath(targetNode)
      };
    }

    // d. Get neighboring nodes using the helper:
    const neighbors = getNeighbors(grid, current);

    // e. Loop through each neighbor:
    for (const neighbor of neighbors) {
      // Only process if neighbor is NOT visited and NOT a wall:
      if (!neighbor.isVisited && !neighbor.isWall) {
        // - Mark it visited immediately so it isn't added to queue twice!
        neighbor.isVisited = true;
        // - Set neighbor.previousNode = current (set up the breadcrumb!)
        neighbor.previousNode = current;
        // - Push neighbor into the queue
        queue.push(neighbor);
      }
    }
  }

  // 3. If queue emptied without reaching target (wall blocked everything):
  return { visitedInOrder, shortestPath: [] };
}

/**
 * 2. Depth-First Search (DFS)
 * Does NOT guarantee the shortest path.
 * Uses a Stack (LIFO) or Recursion.
 */
function dfs(grid, startNode, targetNode) {
  const visitedInOrder = [];
  const stack = [];

  // 1. Push startNode into stack
  stack.push(startNode);

  // 2. Loop while stack is not empty
  while (stack.length > 0) {
    // a. Pop from the TOP of the stack
    const current = stack.pop();

    // b. If already visited, skip it! (Important for DFS)
    if (current.isVisited) continue;

    // c. Mark as visited now and record it
    current.isVisited = true;
    visitedInOrder.push(current);

    // d. Reached target?
    if (current === targetNode) {
      return {
        visitedInOrder,
        shortestPath: reconstructPath(targetNode)
      };
    }

    // e. Get neighbors and push unvisited non-walls to stack
    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = current;
        stack.push(neighbor);
      }
    }
  }

  return { visitedInOrder, shortestPath: [] };
}

/**
 * 3. Dijkstra's Algorithm
 * Guarantees the shortest path.
 * Explores closest unvisited node with lowest distance.
 */
function dijkstra(grid, startNode, targetNode) {
  const visitedInOrder = [];

  // 1. Setup startNode distance
  startNode.distance = 0;

  // Array of nodes to explore (our priority collection)
  const unvisitedNodes = [startNode];

  // 2. Loop while we have unvisited nodes
  while (unvisitedNodes.length > 0) {
    // a. Sort by distance so the smallest distance is at index 0:
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const current = unvisitedNodes.shift();

    // b. Skip if already visited (handles duplicate insertions)
    if (current.isVisited) continue;

    // c. If the smallest distance is Infinity, we are trapped (no path possible)
    if (current.distance === Infinity) break;

    // d. Mark as visited & record for animation
    current.isVisited = true;
    visitedInOrder.push(current);

    // e. Did we reach the target?
    if (current === targetNode) {
      return {
        visitedInOrder,
        shortestPath: reconstructPath(targetNode)
      };
    }

    // f. Relax all unvisited, non-wall neighbors
    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const potentialDist = current.distance + 1;

        // If we found a shorter path to neighbor:
        if (potentialDist < neighbor.distance) {
          neighbor.distance = potentialDist;
          neighbor.previousNode = current;
          unvisitedNodes.push(neighbor);
        }
      }
    }
  }

  return { visitedInOrder, shortestPath: [] };
}

/**
 * Helper: Manhattan Distance Heuristic for A* Search
 * On a 4-directional grid, Manhattan distance is admissible (never overestimates).
 */
function getManhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

/**
 * 4. A* Search
 * Guarantees the shortest path using Manhattan distance heuristic (hScore).
 * Explores node with lowest totalDistance (fScore = gScore + hScore).
 */
function astar(grid, startNode, targetNode) {
  const visitedInOrder = [];

  // 1. Initialize start node scores
  startNode.distance = 0; // gScore: cost from start
  startNode.heuristicDistance = getManhattanDistance(startNode, targetNode); // hScore
  startNode.totalDistance = startNode.distance + startNode.heuristicDistance; // fScore

  const openSet = [startNode];

  // 2. Loop while openSet is not empty
  while (openSet.length > 0) {
    // a. Sort by totalDistance (fScore). 
    // Tie-breaker: if fScores are equal, pick lower heuristicDistance (hScore) to target!
    openSet.sort((a, b) => {
      if (a.totalDistance === b.totalDistance) {
        return a.heuristicDistance - b.heuristicDistance;
      }
      return a.totalDistance - b.totalDistance;
    });

    const current = openSet.shift();

    if (current.isVisited) continue;
    if (current.distance === Infinity) break;

    current.isVisited = true;
    visitedInOrder.push(current);

    if (current === targetNode) {
      return {
        visitedInOrder,
        shortestPath: reconstructPath(targetNode)
      };
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const tentativeGScore = current.distance + 1;

        if (tentativeGScore < neighbor.distance) {
          neighbor.distance = tentativeGScore;
          neighbor.heuristicDistance = getManhattanDistance(neighbor, targetNode);
          neighbor.totalDistance = neighbor.distance + neighbor.heuristicDistance;
          neighbor.previousNode = current;

          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedInOrder, shortestPath: [] };
}
/**
 * Helper stub: Reconstruct Shortest Path by backtracking previousNode pointers
 * from targetNode back to startNode.
 */
function reconstructPath(targetNode) {
  const path = [];

  let currentNode = targetNode;
  while (currentNode != null) {
    path.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }


  // TODO: You will implement this backtrack loop!
  return path;
}
