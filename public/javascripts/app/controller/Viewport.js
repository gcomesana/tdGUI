

Ext.define ("TDGUI.controller.Viewport", {
  extend: 'Ext.app.Controller',

  views: ['Viewport', 'panels.BorderCenter', 'panels.MultiTarget',
    'panels.PharmByTarget', 'common.InteractionsGraph', 'panels.GraphDataPanel'],
  stores: ['Targets', 'ListTargets'],
  models: ['Target', 'ListTarget'],

  refs: [{
      ref: 'contentTabs',
      selector: 'tdgui-viewport > tdgui-border-center'
    }, {
      ref: 'multitarget',
      selector: 'tdgui-multitargetpanel'
  }, {
    ref: 'targetList',
    selector: 'tdgui-item-multilist'
  }, {
    ref: 'theViewport',
    selector: 'tdgui-viewport'
  }],


  init: function () {
    var me = this

    Ext.History.init()

    Ext.History.on('change', function (token) {
console.info ("A element was added to history: -> "+token)
      if (token) {
        me.handleHistoryToken(token);
      }
    }) // , this);

    this.control({
      'tdgui-viewport': {
        historyAdded: this.handleHistoryToken
      }


/*
      'tdgui-multitargetpanel': {
        afterrender: function (comp, opts) {
          console.info ('afterrender multitarget: '+comp.getId())
        }
      }
*/
    })
  },


  onLaunch: function (app) {
  },


  handleHistoryToken: function (token) {
    var tabsPanel = this.getContentTabs()
    var tokenObj = this.parseHistoryToken(token)
    var xtype = tokenObj.xt
    var newPanel


    switch (xtype) {
      case 'tdgui-multitargetpanel':
        var listStore = this.getTargetList().getStore()
        var listStoreClone = listStore.clone() // as it is an ListTargets store

        newPanel = Ext.createByAlias ('widget.'+xtype, {
          closable: true,
          gridParams: {entries: tokenObj.qp},
          title: "Multiple targets",
          storeListTargets: listStoreClone
        })
        break

      case 'tdgui-targetinfopanel':
        newPanel = Ext.createByAlias ('widget.'+xtype, {
          closable: true,
          queryParam: tokenObj.qp
        }) /*
        var store = this.getTargetsStore();
        if (tokenObj.qp != store.proxy.extraParams.protein_uri) {
          store.proxy.extraParams.protein_uri = tokenObj.qp;
//          this.getFormView().setLoading(true);
          store.load();
        }    */
        break

      case 'tdgui-pharmbytargetpanel':
// console.info ("raising Pharm By Target panel")
        newPanel = Ext.createByAlias('widget.'+xtype, {
          closeable: true,
          gridParams: { protein_uri: tokenObj.qp },
          targetName: tokenObj.tg,
          title: "Pharmacology for "+ window.decodeURI(tokenObj.tg)
        })
        break

      case 'tdgui-graphdatapanel':
console.info ("raising interactions for Target panel")
        var uniprotAcc = tokenObj.qp
        newPanel = Ext.createByAlias ('widget.'+xtype, {
//          fdDivName: 'xperimental-div',
//          target_id: 'Q13362',
          targetAcc: uniprotAcc,
          closeable: true
        })
        break


    }
/*
    var multiTarget = Ext.createByAlias ('widget.'+xtype, {
      closable: true,
      gridParams: {entries: tokenObj.qp},
      title: "Multiple targets",
    })
*/
// console.info ('*** Viewport controller.handleHistoryToken + '+multiTarget.getId())
    tabsPanel.add (newPanel)
    tabsPanel.suspendEvents(false)
    tabsPanel.setActiveTab(newPanel)
    tabsPanel.resumeEvents()

  },


/**
 * Parse a history-token string and returns an object such that its keys are
 * the name of the params and the values, the params values
 * @param stringToParse, the token history
 * @return {Object}
 */
  parseHistoryToken:function (stringToParse) {
    var obj = {};
    var andBits = stringToParse.split('&');

    Ext.each(andBits, function (bit) {
      var firstEquals = bit.indexOf('=');

      if (firstEquals != -1) {
        var startIndex = (bit.charAt(0) == '!')? 1: 0

        var key = bit.substring (startIndex, firstEquals);
        var value = bit.substring (firstEquals + 1, bit.length)
        obj[key] = value;
      }
    });
    return obj;
  }


})