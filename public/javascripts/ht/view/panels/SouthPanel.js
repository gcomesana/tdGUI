Ext.define('HT.view.panels.SouthPanel', {

	extend:'Ext.panel.Panel',
	alias:'widget.southpanel',

	requires:[],

	margins:'5 5 5 5',

	cls:'preview',

	initComponent:function () {
		this.items = [
			{
				xtype:'panel',
				// title: 'South panel'
				frame:false,
				frameHeader:false,
				html:'<div class="preview" style="border-width: 0px">this is the html for the south panel</div>'
			}
		];

		this.callParent(arguments);
	}
})
