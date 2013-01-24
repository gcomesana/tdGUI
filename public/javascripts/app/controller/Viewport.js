
/**
 * @class TDGUI.controller.Viewport
 * @extends Ext.app.Controller
 * 
 * This is the main application controller. Basically, all tab creation or action carried  out (except tab closing)
 * is handled upon history change event by the handleHistoryToken method. 
 */
Ext.define ("TDGUI.controller.Viewport", {
  extend: 'Ext.app.Controller',
  require: ['TDGUI.util.Utils'],

  views: ['Viewport', 'panels.BorderCenter', 'panels.MultiTarget',
    'panels.PharmByTarget', 'common.InteractionsGraph', 'panels.GraphDataPanel',
    'panels.GraphTabPanel'],

  stores: ['Targets', 'ListTargets'],
  models: ['Target', 'ListTarget'],

  refs: [{
      ref: 'contentTabs',
      selector: 'tdgui-viewport > tdgui-border-center'
    }, {
      ref: 'multitarget',
      selector: 'tdgui-multitargetpanel'
    }, {
      ref: 'theViewport',
      selector: 'tdgui-viewport'
    }, {
      ref: 'targetList',
      selector: 'tdgui-item-multilist'
    }, {
      ref: 'itemList', // accessions textarea
      selector: 'panel > tdgui-item-multilist'
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
        historyAdded: this.handleHistoryToken,
        afterrender: this.onAfterrender
      }


/*
      'tdgui-multitargetpanel': {
        afterrender: function (comp, opts) {
          console.info ('afterrender multitarget: '+comp.getId())
        }
      }
*/
    }) // this.control

  }, // init


  onLaunch: function (app) {
    console.log("Viewport controller: onLaunch!!!")

    var mytoken = window.location.hash
    mytoken = mytoken.substr(2, mytoken.length)
    if (mytoken.length != 0)
      this.handleHistoryToken(mytoken);
  },




  onAfterrender: function (comp, opts) {
//    console.log("onAfterrender: "+ comp.getId())
  },



