

var imgPath = '/images/welcome'
var imgListObj = [{
    src: imgPath + '/semantic-search.png',
    title: 'Semantic search',
    caption: 'The OPS core API that implements semantic search over the linked data cache powers the TD target search.'
  }, {
    src: imgPath + '/target-list.png',
    title: 'Customizable target lists',
    caption: 'Users might select different targets and store them in a list for later analysis.'
  }, {
    src: imgPath + '/target-reports.png',
    title: 'Target’s functional reports',
    caption: 'For each target a report is built gathering data from different sources that provide hints about the target role in different biological process'
  }, {
    src: imgPath + '/target-pharmacology.png',
    title: 'Target’s pharmacology',
    caption: 'o	The list of compounds with a proven activity against each target is provided'
  }, {
    src: imgPath + '/target-interaction.png',
    title: 'Navigable target’s interaction network',
    caption: 'For each target the protein interaction network is retrieved and showed to the user who can add new targets to the list by navigating the network'
  }, {
    src: imgPath + '/dual-system.png',
    title: 'Dual retrieval system',
    caption: 'Target Dossier underlying technology combines the OpenPhacts semantic web APIs with other bioinformatics resources available through web services'
  }]

var speech = 'The Target Dossier (TD) is an application whose main goal is the integration of drug target’s data to identify the most productive points for therapeutic intervention. It is been developed within the context of the IMI project OpenPhacts (http://openphacts.org) and relies on the knowledge discovery platform and APIs developed by the consortium.'
 + 'The application is still on an early stage of development, current version 0.2 implements some of the features planed for the full application that will be released at the end of 2013.'


var imageTpl = new Ext.XTemplate (
  '<div class="speech-tit">Target Dossier</div>',
	'<div class="speech-div">'+speech+'</div>',
  '<div class="speech-tit">Feature list</div>',
	'<tpl for=".">',
	'<div class="feats-container-odd">',
	'<img src="{src}" align="left" class="welcome-img"/>',
	'<span class="welcome-tit">{#}. {title}</span>' +
  '<br/>{caption}',
	'</div>',
	'</tpl>'
);


/**
 * @class TDGUI.view.panels.WelcomePanel
 * @extend Ext.panel.Panel
 * @alias widget.tdgui-welcomepanel
 *
 * This is the very first panel displayed when the application boots up.
 * No closable, it is just a kind of welcome screen, tab sized
 */
Ext.define ('TDGUI.view.panels.WelcomePanel', {
	extend: 'Ext.panel.Panel',
  alias: 'widget.tdgui-welcomepanel',


	autoScroll: true,
  title: "Welcome",

  /**
   * @cfg {Object} defaults see TDGUI.view.Viewport#defaults
   */
  defaults: {
		margins: '0 0 10 0',
		padding: '15px 15px 15px 15px'
	},


  /**
   * @cfg {Ext.XTemplate} the template used to show the welcome screen
   */
	tpl: imageTpl,

	listeners: {
		render: function (comp, opts) {
//			tpl = self.createInfoXTpl ()
				this.tpl.overwrite(comp.body, imgListObj)
		}
	}
})