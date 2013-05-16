

// Ext.require('HT.lib.RuleFunctionEvent')
Ext.define('HT.lib.RuleFunctions', (function () {


	/**
	 * Template for a function object. The alias will be the value which will be
	 * assigned to the rules. When the rule have to be run, the actual function will
	 * be get from the alias
	 * @type {{alias: string, func: Function}}
	 */
	var interactionFunc = {
		// result: undefined,
		// threshold: undefined,
		alias: 'target-target-interactions',




		/**
		 * Template function Object to get along a rule
		 * Gets interactions among the two values
		 * Call the API at localhost:<rails_port>/api/interactions/target1/target2?conf_val=val
		 * @param {String} valSrc the accession of one target
		 * @param {String} valTrg the accession for the other target
		 * @param {Number} threshold the confidence value to filter the interactions
		 * @param {Object} funcObj the javascript object containing result, threshold and alias properties
		 * @return {Object} an object with information about the found interactions
		 */
		func: function (valSrc, valTrg, threshold, funcObj) {
			// console.log('calling interactionFunc.interaction: '+valSrc+', '+valTrg);
			var url = 'http://localhost:3003/api/interactions/'+valSrc+'/'+valTrg+'.jsonp';
			/* url = (threshold === undefined || threshold == null)? url: url+
				'?threshold='+threshold;
      */

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
				}

			})
		} // EO func member
	}; // EO interactionFunc object

// TODO functions should be kept in a store, with members result, threshold, result, func
	var ruleFunctionsStore = [interactionFunc];



	var interactionOp = Ext.create('HT.lib.InteractionsRuleOperation', {});
	var operationStore = [interactionOp]; // Actual logic for rule operations come from here!!!!



	var notImplementedYet = function (valSrc, valTrg, threshold, funcObj) {
		console.error('Not implemented yet...');

		return -1;
	};


	return {

		requires: ['HT.lib.Util', 'HT.lib.RuleOperation', 'HT.lib.InteractionsRuleOperation'],

		constructor: function () {
			this.callParent(arguments);

			// var op = Ext.create('HT.lib.RuleOperation', {});
			var op = Ext.create('HT.lib.InteractionsRuleOperation', {});
			console.log('op.alias: '+op.alias);
			operationStore.push(op);
		},

		statics: {
			getFunctionsRule: function (entitySrc, entityTarget) {
				var funcArray = [];

				switch (entitySrc) {
					case HT.lib.CytoscapeActions.PROTEIN:
						switch (entityTarget) {
							case HT.lib.CytoscapeActions.PROTEIN:
								var clonedFunc = HT.lib.Util.clone(interactionFunc);
								funcArray.push(clonedFunc);
								break;

							default:
								var clonedFunc = HT.lib.Util.clone(interactionFunc);
								funcArray.push(clonedFunc);
								break;
						}
						break;

					default:
						var clonedFunc = HT.lib.Util.clone(interactionFunc);
						funcArray.push(clonedFunc);
						break;
				}
				return funcArray;
			}, // EO getFunctionsRule


			/**
			 * Gets a list of function aliases matching with source and target entities.
			 * Note: far to be finished, as it should loop over the operations store items.
			 * @param {Number} entitySrc
			 * @param {Number} entityTarget
			 * @returns {Array} an array with the function objects...
			 */
			getAliasesFunctions: function (entitySrc, entityTarget) {
				var aliasArray = [];
				var aliasObj = {
					result: interactionFunc.result,
					threshold: undefined
				};

				switch (entitySrc) {
					case HT.lib.CytoscapeActions.PROTEIN:
						switch (entityTarget) {
							case HT.lib.CytoscapeActions.PROTEIN:
								aliasObj.alias =  interactionFunc.alias;
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias =  interactionFunc.alias;
								aliasArray.push(aliasObj);
								break;
						}
						break;

					default:
						// var aliasFunc = HT.lib.Util.clone(interactionFunc);
						aliasObj.alias =  interactionFunc.alias;
						aliasArray.push(aliasObj);
						break;
				}

				return aliasArray;
			},


			/**
			 * It gets the operation from the alias.
			 * @param {String} alias the alias of the operation
			 * @return {HT.lib.RuleOperation} the operation object
			 */
			getOperationFromAlias: function (alias) {
				var theFunc = null;
				Ext.each(operationStore, function (operation, index, functionSet) {
					if (operation.alias == alias) {
						theFunc = operation;
						return true;
					}
				});	// EO each

				return theFunc;
			},


			getFunctionFromAlias: function (alias) {
				var theFunc = null;
				Ext.each(ruleFunctionsStore, function (ruleFunc, index, functionSet) {
					if (ruleFunc.alias == alias) {
						theFunc = ruleFunc.func;
						return true;
					}
				})	// EO each

				return theFunc
			},


			test: function (param) {
				return 'RuleFunctions.test('+param+') was called'
			}
		} // EO statics

	} // EO return
})() // EO function as config!!

); // EO RuleFunctions class