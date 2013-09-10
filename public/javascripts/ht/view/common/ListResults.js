
Ext.define('HT.view.common.ListResults', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.listresults',
	requires: ['HT.store.ResultsMessages'],

	// title: 'Simple ListView <i>(0 items selected)</i>',
	// renderTo: Ext.getBody(),
	border: false,
	viewConfig: {
		emptyText: 'No results to display yet'
	},

	// store: undefined,
	columns: [{
			// text: 'Result message',
			flex: 1,
			dataIndex: 'msg'
		}
	],

	listeners: {
		beforerender: {
			fn: function (comp, evOpts) {

			}
		}
	},

	initComponent: function () {
		var me = this;
		/*
		 this.listeners = {

		 };
		 */

		this.callParent(arguments);
	}
})