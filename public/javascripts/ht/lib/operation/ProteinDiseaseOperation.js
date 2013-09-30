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
Ext.define('HT.lib.operation.ProteinDiseaseOperation', {
	extend: 'HT.lib.operation.RuleOperation',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);
		this.callParent(arguments);
		this.alias = 'protein-disease-operation';
	},

	/**
	 * From the disease information from OMIM, gets if there is a relationship
	 * between disease and target. Similar to disease-gene
	 * @param {Object} edgeSrc the edge object for the source node
	 * @param {Object} edgeTrg the edge object for the target node
	 * @param {float} threshold the value threshold
	 * @param {Function} funcObj the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var payloadSrc = edgeSrc.payloadValue;
		var payloadTrg = edgeTrg.payloadValue;
		var accSrc = payloadSrc.acc; // here is the accession for the protein/target

		var url = "http://"+TDGUI.Globals.Host+"/pharma/target/diseases.jsonp?accession="+accSrc;

		Ext.data.JsonP.request({
			url: url,

			callback: function (opts, resp) {
				console.log('ajax callback');
			},

			failure: function (resp, opts) {
				funcObj.result = -1;
			},

			// In this case, we just check if the gene names match
			success: function (resp, opts) {
				var jsonObj = resp;
				var result = false;
				var positiveCount = 0; // counter for positive matches

				// check if jsonObj.diseases contains some diseases in
				var tags = edgeTrg.tags.split(',');
				var diseases = jsonObj.diseases; // an array of strings with the diseases
				var tagDiseases = [];
				Ext.each(diseases, function (disease, index, diseaseList) {

					Ext.each(tags, function (tag, index, tagList) {
						if (tag !== '' && disease.indexOf(tag) != -1) {
							tagDiseases.push(tag);
							positiveCount++;
							result = result || true;
						}
					})
				});

				funcObj.result = positiveCount;
				var hypothesiseResult = result !== false;

				var edgeId = 'e'+edgeSrc.id+'-'+edgeTrg.id;
				console.log('Operation finished!!!: '+funcObj.result+' for '+edgeId);

				var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Protein -> Disease</span> operation<br/>('";
				msg += edgeSrc.label+"' -> '"+edgeTrg.label;
				msg += "')<br/>";
				msg += "Related diseases were found where the protein is involved in ";
				msg += "(<span style=\"font-style: italic;\">"+tagDiseases.join(', ')+"</span>)</div>";
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
									hypothesiseResult, edgeId: edgeId, msg: msg});
			},

			scope: me
		})// EO JsonP request
	}

});
