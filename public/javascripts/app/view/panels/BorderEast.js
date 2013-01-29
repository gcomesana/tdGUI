/**
 * @class TDGUI.view.panels.BorderEast
 * @extends Ext.panel.Panel
 * @alias widget.tdgui-border-east
 *
 * Panel to set in the east region of the viewport in the case of using it
 */
Ext.define ('TDGUI.view.panels.BorderEast', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-border-east',


	region: 'east',
  collapsible: true,
	floatable: true,
	split: true,
	width: 200,
	minWidth: 120,
	minHeight: 140,
	title: 'East',
	
	layout: {
		type: 'vbox',
		padding: 5,
		align: 'stretch'
	},
	


	initComponent: function () {
		var me = this
console.info ("Initializing panels.BorderEast comp...")

		me.items = [{
				xtype: 'textfield', // TODO remove when bothering
				labelWidth: 70,
				fieldLabel: 'Text field'  
			}, {
		    xtype: 'component',
		    html: 'I am floatable'
		}]

		me.callParent (arguments)
	}

})