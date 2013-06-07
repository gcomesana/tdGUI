/**
 * Factory for rules. A rule is the set of functions which will be executed
 * when running a graph (or a portion of it). Actually, as when an
 * edge is added to the cytoscape graph all functions and undefined values are set
 * to null, no actual funcions can be set here. So, to reference de function, an
 * alias is set for every function. When the function has to be executed, a mapper
 * will choose the right function from the set of actual functions.
 */
Ext.define('HT.lib.EdgeRuleFactory', {
	requires: ['HT.lib.EdgeRule', 'HT.lib.RuleFunctions'],

	config: {},

	constructor: function () {
		this.initConfig(config);
	},

	statics: {
		/**
		 * Creates a rule object to associate with the edge, based on the source
		 * and target entities (if compound, protein, disease, ...).
		 * Note: the parameters are the data member of the cytoscape nodes, which looks
		 * like next:
		 * node.data: {
		 *  id
		 *  label
		 *  entity
		 *  payloadValue
		 * }
		 * @param {Object} source the node.data for the source node of the directed edge
		 * @param {Object} target the same for the target node.
		 */
		createRule: function (source, target) {
/*
			var ruleFunctions = function (source, target) {
				var srcEntity = source.entity, trgEntity = target.entity;
				var functionsArray = [];

				functionsArray = HT.lib.RuleFunctions.getFunctionsRule(srcEntity, trgEntity);

				return functionsArray;
			};
*/

			var ruleAliases = function (source, target) {
				var srcEntity = source.entity, trgEntity = target.entity;
				var aliasesArray;

				aliasesArray = HT.lib.RuleFunctions.getAliasesFunctions(srcEntity, trgEntity);

				return aliasesArray;
			};

			// var newRule = Ext.create('HT.lib.EdgeRule', {
			var newRule = {
				edgeSource: source,
				edgeTarget: target,

				// ruleFunctions: ruleFunctions(source, target)
				ruleAliases: ruleAliases(source, target),

				result: undefined,
				threshold: undefined
			};
			return newRule
		}

	}

})
