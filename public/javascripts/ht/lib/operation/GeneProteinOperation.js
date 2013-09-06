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
Ext.define('HT.lib.operation.GeneProteinOperation', {
	extend: 'HT.lib.operation.RuleOperation',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);
		this.callParent(arguments);
		this.alias = 'gene-protein-operation';
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
		var accTrg = edgeTrg.payloadValue.acc;
		var genename = edgeSrc.label.split(',')[0].trim();
		var url = 'http://lady-qu.cnio.es:3003/api/target/by_gene.jsonp?genename='+genename;

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

				// To evaluate the hypothesis, search an entry in uniprot for the gene
				// and check if any of the accessions matches with the target accession
				Ext.each(jsonObj.accessions, function (acc, index, accessions) {
					var init = acc.indexOf('>');
					var end = acc.lastIndexOf('<');
					var acc = acc.substring(init+1, end);

					if (acc == accTrg) {
						result = true;
						return false;
					}
				});

				funcObj.result = result;
				var hypothesiseResult = result !== false;

				var edgeId = 'e'+edgeSrc.id+'-'+edgeTrg.id;
				console.log('Operation finished!!!: '+funcObj.result+' for '+edgeId);
				var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Gene -> Protein</span> operation<br/>('";
				msg += edgeSrc.label+"' -> '"+edgeTrg.label;
				msg += "')<br/>";
				if (result === true) {
					msg += "Protein "+edgeTrg.label+" was identified as a product of ";
					msg += edgeSrc.label+" after querying Uniprot";
				}
				else {
					msg += "It wasn't found the protein '"+edgeTrg.label;
					msg += "' is a product of the gene '"+genename+"'";
				}
				msg += "</div>";
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
						hypothesiseResult, edgeId: edgeId, msg: msg});
			},

			scope: me
		})// EO JsonP request
	}

});
