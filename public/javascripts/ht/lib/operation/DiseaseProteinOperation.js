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
Ext.define('HT.lib.operation.DiseaseProteinOperation', {
	extend: 'HT.lib.operation.RuleOperation',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);
		this.callParent(arguments);
		this.alias = 'disease-protein-operation';
	},

	/**
	 * From the disease information from OMIM, gets if there is a relationship
	 * between disease and target. Similar to disease-gene
	 * @param edgeSrc, the edge object for the source node
	 * @param edgeTrg, the edge object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var accSrc = edgeSrc.payloadValue.acc;

		var accTrg = edgeTrg.payloadValue.acc;
		var payloadTrg = edgeTrg.payloadValue;

		var genename = edgeSrc.label.split(',')[0].trim();
		var url = 'http://lady-qu.cnio.es:3003/pharma/disease/genemap.jsonp?mim_number='+edgeSrc.payloadValue.uuid; // OMIMid when entity = disease

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
				var hits = [];

				var geneList = jsonObj.genes; // an array of {mim_number, gene_symbol} objects
				Ext.each(geneList, function (geneObj, index, genesItself) {
					var genes = geneObj.gene_symbol.split(',');
					Ext.each(genes, function (genename, indexBis, geneArr) {
						// if a genename is in the genes list, then result is true
						if (payloadTrg.genes.indexOf(genename) != -1) {
							result = true;
							hits.push(genename);
							// return false;
						}
					});
					// if (result)
						// return false; // finish outer each loop
				});

				funcObj.result = result;
				var hypothesiseResult = result !== false;

				var edgeId = 'e'+edgeSrc.id+'-'+edgeTrg.id;
				console.log('Operation finished!!!: '+funcObj.result+' for '+edgeId);

				var msg = "<span style=\"font-weight: bold;\">Disease -> Protein</span> operation<br/>('";
				msg += edgeSrc.label+"' -> '"+edgeTrg.label;
				msg += "')<br/>";
				msg += hits.length+" relationships between disease and protein where found in OMIM";
				if (hits.length > 0)
					msg += ': '+hits.join(',');
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
										hypothesiseResult, edgeId: edgeId, msg: msg});
			},

			scope: me
		})// EO JsonP request
	}

});
