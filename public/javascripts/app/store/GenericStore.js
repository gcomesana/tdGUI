/**
 * @class TDGUI.store.GenericStore
 *
 * This store class is just a minimal specialization of the
 * TDGUI.store.DynamicGrid store which is a kind of dynamic-model store.
 */
Ext.define('TDGUI.store.GenericStore', {
  extend: 'Ext.data.Store',
  model: 'TDGUI.model.GenericModel',


  proxy: {
    type: 'ajax',
    timeout: '180000',
    api: { // property exclusive to ajax proxies
      read: ''  // We configure this in the form controller
    },
    reader: {
      type: 'json',
      totalProperty: 'totalCount'
    }
  }
})