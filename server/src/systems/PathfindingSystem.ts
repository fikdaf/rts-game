export type Point = { x: number; y: number };

export class PathfindingSystem {
  constructor(private width: number, private height: number, private cellSize = 40) {}

  findPath(start: Point, goal: Point, blocked: Set<string> = new Set()): Point[] {
    const toCell = (p: Point) => ({ x: Math.max(0, Math.min(Math.floor(this.width / this.cellSize) - 1, Math.floor(p.x / this.cellSize))), y: Math.max(0, Math.min(Math.floor(this.height / this.cellSize) - 1, Math.floor(p.y / this.cellSize))) });
    const s = toCell(start), g = toCell(goal), key = (x: number, y: number) => `${x},${y}`;
    const open = [{ x: s.x, y: s.y, f: 0 }];
    const came = new Map<string, string>();
    const cost = new Map<string, number>([[key(s.x, s.y), 0]]);
    const heuristic = (x: number, y: number) => Math.abs(x - g.x) + Math.abs(y - g.y);
    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift()!;
      if (current.x === g.x && current.y === g.y) {
        const path: Point[] = [];
        let k = key(g.x, g.y);
        while (k !== key(s.x, s.y)) {
          const [x, y] = k.split(",").map(Number); path.unshift({ x: (x + .5) * this.cellSize, y: (y + .5) * this.cellSize });
          k = came.get(k)!;
        }
        return path;
      }
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = current.x + dx, ny = current.y + dy, nk = key(nx, ny);
        const maxX = Math.floor(this.width / this.cellSize), maxY = Math.floor(this.height / this.cellSize);
        if (nx < 0 || ny < 0 || nx >= maxX || ny >= maxY || blocked.has(nk)) continue;
        const nextCost = (cost.get(key(current.x, current.y)) ?? Infinity) + 1;
        if (nextCost < (cost.get(nk) ?? Infinity)) { cost.set(nk, nextCost); came.set(nk, key(current.x, current.y)); open.push({ x: nx, y: ny, f: nextCost + heuristic(nx, ny) }); }
      }
    }
    return [];
  }
}
