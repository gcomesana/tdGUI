



Ext.Loader.setConfig({
  enabled:true,
  disableCaching:false
});
// Ext.Ajax.disableCaching = false
Ext.create('Ext.app.Application', {
// Ext.Application ({
  name: 'TDGUI',

  appFolder: 'javascripts/app',

// Define all the controllers that should initialize at boot up of your application

  controllers: [
    'TDGUI.controller.SearchPanel', // not working in rails3 if not qualified
    'TDGUI.controller.Viewport',
    'TDGUI.controller.grid.DynamicGrid',
    'TDGUI.controller.panels.MultiTarget',
    'TDGUI.controller.panels.TargetInfo'
  ],

  autoCreateViewport: true,

  launch: function() {
    console.info("Starting TDGUI...")

    Ext.QuickTips.init();

    Ext.History.init()

//    Ext.history.init()

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
