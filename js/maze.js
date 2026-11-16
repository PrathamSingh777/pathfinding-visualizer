/**
 * ==========================================================================
 * MAZE GENERATION ALGORITHMS (YOUR CODE GOES HERE!)
 * ==========================================================================
 * 
 * CONTRACT:
 * function generateRandomMaze(grid, startNode, targetNode) -> returns Array<GridNode>
 * 
 * Takes:
 *   - grid: 2D array of GridNodes
 *   - startNode: The start node (MUST NOT become a wall)
 *   - targetNode: The target node (MUST NOT become a wall)
 * 
 * Returns:
 *   - wallsToAnimate: An ordered array of GridNode instances that should become walls.
 * 
 * GOLDEN RULE:
 *   DO NOT touch the DOM! Just pick the nodes and return them in an array.
 *   animateMaze() in animate.js handles animating them onto the screen.
 */

function generateRandomMaze(grid, startNode, targetNode) {
  const walls = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === startNode || grid[row][col] === targetNode) {
        continue;
      }
      if (Math.random() < 0.3) {
        walls.push(grid[row][col]);
      }
    }
  }

  return walls;
}

