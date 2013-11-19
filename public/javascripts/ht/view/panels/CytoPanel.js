
var graphModel = {
	// you need to specify a data schema for custom attributes!
	dataSchema: {
		nodes: [{
			name: "label",
			type: "string"
		}, {
			name: "id",
			type: "string"
		}, {
			name: 'payloadValue',
			type: 'object'
		}, {
			name: 'entity',
			type: 'string' // type: 'number'
		}, {
			name: 'tags', // comma-separated match terms, like tags here
			type: 'string'
		}],

		edges: [{
			name: "label",
			type: "string"
		}, {
			name: "rule",
			type: "object"
		}]
	},

	/* NOTE the custom attributes on nodes and edges
	data: {
		nodes: [{
			id: "1",
			label: "1",
			entity: 'compound',
			foo: "Is this the real life?"
		}, {
			id: "2",
			label: "2",
			entity: 'disease',
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
	*/
	data: {}
};


var tip = Ext.create('Ext.tip.ToolTip', {
	html: 'A very simple tooltip',
	width: 200,
	dismissDelay: 100
});

var shapeMapper = {
	attrName: 'entity',
	entries: [
		{attrValue: 'protein', value: 'CIRCLE'},
		{attrValue: 'compound', value: 'RECTANGLE'},
		{attrValue: 'disease', value: 'TRIANGLE'},
		{attrValue: 'gene', value: 'DIAMOND'}
	]
};

var colorMapper = {
	attrName: 'entity',
	entries: [
		{attrValue: 'protein', value: '#FFC0CB'},
		{attrValue: 'compound', value: '#90ee90'},
		{attrValue: 'disease', value: 'blue'},
		{attrValue: 'gene', value: 'orange'}
	]
};

var borderColorMapper = {
	attrName: 'entity',
	entries: [
		{attrValue: 'protein', value: 'black'},
		{attrValue: 'compound', value: '#00008B'},
		{attrValue: 'disease', value: '#ADD8E6'},
		{attrValue: 'gene', value: 'red'}
	]
};


var myVisualStyle = {
	global: {
		tooltipDelay: 100
	},
	nodes: {
		/*
		 entity: {
		 passthroughMapper: {
		 attrName: "shape"
		 }
		 },*/
		size: 48,
		shape: {discreteMapper: shapeMapper},
		tooltipText: "this fucking node",
		borderWidth: 2,
		selectionColor: 'black',
		selectionGlowColor: "#FF151A",
		selectionGlowStrength: 50,
		color: {discreteMapper: colorMapper},
		borderColor: {discreteMapper: borderColorMapper}
		//	borderColor: "red"
	},
	edges: {
		width: 2,
		selectionColor: 'black',
		selectionGlowColor: '#FF151A',
		selectionGlowStrength: 50
		// label: customMapper...
	}
} // visualStyle for CytoScape!!!!!





/**
 * A panel with two containers: one container is the cytoscape itself, the
 * other controllers to do operations on the graph
 */
