
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
Ext.define('HT.lib.operation.DiseaseGeneOperation', {
	extend: 'HT.lib.operation.RuleOperation',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);
		this.callParent(arguments);
		this.alias = 'disease-gene-operation';
	},

	/**
	 * Starting out of a OMIMid for a disease/trait, make a request to get the gene_symbols for the disease/trati.
	 * At least one of the gene should be in the target to assert the rule.
	 * @param edgeSrc, the edge object for the source node
	 * @param edgeTrg, the edge object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var payloadSrc = edgeSrc.payloadValue;
		var payloadTrg = edgeTrg.payloadValue;
		var genename = edgeSrc.label.split(',')[0].trim();
		var url = "http://"+TDGUI.Globals.Host+"/pharma/disease/genemap.jsonp?mim_number="+edgeSrc.payloadValue.uuid; // OMIMid when entity = disease

		Ext.data.JsonP.request({
			url: url,

			callback: function (opts, resp) {
				console.log('ajax callback for DiseaseGeneOperation');
			},

			failure: function (resp, opts) {
				funcObj.result = -1;
				console.log("DiseaseGeneOperation: impossible for "+edgeSrc.payloadValue.uuid);
				me.fireEvent('operationComplete', {
					result: funcObj.result, 
					hypothesis:	false, 
					edgeId: 'e' + edgeSrc.id + '-' + edgeTrg.id,
					msg: 'Timeout: could not complete the operation. Can try again in few seconds'
				});
			},

			// In this case, we just check if the gene names match
			success: function (resp, opts) {
				var jsonObj = resp;
				var result = false;

				var geneList = jsonObj.genes; // an array of {mim_number, gene_symbol} objects
				Ext.each(geneList, function (geneObj, index, genesItself) {
					var genes = geneObj.gene_symbol.split(',');
					Ext.each(genes, function (genename, indexBis, geneArr) {
						// if a genename is in the genes list, then result is true
						if (payloadTrg.genes.indexOf(genename) != -1) {
							result = true;
							return false;
						}
					});
					if (result = true)
						return false; // finish outer each loop
				});
				
				funcObj.result = result;
				var hypothesiseResult = result !== false;

				var edgeId = 'e'+edgeSrc.id+'-'+edgeTrg.id;
				console.log('Operation finished!!!: '+funcObj.result+' for '+edgeId);
				var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Disease -> Gene</span> operation<br/>('";
				msg += edgeSrc.label+"' -> '"+edgeTrg.label;
				msg += "')<br/>";
				msg += "The gene was found to be related to the disease according to OMIM ";
				msg += "(after requesting the genemap for the disease)</div>";
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
								hypothesiseResult, edgeId: edgeId, msg: msg});
			},

			scope: me
		})// EO JsonP request
	}

});