/**
 * This is the method which handles the application 'state' change. This method is not intended to be called by user,
 * as it is called back from this controller when a change in the history (just through the {@link Ext.util.History#added added} method)
 * is triggered.<br/>
 * The token parameter is to configure the element which will be created upon history change.
 * @param {String} token this is a string with the form of a query string which carry parameters as the new widget to show
 * and some parameter values to config the widget.
 */ 
  handleHistoryToken: function (token) {
    var tabsPanel = this.getContentTabs();
    var tokenObj = this.parseHistoryToken(token);
    var xtype = tokenObj.xt;
    var queryParams = tokenObj.qp;
    var newPanel;

    var listItem = this.getItemList();
    var listStoreMain = listItem.getStore();
console.log("listItemId: "+listItem.getId());
console.log("listStoreMain size: "+listStoreMain.getCount());

//    this.updateTargetList(queryParams, listStoreMain);

    console.log('handleHistoryToken -> TDGUI.Globals.firstTime: '+TDGUI.Globals.firstTime);
    // This is to check whether or not it is an external request
    if (queryParams !== undefined && TDGUI.Globals.firstTime) {
      TDGUI.Globals.firstTime = false;

      this.updateTargetList(queryParams, listStoreMain);
    }
//    TDGUI.Globals.firstTime = TDGUI.Globals.firstTime ? false: TDGUI.Globals.firstTime;
    console.log('handleHistoryToken -> Bis: TDGUI.Globals.firstTime: '+TDGUI.Globals.firstTime);


    switch (xtype) {
      case 'tdgui-multitargetpanel':
        var listStore = this.getTargetList().getStore();
        var listStoreClone = listStore.clone(); // as it is an ListTargets store

// get concept_uuids to get info from coreAPI as well
        var concept_uuids = this.getItemList().getStoreItems('concept_uuid');

        newPanel = Ext.createByAlias ('widget.'+xtype, {
          closable: true,
          gridParams: {
            entries: tokenObj.qp
//            uuids: concept_uuids.join(',')
          },
          title: "Multiple targets",
          storeListTargets: listStore
        });
        break;

      case 'tdgui-targetinfopanel':

        newPanel = Ext.createByAlias ('widget.'+xtype, {
          closable: true,
          queryParam: tokenObj.qp
        }); /*
        var store = this.getTargetsStore();
        if (tokenObj.qp != store.proxy.extraParams.protein_uri) {
          store.proxy.extraParams.protein_uri = tokenObj.qp;
//          this.getFormView().setLoading(true);
          store.load();
        }    */
        break;

      case 'tdgui-pharmbytargetpanel':
// console.info ("raising Pharm By Target panel")
        newPanel = Ext.createByAlias('widget.'+xtype, {
          closeable: true,
          gridParams: {
            protein_uri: tokenObj.qp,
            limit: 10,
            start: 0,
            page: 1
          },
          targetName: tokenObj.tg,
          title: "Pharmacology for "+ window.decodeURI(tokenObj.tg)
        })
        break

      case 'tdgui-graphdatapanel':
      case 'tdgui-graphtabpanel':
console.info ("raising interactions for Target panel")
        var uniprotAcc = tokenObj.qp;
        newPanel = Ext.createByAlias ('widget.'+xtype, {
//          fdDivName: 'xperimental-div',
//          target_id: 'Q13362',
          targetAcc: uniprotAcc,
          confVal: tokenObj.cv,
          maxNodes: tokenObj.mn,
          closable: true,
          id: 'tdgui-graphtabpanel-'+uniprotAcc
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
 * @param {String} stringToParse, the token history
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
  },


  /**
   * Update the target list store (holding the current list of targets) with the
   * values got from qParams values.
   * @param {String} qParams the list of accessions/uuids to get info from params. This
   * can be a acc_i;uuid_i comma separated list, an acc or a concept wiki url
   * @param {Ext.data.Store} targetListStore the store with the targets
   */
  updateTargetList: function (qParams, targetListStore) {

    var targets = qParams.split(',');
    var theUrl = targets.length == 1? '/tdgui_proxy/get_uniprot_by_acc':
        '/tdgui_proxy/multiple_entries_retrieval';
    var theParams = undefined;

    var accs = new Array(), uuids = new Array();
    if (targets.length == 1) {
      var pair = targets[0].split(';');

      if (pair.length < 2) {
        var theindex = pair[0].search(/[A-Z][A-Z0-9]{5}/);
        if (theindex != -1) {
//          theUrl += '?acc='+pair[0].substr(theindex, 6);
          theParams = {
            acc: pair[0].substr(theindex, 6)
          }
        }

        theindex = pair[0].search(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/);
        if (theindex != -1) {
          theUrl = '/tdgui_proxy/get_uniprot_by_name'; // ?label=&uuid='+pair[0].substr(theindex, 36);
          theParams = {
            label: '',
            uuid: pair[0].substr(theindex, 36)
          }
        }
      } // EO if
      else {
        var pair = target.split(';');
        theUrl ='/tdgui_proxy/get_uniprot_by_name';
        theParams = {
          label: '',
          uuid: pair[1]
        }
      } // EO else
    } // EO if (pair...
    else {
      theParams = {
        entries: qParams
      }
    }
/*
    return {
      url: theUrl,
      params: theParams
    }
*/


    targetListStore.removeAll(true);
    Ext.Ajax.request({
      url: theUrl,
      method: 'GET',
      params: theParams,

      success: function (resp, opts) {
        var jsonResp = Ext.JSON.decode(resp.responseText);
        var utils = Ext.create('TDGUI.util.Utils');
        var results;
        if (opts.url.search(/multiple/) != -1) {
          console.log('multiple_entries_retrieval');
          results = utils.opsRecs2ListTarget (jsonResp, opts.params.entries)
        }
        else if (opts.url.search(/uniprot_by_acc/) != -1) {
          console.log('get_uniprot_by_acc: '+opts.params.acc);
          results = utils.targetInfo2ListTarget (jsonResp)
        }
        else if (opts.url.search(/uniprot_by_name/) != -1) {
          console.log('get_uniprot_by_uuid: '+opts.params.uuid);
          results = utils.targetInfo2ListTarget(jsonResp, opts.params.uuid)
        }

        if (Object.prototype.toString.call(results).match(/Array/) != null) {
          targetListStore.loadData(results);
        }
        else
          targetListStore.loadData([results]);
      },


      failure: function (resp, opts) {
        console.log('bad');
      }

    });




    // Multiple requests should be done in order to get basic information about
    // targets.
    // If uniprot is available, /tdgui_proxy/
    // If uuid is available, /tdgui_proxy/get_target_by_uuid
    // This means targets.length requests
    // By using /tdgui_proxy/multiple_targets_retrieval, only one request is needed
    // and actual results can be found in hash['ops_records'], which is an array
    // of hashes: target = hash['ops_records'][i]
    // The interesting elements are: target['accessions'], target['proteinfullName']
    // and function and/or organismSciName
  }

})