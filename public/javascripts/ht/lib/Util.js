Ext.define('HT.lib.Util', {


	config: {},

	constructor: function () {
	},

	/**
	 * Returns a string with the object properties and values. Could be static
	 * @param {Object} obj
	 * @param {String} tabs
	 */
	objectToString: function (obj, tabs) {

		var stringObj = '';
		var me = this;
		var objType = HT.lib.Util.getClass(obj);

		if (objType == 'Array') {
			Ext.each(obj, function (elem, index, objArray) {
				if (Object.prototype.toString.call(elem).slice(8, -1) == 'Object')
					stringObj += me.objectToString(elem, tabs+'\t')

				else if (Object.prototype.toString.call(elem).slice(8, -1) == 'Array')
					Ext.each(elem, function (item, index, array) {
						stringObj += me.objectToString(item, tabs+'\t');
					})

				else
				// console.log(tabs + key + ' -> ' + obj[key]+'\n');
					stringObj += tabs + key + ' -> ' + obj[key]+'\n'

			})
		}
		else if (objType == 'Object') {
			for(var key in obj) {
				if (Object.prototype.toString.call(obj[key]).slice(8, -1) == 'Object')
					stringObj += me.objectToString(obj[key], tabs+'\t')

				else if (Object.prototype.toString.call(obj[key]).slice(8, -1) == 'Array')
					Ext.each(obj[key], function (elem, index, array) {
						stringObj += me.objectToString(elem, tabs+'\t');
					})

				else
					// console.log(tabs + key + ' -> ' + obj[key]+'\n');
					stringObj += tabs + key + ' -> ' + obj[key]+'\n'
			}
		}

		return stringObj;
	},

	statics: {
		/**
		 * Returns the class/type of obj based as a call to the toString method on
		 * obj
		 * @param {Object|String|Number|Array} obj any javascript object
		 */
		getClass: function (obj) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return clas;
		},


		isClassOf: function (obj, type) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return obj !== undefined && obj !== null && clas === type;
		},


		objToString: function (obj, tabs) {
			var stringObj = '';
			var objType = HT.lib.Util.getClass(obj);

			if (objType == 'Array') {
				Ext.each(obj, function (elem, index, objArray) {
					if (Object.prototype.toString.call(elem).slice(8, -1) == 'Object')
						stringObj += HT.lib.Util.objToString(elem, tabs+'\t')

					else if (Object.prototype.toString.call(elem).slice(8, -1) == 'Array')
						Ext.each(elem, function (item, index, array) {
							stringObj += HT.lib.Util.objToString(item, tabs+'\t');
						})

					else
					// console.log(tabs + key + ' -> ' + obj[key]+'\n');
						stringObj += tabs + key + ' -> ' + obj[key]+'\n'

				})
			}
			else if (objType == 'Object') {

				for(var key in obj) {
					if (Object.prototype.toString.call(obj[key]).slice(8, -1) == 'Object')
						stringObj += HT.lib.Util.objToString(obj[key], tabs+'\t')

					else if (Object.prototype.toString.call(obj[key]).slice(8, -1) == 'Array')
						Ext.each(obj[key], function (elem, index, array) {
							stringObj += HT.lib.Util.objToString(elem, tabs+'\t');
						})

					else
					// console.log(tabs + key + ' -> ' + obj[key]+'\n');
						stringObj += tabs + key + ' -> ' + obj[key]+'\n'
				}
			}
			return stringObj;
		},


		clone: function (obj) {
			if (obj === null || typeof obj !== 'object') {
				return obj; // return obj if obj is a Number, String, Boolean, ...
			}

			var temp = obj.constructor(); // give temp the original obj's constructor
			for (var key in obj) {
				temp[key] = this.clone(obj[key]);
			}

			return temp;
		}

	} // EO statics

}) // EO class
