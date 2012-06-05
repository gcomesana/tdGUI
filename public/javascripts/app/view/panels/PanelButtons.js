
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

  rightButtonName: '',
  leftButtonName : '',


  initComponent: function () {
    var me = this
    var btnLeft = 'Left', btnRight = 'Right'

    btnRight = this.rightButtonName == null || this.rightButtonName == '' ? btnRight: this.rightButtonName
    btnLeft = this.leftButtonName == null || this.leftButtonName == '' ? btnLeft: this.leftButtonName

    this.buttons = [{
        xtype: 'button',
        text: btnLeft,
        id: 'panelBtnLeft'
      }, {
        xtype: 'button',
        text: btnRight,
        id: 'panelBtnRight'
    }]

    me.callParent (arguments)
  }

})
