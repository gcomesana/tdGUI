
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

    var infoPanel = Ext.create ('TDGUI.view.common.panels.GraphInfoPanel', {
      listName: 'Content list',
      id: 'the-graph-infopanel'
    });

    var targetStore = Ext.create('TDGUI.store.GenericStore');
    /*
    var newModel = Ext.create('TDGUI.model.GenericModel', {
      fields: ['proteinFullName', 'accessions', 'genes', 'pdmImg',
        'organismSciName','function']
    });
    targetStore.proxy.setModel(newModel, true);
    */
    infoPanel = Ext.create('TDGUI.view.common.panels.TextImagePanel', {
      layout: 'anchor',
      title: 'TextImage information',
      targetStore: targetStore
    });

    infoPanel.respondNodeEnter = function (nodeName) {
      console.log("infoPanel.respondNodeEnter: "+nodeName)

// Seems to be ok!!
      var idxNode = infoPanel.targetStore.findBy (function (rec) {
        var accs = rec.get('accessions');
        var uniprotAccs = []
        uniprotAccs = Ext.Array.filter(accs, function (it) {
          var matches = []
          matches = it.match(/[A-Z0-9]{6}/)
          return matches.length > 0 && Ext.Array.contains(matches, nodeName)
        })

        return uniprotAccs.length > 0
      });

      var nodeRec = infoPanel.targetStore.getAt(idxNode);
      console.log("nodeRec found?: "+nodeRec.get('proteinFullName'));
    };

    infoPanel.respondEdgeEnter = function (nodeFromId, nodeToId) {
      console.log("infoPanel.respondEdgeEnter: "+nodeFromId+" -> "+nodeToId)
    };


    this.items = [
			ivPanel, // panel with graph + .well message
			infoPanel // panel with information about selection (by clicking or hovering over)
		];
//		ivPanel.initGraph(ivPanel);
/*		ivPanel.addListener('graphCompleted', function(evName, opts) {
			// this callback is run in the context of the event emitter
			console.log('graphCompleted event...')
			me.interactionData = ivPanel.interactionData
		});
*/
		this.callParent(arguments);
	}
})