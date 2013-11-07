
/**
 * @class TDGUI.controller.panels.TargetInfo
 * @extends Ext.app.Controller
 * 
 * Controller for the {@link TDGUI.view.panel.TargetInfo TargetInfo panel} on the content area.
 *
 */
Ext.define("TDGUI.controller.panels.TargetInfo", {
  extend:'Ext.app.Controller',

  views:['panels.TargetInfo'],
  stores:['Targets'],
  models:['Target'],

  refs: [{
    ref: 'targetinfopanel',
    selector: 'tdgui-targetinfopanel'
  }, {
    ref: 'interactionsForm',
    selector: 'window#interactionsDlg form'
  }],


  myMask: undefined,

  init:function () {
console.info ("Initializing TargetInfo controller...")

    this.control({
      'tdgui-targetinfopanel': {
        afterrender: this.initTargetInfoPanel,
        render: this.handleMask,
        opsFailed: this.retryTargetInfoPanel
      },

//      'tdgui-targetinfopanel #stringdbTargetButton': {
      'window#interactionsDlg form button#interactionSendBtn': {
//        click: this.onClickInteractionsBtn

        click: function (comp, opts) {
          var form = comp.up('form');
          var formVals = form.getForm().getValues();
					var title = formVals.targetName;

          this.onClickInteractionsBtn (formVals.uniprotAcc, formVals.conf_val, formVals.max_nodes, title)
          comp.up('window').close();
        }

      },

      'window#interactionsDlg': {
        show: function (win, opts) {
          var mywin = win

          console.info ("window raised!!")
        }
      }

    })
  },

  onLaunch:function (app) {
    /*
    myMask = new Ext.LoadMask(Ext.getBody(), {
      msg:'Loading data...'
    });
    myMask.show();
    */
  },



  handleMask: function (comp) {
    comp.setLoading({
      store: comp.targetInfoStore
    }).hide();
  },



/**
 * Method to process interactions button click. This is not a callback method rather than a controller method to
 * do the business logic. The actual callback function is implemented as a anoymous function inside the 
 * {@link Ext.app.Controller#control control method}
 * 
 * @param {Ext.Component} targetAcc the accession of the target displayed on proteinInfo panel
 * @param {Event} confVal the confidence value to select the right interactions
 * @param {Object} maxNodes the maximun number of node for the interactions graph
 */
  onClickInteractionsBtn: function (targetAcc, confVal, maxNodes, targetName) {
/*
    if (targetAcc.indexOf ('uniprot') != -1)
      targetAcc = targetAcc.substring(targetAcc.lastIndexOf('/')+1)

    if (targetAcc.indexOf ('conceptWiki') != -1)
      return
*/
//    var targetName = this.getTargetinfopanel().down('#target_name').getRawValue()

    // var targetName = this.getTargetinfopanel().down('#prefLabel').getRawValue();
    var historyParams = '!xt=tdgui-graphtabpanel&qp=' + targetAcc + '&cv=' + confVal +
                '&mn=' + maxNodes + '&tg='+targetName;

    var dcParam = '&dc='+Math.random();
    Ext.History.add (historyParams + dcParam);

//    console.info ('clicked for: '+historyParams)
  },



/**
 * Thisis is a method to initialize the {@link TDGUI.view.panels.TargetInfo TargetInfo} panel component
 * So, this method decodes the token param (uniprot,ops) to load the panel-associated-store by
 * requesting data to ops or uniprot if the latter is not working.
 * So, the flow to get a target information is:
 * - protein lookup on a concept
 * - get_uniprot_by_name when added to the list (access to uniprot, keep UUID)
 * - multiple_entries_retrieval (uniprot)
 * - proteinInfo with uniprot URI & proteinInfo with conceptUUID to get pharmaInfo and MW, ThePI, Residues
 * 
 * @param {Ext.Component} comp the component which yields the event
 * @param {Object} opts options
 */
  initTargetInfoPanel: function (comp, opts) {
//    var store = this.getTargetsStore();
    var me = this;
console.info ('initTargetInfoPanel from TargetInfo controller')
    var store = comp.targetInfoStore;
    var tokenObjQp = comp.queryParam;
    var tokenParams = tokenObjQp.split(',') // returns always a array
console.info ('TargetInfo.initTargetInfoPanel tokenParams: '+tokenParams);

// get the conceptUUID
    Ext.each (tokenParams, function (token, index, tokens) {
      if (token.indexOf('conceptwiki') != -1) {
        var lastSlash = token.lastIndexOf('/');
        comp.concept_uuid = token.substring(lastSlash+1);
      }

      if (token.indexOf ('uniprot') != -1) {
        var lastSlash = token.lastIndexOf('/');
        comp.uniprot_acc = token.substring(lastSlash+1);
      }
    });

// get the uniprot accession from query string

//    if (tokenParams[0] != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = tokenParams[1]; // tokenParams[0];
      //          this.getFormView().setLoading(true);
      store.load();
//    }
  },



  retryTargetInfoPanel: function (comp, opts) {
console.info ('retryTargetInfoPanel from TargetInfo controller')
    var queryParam = opts.concept_req
    var store = comp.targetInfoStore

    if (queryParam != store.proxy.extraParams.protein_uri) {
      store.proxy.extraParams.protein_uri = queryParam

      store.load()
    }

  }

})