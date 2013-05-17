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
		console.info('HT.controller.Panels.init...');
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
			'button#btnEnact': {
				click: this.onRunGraph
			},
			'button#btnEnactSel': {
				click: this.onRunGraph
			},
			'cytopanel > container > textbox-btn#txtBtnDisease > button': {
				click: this.onDiseaseBtnClick
			}

		});
	},

	/**
	 * Callback for the event when clicking a button in a textbox-btn component
	 * contained in a entity-lookup widget
	 * @param comp, a textbox-btn widget
	 * @param evOpts the event options
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

		// OUR NODE definition!!!
		var nodeOpts = {
			id: newId.toString(),
			label: evOpts.label,
			// entity: APP.lib.CytoscapeActions.shape2entity[shape], // this is a Number
			// entity: entityWidget.shape2entity[shape],
			entity: evOpts.meta,
			payloadValue: evOpts.value
		};

		if (evOpts.meta == "protein") {
// Get Uniprot accession from label
			var theUrl = "http://lady-qu.cnio.es:3003/api/target/byname/"+evOpts.label+".jsonp";
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
					var uniprotUrl = jsonObj.accessions[0];
					var initIdx = uniprotUrl.indexOf('>');
					var endIdx = uniprotUrl.indexOf('<', initIdx);
					var acc = uniprotUrl.substring(initIdx+1, endIdx);

					var payload = {
						uuid: evOpts.value,
						acc: acc
					}
					nodeOpts.payloadValue = payload;
					HT.lib.CytoscapeActions.createNode(cytoscape.vis, nodeOpts);

				}
			})

		}
		else
			HT.lib.CytoscapeActions.createNode(cytoscape.vis, nodeOpts);

//		vis.addNode(20, 20, nodeOpts);
	},


	onRunGraph: function (comp, evOpts) {
		console.log('Panels.onRunGraph: got value '+evOpts.value+' for '+evOpts.meta);
		var btnId = comp.getId();
		var cytoscape = this.getCytoscape();
		var vis = cytoscape.vis;
		var edges, nodes;

		if (btnId == 'btnEnact') { // for the whole graph
			var nm = vis.networkModel();
			edges = nm.data.edges; // should be an array
			nodes = nm.data.nodes;
		}
		else if (btnId == 'btnEnactSel') { // only for selected nodes (a subgraph)
			var selModel;
			selModel = Ext.Array.map(cytoscape.selectionModel, function (item) {
				return item.data;
			});

			var nm = vis.networkModel();
			nodes = selModel;
			edges = nm.data.edges;
		}
		// functionEvent = HT.lib.RuleFunctions.getFunctionFromAlias(alias)
		// functionEvent.addListener('operationComplete', this.onOperationComplete, this)
		HT.lib.CytoscapeActions.runGraph(vis, nodes, edges);
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
