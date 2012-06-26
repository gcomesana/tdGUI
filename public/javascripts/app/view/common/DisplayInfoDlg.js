/**
 * DisplayInfoDlg component
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
 *
 */
Ext.define('TDGUI.view.common.DisplayInfoDlg', {
	extend: 'Ext.window.Window',

	width: 600,
	modal: true,

  
  initComponent: function () {
  	var me = this

  	this.title = this.data.nodename
  	var displayWidth = this.width-15

  	var displayArea = Ext.create ('TDGUI.view.common.panels.TextImagePanel', {
  		data: me.data,
  		tpl: me.tpl,
//  		autoScroll: true
//  		imagePath: 'resources/images/4e99_bio_r_500.jpg',
//  		width: '99%'
  	})
/*
  	this.items = [
  		displayArea, {
  			xtype: 'panel',
		  	fbar: [{
	    		xtype: 'button',
	    		text: 'Add',
	    		tooltip: 'Add this node to the <b>multiple targets</b> list'
	    	}]
  		}
  	]
*/
		if (typeof me.items === 'undefined')
			this.items = [displayArea]

		if (typeof me.buttons === 'undefined') {
			this.buttons = [{
	  		xtype: 'button',
	  		text: 'Add',
	  		tooltip: 'Add this node to the <b>multiple targets</b> list'
	  	}]
	  }

	  this.tpl = undefined
	  this.data = undefined

	  this.callParent(arguments)
  }  
})