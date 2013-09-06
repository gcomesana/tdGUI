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
Ext.define('HT.lib.operation.InteractionsRuleOperation', {
	extend: 'HT.lib.operation.RuleOperation',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);
		this.callParent(arguments);
		this.alias = 'target-target-interactions';
		/*
		 this.evName = 'operationComplete';
		 this.result = null;
		 this.threshold = null;

		 this.mixins.observable.constructor.call(this, config);
		 this.addEvents({
		 'operationCompleted': true
		 }),

		 this.listeners = config.listeners;
		 this.callParent(arguments);
		 */

	},

	/**
	 * Gets interactions and evaluates the result to provide a value to decide if
	 * the two targets (in this particular case) interact each other
	 * @param edgeSrc, the edge object for the source node
	 * @param edgeTrg, the edge object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var payloadSrc = edgeSrc.payloadValue;
		var payloadTrg = edgeTrg.payloadValue;
		var accSrc = payloadSrc.acc[0]; // this is the list of uniprot urls
		var accTrg = payloadTrg.acc[0]; // have to extract the accesssions
		accSrc = accSrc.substring(accSrc.indexOf('>')+1, accSrc.lastIndexOf('<'));
		accTrg = accTrg.substring(accTrg.indexOf('>')+1, accTrg.lastIndexOf('<'));

		/*
		var initIdx = uniprotUrl.indexOf('>');
		var endIdx = uniprotUrl.indexOf('<', initIdx);
		var acc = uniprotUrl.substring(initIdx+1, endIdx);
		*/
		var url = 'http://lady-qu.cnio.es:3003/api/interactions/'+accSrc+'/'+accTrg+'.jsonp';

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
				var result;
				var sumConfVal = 0;
				if (jsonObj.totalCount > 0) {
					Ext.each(jsonObj.interactions, function (inter, index, interactions) {
						sumConfVal += inter.conf_value;
					})
					result = sumConfVal / jsonObj.totalCount;
				}

				funcObj.result = result === undefined? -1: result;
				var hypothesiseResult = result !== undefined;

				var edgeId = 'e'+edgeSrc.id+'-'+edgeTrg.id;
				console.log('Operation finished!!!: '+funcObj.result+' for '+edgeId);
				var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Compound -> Protein</span> operation<br/>('";
				msg += edgeSrc.label+"' -> '"+edgeTrg.label;
				msg += "')<br/>"+activityCount;
				msg += " interactions where found in IntactDB for both proteins<br/>";
				msg += "The averager confidence value for them is "+result;
				msg += "</div>";
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis:
						hypothesiseResult, edgeId: edgeId, msg: msg});

				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis: hypothesiseResult, edgeId: edgeId});
			},

			scope: me
		})// EO JsonP request
	}

});
