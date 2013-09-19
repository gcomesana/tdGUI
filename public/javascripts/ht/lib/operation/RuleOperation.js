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
Ext.define('HT.lib.operation.RuleOperation', {
	// extend: 'Ext.util.Observable',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);

		this.evName = 'operationComplete';
		this.alias = 'operation-alias';
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
	 * Gets interactions and evaluates the result to provide a value to decide if
	 * the two targets (in this particular case) interact each other
	 * @param edgeSrc, the edge object for the source node
	 * @param edgeTrg, the edge object for the target node
	 * @param threshold, the value threshold
	 * @param funcObj, the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var accSrc = edgeSrc.payloadValue.acc;
		var accTrg = edgeTrg.payloadValue.acc;
		var url = "http://"+TDGUI.Globals.theServer+":"+TDGUI.Globals.thePort+"/api/interactions/"+accSrc+"/"+accTrg+".jsonp";

		Ext.data.JsonP.request({
			url: url,
			params: {
				threshold: (threshold === undefined || threshold == null)? 0.0: threshold
			},

//			callback: function (opts, resp) {
//			},

			failure: function (resp, opts) {
				funcObj.result = -1;
			},

			success: function (resp, opts) {
				me.resumeEvents();
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
				me.fireEvent('operationComplete', {result: result, edge: edge});
				me.suspendEvents();
			},

			scope: me
		})
	}

});
