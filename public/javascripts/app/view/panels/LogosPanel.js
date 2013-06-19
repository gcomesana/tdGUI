
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
  /**
   * @cfg {Object} layout the layout set for this panel
   * @cfg {String} [layout.type='hbox']
   * @cfg {String} [layout.align='middle']
   */
  layout: {
    type: 'hbox',
    align: 'top'
  },
  
  id: 'top-panel',

  initComponent: function () {
    var me = this;

    this.items = [ // me.createLeftLogo()
    
      Ext.create ('Ext.Img', {
        src: '/images/td-logo-new.png',
        id: 'img-app-logo-old',
        // cls: 'img-app-logo',
        baseCls: 'img-app-logo',
//          bodyStyle: {background: ''}
        listeners: {
          afterrender:  {
            fn: function (img, evOpts) {
              console.log('afterrender image');
              img.addCls('img-app-logo');
            }
          }
        }
      })
      //this.createLeftLogo()
      // this.createRightLogos()
    
    ];

    this.listeners = {
      afterrender: {
        fn: function (comp, evOpts) {
          console.log("afterrender image top panel");
          comp.down('image').addCls('img-app-logo');
        }
      }
    };
    this.callParent(arguments);
  },


  /**
   * Creates the lef panel for the logos.
   * @return {Ext.panel.Panel} a panel as a property of this class (leftpanel)
   *
  createLeftLogo: function () {
    this.leftPanel = Ext.create('Ext.panel.Panel', {
      border: false,
      frame: false,
      flex: 1,
      height: 100,

      layout: {
        type: 'hbox',
        padding: '0 8 0 8',
//        pack: 'end',
        align: 'middle'
        *
        defaultMargins: {
          top: 0, // 10,
          right: 20,
          bottom: 10,
          left: 0
        }
        *
      },
      style: {
        backgroundColor: 'grey'
      },

      items: [Ext.create ('Ext.Img', {
          src: '/images/td-logo-new.png',
          id: 'img-app-logo',
          cls: 'img-app-logo'
//          bodyStyle: {background: ''}
        })
      ]
    })

    return this.leftPanel
  },
*/

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