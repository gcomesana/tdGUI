
/**
 * This class is a kind of container for concurrent ajax operations.
 * An example of use:
 * myBarrier = Ext.create (ConcurrentBarrierResponse, {
 * 	numRequest: 2,
 * )
 *
 * Ext.JsonP.request({
 * 	callback: function (data) {
 * 		myBarrier.setData (data)
 * 	// or myBarrier.setCallback4Data(callback, data)
 * 		myBarrier.requestComplete(true)
 * 	}
 * }
 *
 */
Ext.define('HT.lib.ConcurrentBarrierResponse',  {

	config: {
		numRequest: 0,
		requestsCompleted: 0,
		singleCallback: undefined
	},

	constructor: function (config) {
		this.initConfig(config);

		this.numRequestToComplete = this.numRequest || 0;
		this.callBacks = [];
		this.data = {},
		this.application = [];
		this.singleCallBack = undefined;

		this.fireCallbacks = function () {
			console.log('All Requests Complete')
			for (var i = 0; i < this.callBacks.length; i++)
				this.callBacks[i](this.data);
		};

		this.runCallbacks4Data = function () {

		};

		if (this.singleCallback)
			this.callBacks.push(this.singleCallback);
	},


	addCallbackToQueue: function(isComplete, callback) {
		if (isComplete) this.requestsCompleted++;
		if (callback) this.callBacks.push(callback);

		if (this.requestsCompleted == this.numRequestToComplete)
			this.fireCallbacks();
	},

	requestComplete: function (isComplete) {
		if (isComplete) this.requestsCompleted++;
		if (this.requestsCompleted == this.numRequestToComplete)
			this.fireCallbacks();
	},

	setCallback: function(callback) {
		this.callBacks.push(callback);
	},

	setData: function(name, responseData){
		this.data[name] = responseData;
	},


	setCallback4Data: function (callback, data) {
		this.application.push ({
			data: data,
			callback: callback
		})
	}

}
);