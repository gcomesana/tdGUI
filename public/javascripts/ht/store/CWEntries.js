

Ext.define('HT.store.CWEntries', {
	extend: 'Ext.data.Store',
	requires: ['Ext.data.Store'],
/*
	fields: [{
			type: 'string',
			name: 'concept_type_tags'
		}, {
			type: 'string',
			name: 'ops_uri'
		}, {
			type: 'string',
			name: 'pref_url'
		}, {
			type: 'string',
			name: 'alt_labels'
		}, {
			type: 'string',
			name: 'pref_label'
		}, {
			type: 'string',
			name: 'uuid'
		}, {
			type: 'string',
			name: 'match'
		}
	],
*/
	fields: [{
			type: 'string',
			name: 'pref_url'
		}, {
			type: 'string',
			name: 'pref_label'
		}, {
			type: 'string',
			name: 'uuid'
		}, {
			type: 'string',
			name: 'match'
		}
	],

	proxy: {
		type: 'jsonp',
		api: {
			// read: '/concept_wiki_api_calls/protein_lookup.json'
			read: 'http://localhost:3003/ops_wiki_api_calls/protein_lookup.json'
		},
		reader: {
			type: 'json'
		}
	}
})