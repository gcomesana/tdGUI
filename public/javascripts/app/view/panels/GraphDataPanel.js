/**
 * Panel to support both the InteractionsGraph panel along with a panel to set
 * the nodes selected to perform a multitarget search on them
 */
Ext.define('TDGUI.view.panels.GraphDataPanel', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-graphdatapanel',
  requires:['TDGUI.view.common.InteractionsGraph'],

  title:'Graph Data Panel',
  layout:{
    type:'hbox',
    align:'stretch'
  },

  defaults:{
    margin:'5 5 5 5'
  },
  graphDivId:'divgraph',
  closable: true,


  initComponent:function () {
    var me = this

    var graphPanel = Ext.create('TDGUI.view.common.InteractionsGraph', {
      fdDivName:'divgraph',
      flex:3,

      nodeClickHandler: function (node, eventInfo, ev) {
      // console.info ("onClickHandler method...")
        if (typeof node !== 'undefined') {

          var list = [];
          node.eachAdjacency(function(adj) {
            list.push(adj.nodeTo.name);
          });
          var mytpl = new Ext.XTemplate ('<b>{nodename}</b><br><br>',
            'Description:<br/>{nodedesc}<br/><br/>',
            '{numconnections} connections<br/>'
          )

          var myWin = Ext.create ('TDGUI.view.common.DisplayInfoDlg', {
            data: {nodename: node.name, nodedesc: node.data.node_desc, numconnections: list.length},
            tpl: mytpl,
            buttons: [{
              xtype: 'button',
              text: 'Add',
              tooltip: 'Add this node to the <b>multiple targets</b> list',
              handler: function (btn, evObj) {
                me.addNodeToList (node)
              }
            }, {
              xtype: 'button',
              text: 'Close'
            }]
          })

          myWin.show()
        } // EO if node is undefined

      } // EO nodeClickHandler callback function

    }) // EO graphPanel

/*
    var infoPanel = Ext.create('TDGUI.view.common.panels.GraphInfoPanel', {
      store:[],
      value:undefined
    })

*/    this.items = [
        graphPanel
      ]
    graphPanel.initGraph(graphPanel)

    this.callParent(arguments)
  }, // EO initComponent


  addNodeToList: function (aNode) {
    var txtArea = Ext.ComponentQuery.query('viewport > panel > panel > panel > textarea')[0]
console.info ('got textarea...')

    var txtValues = txtArea.getRawValue()
    txtValues += '\n'+aNode.name
    txtArea.setRawValue(txtValues)
  }

}) // EO GraphDataPanel