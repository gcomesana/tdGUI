/**
 * @class TDGUI.view.panels.PharmByTarget
 * @extend Ext.panel.Panel
 * @alias widget.tdgui-pharmbytargetpanel
 *
 * This is the panel who supports the pharmacology grid. It is displayed when
 * 'Pharmacology' button is clicked from 'Target Info' panel, if enabled
 */
Ext.define ('TDGUI.view.panels.PharmByTarget', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-pharmbytargetpanel',

  requires: ['TDGUI.view.grid.DynamicGrid3',
            'TDGUI.view.grid.PharmByTargetScrollingGrid',
            'TDGUI.store.lda.TargetPharmacologyStore',
            'TDGUI.store.lda.TargetPharmacologyCountStore'],

  /**
   * @cfg {Object} layout see TDGUI.view.Viewport#layout
   */
  layout:{
    type:'vbox',
    align:'stretch'
  },

  /**
   * @cfg {Object} gridParams see TDGUI.view.panels.MultiTarget#gridParams
   */
  gridParams: null, // an object to set/add grid.proxy.extraParams
  closable: true,
  numOfResults: 0, // number of results for this target

  initComponent:function () {
    var me = this

//    this.theGrid = this.createGrid()

    // this.testStores();

    this.theGrid = this.createPharmGrid();
    this.items = [this.theGrid];
    this.callParent(arguments);
  },


  /**
   * Creates an instance of dynamicgrid3 grid component an returns it.
   * (see TDGUI.view.panels.MultiTarget#createGrid)
   * @return {TDGUI.view.grid.DynamicGrid3} an instance of {@link TDGUI.view.grid.DynamicGrid3}
   *
  createGrid: function (config) {
    var myConfig = config || {
      title:'Pharmacology for target '+window.decodeURI(this.targetName),
      gridBaseTitle:'Pharmacology compounds for '+window.decodeURI(this.targetName),
      margin:'5 5 5 5',
      //      border: '1 1 1 1',
      flex:1, // needed to fit all container
      //      readUrl: 'resources/datatest/yaut.json'
      //      readUrl: 'tdgui_proxy/multiple_entries_retrieval?entries=Q13362,P0AEN2,P0AEN3'

// further (and dynamic) store configuration
//      readUrl:'/core_api_calls/pharm_by_protein_name.json',
      queryParams: this.gridParams,
      storeActionMethods: {
        read: 'GET'
      }
      //      id: 'dyngrid'+(new Date()).getMilliseconds(),
      //      itemId: 'dyngrid'+(new Date()).getMilliseconds()
    }; // EO myConfig

    var theGrid = Ext.create('widget.dynamicgrid3', myConfig);

    return theGrid;
  },
  */

  createPharmGrid: function () {
    var me = this;

    console.log('creating LDA pharmaGrid...');
    var theGrid = Ext.create('widget.tdgui-pharmbytargetscroll-grid', {
      title:'Pharmacology for target '+window.decodeURI(this.targetName),
      gridBaseTitle:'Pharmacology compounds for '+window.decodeURI(this.targetName),
      margin:'5 5 5 5',
      flex:1, // needed to fit all container
      store: Ext.create('TDGUI.store.lda.TargetPharmacologyStore'),
      // protein_uri: this.gridParams.protein_uri,
      protein_uri: this.gridParams.uri,
      queryParams: this.gridParams

    });

    return theGrid;
  }, // EO createPharmGrid



  testStores: function () {
    var me = this;
    var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';
    conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/979f02c6-3986-44d6-b5e8-308e89210c8d';
    var myStore = Ext.create('TDGUI.store.lda.TargetPharmacologyStore');
    myStore.proxy.extraParams = {
      uri: conceptwiki_uri_mock
    };

    var countStore = Ext.create('TDGUI.store.lda.TargetPharmacologyCountStore');
    countStore.proxy.extraParams = {
      _format: 'json',
      uri: conceptwiki_uri_mock
    };

    countStore.load (function (recs, op, success) {
      if (success) {
        console.log("countStore load ok");
        if (recs[0].data.count > 0) {
          myStore.addListener('load', me.pharmaLoaded, me);
          myStore.load();
        }
      }
      else
        console.log("no success when loading countStore");

    });
  },



  pharmaLoaded: function (store, recs, success, op) {
    if (success) {
      console.log("recs retrieved: "+recs.length);

    }
    else
      console.log ("Failed to load target compounds");

  }



})