/**
 * A class representing a graph with vertices of type T and edges connecting them.
 * Supports directed and undirected edges, edge weights, cycle detection, connected components,
 * and transposition of the graph.
 */
export class Graph<T> {
  protected vertices: number;
  protected edges: Map<T, T[]> = new Map();
  protected directedEdges: Map<T, T[]> = new Map();
  protected weightedEdges: Map<T, Map<T, number>> = new Map();

  /**
   * Creates a new graph with the given number of vertices.
   * @param vertices The number of vertices in the graph.
   */
  constructor(vertices: number) {
    this.vertices = vertices;
    for (let i = 0; i < vertices; i++) {
      this.edges.set((i as unknown) as T, []);
      this.directedEdges.set((i as unknown) as T, []);
      this.weightedEdges.set((i as unknown) as T, new Map<T, number>());
    }
  }

  /**
   * Returns the number of vertices in the graph.
   * @returns The number of vertices in the graph.
   */
  getVerticesCount() {
    return this.vertices;
  }

  /**
   * Adds an edge between the vertices with the given values.
   * If the graph is undirected, the edge will be added in both directions.
   * @param u The value of the first vertex.
   * @param v The value of the second vertex.
   * @param directed Whether the edge should be directed (default: false).
   * @param weight The weight of the edge (default: 1).
   */
  addEdge(u: T, v: T, weight?: number, directed?: boolean) {
    this.edges.get(u)?.push(v);
    this.edges.get(v)?.push(u);

    if (directed) {
      this.directedEdges.get(u)?.push(v);
    } else {
      this.directedEdges.get(u)?.push(v);
      this.directedEdges.get(v)?.push(u);
    }

    if (weight !== undefined) {
      this.weightedEdges.get(u)?.set(v, weight);
      this.weightedEdges.get(v)?.set(u, weight);
    }
  }

  /**
   * Returns an array of the values of the vertices adjacent to the given vertex.
   * @param u The value of the vertex to get the edges of.
   * @returns An array of the values of the adjacent vertices.
   */
  getEdges(u: T): T[] {
    return this.edges.get(u) ?? [];
  }

  getDirectedEdges(u: T): T[] {
    return this.directedEdges.get(u) ?? [];
  }

  getWeightedEdges(u: T): Map<T, number> {
    return this.weightedEdges.get(u) ?? new Map<T, number>();
  }

  /**
   * Detects cycles in the graph using depth-first search.
   * @returns True if the graph contains a cycle, false otherwise.
   */
  hasCycle(): boolean {
    const visited = new Set<T>();
    const inStack = new Set<T>();

    const dfs = (u: T): boolean => {
      visited.add(u);
      inStack.add(u);

      for (const v of this.getDirectedEdges(u)) {
        if (!visited.has(v)) {
          if (dfs(v)) {
            return true;
          }
        } else if (inStack.has(v)) {
          return true;
        }
      }

      inStack.delete(u);
      return false;
    };

    for (const u of Array.from(this.edges.keys())) {
      if (!visited.has(u)) {
        if (dfs(u)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Finds the strongly connected components of the graph using Kosaraju's algorithm.
   * @returns An array of arrays, each containing the values of the vertices in a strongly connected component.
   */
  findConnectedComponents(): T[][] {
    const visited = new Set<T>();
    const components: T[][] = [];

    const dfs = (u: T, component: T[]) => {
      visited.add(u);
      component.push(u);

      for (const v of this.getEdges(u)) {
        if (!visited.has(v)) {
          dfs(v, component);
        }
      }
    };

    for (const u of Array.from(this.edges.keys())) {
      if (!visited.has(u)) {
        const component: T[] = [];
        dfs(u, component);
        components.push(component);
      }
    }

    return components;
  }

  /**
   * Returns a new graph with all the edges reversed.
   * @returns A new graph with the same vertices and reversed edges.
   */
  transpose(): Graph<T> {
    const transpose = new Graph<T>(this.vertices);

    for (const u of Array.from(this.edges.keys())) {
      for (const v of this.getEdges(u)) {
        transpose.addEdge(v, u);
      }
    }

    return transpose;
  }
}
