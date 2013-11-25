/**
 * This is a container supporting the Flash implementation of cytoscape.
 */
Ext.define('HT.view.cytoscape.CytoScape', {
	extend: 'Ext.container.Container',
	alias: 'widget.cytoscape',

	networkModel: undefined,
	visOptions: {
		// where you have the Cytoscape Web SWF
		swfPath: "/javascripts/cytoscapeweb1.0.3/swf/CytoscapeWeb",
		// where you have the Flash installer SWF
		flashInstallerPath: "/javascripts/cytoscapeweb1.0.3/swf/playerProductInstall"
	},
	frame: false,
	vis: undefined,
	visualStyle: undefined,
	visualStyleBypass: undefined,

	selectionModel: [],

	initComponent: function () {
		this.callParent(arguments);
		this.on('afterrender', this.initCytoscape, this);

	},


	initCytoscape: function () {
		console.log('initCytoscape function...');
		var me = this;
		var div_id = this.getEl().id;

		this.vis = new org.cytoscapeweb.Visualization(div_id, this.visOptions);
		this.vis.draw({
			network: me.networkModel,
			edgeLabelsVisible: true,

			panZoomControlVisible: false // hide pan zoom
		});


		this.vis.ready(function () {
			console.log('ready function for graph...');
			var _srcId;

			if (me.ownerCt.privates.backupNodes.length > 0) {
				var myNodes = me.ownerCt.privates.backupNodes;
				var myEdges = me.ownerCt.privates.backupEdges;

				me.vis.addElements(myNodes.concat(myEdges), true);
				me.ownerCt.resetBackupItems();
			}

			if (me.visualStyle !== undefined)
				me.vis.visualStyle(me.visualStyle);

			if (me.visualStyleBypass !== undefined)
				me.vis.visualStyleBypass(me.visualStyleBypass);

			// Connect nodes through right button click
			me.vis.addContextMenuItem('Connect node...', 'nodes', function(evt) {
				var clickNodeToAddEdge = function (evt) {
					if (_srcId != null) {
						me.vis.removeListener("click", "nodes", clickNodeToAddEdge);
						// var e = me.vis.addEdge({ source: _srcId, target: evt.target.data.id }, true);
						var added = HT.lib.CytoscapeActions.createEdge(me.vis, me.selectionModel);
						if (added !== undefined) {
							var node1Id = me.selectionModel[0].data.id,
									node2Id = me.selectionModel[1].data.id;
							me.selectionModel.length = 0;
							_srcId = null;

							me.vis.deselect("nodes", [node1Id, node2Id]);
							me.networkModel = me.vis.networkModel();
						}
						// _srcId = null;
						// me.selectionModel.length = 0;
					}
				};
				_srcId = evt.target.data.id;
				me.selectionModel.push(evt.target);

				me.vis.removeListener("click", "nodes", clickNodeToAddEdge);
				me.vis.addListener("click", "nodes", clickNodeToAddEdge);
			}); // EO connect node


			// Delete a node
			me.vis.addContextMenuItem('Delete node', 'nodes', function (ev) {
				me.vis.visualStyleBypass(null);
				me.vis.removeNode(ev.target.data.id, true);
			});

			// Delete an edge
			me.vis.addContextMenuItem('Delete edge', "edges", function(ev) {
				me.vis.visualStyleBypass(null);
				var numEdges = me.vis.edges().length;
				me.vis.removeEdge(ev.target.data.id, true);
				console.log('edges before: '+numEdges+'; and later: '+me.vis.edges().length);
			});


			// PROCEDURE FOR JOINING TWO NODES /////////////
			// select event for nodes. if two nodes selected, one after another, an arrow is displayed
			if (!me.vis.hasListener('select', 'nodes')) {
				me.vis.addListener('select', 'nodes', function(ev) {
					me.selectionModel.push(ev.target[0]);
					// console.log('select: event target: '+ev.target[0].data.id+'; selectionModel.length: '+me.selectionModel.length);

					// THIS IS TO ADD AN EDGE JOINING THE NODES STRAIGHT AWAY
					if (me.selectionModel.length == 2) {
						// console.log('Adding edge and removing selected nodes');
						var added = HT.lib.CytoscapeActions.createEdge(me.vis, me.selectionModel);
						if (added !== undefined) {
							var node1Id = me.selectionModel[0].data.id,
									node2Id = me.selectionModel[1].data.id;
							me.selectionModel.length = 0;

							me.vis.deselect("nodes", [node1Id, node2Id]);
							me.networkModel = me.vis.networkModel();
						}
					}

				}); // EO addListener select!!
			}


			if (!me.vis.hasListener('deselect', 'nodes')) {
				me.vis.addListener("deselect", 'nodes', function (ev) {
					me.selectionModel.length = 0;
					// console.log('deselect: event target: '+ev.target[0].data.id+'; selectionModel.length: '+me.selectionModel.length);
				});
			}
// EO PROCEDURE FOR JOINING TWO NODES /////////////

			/* a mousout should be programmed to hide the tip...
			me.vis.addListener('mouseover', 'nodes', function(ev) {
				// console.log("on mouseover for "+ev.target.data.id);

				var containerPos = me.getPosition();
				var tipX = containerPos[0]+ev.target.x;
				var tipY = containerPos[1]+ev.target.y;


				var top = ev.target.rawY, left = ev.target.rawX;
				var tipMsg ='btnGene mouseover: x='+left+', y='+top+'!!';
				var myTip = Ext.create('Ext.tip.ToolTip', {
					html: tipMsg,
					width: 200,
					dismissDelay: 1000
				});
				myTip.showAt([tipX, tipY]);
				// tip.showAt([tipX, tipY]);
			});
      */

			// 1. First, create a function and add it to the Visualization object.
			me.vis["customTooltip"] = function (data) {
				var value = Math.round(100 * data["weight"]) + "%";
				value=data['label']+' jejejeje';

				return 'The position of this node is: ' +
					'<span style="font-color:#990099;font-size:medium">' + value + '</span>';
			};

// 2. Now create a new visual style (or get the current one) and register
//    the custom mapper to one or more visual properties:
			var style = me.vis.visualStyle();
			style.nodes.tooltipText = { customMapper: { functionName: "customTooltip" } },

// 3. Finally set the visual style again:
			me.vis.visualStyle(style);
			me.vis.nodeTooltipsEnabled(false);
/*
			var nodeOne = {
					id: '3',
					label: 'Tres',
					entity: 'gene',
					// shape: 'DIAMOND',
					payload: {
						data: 'some data'
					}
				},
				nodeTwo = {
					id: '4',
					entity: 'protein',
					label: 'Quatro',
					payload: {
						data: 'some four data'
					}
				};

			me.vis.addNode(40, 150, nodeOne);
			me.vis.addNode(150, 150, nodeTwo);

			me.vis.addEdge({source: nodeOne.id, target: nodeTwo.id}, true);
*/
		}); // EO vis.ready


	} // EO initCytoscape

});