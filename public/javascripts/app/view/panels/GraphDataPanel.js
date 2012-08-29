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
                var thisWin = btn.up ('window')
                me.addNodeToList (node, thisWin)
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
  addNodeToList: function (aNode, targetDlg) {
    var me = this
    var listTargets = Ext.ComponentQuery.query ('panel > tdgui-item-multilist')[0]
    var listStore = listTargets.getStore()
    var nodename = Ext.ComponentQuery.query('window > tdgui-textimagepanel')[0].data.nodename
    var uniprotAcc = aNode.name

    var myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Loading data...'})
    myMask.show()
    Ext.Ajax.request({
      url: '/concept_wiki_api_calls/protein_lookup',
      method: 'GET',
      params: {
        query: nodename
      },

      failure: function (resp, opts) {
console.info('Unable to get response from concept_wiki.')
        myMask.hide()

        Ext.Msg.show({
          title:'Target information',
          msg: "Unable to get response from ConceptWiki.",
          buttons: Ext.Msg.OK,
          icon: Ext.Msg.ERROR
        });

      },

      success: function (resp, opts) {

        myMask.hide()
        var listItem = {
          name: nodename, // target_name for conceptWiki or /uniprot/protein/recommendedname/fullname
          concept_uuid: undefined,
          concept_uri: undefined,
          uniprot_acc: [uniprotAcc],
          uniprot_id: uniprotAcc,
          uniprot_name: nodename
        }

        if (resp.responseText == '{}') {
//          console.info("Nothing found for: " + item)
          Ext.Msg.show({
             title:'Target information',
             msg: "No information about the chosen target was found in ConceptWiki. Some features won't be available.",
             buttons: Ext.Msg.OK,
             icon: Ext.Msg.WARNING
          });
        }
        else {
          var jsonResp = Ext.JSON.decode(resp.responseText)
          var conceptMatch = jsonResp[0]

          listItem.concept_uuid = conceptMatch.concept_uuid;
          listItem.concept_uri = conceptMatch.concept_uri;
          listItem.name = conceptMatch.concept_label;
        }

        var target = Ext.create('TDGUI.model.ListTarget', listItem)
        listStore.add(target)

        targetDlg.close();
//        labelCount++
//        if (labelCount == labels.length)

      }
    })

/*    var txtValues = txtArea.getRawValue()

    if (txtValues.indexOf(aNode.name) == -1) {
      txtValues += '\n'+aNode.name
      txtArea.setRawValue(txtValues)
    }
*/
  }

}) // EO GraphDataPanel