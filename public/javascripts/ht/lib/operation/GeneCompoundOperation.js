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
Ext.define('HT.lib.operation.GeneCompoundOperation', {
	// extend: 'Ext.util.Observable',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);

		this.evName = 'operationComplete';
		this.alias = 'gene-compound-operation';
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
	 * From the gene name or symbol, get if interacts with target compound in any way
	 * @param edgeSrc, the edge object for the source node
	 * @param edgeTrg, the edge object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var payloadSrc = edgeSrc.payloadValue;
		var payloadTrg = edgeTrg.payloadValue;
		var url = 'http://localhost:3003/pharma/' + payloadSrc.acc + '/bioactivities.jsonp';

		Ext.data.JsonP.request({
			url: url,

//			callback: function (opts, resp) {
//			},

			failure: function (resp, opts) {
				funcObj.result = -1;
			},

			success: function (resp, opts) {
				var jsonObj = resp;
				var result = false;

				var activityList = jsonObj.activities; // array of activities involving the protein

				Ext.each(activityList, function (activity, index, activities) {
					if (activity.ingredient_cmpd_chemblid == payloadTrg.chemblId) {
						result = true;
						return false;
					}
				});

				funcObj.result = result;
				var hypothesiseResult = result !== false;

				var edgeId = 'e' + edgeSrc.id + '-' + edgeTrg.id;
				console.log('Operation finished!!!: ' + funcObj.result + ' for ' + edgeId);

				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis: hypothesiseResult, edgeId: edgeId});
			},

			scope: me
		})
	}

});
