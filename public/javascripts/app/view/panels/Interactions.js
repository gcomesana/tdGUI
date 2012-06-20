
/*
 * Configuratin options for ForceDirected graph. These ones will be the default
 */

// Default confiration for the ForceDirect graph initialization
// TODO estos cfgs hay que meterlos en una clase...
var defaultFDCfg = {
  // id of the visualization container
  injectInto: 'infovis-div',
/*
  Canvas: { // dont work
    width: 100,
    height: 100
  },
*/
  //Enable zooming and panning
  //by scrolling and DnD
  Navigation: {
    enable: true,
    //Enable panning events only if we're dragging the empty
    //canvas (and not a node).
    panning: 'avoid nodes',
    zooming: 10 //zoom speed. higher is more sensible
  },

  Node: {
    overridable: true
  },

  Edge: {
    overridable: true,
    color: '#23A4FF',
    lineWidth: 0.4
  },

  //Native canvas text styling
  Label: {
    type: labelType,
    //Native or HTML
    size: 10,
    style: 'bold'
  },

  //Add Tips
  Tips: {
    enable: true,
    onShow: function(tip, node) {
      //count connections
      var count = 0;
      node.eachAdjacency(function() {
        count++;
      });
      //display node info in tooltip
      tip.innerHTML = "<div class=\"tip-title\">" +
        node.name + " (" + node.data.type + ")</div>" +
        "<div class=\"tip-text\"><b>Konnections:</b> " + count + "</div>";
    }
  },


  Events: { // Add node events
    enable: true,
    type: 'Native',
    //Change cursor style when hovering a node
    onMouseEnter: function() {
      fd.canvas.getElement().style.cursor = 'move';
    },
    onMouseLeave: function() {
      fd.canvas.getElement().style.cursor = '';
    },
    //Update node positions when dragged
    onDragMove: function(node, eventInfo, e) {
      var pos = eventInfo.getPos();
      node.pos.setc(pos.x, pos.y);
      fd.plot();
    },
    //Implement the same handler for touchscreens
    onTouchMove: function(node, eventInfo, e) {
      $jit.util.event.stop(e); //stop default touchmove event
      this.onDragMove(node, eventInfo, e);
    },
    //Add also a click handler to nodes
    onClick: function(node) {
      if (!node) return;
      // Build the right column relations list.
      // This is done by traversing the clicked node connections.
      var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
        list = [];
      node.eachAdjacency(function(adj) {
        list.push(adj.nodeTo.name);
      });
      //append connections information
//        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
//        $('inner-details').html(html + list.join("</li><li>") + "</li></ul>");
    }
  },

  //Number of iterations for the FD algorithm
  iterations: 200,

  //Edge length
  levelDistance: 130,

  onBeforePlotLine: function(adj) {
    //Set random lineWidth for edges.
    //     if (adj.data.$lineWidth)
    //        adj.data.$lineWidth = Math.random() * 7 + 1;
  },

  // Add text to the labels. This method is only triggered
  // on label creation and only for DOM labels (not native canvas ones).
  onCreateLabel: function(domElement, node) {
    domElement.innerHTML = node.name;
    var style = domElement.style;
    style.fontSize = "0.8em";
    style.color = "#ddd";
  },

  // Change node styles when DOM labels are placed
  // or moved.
  onPlaceLabel: function(domElement, node) {
    var style = domElement.style;
    var left = parseInt(style.left);
    var top = parseInt(style.top);
    var w = domElement.offsetWidth;
    style.left = (left - w / 2) + 'px';
    style.top = (top + 10) + 'px';
    style.display = '';
  }
} // EO fd $jit.ForceDirected


// Configuration for animation and display computation
var computeCfg = {
  iter: 40,
  property: 'end',
  onStep: function(perc) {
    console.(perc + '% loaded...');
  },

  onComplete: function() {
    console.info('graph pre-processing done');
//      var aNode = fd.graph.getNode('12')
//      var pos = aNode.getPos()

    fd.animate({
      modes: ['linear'],
      transition: $jit.Trans.Elastic.easeOut,
      duration: 2500
    })
  } // EO onComplete
} // EO config for compute the FD








/**
 * Interactions
 * This component define a panel with a jit ForceDirecte graph embedded
 * Use:
 * Ext.widget ('tdgui-interactiontargetpanel', {
 *  fdDivName: 'newName'
 * })
 *
 * The ForceDirected graph itself is initialized after render, as the necessary
 * div to bear the graph has exists when the graph is to be drawed
 *
 * Dependencies:
 * - jit.js
 * - jit.css -> necessary for correct positioning
 */
Ext.define('TDGUI.view.panels.Interactions', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-interactiontargetpanel',

  title:'Interactions Network',
  html:'<div id="infovis-div"></div>',
  // Config options to add the ForceDirected graph
  fd:undefined, // the graph
  fdCfg: defaultFDCfg, // the graph constructor config object
  fdComputeCfg: computeCfg, // the computeInterval function config object
  fdDivName:'infovis-div', // div to bear the graph

  interactionData: {},
  target_id: '',

  //  height: 600,


  initComponent: function () {
    var me = this

    if (this.fdDivName != 'infovis-div') {
      var cssRule = Ext.util.CSS.getRule('#infovis-div')
      var cssRuleText = cssRule.style.cssText
      var newRule = '#' + this.fdDivName + ' {' + cssRuleText + '}'
      var newCSS = Ext.util.CSS.createStyleSheet(newRule, this.fdDivName + "-css")

      this.html = '<div id="' + this.fdDivName + '" style="height:100%;background-color:darkgray;">Graphx</div>'
    }
    else
      this.html = '<div id="infovis-div" style="background-color:darkgray;">Graph</div>'


    Ext.Ajax.request({
      url: 'tdgui_proxy/interactions_retrieval',
      method: 'GET',
      params: {
        target: me.target_id
      },

      success: function(response, opts) {
        me.startupGraph(response.responseText)
        console.dir(response.body);
      },

// TODO check the erro control here!!! Graph has not be displayed and err message raised
      failure: function(response, opts) {
          console.log('server-side failure with status code ' + response.status);
      }
    })

    this.callParent(arguments)
  },



  startupGraph: function (jsonData) {
    var divVis = Ext.get('infovis-div')
    //        divVis.insertHtml ('afterBegin', '<p>Kgallon</p>')

    if (this.fdDivName != 'infovis-div')
      this.fdCfg.injectInto = this.fdDivName

    fd = new $jit.ForceDirected(defaultFDCfg)
    fd.loadJSON(jsonData)
    fd.computeIncremental(computeCfg)

  },



  listeners:{
    afterrender:{
      fn:function (comp, opts) {
        var divVis = Ext.get('infovis-div')
        //        divVis.insertHtml ('afterBegin', '<p>Kgallon</p>')
/*
        if (this.fdDivName != 'infovis-div')
          defaultFDCfg.injectInto = this.fdDivName

        fd = new $jit.ForceDirected(defaultFDCfg)
        fd.loadJSON(myJson)
        fd.computeIncremental(computeCfg)

  */
        var canvasEl = fd.canvas.getElement()
        console.info('EO afterrender')

      }
    }
  }

})