/**
 * A custom event to fire every time a function in a rule is completed (as all
 * of them will be asynchronous).
 * rfe = Ext.create('RuleOperation', {
 * 	evName: 'event name',
 * 	listeners: {
 *  	operationComplete: function () {
 *      // some business logic
 *    }
 *  }
 * })
 *
 * /////
 * rfe.fireEvent('operationComplete');
 */
Ext.define('HT.lib.operation.CompoundDiseaseOperation', {
	// extend: 'Ext.util.Observable',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);

		this.evName = 'operationComplete';
		this.alias = 'compound-disease-operation';
		this.result = null;
		this.threshold = null;

		this.mixins.observable.constructor.call(this, config);
		this.addEvents({
			'operationCompleted': true
		});

		this.listeners = config.listeners;
		this.callParent(arguments);

	},


	/**
	 * This operation has to be two requests: get genes involved in the disease and
	 * then get the compounds interacting with the disease.
	 * @param {Object} edgeSrc the edge object for the source node (compound)
	 * @param {Object} edgeTrg the edge object for the target node (gene)
	 * @param {Float} threshold the value threshold
	 * @param {Function} funcObj the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var compName = edgeSrc.label;
		var diseaseName = edgeTrg.label;
		var payloadSrc = edgeSrc.payloadValue; // contains OMIM number, accessions and genes
		var payloadTrg = edgeTrg.payloadValue; // contains ids for the compound
		// var geneParam = payloadSrc.genes.split(',')[0];
		// var url = 'http://lady-qu.cnio.es:3003/pharma/gene/diseases.jsonp?ident=' + geneParam;


		// Method:
		// take the accessions got for the disease
		// get the bioactivites for all of them from Chembl
		// select the chembl ingredients involved on the bioactivities for the accessions
		// check if among the selected compounds (ingredients) is the target compound
		// accs = 'Q8N608,Q13093,P36222,Q9BZ11,Q9Y616,Q8TAX7,Q6W5P4,Q8N138,Q13258,Q9UL17';

		var accs_arr = payloadSrc.acc != null && payloadSrc.acc != "" > 0? payloadSrc.acc.split(','): [];
		var numReqs = accs_arr.length;
		var countReqs = 0;
		var data = [];
		var cmpdChemblId = 'CHEMBL786';
		cmpdChemblId = 'CHEMBL714'; // salbutamol
		cmpdChemblId = payloadTrg.chemblId;

		// Function to run an action after the concurrent request are finished
		var action = function () {
			// hold here the accessions found with assays for the compound
			var accessions4cmpd = [];
			Ext.each(data, function (compoundsAcc, index, dataItself) {
				if (compoundsAcc.compounds.indexOf(cmpdChemblId) != -1)
					accessions4cmpd.push({'acc': compoundsAcc.acc});
			});

			// it is suppossed that if accessions4cmpd is empty,
			// there is not connectin btw accessions and compound
			var result = accessions4cmpd.length; //  > 0
			funcObj.result = result;
			var hypothesiseResult = result > 0;

			var edgeId = 'e' + edgeSrc.id + '-' + edgeTrg.id;
			console.log('Operation finished!!!: ' + funcObj.result + ' for ' + edgeId);

			var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Disease -> Compound</span> operation<br/>('";
			msg += edgeSrc.label+"' -> '"+edgeTrg.label;
			msg += "')<br/>" + result;
			msg += " activities where found for proteins related to the '<i>" + diseaseName +"</i>' ";
			msg += "involving the compound '<i>"+compName+"</i>'</div>";
			me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
					hypothesiseResult, edgeId: edgeId, msg: msg});
		} // EO action function


		if (accs_arr.length == 0)
			action();
		else {
			Ext.each(accs_arr, function (acc, index, accessions) {
				var url = 'http://lady-qu.cnio.es:3003/pharma/xxxx/bioactivities.jsonp';
				url = url.replace('xxxx', acc);
				// get activities for every accession
				Ext.data.JsonP.request({
					url: url,

					failure: function (resp, opts) {
						funcObj.result = -1;
					},

					success: function (resp, opts) {
						var jsonObj = resp;
						var ingredientsChembl = [];

						if (jsonObj != null) {
							Ext.each(jsonObj.activities, function (actv, index, activities) {
								ingredientsChembl.push(actv.ingredient_cmpd_chemblid);
							});
							data.push({'acc': jsonObj.accession, 'compounds': ingredientsChembl});
						}

						countReqs++;
						if (countReqs == numReqs)
							action();

						/*
						 funcObj.result = result;
						 var hypothesiseResult = result !== false;

						 var edgeId = 'e' + edgeSrc.id + '-' + edgeTrg.id;
						 console.log('Operation finished!!!: ' + funcObj.result + ' for ' + edgeId);

						 me.fireEvent('operationComplete', {result: funcObj.result, hypothesis: hypothesiseResult, edgeId: edgeId});
						 */
					},

					scope: me
				})
			}) // EO Ext.each...
		} // EO else
	}

});

