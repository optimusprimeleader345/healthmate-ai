class HealthGraph {
  constructor() {
    this.nodes = []; // array of {type: 'symptom'|'condition'|'risk', name}
    this.edges = []; // array of {from: nodeName, to: nodeName, weight: number}
  }

  addNode(type, name) {
    if (!this.nodes.find(n => n.name === name)) {
      this.nodes.push({type, name});
    }
  }

  addEdge(fromName, toName, weight) {
    const existing = this.edges.find(e => e.from === fromName && e.to === toName);
    if (existing) {
      existing.weight = weight; // update
    } else {
      this.edges.push({from: fromName, to: toName, weight});
    }
  }

  getConnectedNodes(nodeName) {
    const connections = this.edges.filter(e => e.from === nodeName || e.to === nodeName);
    const nodeNames = [...new Set(connections.map(e => e.from === nodeName ? e.to : e.from))];
    return nodeNames.map(name => this.nodes.find(n => n.name === name)).filter(n => n);
  }

  getRiskPaths(symptomName) {
    // Simple BFS to find paths from symptom to risk
    const visited = new Set();
    const queue = [{path: [symptomName], risk: 0}];
    const riskPaths = [];

    while (queue.length > 0) {
      const {path, risk} = queue.shift();
      const last = path[path.length - 1];

      if (visited.has(last)) continue;
      visited.add(last);

      const node = this.nodes.find(n => n.name === last);
      if (node.type === 'risk') {
        riskPaths.push({conditions: path.slice(1, -1), riskLevel: risk, riskNode: last});
        continue;
      }

      // find neighbors
      const connections = this.edges.filter(e => e.from === last || e.to === last);
      for (const edge of connections) {
        const neighbor = edge.from === last ? edge.to : edge.from;
        if (!path.includes(neighbor)) {
          const newRisk = risk + edge.weight;
          queue.push({path: [...path, neighbor], risk: newRisk});
        }
      }
    }

    return riskPaths;
  }
}

// Create and populate the graph
const healthGraph = new HealthGraph();

// Add sample nodes
healthGraph.addNode('symptom', 'headache');
healthGraph.addNode('symptom', 'fever');
healthGraph.addNode('symptom', 'fatigue');
healthGraph.addNode('symptom', 'cough');
healthGraph.addNode('symptom', 'chest pain');
healthGraph.addNode('condition', 'migraine');
healthGraph.addNode('condition', 'influenza');
healthGraph.addNode('condition', 'infection');
healthGraph.addNode('condition', 'heart disease');
healthGraph.addNode('condition', 'depression');
healthGraph.addNode('risk', 'dehydration');
healthGraph.addNode('risk', 'high blood pressure');
healthGraph.addNode('risk', 'stroke');
healthGraph.addNode('risk', 'cardiac arrest');

// Add sample edges with weights (higher weight = higher risk/correlation)
healthGraph.addEdge('headache', 'migraine', 0.8);
healthGraph.addEdge('headache', 'high blood pressure', 0.6);
healthGraph.addEdge('fever', 'influenza', 0.9);
healthGraph.addEdge('fever', 'infection', 0.7);
healthGraph.addEdge('fever', 'dehydration', 0.4);
healthGraph.addEdge('fatigue', 'depression', 0.6);
healthGraph.addEdge('fatigue', 'infection', 0.5);
healthGraph.addEdge('cough', 'influenza', 0.8);
healthGraph.addEdge('cough', 'infection', 0.6);
healthGraph.addEdge('chest pain', 'heart disease', 0.9);
healthGraph.addEdge('chest pain', 'cardiac arrest', 0.7);
healthGraph.addEdge('heart disease', 'stroke', 0.8);
healthGraph.addEdge('high blood pressure', 'stroke', 0.9);
healthGraph.addEdge('migraine', 'stroke', 0.4);

export default healthGraph;
