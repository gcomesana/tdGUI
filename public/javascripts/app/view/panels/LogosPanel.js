
/**
 * @class TDGUI.view.panels.LogosPanel
 * @extends Ext.panel.Panel,
 * @alias widget.tdgui-logospanel,
 *
 * This is a just panel to contain logos of sponsors and partners.
 * As the position of the logos in the panel is assymetric (1+2) two more panels
 * (internal to the class) has to be created to correctly set the logos
 */
Ext.define('TDGUI.view.panels.LogosPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-logospanel',

  requires: [],

  frame: false,
  /**
   * @cfg {Boolean} border see TDGUI.view.Viewport#border
   */
  border: false,
  height: 100,

  /**
   * @cfg {Object} layout the layout set for this panel
   * @cfg {String} [layout.type='hbox']
   * @cfg {String} [layout.align='middle']
   */
  layout: {
    type: 'hbox',
    align: 'middle'
  },

  initComponent: function () {
    var me = this

    this.items = [
      this.createLeftLogo()
      // this.createRightLogos()
    ]
    this.callParent(arguments)
  },


  /**
   * Creates the lef panel for the logos.
   * @return {Ext.panel.Panel} a panel as a property of this class (leftpanel)
   */
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
      height: 100,

      layout: {
        type: 'hbox',
        padding: '0 8 0 8',
//        pack: 'end',
        align: 'middle',
        defaultMargins: {
          top: 0, // 10,
          right: 20,
          bottom: 10,
          left: 0
        }
      },

      items: [Ext.create ('Ext.Img', {
          src: '/images/td-logo-new.png',
          id: 'img-app-logo',
          style: {
            top: 10
          }
//          bodyStyle: {background: ''}
        })
      ]
    })

    return this.leftPanel
  },


  /**
   * As #createLeftLogo, creates the right panel for the logos
   * @return {Ext.panel.Panel} a panel as a property for this class (rightpanel)
   */
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