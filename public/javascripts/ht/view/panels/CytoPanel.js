
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
						'HT.view.common.EntityLookup'],

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

	items: [{
		xtype: 'cytoscape',
		networkModel: graphModel,
		flex: 7,
		visualStyle: myVisualStyle
	}, {
		xtype: 'container',
		// html: 'controls here',
		flex: 3,
		layout: {
			type: 'vbox'
		},
		items: [{
			xtype: 'container',
			width: '100%',
			style: {
				backgroundColor: 'lightgray',
				padding: '10 10 10 10',
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
		}, { // EO entity-lookup 1
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
		}, { // EO entity-lookup 1
			xtype: 'entity-lookup',
			style: {
				// backgroundColor: 'yellow'
			},
			id: 'entityDise',
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
			style: {
				marginTop: 20,
				backgroundColor: 'yellow'
			},

			layout: 'column',

			width: '100%',
			items: [ {
				columnWidth: 0.7,
				items:[{
					xtype: 'button',
					text: 'Enact',

					id: 'btnEnact'
				}]
				/*style: {
					marginLeft: 15
				} */
			}, {
				columnWidth: 0.3,
				items: [{
					xtype: 'button',
					text: 'Enact selected',

					id: 'btnEnactSel'
				}]
			}, {
				xtype: 'label',
				id: 'labelResult',
				text: 'result: labelresult',
				margin: '0 0 0 10'
			}]
		} // EO container
		] // EO UPPER container items

	}],


	initComponent: function () {
		this.networkModel = graphModel;
		this.callParent(arguments);

		var controls = this.getComponent(1);
		// var textbox = controls.down('textbox-btn');
		// textbox.hide();

		// controls.down('#txtBtnCanvas').hide();
		/*
		controls.on('afterrender', function (comp, evOpts) {
			var drawComp = comp.down('drawing-canvas');
			var controlsWidth = drawComp.getWidth();
			var x = Math.floor(controlsWidth/2);
			drawComp.surface.add({
				type: 'circle',
				fill: '#79BB3F',
				radius: 20,

				x: 20,
				y: 50,
				listeners: {
					click: function (comp, evOpts) {
						var drawCompSize = drawComp.getSize();
						console.log ('click on drawComp ('+drawComp.$className+') measures -> w:'+drawCompSize.width+'; h: '+drawCompSize.height);
						// this.suspendEvents(true);
						// this.resumeEvents();

						var textSprite = drawComp.surface.items.items[1];
						drawComp.surface.setText(textSprite, 'got it!!!');

						drawComp.hide();
						controls.down('#txtBtnCanvas').show();
					}
				}
			}).show(true);
			drawComp.surface.add({
				type: 'text',
				text: 'this is only a test',
				font: '18px Arial',
				x: 20,
				y: 70
				// x: 100
			}).show(true);

			*/



			/*
			drawComp.on('resize', function (draw, width, height, oldWidth, oldHeight) {
				console.log("drawComp resized...");
				draw.surface.items.first().animate({
					to: {
						x: width / 2,
						y: height / 2
					},
					duration: 50
				})
			});

			drawComp.on ('afterrender', function (comp, evOpts) {
				console.log ('onAfterRender drawComp...');
			});


		});*/
	}

})
