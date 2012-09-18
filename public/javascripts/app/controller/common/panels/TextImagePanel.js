/**
 * @class TDGUI.controller.common.panels.TextImagePanel
 * @extends Ext.app.Controller
 *
 * Controller for the {@link TDGUI.view.panels.TextImagePanel} component
 */
Ext.define("TDGUI.controller.common.panels.TextImagePanel", {
  extend:'Ext.app.Controller',

  views: ['common.panels.TextImagePanel'],
  stores: ['Targets'],
  models: ['Target'],

  refs: [{
    ref: 'windowTextImagePanel',
    selector: 'window tdgui-textimagepanel'
  }],


  init:function () {
    this.control({
      'tdgui-textimagepanel': {
      },

      'window[id="window-node-info"]': {
        show: this.initWindowTextImgPanel
      }


    })
  },


  onLaunch: function (app) {
  },

/**
 * Init the component instance for this controller. Basically load the right
 * store based on properties got from the window the text panel is contained in.
 * It is called on showing the window with 'window-node-info' id
 * @param {Ext.js.Component} comp the component which triggered this method
 * @param {Object} opts the options for the event the component triggered
 */
  initWindowTextImgPanel: function (comp, opts) {
    var infoComp = this.getWindowTextImagePanel()
console.info ('loading for window')
    var store = infoComp.targetStore
    var tokenObjQp = infoComp.data.nodename
    tokenObjQp = 'http://www.uniprot.org/uniprot/'+tokenObjQp
//    if (tokenObjQp != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenObjQp;
      //          this.getFormView().setLoading(true);
      store.load();
//    }

  }


})