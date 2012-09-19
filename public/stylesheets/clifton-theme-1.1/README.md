![Newbridge Green](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/assets/logo.png)


ExtJS 4 Theme - Clifton
=============

Thank you for purchasing the Clifton theme from Newbridge Green. Please get in touch at any time for support, questions or just to say hi!

 - Email: support@newbridgegreen.com

 - Twitter: [@newbridgegreen](https://twitter.com/#!/newbridgegreen)

##How to integrate with your ExtJS 4 project

Integrating this theme with your project is easy just do the following. 

 - Copy the contents of this download into your `public/resources` folder.
 - Modify your index page to include the clifton.css file `<link rel="stylesheet" type="text/css" href="resources/css/clifton.css" />`.

	
Now your ExtJS application should be using the new Clifton theme.

Look at `index.html` in the root of this project for an example of how to integrate the theme.

 > Please email support@newbridgegreen.com with any integration issues

##Customising the theme

If you are planning on customising this theme, you should have a basic understanding of how theming works within ExtJS.


**If you do not, please read the [ExtJS 4 Theming guide](http://docs.sencha.com/ext-js/4-1/#!/guide/theming) and understand how to customise a theme before you attempt any modifications.**


Once you have installed the custom theme [requirements](http://docs.sencha.com/ext-js/4-1/#!/guide/theming-section-2) and the [Sencha SDK](http://www.sencha.com/products/sdk-tools). You can setup [ExtJS 4](http://www.sencha.com/products/extjs) in the root directory of this project.


####Linux/OSX
If you already have the ExtJS 4 framework installed on your machine, symlink to it in the root of this project.

	ln -s [Path to ExtJS] extjs
	
####Windows
Copy the ExtJS 4 framework into the root folder of this project

Now you should be ready to recompile this theme.

###Basic customisation

You can change basic properties of this theme by altering any of the files in the `themes/stylesheets/clifton/default/variables` folder. Each file gives you a basic set of variables to alter things like font size, colour, borders etc for each of the major components. 

###Regenerate Theme

	cd [ROOT]/sass
	compass compile
	
To watch for changes on the files rather than recompiling after changes, use this.

	compass watch
	
###Regenerate images for old browsers

If you make changes to the colour scheme, you will need to reslice the theme in order to support all the browsers out there that we wish didn't exist anymore.
 
	cd [ROOT]/sass
	sencha slice theme -d ../extjs -c ../css/clifton.css -o ../themes/images/default/ -v
	
This will slice up your lovely new CSS3 based theme into nice little images for older browsers.


###Add new icons

Copy any new icons to the folder `themes/images/default/icon` then run this to generate a new _icons.scss file

	cd [ROOT]/sass
	compass sprite --force "icon/*.png
	compass compile
	
This will recompile the theme to create the sprite file with the new icons. Use the @include icon-sprite([filename]) mixin to include any new icons in this theme.


Icon Classes
=============
This is a table of the included icons. You can use these in the iconCls property of your projects components.

|class|icon|
|:----|:--:|
|icon-down|![icon-down](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/down.png)|
|icon-edit|![icon-edit](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/edit.png)|
|icon-save|![icon-save](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/save.png)|
|icon-eject|![icon-eject](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/eject.png)|
|icon-maximize|![icon-maximize](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/maximize.png)|
|icon-email|![icon-email](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/email.png)|
|icon-minimize|![icon-minimize](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/minimize.png)|
|icon-mobile|![icon-mobile](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/mobile.png)|
|icon-add|![icon-add](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/add.png)|
|icon-next|![icon-next](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/next.png)|
|icon-search|![icon-search](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/search.png)|
|icon-end|![icon-end](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/end.png)|
|icon-bar-chart|![icon-bar-chart](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/bar-chart.png)|
|icon-pause|![icon-pause](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/pause.png)|
|icon-phone|![icon-phone](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/phone.png)|
|icon-calendar|![icon-calendar](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/calendar.png)|
|icon-expand|![icon-expand](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/expand.png)|
|icon-cancel|![icon-cancel](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/cancel.png)|
|icon-fastforward|![icon-fastforward](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/fastforward.png)|
|icon-fax|![icon-fax](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/fax.png)|
|icon-start|![icon-start](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/start.png)|
|icon-gauge|![icon-gauge](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/gauge.png)|
|icon-prev|![icon-prev](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/prev.png)|
|icon-close|![icon-close](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/close.png)|
|icon-gear|![icon-gear](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/gear.png)|
|icon-print|![icon-print](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/print.png)|
|icon-stop|![icon-stop](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/stop.png)|
|icon-code|![icon-code](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/code.png)|
|icon-help|![icon-help](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/help.png)|
|icon-tag|![icon-tag](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/tag.png)|
|icon-collapse|![icon-collapse](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/collapse.png)|
|icon-task|![icon-task](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/task.png)|
|icon-company|![icon-company](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/company.png)|
|icon-incidents|![icon-incidents](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/incidents.png)|
|icon-time|![icon-time](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/time.png)|
|icon-contract|![icon-contract](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/contract.png)|
|icon-record|![icon-record](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/record.png)|
|icon-refresh|![icon-refresh](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/refresh.png)|
|icon-date|![icon-date](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/date.png)|
|icon-up|![icon-up](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/up.png)|
|icon-restore|![icon-restore](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/restore.png)|
|icon-left|![icon-left](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/left.png)|
|icon-rewind|![icon-rewind](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/rewind.png)|
|icon-line-chart|![icon-line-chart](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/line-chart.png)|
|icon-warning|![icon-warning](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/warning.png)|
|icon-list|![icon-list](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/list.png)|
|icon-right|![icon-right](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/right.png)|
|icon-delete|![icon-delete](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/delete.png)|
|icon-rss|![icon-rss](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/rss.png)|
|icon-logout|![icon-logout](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/themes/images/default/icon/logout.png)|

Sample Screenshot
=============
![Clifton Theme](https://github.com/NewbridgeGreen/extjs-clifton/raw/master/assets/clifton-theme.png)

