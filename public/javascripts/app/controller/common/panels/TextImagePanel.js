/**
 * @class TDGUI.controller.common.panels.TextImagePanel
 * @extends Ext.app.Controller
 *
 * Controller for the {@link TDGUI.view.panels.TextImagePanel} component
 */
// Ext.require(['TDGUI.model.DynamicGrid','TDGUI.store.DynamicGrid']);
Ext.define("TDGUI.controller.common.panels.TextImagePanel", {
  extend:'Ext.app.Controller',
  requires: ['TDGUI.model.GenericModel','TDGUI.store.GenericStore'],

  views: ['common.panels.TextImagePanel'],
  stores: ['Targets'],
  models: ['Target', 'GenericModel'],

  refs: [{
    ref: 'windowTextImagePanel',
    selector: 'window tdgui-textimagepanel'
  }, {
    ref: 'graphTextImagePanel',
    selector: 'tdgui-graphtabpanel tdgui-textimagepanel' // panel on the left of graph
  }],


  init:function () {
    this.control({
      'tdgui-textimagepanel': {
//        render: this.initTpl
      },

      'window[id="window-node-info"]': {
        show: this.initWindowTextImgPanel
      },

      'tdgui-interactionsgraph-panel': { // the panel supporting the graph itself
        intactDataGot: this.createInteractionsInfoStores,

        nodeMouseEnter: this.respondGraphEvents,
        edgeMouseEnter: this.respondGraphEvents
      }

    })
  },


  onLaunch: function (app) {
  },




/**
 * Init the component instance for this controller. Basically load the right
 * store based on properties got from the window the text panel is contained in.
 * It is called on showing the window with 'window-node-info' id
 * @param {Ext.Component} comp the component which triggered this method
 * @param {Object} opts the options for the event the component triggered
 */
  initWindowTextImgPanel: function (comp, opts) {
    var infoComp = this.getWindowTextImagePanel()
//    var infoComp = this.getCommonPanelsTextImagePanelView();
    var infoCompBis = this.getWindowTextImagePanel();
console.info ('loading for window');
    var store = infoComp.targetStore;
    var tokenObjQp = infoComp.data.nodename;
    tokenObjQp = 'http://www.uniprot.org/uniprot/'+tokenObjQp;
//    if (tokenObjQp != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenObjQp;
      //          this.getFormView().setLoading(true);
      store.load();
//    }

  },



  /**
   * Retrieve information about the targets involved in the interaction network.
   * This is done asynchronously in order to initialize the display component in
   * background.
   *
   * @param accessions
   * @param interactions
   */
  createInteractionsInfoStores: function (accessions, interactions) {
console.log('***==> got event triggered by InteractionsGraph: '+accessions);
    var myComp = this.getGraphTextImagePanel();
    /*
    var nodesSt = Ext.create('TDGUI.store.GenericStore', {
      storeId: 'interaction_targets'
    });
    */
    var nodesSt = myComp.targetStore;
// apiread: 'tdgui_proxy/multiple_entries_retrieval',
    var opts = {
      type: 'ajax',
      actionMethods: {
        read: 'GET'
      },
      api: {
        read: 'tdgui_proxy/multiple_entries_retrieval'
      },
      params: {
        limit: 50,
        offset: 0
      }
    };


    var accsName = Ext.Array.map (accessions, function (acc, ind, accs) {
      return acc.name;
    });
    nodesSt.proxy.actionMethods = opts.actionMethods;
    nodesSt.proxy.api.read = opts.api.read;
    nodesSt.proxy.params = opts.params;
    nodesSt.proxy.extraParams = {entries: accsName.join(',')};
//    nodesSt.on('load', this.storeLoaded, this);
    nodesSt.on('load', myComp.afterStoreLoaded, myComp);
    nodesSt.load();


// create new store for interactions
    myComp.interactionsStore = Ext.create('TDGUI.store.GenericStore', {
      storeId: 'interactions'
    });
    myComp.interactionsStore.setProxy({
      type: 'memory',
      model: 'TDGUI.model.GenericModel',
      reader: 'json'
    });

    var genericModel = myComp.interactionsStore.proxy.getModel();
    var fields = [];
    var rec = interactions[0];
    for (prop in rec) {
      fields.push(Ext.create('Ext.data.Field', {
        name: prop
      }));
    }

    genericModel.prototype.fields.removeAll();
    genericModel.prototype.fields.addAll(fields);

    myComp.interactionsStore.proxy.setModel(genericModel);
    myComp.interactionsStore.loadData(interactions);
/*
    var numIdx = myComp.interactionsStore.findBy(function(rec) {
      return (rec.get('nodeFrom') == 2 && rec.get('nodeTo') == 5) ||
            (rec.get('nodeFrom') == 5 && rec.get('nodeTo') == 2)
    });
    var rec = myComp.interactionsStore.getAt(numIdx);
*/
    console.log('interactions length? '+interactions.length)
  },



  storeLoaded: function(store, records, success) {
    var genericModel = this.getGenericModelModel();
    var legacyFields = genericModel.prototype.fields.getRange();
    var fields = [];
    var rec = records[0].data
    for (prop in rec) {
      fields.push(Ext.create('Ext.data.Field', {
        name: prop
      }));
    }

    genericModel.prototype.fields.removeAll();
    genericModel.prototype.fields.addAll(fields);

    store.proxy.setModel(genericModel);

    var myComp = this.getGraphTextImagePanel();
    if (myComp.tpl)
      myComp.tpl.overwrite()

  },



  /**
   * This method will be callbacked for several events fired from the graph class.
   * By Nov21-2012, only 'on node enter' and 'on edge enter' are supported/neccesary
   * If a sort of pretty different event wants to be managed, the name of the event
   * should be passed as the very first argument.
   */
  respondGraphEvents: function () {
    var myComp = this.getGraphTextImagePanel();

    switch (arguments.length) {
      case 2: myComp.respondNodeEnter(arguments[0]); // args[0] is node name
        break;
      case 3: myComp.respondEdgeEnter(arguments[0], arguments[1]); // args are from and to nodes for the edge
        break;

      default: break;
    }
  }


})