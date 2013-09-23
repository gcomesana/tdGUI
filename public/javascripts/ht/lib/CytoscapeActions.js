/**
 * This is a lib with static methods to operate on a cytoscape instance
 */
Ext.define('HT.lib.CytoscapeActions', {
	requires: ['HT.lib.EdgeRuleFactory', 'HT.lib.EdgeRule', 'HT.lib.operation.RuleOperation',
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
		convert2entity: function (entityName) {
			var entity = -1;
			switch (entityName) {
				case 'protein':
					entity = HT.lib.CytoscapeActions.PROTEIN;
					break;

				case 'compound':
					entity = HT.lib.CytoscapeActions.COMPOUND;
					break;

				case 'disease':
					entity = HT.lib.CytoscapeActions.DISEASE;
					break;

				case 'gene':
					entity = HT.lib.CytoscapeActions.GENE;
					break;

				default:
					entity = HT.lib.CytoscapeActions.PROTEIN;
					break;
			}

			return entity;
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
			var entitySrc = nodes[0].data.entity, entityTrg = nodes[1].data.entity;

			if ((entitySrc == 'disease' && entityTrg == 'disease') ||
					(entitySrc == 'compound' && entityTrg == 'compound') ||
					(entitySrc == 'gene' && entityTrg == 'gene')) {
				Ext.Msg.show({
					title: 'Relationship warning',
					msg: "Relationship <b>"+entitySrc+"-"+entityTrg+ "</b> not suitable",
					width: 350,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.WARNING
				});
				return;
			}


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

				// label: 'from '+nodeOneId+' to '+nodeTwoId,
				label: '',
        rule: edgeRule
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

			// This is to paint the edge on operation completion
			vis.visualStyleBypass(null);
			var bypassedEdges = [];
			var bypassEdge = function (edge, color) {
				// var cytovis = vis;
				bypassedEdges.push({edge:edge, color: color});
				var bypass = {
					nodes: {},
					edges: {
					}
				};

				for (i=0; i<bypassedEdges.length; i++) {
					var edge = bypassedEdges[i].edge;
					bypass.edges[edge.data.id] = {
						color: bypassedEdges[i].color
					};
				}
				vis.visualStyleBypass(bypass);
			}

			var addResult2List = function (result) {
				var resultsList = Ext.getCmp('resultsList');
				var resultsStore = resultsList.getStore();

				var rec = Ext.create('HT.model.ResultMessage', {msg: result.msg});
				resultsStore.add(rec);

				resultsList.getView().refresh();
			}



			// There are several paths in a graph, with several edges for every path
			// and one rule for every edges, with several function every rule
			vis.visualStyleBypass(null); // remove bypass; reset the graph colors
			var edgesVisited = [];
			Ext.each(paths, function(path, indexPath, pathList) {
				var edgeIndex = 0;
				var cytoscapePanel = Ext.ComponentQuery.query('cytoscape')[0];

				cytoscapePanel.setLoading(true);
				Ext.getCmp('actionsBtn').disable();
				Ext.getCmp('clearBtn').disable();
/*
				var pathStr = "";
				Ext.each(path, function (e, i, el) {
					pathStr += e.id +" -> ";
				});
				console.log("Current path: "+pathStr);
*/
				Ext.each(path, function(edge, indexBis, edgeList) {
					var rule = edge.rule;
					var aliases = rule.ruleAliases;

					console.log (edge.id + " vs [" + edgesVisited.join(',')+"]");
					if (Ext.Array.contains(edgesVisited, edge.id))
						return 1;
					else
						edgesVisited.push(edge.id);

					Ext.each(aliases, function(aliasObj, indexFunc, functionsList) {
						var opObj = HT.lib.RuleFunctions.getOperationFromAlias(aliasObj.alias);

						opObj.clearListeners();
						// Result is like {result: result, hypothesis: true|false, edge: theedge, msg: aMessage}

						try {
							opObj.on('operationComplete', function (result) {
								var myEdge = vis.edge(result.edgeId);
								console.log('operationComplete:'+aliasObj.result+ ' vs '+result.result+' for edge '+myEdge.label);

								if (result.hypothesis)
									bypassEdge(myEdge, 'green');
								else
									bypassEdge(myEdge, 'red');

								addResult2List (result);
								
/*
								var resultsPanel = Ext.getCmp('resultsPanel');
								// resultsPanel.update(result.msg);
								var resultsPanelDiv = Ext.get('resultsPanelDiv');
								var oldHtml = resultsPanel.body.dom.innerHTML;
								// oldHtml = resultsPanelDiv.dom.innerHTML;
								resultsPanel.update('');
								if (oldHtml != "")
									resultsPanel.update(oldHtml + '<br/><br/>'+result.msg);
									// resultsPanelDiv.update(oldHtml + '<br/><br/>'+result.msg);
								else 
									resultsPanel.update('<br/>'+result.msg);

								resultsPanel.setBodyStyle('height', '70%');
*/
								// Hide the mask...
								if (indexFunc == functionsList.length-1 &&
										indexBis == edgeList.length-1 && indexPath == pathList.length-1) {
									cytoscapePanel.setLoading(false);

									Ext.getCmp('actionsBtn').enable();
									Ext.getCmp('clearBtn').enable();
								}

							});
							opObj.operation(rule.edgeSource, rule.edgeTarget, aliasObj.threshold, aliasObj);
						}
						catch (e) {
							Ext.MessageBox.show({
								title: 'Graph enactor',
						    msg: 'There was an error while enacting the graph. Please, try again later.',
						    closable: false,
						    width: 300,
						    buttons: Ext.Msg.OK,
						    fn: function () {
						    	cytoscapePanel.setLoading(false);
						    },
						    icon: Ext.window.MessageBox.INFO
							})
						} // EO try-catch

					}) // EO each
					edgeIndex++;

					/*
					Ext.each(functionObjs, function(aliasObj, indexFunc, functionsList) {
						var actualFunc = HT.lib.RuleFunctions.getFunctionFromAlias(aliasObj.alias);
						actualFunc(rule.edgeSource.payloadValue, rule.edgeTarget.payloadValue, aliasObj.threshold, aliasObj)
					})
          */
				})
			});
			if (vis.selected().length > 0)
				vis.deselect();
			
//			runner.pathsToString();
		}, // EO rungraph



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
