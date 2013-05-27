

Ext.define("HT.view.draw.CanvasPanel", {
	extend: 'Ext.panel.Panel',
	alias: 'widget.canvaspanel',
	requires: ['HT.view.draw.DrawingCanvas'],

	title: 'What a mess',
	margins:'5 5 5 5',

	initComponent: function () {
		var canvas = this.createDrawingCanvas();
		var me = this;
		this.items = [
			canvas
		];

		canvas.on({
			afterrender: function (comp, opts) {
				var surface = canvas.surface;
				var square = surface.add({
					type: 'rect',
					fill: 'white',
					stroke: 'red',
					x: 10,
					y: 5,
					'stroke-width': 3,
					width: 100,
					height: 50
				});
				square.show(true);
			},
			scope: this
		});


		this.callParent(arguments);
	},

	createDrawingCanvas: function () {
		var dc = Ext.create ('HT.view.draw.DrawingCanvas', {
			x: 20,
			y: 110
		});

		return dc;
	}

})