Ext.define('HT.view.panels.ImageList', {
	extend:'Ext.panel.Panel',
	alias:'widget.imglist',
	requires: ['HT.view.draw.DrawingCanvas', 'Ext.toolbar.Toolbar'],

	title:'Images',
	collapsible:true,
	animCollapse:true,
	autoScroll: true,
	margins:'5 0 5 5',
	layout:'fit',
/*	layout: {
		type: 'vbox'
	},
  // no working with layout vbox and img+canvas....
*/
	items: [{
		xtype:'drawing-canvas'
	}, {
		xtype: 'image',
		scr: 'images/prism-base-hexagon.jpg',
		width: '100%',
		height: 100,
		padding: '10 5 10 5'
	}],

	listeners: {
		afterrender: function (comp, evOpts) {
			var drawComp = comp.getComponent(0);
			drawComp.surface.add({
				type: 'rect',
				width: 100,
				height: 50,
				radius: 10,
				fill: 'green',
				opacity: 0.5,
				stroke: 'red',
				'stroke-width': 2,
				x: 20,
				y: 20
			}).show(true);
		}
	},

	initComponent: function () {
		this.callParent(arguments);

	}
})
