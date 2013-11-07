
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

  /**
   * @cfg {Ext.data.Store} a memory store to hold the current interactions. It
   * will provide interactions information for the info panel component
   */
	interactionStore: undefined,

  /**
   * @cfg {Ext.data.Store} the store where the information about targets and
   * adjacencies is going to be retrieved from. As the interactionStore, will
   * provide information about the nodes to the information panel component.
   */
  targetStore: undefined,

  confVal: 0.43,
  maxNodes: 5,
  targetAcc: undefined,
	targetTitle: undefined,


	initComponent: function() {
		var me = this;

		var ivPanel = Ext.create('TDGUI.view.panels.GraphDataPanel', {
			flex: 3,
      targetAcc: me.targetAcc,
			targetTitle: me.targetTitle, 
      maxNodes: me.maxNodes,
      confVal: me.confVal,
      id: 'graphdiv-'+me.targetAcc
		});

    var infoPanel = this.createInfoPanel();
    console.log("GraphTabPanel.infoPanel?? "+infoPanel.getId());
    this.items = [
			ivPanel, // panel with graph + .well message
			infoPanel // panel with information about selection (by clicking or hovering over)
		];

		this.callParent(arguments);
	},


  createInfoPanel: function () {
    var me = this;

    var welcomeTpl = new Ext.XTemplate ('<div class="well well-small" style="margin-bottom:5px">',
      'Choose or hover over a node or edge to get information about target or interactions',
      '</div>'
    );

    var targetTpl = new Ext.XTemplate(
      '<div style="margin: 5px 5px 5px 5px; padding: 2px 2px 2px 2px" id="targetTplDiv-'+me.targetAcc+'">',
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
      '<div><button id="btnAdd-'+me.targetAcc+'" class="x-btn x-toolbar-item x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon">Add to list</button></div>',
      '</div>', {
        onClickButton: function (nodeRec) {
          var myBtn = Ext.get('btnAdd-'+me.targetAcc);
          console.log("myBtn is: "+myBtn);
          var btn = myBtn.on('click', function (e) {
            // e.stopEvent();
            console.info ("button clicked: "+nodeRec.get('proteinFullName'));
            var parentComp = Ext.ComponentQuery.query('tdgui-graphtabpanel');
            var myComp = parentComp[0].down('tdgui-textimagepanel');
            myComp.fireEvent('addTarget', nodeRec);
          });

        }
      }
    );

    var emptyTpl = new Ext.XTemplate(
      '<div style="margin: 5px 5px 5px 5px; padding: 2px 2px 2px 2px">',
      '{msg}',
      '</div>'
    );

    var interactionTpl = new Ext.XTemplate (
      '<div style="margin: 5px 5px 5px 5px; padding: 2px 2px 2px 2px">',
        '<div>Edge connecting targets <b>{nodeFromAcc}</b> and <b>{nodeToAcc}</b></div><br/>',
          '<div>Found on experiments:<br/>',
            '<tpl for="experiments">',
              '<a href="http://www.ebi.ac.uk/intact/interaction/{intactid}" target="_blank">{intactid}</a> (Confidence value: {confidenceVal})<br/>',
            '</tpl>',
          '</div>',
        '</div>',
      '</div>');


/**
 * This is the callback function to display information IN the TextImagePanel context
 * when the mouse pointer hover on a graph node.
 */
    var onNodeEnter = function (nodeName, targetStore) {
      console.log("infoPanel.onNodeEnter: "+nodeName)

      var idxNode = targetStore.findBy (function (rec) {
        var accs = rec.get('accessions');
        var uniprotAccs = [];
        uniprotAccs = Ext.Array.filter(accs, function (it) {
          var matches = []
          matches = it.match(/[A-Z0-9]{6}/)
          return matches.length > 0 && Ext.Array.contains(matches, nodeName)
        });

        return uniprotAccs.length > 0;
      });

      var nodeRec = targetStore.getAt(idxNode);
      var panel = this.items.getAt(0); 
      if (nodeRec) {
        console.log("nodeRec found?: "+nodeRec.get('proteinFullName'));

        // 'this is the instance of TextImagePanel; so panel is the first item in the panel
        this.tplList[1].overwrite(panel.body, nodeRec.raw);
        this.tplList[1].onClickButton(nodeRec);
      }
      else {
        var msgObj = {msg: "No data was found for the node labeled with <span style=\"color:red;\">'"+nodeName+"'</span>"};
        this.tplList[3].overwrite(panel.body, msgObj);
      }
      panel.setHeight(this.getHeight());
    };



    var onEdgeEnter = function (nodeFromId, nodeToId, interactionStore) {
      var indexEdge = interactionStore.findBy (function (rec) {
        return (rec.get('nodeFromId') == nodeFromId && rec.get('nodeToId') == nodeToId) ||
               (rec.get('nodeFromId') == nodeToId && rec.get('nodeToId') == nodeFromId)
      })

      var edgeRec = interactionStore.getAt(indexEdge);
      console.log ("Edge: ("+edgeRec.get('nodeFromAcc')+") "+nodeFromId+" -> "+nodeToId);
      /*
      Ext.Array.forEach(edgeRec.get('experiments'), function (exp, ind, exps) {
        console.log('cv:'+exp.confidenceVal+' - intactId: '+exp.intactid +
                  ' - pubmed: '+exp.pubmed+" - iref: "+exp.iref);
      })
      */
      var panel = this.items.getAt(0);
      this.tplList[2].overwrite(panel.body, edgeRec.data);
      panel.setHeight(this.getHeight());
    };


    var infoPanel = Ext.create('TDGUI.view.common.panels.TextImagePanel', {
      flex: 1,
      layout: 'anchor',
      title: 'TextImage information',
      id: 'textimagepanel-'+me.targetAcc,

      respondNodeEnter: onNodeEnter,
      respondEdgeEnter: onEdgeEnter
    });

    infoPanel.tpl = welcomeTpl;
    infoPanel.tplList = [
      welcomeTpl,
      targetTpl,
      interactionTpl,
      emptyTpl
    ];

    infoPanel.on({
      destroy: function (panel, evOpts) {
        console.log ('GraphTabPanel destroyed...');
        panel.tpl = null;
        Ext.each(panel.tplList, function (tpl, index,tplList) {
          tpl = null;
        });
      }
    });

    return infoPanel;
  } // EO createInfoPanel

})