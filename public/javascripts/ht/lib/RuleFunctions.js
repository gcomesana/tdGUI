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

		/*
		 * Template function Object to get along a rule
		 * Gets interactions among the two values
		 * Call the API at lady-qu.cnio.es:<rails_port>/api/interactions/target1/target2?conf_val=val
		 * @param {String} valSrc the accession of one target
		 * @param {String} valTrg the accession for the other target
		 * @param {Number} threshold the confidence value to filter the interactions
		 * @param {Object} funcObj the javascript object containing result, threshold and alias properties
		 * @return {Object} an object with information about the found interactions
		 /
		 *
		 func: function (valSrc, valTrg, threshold, funcObj) {
		 // console.log('calling interactionFunc.interaction: '+valSrc+', '+valTrg);
		 var url = 'http://lady-qu.cnio.es:3003/api/interactions/'+valSrc+'/'+valTrg+'.jsonp';

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
		 */
	}; // EO interactionFunc object

// TODO functions should be kept in a store, with members result, threshold, result, func
//	var ruleFunctionsStore = [interactionFunc];

	// private vars
	var interactionOp = Ext.create('HT.lib.operation.InteractionsRuleOperation', {});
	var geneProteinOp = Ext.create('HT.lib.operation.GeneProteinOperation', {});
	var proteinGeneOp = Ext.create('HT.lib.operation.ProteinGeneOperation', {});
	var diseaseGeneOp = Ext.create('HT.lib.operation.DiseaseGeneOperation', {});
	var diseaseProteinOp = Ext.create('HT.lib.operation.DiseaseProteinOperation', {});
	var geneCompoundOp = Ext.create('HT.lib.operation.GeneCompoundOperation', {});
	var compoundGeneOp = Ext.create('HT.lib.operation.CompoundGeneOperation', {});
	var geneDiseaseOp = Ext.create('HT.lib.operation.GeneDiseaseOperation', {});
	var proteinDiseasdOp = Ext.create('HT.lib.operation.ProteinDiseaseOperation', {});

	var diseaseCompOp = Ext.create('HT.lib.operation.DiseaseCompoundOperation', {});
	var compoundProtOp = Ext.create('HT.lib.operation.CompoundProteinOperation', {});
	var compoundDisOp = Ext.create('HT.lib.operation.CompoundDiseaseOperation', {});


	var operationStore = [interactionOp, geneProteinOp, proteinGeneOp,
				diseaseGeneOp, diseaseProteinOp, geneDiseaseOp, diseaseCompOp,
				geneCompoundOp, compoundGeneOp, proteinDiseasdOp,
				compoundProtOp, compoundDisOp
	]; // Actual logic for rule operations come from here!!!!


	return {

		requires: ['HT.lib.Util', 'HT.lib.operation.RuleOperation',
			'HT.lib.operation.InteractionsRuleOperation',
			'HT.lib.operation.GeneProteinOperation'],
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
								aliasObj.alias = 'target-target-interactions'; // interactionFunc.alias;
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.GENE:
								aliasObj.alias = 'protein-gene-operation';
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.DISEASE:
								aliasObj.alias = 'protein-disease-operation';
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias = interactionFunc.alias;
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

							case HT.lib.CytoscapeActions.COMPOUND:
								aliasObj.alias = 'gene-compound-operation';
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.DISEASE:
								aliasObj.alias = 'gene-disease-operation';
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

							case HT.lib.CytoscapeActions.PROTEIN:
								aliasObj.alias = 'disease-protein-operation';
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.COMPOUND:
								aliasObj.alias = 'disease-compound-operation';
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias = 'disease-gene-operation';
								aliasArray.push(aliasObj);
								break;
						} // EO switch
						break;


					case HT.lib.CytoscapeActions.COMPOUND:
						switch  (trgEntityCode) {
							case HT.lib.CytoscapeActions.GENE:
								aliasObj.alias = 'compound-gene-operation';
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.PROTEIN:
								aliasObj.alias = 'compound-protein-operation';
								aliasArray.push(aliasObj);
								break;

							case HT.lib.CytoscapeActions.DISEASE:
								aliasObj.alias = 'compound-disease-operation';
								aliasArray.push(aliasObj);
								break;

							default:
								aliasObj.alias = 'compound-gene-operation';
								aliasArray.push(aliasObj);
								break;
						}
						break;


					default:
						// var aliasFunc = HT.lib.Util.clone(interactionFunc);
						aliasObj.alias = interactionFunc.alias;
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
				return 'RuleFunctions.test(' + param + ') was called'
			}
		} // EO statics

	} // EO return
})() // EO function as config!!

); // EO RuleFunctions class