
/**
	* Extends the original coreGUI conceptWikiLookupProtein component in order to customize
	* to fit the new layout.
	* The original layout:
	* - extends Ext.form.Combobox 
	* - defines a store with an api-read to read results from server, matching with the
	* store model
	* - triggers the remote lookup upon 4 characters
	*/
Ext.define ('TDGUI.view.dropdowns.tdgui.ConceptWikiProteinLookup', {
	extend: 'TDGUI.view.dropdowns.conceptWikiProteinLookup',
	alias: 'widget.tdgui-conceptwiki-protein-lookup',

	margin: '0 5 0 0',
	fieldLabel: '',
	width: undefined,
  inputString: '',
  allowBlank: false
})