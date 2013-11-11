Ext.define('TDGUI.controller.grid.PharmByTargetScrollingGrid', {
	extend: 'Ext.app.Controller',

	views: [
		'grid.PharmByTargetScrollingGrid'
	],

	models: ['TDGUI.model.lda.TargetPharmacologyModel'],

	refs: [
		{
			ref: 'pharmaGrid',
			selector: 'tdgui-pharmbytargetscroll-grid'
		}
	],


	myMask: undefined,


	init: function () {
		this.myMask = 'cagallon'
		console.log("PharmByTargetScrollingGrid.Controller.init... myMask: " + this.myMask)
		this.control({

			'tdgui-pharmbytargetpanel tdgui-pharmbytargetscroll-grid': {
				afterrender: function (comp, opts) {
					console.log("catching afterrender for: "+ comp.getXType());
					// comp.columns[0].setHeight(25);
					// this.prepPharmaGrid(comp, opts); // wrong if uncommented

					this.fetchTotalResults();

				},
				beforerender: function (comp, opts) {
					console.log("PharmByTargetScrollingGrid controller: beforerender for "+
						comp.getXType());
					comp.columns[0].setHeight(25);
				}
			}
/*
			'dynamicgrid3': {
				afterrender: function (comp, opts) {
					// this.initGrid(comp, opts);
					this.fetchTotalResults();
				}
				/*
				 itemdblclick: function (view, record, item, index, e, opts) {
				 console.info ("item double clicked!!!")
				 if (record.data.csid_uri !== undefined) {
				 var csid = record.data.csid_uri.match(/http:\/\/rdf.chemspider.com\/(\d+)/)[1];
				 if (parseInt(csid) >= 1) {
				 Ext.create('CS.view.CompoundWindow').showCompound(csid);
				 }
				 }
				 },
				 *
				 itemcontextmenu: function (view, record, itemHTMLElement, index, eventObject, eOpts) {
				 eventObject.preventDefault();
				 //                    console.log('itemcontextmenu');
				 this.getGridView().showMenu(eventObject.getX(), eventObject.getY(), record);
				 }
				 *
			}, // EO dynamicgrid3

			'genecir-simple-grid toolbar #sdfDownloadProxy_id': {
				click: this.prepSDFile
			}
*/
		})
	},


	onLaunch: function () {
		console.log("PharmByTargetScrollingGrid.Controller.onLaunch")
		this.myMask = new Ext.LoadMask(Ext.getBody(), {
			msg: 'Loading data...'
		})
	},



	/**
	 * Initializes the pharmacology grid component.
	 * TODO [This should be changed in order to support deep linking (not depending on comp)]
	 * @param {Object} comp the grid component which triggered the event
	 * @param {Object} opts passed options
	 */
	prepPharmaGrid: function (comp, opts) {
		console.info("PharmByTargetScrollingGrid: Prepping pharmaGrid!!");
		// var grid_view = this.getPharmaGrid(); // gets the grid, no the panel as a whole
		// var grid_store = grid_view.getStore(); // gets the store which feed the grid, lda.TargetPharma...Store

// it is suppossed gridParams has the configuration parameters needed
		comp.store.proxy.extraParams = comp.queryParams;
		comp.store.on('load', this.pharmaStoreLoadComplete, comp);
		comp.store.load();
	},


	/**
	 * Sets the grid data, callback function for pharma store loading
	 * providde by the store associated to the pharma grid.
	 * NOTE!!!! The scope is the grid instance (PharByTargetScrollingGrid)
	 *
	 * @param {Ext.data.Store} store a reference to the grid component store
	 * @param {Array} recs
	 * @param {boolean} success true if request to backend was successful; false otherwise
	 */
	pharmaStoreLoadComplete: function (store, recs, success) {
		console.log("PharmByTargetScrollingGrid: pharma store completed...");
		var grid_view = this;
		var grid_store = grid_view.getStore();
		if (success) {
			// If some records are coming back then set the tsv download params
//      this.setTSVDownloadParams();
			//grid_view.down('#sdfDownload_id').disable();
			//grid_view.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
//      grid_view.down('#sdfDownloadProxy_id').enable();

//      grid_view.down('#tsvDownloadProxy_id').enable();
//      this.getSubmitButton().enable();
			grid_view.reconfigure();
			grid_view.setLoading(false);
			grid_view.setTitle(grid_view.gridBaseTitle + ' - Total Records: ' + grid_store.getTotalCount());
		}
		else {
			console.log(this.$className + ': possible timeout for with uri ' + grid_store.proxy.url);
//      this.getSubmitButton().enable();
			grid_view.setLoading(false);
//      grid_view.setTitle(grid_view.gridBaseTitle + ' ---- There was an error retrieving some of the records ----');
			Ext.MessageBox.show({
				title: 'Info',
				// msg: 'We are sorry but the OPS system returned an error.',
				msg: 'No pharmacology data was found for the target in the OPS system',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.INFO
			});
		}
	},


	/**
	 * Has to be called in any way before building the grid
	 */
	fetchTotalResults: function () {
		console.log('PharmByTargetScrollingGrid: fetchTotalResults() for ' + comp.$className);
		try {
			// Choosing between pharmaGrid or multiple targets grid
			var grid_view = this.getPharmaGrid();
			grid_view =  grid_view !== undefined? grid_view: this.getGridView();

			var grid_store = grid_view.getStore();
			var me = this;
			//grid_store.gridController = this;
			// var form = this.getFormView();
			// var button = this.getSubmitButton();
			// this.resetDownload();
			// var countStore = this.getCountStore();
			var countStore = Ext.create('TDGUI.store.lda.TargetPharmacologyCountStore');
			// countStore.uri = grid_store.proxy.reader.uri;
			countStore.proxy.extraParams = grid_store.proxy.extraParams;


			countStore.load(function (records, operation, success) {
				if (success) {
					var jsonResp = JSON.parse(operation.response.responseText);
					var total = jsonResp.result.primaryTopic.targetPharmacologyTotalResults;
					grid_store.proxy.reader.total_count = total;
					// we have the total number of results now and the proxy reader knows what it is so
					// fetch the first page of results
					if (total == 0) {
						grid_view.setTitle(grid_view.gridBaseTitle + ' - No records found within OPS for this search!');
						//grid_view.down('#sdfDownload_id').disable();
						//grid_view.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
						// grid_view.down('#sdfDownloadProxy_id').disable();
						// grid_view.down('#tsvDownloadProxy_id').disable();
						// button.enable();
						grid_view.setLoading(false);
						Ext.MessageBox.show({
							title: 'Info',
							msg: 'The OPS system does not contain any data that match this search.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
					}
					else {
						// for paginated grid use this
						// grid_store.load();
						grid_view.setTitle(grid_view.gridBaseTitle + ' - Total records: ' + total);
						grid_view.setLoading(false);
						grid_store.guaranteeRange(0, 24);
						// me.prepPharmaGrid(comp, opts);
					}
				}
				else {
					grid_view.setTitle(grid_view.gridBaseTitle + ' - We are sorry but the OPS system returned an error!');
					//grid_view.down('#sdfDownload_id').disable();
					//grid_view.down('#sdfDownloadProxy_id').setText('Prepare SD-file download');
					grid_view.down('#sdfDownloadProxy_id').disable();
					grid_view.down('#tsvDownloadProxy_id').disable();
					button.enable();
					grid_view.setLoading(false);
					Ext.MessageBox.show({
						title: 'Info',
						msg: 'We are sorry but the OPS system returned an error.',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
					});
				}
			});
			//}
		}
		catch (exception) {
			console.log('PharmByTargetScrollingGrid (' + this.$className + '): exception fetching results for ' + this.$className + 'with uri ' + grid_store.proxy.uri);
			Ext.MessageBox.show({
				title: 'Info',
				msg: 'We are sorry but the OPS system returned an error.',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.INFO
			});
		}
	},


	/**
	 * Initialize the grid mostly on regards to the grid's store. This is only for the "generic" dynamicgrid3, not for
	 * another grid xtype.
	 * @param comp the grid component
	 * @param opts the options to configure the proxy to set up the grid. It should
	 * be something like { actionMethods: { read: 'GET' }, api-read: 'urlread', params: {param1:val1, param2: val2}}
	 */
	initGrid: function (comp, opts) {
		console.log("PharmByTargetScrollingGrid controller: initGrid for " + comp.$className+" vs "+comp.getXType());

		if (comp.getXType().match(/tdgui-pharmbytargetscroll-grid/) != null)
			this.fetchTotalResults();

		if (comp.getXType().match(/dynamicgrid3/) == null)
			return;

		var me = this;
		var compActionMethods = comp.storeActionMethods;
		var theActionMethods =
			(compActionMethods === undefined || compActionMethods == null) ? {read: "GET"} : compActionMethods

		me.myMask.bindStore(comp.store);
		var defOpts = {
			actionMethods: theActionMethods,
			apiread: comp.readUrl,
			params: {
				offset: 0,
				limit: 50
			}
		}

// mix the props in the case opts does not have all properties
		for (props in opts)
			for (attrs in defOpts)
				if (props == attrs) defOpts[attrs] = opts[props];

		opts = defOpts;

//    var grid_view = this.query('dynamicgrid3')[0]
		/*
		 this.store.proxy.actionMethods = {read:'GET'};
		 this.store.proxy.api.read = grid_view.readUrl;
		 this.store.proxy.params = {offset:0, limit:100};
		 this.store.on('load', this.storeLoadComplete, this);
		 */
// grid store configuration through its proxy
		comp.store.proxy.actionMethods = opts.actionMethods;
		comp.store.proxy.api.read = opts.apiread;
		comp.store.proxy.params = opts.params;
		comp.store.on('load', this.setAndFillGrid, comp);
		comp.store.proxy.extraParams = comp.queryParams;
//    comp.store.proxy.extraParams = {entries: 'Q13362,P12345,P0AEN3,P0AEN2,P0AEN1'}

		comp.store.load()
	},
});
