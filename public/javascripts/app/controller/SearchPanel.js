
Ext.define('TDGUI.controller.SearchPanel', {
	extend: 'Ext.app.Controller',
//	models: ['Target'],
//	stores: ['Targets'],
	views: ['panels.west.SearchPanel'],

	/*refs: [{
		ref: 'targetPanel',
		selector: 'TargetPanel'
	}, {
		ref: 'formView',
		selector: 'TargetByNameForm'
	}, {
		ref: 'submitButton',
		selector: '#TargetByNameSubmit_id'

	}],*/

	refs: [{
			ref: 'protLookup',
			selector: 'tabpanel > panel > tdgui-conceptwiki-protein-lookup'
		}, {
			ref: 'examplesLabel',
			selector: 'tabpanel > panel > label'
	  }, {
      ref: 'accTextarea',
      selector: 'tabpanel > panel > tdgui-textarea'
  }],



	init: function() {

console.info ('SearchPanel controller initializing... ')
		this.control({
			'TargetByNameForm button[action=query_target_by_name]': {
				click: this.submitQuery
			},

			'TargetByNameForm conceptWikiProteinLookup': {
				select: this.enableSubmit
			},

			'tdgui-west-search label': {
				click: this.labelClick // a window, tooltip or whatever has to be raised with ex
			},

			'tdgui-conceptwiki-protein-lookup': {
				focus: this.clickLookup
			},

      'tdgui-textarea': {
        click: this.textareaClick
      }
		});
	},


	clickLookup: function () {
		console.info ('*** focus on lookup')
	},

	onAfterRender: function () {
		console.info ('just onAfterRender')
	},

	labelClick: function () {
		console.info ('SearchPanel.controller: got click event from label '+this.getExamplesLabel())
//						this.getExamplesLabel().setText ('Its ok'))
	},

// TODO primero, de todas formas, que con los valores que hay se le dé al botón y recuperar los datos
  textareaClick: function () {
    console.info ('click event on textarea with content: '+this.getAccTextarea().getValue())
  },

	enableSubmit: function() {
		var form = this.getFormView();
		var button = this.getSubmitButton();
		button.enable();
	},

	submitQuery: function(button) {
		button.disable();
		var tp = this.getTargetPanel();
		tp.startLoading();

		var form = this.getFormView();
		var target_uri = form.getValues().protein_uri;

		Ext.History.add('TargetByNameForm=' + target_uri);
	}
});
