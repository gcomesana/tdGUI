/**
 * @class TDGUI.view.panels.StatusBarPanel
 * @extend Ext.panel.Panel
 * @alias widget.tdgui-statusbar
 *
 * This is a Ext.panel.Panel supporting no items and one docked item to simulate
 * a status bar at the bottom of the viewport. It is defined as a panel in order
 * to be able to place it at the south region.
 */
Ext.define('TDGUI.view.panels.StatusBarPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-statusbar',

  requires: [],
  /**
   * @cfg {String} [layout=auto] the layout to apply to this panel
   */
  layout: 'auto',

//  region: 'south',
  /**
   * @cfg {Boolean} [frame=false] remove the frame out of the panel
   */
  frame: false,
//  height: 200,
//  minHeight: 120,
  /**
   * @cfg {Boolean} border see TDGUI.view.Viewport#border
   */
  border: false,
//  split: false,

  /**
   * @cfg {Boolean} win a switch to set whether or not the feedback window is raised
   */
  win: false,


  initComponent: function () {
    var me = this
    console.info('Initializing StatusBar...')

    me.dockedItems = [
      {
        dock: 'bottom',
        xtype: 'toolbar',
        items: ['->', {
          text: 'Give us feedback',
          handler: function () {
              var me = this

              if (!me.win) {
                var form = Ext.widget('form', {
                  layout: {
                    type: 'vbox',
                    align: 'stretch'
                  },
                  border: false,
                  bodyPadding: 10,

                  fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 100,
                    labelStyle: 'font-weight:bold'
                  },
                  defaults: {
                    margins: '0 0 10 0'
                  },
                  url: '/tdgui_proxy/send_feedback',

                  items: [
                    {
                      xtype: 'textfield',
                      fieldLabel: 'Email Address',
                      name: 'from',
                      vtype: 'email',
                      allowBlank: false
                    },
                    {
                      xtype: 'textfield',
                      fieldLabel: 'Subject',
                      name: 'subject',
                      allowBlank: false
                    },
                    {
                      xtype: 'textareafield',
                      fieldLabel: 'Message',
                      labelAlign: 'top',
                      name: 'msg',
                      flex: 1,
                      margins: '0',
                      allowBlank: false
                    }
                  ],

                  buttons: [
                    {
                      text: 'Cancel',
                      handler: function () {
                        this.up('form').getForm().reset();
                        this.up('window').hide();
                      }
                    },
                    {
                      text: 'Send',
                      handler: function () {
// In a real application, this would submit the form to the configured url
                        var me = this
                        if (this.up('form').getForm().isValid()) {
                          this.up('form').getForm().submit({
                            success: function(form, action) {
                              if (action.result.success)
                                Ext.Msg.alert('Success', 'Email was correctly sent.\nThank you for your interest');

                              else
                                Ext.Msg.alert('Failed', 'Feedback could not be sent. Please try later')
console.info ("resetting and closing the form...")
                              me.up('form').getForm().reset();
                              me.up('window').hide();
                            },

                            failure: function(form, action) {
                              Ext.Msg.alert('Failed', 'There was an error while sending feedback. Please try later.');

                              me.up('form').getForm().reset();
                              me.up('window').hide();
                            }

                          });

//                          this.up('form').getForm().reset();
//                          this.up('window').hide();
//                          Ext.MessageBox.alert('Thank you!', 'Your feedback has been sent.');
                        }
                      } // EO handler
                    }
                  ]
                });

                me.win = Ext.widget('window', {
                  title: 'Contact Us',
                  closeAction: 'hide',
                  width: 400,
                  height: 400,
                  minHeight: 400,
                  layout: 'fit',
                  resizable: true,
                  modal: true,
                  items: form
                });
              }

              me.win.show();
          } // showWindow
        }]
      }
    ]

    me.callParent(arguments)
  }

/*
  showFeedbackWin: function () {
    var me = this
    if (!me.win) {
      var form = Ext.widget('form', {
        layout: {
          type: 'vbox',
          align: 'stretch'
        },
        border: false,
        bodyPadding: 10,

        fieldDefaults: {
          labelAlign: 'top',
          labelWidth: 100,
          labelStyle: 'font-weight:bold'
        },
        defaults: {
          margins: '0 0 10 0'
        },

        items: [

          {
            xtype: 'textfield',
            fieldLabel: 'Email Address',
            vtype: 'email',
            allowBlank: false
          },
          {
            xtype: 'textfield',
            fieldLabel: 'Subject',
            allowBlank: false
          },
          {
            xtype: 'textareafield',
            fieldLabel: 'Message',
            labelAlign: 'top',
            flex: 1,
            margins: '0',
            allowBlank: false
          }
        ],

        buttons: [
          {
            text: 'Cancel',
            handler: function () {
              this.up('form').getForm().reset();
              this.up('window').hide();
            }
          },
          {
            text: 'Send',
            handler: function () {
              if (this.up('form').getForm().isValid()) {
                // In a real application, this would submit the form to the configured url
                // this.up('form').getForm().submit();
                this.up('form').getForm().reset();
                this.up('window').hide();
                Ext.MessageBox.alert('Thank you!', 'Your feedback has been sent.');
              }
            }
          }
        ]
      });

      me.win = Ext.widget('window', {
        title: 'Contact Us',
        closeAction: 'hide',
        width: 400,
        height: 400,
        minHeight: 400,
        layout: 'fit',
        resizable: true,
        modal: true,
        items: form
      });
    }

//    me.win.show();
  } // showWindow
*/
})