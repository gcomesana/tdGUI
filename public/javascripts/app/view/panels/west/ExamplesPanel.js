Ext.define ('TDGUI.view.panels.west.ExamplesPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-west-examples',

//	region: 'south',
  split: true,
  minHeight: 160,
  height: 180,
  collapsible: true,
  html: 'West - South',
  title: 'Examples',
  collapsed: true,


	initComponent: function () {
  	var me = this
console.info ("Initializing panels.west.ExamplesPanel comp...")

		me.callParent (arguments)
  }
})