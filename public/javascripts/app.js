



Ext.Loader.setConfig({enabled:true});
Ext.create('Ext.app.Application', {
  name: 'TDGUI',

  appFolder: 'javascripts/app',

  // Define all the controllers that should initialize at boot up of your application
  controllers: [

  ],

  autoCreateViewport: true,

  launch: function() {
    console.info("Starting TDGUI...")

    Ext.QuickTips.init();

//    Ext.history.init()

    /*
     Ext.Loader.setConfig({
     enabled:true,
     paths: { 'CS':'chemspider/lib' }
     });
     }
     */
  }
});
