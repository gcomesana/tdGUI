Ext.define('TDGUI.view.panels.LogosPanel', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-logospanel',

  requires:[],

  frame:false,
  border:false,

  layout:{
    type:'hbox',
    align:'middle'
  },


  initComponent:function () {
    var me = this

    this.items = [
      this.createLeftLogo(),
      this.createRightLogos()
    ]

    this.callParent(arguments)
  },


  createLeftLogo:function () {

    this.leftPanel = Ext.create('Ext.panel.Panel', {
      border: false,
      frame: false,
      flex:1,
      height: '100',
//      hidden: true,

      items:[
//        ops_logo
      ]
    })

    return this.leftPanel
  },


  createRightLogos:function () {
    var ops_logo = Ext.create('Ext.Img', {
      src:'/images/OPS_logo_square_transp.gif',
      bodyStyle:{background:'transparent'},
      height: 100,

      padding: '0 140 0 10'
    })

    var inb_logo = Ext.create('Ext.Img', {
      src:'/images/inb-on.png',
      bodyStyle:{background:'transparent'},
      height: 77,
      width: 75,
/*
      style: {
        padding:'0 10 0 10'
      }
*/
    })

    var cnio_logo = Ext.create('Ext.Img', {
      src:'/images/cnio-on.png',
      bodyStyle:{background:'transparent'},
      height: 73,
      width: 75

    })



    this.rightPanel = Ext.create('Ext.panel.Panel', {
      border: false,
      frame: false,
      flex: 1,
      height:'100',

      layout:{
        type:'hbox',
        padding:'0 10 0 0',
        pack:'end',
        align:'middle',
        defaultMargins:{
          top:0,
          right:20,
          bottom:10,
          left:0
        }
      },

      items:[
        ops_logo, inb_logo, cnio_logo
      ]
    })

    return this.rightPanel
  }

})