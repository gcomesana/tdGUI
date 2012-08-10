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
      ref:'gridPanel', // neccessary to retrieve list targets, no matter if the original was changed
      selector:'tdgui-multitargetpanel'
    }
  ],


  myMask: undefined,

  init:function () {
    console.info('Initializing MultiTarget controller...')

    this.control({
      'tdgui-multitargetpanel dynamicgrid3':{
        itemdblclick:function (view, record, item, index, e, opts) {

          var gridAccs = record.data.accessions

          Ext.each (gridAccs, function (acc, index, accsItself){
            var ini = acc.indexOf('>')
            var end = acc.lastIndexOf('<')
            acc = acc.substring(ini+1, end)
            accsItself[index] = acc
          })

          var listTargetsStore = this.getGridPanel().getListTargetsStore()
//          var recs = this.getItemList().getStoreObject ('uniprot_acc', gridAccs)
          var recs = listTargetsStore.findRecord('uniprot_acc', gridAccs)

// Compose de uniprot parameter (in this case an uniprot url) to proteinInfo
          var primaryAcc = recs.data.uniprot_acc[0]
          var uniprotParam = 'http://www.uniprot.org/uniprot/'+primaryAcc

          var conceptUUID = recs.data.concept_uuid
          var conceptURI = recs.data.concept_uri

// get the accession from the table/grid
//          var accessions = record.data.accessions.join(',')

          var qParam = conceptURI+','+uniprotParam
          Ext.History.add('!xt=tdgui-targetinfopanel&qp=' + qParam);
        },


      }
    })
  },

  onLaunch:function (app) {
    myMask = new Ext.LoadMask (Ext.getBody(), {msg: 'It\'s ok...'})
  }
})