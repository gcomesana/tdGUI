
Ext.define ('TDGUI.view.panels.PanelButtons', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-panelbuttons',

  border: false,
  bodyPadding: '0 5 0 5',
  layout: {
    type: 'hbox',
    pack: 'end'
  },

  defaults: {
    margin: '0 0 0 5'
  },

  buttons: [{
      xtype: 'button',
      text: 'Left'
    }, {
      xtype: 'button',
      text: 'Right'
  }]

})
