



Ext.define("TDGUI.controller.common.panels.TextImagePanel", {
  extend:'Ext.app.Controller',

  views: ['common.panels.TextImagePanel'],
  stores: ['Targets'],
  models: ['Target'],

  refs: [{
    ref: 'windowTextImagePanel',
    selector: 'window tdgui-textimagepanel'
  }],

  init:function () {
    this.control({
      'tdgui-textimagepanel': {
      },

      'window[id="window-node-info"]': {
        show: this.initWindowTextImgPanel
      }


    })
  },


  onLaunch: function (app) {
  },


  initWindowTextImgPanel: function (comp, opts) {
    var infoComp = this.getWindowTextImagePanel()
    var store = infoComp.targetStore
    var tokenObjQp = infoComp.data.nodename
    tokenObjQp = 'http://www.uniprot.org/uniprot/'+tokenObjQp
    if (tokenObjQp != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenObjQp;
      //          this.getFormView().setLoading(true);
      store.load();
    }

  },


})