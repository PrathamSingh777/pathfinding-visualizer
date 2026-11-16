/**
 * Node Data Structure
 * Represents a single cell in the grid graph.
 * 
 * Notice that this is pure data — it has NO DOM references inside it!
 * DOM lookup is done via `document.getElementById(`node-${row}-${col}`)`.
 */

class GridNode {
  constructor(row, col) {
    this.row = row;
    this.col = col;

    // Node state flags
    this.isStart = false;
    this.isTarget = false;
    this.isWall = false;
    this.isVisited = false;

    // Dijkstra & BFS / DFS path tracking
    this.distance = Infinity;          // Cost from start to this node (gScore)
    this.previousNode = null;          // Pointer to reconstruct shortest path

    // A* Heuristic costs
    this.heuristicDistance = Infinity; // Estimated cost to target (hScore)
    this.totalDistance = Infinity;     // fScore = gScore + hScore
  }

  /**
   * Resets algorithmic properties for a new search while preserving walls and positions.
   */
  resetSearchState() {
    this.isVisited = false;
    this.distance = Infinity;
    this.previousNode = null;
    this.heuristicDistance = Infinity;
    this.totalDistance = Infinity;
  }
}
