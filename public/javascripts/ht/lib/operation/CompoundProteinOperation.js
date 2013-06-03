

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
Ext.define('HT.lib.operation.CompoundProteinOperation', {
	// extend: 'Ext.util.Observable',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	constructor: function (config) {
		// this.initConfig(config);

		this.evName = 'operationComplete';
		this.alias = 'compound-protein-operation';
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
	 * Get if the compound has any sort of relationship with the gene (target node)
	 * @param {Object} edgeSrc the edge object for the source node (compound)
	 * @param {Object} edgeTrg the edge object for the target node (gene)
	 * @param {Float} threshold the value threshold
	 * @param {Function} funcObj the function object {alias, threshold, result} to hold the result
	 */
	operation: function (edgeSrc, edgeTrg, threshold, funcObj) {
		var me = this;
		var payloadSrc = edgeSrc.payloadValue;
		var payloadTrg = edgeTrg.payloadValue;
		var url = 'http://localhost:3003/pharma/compound/activities/' + payloadSrc.chemblId + '.jsonp';

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
					var activity_accesions = activity.target_accessions.split(',');
					if (activity_accesions.indexOf(payloadTrg.acc) != -1) {
						result = true;
						return false;
					}
					/*
					Ext.each(activity_accesions, function (accs, index, accs_list) {
						if (payloadTrg.indexOf(accs) != -1) {
							result = true;
							return false;
						}

					});
					return !result; // if result is false, continue, otherwise break the loop
					*/
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

