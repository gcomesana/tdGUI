/**
 * Store all information available for a target (represented by its concept UUID)
 * from OPS API target (api.openphacts.org/target...).
 */
Ext.define('TDGUI.store.lda.TargetStore', {
//  extend: 'LDA.store.basestores.BaseStore',
  require: ['TDGUI.util.TargetReader'],
  extend: 'Ext.data.Store',
  model: 'TDGUI.model.lda.TargetModel',
  storeId: 'TDGUITargetStore',

  BASE_URL: proteinInfoBaseUrl,


  proxy: {
    type: 'ajax',
    noCache: false,
    startParam: undefined,
    limitParam: undefined,
    pageParam: undefined
  },


  constructor: function (config, arguments) {
    console.log('TDGUI.store.lda.TargetStore: constructor()');
    this.proxy.reader = Ext.create('TDGUI.util.TargetReader', {});

    this.callParent(arguments);
  },


  listeners: {
    beforeload: {
      fn: function (store, op, opts) {
        console.log('TDGUI.store.lda.TargetStore.beforeload: BASE_URL: '+this.BASE_URL);
        this.proxy.url = this.BASE_URL;
      }
    }
  }
});
