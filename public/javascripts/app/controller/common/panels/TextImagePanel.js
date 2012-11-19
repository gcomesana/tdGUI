/**
 * @class TDGUI.controller.common.panels.TextImagePanel
 * @extends Ext.app.Controller
 *
 * Controller for the {@link TDGUI.view.panels.TextImagePanel} component
 */
// Ext.require(['TDGUI.model.DynamicGrid','TDGUI.store.DynamicGrid']);
Ext.define("TDGUI.controller.common.panels.TextImagePanel", {
  extend:'Ext.app.Controller',
  requires: ['TDGUI.model.DynamicGrid','TDGUI.store.DynamicGrid'],

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
      },

      'tdgui-interactionsgraph-panel': {
        intactDataGot: this.createInteractionsInfoStore
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
//    var infoComp = this.getWindowTextImagePanel()
    var infoComp = this.getCommonPanelsTextImagePanelView();
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



  createInteractionsInfoStore: function (accessions, interactions) {
    console.log('***==> got event triggered by InteractionsGraph: '+accessions)
    var nodesSt = Ext.create('TDGUI.store.DynamicGrid', {
      storeId: 'interaction_targets'
    });

    var opts = {
      actionMethods: {
        read: 'GET'
      },
      apiread: 'tdgui_proxy/multiple_entries_retrieval',
      params: {
        limit: 50,
        offset: 0
      }
    };

    nodesSt.proxy.actionMethods = opts.actionMethods;
    nodesSt.proxy.api.read = opts.apiread;
    nodesSt.proxy.params = opts.params;
    nodesSt.proxy.extraParams = {entries: accessions.join(',')};

    nodesSt.on('load', this.storeLoaded, this);
    nodesSt.load();

    console.log('interactions length? '+interactions.length)
  },


  storeLoaded: function (store, records, success) {

    console.log('Suppossedly store loaded...')
    console.log('record count: '+store.count())

    store.each(function(rec) {
      console.log('* -> '+rec.raw['proteinFullName'])
    })
  }


})