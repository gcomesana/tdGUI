Ext.define("TDGUI.controller.panels.MultiTarget", {
  extend:'Ext.app.Controller',

  view:['panels.MultiTarget'],
  stores:[],

  refs:[
    {
      ref:'multitargetGrid',
      selector:'tdgui-multitargetpanel dynamicgrid3'
    },
    {
      ref:'itemList', // accessions textarea
      selector:'viewport panel > tdgui-item-multilist'
    }
  ],

  init:function () {
    console.info('Initializing MultiTarget controller...')

    this.control({
      'tdgui-multitargetpanel dynamicgrid3':{
        itemdblclick:function (view, record, item, index, e, opts) {

          var gridAccs = record.data.accessions
          var recs = this.getItemList().getStoreObject ('uniprot_acc', gridAccs)

          var primaryAcc = recs.data.uniprot_acc[0]
          var qParam = 'http://www.uniprot.org/uniprot/'+primaryAcc

// get the accession from the table/grid
//          var accessions = record.data.accessions.join(',')


console.info("item double clicked!!! " + recs.data.uniprot_acc)

          Ext.History.add('!xt=tdgui-targetinfopanel&qp=' + qParam);
        }

      }
    })
  },

  onLaunch:function (app) {
  }
})