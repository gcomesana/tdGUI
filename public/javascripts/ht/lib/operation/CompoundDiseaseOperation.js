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

		// Method:
		// take the chemblId of the source payload
		// get the bioactivites for it from Chembl
		// check if any of the target_accessions of the activities match with the disease involved accessions
		// [accs = 'Q8N608,Q13093,P36222,Q9BZ11,Q9Y616,Q8TAX7,Q6W5P4,Q8N138,Q13258,Q9UL17';]
		var data = [];
		var cmpdChemblId = 'CHEMBL786';
		cmpdChemblId = 'CHEMBL714'; // salbutamol
		cmpdChemblId = payloadSrc.chemblId;
		var diseaseAcc = payloadTrg.acc;
		var result = 0;

		// Function to run an action after the concurrent request are finished
		var action = function () {
			funcObj.result = result;
			var hypothesiseResult = result > 0;

			var edgeId = 'e' + edgeSrc.id + '-' + edgeTrg.id;
			console.log('Operation finished!!!: ' + funcObj.result + ' for ' + edgeId);

			var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Compound -> Disease</span> operation<br/>('";
						msg += edgeSrc.label+"' -> '"+edgeTrg.label;
						msg += "')<br/>" + result;
						msg += " activities where found for proteins related to the '<i>" + diseaseName +"</i>' ";
						msg += "involving the compound '<i>"+compName+"</i>'</div>";
					
			me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
										hypothesiseResult, edgeId: edgeId, msg: msg});
		} // EO action function
		

		if (cmpdChemblId == '' || cmpdChemblId === undefined)
			action();

		else {
			var url = "http://"+TDGUI.Globals.Host+"/pharma/compound/activities/xxxx.jsonp";
			url = url.replace('xxxx', cmpdChemblId);
			// get activities for every accession
			Ext.data.JsonP.request({
				url: url,
				timeout: 30000,

				failure: function (resp, opts) {
					console.log("This is impossible for..."+cmpdChemblId);
					funcObj.result = -1;
					action ();
				},

				success: function (resp, opts) {
					var jsonObj = resp;
					var accessionsActivities = [];

					if (jsonObj != null) {
						Ext.each(jsonObj.activities, function (actv, index, activities) {
							var accessions = actv.target_accessions.split(',');
							accessionsActivities.push.apply(accessionsActivities, accessions);

							if (accessions.indexOf(diseaseAcc) != -1)
								result++;
						});
					}

					action();
/*
					countReqs++;
					if (countReqs == numReqs)
						action();
*/

					/* result = accessionsActivities.indexOf(diseaseAcc) != -1;					
					funcObj.result = result;
					var hypothesiseResult = result != 0;

					var edgeId = 'e' + edgeSrc.id + '-' + edgeTrg.id;
					console.log('Operation finished!!!: ' + funcObj.result + ' for ' + edgeId);

					var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Disease -> Compound</span> operation<br/>('";
						msg += edgeSrc.label+"' -> '"+edgeTrg.label;
						msg += "')<br/>" + result;
						msg += " activities where found for proteins related to the '<i>" + diseaseName +"</i>' ";
						msg += "involving the compound '<i>"+compName+"</i>'</div>";
					
					me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
												hypothesiseResult, edgeId: edgeId, msg: msg});

					 // me.fireEvent('operationComplete', {result: funcObj.result, hypothesis: hypothesiseResult, edgeId: edgeId});
					*/
				}, // EO success

				scope: me
			}); // EO JsonP request
		} // EO else
	}

});

