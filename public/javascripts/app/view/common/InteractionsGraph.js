
/*
 * Configuratin options for ForceDirected graph. These ones will be the default
 */

// Default confiration for the ForceDirect graph initialization
// TODO estos cfgs hay que meterlos en una clase...

var labelType
(function() {
  var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
    textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
  console.info('auto-caller function!!!')
})();






// Configuration for animation and display computation
var computeCfg = {
  iter: 40,
  property: 'end',
  onStep: function(perc) {
    console.info(perc + '% loaded...');
  },

  onComplete: function() {
    console.info('graph pre-processing done');
//      var aNode = fd.graph.getNode('12')
//      var pos = aNode.getPos()

    this.fd.animate({
      modes: ['linear'],
      transition: $jit.Trans.Elastic.easeOut,
      duration: 2500
    })
  } // EO onComplete
} // EO config for compute the FD








/**
 * Interactions
 * This component define a panel with a jit ForceDirected graph embedded
 * Use:
 * Ext.widget ('tdgui-interactiontargetpanel', {
 *  fdDivName: 'newName'
 * })
 *
 * The ForceDirected graph itself is initialized after render, as the necessary
 * div to bear the graph has exists when the graph is to be drawed.
 * The component is a panel as we need a panel as container for the JIT graph
 *
 * Dependencies:
 * - jit.js
 * - jit.css -> necessary for correct positioning
 */
Ext.define('TDGUI.view.common.InteractionsGraph', {
  extend:'Ext.panel.Panel',
  alias:'widget.tdgui-interactionsgraph-panel',

//  title:'Interactions Network',
  html:'<div id="infovis-div"></div>',
  border: false,

  // Config options to add the ForceDirected graph
  fd: undefined, // the graph
  fdCfg: {}, // the graph constructor config object
  fdComputeCfg: computeCfg, // the computeInterval function config object
  fdDivName:'infovis-div', // div to bear the graph

  interactionData: {},
  experimentsData: undefined,

  targetId: '',
  confVal: 0.6,
  maxNodes: 5,

  nodeClickHandler: undefined,
  edgeClickHandler: undefined,



  //  height: 600,

  initComponent: function () {
    var me = this

    if (this.fdDivName != 'infovis-div') {
      var cssRule = Ext.util.CSS.getRule('#infovis-div')
      var cssRuleText = cssRule.style.cssText
      var newRule = '#' + this.fdDivName + ' {' + cssRuleText + '}'
      var newCSS = Ext.util.CSS.createStyleSheet(newRule, this.fdDivName + "-css")
      this.fdDivName = this.fdDivName+'-'+this.targetId

      this.html = '<div id="' + this.fdDivName + '" style="height:100%;background-color:white;"></div>'
    }
    else
      this.html = '<div id="infovis-div-'+this.targetId+'" style="background-color:white;">Graph</div>'

/*
    Ext.Ajax.request({
//      url: 'tdgui_proxy/interactions_retrieval',
      url: 'resources/datatest/full-jit.json',
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
*/
    this.callParent(arguments)
  },




  initGraph: function (thisInstance) {
    var me = this


    /**
     * This is a private method to set the graph features by default.
     * It is only call from the initGraph function, so it is implemented mostly
     * like a closure, a private function for initGraph method
     * @param fdInstance, the ACTUAL INSTANCE of the JIT graph. This is necessary
     * as the actual instance is referenced from some event callback methods in
     * order to perform actions on the graph
     * @return {Object}
     */
    setInstanceGraph = function (fdInstance) {
      var defaultFDCfg = {
        fdGraph: null, // this is a reference to the graph
        // id of the visualization container
//        injectInto: 'infovis-div',
        injectInto: me.fdDivName,
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
          style: 'bold',
          color: 'darkblue'
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
            thisInstance.fd.canvas.getElement().style.cursor = 'move';
          },
          onMouseLeave: function() {
            thisInstance.fd.canvas.getElement().style.cursor = '';
          },
          //Update node positions when dragged
          onDragMove: function(node, eventInfo, e) {
            var pos = eventInfo.getPos();
            node.pos.setc(pos.x, pos.y);
            thisInstance.fd.plot();
          },
          //Implement the same handler for touchscreens
          onTouchMove: function(node, eventInfo, e) {
            $jit.util.event.stop(e); //stop default touchmove event
            this.onDragMove(node, eventInfo, e);
          },

          onClick: me.nodeClickHandler
          // Add also a click handler to nodes
          /*
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
          */
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

      return defaultFDCfg
    } // EO setInstanceGraph


console.info ("InteractionsGraph: targetId -> "+me.targetId)
    var intactUrl = ''
    if (me.targetId == 'Q14596')
      intactUrl = '/resources/datatest/intact-sndtarget.json';
    else if (me.targetId == 'P29274')
      intactUrl = '/resources/datatest/intact-4thtarget.json';
    else
      intactUrl = '/tdgui_proxy/interactions_retrieval';

    Ext.Ajax.request({
//      url: 'resources/datatest/intact-bad.json',
      url: intactUrl,
      method: 'GET',
      params: {
        target: me.targetId,
        max_nodes: me.maxNodes,
        conf_val: me.confVal
      },

      success: function(response, opts) {

        if (response.responseText == null || response.responseText == '' ||
            response.responseText =='[]') {
// Esta ventana is not enough...
          Ext.MessageBox.alert("No interactions for were found for target '"+me.targetId+'"')
          me.fireEvent ('graphCompleted', me)
          return false
        }


        me.fdCfg = setInstanceGraph (thisInstance)
        me.startupGraph(response.responseText, thisInstance)
      },

// TODO check the error control here!!! Graph has not be displayed and err message raised
      failure: function(response, opts) {
          console.log('server-side failure with status code ' + response.status);
      }
    })

  }, // EO initGraph



  /**
   * Starts up the graph on its div component by setting the data and run the
   * methods to render the graph.
   * @param jsonData, the data which is to feed the graph
   */
  startupGraph: function (jsonData) {
    var divVis = Ext.get('infovis-div')
    var me = this
    //        divVis.insertHtml ('afterBegin', '<p>Kgallon</p>')

    if (this.fdDivName != 'infovis-div')
      this.fdCfg.injectInto = this.fdDivName

//    this.fd = new $jit.ForceDirected(defaultFDCfg)
    this.fd = new $jit.ForceDirected(this.fdCfg)
//    this.fdCfg.fdGraph = this.fd
    var jsonObj = Ext.JSON.decode(jsonData) // jsonObj is an Array
    me.interactionData = jsonObj.slice(0, jsonObj.length-1)
    me.experimentsData = jsonObj[jsonObj.length-1]

    this.fd.loadJSON (me.interactionData)
    this.fd.computeIncremental({
      iter: 40,
      property: 'end',

      onStep: function(perc) {
        console.info (perc + '% loaded...');
      },

      onComplete: function() {
        console.info('graph pre-processing done');
    //      var aNode = fd.graph.getNode('12')
    //      var pos = aNode.getPos()

        me.fd.animate({
          modes: ['linear'],
          transition: $jit.Trans.Elastic.easeOut,
          duration: 2500
        })
      } // EO onComplete
    })

    this.fireEvent ('graphCompleted', this)

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
//        var canvasEl = fd.canvas.getElement()
        console.info('EO afterrender')

      }
    }
  }

})