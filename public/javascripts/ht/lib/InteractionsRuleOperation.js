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
Ext.define('HT.lib.InteractionsRuleOperation', {
	extend: 'HT.lib.RuleOperation',
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
	 * @param valSrc, the payloadValue object for the source node
	 * @param valTrg, the payloadValue object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (valSrc, valTrg, threshold, funcObj) {
		var me = this;
		var accSrc = valSrc.acc;
		var accTrg = valTrg.acc;
		var url = 'http://localhost:3003/api/interactions/'+accSrc+'/'+accTrg+'.jsonp';

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

				console.log('Operation finished!!!: '+funcObj.result);
				me.fireEvent('operationComplete', {result: funcObj.result, hypothesis: hypothesiseResult});
			},

			scope: me
		})// EO JsonP request
	}

});
