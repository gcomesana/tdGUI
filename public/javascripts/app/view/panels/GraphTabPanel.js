
Ext.define('TDGUI.view.panels.GraphTabPanel', {
	extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-graphtabpanel',
  require: ['TDGUI.view.panels.GraphDataPanel', 'TDGUI.view.common.panels.GraphInfoPanel',
            'TDGUI.view.common.ItemMultilist', 'TDGUI.store.GenericStore'],

	title: 'Graph Tab Panel',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	defaults: {
		margin: '5 5 5 5'
	},

	interactionData: [],

  confVal: 0.43,
  maxNodes: 5,
  targetAcc: undefined,


	initComponent: function() {
		var me = this

		var ivPanel = Ext.create('TDGUI.view.panels.GraphDataPanel', {
			flex: 3,
      targetAcc: me.targetAcc,
      maxNodes: me.maxNodes,
      confVal: me.confVal
		});

    var infoPanel = Ext.create('TDGUI.view.common.panels.TextImagePanel', {
      flex: 1,
      layout: 'anchor',
      title: 'TextImage information',
      targetStore: Ext.create('TDGUI.store.GenericStore')
    });
    infoPanel.respondNodeEnter = this.private.onNodeEnter;
    infoPanel.respondEdgeEnter = this.private.onEdgeEnter;
    infoPanel.tpl = this.private.welcomeTpl;
    infoPanel.tplList = [
      this.private.welcomeTpl,
      this.private.targetTpl,
      this.private.interactionTpl
    ];

    this.items = [
			ivPanel, // panel with graph + .well message
			infoPanel // panel with information about selection (by clicking or hovering over)
		];

		this.callParent(arguments);
	},


  private: {

    welcomeTpl: new Ext.XTemplate ('<div class="well well-small" style="margin-bottom:5px">',
      'Choose or hover over a node or edge to get information about target or interactions',
      '</div>'
    ),


    targetTpl: new Ext.XTemplate(
      '<div style="margin: 5px 5px 5px 5px; padding: 2px 2px 2px 2px">',
      '<div style="margin-bottom:10px">{pdbimg}</div>',
      '<div><span style="font-weight: bold;">{proteinFullName}</span> ({organismSciName})</div>',
      '<div>Uniprot:<br/>' +
        '<tpl for"accessions">',
      '<li>{.}</li>',
      '</tpl>',
      '</div>',
      '<div>Associated genes:<br/>',
      '<tpl for="genes">',
      '<li>{.}</li>',
      '</tpl>',
      '</div>',
//      '<tpl if="function != &quot;&quot;">',
      '<div>Function:<br/>{function}</div>',
//      '</tpl>',
      '<div><button id="btnAdd" class="x-btn x-toolbar-item x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon">Add to list</button></div>',
      '</div>', {
        onClickButton: function (accessions) {
          var parentComp = Ext.ComponentQuery.query('tdgui-graphtabpanel');
          var myComp = parentComp[0].down('tdgui-textimagepanel');
          myComp.fireEvent('addTarget', accessions[0])
        }
      }
    ),


    interactionTpl: new Ext.XTemplate (
      '<div style="background-color: green; margin: 5px 5px 5px 5px; padding: 2px 2px 2px 2px">',
        '<div>Edge between targets {nodeFrom} - {nodeTo}</div>',
          '<div>Found on experiments:<br>',
            '<tpl for="experiments">',
              '<a href="http://www.ebi.ac.uk/intact/interaction/{intactid}" target="_blank">{intactid}</a> (Confidence value: {confidenceVal})<br/>',
            '</tpl>',
          '</div>',
        '</div>',
      '</div>'),

    onNodeEnter: function (nodeName) {
      console.log("infoPanel.onNodeEnter: "+nodeName)

// Seems to be ok!!
      var idxNode = this.targetStore.findBy (function (rec) {
        var accs = rec.get('accessions');
        var uniprotAccs = []
        uniprotAccs = Ext.Array.filter(accs, function (it) {
          var matches = []
          matches = it.match(/[A-Z0-9]{6}/)
          return matches.length > 0 && Ext.Array.contains(matches, nodeName)
        })

        return uniprotAccs.length > 0
      });

      var nodeRec = this.targetStore.getAt(idxNode);
      console.log("nodeRec found?: "+nodeRec.get('proteinFullName'));

      var panel = this.items.getAt(0);
      this.tplList[1].overwrite(panel.body, nodeRec.raw);


    },


    onEdgeEnter: function (nodeFromId, nodeToId) {
      console.log("infoPanel.respondEdgeEnter: "+nodeFromId+" -> "+nodeToId)
      var indexEdge = this.interactionsStore.findBy (function (rec) {
        return (rec.get('nodeFrom') == nodeFromId && rec.get('nodeTo') == nodeToId) ||
               (rec.get('nodeFrom') == nodeToId && rec.get('nodeTo') == nodeFromId)
      })

      var edgeRec = this.interactionsStore.getAt(indexEdge);
      console.log ("Edge: "+nodeFromId+" -> "+nodeToId);
      Ext.Array.forEach(edgeRec.get('experiments'), function (exp, ind, exps) {
        console.log('cv:'+exp.confidenceVal+' - intactId: '+exp.intactid +
                  ' - pubmed: '+exp.pubmed+" - iref: "+exp.iref);
      })

      var panel = this.items.getAt(0);
      this.tplList[2].overwrite(panel.body, edgeRec.data);
    }
  } // EO private

})