
/**
 * Main ExtJs 4 application file. Create a Viewport and set the three main panels
 * in it.
 * Loads ExtJs 4 application controllers and init tooltips and history components
 */
Ext.Loader.setConfig({
  enabled:true,
  disableCaching: false
});


Ext.Loader.setPath('Ext.ux', '/javascripts/extjs4.1/examples/ux');
Ext.Loader.setPath('HT', '/javascripts/ht');
// Ext.Loader.setPath('LDA', '/javascripts/LinkedDataAPIParser/lib');

Ext.ns('TDGUI.Globals');
TDGUI.Globals.firstTime = true;

// Ext.Ajax.disableCaching = false
Ext.create('Ext.app.Application', {
// Ext.Application ({
  name: 'TDGUI',
  appFolder: 'javascripts/app',
  requires: ['TDGUI.util.LDAConstants'],
/*
  requires: ['TDGUI.util.LDAConstants','TDGUI.view.panels.BorderSouth','TDGUI.view.panels.BorderCenter',
              'TDGUI.view.panels.BorderEast','TDGUI.view.panels.LogosPanel',
              'TDGUI.view.panels.west.SearchPanel','TDGUI.view.panels.StatusBarPanel'],
*/
// Define all the controllers that should initialize at boot up of your application

  controllers: [
    'TDGUI.controller.SearchPanel', // not working in rails3 if not qualified
    'TDGUI.controller.grid.DynamicGrid',
    'TDGUI.controller.panels.MultiTarget',
    'TDGUI.controller.panels.TargetInfo',
    'TDGUI.controller.panels.GraphTabPanel',
    'TDGUI.controller.common.panels.TextImagePanel',
    'TDGUI.controller.Viewport',
    'HT.controller.Panels'
  ],

  autoCreateViewport: true,

  launch: function() {
    console.info("Starting TDGUI...");
/*
    Ext.Ajax.request({
      url: '/api/status.json',
      method: 'GET',
      params: {
        param_test: "just a param test"
      },
      success: function(response){
        var text = response.responseText;
        console.log("response from api: "+text)
          // process server response here
      },

      failure: function(response, opts) {
        console.log('server-side failure with status code ' + response.status);
      }

    });
*/

    Ext.QuickTips.init();

    Ext.History.init()

    Ext.create ('Ext.container.Viewport', {
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

        var logosPanel = Ext.create ('TDGUI.view.panels.LogosPanel');
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
                id: 'img-app-logo',
                baseCls: 'img-app-logo',
                listeners: {
                  afterrender:  {
                    fn: function (img, evOpts) {
                      console.log('afterrender image');
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
      } // EO initComponent

    }); // EO Ext.create
  } // EO launch function
});
