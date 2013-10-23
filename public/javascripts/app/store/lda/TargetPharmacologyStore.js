
Ext.define('TDGUI.store.lda.TargetPharmacologyStore', {
//  extend: 'LDA.store.basestores.PaginatedFilteringStore',
  extend: 'TDGUI.store.lda.FilteringStore',
  requires: ['TDGUI.util.LDAConstants', 'TDGUI.util.TargetPharmacologyReader'],
  model: 'TDGUI.model.lda.TargetPharmacologyModel',

  storeId: 'TargetPharmacologyStore',
  BASE_URL: TDGUI.Globals.proteinPharmBaseUrl, // + '/target/pharmacology/pages?',
  REQUEST_TYPE: 'pharma',

  pageSize: 25,
  buffered: true,

// [start|limit|page]Param, parameters for paging
// like ...page=5&start=400&size=100
  proxy: {
    type: 'ajax',
    noCache: false,
    // both are query string params
    startParam: undefined, // the start to get the results, set to undefined if the beginning
    // limitParam: '_pageSize', // the number of the records to fetch/prefetch
    limitParam: 'pagesize',
    // pageParam: '_page' // the number of page, this should be varying on every req
    pageParam: 'page'
//    url: this.BASE_URL
  },

  constructor: function (config, arguments) {
    console.log('TargetPharmacologyPaginatedStore: constructor()');
    this.proxy.reader = Ext.create('TDGUI.util.TargetPharmacologyReader', {});

    this.proxy.url = this.BASE_URL;
    this.callParent(arguments);
  }
/*
  listeners: {
    beforeload: {
      fn: function (store, op, opts) {
        this.proxy.url = this.BASE_URL;
      }
    }
  }
*/
});
