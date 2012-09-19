/**
 * @class TDGUI.view.common.DisplayInfoDlg
 * @extends Ext.window.Window
 * @alias widget.tdgui-displayinfo-dlg
 *
 * This is a configurable window addressed to show a little information.
 * Defaults is a panel (TDGUI.view.common.panels.TextImagePanel) which is a
 * splitted panel (displayfield + img), but by providing any other panel on
 * items config, the default can be replaced, as well as the bottom buttons
 * (default is just an add button, and a handler callback function to add
 * the current node into the selected nodes)
 *
 * Both data and tpl configs are passed through to main content panel and then
 * set to undefined not to crash against the tpl and data properties of window comp
 * Usage:
 * Ext.create('TDGUI.view.common.DisplayInfoDlg', {
 *    items: [theItems],
 *    tpl: myTemplate
 *    data: myData
 *    buttons: [bnt1, btn2, ...]
 * })
 *
 */
Ext.define('TDGUI.view.common.DisplayInfoDlg', {
	extend: 'Ext.window.Window',
  alias: 'widget.tdgui-displayinfo-dlg',
  requires: ['TDGUI.view.common.panels.TextImagePanel'],

	width: 600,
  /**
   * @cfg {Boolean} [modal=true] see {@link Ext.window.Window#modal}
   */
  modal: true,

  /**
   * @cfg {Ext.XTemplate} tpl the template to show in the display area
   */
  tpl: undefined,

  /**
   * @cfg {Object} data the data to show through the template
   */
  data: undefined,
  
  initComponent: function () {
  	var me = this

  	this.title = this.data.nodename
  	var displayWidth = this.width-15

  	var displayArea = Ext.create ('TDGUI.view.common.panels.TextImagePanel', {
  		data: me.data, // data is {nodename: ..., numconnections: ...}
  		tpl: me.tpl
//      imagePath: 'http://www.rcsb.org/pdb/images/' + pdbID + '_asr_r_250.jpg'
//  		autoScroll: true
//  		imagePath: 'resources/images/4e99_bio_r_500.jpg',
//  		width: '99%'
  	})

		if (typeof me.items === 'undefined' || me.items == null)
			this.items = [displayArea]

		if (typeof me.buttons === 'undefined') {
			this.buttons = [{
	  		xtype: 'button',
	  		text: 'close',
	  		tooltip: 'Close this dialog',
        handler: function () { this.up('window').close() }
	  	}]
	  }
// OJO!!
	  this.tpl = undefined
//	  this.data = undefined

	  this.callParent(arguments)
  }  
})