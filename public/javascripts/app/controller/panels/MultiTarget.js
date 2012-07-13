Ext.define("TDGUI.controller.panels.MultiTarget", {
  extend:'Ext.app.Controller',

  view: ['panels.MultiTarget'],
  stores:[],

  refs:[{
      ref: 'multitargetGrid',
      selector: 'tdgui-multitargetpanel dynamicgrid3'
    }
  ],

  init:function () {
console.info ('Initializing MultiTarget controller...')

    this.control({
      'tdgui-multitargetpanel dynamicgrid3': {
        itemdblclick: function (view, record, item, index, e, opts) {
          var accessions =  record.data.accessions.join (',')
console.info ("item double clicked!!! " + accessions)

          Ext.History.add('!xt=tdgui-targetinfopanel&qp=' + record.data.accessions[0]);
        }

      }
    })
  },

  onLaunch:function (app) {
  }
})