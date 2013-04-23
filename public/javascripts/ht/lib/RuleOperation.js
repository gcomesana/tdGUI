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
Ext.define('HT.lib.RuleOperation', {
	// extend: 'Ext.util.Observable',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);

		this.evName = 'operationComplete';
		this.alias = 'target-target-interactions';
		this.result = null;
		this.threshold = null;

		this.mixins.observable.constructor.call(this, config);
		this.addEvents({
			'operationCompleted': true
		}),

		this.listeners = config.listeners;
		this.callParent(arguments);

	},


	operation: function (valSrc, valTrg, threshold, funcObj) {
		var me = this;
		var url = 'http://localhost:3003/api/interactions/'+valSrc+'/'+valTrg+'.jsonp';

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
				var result = jsonObj.totalCount;
				var sumConfVal = 0;
				if (jsonObj.totalCount > 0) {
					Ext.each(jsonObj.interactions, function (inter, index, interactions) {
						sumConfVal += inter.conf_value;
					})
					result = sumConfVal / jsonObj.totalCount;
				}

				funcObj.result = result;
				console.log('Operation finished!!!: '+funcObj.result);
				me.fireEvent('operationComplete', {result: result});
			},

			scope: me
		})
	}

});
