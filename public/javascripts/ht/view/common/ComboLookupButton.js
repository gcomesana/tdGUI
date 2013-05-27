/**
 * Autocomplete combobox + button to do something with the selected content.
 * Similar to Textbox button, but performing an search with autocomplete. Similar to
 * TDGUI.views.dropdowns.conceptwikiProteinLookup
 */
Ext.define('HT.view.common.ComboLookupButton', {
	extend: 'Ext.container.Container',
	alias: 'widget.combo-lookup-btn',

	// bodyPadding: '0 0 10 0',
	margin: '6 0 0 0',
	// padding: '0 5 0 15',
	border: false,
	layout: 'column',

	style: {
		// backgroundColor:'yellow',
		// borderColor: 'blue',
		// borderStyle: 'dotted',
		// borderWidth: '1px'
	},

	config: {
		emptyText: 'nothing', // empty text for the textfield
		metaInfo: '', // meta-information addressed on semantics for this element
		// button callback. by default, trigger an event with this component as source
		btnCallback: function (btn, evOpts) {
			var thisComp = btn.up();
			btn.suspendEvents();
			var myEvOpts = {
				value: thisComp.getComponent(0).getValue(),
				label: thisComp.getComponent(0).getRawValue(),
				meta: thisComp.getMetaInfo(),
				id: thisComp.getId()
			};
			thisComp.fireEvent('click', thisComp, myEvOpts);
			btn.resumeEvents();
		},

		queryParam: undefined, // the right query param for every request depending on the store (see EntityLookup)

		btnText: '_', // text for the button
		/**
		 * an instance of an store to feed the combobox
 		 */
		comboStore: undefined,
		/**
		 * the name of the field of the store which will be the value of the combo
		 */
		comboValueField: undefined,
		/**
		 * the name of the field of the store which will be the display label of the options
		 */
		comboDislayField: undefined,
		/**
		 * The name of the combo component
		 */
		comboName: 'entityLookup'
	},

	constructor: function (config) {
		this.initConfig(config);

		this.superclass.constructor.call(this, config);
	},


	initComponent: function () {
		var me = this;

		this.items = [{
			xtype: 'combo',
			queryMode: 'remote',
			valueField: this.getComboValueField(),
			displayField: this.getComboDislayField(),
			name: 'entityLookup',
			minChars: 4,
			hideTrigger: true,
			hideLabel: true,
			forceSelection: true,
			// allowBlank: false,
			typeAhead: true,
			emptyText: this.getEmptyText(),
			margin: '5 0 0 0',
			columnWidth: .80,
			store: this.getComboStore(),
			queryParam: this.getQueryParam(),

			listConfig: {
				loadingText: 'Searching...',
				emptyText: 'Nothing was found for the term.',

				// Custom rendering template for each item
				getInnerTpl: function() {
					return '<p><span style="font-family: verdana; color: grey; ">' +
						'<small>Match: {match}</small></span><br/><b>{pref_label}</b> ' +
						'<a href="{pref_url}" target="_blank">(definition)</a>' +
						'</p>';
				}
			}
			// width: 700,
			// fieldLabel: 'Protein name',
			// labelWidth: 120,
		}, {
			xtype: 'button',
			text: this.getBtnText(),
			columnWidth: .20,
			handler: this.getBtnCallback(),
			margin: '5 0 0 10 '
		}]; // EO items


		this.listeners = {
			afterrender: {
				fn: function (comp, evOpts) {
					// console.log("afterrender combo: "+comp.getId());
				}
			}
		}

		this.callParent(arguments);
		console.log("store-read for combo: "+this.getComponent(0).store.getProxy().url);
	},

	getTextbox: function () {
		return this.getComponent(0);
	},

	getButton: function () {
		return this.getComponent(1);
	}
})

