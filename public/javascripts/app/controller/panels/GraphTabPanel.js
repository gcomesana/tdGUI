Ext.define("TDGUI.controller.panels.GraphTabPanel", {
  extend: 'Ext.app.Controller',

  views: ['panels.GraphTabPanel'],
  stores: [],
  models: [],

  refs: [{
    ref: 'listTargets',
    selector: 'panel > tdgui-item-multilist'
  }, {
    ref: 'textImgPanel',
    selector: 'tdgui-graphtabpanel > tdgui-textimagepanel'
  }, {
    ref: 'graphTabpanel',
    selector: 'tdgui-graphtabpanel'
  }],

  init: function () {
    this.control({
      'tdgui-textimagepanel': {
        addTarget: this.addNodeToList
      },

//      'tdgui-graphtabpanel': {
      'tdgui-interactionsgraph-panel': {
        intactDataGot: this.createInteractionsInfoStores,
        nodeMouseEnter: this.onNodeEnter,
        edgeMouseEnter: this.onEdgeEnter
      },

      'tdgui-graphtabpanel': {
//        activate: this.onActivate
      }

    })
  },

  onLaunch: function (app) {

  },


/**
 * Method to be executed on enter (hover over) a node in the graph. It is here
 * as the event on the graph should produce a change into the TextImagePanel
 * component
 * @param nodeName the node name which is displayed in the label
 * @param graphComp the component which the graph is contained in. Provides a
 * reference to get the correct target store
 */
  onNodeEnter: function (nodeName, graphComp) {
    var theTab = graphComp.up('tdgui-graphtabpanel');
    var textImgPanel = theTab.down('tdgui-textimagepanel');
    console.log ('activating TAB: '+theTab.getId()+' and textpanel: '+textImgPanel.getId());
    var myStore = theTab.targetStore;
    var rec = myStore.getAt(1);

    console.log ('activating TAB. some accessions: '+rec.get('accessions'));
    textImgPanel.respondNodeEnter(nodeName, myStore);
  },


  /**
   * Similar to the #onNodeEnter method but takes care on edges.
   * @param nodeFrom the node origin of the interaction (edge). This is arbitrary
   * @param nodeTo the node destintation of the edge (interaction). Arbitrary.
   * @param graphComp the container in order to get the proper reference of the
   * TextImagePanel component and the interactions store.
   */
  onEdgeEnter: function (nodeFrom, nodeTo, graphComp) {
    var theTab = graphComp.up('tdgui-graphtabpanel');
    var textImgPanel = theTab.down('tdgui-textimagepanel');
    var myStore = theTab.interactionsStore;

    textImgPanel.respondEdgeEnter(nodeFrom, nodeTo, myStore);
  },




/**
 * This method adds the uniprot accession of the node into the multitarget list
 * It is set here as the functionality is very close to data panel funcition rather
 * than the generic dialog function...
 * @param {Object} nodeRec the object with info about the graph node...
 */
  addNodeToList: function (nodeRec) {
    var me = this
//    var listTargets = Ext.ComponentQuery.query ('panel > tdgui-item-multilist')[0]
    var listTargets = this.getListTargets();
    var listStore = listTargets.getStore();
//    var nodename = Ext.ComponentQuery.query('tdgui-graphtabpanel > tdgui-textimagepanel')[0].data.nodename
    var txtImgPanel = this.getTextImgPanel();

    var nodename = nodeRec.get('proteinFullName');
    var uniprotAcc = nodeRec.get('accessions');

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
          var onlyAccs = Ext.Array.map(uniprotAcc, function (acc, index, accs) {
            var matches = [];
            matches = acc.match(/[A-Z0-9]{6}/);
            return matches[0];
          })

          var listItem = {
            name: nodename, // target_name for conceptWiki or /uniprot/protein/recommendedname/fullname
            concept_uuid: undefined,
            concept_uri: undefined,
            uniprot_acc: onlyAccs,
            uniprot_id: onlyAccs[0],
            uniprot_name: undefined
          };

          var jsonResp = Ext.JSON.decode(resp.responseText);
          var conceptMatch = jsonResp[0];

          listItem.concept_uuid = conceptMatch.concept_uuid;
          listItem.concept_uri = conceptMatch.concept_uri;
          listItem.name = conceptMatch.concept_label;
        }

        var target = Ext.create('TDGUI.model.ListTarget', listItem);
        listStore.add(target);

        myMask.hide();
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
  },



  /**
   * Retrieve information about the targets involved in the interaction network.
   * This is done asynchronously in order to initialize the display component in
   * background.
   * @param accessions the accession of the nodes involved in the graph
   * @param interactions the edges of the graph
   * @param container the container component containing the graphpanel. This is
   * by convention for this application, the GraphTabPanel instance for this graph
   */
  createInteractionsInfoStores: function (accessions, interactions, container) {
    if (accessions.length == 0 || interactions.length == 0)
      return;

console.log('***==> got event triggered by InteractionsGraph: '+accessions);
    var myComp = container; // this.getGraphTabpanel();

    var nodesSt = myComp.targetStore == undefined ?
              Ext.create('TDGUI.store.GenericStore', {
                storeId: 'textimagepanel-targetstore'+accessions[0]
              }):
              myComp.targetStore;

    var opts = {
      type: 'ajax',
      actionMethods: {
        read: 'GET'
      },
      api: {
        read: 'tdgui_proxy/multiple_entries_retrieval'
      },
      params: {
        limit: 50,
        offset: 0
      }
    };


    var accsName = Ext.Array.map (accessions, function (acc, ind, accs) {
//      return acc.name;
      return acc;
    });
    nodesSt.proxy.actionMethods = opts.actionMethods;
    nodesSt.proxy.api.read = opts.api.read;
    nodesSt.proxy.params = opts.params;
    nodesSt.proxy.extraParams = {entries: accsName.join(',')};
//    nodesSt.on('load', this.storeLoaded, this);
    nodesSt.on('load', this.afterStoreLoaded, myComp);
    nodesSt.load();


// create new store for interactions
    myComp.interactionsStore = Ext.create('TDGUI.store.GenericStore', {
      storeId: 'interactions'
    });
    myComp.interactionsStore.setProxy({
      type: 'memory',
      model: 'TDGUI.model.GenericModel',
      reader: 'json'
    });

    var genericModel = myComp.interactionsStore.proxy.getModel();
    var fields = [];
    var rec = interactions[0];
    for (prop in rec) {
      fields.push(Ext.create('Ext.data.Field', {
        name: prop
      }));
    }

    genericModel.prototype.fields.removeAll();
    genericModel.prototype.fields.addAll(fields);

    myComp.interactionsStore.proxy.setModel(genericModel);
    myComp.interactionsStore.loadData(interactions);
/*
    var numIdx = myComp.interactionsStore.findBy(function(rec) {
      return (rec.get('nodeFrom') == 2 && rec.get('nodeTo') == 5) ||
            (rec.get('nodeFrom') == 5 && rec.get('nodeTo') == 2)
    });
    var rec = myComp.interactionsStore.getAt(numIdx);
*/
    console.log('interactions length? '+interactions.length)
  },



  afterStoreLoaded: function (store, records, succesful) {
    if (!succesful)
      return;

    console.log('afterStoreLoaded: Suppossedly store loaded...')
    console.log('record count: '+store.count())
    if (records.length > 0) {
      var genericModel = store.proxy.getModel();
// If you don't use 'prototype' you can't access the fields and many more
// properties of model, even if they are listed as properties :-S
//      var legacyFields = genericModel.prototype.fields.getRange();
      var fields = [];
      var rec = records[0].data
      for (prop in rec) {
        fields.push(Ext.create('Ext.data.Field', {
          name: prop
        }));
      }

      genericModel.prototype.fields.removeAll();
      genericModel.prototype.fields.addAll(fields);

      store.proxy.setModel(genericModel);
    }
    this.targetStore = store;

    var interactionsGraph = this.down('tdgui-interactionsgraph-panel');
    interactionsGraph.startupGraph();

    console.log("myComp.id: "+this.getId()+ 'targetStore.count: '+
      this.targetStore.count());
  }

})