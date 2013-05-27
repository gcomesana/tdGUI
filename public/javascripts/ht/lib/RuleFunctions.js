

// Ext.require('HT.lib.RuleFunctionEvent')
Ext.define('HT.lib.RuleFunctions', (function () {


	/**
	 * Template for a function object. The alias will be the value which will be
	 * assigned to the rules. When the rule have to be run, the actual function will
	 * be get from the alias
	 * @type {{alias: string}}
	 */
	var interactionFunc = {
		// result: undefined,
		// threshold: undefined,
		alias: 'target-target-interactions'
		
	}; // EO interactionFunc object

// TODO functions should be kept in a store, with members result, threshold, result, func
//	var ruleFunctionsStore = [interactionFunc];


	var interactionOp = Ext.create('HT.lib.operation.InteractionsRuleOperation', {});
	var geneProteinOp = Ext.create('HT.lib.operation.GeneProteinOperation', {});
	var proteinGeneOp = Ext.create('HT.lib.operation.ProteinGeneOperation', {});
	var diseaseGeneOp = Ext.create('HT.lib.operation.DiseaseGeneOperation', {});
	var operationStore = [interactionOp, geneProteinOp, proteinGeneOp, diseaseGeneOp]; // Actual logic for rule operations come from here!!!!

	var notImplementedYet = function (valSrc, valTrg, threshold, funcObj) {
		console.error('Not implemented yet...');

		return -1;
	};


	return {

		requires: ['HT.lib.Util', 'HT.lib.operation.RuleOperation',
			'HT.lib.operation.InteractionsRuleOperation', 'HT.lib.operation.GeneProteinOperation',
			'HT.lib.operation.DiseaseGeneOperation'],
/*
		constructor: function () {
			console.log("RuleFunctions constructor!!!");
			this.callParent(arguments);

			// var op = Ext.create('HT.lib.RuleOperation', {});
			var opInteractions = Ext.create('HT.lib.operation.InteractionsRuleOperation', {});
			var opGeneProtein = Ext.create('HT.lib.operation.GeneProteinOperation', {});
			console.log('op.alias: '+op.alias);
			operationStore.push(opInteractions);
			operationStore.push(opGeneProtein);
		},
*/
		statics: {
			/*
			getFunctionsRule: function (entitySrc, entityTarget) {
				var funcArray = [];
				var clonedFunc;

				switch (entitySrc) {
					case HT.lib.CytoscapeActions.PROTEIN:
						switch (entityTarget) {
							case HT.lib.CytoscapeActions.PROTEIN:
								clonedFunc = HT.lib.Util.clone(interactionFunc);
								funcArray.push(clonedFunc);
								break;

							default:
								clonedFunc = HT.lib.Util.clone(interactionFunc);
								funcArray.push(clonedFunc);
								break;
						}
						break;

					default:
						clonedFunc = HT.lib.Util.clone(interactionFunc);
						funcArray.push(clonedFunc);
						break;
				}
				return funcArray;
			}, // EO getFunctionsRule
			*/

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

				var srcEntityCode = HT.lib.CytoscapeActions.convert2entity(entitySrc);
				var trgEntityCode = HT.lib.CytoscapeActions.convert2entity(entityTarget);

				// switch (entitySrc) {
				switch (srcEntityCode) {
					case HT.lib.CytoscapeActions.PROTEIN:
						switch (trgEntityCode) {
							case HT.lib.CytoscapeActions.PROTEIN:
								aliasObj.alias =  interactionFunc.alias;
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.GENE:
								aliasObj.alias = 'protein-gene-operation';
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias =  interactionFunc.alias;
								aliasArray.push(aliasObj);
								break;
						} // EO switch
						break;

					case HT.lib.CytoscapeActions.GENE:
						switch (trgEntityCode) {
							case HT.lib.CytoscapeActions.PROTEIN:
								aliasObj.alias = 'gene-protein-operation';
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias = 'gene-protein-operation';
								aliasArray.push(aliasObj);
								break;
						} // EO switch
						break;

					case HT.lib.CytoscapeActions.DISEASE: 
						switch (trgEntityCode) {
							case HT.lib.CytoscapeActions.GENE:
								aliasObj.alias = 'disease-gene-operation';
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias = 'disease-gene-operation';
								aliasArray.push(aliasObj);
								break;
						} // EO switch
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
			 * It gets the operation from the alias. In the edge, no function are held,
			 * just the alias to get the operation represented by the alias from here when
			 * running the graph
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


			/*
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
			*/

			test: function (param) {
				return 'RuleFunctions.test('+param+') was called'
			}
		} // EO statics

	} // EO return
})() // EO function as config!!

); // EO RuleFunctions class