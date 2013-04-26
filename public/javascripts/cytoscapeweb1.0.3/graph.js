var vis;
var addNode = function() {
	console.log("adding a node!!");
	var newId = vis.nodes().length+1
	var nodeOpts = {
		id: newId.toString(),
		label: "what a shit!!"
	};
	vis.addNode(100, 100, nodeOpts)
}

window.onload = function() {
	// id of Cytoscape Web container div
	var div_id = "cytoscapeweb";

	// you could also use other formats (e.g. GraphML) or grab the network data via AJAX
	var networkModel = {
		// you need to specify a data schema for custom attributes!
		dataSchema: {
			nodes: [{
				name: "label",
				type: "string"
			}, {
				name: "foo",
				type: "string"
			}],
			edges: [{
				name: "label",
				type: "string"
			}, {
				name: "bar",
				type: "string"
			}]
		},
		// NOTE the custom attributes on nodes and edges
		data: {
			nodes: [{
				id: "1",
				label: "1",
				foo: "Is this the real life?"
			}, {
				id: "2",
				label: "2",
				foo: "Is this just fantasy?"
			}],

			edges: [{
				id: "2to1",
				target: "1",
				source: "2",
				label: "2 to 1",
				bar: "Caught in a landslide..."
			}]
		}
	};

	var evClickData = {
		group: "nodes",
		mouseX: 216.45,
		mouseY: 161.05,
		target: {
			borderColor: "#666666",
			borderWidth: 1,
			color: "#f5f5f5",
			data: {
				foo: "Is this just fantasy?",
				id: "2",
				label: "2",
				parent: null,
			},
			__proto__: Object,
			group: "nodes",
			height: 25,
			nodesCount: 0,
			opacity: 0.796875,
			rawX: 211.45,
			rawY: 165.05,
			shape: "ELLIPSE",
			size: 25,
			visible: true,
			width: 25,
			x: 211.45,
			y: 165.05,
			zIndex: 3
		}
	};

	// initialization options
	var options = {
		// where you have the Cytoscape Web SWF
		swfPath: "swf/CytoscapeWeb",
		// where you have the Flash installer SWF
		flashInstallerPath: "swf/playerProductInstall"
	};

	// init and draw
	vis = new org.cytoscapeweb.Visualization(div_id, options);
	vis.draw({
		network: networkModel,

		panZoomControlVisible: false // hide pan zoom
	});

	vis.ready(function() {
		console.log("graph displayed...");
		/*
		vis.addListener('click', 'nodes', function(ev) {
			console.log("this is a node click!!");
		});
		*
		vis.addListener('select', 'nodes', function(ev) {
			console.log("this is a node selection!!");
		});
		*/
		vis.addContextMenuItem("Delete node", "nodes", function(evt) {
			vis.removeNode(evt.target.data.id, true);
		}).addContextMenuItem("Delete edge", "edges", function(evt) {
			vis.removeEdge(evt.target.data.id, true);
		}).addContextMenuItem("Delete selected", function(evt) {
			var items = vis.selected();
			if (items.length > 0) {
				vis.removeElements(items, true);
			}
		});

		vis.addContextMenuItem("Select first neighbors", "nodes", function(evt) {
			// Get the right-clicked node:
			var rootNode = evt.target;

			// Get the first neighbors of that node:
			var fNeighbors = vis.firstNeighbors([rootNode]);
			var neighborNodes = fNeighbors.neighbors;

			// Select the root node and its neighbors:
			vis.select([rootNode]).select(neighborNodes);
		});

		vis.addContextMenuItem("Change label", "nodes", function(evt) {
			evt.target.data.label = "New label!!!"; // this is mostly readonly regarding to the network model
			var theNode = vis.node(evt.target.data.id);
			theNode.data.label = "New fucking label!!!";
			vis.updateData([theNode]);

			console.log("changing a label from '"+evt.target.data.label+"'...");
		});

		vis.addContextMenuItem('Connect node...','nodes', function(evt) {
			var _srcId;
			var clickNodeToAddEdge = function (evt) {
				if (_srcId != null) {
					vis.removeListener("click", "nodes", clickNodeToAddEdge);
					var e = vis.addEdge({ source: _srcId, target: evt.target.data.id }, true);
					_srcId = null;
				}
			}

			_srcId = evt.target.data.id;
			vis.removeListener("click", "nodes", clickNodeToAddEdge);
			vis.addListener("click", "nodes", clickNodeToAddEdge);
		})
	});
}