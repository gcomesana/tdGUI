/*
 * Configuratin options for ForceDirected graph. These ones will be the default
 */

// Default confiration for the ForceDirect graph initialization
// TODO estos cfgs hay que meterlos en una clase...

var labelType;
(function () {
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
})();


// Configuration for animation and display computation
var computeCfg = {
  iter: 40,
  property: 'end',
  onStep: function (perc) {
    console.info(perc + '% loaded...');
  },

  onComplete: function () {
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
 * @class TDGUI.view.common.InteractionsGraph
 * @extend Ext.panel.Panel
 * @alias widget.tdgui-interactionsgraph-panel
 *
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
 *
 * For more information and tutorials about the graph object, go to
 * {@link thejit.org}
 */
Ext.define('TDGUI.view.common.InteractionsGraph', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-interactionsgraph-panel',

//  title:'Interactions Network',
  /**
   * @cfg {String} [html='<div id="infovis-div"></div>']
   * is the html which will be the place where the graph component
   * will be rendered.
   */
  html: '<div id="infovis-div"></div>',

  /**
   * @cfg {Boolean} border see {@link TDGUI.view.Viewport#border}, {@link Ext.panel.Panel#border}
   */
  border: false,

  // Config options to add the ForceDirected graph
  /**
   * @cfg {Object} fd the graph object itself
   */
  fd: undefined, // the graph
  /**
   * @cfg {Object} fdCfg the configuration options for the graph object. They are passed
   * to the object constructor
   */
  fdCfg: {}, // the graph constructor config object
  /**
   * @cfg {Object} fcComputeCfg it is the configuration for animation and display computation
   */
  fdComputeCfg: computeCfg, // the computeInterval function config object
  /**
   * @cfg {String} [fdDivName='infovis-div'] the id of the div element to bear the graph
   */
  fdDivName: 'infovis-div', // div to bear the graph

  /**
   * @cfg {Object} interactionData structured data to represent by using the graph
   */
  interactionData: {},
  /**
   * @cfg {Array} experimentsData an array of experiments related to interactions
   */
  experimentsData: undefined,


  /**
   * @cfg {String} interactionUrl the string with the endpoint rest service url
   * to retrieve the json to feed the FD graph and display the interaction network
   */
  interactionUrl: '/tdgui_proxy/interactions_retrieval',

  /**
   * @cfg {String} targetId the id of the target (uniprot accession)
   */
  targetId: '',

  confVal: 0.4,
  maxNodes: 5,

  /**
   * @cfg {Function} nodeClickHandler a callback function on response to a click over a node
   */
  nodeClickHandler: undefined,
  /**
   * @cfg {Function} edgeClickHandler a callback function on response to a click over a edge
   */
  edgeClickHandler: undefined,


  //  height: 600,

  initComponent: function () {
    var me = this

    var helpText = '<div id="divIntrHelp" class="well well-small" ' +
			'style="width:50%;margin-bottom:5px;margin-left:50%">' +
      'Click/hover over a node to get information about the target<br/>';
    helpText += 'Click/hover over a edge to get information about the' +
			' interaction between both two targets</div>';

//    helpText = ''
    if (this.fdDivName != 'infovis-div') {
      var cssRule = Ext.util.CSS.getRule('#infovis-div');
      var cssRuleText = cssRule.style.cssText;
      var newRule = '#' + this.fdDivName + ' {' + cssRuleText + '}';
      var newCSS = Ext.util.CSS.createStyleSheet(newRule, this.fdDivName + "-css");
      this.fdDivName = this.fdDivName + '-' + this.targetId;

      this.html = '<div id="' + this.fdDivName + '" style="height:100%">' +
        helpText + '</div>';

      this.html = '<div id="outerdiv-graph" style="height:100%">'+
        '<div id="' + this.fdDivName + '" style="xborder:1px solid black;height:88%"></div>' +
				helpText+'</div>';

    }
    else
      this.html = '<div id="infovis-div-' + this.targetId + '" style="border:1px solid red;">' +
        helpText + '</div>'

    this.callParent(arguments)
  },


  /**
   * Graph initialization method.
   * @param {Object} thisInstance the instance of this class itself, necessary to
   * access some configs and properties of this graph instance.
   */
  initGraph: function (thisInstance) {
    var me = this

    /**
     * This is a private method to set the graph features by default.
     * It is only call from the initGraph function, so it is implemented mostly
     * like a closure, a private function for initGraph method
     * @param {Object} fdInstance, the ACTUAL INSTANCE of the JIT graph. This is necessary
     * as the actual instance is referenced from some event callback methods in
     * order to perform actions on the graph
     * @return {Object}
     */
    var setInstanceGraph = function (fdInstance) {
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
          size: 12,
          style: 'bold',
          color: 'darkblue'
        },

        //Add Tips
        Tips: {
          enable: true,
          onShow: function (tip, node) {
            //count connections
            var interactionsCount = 0;
            node.eachAdjacency(function () {
              interactionsCount++;
            });

            var experimentsCount = 0;
            var nodeExperiments = new Array();
            Ext.Array.each (me.interactionData, function(it, ind, nodes) {
              var thisExperiments = Ext.Array.filter (it.adjacencies, function (adj) {
                return adj.nodeFrom == node.id || adj.nodeTo == node.id;
              })
              nodeExperiments = nodeExperiments.concat(thisExperiments);
            })

            /*
            var nodeExperiments = Ext.Array.filter(me.interactionData, function (it) {
              return it.name == node.name
            })
            */
            if (nodeExperiments != null && nodeExperiments !== undefined)
//              Ext.Array.forEach (nodeExperiments[0].adjacencies, function (it, ind, adjs) {
              Ext.Array.forEach(nodeExperiments, function (it, ind, adjs) {
                experimentsCount += it.interactionData.length
              });

            //display node info in tooltip
            tip.innerHTML = "<div class=\"tip-title\">" +
              node.name + "</div>" +
              "<div class=\"tip-text\"><b>Interactions:</b> " + interactionsCount + "<br/>" +
              "<b>Experiments:</b> "+ experimentsCount+ "</div>";
          }
        },


        Events: { // Add node events
          enable: true,
          enableForEdges: true,
          type: 'Native',
          graphData: me.interactionData,

          //Change cursor style when hovering a node
          onMouseEnter: function (node, evInfo, ev) {
            // var container = me.up('tdgui-graphtabpanel');
            if (node.name) {
              node.setData('color', 'yellow');
              node.setData('alpha', 20, 'end');
              me.fireEvent('nodeMouseEnter', node.name, me)
            }
            else {
              me.fireEvent('edgeMouseEnter', node.nodeFrom.id, node.nodeTo.id, me)
            }

            thisInstance.fd.canvas.getElement().style.cursor = 'move';

          },
          onMouseLeave: function (node, evInfo, ev) {
            thisInstance.fd.canvas.getElement().style.cursor = '';
            node.setData('dim', 7)
          },
          //Update node positions when dragged
          onDragMove: function (node, eventInfo, e) {
            var pos = eventInfo.getPos();
            node.pos.setc(pos.x, pos.y);
            thisInstance.fd.plot();
          },
          //Implement the same handler for touchscreens
          onTouchMove: function (node, eventInfo, e) {
            $jit.util.event.stop(e); //stop default touchmove event
            this.onDragMove(node, eventInfo, e);
          },

          onClick: me.nodeClickHandler
        },

        //Number of iterations for the FD algorithm
        iterations: 200,

        //Edge length
        levelDistance: 130,

        onBeforePlotLine: function (adj) {
          //Set random lineWidth for edges.
          //     if (adj.data.$lineWidth)
          //        adj.data.$lineWidth = Math.random() * 7 + 1;
        },

        // Add text to the labels. This method is only triggered
        // on label creation and only for DOM labels (not native canvas ones).
        onCreateLabel: function (domElement, node) {
          domElement.innerHTML = node.name;
          var style = domElement.style;
          style.fontSize = "0.8em";
          style.color = "#ddd";
        },


        // Change node styles when DOM labels are placed
        // or moved.
        onPlaceLabel: function (domElement, node) {
          var style = domElement.style;
          var left = parseInt(style.left);
          var top = parseInt(style.top);
          var w = domElement.offsetWidth;
          style.left = (left - w / 2) + 'px';
          style.top = (top + 10) + 'px';
          style.display = '';
        }
      } // EO fd $jit.ForceDirected

      return defaultFDCfg;
    } // EO setInstanceGraph


    console.info("InteractionsGraph: targetId -> " + me.targetId);

    Ext.Ajax.request({
//      url: 'resources/datatest/intact-bad.json',
      url: me.interactionUrl,
      method: 'GET',
      params: {
        target: me.targetId,
        max_nodes: me.maxNodes,
        conf_val: me.confVal
      },

      success: function (response, opts) {
        console.log("RESPONDING TO INTACT-PAINTING GRAPH");
        if (response.responseText == null || response.responseText == '' ||
          response.responseText == '[]') {
// This window is not enough and pronbe to be removed
          Ext.MessageBox.alert("No interactions for were found for target '" + me.targetId + '"')
          me.fireEvent('graphCompleted', me);
          return false;
        }

        var jsonObj = Ext.JSON.decode(response.responseText); // jsonObj is an Array
        var accessions = Ext.Array.map(jsonObj, function (it) {
          return {id: it.id, name: it.name};
        });
        accessions.length = 0;
        for (var i=0; i<jsonObj.length; i++) {
          accessions[jsonObj[i].id] = jsonObj[i].name;
        }


        var interactions = Ext.Array.map(jsonObj, function (it) {
          var thisInteractions = Ext.Array.map (it.adjacencies, function (adj, ind, adjs) {
            var myObj =  {
              nodeFromId: adj.nodeFrom,
              nodeFromAcc: accessions[adj.nodeFrom],
              nodeToId: adj.nodeTo,
              nodeToAcc: accessions[adj.nodeTo],
              experiments: adj.interactionData
            };
            return myObj;
          });
          return thisInteractions;
        })
        // In order to build the stores with the right data to serve the side panel information
        // accessions to remotely retrieve information and the graph interactions as a
        // flat array are passed in
        // The event is caught in GraphTabPanel controller
        me.fireEvent('intactDataGot', accessions, Ext.Array.flatten(interactions), me.up('tdgui-graphtabpanel'));

        me.interactionData = jsonObj;
        me.fdCfg = setInstanceGraph(thisInstance);
      },

// TODO check the error control here!!! Graph has not be displayed and err message raised
      failure: function (response, opts) {
        console.log('server-side failure with status code ' + response.status);
      }
    }); // request

  }, // EO initGraph



  /**
   * Starts up the graph on its div component by setting the data and run the
   * methods to render the graph. It has to be called AFTER {@link #initGraph}
   * @param {Object} jsonObj the data which is to feed the graph
   */
  startupGraph: function () {
    var divVis = Ext.get('infovis-div')
    var me = this
    //        divVis.insertHtml ('afterBegin', '<p>Kgallon</p>')

    if (this.fdDivName != 'infovis-div')
      this.fdCfg.injectInto = this.fdDivName

//    this.fd = new $jit.ForceDirected(defaultFDCfg)
    this.fd = new $jit.ForceDirected(this.fdCfg)
//    this.fdCfg.fdGraph = this.fd
//    var jsonObj = Ext.JSON.decode(jsonData) // jsonObj is an Array
//    me.interactionData = jsonObj.slice(0, jsonObj.length-1)
//    me.interactionData = jsonObj
//    me.experimentsData = jsonObj[jsonObj.length-1]

    this.fd.loadJSON(me.interactionData)
    this.fd.computeIncremental({
      iter: 40,
      property: 'end',

      onStep: function (perc) {
        console.info(perc + '% loaded...');
      },

      onComplete: function () {
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

    this.fireEvent('graphCompleted', this)
  },


  /**
   * @cfg {Object} listeners an object containing event handlers for this object
   */
  listeners: {
    afterrender: {
      fn: function (comp, opts) {
        var divVis = Ext.get('infovis-div')
        console.info('EO afterrender')

      }
    }
  }

})