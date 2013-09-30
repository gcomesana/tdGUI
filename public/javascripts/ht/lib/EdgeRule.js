/**
 * This is a rule class to evaluate some hypothesis between two entities (nodes)
 * in the cytoscape graph. The rule will be actually a set of functions, as
 * there will be different ways to validate an hypothesis to connect two terms
 * (interactions between them, connection between pathways, prone to disease...).
 * These functions will have to be wrapped in an object to keep the result returned
 * by every function and to provide a threshold to evaluate (further) if the hypothesis
 * can be asserted.
 */
Ext.define('HT.lib.EdgeRule', {

	config: {
		/**
		 * The node source of the edge, where the (entry) values are found.
		 * This should be an object with at least the following members:
		 * - id
		 * - label
		 * - entity
		 * - payloadValue
		 */
		edgeSource: undefined,
		/**
		 * The node target of the edge. The result should/could be compared with
		 * the values found here to evaluate the hypothesis
		 */
		edgeTarget: undefined,

		/**
		 * The array of functions which put together as a rule. This is actually an
		 * array of objects wrapping the function an more values as it follows:
		 * funcObj = {
		 * 	result
		 * 	funcItself
		 * 	threshold
		 * 	alias
		 * }
		 *
		ruleFunctions: []
		 */

		/**
		 * The array of objects to keep the name of the function to run and its result
		 * and threshold, like this:
		 * aliasObj = {
		 * 	result
		 * 	threshold
		 * 	alias
		 * }
		 *
		 * From the alias the actual function can be retrieved and, then, run
		 */
		ruleAliases: []
	},

	constructor: function (config) {

		this.initConfig(config);
		/*
		this.edgeSource = nodeSource;
		this.edgeTarget = nodeTarget;

		this.functions = []; // the functions to run on the edge
    */
		this.threshold = undefined; // the threshold to set for the function(s) result(s)
		this.result = undefined; // the result of the (last) execution of this rule

		this.sourceType = this.getEdgeSource().entity; // the type of the source node
		this.targetType = this.getEdgeTarget().entity; // the type of the target node
		// this.addFunctions();
	},



	/**
	 * Executes the function(s) associated to this rule with the proper values.
	 * It iterates over the ruleFunctions array, which is an array of js objects like:
	 * ruleFunction = {
	 * 		alias
	 * 		result
	 * 	  threshold
	 * 	  func
	 * }
	 *
	 * All functions are run asynchronously
	 */
	run: function () {
		var me = this;
		Ext.each(me.ruleFunctions, function (ruleFunc, index, functions) {
			ruleFunc.func(me.edgeSource.payloadValue,
									me.edgeTarget.payloadValue, ruleFunc.threshold, ruleFunc);
		})
	},



	addFunction: function () {
		var functionObj = {
			result: undefined,
			threshold: undefined,
			alias: 'targets-interaction',
			func: undefined
		};


		/**
		 * Gets interactions among the two values
		 * Call the API at <rails_server>:<rails_port>/api/interactions/target1/target2?conf_val=val
		 * @param {String} valSrc the accession of one target
		 * @param {String} valTrg the accession for the other target
		 * @param {float} threshold the confidence value to filter the interactions
		 * @param {Object} funcObj the function object
		 * @return {Object} an object with information about the found interactions
 		 */
		var interactionFunc = function (valSrc, valTrg, threshold, funcObj) {
			var url = "http://"+TDGUI.Globals.Host+"/api/interactions/"+valSrc+'/'+valTrg;
			url = (threshold === undefined || threshold == null)? url: url+
				'?threshold='+threshold;

			Ext.Ajax.request({
				url: url,
				method: 'GET',

				failure: function (resp, opts) {
					funcObj.results = -1;
				},

				success: function (resp, opts) {
					var jsonObj = Ext.JSON.decode(resp.body);
					var result = jsonObj.totalCount;
					var sumConfVal = 0;
					if (jsonObj.totalCount > 0) {
						Ext.each(jsonObj.interactions, function (inter, index, interactions) {
							sumConfVal += inter.conf_value;
						})
						result = sumConfVal / jsonObj.totalCount;
					}

					funcObj.result = result;
				}
			});
		} // EO interactionFunc

		functionObj.func = interactionFunc;
		functionObj.threshold = 0.32;

		return functionObj;
	} // EO addFunctions




})