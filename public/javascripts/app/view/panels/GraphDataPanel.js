/**
 * @class TDGUI.view.panels.GraphDataPanel
 * @extends Ext.panel.Panel
 * @alias widget.tdgui-graphdatapanel
 *
 * This extends a Ext.panel.Panel  to support the InteractionsPanel and a window which is raised
 * upon clicking a node.
 * The window shows a bit of informatio about the entity represented by the node and it
 * is based on a template plus the data which is to be showed.
 */
Ext.define('TDGUI.view.panels.GraphDataPanel', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-graphdatapanel',
  requires: [
    'TDGUI.view.common.InteractionsGraph',
    'TDGUI.view.common.DisplayInfoDlg',
    'TDGUI.view.common.ItemMultilist'
  ],

  title:'Graph Data Panel',
//  id: 'GraphDataPanelid',

  /**
   * @cfg {Object} layout layout to support the contained items
   * @cfg {String} [layout.type='hbox']
   * @cfg {String} [layout.align='strech']
   */
  layout:{
    type:'vbox',
    align:'stretch'
  },

  /**
   * @cfg {Object} defaults defaults for contained items
   * @cfg {String} [defaults.margin='5 5 5 5']
   */
  defaults:{
    margin:'5 5 5 5'
  },

  /**
   * @cfg {String} graphDivId the id of the <code>div</code> element to support the
   * graph object
   */
  graphDivId:'divgraph',
  closable: false,

  /**
   * @cfg {String} targetAcc the main target accession which the interaction network
   * is to be built on
   */
  targetAcc: '',

  /**
   * @cfg {Number} confVal the confidence value to select an interaction
   */
  confVal: 0.6,
  /**
   * @cfg {Number} maxNodes, the max number of nodes in the graph
   */
  maxNodes: 5,

  myMask: undefined,



  initComponent:function () {
    var me = this;
    me.myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Loading data...'})
    me.myMask.show()


    console.log ('GraphDataPanel.initComponent: id='+this.getId());
// this is properly the class which encapsulates the graph.
    var intrctnGraphPanel = Ext.create('TDGUI.view.common.InteractionsGraph', {
      fdDivName: 'divgraph',
      flex: 1,
      targetId: me.targetAcc,
      confVal: me.confVal,
      maxNodes: me.maxNodes,

      id: 'jitgraph-'+me.targetAcc,

// event handle for clicking on both edges and nodes
      nodeClickHandler: me.onClickHandler

    }); // EO create intrctnGraphPanel - InteractionsGraph


    var displayTit = Ext.create('Ext.form.field.Display', {
      itemId: 'title',
      fieldCls: 'target-title',
      value: "Interactions for accession target '"+this.targetAcc+"'"
    });


    this.items = [
      displayTit,
      intrctnGraphPanel
    ];

    intrctnGraphPanel.initGraph(intrctnGraphPanel)
// this callback is run in the context of the event emitter
    intrctnGraphPanel.addListener('graphCompleted', function (evName, opts) {
      me.interactionData = this.interactionData
      me.myMask.hide()
    });

    this.callParent(arguments);
  }, // EO initComponent





  /**
   * This is the callback implementation in response to a graph node click.
   * Keep in mind this method is reponding to a event yields inside JIT, not ExtJS,
   * but relayed to be able to work
   * @param node, then node the click was done
   * @param eventInfo, information about the event
   * @param ev, event itself
   */
  onClickHandler: function (node, eventInfo, ev) {
    if (typeof node !== 'undefined' && node != false) {
      if (node.nodeFrom === undefined) { // this is a node
        var list = [];

        node.eachAdjacency(function(adj) {
          list.push(adj.nodeTo.name);
        });

        var mytpl = new Ext.XTemplate ('<b>{nodename}</b><br><br>',
          'Description:<br/>{nodedesc}<br/>'
//            '{numconnections} connections<br/>'
        );

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
        });

        myWin.show();
      } // click event callback for nodes

      else if (node.nodeFrom !== undefined) { // this is an edge
        var edges = Ext.Array.filter(me.interactionData, function (elem, index, interactions) {
          return elem.id == node.nodeFrom.id || elem.id == node.nodeTo.id
        });

        var selectedIntrData = new Array()
        Ext.Array.each (edges, function (edge, index, theEdges) {
          var localSel = Ext.Array.filter(edge.adjacencies, function (adj, index, theAdjcs) {
            return (adj.nodeFrom == node.nodeFrom.id && adj.nodeTo == node.nodeTo.id) ||
              (adj.nodeFrom == node.nodeTo.id && adj.nodeTo == node.nodeFrom.id)
          });
          selectedIntrData = selectedIntrData.concat (localSel);
        });

        console.log ('raise something to show '+selectedIntrData[0].interactionData.length+' interactions');
      }
    } // EO if node is undefined
  }, // EO onClickHandler callback function






/**
 * This method adds the uniprot accession of the node into the multitarget list
 * It is set here as the functionality is very close to data panel funcition rather
 * than the generic dialog function...
 * @param {Object} aNode
 * @param {Object} targetDlg the information dialog for a node
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
          uniprot_acc: Ext.isArray(uniprotAcc)? uniprotAcc: [uniprotAcc],
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