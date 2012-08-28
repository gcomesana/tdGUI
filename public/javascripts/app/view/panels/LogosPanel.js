Ext.define('TDGUI.view.panels.LogosPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-logospanel',

  requires: [],

  frame: false,
  border: false,

  layout: {
    type: 'hbox',
    align: 'middle'
  },


  initComponent: function () {
    var me = this

    this.items = [
      this.createLeftLogo(),
      this.createRightLogos()
    ]

    this.callParent(arguments)
  },


  createLeftLogo: function () {
/*
    var td_logo = Ext.create('Ext.Img', {
      src: '/images/TD-logo-web.png',
//      bodyStyle:{background:'transparent'},
      height: 70,
      width: 194
    })
*/
    this.leftPanel = Ext.create('Ext.panel.Panel', {
      border: false,
      frame: false,
      flex: 1,
      height: '100',

      layout: {
        type: 'hbox',
        padding: '0 8 0 8',
//        pack: 'end',
        align: 'middle',
        defaultMargins: {
          top: 10,
          right: 20,
          bottom: 10,
          left: 0
        }
      },

      items: [Ext.create ('Ext.Img', {
          xtype: 'img',
          src: '/images/td-logo-new.png',
//          bodyStyle: {background: ''}
        })
      ]
    })

    return this.leftPanel
  },


  createRightLogos: function () {
    var ops_logo = Ext.create('Ext.Img', {
      src: '/images/ops-on.png',
      bodyStyle: {background: 'transparent'},
      height: 75,

      padding: '0 110 0 0'
    })

    var inb_logo = Ext.create('Ext.Img', {
      src: '/images/inb-on.png',
      bodyStyle: {background: 'transparent'},
      height: 77,
      width: 75,

    })

    var cnio_logo = Ext.create('Ext.Img', {
      src: '/images/cnio-on.png',
      bodyStyle: {background: 'transparent'},
      height: 73,
      width: 75

    })


    this.rightPanel = Ext.create('Ext.panel.Panel', {
      border: false,
      frame: false,
      flex: 1,
      height: '100',

      layout: {
        type: 'hbox',
        padding: '0 10 0 0',
        pack: 'end',
        align: 'middle',
        defaultMargins: {
          top: 20,
          right: 20,
          bottom: 10,
          left: 0
        }
      },

      items: [
//        ops_logo, inb_logo, cnio_logo
      ]
    })

    return this.rightPanel
  }

})