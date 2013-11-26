
/**
 * @class TDGUI.view.Viewport
 * @extends Ext.container.Viewport
 * @alias widget.tdgui-viewport
 *
 * The Viewport to support the main application layout
 */
Ext.define('TDGUI.view.Viewport', {
  extend: 'Ext.container.Viewport',
  alias: 'widget.tdgui-viewport',

  requires: ['TDGUI.view.panels.BorderSouth','TDGUI.view.panels.BorderCenter',
              'TDGUI.view.panels.BorderEast','TDGUI.view.panels.LogosPanel',
              'TDGUI.view.panels.west.SearchPanel','TDGUI.view.panels.StatusBarPanel'],

/**
 * @cfg {Object} layout the layout which is to be used
 * @cfg {String} [layout.type='border']
 * @cfg {Number} [layout.padding=1]
 */
  layout: {
    type: 'border',
    padding: 1
  },

/**
 * @cfg {Object} defaults the default properties' value for the items contained in this viewport
 * @cfg {Boolean} [defaults.split=true]
 */
  defaults: {
    split: true
  },

  /**
   * @cfg {Boolean} [border=false] the presence or absence of the border around the viewport
   */
  border: false,



  initComponent: function () {
console.info ("Viewport.initComponent starting...")
    var me = this

/*
    Ext.History.init()
    Ext.History.on('change', function (token) {
      this.fireEvent ('historyAdded', token)
    })
*/
/*
/////////////////////////////////////////////////////// PANEL COMPONENTS //////
    var theCenter = {
      region: 'center',
      layout: 'border',
      border: false,
      items: [
        {
          region: 'center',
          html: 'center center (center up)',
          title: 'Center',
          minHeight: 80,

          items: [
            cw = Ext.create ('Ext.Window', {
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
            })
          ], // invisible items (a hidden window) for the center center panel
          dockedItems: [
            {
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
        } *
      ]
    }


    var tabsSearch = {
      xtype: 'tabpanel',
      activeTab: 0,
      border: false,
      defaults: {
        border: false
      },
      items: [
        {
          title: 'Search',
          bodyPadding: 10,
          html: 'A simple panel? on tab'
        },
        {
          title: 'Retrieve',
          html : 'Another one'

        }
      ]
    }


    var testPanel = {
      xtype: 'panel',
      border: 0,
      html: 'No-border panel'
    }



    var theWestItems = [
      {
        region: 'north',
        split: 'true',
        minHeight: 200,
        height: 80,
        border: 0,
//    html: 'West - North',
        collapsible: true,
        collapseMode: 'header',
        collapseDirection: 'bottom',
        title: 'Search targets',
        layout: 'fit',
        items: [
//      testPanel
          tabsSearch
        ]
      },
      {
        region: 'center',
        split: 'true',
        minHeight: 60,
        html: 'West - Center',
        collapsible: true,
        collapseMode: undefined,
        collapseDirection: 'bottom',
        title: 'History'
      },
      {
        region: 'south',
        split: true,
        minHeight: 160,
        height: 180,
        collapsible: true,
        html: 'West - South',
        title: 'Examples',
        collapsed: true
      }
    ]


    var theEast = {
      region: 'east',
      collapsible: true,
      floatable: true,
      split: true,
      width: 200,
      minWidth: 120,
      minHeight: 140,
      title: 'East',
      layout: {
        type: 'vbox',
        padding: 5,
        align: 'stretch'
      },
      items: [
        {
          xtype: 'textfield',
          labelWidth: 70,
          fieldLabel: 'Text field'
        },
        {
          xtype: 'component',
          html: 'I am floatable'
        }
      ]
    }
// EO //////////////////////////////////////////////// PANEL COMPONENTS //////
*/

    // var logosPanel = Ext.create ('TDGUI.view.panels.LogosPanel');
    me.items = [
      {
        region: 'north',
        id: 'td-top',
        height: 100,
        // minHeight: 60,
        style: {
          height: '100px'
        },
        split: false,
        items: [
          Ext.create ('Ext.Img', {
            src: '/images/td-logo-new.png',
            id: 'img-app-logo-vp',
            baseCls: 'img-app-logo',
            listeners: {
              afterrender:  {
                fn: function (img, evOpts) {
                  console.log('afterrender image img-app-logo-vp');
                  // img.addCls('img-app-logo');
                }
              }
            }
          })
        ]
//        border: false
//        html: 'north'
      },
      {
        region: 'west',
        id: 'td-left',
        collapsible: true,
        split: true,
        width: '20%',
        minWidth: 320,
        frame: false,

        layout: 'anchor',
//        layout: 'hbox',
        items: [{
          xtype: 'tdgui-west-search',
          split: false,
          frame: false
        }]
      },
      { xtype: 'tdgui-border-center',
        id: 'td-main'
      },
//      theCenter,
//      theEast,
//      { xtype: 'tdgui-border-east'},

      { xtype: 'tdgui-statusbar',
        region: 'south',
        split: false
      }

    ];

    this.callParent (arguments);
  }

})
