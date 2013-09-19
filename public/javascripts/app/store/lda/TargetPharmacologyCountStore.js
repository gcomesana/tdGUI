Ext.define('TDGUI.store.lda.TargetPharmacologyCountStore', {
//  extend: 'FilteringStore',
  extend: 'TDGUI.store.lda.FilteringStore',
  model: 'TDGUI.model.lda.TargetPharmacologyCountModel',
  requires: ['TDGUI.util.LDAConstants',
    'TDGUI.util.TargetPharmacologyCountReader',
    'TDGUI.model.lda.TargetPharmacologyCountModel',
    'TDGUI.store.lda.BaseStore'
  ],

  storeId: 'TargetPharmacologyCountStore',
  countNode: 'targetPharmacologyTotalResults',
  BASE_URL: '/tdgui_proxy/get_pharm_count',
//  BASE_URL: TDGUI.Globals.ldaBaseUrl + '/tdgui_proxy/get_pharm_count',



  constructor: function (config, arguments) {
    this.proxy.reader = Ext.create('TDGUI.util.TargetPharmacologyCountReader');
//    this.proxy.url = this.BASE_URL;

    this.callParent(arguments);
  },

  listeners: {
    beforeload: {
      fn: function (store, op, opts) {
   //     console.log('TDGUI.store.lda.TargetPharmacologyStore.beforeload: BASE_URL: ' + this.BASE_URL);
// better here in the case the store is re-used
        this.proxy.url = this.BASE_URL;
      }
    }
  }
});
