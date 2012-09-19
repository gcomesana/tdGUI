/**
 * rcsbPdbImageLib
 * ----------------------------------------
 * Version: 2.0
 * Author: Bojan Beran
 * 
 * Description: The RCSB PDB Image Tag Library is created for easy embedding of PDB images on external websites.
 * 
 * Changes in v2: w3 compliant, params all passed through the 'title' attribute, new onload event handler, additional link to explorer page.
 * 
 */

/*global document: false, navigator: false, window: false */

var rcsbPdbImageLib = function() {
	
	// RCSB PDB Server Paths
	var server = "http://www.rcsb.org";
	var imagePath = "/pdb/images/";
	var cssPath = "/pdb/widgets/rcsbPdbWidgets.css";
	var exploreActionPath = "/pdb/explore/explore.do?structureId=";
	var imageActionPath = "/pdb/explore/images.do?structureId=";
	
	
	// Regular Expression Definitions
	var classPattern = new RegExp('(^|\\\\s+)rcsb_image(\\\\s+|$)');
	var bioPattern = new RegExp('^(asr|bio|bio_[0-9]+)$');
	var sizepattern = new RegExp('^(xsmall|small|medium|large|[0-9]+)$');
	var legacyPattern = new RegExp('(^|\\\\s+)rcsb_image_(small|medium|large)(\\\\s+|$)');
	
	return {
		isLocalCSS: false,
		useShadowBox: true,
		// rcsbPdbImageLib.initLib() - function is called first to iterate through the file and insert all required images.
		initLib: function() { 
			
			// Check if we already have our stylesheet embedded
			var hasStyle = false;
			for (var i = 0; i < document.styleSheets.length; i++) {
				if (document.styleSheets[i].href == server + cssPath) { hasStyle = true; }
			}
			// link to our external stylesheet
			if (!rcsbPdbImageLib.isLocalCSS && !hasStyle) {
				var extCSS=document.createElement("link");
				extCSS.setAttribute("rel", "stylesheet");
				extCSS.setAttribute("type", "text/css");
				extCSS.setAttribute("href", server + cssPath);
				extCSS.setAttribute("media", "screen");
				document.getElementsByTagName("head")[0].appendChild(extCSS);
			}
			
			// get a list of all tags and iterate through them.
			var imgTagList=document.getElementsByTagName("*");
			if ( imgTagList.length > 0) {
				for (i = 0; i < imgTagList.length; i++) {
					// if a tag has a class label 'rcsb_image' use the new action
					if ( classPattern.test(imgTagList[i].className) ) {
						rcsbPdbImageLib.processHit(imgTagList[i]);
					}
					// it a tag has a class label of 'rcsb_image_SIZE' use the legacy action
					if ( legacyPattern.test(imgTagList[i].className) ) {
						rcsbPdbImageLib.processLegacy(imgTagList[i]);
					}
				}
			}
		},
		
		// rcsbPdbImageLib.processHit(obj) - takes in the dom element writes the image 
		processHit: function(obj) {
			// use the title attribute to scrape all necessary parameters - format is 'id|type|size|title'
			var titleString = obj.getAttribute('title');
			var params = titleString.split('|');
			if (params.length == 4) {
				// default the size and type if the parameter has been malformed.
				if ( !bioPattern.test(params[1]) ) { params[1] = "bio_1"; }
				if ( !sizepattern.test(params[2]) ) { params[2] = "medium"; }
				obj.title = params[3];
				//create image object and attach the shadowbox function
				if (rcsbPdbImageLib.useShadowBox) {
					obj.className = obj.className + ' rcsb_clickable';
					obj.onclick = function() {
						rcsbPdbImageLib.shadowbox(params[0], params[3], rcsbPdbImageLib.getImageSrc(params[0], "large", params[1]));
					};
				}
				obj.innerHTML = "";
				obj.appendChild(rcsbPdbImageLib.createImage(params[0], params[3], params[2], rcsbPdbImageLib.getImageSrc(params[0], params[2], params[1])));
			}
		},
		
		// rcsbPdbImageLib.processLegacy(obj) - legacy version of processHit
		processLegacy: function(obj) {
			var id = obj.getAttribute('rel');
			// default the size and type if the parameter has been malformed.
			var classArr = obj.className.split('_');
			var size = classArr[2];
			if ( !sizepattern.test(size) ) { size = "medium"; }
			var imgType = obj.getAttribute('rev');
			if ( !bioPattern.test(imgType) ) { imgType = "bio_1"; }
			var title = obj.getAttribute('title');
			obj.title = title;
			//create image object and attach the shadowbox function
			if (rcsbPdbImageLib.useShadowBox) {
				obj.className = obj.className + ' rcsb_clickable';
				obj.onclick = function() {
					rcsbPdbImageLib.shadowbox(id, title, rcsbPdbImageLib.getImageSrc(id, "large", imgType));
				};
			}
			obj.innerHTML = "";
			obj.appendChild(rcsbPdbImageLib.createImage(id, title, size, rcsbPdbImageLib.getImageSrc(id, size, imgType)));
		},
		
		// rcsbPdbImageLib.createImage(id, title, imgSrc) - function that takes in the id, title and href then constructs and returns an img object
		createImage:function(id, title, sizeString, imgSrc) {
			var size = "250";
			if (sizeString == "xsmall") { size = "65"; }
			else if (sizeString == "small") { size = "80"; }
			else if (sizeString == "medium") { size = "250"; }
			else if (sizeString == "large") { size = "500"; }
			else { size = sizeString/1; }
			var img = document.createElement('img');
			if (rcsbPdbImageLib.useShadowBox) {
				img.className = "rcsb_clickable";
			}
			img.src = imgSrc;
			img.title = title;
			img.alt = id;
			img.width = size;
			img.height = size;
			return img;
		}, 
		
		// rcsbPdbImageLib.getImageSrc(id, sizeString, type) - given the id, size string and type it constructs the propper url for the image
		getImageSrc: function(id, sizeString, type) {
			var size = "250";
			if (sizeString == "xsmall" || ( sizeString/1 <= 65 ) ) { size = "65"; }
			else if (sizeString == "small" || ( sizeString/1 > 65 && sizeString/1 <= 80 ) ) { size = "80"; }
			else if (sizeString == "medium" || ( sizeString/1 > 80 && sizeString/1 <= 250 ) ) { size = "250"; }
			else if (sizeString == "large" || ( 250 < sizeString/1 ) ) { size = "500"; }
				
			
			var imgSrc;
			if ( type == 'asr' ) {
				imgSrc = server + imagePath + id + "_asr_r_" + size + ".jpg";
			} else {
				var typeArr = type.split("_");
				if (typeArr.length == 1) {
					typeArr[1] = '1';
				}
				imgSrc = server + imagePath + id + "_" + typeArr[0] + "_r_" + size + ".jpg?bioNum=" + typeArr[1];
			}		
			return imgSrc;
		},
		
		// rcsbPdbImageLib.shadowbox(id, title, imgSrc) - takes in the id, title and image source href and creates all the elements for a shadowbox display
		shadowbox:function(id, title, imgSrc) {
			var createBox = function() {
				var isIE6 = navigator.userAgent.toLowerCase().indexOf('msie 6') != -1;
				var imgURL = server + imageActionPath + id;
				var exploreURL = server + exploreActionPath + id;
				if ( title === null ) {
					title ="";
				} else {
					title = title + "<br />";
				}
				if (isIE6) {
					window.open(exploreURL);
				} else {
					var bg = document.createElement('div');
					var img_done,bg_done;
					bg.setAttribute('id','rcsb_shadowbox_shadow_bg');
					bg.className = "rcsb_clickable";
					bg.onclick = function() {
						img_done = document.getElementById('rcsb_shadowbox_imgBox');
						document.body.removeChild(img_done);
						bg_done = document.getElementById('rcsb_shadowbox_shadow_bg');
						document.body.removeChild(bg_done);
					};
					var imgBox = document.createElement('div');
					imgBox.setAttribute('id','rcsb_shadowbox_imgBox');
					
					var imgObj = document.createElement('img');
					imgObj.src = imgSrc;
					imgObj.alt = id;
					imgObj.title = title;
		
		
					var closeBox = document.createElement('div');
					closeBox.setAttribute('id','rcsb_shadowbox_closeBox');
					closeBox.className = "rcsb_clickable";
					closeBox.innerHTML = "CLOSE";
					closeBox.onclick = function() {
						img_done = document.getElementById('rcsb_shadowbox_imgBox');
						document.body.removeChild(img_done);
						bg_done = document.getElementById('rcsb_shadowbox_shadow_bg');
						document.body.removeChild(bg_done);
					};
					var idBox = document.createElement('div');
					idBox.setAttribute('id','rcsb_shadowbox_idBox');
					idBox.innerHTML="<h2 style='margin:0;padding:0;'>"+id+"</h2>"+title+"<a href='"+exploreURL + "'>Structure Explorer</a> | <a href='" + imgURL + ">More Images</a>";
					imgBox.appendChild(imgObj);
					imgBox.appendChild(idBox);
					imgBox.appendChild(closeBox);
					document.body.appendChild(bg);
					document.body.appendChild(imgBox);
				}
			};
			return createBox();
		},
		
		// rcsbPdbImageLib.addOnloadEvent(func) - function that attaches the library actions to the onload event without interrupting user defined events.
		addOnloadEvent: function(func){
			if ( window.addEventListener ) {
				window.addEventListener( "load", func, false );
			} else if ( window.attachEvent ) {
				window.attachEvent( "onload", func );
			} else {
				var oldOnload = window.onload || function() {};
				window.onload = function(e) {
					oldOnload(e);
					window[func](e);
				};
			}
		}
		
	};
}();

// Automatically start the library.
rcsbPdbImageLib.addOnloadEvent(function() { rcsbPdbImageLib.initLib(); });