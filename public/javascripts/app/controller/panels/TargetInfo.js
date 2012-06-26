

Ext.define("TDGUI.controller.panels.TargetInfo", {
  extend:'Ext.app.Controller',

  views:['panels.TargetInfo'],
  stores:['Targets'],
  models:['Target'],

  refs:[{
    ref: 'targetinfopanel',
    selector: 'tdgui-targetinfopanel'
  }],

  init:function () {
console.info ("Initializing TargetInfo controller...")
    this.control({
      'tdgui-targetinfopanel':{
        afterrender: this.initTargetInfoPanel
      },

      'tdgui-targetinfopanel #stringdbTargetButton': {
        click: this.onClickStringBtn
      }

    })
  },

  onLaunch:function (app) {
  },


  onClickStringBtn: function (btn, ev, opts) {

    var theStore = this.getTargetinfopanel().targetInfoStore
    var targetName = this.getTargetinfopanel().down('#target_name').getRawValue()
    var historyParams = '!xt=tdgui-graphdatapanel&qp=' +
                theStore.proxy.extraParams.protein_uri+
                '&tg='+targetName

    Ext.History.add (historyParams)

//    console.info ('clicked for: '+historyParams)
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