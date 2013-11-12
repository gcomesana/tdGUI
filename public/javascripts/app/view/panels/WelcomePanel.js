

var imgPath = '/images/welcome';
var videoPath = '/videos';

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
    caption: 'Target Dossier underlying technology combines the OpenPHACTS semantic web APIs with other bioinformatics resources available through web services'
  }]

var speech = 'The Target Dossier GUI (TDGUI) is an application whose main goal is the integration of drug target’s data to identify the most productive points for therapeutic intervention. It is been developed within the context of the IMI project OpenPHACTS and relies on the knowledge discovery platform and APIs developed by the consortium.'
 + 'The application is in stable version 1.0 but still in development as many features can and will be added shortly.'

var wikiPages = 'Click on these links to get further documentation about the project<br/>';
wikiPages += '<a href="http://www.github.com/inab/tdGUI/wiki" target="_blank">Home docs</a> * ';
wikiPages += '<a href="http://www.github.com/inab/tdGUI/wiki/_pages" target="_blank">Wiki pages</a> * ';
wikiPages += '<div class="links"><a href="http://www.github.com/inab/tdGUI" target="_blank">Github</a> * ';
wikiPages += '<a href="http://www.inab.org" target="_blank">INB</a> * ';
wikiPages += '<a href="http://www.openphacts.org" target="_blank">OpenPHACTS</a>';
wikiPages += '</div><br/>And check the videos below to get a quick intro about how to use this application';

var videoListObj = [{
  src: videoPath + '/TargetDossier.m4v',
  title: 'Target Dossier GUI',
  caption: 'This video shows the features and how to use the Target Dossier tool',
  curtain: videoPath + '/TargetDossier.png'
}, {
  src: videoPath + '/HypothesisTester.m4v',
  title: 'Hypothesis Tester',
  caption: 'Watch this video to get introduced to the Hypothesis Tester tool',
  curtain: videoPath + '/HypothesisTester.png'
}];

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

var videoTpl = new Ext.XTemplate (
  '<div class="speech-tit">Target Dossier</div>',
  '<div class="speech-div">'+speech+'</div>',
  '<div class="speech-tit">Docs and further links</div>',
  '<div class="speech-div">'+wikiPages+'</div>',
  '<tpl for=".">',
  '<span class="welcome-tit">{title}</span><br/>',
  '<div class="video-container">',
  '<video id="tutorial_video_{#}" class="video-js vjs-default-skin video-size-pos" controls preload="none" '+
    'width="640" height="360" poster="{curtain}">',
  '<source src="{src}" type="video/mp4" />',
  '</video>',
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
  title: "Get started",

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
	tpl: videoTpl, // imageTpl,

	listeners: {
		render: function (comp, opts) {
//			tpl = self.createInfoXTpl ()
			this.tpl.overwrite(comp.body, videoListObj)
		},

    afterrender: function (comp, opts) {
      for (var i=0; i<videoListObj.length; i++) {
        var videoId = "tutorial_video_"+(i+1);
        videojs(videoId, {}, function() {
          console.log(videoId + " (seems to be) initialized");
        })
      }

    }
	}
})