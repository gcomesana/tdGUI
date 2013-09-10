/*
var edgeSrcLabel = "Atheriosclerosis";
var edgeTrgLabel = "Epinehprine (MTE, UHG, RUNX1, ASAP, BTW, IMHO)";
var msg = "<div class=\"wordwrap\"><span style=\"font-weight: bold;\">Compound -> Protein</span> operation<br/>('";
msg += edgeSrcLabel+"' -> '"+edgeTrgLabel;
msg += "')<br/>0";
msg += " activities for the compound where found involving the protein '<i>"+edgeTrgLabel+"</i>'</div>";

var messages = [{'msg': msg}, {'msg': msg}, {'msg': msg}, {'msg': msg}, {'msg': msg}];
*/


Ext.define ("HT.store.ResultsMessages", {
	extend: "Ext.data.Store",
	requires: ['HT.model.ResultMessage'],

	autoLoad: true,
	model: 'HT.model.ResultMessage',
	proxy: {
		type: 'memory',
		data: [{'msg': 'No results yet'}],
		reader: {
			type: 'json'
		}
	}

});