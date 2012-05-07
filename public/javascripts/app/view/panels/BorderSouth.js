

Ext.define("TDGUI.view.panels.BorderSouth", {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-border-south',

  region: 'south',
  collapsible: true,
  split: true,
  height: 200,
  minHeight: 120,
  title: 'South',
  layout: {
    type: 'border',
    padding: 5
  },



  initComponent: function () {
    var me = this
console.info ('Initializing panels.BorderSouth...')
    me.items = [
      {
        title: 'South Central',
        region: 'center',
        minWidth: 80,
        html: 'South Central Arena'
      },
      {
        title: 'South Eastern',
        region: 'east',
        flex: 1,
        minWidth: 80,
        html: 'South Eastern',
        split: true,
        collapsible: true
      },
      {
        title: 'South Western',
        region: 'west',
        flex: 1,
        minWidth: 80,
        html: 'South Western<br>I collapse to nothing',
        split: true,
        collapsible: true,
        collapseMode: 'mini'
      }
    ]

    me.callParent (arguments)
  }

})
