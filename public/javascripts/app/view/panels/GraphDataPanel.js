/**
 * Panel to support the InteractionsPanel and a window which is raised upon clicking
 * a node.
 * The window shows a bit of informatio about the entity represented by the node and it
 * is based on a template plus the data which is to be showed.
 */
Ext.define('TDGUI.view.panels.GraphDataPanel', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-graphdatapanel',
  requires: [
    'TDGUI.view.common.InteractionsGraph',
    'TDGUI.view.common.DisplayInfoDlg'
  ],

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

  targetAcc: '',
  confVal: 0.6,
  maxNodes: 5,

  myMask: undefined,


  initComponent:function () {
    var me = this
    me.myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Loading data...'})
    me.myMask.show()

    var graphPanel = Ext.create('TDGUI.view.common.InteractionsGraph', {
      fdDivName: 'divgraph',
      flex: 3,
      targetId: me.targetAcc,
      confVal: me.confVal,
      maxNodes: me.maxNodes,

      nodeClickHandler: function (node, eventInfo, ev) {
      // console.info ("onClickHandler method...")
        if (typeof node !== 'undefined') {
          var list = [];

          node.eachAdjacency(function(adj) {
            list.push(adj.nodeTo.name);
          });

          var mytpl = new Ext.XTemplate ('<b>{nodename}</b><br><br>',
            'Description:<br/>{nodedesc}<br/>'
//            '{numconnections} connections<br/>'
          )

          var myWin = Ext.create ('TDGUI.view.common.DisplayInfoDlg', {
//            data: {nodename: node.name, nodedesc: node.data.node_desc, numconnections: list.length},
            data: {nodename: node.name, numconnections: list.length},
            tpl: mytpl,
            id: 'window-node-info',

            buttons: [{
              xtype: 'button',
              text: 'Add',
              tooltip: 'Add this node to the <b>multiple targets</b> list',
              handler: function (btn, evObj) {
                me.addNodeToList (node)
              }
            }, {
              xtype: 'button',
              text: 'Close',
              handler: function () { this.up('window').close() }
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

*/
    this.items = [
      graphPanel
    ]
    graphPanel.initGraph(graphPanel)

    graphPanel.addListener ('graphCompleted', function (evName, opts) {
      me.myMask.hide()
    })

    this.callParent(arguments)
  }, // EO initComponent


/**
 * This method adds the uniprot accession of the node into the multitarget list
 * It is set here as the functionality is very close to data panel funcition rather
 * than the generic dialog function...
 * @param aNode
 */
  addNodeToList: function (aNode) {
    var txtArea = Ext.ComponentQuery.query('viewport > panel > panel > panel > textarea')[0]
    var txtValues = txtArea.getRawValue()

    if (txtValues.indexOf(aNode.name) == -1) {
      txtValues += '\n'+aNode.name
      txtArea.setRawValue(txtValues)
    }

  }

}) // EO GraphDataPanel