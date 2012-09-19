Ext.define ('TDGUI.view.panels.west.HistoryPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-west-history',

//	region: 'center',
  split: 'true',
  minHeight: 60,
  html: 'West - Center',
  collapsible: true,
  collapseMode: undefined,
  collapseDirection: 'bottom',
  title: 'History',


  initComponent: function () {
  	var me = this
console.info ("Initializing panels.west.HistoryPanel comp...")

		me.callParent (arguments)
  }

})