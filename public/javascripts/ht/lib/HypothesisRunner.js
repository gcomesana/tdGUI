
Ext.require(['HT.lib.Util']);

/**
 * This class gets (and keeps) all possible paths to walk in a graph.
 */
Ext.define('HT.lib.HypothesisRunner', {

	edges: undefined, // the graph edges
	edgesVisited: undefined, // the visited edges

	nodes: undefined,

	nodesId: undefined, // the node ids in an array
	roots: undefined, // the root nodes id. there can be more than one.
	leaves: undefined, // the leaf nodes id

	hypothesis: undefined, // keeps the paths (hypothesis) already found
	stack: undefined, // a stack in order to go back after reaching the leaves. Node ids
	tempPath: undefined, // a temporal storage for the path as the edges are found
	paths: undefined, // set of paths found in the graph. for caching purposes

	config: {},

	statics: {
		test: function () {
			return 'HypothesisRunner.test working...';
		}
	},


	constructor: function(edges, nodes) {
		var me = this;
		this.edges = edges;
		this.nodes = nodes;

		this.nodesId = [];
		this.roots = [];
		this.leaves = [];
		this.edgesVisited = [];
		this.hypothesis = [];
		this.stack = [];
		this.tempPath = [];
		this.paths = [];

		Ext.each(nodes, function(node, index, nodeSet) {
			if (Ext.Array.contains(me.nodesId, node.id) == false)
				me.nodesId.push(node.id);
		});

		this.roots = this.getGraphRoots();
		this.leaves = this.getGraphLeaves();
	},


	/**
	 * Gets all possible paths in the depicted graph. In the end, an array of arrays
	 * of edges, representing all possible resolution paths in the graph, is returned.
	 * @return {Array} the array with all discovered paths, an array of paths. As every
	 * path is an array of edges, the returned value will be an array of arrays, like
	 * paths = [[e1-2, e2-4], [e1-3, e3-5, e5-6], ... ]
	 */
	graphWalker: function () {
		var me = this;
		Ext.each(this.roots, function (root, index, rootSet) {
			var edgesInRootBranch = true;
			var source = root;
			while (edgesInRootBranch) {
				var edgeFound = me.getEdge(source);
				if (edgeFound != null) { // continue building up the path
					me.edgesVisited.push(edgeFound); // mark as visited
					me.tempPath.push(edgeFound); // set as path component
					me.stack.push(source); // add to the stack in order to get back
					source = edgeFound.target;
				}
				else { // add the found path and/or just continue iterating depending on below
					// Check whether or not source is a leaf node has to be checked in order
					// to update the paths array: tempPat will be added to the array if source is leaf
					if (Ext.Array.contains(me.leaves, source)) {
						var newPath = me.tempPath.slice(0);
						me.paths.push(newPath);
					}

					// Remove the edges with the current source as origin from visited
					// if the current source has more than one parent.
					// Necessary to be able to walk the edges again from the other parent's branch
					var sourceParents = me.getParentsForNode(source);
					if (sourceParents.length > 1) {
						Ext.each(me.edgesVisited, function (edge, index, edges) {
							if (source == edge.source)
								Ext.Array.remove(me.edgesVisited, edge);
						})
					}

					me.tempPath.pop();
					source = me.stack.pop();
				} // EO if-else

				edgesInRootBranch = !(source === undefined);
			} // EO while
		});

		return me.paths;
	},



	/**
	 * It gets the first edge in the edges array which is not in the visitedEdges and
	 * its source property is equals to the parameter.
	 * @param {Integer} source, the id of the source node of the edge
	 * @return {Object} an edge object or null if no edge has such a id as source
	 */
	getEdge: function(source) {
		var foundEdge = null;
		var me = this;
		var containsTarget, containsVisited;
		// The conditions to get the right edge are, basically, not to be among the visited ones
		// and, to deal with selected nodes, the target node is inside the (sub)set of
		// selected nodes
		Ext.each(this.edges, function (edge, index, edgeSet) {
			containsVisited = Ext.Array.contains(me.edgesVisited, edge);
			containsTarget = Ext.Array.contains(me.nodesId, edge.target);
			if (edge.source == source && !containsVisited && containsTarget) {
				foundEdge = edge;
				return false;
			}
		});
		return foundEdge;
	},



	/**
	 * On every run, the roots of the graph/tree has to be calculated as the graph
	 * could be changed since the last time and/or the root can be not the very first
	 * source in the very first edge in the edge's array. Then, the roots for the graph
	 * are defined as the nodes which are not target in any edge.
	 * @return {Array} an array with the root nodes ids
 	 */
	getGraphRoots: function () {
		var targets = [];
		var me = this;
		Ext.each(this.edges, function (edge, index, edgeSet) {
			if (Ext.Array.contains(targets, edge.target) == false)
				targets.push(edge.target);
		});
		var roots = Ext.Array.difference(this.nodesId, targets);

		return roots;
	},


	/**
	 * Gets an array with the nodes which doesn't have children, which means those
	 * which aren't in the source part of any edge
	 * @return {Array} an array with the leaf nodes ids
	 */
	getGraphLeaves: function () {
		var sources = [];
		Ext.each(this.edges, function (edge, index, edgeSet) {
			if (Ext.Array.contains(sources, edge.source) == false)
				sources.push(edge.source);
		});
		var leaves = Ext.Array.difference(this.nodesId, sources);

		return leaves;
	},


	/**
	 * Gets the parents of the node represented by nodeId
	 * @param {Number} nodeId the node unique identifier
	 * @returns an array with the node parent ids
	 */
	getParentsForNode: function (nodeId) {
		var parents = [];
		Ext.each(this.edges, function (edge, index, edgeSet) {
			if (edge.target == nodeId)
				parents.push(edge.source);
		});

		return parents;
	},

	/**
	 * Gets the object nodes from their ids.
	 * @param {Array} ids an array of ids to get their related nodes
	 */
	getNodesFromIds: function (ids) {
		var nodeSet = new Array();
		Ext.each (this.nodes, function(node, index, nodes) {
			if (Ext.Array.contains(ids, node.id))
				nodeSet.push(node);
		});

		return nodeSet.length == 0? null: nodeSet;
	},


	/**
	 * It returns a node whose id matches with the id parameter.
	 * @param id
	 * @returns {Object} a node or null if no node with that id can be found
	 */
	getNodeFromId: function (id) {
		var mynode = null;
		Ext.each (this.nodes, function(node, index, nodes) {
			if (node.id == id) {
				mynode = node;
				return false;
			}
		});

		return mynode;
	},


	pathsToString: function () {
		var stringPaths = '';
		Ext.each(this.paths, function (path, index, paths) {
			var pathStr = HT.lib.Util.objToString(path, '');
			console.log(pathStr);
			console.log('=========');

			stringPaths += pathStr;
		});

		return stringPaths;
	},


	toString: function () {
		return 'Hypothesisrunner object...';
	}

})