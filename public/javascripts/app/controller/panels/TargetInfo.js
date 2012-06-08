

Ext.define("TDGUI.controller.panels.TargetInfo", {
  extend:'Ext.app.Controller',

  views:['panels.TargetInfo'],
  stores:['Targets'],
  models:['Target'],

  refs:[],

  init:function () {
console.info ("Initializing TargetInfo controller...")
    this.control({
      'tdgui-targetinfopanel':{
        afterrender:this.initTargetInfoPanel
      }

    })
  },

  onLaunch:function (app) {
  },


  initTargetInfoPanel: function (comp, opts) {
//    var store = this.getTargetsStore();
    var store = comp.targetInfoStore
    var tokenObjQp = comp.queryParam
    if (tokenObjQp != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenObjQp;
      //          this.getFormView().setLoading(true);
      store.load();
    }
  }

})