



Ext.define("TDGUI.controller.common.panels.TextImagePanel", {
  extend:'Ext.app.Controller',

  views: ['common.panels.TextImagePanel'],
  stores: ['Targets'],
  models: ['Target'],

  refs: [{
    ref: 'window-textimagepanel',
    selector: 'window tdgui-textimagepanel'
  }],

  init:function () {
    this.control({
      'tdgui-textimagepanel': {
        afterrender: this.initWindowTextImgPanel
      }
    })
  },


  onLaunch: function (app) {
  },


  initWindowTextImgPanel: function (comp, opts) {
    var store = comp.targetStore
    var tokenObjQp = comp.data.nodename
    if (tokenObjQp != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenObjQp;
      //          this.getFormView().setLoading(true);
      store.load();
    }
  }

})