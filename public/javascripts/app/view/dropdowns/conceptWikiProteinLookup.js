/**
 * @class TDGUI.view.dropdowns.conceptWikiProteinLookup
 * @extends Ext.form.ComboBox
 * @alias widget.conceptWikiProteinLookup
 *
 * This is a base class to build a custom combobox which display results based on the input text.
 */
Ext.define('TDGUI.view.dropdowns.conceptWikiProteinLookup', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.conceptWikiProteinLookup',

	store: Ext.create('Ext.data.Store', {
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
		proxy: {
			type: 'ajax',
			api: {
				read: '/concept_wiki_api_calls/protein_lookup.json'
			},
			reader: {
				type: 'json'
			}
		}
	}),
	
	queryMode: 'remote',
	valueField: 'concept_url',
	displayField: 'concept_label',
	name: 'protein_uri',
	minChars: 4,
	hideTrigger: true,
	forceSelection: true,
	allowBlank: false,
	typeAhead: true,
	emptyText: 'Start typing...',
	margin: '5 5 5 5',
	width: 700,
	fieldLabel: 'Protein name',
	labelWidth: 120,
	listConfig: {
		loadingText: 'Searching...',
    emptyText:'Nothing found which matches your text, you may need to enter more text or try something different.',
		getInnerTpl: function() {
//			return '<p><span style="font-family: verdana; color: grey; "><small>Match: {match}</small></span><br/><b>{concept_label}</b> <a href="{define_url}" target="_blank">(definition)</a></p>';
      return '<p><span style="font-family: verdana; color: grey; "><small>Match: {match}</small></span><br/><b>{pref_label}</b> <a href="http://ops.conceptwiki.org/wiki/#/concept/{uuid}/view" target="_blank">(definition)</a></p>';
		}
	}
});
