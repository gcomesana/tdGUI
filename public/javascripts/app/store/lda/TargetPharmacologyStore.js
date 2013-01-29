
Ext.define('TDGUI.store.lda.TargetPharmacologyStore', {
//  extend: 'LDA.store.basestores.PaginatedFilteringStore',
  extend: 'Ext.data.Store',
  requires: ['TDGUI.util.LDAConstants', 'TDGUI.util.TargetPharmacologyReader'],
  model: 'TDGUI.model.lda.TargetPharmacologyModel',
  storeId: 'TargetPharmacologyStore',
  BASE_URL: proteinPharmBaseUrl, // + '/target/pharmacology/pages?',
  REQUEST_TYPE: 'pharma',


  proxy: {
    type: 'ajax',
    noCache: false,
    startParam: undefined,
    limitParam: undefined,
    pageParam: undefined,
    url: this.BASE_URL
  },

  constructor: function (config, arguments) {
    console.log('TargetPharmacologyPaginatedStore: constructor()');
    this.proxy.reader = Ext.create('TDGUI.util.TargetPharmacologyReader', {});
    this.proxy.url = this.BASE_URL;
    this.callParent(arguments);
  },

  listeners: {
    beforeload: {
      fn: function (store, op, opts) {
        console.log('TDGUI.store.lda.TargetPharmacologyStore.beforeload: BASE_URL: '+this.BASE_URL);
        this.proxy.url = this.BASE_URL;
      }
    }
  }

});
