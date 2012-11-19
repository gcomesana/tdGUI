
Ext.define('TDGUI.view.panels.GraphTabPanel', {
	extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-graphtabpanel',
  require: ['TDGUI.view.panels.GraphDataPanel', 'TDGUI.view.common.panels.GraphInfoPanel',
            'TDGUI.view.common.ItemMultilist'],

	title: 'Graph Tab Panel',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	defaults: {
		margin: '5 5 5 5'
	},

	interactionData: [],

  confVal: 0.43,
  maxNodes: 5,
  targetAcc: undefined,

	initComponent: function() {
		var me = this

		var ivPanel = Ext.create('TDGUI.view.panels.GraphDataPanel', {
			flex: 3,
      targetAcc: me.targetAcc,
      maxNodes: me.maxNodes,
      confVal: me.confVal
		});
/*
		var infoPanel = Ext.create('TDGUI.view.common.panels.GraphInfoPanel', {
		});
*/
    var infoPanel = Ext.create ('TDGUI.view.common.panels.GraphInfoPanel', {
      listName: 'Content list',
      id: 'the-graph-infopanel'
    })

		this.items = [
			ivPanel, // panel with graph + .well message
			infoPanel // panel with information about selection (by clicking or hovering over)
		];
//		ivPanel.initGraph(ivPanel);
/*		ivPanel.addListener('graphCompleted', function(evName, opts) {
			// this callback is run in the context of the event emitter
			console.log('graphCompleted event...')
			me.interactionData = ivPanel.interactionData
		});
*/
		this.callParent(arguments);
	}
})