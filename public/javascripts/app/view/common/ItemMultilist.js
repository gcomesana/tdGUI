



/**
 * @class TDGUI.view.common.ItemMultilist
 * @extends Ext.panel.Panel
 * @alias widget.tdgui-item-multilist
 *
 * This component extends a simple panel by adding an multiselect component (a multi-selection enabled list)
 * plus buttons to remove one element, clear and perform some action.
 * In order to fill the list a store should be provided.
 */
Ext.define ('TDGUI.view.common.ItemMultilist', {
  requires: ['TDGUI.store.ListTargets', 'Ext.ux.form.MultiSelect'],
	extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-item-multilist',
/**
 * @cfg {Boolean} border see TDGUI.view.Viewport#border
 */
	border: false,
/**
 * @cfg {Boolean} frame see Ext.panel.Panel#frame
 */ 
	frame: false,

/**
 * @cfg {Ext.data.Store} store the data source for the multiselection list
 */
	store: undefined,
/**
 * @cfg {String} displayField the field of the store which is going to be displayed
 */
	displayField: undefined,
/**
 * @cfg {String} valueField the field of the store which will provide de value upon item selection
 */
  valueField: undefined,

  layout: 'anchor',
 /**
  * @cfg {String} listName the name given to this list. It will be the label associated to the multiselec list component
  */
  listName: '',


	initComponent: function () {
		var me = this

		this.items = [{
      fieldLabel: me.listName,
      labelAlign: 'top',
      labelSeparator: '',
      labelCls: 'targetlist-font-label',

			xtype: 'multiselect',
			msgTarget: 'none',
//			fieldLabel: 'Multiselect',
			name: 'multiselect',
			id: 'multiselect-field',
//			allowBlank: false,
			anchor: '100%',
      border: false,
      height: 350,

      store: me.store,
      displayField: me.displayField,
      valueField: me.valueField

/*
			store: [
				[123, 'One Hundred Twenty Three'],
				['1', 'One'],
				['2', 'Two'],
				['3', 'Three'],
				['4', 'Four'],
				['5', 'Five'],
				['6', 'Six'],
				['7', 'Seven'],
				['8', 'Eight'],
				['9', 'Nine'],
				['5', 'Five'],
				['6', 'Six'],
				['7', 'Seven'],
				['8', 'Eight'],
				['9', 'Nine']
			],
			value: ['3', '4', '6']
*/
		}],



		this.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			ui: 'footer',

			items: ['->', {
				xtype: 'button',
				text: 'Clear',
				handler: function () {
					var list = me.down('multiselect')
          var myStore = list.store
          myStore.removeAll()
				}
			}, {
				xtype: 'button',
				text: 'Remove',
				handler: function () {
					var list = me.down('multiselect')
					var vals = list.getValue()
					var myStore = list.store
// console.info ('store size before: '+myStore.count())

					Ext.each (vals, function (val, index, theVals) {
						var rec  = myStore.findRecord(list.valueField, val)
						myStore.remove (rec)
					})

				}
			}]
		}] // EO dockedItems

		this.callParent(arguments)
	},


/**
 * Return the store config property
 * @return {Ext.data.Store} the store
 */
  getStore: function () {
    return this.store
  },


/**
 * Even better, returns an array with the unique values of a field of the store. It is similar to do
 * <code>select dataIndex from store-table</code>
 * @param {String} dataIndex the propery to collect
 * @return {Object[]} an array of unique values for the dataindex
 */
  getStoreItems: function (dataIndex) {
    var records = this.store
    var items = records.collect(dataIndex)

    return items
  },


/**
 * Return a first record in the store based on the value of a field. It is similar to do
 * select * from store-table where field = value maxcount=1
 * @param {String} field the name of the field
 * @param {String} value the value of the field
 * @return {Ext.data.Model/Object} the 'row' selected as a Ext.data.Model
 */
  getStoreObject: function (field, value) {
    var rec = this.store.findRecord(field, value)

    return rec
  },

/**
 * Adds a docked item to the dockeditems array. This is useful to set the action button
 * @param {Ext.Component} newComp the new compoenent which will be added to the docked items
 */ 
  addDockedItem: function (newComp) {
    var me = this
    var dockedTb = this.getDockedItems('')[0]
    dockedTb.add(newComp)
  }


})