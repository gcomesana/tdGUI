/**
 * @class TDGUI.controller.panels.MultiTarget", {
 * @extends Ext.app.Controller
 *
 * Controller for the multitarget panel (see {@link TDGUI.view.panel.MultiTarget MultiTarget panel})
 * on the ccontent area.
 * No methods in this class as the functionality is implemented as anonymous functions in the
 * {@link Ext.app.Controller#control control method}
 */
Ext.define("TDGUI.controller.panels.MultiTarget", {
	extend:'Ext.app.Controller',

	view:['panels.MultiTarget'],
	stores:[],

	refs:[
		{
			ref:'multitargetGrid',
			selector:'tdgui-multitargetpanel dynamicgrid3'
		},
		{
			ref:'gridPanel', // neccessary to retrieve list targets, no matter if the original was changed
			selector:'tdgui-multitargetpanel'
		}
	],


	myMask: undefined,

	init:function () {
		console.info('Initializing MultiTarget controller...')

		this.control({
			'tdgui-multitargetpanel dynamicgrid3':{
				itemdblclick:function (view, record, item, index, e, opts) {

					var gridAccs = record.data.accessions
					console.info('accessions for selected one: '+gridAccs);

					Ext.each (gridAccs, function (acc, index, accsItself){
						var ini = acc.indexOf('>');
						var end = acc.lastIndexOf('<');
						if (ini != -1 && end != -1)
							acc = acc.substring(ini+1, end);

						accsItself[index] = acc;
					})

					var listTargetsStore = this.getGridPanel().getListTargetsStore();
//          var recs = this.getItemList().getStoreObject ('uniprot_acc', gridAccs)
//          var recs = listTargetsStore.findRecord('uniprot_acc', gridAccs)
					var recs = listTargetsStore.getAt(index);

// Compose de uniprot parameter (in this case an uniprot url) to proteinInfo
					var primaryAcc = recs.data.uniprot_acc[0];
					var uniprotParam = 'http://www.uniprot.org/uniprot/'+primaryAcc;

					var conceptUUID = recs.data.concept_uuid;
					var conceptURI = 'http://www.conceptwiki.org/concept/'+conceptUUID;

// get the accession from the table/grid
//          var accessions = record.data.accessions.join(',')

					var qParam = conceptURI+','+uniprotParam;
					var dcParam = '&dc='+Math.random();
					// var targetAcc = record.data.accessions[0];
					// var targetParam = '&acc='+targetAcc;
					Ext.History.add('!xt=tdgui-targetinfopanel&qp=' + qParam + dcParam);
				} // itemdoblclick

/*
				'tdgui-multitargetpanel': {
					afterrender: function (comp, opts) {
						console.log('Multitarget controller afterrender');
						var theGrid = comp.theGrid()

						if (theGrid != null && theGrid !== undefined) {
							var numColumns = theGrid.columns.length
							Ext.each (theGrid.columns, function (col, index, cols) {

							})

						}

					}
				} // EO tdgui-multitargetpanel
*/
			}
		})
	},

	onLaunch:function (app) {
		myMask = new Ext.LoadMask (Ext.getBody(), {msg: 'It\'s ok...'})
	}
})