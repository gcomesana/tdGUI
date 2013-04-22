/**
 * Just a textbox + button ready to embed whatever...
 */
Ext.define('HT.view.common.TextboxButton', {
	extend: 'Ext.container.Container',
	alias: 'widget.textbox-btn',

	bodyPadding: '0 0 10 0',
	margin: '10 5 10 5',
	border: false,
	layout: 'column',

	config: {
		emptyText: 'nothing', // empty text for the textfield
		metaInfo: '', // meta-information addressed on semantics for this element
		// button callback. by default, trigger an event with this component as source
		btnCallback: function (btn, evOpts) {
			var thisComp = btn.up();
			btn.suspendEvents();
			var myEvOpts = {
				value: thisComp.getComponent(0).getValue(),
				meta: thisComp.getMetaInfo(),
				id: thisComp.getId()
			};
			thisComp.fireEvent('click', thisComp, myEvOpts);
			btn.resumeEvents();
		},

		btnText: '_' // text for the button
	},

	constructor: function (config) {
		this.initConfig(config);

		this.superclass.constructor.call(this, config);
	},

	initComponent: function () {

		this.items = [{
			xtype: 'textfield',
			columnWidth: .80,
			enableKeyEvents: true,
			emptyText: this.getEmptyText()
		}, {
			xtype: 'button',
			text: this.getBtnText(),
			columnWidth: .20,
			handler: this.getBtnCallback()
		}]; // EO items

		this.callParent(arguments);
	},

	getTextbox: function () {
		return this.getComponent(0);
	},

	getButton: function () {
		return this.getComponent(1);
	}
})

