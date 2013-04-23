/**
 * This is a lib with static methods to operate on a cytoscape instance
 */
Ext.define('HT.lib.CytoscapeActions', {
	requires: ['HT.lib.EdgeRuleFactory', 'HT.lib.EdgeRule', 'HT.lib.RuleOperation',
					'HT.lib.RuleFunctions', 'HT.lib.HypothesisRunner'],
	statics: {

		GENE: 1,
		PROTEIN: 2,
		COMPOUND: 3,
		DISEASE: 4,

		/**
		 * It converts the shape (rect, circle,...) into an entity (protein, compound, ...)
		 */
		shape2entity: {
			'circle': undefined,
			'square': undefined,
			'triangle': undefined,
			'diamond':  undefined
		},

		/**
		 * Converts from an entity string into an entity code
		 */
		convert2entity: {
			'protein': undefined,
			'compound': undefined,
			'disease': undefined,
			'gene':  undefined
		},



		/**
		 * Creates a new node in the flash cytoscape.
		 * @param vis the cytoscape visualization object (supporting all methods to change de graph)
		 * @param nodeData the json object with the node data, such that {id: 'id', label: 'label', payloadValue: whatever}
		 */
		createNode: function (vis, nodeData) {
			var newId = vis.nodes().length+1;
			var nodeLabel, nodeId;
			var nodeOpts;
			if (Ext.isObject(nodeData)) {
			//	nodeLabel = nodeData.label;
			//	nodeId = nodeData.id;
				nodeOpts = nodeData;
			}
			else {
				nodeLabel = nodeData;
				nodeId = vis.nodes().length+1;

				nodeOpts = {
					id: nodeId.toString(),
					label: nodeData,
					entity: HT.view.common.EntityLookup.entity[nodeData],
//					entity: 'protein',
					payloadValue: nodeData

				};
			}
			vis.addNode(50, 50, nodeOpts);

			var nm = vis.networkModel();

		},



		/**
		 * Creates a new (directed) edge between the nodes
		 * @param {org.cytoscapeweb.Visualization} vis the cytoscape Visualization instance
		 * @param {Array} nodes the (two) nodes to connect by the edge. These are the straight
		 * target objects as delivered by the Event object and stored in the selectionModel
		 */
		createEdge: function (vis, nodes) {
			var edges = vis.edges().length;
			var nodeOneId = nodes[0].data.id, nodeTwoId = nodes[1].data.id;
			var newEdge = undefined;

			// Check if the edge already exists
			var currentEdge = this.getEdgeFromNodes(vis.edges(), nodeOneId, nodeTwoId);
			if (currentEdge != null)
				return false;

			var edgeRule = HT.lib.EdgeRuleFactory.createRule(nodes[0].data, nodes[1].data);
			console.log('createEdge before edgeData...');
			var edgeData = {
				id: 'e'+nodeOneId.toString()+'-'+nodeTwoId.toString(),
				directed: true,
				source: nodeOneId.toString(),
				target: nodeTwoId.toString(),

				label: 'from '+nodeOneId+' to '+nodeTwoId,
        rule: edgeRule
				/*
				nodes[0].data = {
					id
					payloadValue
					label
					entity
				}
				rule: Ext.create('EdgeRule', {
					edgeSource: nodes[0].data,
					edgeTarget: nodes[1].data,
					ruleFunctions: [{
						alias: 'myFunc',
						result: undefined,
						threshold: undefined,
						func: function (a,b,thr) {
							var res = somethingToDoWith(a,b);
							res.match(thr) == true;
						}
					}]
				} // EO function object
				) // EO rule
				*/
//				color: '#FF0300'
			};
			console.log('Edge AFTER edgeData...');

			newEdge = vis.addEdge(edgeData, true);

			return newEdge;
		},



		/*
		 * It converts the shape (rect, circle,...) into an entity (protein, compound, ...)
		 * @param {String} shape an string representing the shape
		 * @return the entity who is represented by that shape
		 *
		shape2entity: function (shape) {

		},
    */




		/**
		 * Run the rules based on the edges on the graph. As the graph can have several
		 * paths, in order to walk all paths, after walking one edge, the next edge
		 *
 		 * @param vis
		 * @param nodes
		 * @param edges
		 */
		runGraph: function (vis, nodes, edges) {

			var runner = Ext.create('HT.lib.HypothesisRunner', edges, nodes);
			var paths = runner.graphWalker();

			// There are several paths in a graph, with several edges for every path
			// and one rule for every edges, with several function every rule
			Ext.each(paths, function(path, index, pathList) {
				Ext.each(path, function(edge, indexBis, edgeList) {
					var rule = edge.rule;
					var aliases = rule.ruleAliases;

					Ext.each(aliases, function(aliasObj, indexFunc, functionsList) {
						var opObj = HT.lib.RuleFunctions.getOperationFromAlias(aliasObj.alias);
						opObj.on('operationComplete', function (result) {
							console.log('operationComplete:'+aliasObj.result+ ' vs '+result);
							var labelResult = Ext.getCmp('labelResult');
							if (labelResult == null)
								alert ('No component was found');

							else if (labelResult === undefined)
								alert('A "class" was found...'+labelResult.toString());

							else // labelResult is an object
								labelResult.setText('result: '+aliasObj.result);

						});
						opObj.operation(rule.edgeSource.payloadValue,
							rule.edgeTarget.payloadValue, aliasObj.threshold, aliasObj);

						// actualFunc(rule.edgeSource.payloadValue, rule.edgeTarget.payloadValue, aliasObj.threshold, aliasObj)
					})
					/*
					Ext.each(functionObjs, function(aliasObj, indexFunc, functionsList) {
						var actualFunc = HT.lib.RuleFunctions.getFunctionFromAlias(aliasObj.alias);
						actualFunc(rule.edgeSource.payloadValue, rule.edgeTarget.payloadValue, aliasObj.threshold, aliasObj)
					})
          */
				})
			});

//			runner.pathsToString();
		},


		/**
		 * Returns the edge which goes from srcId to targetId or null if it does not exist
		 * @param edges
		 * @param srcId
		 * @param targetId
		 * @returns an edge object or null if does not exist
		 */
		getEdgeFromNodes: function (edges, srcId, targetId) {
			var edgeResult = null;
			Ext.each(edges, function(edge, index, edgeSet) {
				if (edge.data.source == srcId && edge.data.target == targetId) {
					edgeResult = edge;
					return false;
				}
			})
			return edgeResult;
		},

		getNodeFromId: function (nodes, id) {
			var nodeGot = null;
			Ext.each(nodes, function (node, index, theNodes) {
				if (node.id == id) {
					nodeGot = node;
					return false;
				}
			});
			return nodeGot;
		}

	}, // EO statics



	config: {},

	constructor: function (config) {
		this.initConfig(config);
		// this.superclass.constructor.call(this, config);

		/**
		 * It converts the shape (rect, circle,...) into an entity (protein, compound, ...)
		 */
		this.self.shape2entity = {
			'circle': this.self.PROTEIN,
				'square': this.self.COMPOUND,
				'triangle': this.self.DISEASE,
				'diamond':  this.self.GENE
		};

		/**
		 * Converts from an entity string into an entity code
		 */
		this.self.convert2entity = {
			'protein': this.self.PROTEIN,
				'compound': this.self.COMPOUND,
				'disease': this.self.DISEASE,
				'gene':  this.self.GENE
		};

		return this;
	}


})
