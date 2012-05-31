

Ext.define ('TDGUI.store.UniprotEntries', {
  extend: 'Ext.data.Store',
  requires: 'TDGUI.model.UniprotEntry',


  storeId: 'uniprot-entries',
  model: 'TDGUI.model.UniprotEntry',
  proxy: {
    type: 'ajax',
//    url: 'resources/datatest/uniprotxml-single.json',
    reader: {
      type: 'json'
    },
    api: {
      read: 'resources/datatest/uniprotxml-single.json'
    }
  }

//  autoLoad: true
/*
  listeners: {
    load: {
      fn: function (store, recs, success, op, opts) {
        console.info ('listener on load event and autoload true!!')
        console.info ("records: "+store.getCount())
        console.info ("recs: "+recs.length)
      }
    }
  }
*/
})
