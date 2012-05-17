

Ext.define ('TDGUI.view.panels.BorderCenter', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.tdgui-border-center',

	region: 'center',
  layout: 'border',
  border: false,


  initComponent: function () {
  	var me = this
console.info ("Initializing panels.BorderCenter comp...")

	  me.items = [{
      region: 'center',
      html: 'center center (center up)',
      title: 'Center',
      minHeight: 80,

      items: [cw = Ext.create ('Ext.Window', { // TODO delete when disturbing
          xtype: 'window',
          closable: false,
          minimizable: true,
          title: 'Constrained Window',
          height: 200,
          width: 400,
          constrain: true,
          html: 'I am in a Container',
          itemId: 'center-window',
          minimize: function() {
            this.floatParent.down('button#toggleCw').toggle();
          }
        }) // EO create window
      ], // invisible items (a hidden window) for the center center panel

      dockedItems: [{
          xtype: 'toolbar',
          dock: 'bottom',
          items: [
            'Text followed by a spacer', ' ', {
              itemId: 'toggleCw',
              text: 'Constrained Window',
              enableToggle: true,
              toggleHandler: function() {
                cw.setVisible(!cw.isVisible());
              }
            }
          ] // EO items
        }
      ] // EO dockedItems
    } /* ,
    { // minipanel south /////////////////////////////
      region: 'south',
      height: 100,
      split: true,
      collapsible: true,
      title: 'Splitter above me',
      minHeight: 60,
      html: 'center south (center down)'
    } */
  	]

 		me.callParent (arguments)
	} // EO initComponent

})