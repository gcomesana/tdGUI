

Ext.define("TDGUI.controller.panels.TargetInfo", {
  extend:'Ext.app.Controller',

  views:['panels.TargetInfo'],
  stores:['Targets'],
  models:['Target'],

  refs: [{
    ref: 'targetinfopanel',
    selector: 'tdgui-targetinfopanel'
  }],

  init:function () {
console.info ("Initializing TargetInfo controller...")
    this.control({
      'tdgui-targetinfopanel':{
        afterrender: this.initTargetInfoPanel,
        opsFailed: this.retryTargetInfoPanel
      },

      'tdgui-targetinfopanel #stringdbTargetButton': {
        click: this.onClickInteractionsBtn
      }

    })
  },

  onLaunch:function (app) {
  },


/**
 * Callback on interactions button click.
 * Keep in mind the protein_uri param, which is a uniprot url if coreApi
 * is not working or a conceptwiki url otherwise.
 * @param btn
 * @param ev
 * @param opts
 */
  onClickInteractionsBtn: function (btn, ev, opts) {

    var theStore = this.getTargetinfopanel().targetInfoStore
    var targetAcc = theStore.proxy.extraParams.protein_uri

    if (targetAcc.indexOf ('uniprot') != -1)
      targetAcc = targetAcc.substring(targetAcc.lastIndexOf('/')+1)

    if (targetAcc.indexOf ('conceptWiki') != -1)
      return

    var targetName = this.getTargetinfopanel().down('#target_name').getRawValue()
    var historyParams = '!xt=tdgui-graphdatapanel&qp=' + targetAcc +
                '&tg='+targetName

    Ext.History.add (historyParams)

//    console.info ('clicked for: '+historyParams)
  },


/**
 * Decodes the token param (uniprot,ops) to load the panel-associated-store by
 * requesting data to ops or uniprot if the latter is not working
 * @param comp, the component which yields the event
 * @param opts, options
 */
  initTargetInfoPanel: function (comp, opts) {
//    var store = this.getTargetsStore();
    comp.startLoading()
    var store = comp.targetInfoStore
    var tokenObjQp = comp.queryParam
    var tokenParams = tokenObjQp.split(',') // returns always a array
console.info ('TargetInfo.initTargetInfoPanel tokenParams: '+tokenParams)

// get the conceptUUID
    Ext.each (tokenParams, function (token, index, tokens) {
      if (token.indexOf('conceptwiki') != -1) {
        var lastSlash = token.lastIndexOf('/')
        comp.concept_uuid = token.substring(lastSlash+1)
      }
    })

    if (tokenParams[0] != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenParams[0];
      //          this.getFormView().setLoading(true);
      store.load();
    }
  },


  retryTargetInfoPanel: function (comp, opts) {
    var queryParam = opts.concept_req
    var store = comp.targetInfoStore

    if (queryParam != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = queryParam

      store.load()
    }

  }

})