Ext.define('HT.view.panels.CytoPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.cytopanel',
	requires: ['HT.view.cytoscape.CytoScape', 'HT.view.common.TextboxButton',
						'HT.view.common.EntityLookup', 'HT.store.ResultsMessages',
						'HT.view.common.ListResults'],

	networkModel: undefined,

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	defaults: {
		margin: '10 10 10 10',
		border: true,
		style: {
			borderColor: 'grey',
			borderStyle: 'solid',
			borderWidth: 1
		}
	},

	style: {
		zIndex: 999
	},

	items: [{
		xtype: 'cytoscape',
		networkModel: graphModel,
		flex: 7,
		visualStyle: myVisualStyle
	}, {
		xtype: 'container', // right side of the application
		// html: 'controls here',
		flex: 3,
		layout: {
			type: 'vbox',
			autoSize: true
		},
		items: [{
			xtype: 'container',
			width: '100%',
			style: {
				backgroundColor: 'lightgray',
				padding: '5px 5px 5px 5px',
				marginBottom: 20
			},
			html: '<span style="font-family: Arial; font-size: 24px; font-weight: bold">Entities</span>'

		}, {
			xtype: 'entity-lookup',
			id: 'entityProt',
			entity: 'protein',
			style: {
				// backgroundColor: 'yellow'
			},
			btnText: 'Add',
			emptyText: 'Protein...',
			shape: {
				type: 'circle',
				fillColor: 'pink',
				strokeColor: 'black',
				pos: {x: 20, y: 20}
			}
		}, { // EO entity-lookup compound
			xtype: 'entity-lookup',
			id: 'entityComp',
			entity: 'compound',
			btnText: 'Add',
			emptyText: 'Compound...',
			shape: {
				type: 'rect',
				// radius: 15,
				size: {w:30, h:30},
				fillColor: 'lightgreen',
				strokeColor: 'darkblue',
				pos: {x: 5, y: 5}
			}
		}, { // EO entity-lookup disease
			xtype: 'entity-lookup',
			style: {
				// backgroundColor: 'yellow'
			},
			id: 'entityDisease',
			entity: 'disease',
			btnText: 'Add',
			emptyText: 'Disease...',
			shape: {
				type: 'triangle',
				// radius: 15,
				size: {w:30, h:30},
				fillColor: 'blue',
				strokeColor: 'lightblue',
				pos: {x: 5, y: 5}
			}
		}, {
			xtype: 'entity-lookup',
			style: {
				// backgroundColor: 'lightgreen'
			},
			id: 'entityGene',
			entity: 'gene',
			btnText: 'Add',
			emptyText: 'Gene...',
			shape: {
				type: 'diamond',
				// radius: 15,
				size: {w:24, h:24},
				fillColor: 'orange',
				strokeColor: 'red',
				pos: {x: 11, y: 6}
			}
		}, {
			xtype: 'container',
			// border: false,
			margin: '15 0 0 0',
			style: {
				marginTop: 20,
				borderTopWidth: '1px',
				borderTopColor: 'black',
				borderTop: true
				// backgroundColor: 'yellow'
			},

			// layout: 'column',
			layout: {
				type: 'hbox',
				padding:'5',
				pack:'end',
				align:'middle'
      },

			width: '100%',
			defaults: {
				margin: '0 5 0 5'
			},

			items: [{
				xtype: 'button',
				text: 'Actions',
				id: 'actionsBtn',
				menu: [{
					text: 'Enact',
					id: 'btnEnact'
				}/*, {
					text: 'Enact selected',
					id: 'btnEnactSel'
				}*/]
			}, {
				xtype: 'button',
				text: 'Clear',
				id: 'clearBtn',
				menu: [{
					text: 'Reset fields',
					id: 'btnClearFields',
					listeners: {
						click: {
							fn: function (btn, evOpts) {
								console.log('clicked reset: id: '+btn.getId());
								// var items = this.up().up().items.items;
								var items = Ext.ComponentQuery.query('entity-lookup');
								Ext.each(items, function (item, index, itemList) {
									if (item.xtype == 'entity-lookup') {
										item.items.items[1].items.items[0].reset(); // reset the combo!!
										item.items.items[1].items.items[1].disable(); // disable the button
									}
								});

							}
						}
					}
				}, {
					text: 'Clear graph',
					id: 'btnClearGraph',
					listeners: {
						click: {
							fn: function (btn, evOpts) {
								var cytoscape = Ext.ComponentQuery.query('cytoscape')[0];
								cytoscape.vis.removeElements();
								cytoscape.vis.visualStyleBypass(null);

								var resultsList = Ext.getCmp('resultsList');
								var resultsStore = resultsList.getStore();
								var recordCount = resultsStore.getCount();

								resultsStore.remove(resultsStore.data.getRange(0, recordCount-1));
								resultsList.getView().refresh();
							}
						}
					}
				}] // EO menu
			}] // EO items for button container!!!

		}, { // EO container
			xtype: 'container',
			width: '100%',
			style: {
				backgroundColor: 'lightgray',
				padding: '5px 5px 5px 5px',
				margin: '50px 0px 0px 0px'
			},
			html: '<span style="font-family: Arial; font-size: 24px; font-weight: bold">Results</span>'
		}, { 
			xtype: 'panel',
			id: 'resultsPanel',
      maxHeight: 300,
      width: '100%',
      style: {
				backgroundColor: 'lightgray'
      },
      layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'end'
      },

			items: [{
        xtype: 'listresults',
        id: 'resultsList',
        // title: 'Enactment results',                                                                              
        store: Ext.create('HT.store.ResultsMessages'),
        width: '100%'

        // height: '80%'                                                                                            
      }]

			// EO container
		}] // EO UPPER container items

	}],

	clearResults: function () {
		
	},

	initComponent: function () {
		this.networkModel = graphModel;
		this.on ('beforedeactivate', this.onDeactivate, this);
		this.on ('beforeactivate', this.onActivate, this);
		this.callParent(arguments);

		var controls = this.getComponent(1);

	},



	onActivate: function (theComp, evOpts) {
		var myNodes = this.privates.backupNodes;
		if (this.privates.backupNodes.length > 0) {
			myNodes = Ext.Array.map(myNodes, function (item) {
				item.group = "nodes";
				return item;
			})
		}

		var myEdges = this.privates.backupEdges;
		if (this.privates.backupEdges > 0) {
			myEdges = Ext.Array.map(myEdges, function (edge) {
				edge.group = "edges";
				return edge;
			})
		}

		var cytoscape = this.items.getAt(0);
		var vis = cytoscape.vis;
/*
		if (myNodes.length > 0)
			vis.addElements(myNodes.concat(myEdges), true);
*/
	},



	onDeactivate: function (theComp, evOpts) {
		var cytoscape = this.items.getAt(0);
		var vis = cytoscape.vis;
//		var nm = cytoscape.networkModel;

		this.privates.backupNodes = vis.nodes();
		this.privates.backupEdges = vis.edges();

		console.log("CytoPanel.onDeactivate...");
	},


	privates: {
		backupNodes: [],
		backupEdges: []
	},


	resetBackupItems: function () {
		this.privates.backupNodes.length = 0;
		this.privates.backupEdges.length = 0;
	},


	getBackupNodes: function () {
		return this.privates.backupNodes;
	},


	getBackupEdges: function () {
		return this.privates.backupEdges;
	}

})
