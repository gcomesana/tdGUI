Ext.define('HT.controller.Panels', {
	extend:'Ext.app.Controller',
	requires: ['HT.lib.CytoscapeActions'],

//	stores:['Articles'],
//	models:['Article'],
//	views:['article.Grid', 'article.Preview'],
	views: ['panels.ImageList', 'panels.MainCenter', 'panels.SouthPanel',
					'panels.CytoPanel'],

	refs:[
		{
			ref:'imagelist',
			selector:'imglist'
		},
		{
			ref:'main',
			selector:'maincenter'
		},
		{
			ref:'south',
			selector:'southpanel'
		}, {
			ref: 'cytoscape',
			selector: 'cytopanel > cytoscape'
		}
	],

	init: function () {
		this.control({
			'imglist':{
				render: this.onRenderImg
			},
			'maincenter': {
				render: this.onRenderMain
			},
			'southpanel': {
				render: this.onRenderSouth
			},
			// 'cytopanel > container > container > container > button': { // buttons from entity-lookup components
			/*'cytopanel > container > entity-lookup > textbox-btn > button': {  // much better than above
				click: this.onClickButton
			},*/
			'cytopanel > container > entity-lookup > combo-lookup-btn': { // textbox-btn': {
				click: this.onClickTextbox
			},
//			'cytopanel > container > container > container > button': {
			'#btnEnact': {
				click: this.onRunGraph
			},
			'#btnEnactSel': {
				click: this.onRunGraph
			},
			'cytopanel > container > textbox-btn#txtBtnDisease > button': {
				click: this.onDiseaseBtnClick
			}

		});
	},

	/**
	 * Callback for the event when clicking a button in a textbox-btn component.
	 * contained in a entity-lookup widget. Main function is adding a node
	 * @param comp, a textbox-btn widget
	 * @param evOpts the event options like: {id, label, meta, value}
	 */
	onClickTextbox: function (comp, evOpts) {
			console.log('Panels.onClickTextBox: got value '+evOpts.value+' for '+evOpts.meta);

			var cytoscape = this.getCytoscape();
			var vis = cytoscape.vis;
			var entityWidget = comp.up();
			var shape = entityWidget.getShape().type;

			var newId = vis.nodes().length+1;
			var i = 1;
			var existsNode = vis.node(newId);
			while (existsNode != null) {
				i++;
				newId = vis.nodes().length+i;
				existsNode = vis.node(newId);
			}

			cytoscape.setLoading(true);

			// OUR NODE definition and the endpoint to get info on the selected 'thing'!!!
			var nodeLabel = '';
			var theUrl = '';
			if (evOpts.meta == 'gene') {
				var startIndex = evOpts.label.indexOf('(');
				var endIndex = evOpts.label.indexOf(')');
				nodeLabel = evOpts.label.substring(startIndex+1, endIndex);
				// var labelArray = nodeLabel.split(' ');
				// nodeLabel = labelArray.join(', ');

				theUrl = "http://"+TDGUI.Globals.Host+"/api/target/by_gene.jsonp?genename=";
				var genename = nodeLabel.split(',')[0].trim();
				theUrl += genename;
			}
			else if (evOpts.meta == 'protein') {
				nodeLabel = evOpts.label;
				// Get Uniprot accession from label
				theUrl = "http://"+TDGUI.Globals.Host+"/api/target/byname/"+evOpts.label+".jsonp";
			}

			else if (evOpts.meta == 'compound') {
				nodeLabel = evOpts.label;
				theUrl = "http://"+TDGUI.Globals.Host+"/pharma/compound/info.jsonp?uri=http://www.conceptwiki.org/concept/"+evOpts.value;
			}

			else if (evOpts.meta == 'disease') {
				var endIndex = evOpts.label.lastIndexOf(';');
				endIndex = endIndex == -1? evOpts.label.length: endIndex;
				nodeLabel = evOpts.label.substring(0, endIndex);
				theUrl = "http://"+TDGUI.Globals.Host+"/pharma/disease/genemap.jsonp?mim_number="+evOpts.value;
			}
			else
				theUrl = "http://"+TDGUI.Globals.Host+"/api/target/byname/"+evOpts.label+".jsonp";

			var nodeOpts = {
				id: newId.toString(),
				label: nodeLabel,
				// entity: HT.lib.CytoscapeActions.shape2entity[shape], // this is a Number
				// entity: entityWidget.shape2entity[shape],
				entity: evOpts.meta,
				tags: evOpts.match,
				payloadValue: evOpts.value
			};


			Ext.data.JsonP.request({
				url: theUrl,

				callback: function (opts, resp) {
					console.log('ajax callback for uniprot info');
				},

				failure: function (resp, opts) {
					return false;
				},

				success: function (resp, opts) {
					var jsonObj = resp;

					var getNodeOpts = function () {
						// nodeOpts, jsonObj is a free variable
						var payload = {};
						// for omim response, so far we check for presence of accessions and genes
						//if ((jsonObj.genes != null && jsonObj.genes.length > 0) &&
							//	(jsonObj.accessions !== undefined && jsonObj.accessions != null)) {
						if (evOpts.meta == 'disease') {
							// check the object to see whether or not include the list of genes
							var myUuid = jsonObj.genes.length == 0? '': jsonObj.genes[0].mim_number;
							var myGenes = jsonObj.genes.length == 0? '': jsonObj.genes[0].gene_symbol;
							payload = {
								uuid: myUuid,
								acc: jsonObj.accessions, // comma-separated list of accessions from OMIM
								chemblId: null,
								genes: myGenes,
								chemSpiderId: null
							}
						}

						else if (jsonObj.accessions !== undefined && jsonObj.accessions != null) { // uniprot response on proteinInfo
							var uniprotUrl = jsonObj.accessions[0];
							var initIdx = uniprotUrl.indexOf('>');
							var endIdx = uniprotUrl.indexOf('<', initIdx);
							var acc = uniprotUrl.substring(initIdx+1, endIdx);
							var genes = '';
							if (jsonObj.genes != null && jsonObj.genes.length > 0)
								genes = jsonObj.genes.join(',');

							if (jsonObj.allgenes != null && jsonObj.allgenes.length > 0) {
								Ext.each(jsonObj.allgenes, function (gene, index, allgenes) {
									genes += gene.name + ",";
								});
								genes = genes.substring(0, genes.length-1);
							}

							payload = {
								uuid: evOpts.value, // when gene, here will be literal -> acc|gene id list
								acc: acc,
								genes: genes,
								chemblId: null,
								chemSpiderId: null
							}
						}

						// else if (jsonObj.result._about.match(/compound/) != null) { // compound info requested
						else if (evOpts.meta.match(/compound/) != null) {
							var conceptUri = jsonObj.result.primaryTopic._about;
							var uuid = conceptUri.substring(conceptUri.lastIndexOf('/')+1, conceptUri.length);
							var matches = jsonObj.result.primaryTopic.exactMatch;
							var chemblId = null, chemSpiderId = null;
							Ext.each(matches, function (entry, index, entries) {
								if (entry._about) {
									if (entry._about.indexOf('CHEMBL') != -1){
										chemblId = entry._about.substring(entry._about.lastIndexOf('/')+1, entry._about.length);
									}
									if (entry._about.indexOf('chemspider') != -1) {
										chemSpiderId = entry._about.substring(entry._about.lastIndexOf('/')+1, entry._about.length);
									}
								} // EO if entry._about
							});

							payload = {
								uuid: uuid,
								acc: null,
								genes: null,
								chemblId: chemblId,
								chemSpiderId: chemSpiderId
							}
						}
						nodeOpts.payloadValue = payload;
					} // EO auxiliary conversion function

					if (jsonObj != null)
						getNodeOpts();
					else
						nodeOpts.label = nodeLabel;

					var nodeOptsType = Object.prototype.toString.call(nodeOpts.payloadValue).match(/\s([a-zA-Z]+)/)[1];
					if (nodeOptsType == 'Object') {
						HT.lib.CytoscapeActions.createNode(cytoscape.vis, nodeOpts);
						cytoscape.setLoading(false);
					}
					else {
						Ext.Msg.show({
							title: 'Warning!',
							msg: "No data found for '"+nodeOpts.label+"'",
							width: 300,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.WARNING,
							fn: function (btnId, text, evOpts) {
								cytoscape.setLoading(false);
							}
						});
					}

				} // EO success

			}) // EO JSONP req

		}, // EO onClickTextbox



	onRunGraph: function (comp, evOpts) {
		// console.log('Panels.onRunGraph: got value '+evOpts.value+' for '+evOpts.meta);
		var btnId = comp.getId();
		var cytoscape = this.getCytoscape();
		var vis = cytoscape.vis;
		var edges, nodes;
		var resultsPanel = Ext.getCmp('resultsPanel');
		// var resultsPanelDiv = Ext.get('resultsPanelDiv');

		if (btnId == 'btnEnact') { // for the whole graph
			var nm = vis.networkModel();
			edges = nm.data.edges; // should be an array
			nodes = nm.data.nodes;

			// resultsPanel.update('');
			// this.cleanResultList();
		}
		else if (btnId == 'btnEnactSel') { // only for selected nodes (a subgraph)
			var selNodeModel, selEdgeModel;
			selNodeModel = Ext.Array.map(cytoscape.nodesSelectionModel, function (item) {
				return item.data;
			});

			selEdgeModel = Ext.Array.map(cytoscape.edgesSelectionModel, function (edge) {
				return edge.data;
			});
			
			var nm = vis.networkModel();
			nodes = selNodeModel;
			edges = selEdgeModel; // nm.data.edges;
			
			// resultsPanel.update('');
			// this.cleanResultList();
		}

		// Disable entity lookup buttons
		var items = Ext.ComponentQuery.query('entity-lookup');
		Ext.each(items, function (item, index, itemList) {
			if (item.xtype == 'entity-lookup') {
				item.items.items[1].items.items[1].disable(); // disable the button
			}
		});

		this.cleanResultList();

		// functionEvent = HT.lib.RuleFunctions.getFunctionFromAlias(alias)
		// functionEvent.addListener('operationComplete', this.onOperationComplete, this)
		HT.lib.CytoscapeActions.runGraph(vis, nodes, edges);
	},


	cleanResultList: function () {
		var resultsList = Ext.getCmp('resultsList');
		var resultsStore = resultsList.getStore();
		var recordCount = resultsStore.getCount();

		resultsStore.remove(resultsStore.data.getRange(0, recordCount-1));
		resultsList.getView().refresh();
/*
		var edgeSrcLabel = "White Chancro";
		var edgeTrgLabel = "Radicamol (EEP, EVA, AIV, NSH, ESA)";
		var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Compound -> Protein</span> operation<br/>('";
		msg += edgeSrcLabel+"' -> '"+edgeTrgLabel;
		msg += "')<br/>0";
		msg += " activities for the compound where found involving the protein '<i>"+edgeTrgLabel+"</i>'</div>";
		var messages = [{'msg': msg}, {'msg': msg}, {'msg': msg}, {'msg': msg}, {'msg': msg}];

		resultsStore.loadData(messages);
*/
	},



	onDiseaseBtnClick: function (c, ev) {
		var container = c.ownerCt;
		var textbox = container.down('textfield');
		var disease = textbox.getValue();

		var cytoscape = this.getCytoscape();
		HT.lib.CytoscapeActions.createNode(cytoscape.vis, disease);
	},

	onRenderImg: function (c) {
	},

	onRenderMain: function (c) {
	},

	onRenderSouth: function (c) {
	}
})
