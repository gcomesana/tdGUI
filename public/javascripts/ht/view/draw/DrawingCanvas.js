/**
 * Container to paint forms
 */
Ext.define("HT.view.draw.DrawingCanvas", {
	extend:'Ext.draw.Component',
	alias:'widget.drawing-canvas',

	viewBox: false,
	autoSize: false,

	listeners: {
		afterrender: function (comp, evOpts) {
			// console.log('afterRender drawingCanvas: '+comp.surface.items.length+' items');
			// this.initEvents();
		},


		resize: function (draw, width, height) {

			var drawCompSize = draw.getSize();
			// console.log ('resize on DrawingCanvas ('+draw.$className+') measures -> w:'+drawCompSize.width+'; h: '+drawCompSize.height);
			/*
			draw.surface.items.first().animate({
				to: {
					x: width / 2,
					y: height / 2
				},
				duration: 50
			})
			*/
		}

	},

	initEvents: function () {
//		console.log('Dr   awingCanvas.initEvents for resize...: '+this.surface.items.length);

	}

	/*
	 initComponent: function () {
	 var me = this;
	 var myitems = [];
	 console.log("a ver...");

	 var x = 20, y = 0;
	 for (i=0; i<4; i++) {
	 var square = {
	 type: 'rect', //this will draw a rectangle
	 width: 100,
	 height: 100,
	 radius: 10, //border radius
	 fill: 'green', //the fill color of the shape
	 opacity: 0.5,
	 x: x,
	 y: y,
	 stroke: 'red', //the stroke color
	 'stroke-width': 2
	 };

	 myitems.push(square);
	 y += 110;
	 }

	 this.items = myitems;

	 this.callParent(arguments);
	 }
	 */
})
