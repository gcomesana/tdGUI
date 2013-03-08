
/**
 * Main ExtJs 4 application file. Create a Viewport and set the three main panels
 * in it.
 * Loads ExtJs 4 application controllers and init tooltips and history components
 */
Ext.Loader.setConfig({
  enabled:true,
  disableCaching:false
});


Ext.Loader.setPath('Ext.ux', '/javascripts/extjs4.1/examples/ux');
// Ext.Loader.setPath('LDA', '/javascripts/LinkedDataAPIParser/lib');

Ext.ns('TDGUI.Globals');
TDGUI.Globals.firstTime = true;

// Ext.Ajax.disableCaching = false
Ext.create('Ext.app.Application', {
// Ext.Application ({
  name: 'TDGUI',
  appFolder: 'javascripts/app',
//  requires: ['LDA.helper.LDAConstants'],
  requires: ['TDGUI.util.LDAConstants'],

// Define all the controllers that should initialize at boot up of your application

  controllers: [
    'TDGUI.controller.SearchPanel', // not working in rails3 if not qualified
    'TDGUI.controller.grid.DynamicGrid',
    'TDGUI.controller.panels.MultiTarget',
    'TDGUI.controller.panels.TargetInfo',
    'TDGUI.controller.panels.GraphTabPanel',
    'TDGUI.controller.common.panels.TextImagePanel',
    'TDGUI.controller.Viewport'
  ],

  autoCreateViewport: true,

  launch: function() {
    console.info("Starting TDGUI...");


    Ext.QuickTips.init();

    Ext.History.init()

    /*
     Ext.Loader.setConfig({
     enabled:true,
     paths: { 'CS':'chemspider/lib' }
     });
     }
     */

//    var myStore = Ext.create ('TDGUI.store.UniprotEntries')
//    myStore.load ()
/*    myStore.on ('load', function (store, recs, success, op, opts) {
      var fieldValue;
      myStore.each (function (record) {
        record.fields.each (function (field) {
          fieldValue = record.get (field.name);

          if (Ext.isArray(fieldValue))
            console.info ('Array: '+field.name +' => '+ fieldValue)
          else
            console.info (field.name +' => '+ fieldValue)
        });
      });

    })

/*    myStore.on ('load', function (store, recs, success, op, opts) {
      console.info ('on load event and autoload true!!')
      console.info ("records: "+store.getCount())
      console.info ("recs: "+recs.length)
    }, this)
 */
 /*
    var loaded = myStore.load ({
      scope: this,
      callback: function (records, op, success) {

  console.info ("checking myStore after loading..."+myStore.getTotalCount()+' records loaded')
        var fieldValue;
        myStore.each (function (record) {
          record.fields.each (function (field) {
            fieldValue = record.get (field.name);

            if (Ext.isArray(fieldValue))
              console.info ('Array: '+field.name +' => '+ fieldValue)
            else
              console.info (field.name +' => '+ fieldValue)
          });
        });
      }
    })

    */
/*
    var loopOnmyStore = function (store, records, options) {
console.info ("checking myStore after loading...")
      var fieldValue;
      myStore.each (function (record) {
        myStore.fields.each (function (field) {
          fieldValue = record.get (field.name);
console.info (field.name +' => '+ fieldValue)
        });
      }, this);
    }
*/


  }
});
