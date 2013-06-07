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
Ext.define('HT.lib.operation.ProteinGeneOperation', {
	extend: 'HT.lib.operation.RuleOperation',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);
		this.callParent(arguments);
		this.alias = 'protein-gene-operation';
	},

	/**
	 * Query uniprot to see if the gene product is the target node.
	 * @param edgeSrc, the edge object for the source node
	 * @param edgeTrg, the edge object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var accSrc = edgeSrc.payloadValue.acc;
		// target is a gene entity, and in its payloadValue.uuid the gene ids and accessin are held
		var accTrg = edgeTrg.payloadValue.uuid;
		var genename = edgeSrc.label.split(',')[0].trim();
		var url = 'http://localhost:3003/api/target/'+accSrc+'.jsonp';

		Ext.data.JsonP.request({
			url: url,
			params: {
				threshold: (threshold === undefined || threshold == null)? 0.0: threshold
			},

			callback: function (opts, resp) {
				console.log('ajax callback');
			},

			failure: function (resp, opts) {
				funcObj.result = -1;
			},

			success: function (resp, opts) {
				var jsonObj = resp;
				var result = false;

				// To evaluate the hypothesis, search an entry in uniprot for the accession
				// and check if any of the genes matches with the target
				Ext.each(jsonObj.genes, function (gene, index, genes) {
					if (accTrg.indexOf(gene) != -1) {
						result = true;
						return false;
					}
				});

				funcObj.result = result;
				var hypothesiseResult = result !== false;

				var edgeId = 'e'+edgeSrc.id+'-'+edgeTrg.id;
				console.log('Operation finished!!!: '+funcObj.result+' for '+edgeId);
				var msg = "<span style=\"font-weight: bold;\">Protein -> Gene</span> operation<br/>('";
				msg += edgeSrc.label+"' -> '"+edgeTrg.label;
				msg += "')<br/>";
				if (result === true) {
					msg += "The protein with accession '"+accSrc+"' was yield by the gene";
					msg += "'"+genename+"'";
				}
				else {
					msg += "No relationship was found between the protein with accession'";
					msg += accSrc +"' and the gene '"+genename+"'";
				}
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
									hypothesiseResult, edgeId: edgeId, msg: msg});
			},

			scope: me
		})// EO JsonP request
	}

});
