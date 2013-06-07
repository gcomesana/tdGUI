if (typeof jwplayer == "undefined") {
	var jwplayer = function(a) {
		if (jwplayer.api)
			return jwplayer.api.selectPlayer(a)
	}, $jw = jwplayer;

	jwplayer.version = "5.10.2295 (Licensed version)", 
	jwplayer.vid = document.createElement("video"), 
	jwplayer.audio = document.createElement("audio"), 
	jwplayer.source = document.createElement("source"),
	
	function(a) {
		
		function b(b) {
			if (!a.utils.exists(b))
				return;
			var c = b.indexOf("://"),
				d = b.indexOf("?");
			return c > 0 && (d < 0 || d > c)
		}

		a.utils = function() {}, // object definition
		a.utils.typeOf = function(a) {
			var b = typeof a;
			return b === "object" && (a ? a instanceof Array && (b = "array") : b = "null"), b
		}, 

		a.utils.extend = function() {
			var b = a.utils.extend.arguments;
			if (b.length > 1) {
				for (var c = 1; c < b.length; c++)
					for (var d in b[c])
						b[0][d] = b[c][d];
				return b[0]
			}
			return null
		}, 

		a.utils.clone = function(b) {
			var c, d = a.utils.clone.arguments;
			if (d.length == 1)
				switch (a.utils.typeOf(d[0])) {
					case "object":
						c = {};
						for (var e in d[0])
							c[e] = a.utils.clone(d[0][e]);
						break;
					case "array":
						c = [];
						for (var e in d[0])
							c[e] = a.utils.clone(d[0][e]);
						break;
					default:
						return d[0]
			}
			return c
		}, 

		a.utils.extension = function(a) {
			if (!a)
				return "";
			a = a.substring(a.lastIndexOf("/") + 1, a.length), a = a.split("?")[0];
			if (a.lastIndexOf(".") > -1)
				return a.substr(a.lastIndexOf(".") + 1, a.length).toLowerCase();
			return
		}, 
		a.utils.html = function(a, b) {
			a.innerHTML = b
		}, 
		a.utils.wrap = function(a, b) {
			a.parentNode && a.parentNode.replaceChild(b, a), b.appendChild(a)
		}, 
		a.utils.ajax = function(b, c, d) {
			var e;
			window.XMLHttpRequest ? e = new XMLHttpRequest : e = new ActiveXObject("Microsoft.XMLHTTP"), e.onreadystatechange = function() {
				if (e.readyState === 4)
					if (e.status === 200) {
						if (c) {
							if (!a.utils.exists(e.responseXML))
								try {
									if (window.DOMParser) {
										var f = (new DOMParser).parseFromString(e.responseText, "text/xml");
										f && (e = a.utils.extend({}, e, {
											responseXML: f
										}))
									} else
										f = new ActiveXObject("Microsoft.XMLDOM"), f.async = "false", f.loadXML(e.responseText), e = a.utils.extend({}, e, {
											responseXML: f
										})
							} catch (h) {
								d && d(b)
							}
							c(e)
						}
					} else
						d && d(b)
			};
			try {
				e.open("GET", b, !0), e.send(null)
			} catch (f) {
				d && d(b)
			}
			return e
		}, 
		a.utils.load = function(a, b, c) {
			a.onreadystatechange = function() {
				a.readyState === 4 && (a.status === 200 ? b && b() : c && c())
			}
		}, 
		a.utils.find = function(a, b) {
			return a.getElementsByTagName(b)
		}, 
		a.utils.append = function(a, b) {
			a.appendChild(b)
		}, 
		a.utils.isIE = function() {
			return typeof window.ActiveXObject != "undefined"
		}, a.utils.userAgentMatch = function(a) {
			var b = navigator.userAgent.toLowerCase();
			return b.match(a) !== null
		}, a.utils.isIOS = function() {
			return a.utils.userAgentMatch(/iP(hone|ad|od)/i)
		}, a.utils.isIPad = function() {
			return a.utils.userAgentMatch(/iPad/i)
		}, a.utils.isIPod = function() {
			return a.utils.userAgentMatch(/iP(hone|od)/i)
		}, a.utils.isAndroid = function() {
			return a.utils.userAgentMatch(/android/i)
		}, a.utils.isLegacyAndroid = function() {
			return a.utils.userAgentMatch(/android 2.[012]/i)
		}, a.utils.isBlackberry = function() {
			return a.utils.userAgentMatch(/blackberry/i)
		}, a.utils.isMobile = function() {
			return a.utils.userAgentMatch(/(iP(hone|ad|od))|android/i)
		}, a.utils.getFirstPlaylistItemFromConfig = function(a) {
			var b = {}, c;
			return a.playlist && a.playlist.length ? c = a.playlist[0] : c = a, b.file = c.file, b.levels = c.levels, b.streamer = c.streamer, b.playlistfile = c.playlistfile, b.provider = c.provider, b.provider || (b.file && (b.file.toLowerCase().indexOf("youtube.com") > -1 || b.file.toLowerCase().indexOf("youtu.be") > -1) && (b.provider = "youtube"), b.streamer && b.streamer.toLowerCase().indexOf("rtmp://") == 0 && (b.provider = "rtmp"), c.type && (b.provider = c.type.toLowerCase())), b.provider == "audio" && (b.provider = "sound"), b
		}, a.utils.getOuterHTML = function(a) {
			if (a.outerHTML)
				return a.outerHTML;
			try {
				return (new XMLSerializer).serializeToString(a)
			} catch (b) {
				return ""
			}
		}, a.utils.setOuterHTML = function(a, b) {
			if (a.outerHTML)
				a.outerHTML = b;
			else {
				var c = document.createElement("div");
				c.innerHTML = b;
				var d = document.createRange();
				d.selectNodeContents(c);
				var e = d.extractContents();
				a.parentNode.insertBefore(e, a), a.parentNode.removeChild(a)
			}
		}, a.utils.hasFlash = function() {
			if (typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] != "undefined")
				return !0;
			if (typeof window.ActiveXObject != "undefined")
				try {
					return new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), !0
			} catch (a) {}
			return !1
		}, a.utils.getPluginName = function(a) {
			return a.lastIndexOf("/") >= 0 && (a = a.substring(a.lastIndexOf("/") + 1, a.length)), a.lastIndexOf("-") >= 0 && (a = a.substring(0, a.lastIndexOf("-"))), a.lastIndexOf(".swf") >= 0 && (a = a.substring(0, a.lastIndexOf(".swf"))), a.lastIndexOf(".js") >= 0 && (a = a.substring(0, a.lastIndexOf(".js"))), a
		}, a.utils.getPluginVersion = function(a) {
			return a.lastIndexOf("-") >= 0 ? a.lastIndexOf(".js") >= 0 ? a.substring(a.lastIndexOf("-") + 1, a.lastIndexOf(".js")) : a.lastIndexOf(".swf") >= 0 ? a.substring(a.lastIndexOf("-") + 1, a.lastIndexOf(".swf")) : a.substring(a.lastIndexOf("-") + 1) : ""
		}, a.utils.getAbsolutePath = function(c, d) {
			a.utils.exists(d) || (d = document.location.href);
			if (!a.utils.exists(c))
				return undefined;
			if (b(c))
				return c;
			var e = d.substring(0, d.indexOf("://") + 3),
				f = d.substring(e.length, d.indexOf("/", e.length + 1)),
				g;
			if (c.indexOf("/") === 0)
				g = c.split("/");
			else {
				var h = d.split("?")[0];
				h = h.substring(e.length + f.length + 1, h.lastIndexOf("/")), g = h.split("/").concat(c.split("/"))
			}
			var i = [];
			for (var j = 0; j < g.length; j++) {
				if (!g[j] || !a.utils.exists(g[j]) || g[j] == ".")
					continue;
				g[j] == ".." ? i.pop() : i.push(g[j])
			}
			return e + f + "/" + i.join("/")
		}, a.utils.pluginPathType = {
			ABSOLUTE: "ABSOLUTE",
			RELATIVE: "RELATIVE",
			CDN: "CDN"
		}, a.utils.getPluginPathType = function(b) {
			if (typeof b != "string")
				return;
			b = b.split("?")[0];
			var c = b.indexOf("://");
			if (c > 0)
				return a.utils.pluginPathType.ABSOLUTE;
			var d = b.indexOf("/"),
				e = a.utils.extension(b);
			return c < 0 && d < 0 && (!e || !isNaN(e)) ? a.utils.pluginPathType.CDN : a.utils.pluginPathType.RELATIVE
		}, a.utils.mapEmpty = function(a) {
			for (var b in a)
				return !1;
			return !0
		}, a.utils.mapLength = function(a) {
			var b = 0;
			for (var c in a)
				b++;
			return b
		}, a.utils.log = function(a, b) {
			typeof console != "undefined" && typeof console.log != "undefined" && (b ? console.log(a, b) : console.log(a))
		}, a.utils.css = function(b, c, d) {
			if (a.utils.exists(b))
				for (var e in c)
					try {
						if (typeof c[e] == "undefined")
							continue;
						if (typeof c[e] == "number" && e != "zIndex" && e != "opacity") {
							if (isNaN(c[e]))
								continue;
							e.match(/color/i) ? c[e] = "#" + a.utils.strings.pad(c[e].toString(16), 6) : c[e] = Math.ceil(c[e]) + "px"
						}
						b.style[e] = c[e]
			} catch (f) {}
		}, a.utils.isYouTube = function(a) {
			return a.indexOf("youtube.com") > -1 || a.indexOf("youtu.be") > -1
		}, a.utils.transform = function(b, c, d, e, f) {
			a.utils.exists(c) || (c = 1), a.utils.exists(d) || (d = 1), a.utils.exists(e) || (e = 0), a.utils.exists(f) || (f = 0);
			if (c == 1 && d == 1 && e == 0 && f == 0)
				b.style.webkitTransform = "", b.style.MozTransform = "", b.style.OTransform = "";
			else {
				var g = "scale(" + c + "," + d + ") translate(" + e + "px," + f + "px)";
				b.style.webkitTransform = g, b.style.MozTransform = g, b.style.OTransform = g
			}
		}, a.utils.stretch = function(b, c, d, e, f, g) {
			if (typeof d == "undefined" || typeof e == "undefined" || typeof f == "undefined" || typeof g == "undefined")
				return;
			var h = d / f,
				i = e / g,
				j = 0,
				k = 0,
				l = !1,
				m = {};
			c.parentElement && (c.parentElement.style.overflow = "hidden"), a.utils.transform(c);
			switch (b.toUpperCase()) {
				case a.utils.stretching.NONE:
					m.width = f, m.height = g, m.top = (e - m.height) / 2, m.left = (d - m.width) / 2;
					break;
				case a.utils.stretching.UNIFORM:
					h > i ? (m.width = f * i, m.height = g * i, m.width / d > .95 && (l = !0, h = Math.ceil(100 * d / m.width) / 100, i = 1, m.width = d)) : (m.width = f * h, m.height = g * h, m.height / e > .95 && (l = !0, h = 1, i = Math.ceil(100 * e / m.height) / 100, m.height = e)), m.top = (e - m.height) / 2, m.left = (d - m.width) / 2;
					break;
				case a.utils.stretching.FILL:
					h > i ? (m.width = f * h, m.height = g * h) : (m.width = f * i, m.height = g * i), m.top = (e - m.height) / 2, m.left = (d - m.width) / 2;
					break;
				case a.utils.stretching.EXACTFIT:
					m.width = f, m.height = g;
					var n = Math.round(f / 2 * (1 - 1 / h)),
						o = Math.round(g / 2 * (1 - 1 / i));
					l = !0, m.top = m.left = 0;
					break;
				default:
			}
			l && a.utils.transform(c, h, i, n, o), a.utils.css(c, m)
		}, a.utils.stretching = {
			NONE: "NONE",
			FILL: "FILL",
			UNIFORM: "UNIFORM",
			EXACTFIT: "EXACTFIT"
		}, a.utils.deepReplaceKeyName = function(b, c, d) {
			switch (a.utils.typeOf(b)) {
				case "array":
					for (var e = 0; e < b.length; e++)
						b[e] = a.utils.deepReplaceKeyName(b[e], c, d);
					break;
				case "object":
					for (var f in b) {
						var g, h;
						if (c instanceof Array && d instanceof Array) {
							if (c.length != d.length)
								continue;
							g = c, h = d
						} else
							g = [c], h = [d];
						var i = f;
						for (var e = 0; e < g.length; e++)
							i = i.replace(new RegExp(c[e], "g"), d[e]);
						b[i] = a.utils.deepReplaceKeyName(b[f], c, d), f != i && delete b[f]
					}
			}
			return b
		}, a.utils.isInArray = function(a, b) {
			if ( !! a && a instanceof Array) {
				for (var c = 0; c < a.length; c++)
					if (b === a[c])
						return !0;
				return !1
			}
			return !1
		}, a.utils.exists = function(a) {
			switch (typeof a) {
				case "string":
					return a.length > 0;
				case "object":
					return a !== null;
				case "undefined":
					return !1
			}
			return !0
		}, a.utils.empty = function(a) {
			if (typeof a.hasChildNodes == "function")
				while (a.hasChildNodes())
					a.removeChild(a.firstChild)
		}, a.utils.parseDimension = function(a) {
			return typeof a == "string" ? a === "" ? 0 : a.lastIndexOf("%") > -1 ? a : parseInt(a.replace("px", ""), 10) : a
		}, a.utils.getDimensions = function(b) {
			return b && b.style ? {
				x: a.utils.parseDimension(b.style.left),
				y: a.utils.parseDimension(b.style.top),
				width: a.utils.parseDimension(b.style.width),
				height: a.utils.parseDimension(b.style.height)
			} : {}
		}, a.utils.getElementWidth = function(b) {
			return b ? b == document.body ? a.utils.parentNode(b).clientWidth : b.clientWidth > 0 ? b.clientWidth : b.style ? a.utils.parseDimension(b.style.width) : null : null
		}, a.utils.getElementHeight = function(b) {
			return b ? b == document.body ? a.utils.parentNode(b).clientHeight : b.clientHeight > 0 ? b.clientHeight : b.style ? a.utils.parseDimension(b.style.height) : null : null
		}, a.utils.timeFormat = function(a) {
			return str = "00:00", a > 0 && (str = Math.floor(a / 60) < 10 ? "0" + Math.floor(a / 60) + ":" : Math.floor(a / 60) + ":", str += Math.floor(a % 60) < 10 ? "0" + Math.floor(a % 60) : Math.floor(a % 60)), str
		}, a.utils.useNativeFullscreen = function() {
			return navigator && navigator.vendor && navigator.vendor.indexOf("Apple") == 0
		}, a.utils.parentNode = function(a) {
			return a ? a.parentNode ? a.parentNode : a.parentElement ? a.parentElement : a : document.body
		}, a.utils.getBoundingClientRect = function(a) {
			return typeof a.getBoundingClientRect == "function" ? a.getBoundingClientRect() : {
				left: a.offsetLeft + document.body.scrollLeft,
				top: a.offsetTop + document.body.scrollTop,
				width: a.offsetWidth,
				height: a.offsetHeight
			}
		}, a.utils.translateEventResponse = function(b, c) {
			var d = a.utils.extend({}, c);
			b == a.api.events.JWPLAYER_FULLSCREEN && !d.fullscreen ? (d.fullscreen = d.message == "true" ? !0 : !1, delete d.message) : typeof d.data == "object" ? (d = a.utils.extend(d, d.data), delete d.data) : typeof d.metadata == "object" && a.utils.deepReplaceKeyName(d.metadata, ["__dot__", "__spc__", "__dsh__"], [".", " ", "-"]);
			var e = ["position", "duration", "offset"];
			for (var f in e)
				d[e[f]] && (d[e[f]] = Math.round(d[e[f]] * 1e3) / 1e3);
			return d
		}, a.utils.saveCookie = function(a, b) {
			document.cookie = "jwplayer." + a + "=" + b + "; path=/"
		}, a.utils.getCookies = function() {
			var a = {}, b = document.cookie.split("; ");
			for (var c = 0; c < b.length; c++) {
				var d = b[c].split("=");
				d[0].indexOf("jwplayer.") == 0 && (a[d[0].substring(9, d[0].length)] = d[1])
			}
			return a
		}, a.utils.readCookie = function(b) {
			return a.utils.getCookies()[b]
		}
	} (jwplayer),

	function(a) {
		a.events = function() {}, a.events.COMPLETE = "COMPLETE", a.events.ERROR = "ERROR"
	}(jwplayer),

	function(jwplayer) {
		jwplayer.events.eventdispatcher = function(debug) {
			var _debug = debug,
				_listeners, _globallisteners;
			this.resetEventListeners = function() {
				_listeners = {}, _globallisteners = []
			}, this.resetEventListeners(), this.addEventListener = function(type, listener, count) {
				try {
					jwplayer.utils.exists(_listeners[type]) || (_listeners[type] = []), typeof listener == "string" && eval("listener = " + listener), _listeners[type].push({
						listener: listener,
						count: count
					})
				} catch (err) {
					jwplayer.utils.log("error", err)
				}
				return !1
			}, this.removeEventListener = function(a, b) {
				if (!_listeners[a])
					return;
				try {
					for (var c = 0; c < _listeners[a].length; c++)
						if (_listeners[a][c].listener.toString() == b.toString()) {
							_listeners[a].splice(c, 1);
							break
						}
				} catch (d) {
					jwplayer.utils.log("error", d)
				}
				return !1
			}, this.addGlobalListener = function(listener, count) {
				try {
					typeof listener == "string" && eval("listener = " + listener), _globallisteners.push({
						listener: listener,
						count: count
					})
				} catch (err) {
					jwplayer.utils.log("error", err)
				}
				return !1
			}, this.removeGlobalListener = function(a) {
				if (!a)
					return;
				try {
					for (var b = 0; b < _globallisteners.length; b++)
						if (_globallisteners[b].listener.toString() == a.toString()) {
							_globallisteners.splice(b, 1);
							break
						}
				} catch (c) {
					jwplayer.utils.log("error", c)
				}
				return !1
			}, this.sendEvent = function(a, b) {
				jwplayer.utils.exists(b) || (b = {}), _debug && jwplayer.utils.log(a, b);
				if (typeof _listeners[a] != "undefined")
					for (var c = 0; c < _listeners[a].length; c++) {
						try {
							_listeners[a][c].listener(b)
						} catch (d) {
							jwplayer.utils.log("There was an error while handling a listener: " + d.toString(), _listeners[a][c].listener)
						}
						_listeners[a][c] && (_listeners[a][c].count === 1 ? delete _listeners[a][c] : _listeners[a][c].count > 0 && (_listeners[a][c].count = _listeners[a][c].count - 1))
				}
				for (var e = 0; e < _globallisteners.length; e++) {
					try {
						_globallisteners[e].listener(b)
					} catch (d) {
						jwplayer.utils.log("There was an error while handling a listener: " + d.toString(), _globallisteners[e].listener)
					}
					_globallisteners[e] && (_globallisteners[e].count === 1 ? delete _globallisteners[e] : _globallisteners[e].count > 0 && (_globallisteners[e].count = _globallisteners[e].count - 1))
				}
			}
		}
	}(jwplayer),

	function(a) {
		var b = {};
		a.utils.animations = function() {}, a.utils.animations.transform = function(a, b) {
			a.style.webkitTransform = b, a.style.MozTransform = b, a.style.OTransform = b, a.style.msTransform = b
		}, a.utils.animations.transformOrigin = function(a, b) {
			a.style.webkitTransformOrigin = b, a.style.MozTransformOrigin = b, a.style.OTransformOrigin = b, a.style.msTransformOrigin = b
		}, a.utils.animations.rotate = function(b, c) {
			a.utils.animations.transform(b, ["rotate(", c, "deg)"].join(""))
		}, a.utils.cancelAnimation = function(a) {
			delete b[a.id]
		}, a.utils.fadeTo = function(c, d, e, f, g, h) {
			if (b[c.id] != h && a.utils.exists(h))
				return;
			if (c.style.opacity == d)
				return;
			var i = (new Date).getTime();
			h > i && setTimeout(function() {
				a.utils.fadeTo(c, d, e, f, 0, h)
			}, h - i), c.style.display == "none" && (c.style.display = "block"), a.utils.exists(f) || (f = c.style.opacity === "" ? 1 : c.style.opacity);
			if (c.style.opacity == d && c.style.opacity !== "" && a.utils.exists(h)) {
				d === 0 && (c.style.display = "none");
				return
			}
			a.utils.exists(h) || (h = i, b[c.id] = h), a.utils.exists(g) || (g = 0);
			var j = e > 0 ? (i - h) / (e * 1e3) : 0;
			j = j > 1 ? 1 : j;
			var k = d - f,
				l = f + j * k;
			l > 1 ? l = 1 : l < 0 && (l = 0), c.style.opacity = l;
			if (g > 0) {
				b[c.id] = h + g * 1e3, a.utils.fadeTo(c, d, e, f, 0, b[c.id]);
				return
			}
			setTimeout(function() {
				a.utils.fadeTo(c, d, e, f, 0, h)
			}, 10)
		}
	}(jwplayer),

	function(a) {
		a.utils.arrays = function() {}, a.utils.arrays.indexOf = function(a, b) {
			for (var c = 0; c < a.length; c++)
				if (a[c] == b)
					return c;
			return -1
		}, a.utils.arrays.remove = function(b, c) {
			var d = a.utils.arrays.indexOf(b, c);
			d > -1 && b.splice(d, 1)
		}
	}(jwplayer),

	function(a) {
		a.utils.extensionmap = {
			"3gp": {
				html5: "video/3gpp",
				flash: "video"
			},
			"3gpp": {
				html5: "video/3gpp"
			},
			"3g2": {
				html5: "video/3gpp2",
				flash: "video"
			},
			"3gpp2": {
				html5: "video/3gpp2"
			},
			flv: {
				flash: "video"
			},
			f4a: {
				html5: "audio/mp4"
			},
			f4b: {
				html5: "audio/mp4",
				flash: "video"
			},
			f4v: {
				html5: "video/mp4",
				flash: "video"
			},
			mov: {
				html5: "video/quicktime",
				flash: "video"
			},
			m4a: {
				html5: "audio/mp4",
				flash: "video"
			},
			m4b: {
				html5: "audio/mp4"
			},
			m4p: {
				html5: "audio/mp4"
			},
			m4v: {
				html5: "video/mp4",
				flash: "video"
			},
			mp4: {
				html5: "video/mp4",
				flash: "video"
			},
			rbs: {
				flash: "sound"
			},
			aac: {
				html5: "audio/aac",
				flash: "video"
			},
			mp3: {
				html5: "audio/mp3",
				flash: "sound"
			},
			ogg: {
				html5: "audio/ogg"
			},
			oga: {
				html5: "audio/ogg"
			},
			ogv: {
				html5: "video/ogg"
			},
			webm: {
				html5: "video/webm"
			},
			m3u8: {
				html5: "audio/x-mpegurl"
			},
			gif: {
				flash: "image"
			},
			jpeg: {
				flash: "image"
			},
			jpg: {
				flash: "image"
			},
			swf: {
				flash: "image"
			},
			png: {
				flash: "image"
			},
			wav: {
				html5: "audio/x-wav"
			}
		}
	}(jwplayer),

	function(a) {
		function d(c, d) {
			return a.utils.exists(d) ? a.utils.extend(d, b[c]) : d = b[c], d
		}

		function e(b, e) {
			if (c[b.tagName.toLowerCase()] && !a.utils.exists(e))
				return c[b.tagName.toLowerCase()](b);
			e = d("element", e);
			var f = {};
			for (var g in e)
				if (g != "length") {
					var h = b.getAttribute(g);
					a.utils.exists(h) && (f[e[g]] = h)
				}
			var i = b.style["#background-color"];
			return i && i != "transparent" && i != "rgba(0, 0, 0, 0)" && (f.screencolor = i), f
		}

		function f(b, c) {
			c = d("media", c);
			var f = [],
				h = a.utils.selectors("source", b);
			for (var i in h)
				isNaN(i) || f.push(g(h[i]));
			var j = e(b, c);
			return a.utils.exists(j.file) && (f[0] = {
				file: j.file
			}), j.levels = f, j
		}

		function g(a, b) {
			b = d("source", b);
			var c = e(a, b);
			return c.width = c.width ? c.width : 0, c.bitrate = c.bitrate ? c.bitrate : 0, c
		}

		function h(a, b) {
			b = d("video", b);
			var c = f(a, b);
			return c
		}
		a.utils.mediaparser = function() {};
		var b = {
			element: {
				width: "width",
				height: "height",
				id: "id",
				"class": "className",
				name: "name"
			},
			media: {
				src: "file",
				preload: "preload",
				autoplay: "autostart",
				loop: "repeat",
				controls: "controls"
			},
			source: {
				src: "file",
				type: "type",
				media: "media",
				"data-jw-width": "width",
				"data-jw-bitrate": "bitrate"
			},
			video: {
				poster: "image"
			}
		}, c = {};
		a.utils.mediaparser.parseMedia = function(a) {
			return e(a)
		}, c.media = f, c.audio = f, c.source = g, c.video = h
	}(jwplayer),

	function(a) {
		a.utils.loaderstatus = {
			NEW: "NEW",
			LOADING: "LOADING",
			ERROR: "ERROR",
			COMPLETE: "COMPLETE"
		}, a.utils.scriptloader = function(b) {
			var c = a.utils.loaderstatus.NEW,
				d = new a.events.eventdispatcher;
			a.utils.extend(this, d), this.load = function() {
				if (c == a.utils.loaderstatus.NEW) {
					c = a.utils.loaderstatus.LOADING;
					var e = document.createElement("script");
					e.onload = function(b) {
						c = a.utils.loaderstatus.COMPLETE, d.sendEvent(a.events.COMPLETE)
					}, e.onerror = function(b) {
						c = a.utils.loaderstatus.ERROR, d.sendEvent(a.events.ERROR)
					}, e.onreadystatechange = function() {
						if (e.readyState == "loaded" || e.readyState == "complete")
							c = a.utils.loaderstatus.COMPLETE, d.sendEvent(a.events.COMPLETE)
					}, document.getElementsByTagName("head")[0].appendChild(e), e.src = b
				}
			}, this.getStatus = function() {
				return c
			}
		}
	}(jwplayer),

	function(a) {
		a.utils.selectors = function(b, c) {
			a.utils.exists(c) || (c = document), b = a.utils.strings.trim(b);
			var d = b.charAt(0);
			if (d == "#")
				return c.getElementById(b.substr(1));
			if (d == ".")
				return c.getElementsByClassName ? c.getElementsByClassName(b.substr(1)) : a.utils.selectors.getElementsByTagAndClass("*", b.substr(1));
			if (b.indexOf(".") > 0) {
				var e = b.split(".");
				return a.utils.selectors.getElementsByTagAndClass(e[0], e[1])
			}
			return c.getElementsByTagName(b)
		}, a.utils.selectors.getElementsByTagAndClass = function(b, c, d) {
			var e = [];
			a.utils.exists(d) || (d = document);
			var f = d.getElementsByTagName(b);
			for (var g = 0; g < f.length; g++)
				if (a.utils.exists(f[g].className)) {
					var h = f[g].className.split(" ");
					for (var i = 0; i < h.length; i++)
						h[i] == c && e.push(f[g])
				}
			return e
		}
	}(jwplayer),
	function(a) {
		a.utils.strings = function() {}, a.utils.strings.trim = function(a) {
			return a.replace(/^\s*/, "").replace(/\s*$/, "")
		}, a.utils.strings.pad = function(a, b, c) {
			c || (c = "0");
			while (a.length < b)
				a = c + a;
			return a
		}, a.utils.strings.serialize = function(a) {
			return a == null ? null : a == "true" ? !0 : a == "false" ? !1 : isNaN(Number(a)) || a.length > 5 || a.length == 0 ? a : Number(a)
		}, a.utils.strings.seconds = function(a) {
			a = a.replace(",", ".");
			var b = a.split(":"),
				c = 0;
			return a.substr(-1) == "s" ? c = Number(a.substr(0, a.length - 1)) : a.substr(-1) == "m" ? c = Number(a.substr(0, a.length - 1)) * 60 : a.substr(-1) == "h" ? c = Number(a.substr(0, a.length - 1)) * 3600 : b.length > 1 ? (c = Number(b[b.length - 1]), c += Number(b[b.length - 2]) * 60, b.length == 3 && (c += Number(b[b.length - 3]) * 3600)) : c = Number(a), c
		}, a.utils.strings.xmlAttribute = function(a, b) {
			for (var c = 0; c < a.attributes.length; c++)
				if (a.attributes[c].name && a.attributes[c].name.toLowerCase() == b.toLowerCase())
					return a.attributes[c].value.toString();
			return ""
		}, a.utils.strings.jsonToString = function(b) {
			var c = c || {};
			if (c && c.stringify)
				return c.stringify(b);
			var d = typeof b;
			if (d == "object" && b !== null) {
				var e = [],
					f = b && b.constructor == Array;
				for (var g in b) {
					var h = b[g];
					switch (typeof h) {
						case "string":
							h = '"' + h.replace(/"/g, '\\"') + '"';
							break;
						case "object":
							a.utils.exists(h) && (h = a.utils.strings.jsonToString(h))
					}
					f ? typeof h != "function" && e.push(String(h)) : typeof h != "function" && e.push('"' + g + '":' + String(h))
				}
				return f ? "[" + String(e) + "]" : "{" + String(e) + "}"
			}
			if (d == "string")
				b = '"' + b.replace(/"/g, '\\"') + '"';
			else
				return String(b)
		}
	}(jwplayer),
	function(a) {
		function c(a) {
			var c = ["true", "false", "t", "f"];
			return c.toString().indexOf(a.toLowerCase().replace(" ", "")) >= 0 ? "boolean" : b.test(a) ? "color" : !isNaN(parseInt(a, 10)) && parseInt(a, 10).toString().length == a.length ? "integer" : !isNaN(parseFloat(a)) && parseFloat(a).toString().length == a.length ? "float" : "string"
		}

		function d(b, c) {
			if (!a.utils.exists(c))
				return b;
			switch (c) {
				case "color":
					if (b.length > 0)
						return e(b);
					return null;
				case "integer":
					return parseInt(b, 10);
				case "float":
					return parseFloat(b);
				case "boolean":
					if (b.toLowerCase() == "true")
						return !0;
					if (b == "1")
						return !0;
					return !1
			}
			return b
		}

		function e(a) {
			switch (a.toLowerCase()) {
				case "blue":
					return parseInt("0000FF", 16);
				case "green":
					return parseInt("00FF00", 16);
				case "red":
					return parseInt("FF0000", 16);
				case "cyan":
					return parseInt("00FFFF", 16);
				case "magenta":
					return parseInt("FF00FF", 16);
				case "yellow":
					return parseInt("FFFF00", 16);
				case "black":
					return parseInt("000000", 16);
				case "white":
					return parseInt("FFFFFF", 16);
				default:
					return a = a.replace(/(#|0x)?([0-9A-F]{3,6})$/gi, "$2"), a.length == 3 && (a = a.charAt(0) + a.charAt(0) + a.charAt(1) + a.charAt(1) + a.charAt(2) + a.charAt(2)), parseInt(a, 16)
			}
			return parseInt("000000", 16)
		}
		var b = new RegExp(/^(#|0x)[0-9a-fA-F]{3,6}/);
		a.utils.typechecker = function(b, e) {
			return e = a.utils.exists(e) ? e : c(b), d(b, e)
		}
	}(jwplayer),
	function(a) {
		a.utils.parsers = function() {}, a.utils.parsers.localName = function(a) {
			return a ? a.localName ? a.localName : a.baseName ? a.baseName : "" : ""
		}, a.utils.parsers.textContent = function(a) {
			return a ? a.textContent ? a.textContent : a.text ? a.text : "" : ""
		}
	}(jwplayer),
	function(a) {
		a.utils.parsers.jwparser = function() {}, a.utils.parsers.jwparser.PREFIX = "jwplayer", a.utils.parsers.jwparser.parseEntry = function(b, c) {
			for (var d = 0; d < b.childNodes.length; d++)
				b.childNodes[d].prefix == a.utils.parsers.jwparser.PREFIX && (c[a.utils.parsers.localName(b.childNodes[d])] = a.utils.strings.serialize(a.utils.parsers.textContent(b.childNodes[d])), a.utils.parsers.localName(b.childNodes[d]) == "file" && c.levels && delete c.levels), !c.file && String(c.link).toLowerCase().indexOf("youtube") > -1 && (c.file = c.link);
			return c
		}, a.utils.parsers.jwparser.getProvider = function(b) {
			if (b.type)
				return b.type;
			if (b.file.indexOf("youtube.com/w") > -1 || b.file.indexOf("youtube.com/v") > -1 || b.file.indexOf("youtu.be/") > -1)
				return "youtube";
			if (b.streamer && b.streamer.indexOf("rtmp") == 0)
				return "rtmp";
			if (b.streamer && b.streamer.indexOf("http") == 0)
				return "http";
			var c = a.utils.strings.extension(b.file);
			return extensions.hasOwnProperty(c) ? extensions[c] : ""
		}
	}(jwplayer),
	function(a) {
		a.utils.parsers.mediaparser = function() {}, a.utils.parsers.mediaparser.PREFIX = "media", a.utils.parsers.mediaparser.parseGroup = function(b, c) {
			var d = !1;
			for (var e = 0; e < b.childNodes.length; e++)
				if (b.childNodes[e].prefix == a.utils.parsers.mediaparser.PREFIX) {
					if (!a.utils.parsers.localName(b.childNodes[e]))
						continue;
					switch (a.utils.parsers.localName(b.childNodes[e]).toLowerCase()) {
						case "content":
							d || (c.file = a.utils.strings.xmlAttribute(b.childNodes[e], "url")), a.utils.strings.xmlAttribute(b.childNodes[e], "duration") && (c.duration = a.utils.strings.seconds(a.utils.strings.xmlAttribute(b.childNodes[e], "duration"))), a.utils.strings.xmlAttribute(b.childNodes[e], "start") && (c.start = a.utils.strings.seconds(a.utils.strings.xmlAttribute(b.childNodes[e], "start"))), b.childNodes[e].childNodes && b.childNodes[e].childNodes.length > 0 && (c = a.utils.parsers.mediaparser.parseGroup(b.childNodes[e], c));
							if (a.utils.strings.xmlAttribute(b.childNodes[e], "width") || a.utils.strings.xmlAttribute(b.childNodes[e], "bitrate") || a.utils.strings.xmlAttribute(b.childNodes[e], "url"))
								c.levels || (c.levels = []), c.levels.push({
									width: a.utils.strings.xmlAttribute(b.childNodes[e], "width"),
									bitrate: a.utils.strings.xmlAttribute(b.childNodes[e], "bitrate"),
									file: a.utils.strings.xmlAttribute(b.childNodes[e], "url")
								});
							break;
						case "title":
							c.title = a.utils.parsers.textContent(b.childNodes[e]);
							break;
						case "description":
							c.description = a.utils.parsers.textContent(b.childNodes[e]);
							break;
						case "keywords":
							c.tags = a.utils.parsers.textContent(b.childNodes[e]);
							break;
						case "thumbnail":
							c.image = a.utils.strings.xmlAttribute(b.childNodes[e], "url");
							break;
						case "credit":
							c.author = a.utils.parsers.textContent(b.childNodes[e]);
							break;
						case "player":
							var f = b.childNodes[e].url;
							if (f.indexOf("youtube.com") >= 0 || f.indexOf("youtu.be") >= 0)
								d = !0, c.file = a.utils.strings.xmlAttribute(b.childNodes[e], "url");
							break;
						case "group":
							a.utils.parsers.mediaparser.parseGroup(b.childNodes[e], c)
					}
				}
			return c
		}
	}(jwplayer),
	function(a) {
		function b(b) {
			var c = {};
			for (var d = 0; d < b.childNodes.length; d++) {
				if (!a.utils.parsers.localName(b.childNodes[d]))
					continue;
				switch (a.utils.parsers.localName(b.childNodes[d]).toLowerCase()) {
					case "enclosure":
						c.file = a.utils.strings.xmlAttribute(b.childNodes[d], "url");
						break;
					case "title":
						c.title = a.utils.parsers.textContent(b.childNodes[d]);
						break;
					case "pubdate":
						c.date = a.utils.parsers.textContent(b.childNodes[d]);
						break;
					case "description":
						c.description = a.utils.parsers.textContent(b.childNodes[d]);
						break;
					case "link":
						c.link = a.utils.parsers.textContent(b.childNodes[d]);
						break;
					case "category":
						c.tags ? c.tags += a.utils.parsers.textContent(b.childNodes[d]) : c.tags = a.utils.parsers.textContent(b.childNodes[d])
				}
			}
			return c = a.utils.parsers.mediaparser.parseGroup(b, c), c = a.utils.parsers.jwparser.parseEntry(b, c), new a.html5.playlistitem(c)
		}
		a.utils.parsers.rssparser = function() {}, a.utils.parsers.rssparser.parse = function(c) {
			var d = [];
			for (var e = 0; e < c.childNodes.length; e++)
				if (a.utils.parsers.localName(c.childNodes[e]).toLowerCase() == "channel")
					for (var f = 0; f < c.childNodes[e].childNodes.length; f++)
						a.utils.parsers.localName(c.childNodes[e].childNodes[f]).toLowerCase() == "item" && d.push(b(c.childNodes[e].childNodes[f]));
			return d
		}
	}(jwplayer),
	function(a) {
		var b = {}, c = {};
		a.plugins = function() {}, a.plugins.loadPlugins = function(d, e) {
			return c[d] = new a.plugins.pluginloader(new a.plugins.model(b), e), c[d]
		}, a.plugins.registerPlugin = function(d, e, f) {
			var g = a.utils.getPluginName(d);
			if (b[g])
				b[g].registerPlugin(d, e, f);
			else {
				a.utils.log("A plugin (" + d + ") was registered with the player that was not loaded. Please check your configuration.");
				for (var h in c)
					c[h].pluginFailed()
			}
		}
	}(jwplayer),
	function(a) {
		a.plugins.model = function(b) {
			this.addPlugin = function(c) {
				var d = a.utils.getPluginName(c);
				return b[d] || (b[d] = new a.plugins.plugin(c)), b[d]
			}
		}
	}(jwplayer),
	function(a) {
		a.plugins.pluginmodes = {
			FLASH: "FLASH",
			JAVASCRIPT: "JAVASCRIPT",
			HYBRID: "HYBRID"
		}, a.plugins.plugin = function(b) {
			function i() {
				switch (a.utils.getPluginPathType(b)) {
					case a.utils.pluginPathType.ABSOLUTE:
						return b;
					case a.utils.pluginPathType.RELATIVE:
						return a.utils.getAbsolutePath(b, window.location.href);
					case a.utils.pluginPathType.CDN:
						var d = a.utils.getPluginName(b),
							e = a.utils.getPluginVersion(b),
							f = window.location.href.indexOf("https://") == 0 ? c.replace("http://", "https://secure") : c;
						return f + "/" + a.version.split(".")[0] + "/" + d + "/" + d + (e !== "" ? "-" + e : "") + ".js"
				}
			}

			function j(b) {
				g = setTimeout(function() {
					d = a.utils.loaderstatus.COMPLETE, h.sendEvent(a.events.COMPLETE)
				}, 1e3)
			}

			function k(b) {
				d = a.utils.loaderstatus.ERROR, h.sendEvent(a.events.ERROR)
			}
			var c = "http://lp.longtailvideo.com",
				d = a.utils.loaderstatus.NEW,
				e, f, g, h = new a.events.eventdispatcher;
			a.utils.extend(this, h), this.load = function() {
				if (d == a.utils.loaderstatus.NEW) {
					if (b.lastIndexOf(".swf") > 0) {
						e = b, d = a.utils.loaderstatus.COMPLETE, h.sendEvent(a.events.COMPLETE);
						return
					}
					d = a.utils.loaderstatus.LOADING;
					var c = new a.utils.scriptloader(i());
					c.addEventListener(a.events.COMPLETE, j), c.addEventListener(a.events.ERROR, k), c.load()
				}
			}, this.registerPlugin = function(b, c, i) {
				g && (clearTimeout(g), g = undefined), c && i ? (e = i, f = c) : typeof c == "string" ? e = c : typeof c == "function" ? f = c : !c && !i && (e = b), d = a.utils.loaderstatus.COMPLETE, h.sendEvent(a.events.COMPLETE)
			}, this.getStatus = function() {
				return d
			}, this.getPluginName = function() {
				return a.utils.getPluginName(b)
			}, this.getFlashPath = function() {
				if (e)
					switch (a.utils.getPluginPathType(e)) {
						case a.utils.pluginPathType.ABSOLUTE:
							return e;
						case a.utils.pluginPathType.RELATIVE:
							if (b.lastIndexOf(".swf") > 0)
								return a.utils.getAbsolutePath(e, window.location.href);
							return a.utils.getAbsolutePath(e, i());
						case a.utils.pluginPathType.CDN:
							if (e.indexOf("-") > -1)
								return e + "h";
							return e + "-h"
				}
				return null
			}, this.getJS = function() {
				return f
			}, this.getPluginmode = function() {
				if (typeof e != "undefined" && typeof f != "undefined")
					return a.plugins.pluginmodes.HYBRID;
				if (typeof e != "undefined")
					return a.plugins.pluginmodes.FLASH;
				if (typeof f != "undefined")
					return a.plugins.pluginmodes.JAVASCRIPT
			}, this.getNewInstance = function(a, b, c) {
				return new f(a, b, c)
			}, this.getURL = function() {
				return b
			}
		}
	}(jwplayer),
	function(a) {
		a.plugins.pluginloader = function(b, c) {
			function i() {
				g || (g = !0, e = a.utils.loaderstatus.COMPLETE, h.sendEvent(a.events.COMPLETE))
			}

			function j() {
				if (!g) {
					var b = 0;
					for (plugin in d) {
						var c = d[plugin].getStatus();
						(c == a.utils.loaderstatus.LOADING || c == a.utils.loaderstatus.NEW) && b++
					}
					b == 0 && i()
				}
			}
			var d = {}, e = a.utils.loaderstatus.NEW,
				f = !1,
				g = !1,
				h = new a.events.eventdispatcher;
			a.utils.extend(this, h), this.setupPlugins = function(a, b, c) {
				var e = {
					length: 0,
					plugins: {}
				}, f = {
						length: 0,
						plugins: {}
					};
				for (var g in d) {
					var h = d[g].getPluginName();
					d[g].getFlashPath() && (e.plugins[d[g].getFlashPath()] = b.plugins[g], e.plugins[d[g].getFlashPath()].pluginmode = d[g].getPluginmode(), e.length++);
					if (d[g].getJS()) {
						var i = document.createElement("div");
						i.id = a.id + "_" + h, i.style.position = "absolute", i.style.zIndex = f.length + 10, f.plugins[h] = d[g].getNewInstance(a, b.plugins[g], i), f.length++, typeof f.plugins[h].resize != "undefined" && (a.onReady(c(f.plugins[h], i, !0)), a.onResize(c(f.plugins[h], i)))
					}
				}
				return a.plugins = f.plugins, e
			}, this.load = function() {
				e = a.utils.loaderstatus.LOADING, f = !0;
				for (var g in c)
					a.utils.exists(g) && (d[g] = b.addPlugin(g), d[g].addEventListener(a.events.COMPLETE, j), d[g].addEventListener(a.events.ERROR, j));
				for (g in d)
					d[g].load();
				f = !1, j()
			}, this.pluginFailed = function() {
				i()
			}, this.getStatus = function() {
				return e
			}
		}
	}(jwplayer),
	function(a) {
		var b = [];
		a.api = function(b) {
			function n(a, b) {
				return function(c, d, e, f) {
					if (a.renderingMode == "flash" || a.renderingMode == "html5") {
						var h;
						d ? (m[c] = d, h = "jwplayer('" + a.id + "').callback('" + c + "')") : !d && m[c] && delete m[c], g.jwDockSetButton(c, h, e, f)
					}
					return b
				}
			}

			function o(b) {
				i = [], a.utils.getOuterHTML(b.container) != k && a.api.destroyPlayer(b.id, k)
			}

			function p(a) {
				return function(b) {
					var c = b.newstate,
						e = b.oldstate;
					if (c == a) {
						var f = d[c];
						if (f)
							for (var g = 0; g < f.length; g++)
								typeof f[g] == "function" && f[g].call(this, {
									oldstate: e,
									newstate: c
								})
					}
				}
			}

			function q(a, b) {
				return function(c) {
					if (a == c.component) {
						var d = e[a][b];
						if (d)
							for (var f = 0; f < d.length; f++)
								typeof d[f] == "function" && d[f].call(this, c)
					}
				}
			}

			function r(a, b, c) {
				var d = [];
				b || (b = 0), c || (c = a.length - 1);
				for (var e = b; e <= c; e++)
					d.push(a[e]);
				return d
			}
			this.container = b, this.id = b.id;
			var c = {}, d = {}, e = {}, f = [],
				g = undefined,
				h = !1,
				i = [],
				j = undefined,
				k = a.utils.getOuterHTML(b),
				l = {}, m = {};
			return this.getBuffer = function() {
				return this.callInternal("jwGetBuffer")
			}, this.getContainer = function() {
				return this.container
			}, this.getPlugin = function(b) {
				var c = this,
					d = {};
				return b == "dock" ? a.utils.extend(d, {
					setButton: n(c, d),
					show: function() {
						return c.callInternal("jwDockShow"), d
					},
					hide: function() {
						return c.callInternal("jwDockHide"), d
					},
					onShow: function(b) {
						return c.componentListener("dock", a.api.events.JWPLAYER_COMPONENT_SHOW, b), d
					},
					onHide: function(b) {
						return c.componentListener("dock", a.api.events.JWPLAYER_COMPONENT_HIDE, b), d
					}
				}) : b == "controlbar" ? a.utils.extend(d, {
					show: function() {
						return c.callInternal("jwControlbarShow"), d
					},
					hide: function() {
						return c.callInternal("jwControlbarHide"), d
					},
					onShow: function(b) {
						return c.componentListener("controlbar", a.api.events.JWPLAYER_COMPONENT_SHOW, b), d
					},
					onHide: function(b) {
						return c.componentListener("controlbar", a.api.events.JWPLAYER_COMPONENT_HIDE, b), d
					}
				}) : b == "display" ? a.utils.extend(d, {
					show: function() {
						return c.callInternal("jwDisplayShow"), d
					},
					hide: function() {
						return c.callInternal("jwDisplayHide"), d
					},
					onShow: function(b) {
						return c.componentListener("display", a.api.events.JWPLAYER_COMPONENT_SHOW, b), d
					},
					onHide: function(b) {
						return c.componentListener("display", a.api.events.JWPLAYER_COMPONENT_HIDE, b), d
					}
				}) : this.plugins[b]
			}, this.callback = function(a) {
				if (m[a])
					return m[a]()
			}, this.getDuration = function() {
				return this.callInternal("jwGetDuration")
			}, this.getFullscreen = function() {
				return this.callInternal("jwGetFullscreen")
			}, this.getHeight = function() {
				return this.callInternal("jwGetHeight")
			}, this.getLockState = function() {
				return this.callInternal("jwGetLockState")
			}, this.getMeta = function() {
				return this.getItemMeta()
			}, this.getMute = function() {
				return this.callInternal("jwGetMute")
			}, this.getPlaylist = function() {
				var b = this.callInternal("jwGetPlaylist");
				this.renderingMode == "flash" && a.utils.deepReplaceKeyName(b, ["__dot__", "__spc__", "__dsh__"], [".", " ", "-"]);
				for (var c = 0; c < b.length; c++)
					a.utils.exists(b[c].index) || (b[c].index = c);
				return b
			}, this.getPlaylistItem = function(b) {
				return a.utils.exists(b) || (b = this.getCurrentItem()), this.getPlaylist()[b]
			}, this.getPosition = function() {
				return this.callInternal("jwGetPosition")
			}, this.getRenderingMode = function() {
				return this.renderingMode
			}, this.getState = function() {
				return this.callInternal("jwGetState")
			}, this.getVolume = function() {
				return this.callInternal("jwGetVolume")
			}, this.getWidth = function() {
				return this.callInternal("jwGetWidth")
			}, this.setFullscreen = function(b) {
				return a.utils.exists(b) ? this.callInternal("jwSetFullscreen", b) : this.callInternal("jwSetFullscreen", !this.callInternal("jwGetFullscreen")), this
			}, this.setMute = function(b) {
				return a.utils.exists(b) ? this.callInternal("jwSetMute", b) : this.callInternal("jwSetMute", !this.callInternal("jwGetMute")), this
			}, this.lock = function() {
				return this
			}, this.unlock = function() {
				return this
			}, this.load = function(a) {
				return this.callInternal("jwLoad", a), this
			}, this.playlistItem = function(a) {
				return this.callInternal("jwPlaylistItem", a), this
			}, this.playlistPrev = function() {
				return this.callInternal("jwPlaylistPrev"), this
			}, this.playlistNext = function() {
				return this.callInternal("jwPlaylistNext"), this
			}, this.resize = function(a, b) {
				if (this.renderingMode == "html5")
					g.jwResize(a, b);
				else {
					this.container.width = a, this.container.height = b;
					var c = document.getElementById(this.id + "_wrapper");
					c && (c.style.width = a + "px", c.style.height = b + "px")
				}
				return this
			}, this.play = function(b) {
				return typeof b == "undefined" ? (b = this.getState(), b == a.api.events.state.PLAYING || b == a.api.events.state.BUFFERING ? this.callInternal("jwPause") : this.callInternal("jwPlay")) : this.callInternal("jwPlay", b), this
			}, this.pause = function(b) {
				return typeof b == "undefined" ? (b = this.getState(), b == a.api.events.state.PLAYING || b == a.api.events.state.BUFFERING ? this.callInternal("jwPause") : this.callInternal("jwPlay")) : this.callInternal("jwPause", b), this
			}, this.stop = function() {
				return this.callInternal("jwStop"), this
			}, this.seek = function(a) {
				return this.callInternal("jwSeek", a), this
			}, this.setVolume = function(a) {
				return this.callInternal("jwSetVolume", a), this
			}, this.loadInstream = function(b, c) {
				return j = new a.api.instream(this, g, b, c), j
			}, this.onBufferChange = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_BUFFER, b)
			}, this.onBufferFull = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL, b)
			}, this.onError = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_ERROR, b)
			}, this.onFullscreen = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_FULLSCREEN, b)
			}, this.onMeta = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_META, b)
			}, this.onMute = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_MUTE, b)
			}, this.onPlaylist = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, b)
			}, this.onPlaylistItem = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, b)
			}, this.onReady = function(b) {
				return this.eventListener(a.api.events.API_READY, b)
			}, this.onResize = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_RESIZE, b)
			}, this.onComplete = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, b)
			}, this.onSeek = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_SEEK, b)
			}, this.onTime = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_TIME, b)
			}, this.onVolume = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_VOLUME, b)
			}, this.onBeforePlay = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_BEFOREPLAY, b)
			}, this.onBeforeComplete = function(b) {
				return this.eventListener(a.api.events.JWPLAYER_MEDIA_BEFORECOMPLETE, b)
			}, this.onBuffer = function(b) {
				return this.stateListener(a.api.events.state.BUFFERING, b)
			}, this.onPause = function(b) {
				return this.stateListener(a.api.events.state.PAUSED, b)
			}, this.onPlay = function(b) {
				return this.stateListener(a.api.events.state.PLAYING, b)
			}, this.onIdle = function(b) {
				return this.stateListener(a.api.events.state.IDLE, b)
			}, this.remove = function() {
				if (!h)
					throw "Cannot call remove() before player is ready";
				o(this)
			}, this.setup = function(b) {
				if (a.embed) {
					var c = this.id;
					o(this);
					var d = a(c);
					return d.config = b, new a.embed(d)
				}
				return this
			}, this.registerPlugin = function(b, c, d) {
				a.plugins.registerPlugin(b, c, d)
			}, this.setPlayer = function(a, b) {
				g = a, this.renderingMode = b
			}, this.stateListener = function(b, c) {
				return d[b] || (d[b] = [], this.eventListener(a.api.events.JWPLAYER_PLAYER_STATE, p(b))), d[b].push(c), this
			}, this.detachMedia = function() {
				if (this.renderingMode == "html5")
					return this.callInternal("jwDetachMedia")
			}, this.attachMedia = function() {
				if (this.renderingMode == "html5")
					return this.callInternal("jwAttachMedia")
			}, this.componentListener = function(a, b, c) {
				return e[a] || (e[a] = {}), e[a][b] || (e[a][b] = [], this.eventListener(b, q(a, b))), e[a][b].push(c), this
			}, this.addInternalListener = function(b, c) {
				try {
					b.jwAddEventListener(c, 'function(dat) { jwplayer("' + this.id + '").dispatchEvent("' + c + '", dat); }')
				} catch (d) {
					a.utils.log("Could not add internal listener")
				}
			}, this.eventListener = function(a, b) {
				return c[a] || (c[a] = [], g && h && this.addInternalListener(g, a)), c[a].push(b), this
			}, this.dispatchEvent = function(a) {
				if (c[a]) {
					var b = _utils.translateEventResponse(a, arguments[1]);
					for (var d = 0; d < c[a].length; d++)
						typeof c[a][d] == "function" && c[a][d].call(this, b)
				}
			}, this.dispatchInstreamEvent = function(a) {
				j && j.dispatchEvent(a, arguments)
			}, this.callInternal = function() {
				if (h) {
					var a = arguments[0],
						b = [];
					for (var c = 1; c < arguments.length; c++)
						b.push(arguments[c]);
					return typeof g != "undefined" && typeof g[a] == "function" ? b.length == 2 ? g[a](b[0], b[1]) : b.length == 1 ? g[a](b[0]) : g[a]() : null
				}
				i.push(arguments)
			}, this.playerReady = function(b) {
				h = !0, g || this.setPlayer(document.getElementById(b.id)), this.container = document.getElementById(this.id);
				for (var d in c)
					this.addInternalListener(g, d);
				this.eventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, function(a) {
					l = {}
				}), this.eventListener(a.api.events.JWPLAYER_MEDIA_META, function(b) {
					a.utils.extend(l, b.metadata)
				}), this.dispatchEvent(a.api.events.API_READY);
				while (i.length > 0)
					this.callInternal.apply(this, i.shift())
			}, this.getItemMeta = function() {
				return l
			}, this.getCurrentItem = function() {
				return this.callInternal("jwGetPlaylistIndex")
			}, this
		}, a.api.selectPlayer = function(b) {
			var c;
			a.utils.exists(b) || (b = 0), b.nodeType ? c = b : typeof b == "string" && (c = document.getElementById(b));
			if (c) {
				var d = a.api.playerById(c.id);
				return d ? d : a.api.addPlayer(new a.api(c))
			}
			return typeof b == "number" ? a.getPlayers()[b] : null
		}, a.api.events = {
			API_READY: "jwplayerAPIReady",
			JWPLAYER_READY: "jwplayerReady",
			JWPLAYER_FULLSCREEN: "jwplayerFullscreen",
			JWPLAYER_RESIZE: "jwplayerResize",
			JWPLAYER_ERROR: "jwplayerError",
			JWPLAYER_MEDIA_BEFOREPLAY: "jwplayerMediaBeforePlay",
			JWPLAYER_MEDIA_BEFORECOMPLETE: "jwplayerMediaBeforeComplete",
			JWPLAYER_COMPONENT_SHOW: "jwplayerComponentShow",
			JWPLAYER_COMPONENT_HIDE: "jwplayerComponentHide",
			JWPLAYER_MEDIA_BUFFER: "jwplayerMediaBuffer",
			JWPLAYER_MEDIA_BUFFER_FULL: "jwplayerMediaBufferFull",
			JWPLAYER_MEDIA_ERROR: "jwplayerMediaError",
			JWPLAYER_MEDIA_LOADED: "jwplayerMediaLoaded",
			JWPLAYER_MEDIA_COMPLETE: "jwplayerMediaComplete",
			JWPLAYER_MEDIA_SEEK: "jwplayerMediaSeek",
			JWPLAYER_MEDIA_TIME: "jwplayerMediaTime",
			JWPLAYER_MEDIA_VOLUME: "jwplayerMediaVolume",
			JWPLAYER_MEDIA_META: "jwplayerMediaMeta",
			JWPLAYER_MEDIA_MUTE: "jwplayerMediaMute",
			JWPLAYER_PLAYER_STATE: "jwplayerPlayerState",
			JWPLAYER_PLAYLIST_LOADED: "jwplayerPlaylistLoaded",
			JWPLAYER_PLAYLIST_ITEM: "jwplayerPlaylistItem",
			JWPLAYER_INSTREAM_CLICK: "jwplayerInstreamClicked",
			JWPLAYER_INSTREAM_DESTROYED: "jwplayerInstreamDestroyed"
		}, a.api.events.state = {
			BUFFERING: "BUFFERING",
			IDLE: "IDLE",
			PAUSED: "PAUSED",
			PLAYING: "PLAYING"
		}, a.api.playerById = function(a) {
			for (var c = 0; c < b.length; c++)
				if (b[c].id == a)
					return b[c];
			return null
		}, a.api.addPlayer = function(a) {
			for (var c = 0; c < b.length; c++)
				if (b[c] == a)
					return a;
			return b.push(a), a
		}, a.api.destroyPlayer = function(c, d) {
			var e = -1;
			for (var f = 0; f < b.length; f++)
				if (b[f].id == c) {
					e = f;
					continue
				}
			if (e >= 0) {
				try {
					b[e].callInternal("jwDestroy")
				} catch (g) {}
				var h = document.getElementById(b[e].id);
				document.getElementById(b[e].id + "_wrapper") && (h = document.getElementById(b[e].id + "_wrapper"));
				if (h)
					if (d)
						a.utils.setOuterHTML(h, d);
					else {
						var i = document.createElement("div"),
							j = h.id;
						h.id.indexOf("_wrapper") == h.id.length - 8 && (newID = h.id.substring(0, h.id.length - 8)), i.setAttribute("id", j), h.parentNode.replaceChild(i, h)
					}
				b.splice(e, 1)
			}
			return null
		}, a.getPlayers = function() {
			return b.slice(0)
		}
	}(jwplayer);
	var _userPlayerReady = typeof playerReady == "function" ? playerReady : undefined;
	playerReady = function(a) {
		var b = jwplayer.api.playerById(a.id);
		b ? b.playerReady(a) : jwplayer.api.selectPlayer(a.id).playerReady(a), _userPlayerReady && _userPlayerReady.call(this, a)
	},
	function(a) {
		a.api.instream = function(b, c, d, e) {
			function l() {
				f.callInternal("jwLoadInstream", d, e)
			}

			function m(a, b) {
				g.jwInstreamAddEventListener(b, 'function(dat) { jwplayer("' + f.id + '").dispatchInstreamEvent("' + b + '", dat); }')
			}

			function n(a, b) {
				return j[a] || (j[a] = [], m(g, a)), j[a].push(b), this
			}

			function o(b, c) {
				return k[b] || (k[b] = [], n(a.api.events.JWPLAYER_PLAYER_STATE, p(b))), k[b].push(c), this
			}

			function p(a) {
				return function(b) {
					var c = b.newstate,
						d = b.oldstate;
					if (c == a) {
						var e = k[c];
						if (e)
							for (var f = 0; f < e.length; f++)
								typeof e[f] == "function" && e[f].call(this, {
									oldstate: d,
									newstate: c,
									type: b.type
								})
					}
				}
			}
			var f = b,
				g = c,
				h = d,
				i = e,
				j = {}, k = {};
			this.dispatchEvent = function(a, b) {
				if (j[a]) {
					var c = _utils.translateEventResponse(a, b[1]);
					for (var d = 0; d < j[a].length; d++)
						typeof j[a][d] == "function" && j[a][d].call(this, c)
				}
			}, this.onError = function(b) {
				return n(a.api.events.JWPLAYER_ERROR, b)
			}, this.onFullscreen = function(b) {
				return n(a.api.events.JWPLAYER_FULLSCREEN, b)
			}, this.onMeta = function(b) {
				return n(a.api.events.JWPLAYER_MEDIA_META, b)
			}, this.onMute = function(b) {
				return n(a.api.events.JWPLAYER_MEDIA_MUTE, b)
			}, this.onComplete = function(b) {
				return n(a.api.events.JWPLAYER_MEDIA_COMPLETE, b)
			}, this.onSeek = function(b) {
				return n(a.api.events.JWPLAYER_MEDIA_SEEK, b)
			}, this.onTime = function(b) {
				return n(a.api.events.JWPLAYER_MEDIA_TIME, b)
			}, this.onVolume = function(b) {
				return n(a.api.events.JWPLAYER_MEDIA_VOLUME, b)
			}, this.onBuffer = function(b) {
				return o(a.api.events.state.BUFFERING, b)
			}, this.onPause = function(b) {
				return o(a.api.events.state.PAUSED, b)
			}, this.onPlay = function(b) {
				return o(a.api.events.state.PLAYING, b)
			}, this.onIdle = function(b) {
				return o(a.api.events.state.IDLE, b)
			}, this.onInstreamClick = function(b) {
				return n(a.api.events.JWPLAYER_INSTREAM_CLICK, b)
			}, this.onInstreamDestroyed = function(b) {
				return n(a.api.events.JWPLAYER_INSTREAM_DESTROYED, b)
			}, this.play = function(a) {
				g.jwInstreamPlay(a)
			}, this.pause = function(a) {
				g.jwInstreamPause(a)
			}, this.seek = function(a) {
				g.jwInstreamSeek(a)
			}, this.destroy = function() {
				g.jwInstreamDestroy()
			}, this.getState = function() {
				return g.jwInstreamGetState()
			}, this.getDuration = function() {
				return g.jwInstreamGetDuration()
			}, this.getPosition = function() {
				return g.jwInstreamGetPosition()
			}, l()
		}
	}(jwplayer),
	function(a) {
		function c() {
			if (!document.body)
				return setTimeout(c, 15);
			var d = b.selectors.getElementsByTagAndClass("video", "jwplayer");
			for (var e = 0; e < d.length; e++) {
				var f = d[e];
				f.id == "" && (f.id = "jwplayer_" + Math.round(Math.random() * 1e5)), a(f.id).setup({})
			}
		}
		var b = a.utils;
		a.embed = function(c) {
			function h(a, b) {
				for (var c in b)
					typeof a[c] == "function" && a[c].call(a, b[c])
			}

			function i() {
				if (g.getStatus() == b.loaderstatus.COMPLETE) {
					for (var d = 0; d < f.modes.length; d++)
						if (f.modes[d].type && a.embed[f.modes[d].type]) {
							var e = f.modes[d].config,
								i = f;
							if (e) {
								i = b.extend(b.clone(f), e);
								var k = ["file", "levels", "playlist"];
								for (var l = 0; l < k.length; l++) {
									var m = k[l];
									if (b.exists(e[m]))
										for (var n = 0; n < k.length; n++)
											if (n != l) {
												var o = k[n];
												b.exists(i[o]) && !b.exists(e[o]) && delete i[o]
											}
								}
							}
							var p = new a.embed[f.modes[d].type](document.getElementById(c.id), f.modes[d], i, g, c);
							if (p.supportsConfig())
								return p.embed(), h(c, f.events), c
						}
					b.log("No suitable players found"), new a.embed.logo(b.extend({
						hide: !0
					}, f.components.logo), "none", c.id)
				}
			}
			var d = {
				width: 400,
				height: 300,
				components: {
					controlbar: {
						position: "over"
					}
				}
			}, e = b.mediaparser.parseMedia(c.container),
				f = new a.embed.config(b.extend(d, e, c.config), this),
				g = a.plugins.loadPlugins(c.id, f.plugins);
			return g.addEventListener(a.events.COMPLETE, i), g.addEventListener(a.events.ERROR, i), g.load(), c
		}, c()
	}(jwplayer),
	function(a) {
		function c(a) {
			var c = [{
					type: "flash",
					src: a ? a : "/jwplayer/player.swf"
				}, {
					type: "html5"
				}, {
					type: "download"
				}
			];
			return b.isAndroid() && (c[0] = c.splice(1, 1, c[0])[0]), c
		}

		function e(a) {
			var b = a.toLowerCase(),
				c = ["left", "right", "top", "bottom"];
			for (var d = 0; d < c.length; d++)
				if (b == c[d])
					return !0;
			return !1
		}

		function f(a) {
			var b = !1;
			return b = a instanceof Array || typeof a == "object" && !a.position && !a.size, b
		}

		function g(a) {
			if (typeof a == "string")
				if (parseInt(a).toString() == a || a.toLowerCase().indexOf("px") > -1)
					return parseInt(a);
			return a
		}

		function i(a) {
			var c = {};
			switch (b.typeOf(a.plugins)) {
				case "object":
					for (var d in a.plugins)
						c[b.getPluginName(d)] = d;
					break;
				case "string":
					var e = a.plugins.split(",");
					for (var f = 0; f < e.length; f++)
						c[b.getPluginName(e[f])] = e[f]
			}
			return c
		}

		function j(a, c, d, e) {
			b.typeOf(a[c]) != "object" && (a[c] = {});
			var f = a[c][d];
			b.typeOf(f) != "object" && (a[c][d] = f = {});
			if (e)
				if (c == "plugins") {
					var g = b.getPluginName(d);
					f[e] = a[g + "." + e], delete a[g + "." + e]
				} else
					f[e] = a[d + "." + e], delete a[d + "." + e]
		}
		var b = a.utils,
			d = {
				players: "modes",
				autoplay: "autostart"
			}, h = ["playlist", "dock", "controlbar", "logo", "display"];
		a.embed.deserialize = function(a) {
			var c = i(a);
			for (var d in c)
				j(a, "plugins", c[d]);
			for (var e in a)
				if (e.indexOf(".") > -1) {
					var f = e.split("."),
						g = f[0],
						e = f[1];
					b.isInArray(h, g) ? j(a, "components", g, e) : c[g] && j(a, "plugins", c[g], e)
				}
			return a
		}, a.embed.config = function(e, i) {
			var j = b.extend({}, e),
				l;
			f(j.playlist) && (l = j.playlist, delete j.playlist), j = a.embed.deserialize(j), j.height = g(j.height), j.width = g(j.width);
			if (typeof j.plugins == "string") {
				var m = j.plugins.split(",");
				typeof j.plugins != "object" && (j.plugins = {});
				for (var n = 0; n < m.length; n++) {
					var o = b.getPluginName(m[n]);
					typeof j[o] == "object" ? (j.plugins[m[n]] = j[o], delete j[o]) : j.plugins[m[n]] = {}
				}
			}
			for (var p = 0; p < h.length; p++) {
				var q = h[p];
				b.exists(j[q]) && (typeof j[q] != "object" ? (j.components[q] || (j.components[q] = {}), q == "logo" ? j.components[q].file = j[q] : j.components[q].position = j[q], delete j[q]) : (j.components[q] || (j.components[q] = {}), b.extend(j.components[q], j[q]), delete j[q])), typeof j[q + "size"] != "undefined" && (j.components[q] || (j.components[q] = {}), j.components[q].size = j[q + "size"], delete j[q + "size"])
			}
			typeof j.icons != "undefined" && (j.components.display || (j.components.display = {}), j.components.display.icons = j.icons, delete j.icons);
			for (var r in d)
				j[r] && (j[d[r]] || (j[d[r]] = j[r]), delete j[r]);
			var s;
			return j.flashplayer && !j.modes ? (s = c(j.flashplayer), delete j.flashplayer) : j.modes ? (typeof j.modes == "string" ? s = c(j.modes) : j.modes instanceof Array ? s = j.modes : typeof j.modes == "object" && j.modes.type && (s = [j.modes]), delete j.modes) : s = c(), j.modes = s, l && (j.playlist = l), j
		}
	}(jwplayer),
	function(a) {
		a.embed.download = function(b, c, d, e, f) {
			function g(b, c, d) {
				if (d)
					return !1;
				var e = ["image", "sound", "youtube", "http"];
				if (c && e.toString().indexOf(c) > -1)
					return !0;
				if (!c || c && c == "video") {
					var f = a.utils.extension(b);
					if (f && a.utils.extensionmap[f])
						return !0
				}
				return !1
			}
			this.embed = function() {
				function o(a) {
					_imageWidth = e.display_image.naturalWidth, _imageHeight = e.display_image.naturalHeight, p()
				}

				function p() {
					a.utils.stretch(a.utils.stretching.UNIFORM, e.display_image, g, h, _imageWidth, _imageHeight)
				}
				var c = a.utils.extend({}, d),
					e = {}, g = d.width ? d.width : 480;
				typeof g != "number" && (g = parseInt(g, 10));
				var h = d.height ? d.height : 320;
				typeof h != "number" && (h = parseInt(h, 10));
				var i, j, k, l = {};
				d.playlist && d.playlist.length ? (l.file = d.playlist[0].file, j = d.playlist[0].image, l.levels = d.playlist[0].levels) : (l.file = d.file, j = d.image, l.levels = d.levels), l.file ? i = l.file : l.levels && l.levels.length && (i = l.levels[0].file), k = i ? "pointer" : "auto";
				var m = {
					display: {
						style: {
							cursor: k,
							width: g,
							height: h,
							backgroundColor: "#000",
							position: "relative",
							textDecoration: "none",
							border: "none",
							display: "block"
						}
					},
					display_icon: {
						style: {
							cursor: k,
							position: "absolute",
							display: i ? "block" : "none",
							top: 0,
							left: 0,
							border: 0,
							margin: 0,
							padding: 0,
							zIndex: 3,
							width: 50,
							height: 50,
							backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg==)"
						}
					},
					display_iconBackground: {
						style: {
							cursor: k,
							position: "absolute",
							display: i ? "block" : "none",
							top: (h - 50) / 2,
							left: (g - 50) / 2,
							border: 0,
							width: 50,
							height: 50,
							margin: 0,
							padding: 0,
							zIndex: 2,
							backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC)"
						}
					},
					display_image: {
						style: {
							width: g,
							height: h,
							display: j ? "block" : "none",
							position: "absolute",
							cursor: k,
							left: 0,
							top: 0,
							margin: 0,
							padding: 0,
							textDecoration: "none",
							zIndex: 1,
							border: "none"
						}
					}
				}, n = function(c, d, e) {
						var f = document.createElement(c);
						return e ? f.id = e : f.id = b.id + "_jwplayer_" + d, a.utils.css(f, m[d].style), f
					};
				e.display = n("a", "display", b.id), i && e.display.setAttribute("href", a.utils.getAbsolutePath(i)), e.display_image = n("img", "display_image"), e.display_image.setAttribute("alt", "Click to download..."), j && e.display_image.setAttribute("src", a.utils.getAbsolutePath(j)), e.display_icon = n("div", "display_icon"), e.display_iconBackground = n("div", "display_iconBackground"), e.display.appendChild(e.display_image), e.display_iconBackground.appendChild(e.display_icon), e.display.appendChild(e.display_iconBackground), _css = a.utils.css, _hide = function(a) {
					_css(a, {
						display: "none"
					})
				}, e.display_image.onerror = function(a) {
					_hide(e.display_image)
				}, e.display_image.onload = o, b.parentNode.replaceChild(e.display, b);
				var q = d.plugins && d.plugins.logo ? d.plugins.logo : {};
				e.display.appendChild(new a.embed.logo(d.components.logo, "download", b.id)), f.container = document.getElementById(f.id), f.setPlayer(e.display, "download")
			}, this.supportsConfig = function() {
				if (!d)
					return !0;
				var b = a.utils.getFirstPlaylistItemFromConfig(d);
				if (typeof b.file == "undefined" && typeof b.levels == "undefined")
					return !0;
				if (b.file)
					return g(b.file, b.provider, b.playlistfile);
				if (b.levels && b.levels.length)
					for (var c = 0; c < b.levels.length; c++)
						if (b.levels[c].file && g(b.levels[c].file, b.provider, b.playlistfile))
							return !0
			}
		}
	}(jwplayer),
	function(a) {
		a.embed.flash = function(b, c, d, e, f) {
			function g(a, b, c) {
				var d = document.createElement("param");
				d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d)
			}

			function h(b, c, d) {
				return function(e) {
					d && document.getElementById(f.id + "_wrapper").appendChild(c);
					var g = document.getElementById(f.id).getPluginConfig("display");
					b.resize(g.width, g.height);
					var h = {
						left: g.x,
						top: g.y
					};
					a.utils.css(c, h)
				}
			}

			function i(a) {
				if (!a)
					return {};
				var b = {};
				for (var c in a) {
					var d = a[c];
					for (var e in d)
						b[c + "." + e] = d[e]
				}
				return b
			}

			function j(a, b) {
				if (a[b]) {
					var c = a[b];
					for (var d in c) {
						var e = c[d];
						if (typeof e == "string")
							a[d] || (a[d] = e);
						else
							for (var f in e)
								a[d + "." + f] || (a[d + "." + f] = e[f])
					}
					delete a[b]
				}
			}

			function k(b) {
				if (!b)
					return {};
				var c = {}, d = [];
				for (var e in b) {
					var f = a.utils.getPluginName(e),
						g = b[e];
					d.push(e);
					for (var h in g)
						c[f + "." + h] = g[h]
				}
				return c.plugins = d.join(","), c
			}

			function l(b) {
				var c = b.netstreambasepath ? "" : "netstreambasepath=" + encodeURIComponent(window.location.href.split("#")[0]) + "&";
				for (var d in b)
					typeof b[d] == "object" ? c += d + "=" + encodeURIComponent("[[JSON]]" + a.utils.strings.jsonToString(b[d])) + "&" : c += d + "=" + encodeURIComponent(b[d]) + "&";
				return c.substring(0, c.length - 1)
			}
			this.embed = function() {
				d.id = f.id;
				var i, n = a.utils.extend({}, d),
					o = n.width,
					p = n.height;
				b.id + "_wrapper" == b.parentNode.id ? i = document.getElementById(b.id + "_wrapper") : (i = document.createElement("div"), i.id = b.id + "_wrapper", a.utils.wrap(b, i), a.utils.css(i, {
					position: "relative",
					width: o,
					height: p
				}));
				var q = e.setupPlugins(f, n, h);
				q.length > 0 ? a.utils.extend(n, k(q.plugins)) : delete n.plugins;
				var r = ["height", "width", "modes", "events"];
				for (var s = 0; s < r.length; s++)
					delete n[r[s]];
				var t = "opaque";
				n.wmode && (t = n.wmode), j(n, "components"), j(n, "providers"), typeof n["dock.position"] != "undefined" && n["dock.position"].toString().toLowerCase() == "false" && (n.dock = n["dock.position"], delete n["dock.position"]);
				var u = a.utils.getCookies();
				for (var v in u)
					typeof n[v] == "undefined" && (n[v] = u[v]);
				var w = "#000000",
					x;
				if (a.utils.isIE()) {
					var y = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" bgcolor="' + w + '" width="100%" height="100%" id="' + b.id + '" name="' + b.id + '" tabindex=0"">';
					y += '<param name="movie" value="' + c.src + '">', y += '<param name="allowfullscreen" value="true">', y += '<param name="allowscriptaccess" value="always">', y += '<param name="seamlesstabbing" value="true">', y += '<param name="wmode" value="' + t + '">', y += '<param name="flashvars" value="' + l(n) + '">', y += "</object>", a.utils.setOuterHTML(b, y), x = document.getElementById(b.id)
				} else {
					var z = document.createElement("object");
					z.setAttribute("type", "application/x-shockwave-flash"), z.setAttribute("data", c.src), z.setAttribute("width", "100%"), z.setAttribute("height", "100%"), z.setAttribute("bgcolor", "#000000"), z.setAttribute("id", b.id), z.setAttribute("name", b.id), z.setAttribute("tabindex", 0), g(z, "allowfullscreen", "true"), g(z, "allowscriptaccess", "always"), g(z, "seamlesstabbing", "true"), g(z, "wmode", t), g(z, "flashvars", l(n)), b.parentNode.replaceChild(z, b), x = z
				}
				f.container = x, f.setPlayer(x, "flash")
			}, this.supportsConfig = function() {
				if (a.utils.hasFlash()) {
					if (!d)
						return !0;
					var b = a.utils.getFirstPlaylistItemFromConfig(d);
					if (typeof b.file == "undefined" && typeof b.levels == "undefined")
						return !0;
					if (b.file)
						return flashCanPlay(b.file, b.provider);
					if (b.levels && b.levels.length)
						for (var c = 0; c < b.levels.length; c++)
							if (b.levels[c].file && flashCanPlay(b.levels[c].file, b.provider))
								return !0
				}
				return !1
			}, flashCanPlay = function(b, c) {
				var d = ["video", "http", "sound", "image"];
				if (c && d.toString().indexOf(c) < 0)
					return !0;
				var e = a.utils.extension(b);
				return e ? a.utils.exists(a.utils.extensionmap[e]) && !a.utils.exists(a.utils.extensionmap[e].flash) ? !1 : !0 : !0
			}
		}
	}(jwplayer),
	function(a) {
		a.embed.html5 = function(b, c, d, e, f) {
			function g(a, c, d) {
				return function(e) {
					var f = document.getElementById(b.id + "_displayarea");
					d && f.appendChild(c), a.resize(f.clientWidth, f.clientHeight), c.left = f.style.left, c.top = f.style.top
				}
			}
			this.embed = function() {
				if (!a.html5)
					return null;
				e.setupPlugins(f, d, g), b.innerHTML = "";
				var c = a.utils.extend({
					screencolor: "0x000000"
				}, d),
					h = ["plugins", "modes", "events"];
				for (var i = 0; i < h.length; i++)
					delete c[h[i]];
				c.levels && !c.sources && (c.sources = d.levels), c.skin && c.skin.toLowerCase().indexOf(".zip") > 0 && (c.skin = c.skin.replace(/\.zip/i, ".xml"));
				var j = new(a.html5(b).setup)(c);
				f.container = document.getElementById(f.id), f.setPlayer(j, "html5")
			}, this.supportsConfig = function() {
				if ( !! a.vid.canPlayType) {
					if (!d)
						return !0;
					var b = a.utils.getFirstPlaylistItemFromConfig(d);
					if (typeof b.file == "undefined" && typeof b.levels == "undefined")
						return !0;
					if (b.file)
						return html5CanPlay(a.vid, b.file, b.provider, b.playlistfile);
					if (b.levels && b.levels.length)
						for (var c = 0; c < b.levels.length; c++)
							if (b.levels[c].file && html5CanPlay(a.vid, b.levels[c].file, b.provider, b.playlistfile))
								return !0
				}
				return !1
			}, html5CanPlay = function(b, c, d, e) {
				if (e)
					return !1;
				if (d && d == "youtube")
					return !0;
				if (d && d != "video" && d != "http" && d != "sound")
					return !1;
				if (navigator.userAgent.match(/BlackBerry/i) !== null)
					return !1;
				var f = a.utils.extension(c);
				return !a.utils.exists(f) || !a.utils.exists(a.utils.extensionmap[f]) ? !0 : a.utils.exists(a.utils.extensionmap[f].html5) ? a.utils.isLegacyAndroid() && f.match(/m4v|mp4/) ? !0 : browserCanPlay(b, a.utils.extensionmap[f].html5) : !1
			}, browserCanPlay = function(a, b) {
				return b ? a.canPlayType(b) ? !0 : b == "audio/mp3" && navigator.userAgent.match(/safari/i) ? a.canPlayType("audio/mpeg") : !1 : !0
			}
		}
	}(jwplayer),
	function(a) {
		a.embed.logo = function(b, c, d) {
			function h() {
				i(), k(), l()
			}

			function i() {
				if (e.prefix) {
					var c = a.version.split(/\W/).splice(0, 2).join("/");
					e.prefix.indexOf(c) < 0 && (e.prefix += c + "/")
				}
				g = a.utils.extend({}, e, b)
			}

			function j() {
				var a = {
					border: "none",
					textDecoration: "none",
					position: "absolute",
					cursor: "pointer",
					zIndex: 10
				};
				a.display = g.hide ? "none" : "block";
				var b = g.position.toLowerCase().split("-");
				for (var c in b)
					a[b[c]] = g.margin;
				return a
			}

			function k() {
				f = document.createElement("img"), f.id = d + "_jwplayer_logo", f.style.display = "none", f.onload = function(a) {
					_css(f, j()), n()
				};
				if (!g.file)
					return;
				g.file.indexOf("http://") === 0 ? f.src = g.file : f.src = g.prefix + g.file
			}

			function l() {
				g.link ? (f.onmouseover = o, f.onmouseout = n, f.onclick = m) : this.mouseEnabled = !1
			}

			function m(a) {
				typeof a != "undefined" && (a.preventDefault(), a.stopPropagation()), g.link && window.open(g.link, g.linktarget);
				return
			}

			function n(a) {
				g.link && (f.style.opacity = g.out);
				return
			}

			function o(a) {
				g.hide && (f.style.opacity = g.over);
				return
			}
			var e = {
				prefix: "http://l.longtailvideo.com/" + c + "/",
				file: "",
				link: "",
				linktarget: "_top",
				margin: 8,
				out: .5,
				over: 1,
				timeout: 5,
				hide: !1,
				position: "bottom-left"
			};
			_css = a.utils.css;
			var f, g;
			h();
			if (!g.file)
				return;
			return f
		}
	}(jwplayer),
	function(a) {
		a.html5 = function(b) {
			var c = b;
			return this.setup = function(b) {
				return a.utils.extend(this, new a.html5.api(c, b)), this
			}, this
		}
	}(jwplayer),
	function(a) {
		var b = a.utils,
			c = b.css,
			d = b.isIOS();
		a.html5.view = function(e, f, g) {
			function y() {
				function a() {
					return h.skin.getComponentSettings("display") && h.skin.getComponentSettings("display").backgroundcolor ? h.skin.getComponentSettings("display").backgroundcolor : parseInt("000000", 16)
				}
				k = document.createElement("div"), k.id = i.id, k.className = i.className, _videowrapper = document.createElement("div"), _videowrapper.id = k.id + "_video_wrapper", i.id = k.id + "_video", c(k, {
					position: "relative",
					height: j.height,
					width: j.width,
					padding: 0,
					backgroundColor: a(),
					zIndex: 0
				}), c(i, {
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
					zIndex: 1,
					margin: "auto",
					display: "block"
				}), c(_videowrapper, {
					overflow: "hidden",
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0
				}), b.wrap(i, k), b.wrap(i, _videowrapper), n = document.createElement("div"), n.id = k.id + "_displayarea", k.appendChild(n), _instreamArea = document.createElement("div"), _instreamArea.id = k.id + "_instreamarea", c(_instreamArea, {
					overflow: "hidden",
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					zIndex: 100,
					background: "000000",
					display: "none"
				}), k.appendChild(_instreamArea)
			}

			function z() {
				for (var a = 0; a < j.plugins.order.length; a++) {
					var c = j.plugins.order[a];
					b.exists(j.plugins.object[c].getDisplayElement) && (j.plugins.object[c].height = b.parseDimension(j.plugins.object[c].getDisplayElement().style.height), j.plugins.object[c].width = b.parseDimension(j.plugins.object[c].getDisplayElement().style.width), j.plugins.config[c].currentPosition = j.plugins.config[c].position)
				}
				C()
			}

			function A(a) {
				s = j.fullscreen
			}

			function B(b) {
				if (w)
					return;
				switch (b.newstate) {
					case a.api.events.state.PLAYING:
						j.getMedia() && j.getMedia().hasChrome() && (n.style.display = "none");
						break;
					default:
						n.style.display = "block"
				}
				K()
			}

			function C(a) {
				var c = j.getMedia() ? j.getMedia().getDisplayElement() : null;
				if (b.exists(c)) {
					q != c && (q && q.parentNode && q.parentNode.replaceChild(c, q), q = c);
					for (var d = 0; d < j.plugins.order.length; d++) {
						var e = j.plugins.order[d];
						b.exists(j.plugins.object[e].getDisplayElement) && (j.plugins.config[e].currentPosition = j.plugins.config[e].position)
					}
				}
				E(j.width, j.height)
			}

			function D(b) {
				switch (b.keyCode) {
					case 27:
						h.jwGetFullscreen() && h.jwSetFullscreen(!1);
						break;
					case 32:
						h.jwGetState() != a.api.events.state.IDLE && h.jwGetState() != a.api.events.state.PAUSED ? h.jwPause() : h.jwPlay()
				}
			}

			function E(a, e) {
				if (k.style.display == "none")
					return;
				var f = [].concat(j.plugins.order);
				f.reverse(), o = f.length + 2;
				if (s && R())
					try {
						j.fullscreen && !j.getMedia().getDisplayElement().webkitDisplayingFullscreen && (j.fullscreen = !1)
				} catch (g) {}
				if (!j.fullscreen) {
					l = a, m = e, typeof a == "string" && a.indexOf("%") > 0 ? l = b.getElementWidth(b.parentNode(k)) * parseInt(a.replace("%"), "") / 100 : l = a, typeof e == "string" && e.indexOf("%") > 0 ? m = b.getElementHeight(b.parentNode(k)) * parseInt(e.replace("%"), "") / 100 : m = e;
					var h = {
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						width: l,
						height: m,
						position: "absolute"
					};
					c(n, h);
					var i = {}, p;
					try {
						p = j.plugins.object.display.getDisplayElement()
					} catch (g) {}
					p && (i.width = b.parseDimension(p.style.width), i.height = b.parseDimension(p.style.height));
					var q = b.extend({}, h, i, {
						zIndex: _instreamArea.style.zIndex,
						display: _instreamArea.style.display
					});
					c(_instreamArea, q), c(k, {
						height: m,
						width: l
					});
					var r = G(H, f);
					if (r.length > 0) {
						o += r.length;
						var v = r.indexOf("playlist"),
							w = r.indexOf("controlbar");
						v >= 0 && w >= 0 && (r[v] = r.splice(w, 1, r[v])[0]), G(I, r, !0)
					}
					t = b.getElementWidth(n), u = b.getElementHeight(n)
				} else !R() && !d && G(J, f, !0);
				K()
			}

			function G(d, e, f) {
				F = 0;
				var g = [];
				for (var h = 0; h < e.length; h++) {
					var i = e[h];
					if (b.exists(j.plugins.object[i].getDisplayElement))
						if (j.plugins.config[i].currentPosition != a.html5.view.positions.NONE) {
							var k = d(i, o--);
							if (!k)
								g.push(i);
							else {
								var l = k.width,
									m = k.height;
								f && (delete k.width, delete k.height), c(j.plugins.object[i].getDisplayElement(), k), j.plugins.object[i].resize(l, m)
							}
						} else
							c(j.plugins.object[i].getDisplayElement(), {
								display: "none"
							})
				}
				return g
			}

			function H(a, c) {
				if (b.exists(j.plugins.object[a].getDisplayElement) && j.plugins.config[a].position && Q(j.plugins.config[a].position)) {
					b.exists(j.plugins.object[a].getDisplayElement().parentNode) || k.appendChild(j.plugins.object[a].getDisplayElement());
					var d = L(a);
					return d.zIndex = c, d
				}
				return !1
			}

			function I(a, c) {
				return b.exists(j.plugins.object[a].getDisplayElement().parentNode) || n.appendChild(j.plugins.object[a].getDisplayElement()), {
					position: "absolute",
					width: b.getElementWidth(n) - b.parseDimension(n.style.right),
					height: b.getElementHeight(n) - b.parseDimension(n.style.bottom),
					zIndex: c
				}
			}

			function J(a, b) {
				return {
					position: "fixed",
					width: j.width,
					height: j.height,
					zIndex: b
				}
			}

			function Q(b) {
				return [a.html5.view.positions.TOP, a.html5.view.positions.RIGHT, a.html5.view.positions.BOTTOM, a.html5.view.positions.LEFT].toString().indexOf(b.toUpperCase()) > -1
			}

			function R() {
				return h.jwGetState() != a.api.events.state.IDLE && !r && j.getMedia() && j.getMedia().getDisplayElement() && j.getMedia().getDisplayElement().webkitSupportsFullscreen && b.useNativeFullscreen() ? !0 : !1
			}
			var h = e,
				i = f,
				j = g,
				k, l, m, n, o, p, q, r = !1,
				s = !1,
				t, u, v, w, x;
			this.setup = function() {
				j && j.getMedia() && (i = j.getMedia().getDisplayElement()), y(), z(), h.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, B), h.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_LOADED, C), h.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_BEFOREPLAY, A), h.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_META, function(a) {
					K()
				});
				var c;
				b.exists(window.onresize) && (c = window.onresize), window.onresize = function(a) {
					if (b.exists(c))
						try {
							c(a)
					} catch (d) {}
					if (h.jwGetFullscreen()) {
						if (!R()) {
							var e = b.getBoundingClientRect(document.body);
							j.width = Math.abs(e.left) + Math.abs(e.right), j.height = window.innerHeight, E(j.width, j.height)
						}
					} else
						E(j.width, j.height)
				}
			};
			var F, K = this.resizeMedia = function() {
					n.style.position = "absolute";
					var e = j.getMedia() ? j.getMedia().getDisplayElement() : x;
					if (!e)
						return;
					if (e && e.tagName.toLowerCase() == "video") {
						if (!e.videoWidth || !e.videoHeight) {
							e.style.width = n.style.width, e.style.height = n.style.height;
							return
						}
						e.style.position = "absolute", b.fadeTo(e, 1, .25), e.parentNode && (e.parentNode.style.left = n.style.left, e.parentNode.style.top = n.style.top);
						if (j.fullscreen && h.jwGetStretching() == a.utils.stretching.EXACTFIT && !b.isMobile()) {
							var f = document.createElement("div");
							b.stretch(a.utils.stretching.UNIFORM, f, b.getElementWidth(n), b.getElementHeight(n), t, u), b.stretch(a.utils.stretching.EXACTFIT, e, b.parseDimension(f.style.width), b.parseDimension(f.style.height), e.videoWidth ? e.videoWidth : 400, e.videoHeight ? e.videoHeight : 300), c(e, {
								left: f.style.left,
								top: f.style.top
							})
						} else
							d || b.stretch(h.jwGetStretching(), e, b.getElementWidth(n), b.getElementHeight(n), e.videoWidth ? e.videoWidth : 400, e.videoHeight ? e.videoHeight : 300)
					} else {
						var g = j.plugins.object.display.getDisplayElement();
						g ? j.getMedia().resize(b.parseDimension(g.style.width), b.parseDimension(g.style.height)) : j.getMedia().resize(b.parseDimension(n.style.width), b.parseDimension(n.style.height))
					}
				}, L = this.getComponentPosition = function(c) {
					var d = {
						position: "absolute",
						margin: 0,
						padding: 0,
						top: null
					}, e = j.plugins.config[c].currentPosition.toLowerCase();
					switch (e.toUpperCase()) {
						case a.html5.view.positions.TOP:
							d.top = b.parseDimension(n.style.top), d.left = b.parseDimension(n.style.left), d.width = b.getElementWidth(n) - b.parseDimension(n.style.left) - b.parseDimension(n.style.right), d.height = j.plugins.object[c].height, n.style[e] = b.parseDimension(n.style[e]) + j.plugins.object[c].height + "px", n.style.height = b.getElementHeight(n) - d.height + "px";
							break;
						case a.html5.view.positions.RIGHT:
							d.top = b.parseDimension(n.style.top), d.right = b.parseDimension(n.style.right), d.width = j.plugins.object[c].width, d.height = b.getElementHeight(n) - b.parseDimension(n.style.top) - b.parseDimension(n.style.bottom), n.style.width = b.getElementWidth(n) - d.width + "px";
							break;
						case a.html5.view.positions.BOTTOM:
							d.left = b.parseDimension(n.style.left), d.width = b.getElementWidth(n) - b.parseDimension(n.style.left) - b.parseDimension(n.style.right), d.height = j.plugins.object[c].height, d.bottom = b.parseDimension(n.style.bottom + F), F += d.height, n.style.height = b.getElementHeight(n) - d.height + "px";
							break;
						case a.html5.view.positions.LEFT:
							d.top = b.parseDimension(n.style.top), d.left = b.parseDimension(n.style.left), d.width = j.plugins.object[c].width, d.height = b.getElementHeight(n) - b.parseDimension(n.style.top) - b.parseDimension(n.style.bottom), n.style[e] = b.parseDimension(n.style[e]) + j.plugins.object[c].width + "px", n.style.width = b.getElementWidth(n) - d.width + "px";
							break;
						default:
					}
					return d
				};
			this.resize = E;
			var M, N, O, P = this.fullscreen = function(a) {
					if (d)
						return;
					var e;
					try {
						e = j.getMedia().getDisplayElement()
					} catch (f) {}
					a && (N = j.width, O = j.height);
					var g = {
						position: "fixed",
						width: "100%",
						height: "100%",
						top: 0,
						left: 0,
						zIndex: 2147483e3
					}, h = {
							position: "relative",
							height: N,
							width: O,
							zIndex: 0
						};
					if (R() && e && e.webkitSupportsFullscreen) {
						if (a && !e.webkitDisplayingFullscreen)
							try {
								c(e, g), b.transform(e), M = n.style.display, n.style.display = "none", e.webkitEnterFullscreen()
						} catch (i) {} else if (!a) {
							c(e, h), K();
							if (e.webkitDisplayingFullscreen)
								try {
									e.webkitExitFullscreen()
							} catch (i) {}
							n.style.display = M
						}
						r = !1
					} else {
						if (a) {
							document.onkeydown = D, clearInterval(p);
							var o = b.getBoundingClientRect(document.body);
							j.width = Math.abs(o.left) + Math.abs(o.right), j.height = window.innerHeight, c(k, g), g.zIndex = 1, j.getMedia() && j.getMedia().getDisplayElement() && c(j.getMedia().getDisplayElement(), g), g.zIndex = 2, c(n, g), r = !0
						} else
							document.onkeydown = "", j.width = l, j.height = m, c(k, h), r = !1;
						E(j.width, j.height)
					}
				};
			this.setupInstream = function(a, c) {
				b.css(_instreamArea, {
					display: "block",
					position: "absolute"
				}), n.style.display = "none", _instreamArea.appendChild(a), x = c, w = !0
			};
			var S = this.destroyInstream = function() {
				_instreamArea.style.display = "none", _instreamArea.innerHTML = "", n.style.display = "block", x = null, w = !1, E(j.width, j.height)
			}
		}, a.html5.view.positions = {
			TOP: "TOP",
			RIGHT: "RIGHT",
			BOTTOM: "BOTTOM",
			LEFT: "LEFT",
			OVER: "OVER",
			NONE: "NONE"
		}
	}(jwplayer),
	function(a) {
		var b = {
			backgroundcolor: "",
			margin: 10,
			font: "Arial,sans-serif",
			fontsize: 10,
			fontcolor: parseInt("000000", 16),
			fontstyle: "normal",
			fontweight: "bold",
			buttoncolor: parseInt("ffffff", 16),
			position: a.html5.view.positions.BOTTOM,
			idlehide: !1,
			hideplaylistcontrols: !1,
			forcenextprev: !1,
			layout: {
				left: {
					position: "left",
					elements: [{
							name: "play",
							type: "button"
						}, {
							name: "divider",
							type: "divider"
						}, {
							name: "prev",
							type: "button"
						}, {
							name: "divider",
							type: "divider"
						}, {
							name: "next",
							type: "button"
						}, {
							name: "divider",
							type: "divider"
						}, {
							name: "elapsed",
							type: "text"
						}
					]
				},
				center: {
					position: "center",
					elements: [{
							name: "time",
							type: "slider"
						}
					]
				},
				right: {
					position: "right",
					elements: [{
							name: "duration",
							type: "text"
						}, {
							name: "blank",
							type: "button"
						}, {
							name: "divider",
							type: "divider"
						}, {
							name: "mute",
							type: "button"
						}, {
							name: "volume",
							type: "slider"
						}, {
							name: "divider",
							type: "divider"
						}, {
							name: "fullscreen",
							type: "button"
						}
					]
				}
			}
		};
		_utils = a.utils, _css = _utils.css, _hide = function(a) {
			_css(a, {
				display: "none"
			})
		}, _show = function(a) {
			_css(a, {
				display: "block"
			})
		}, a.html5.controlbar = function(c, d) {
			function D() {
				return v || (v = e.skin.getSkinElement("controlbar", "background"), v || (v = {
					width: 0,
					height: 0,
					src: null
				})), v
			}

			function E() {
				i = 0, j = 0, h = 0;
				if (!s) {
					var a = {
						height: D().height,
						backgroundColor: f.backgroundcolor
					};
					g = document.createElement("div"), g.id = e.id + "_jwplayer_controlbar", _css(g, a)
				}
				var b = e.skin.getSkinElement("controlbar", "capLeft"),
					c = e.skin.getSkinElement("controlbar", "capRight");
				b && T("capLeft", "left", !1, g), O("background", g, {
					position: "absolute",
					height: D().height,
					left: b ? b.width : 0,
					zIndex: 0
				}, "img"), D().src && (r.background.src = D().src), O("elements", g, {
					position: "relative",
					height: D().height,
					zIndex: 1
				}), c && T("capRight", "right", !1, g)
			}

			function F() {
				var a = ["timeSlider", "volumeSlider", "timeSliderRail", "volumeSliderRail"];
				for (var b in a) {
					var c = a[b];
					typeof r[c] != "undefined" && (t[c] = _utils.getBoundingClientRect(r[c]))
				}
			}

			function H(b) {
				if (w)
					return;
				clearTimeout(x);
				if (f.position == a.html5.view.positions.OVER || e.jwGetFullscreen())
					switch (e.jwGetState()) {
						case a.api.events.state.PAUSED:
						case a.api.events.state.IDLE:
							g && g.style.opacity < 1 && (!f.idlehide || _utils.exists(b)) && (G = !1, setTimeout(function() {
								G || J()
							}, 100)), f.idlehide && (x = setTimeout(function() {
								I()
							}, 2e3));
							break;
						default:
							G = !0, b && J(), x = setTimeout(function() {
								I()
							}, 2e3)
				} else
					J()
			}

			function I() {
				w || (M(), g.style.opacity == 1 && (_utils.cancelAnimation(g), _utils.fadeTo(g, 0, .1, 1, 0)))
			}

			function J() {
				w || (L(), g.style.opacity == 0 && (_utils.cancelAnimation(g), _utils.fadeTo(g, 1, .1, 0, 0)))
			}

			function K(a) {
				return function() {
					z && y != a && (y = a, C.sendEvent(a, {
						component: "controlbar",
						boundingRect: N()
					}))
				}
			}

			function N() {
				return f.position == a.html5.view.positions.OVER || e.jwGetFullscreen() ? _utils.getDimensions(g) : {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				}
			}

			function O(a, b, c, d) {
				var e;
				return s ? e = document.getElementById(g.id + "_" + a) : (d || (d = "div"), e = document.createElement(d), r[a] = e, e.id = g.id + "_" + a, b.appendChild(e)), _utils.exists(c) && _css(e, c), e
			}

			function P() {
				if (e.jwGetHeight() <= 40) {
					f.layout = _utils.clone(f.layout);
					for (var a = 0; a < f.layout.left.elements.length; a++)
						f.layout.left.elements[a].name == "fullscreen" && f.layout.left.elements.splice(a, 1);
					for (a = 0; a < f.layout.right.elements.length; a++)
						f.layout.right.elements[a].name == "fullscreen" && f.layout.right.elements.splice(a, 1);
					be()
				}
				Q(f.layout.left), Q(f.layout.center), Q(f.layout.right)
			}

			function Q(a, b) {
				var c = a.position == "right" ? "right" : "left",
					d = _utils.extend([], a.elements);
				_utils.exists(b) && d.reverse();
				var a = O(a.position + "Group", r.elements, {
					"float": "left",
					styleFloat: "left",
					cssFloat: "left",
					height: "100%"
				});
				for (var e = 0; e < d.length; e++)
					S(d[e], c, a)
			}

			function R() {
				return h++
			}

			function S(a, b, c) {
				var d, f, g, h, i;
				c || (c = r.elements);
				if (a.type == "divider") {
					T("divider" + R(), b, !0, c, undefined, a.width, a.element);
					return
				}
				switch (a.name) {
					case "play":
						T("playButton", b, !1, c), T("pauseButton", b, !0, c), Y("playButton", "jwPlay"), Y("pauseButton", "jwPause");
						break;
					case "prev":
						T("prevButton", b, !0, c), Y("prevButton", "jwPlaylistPrev");
						break;
					case "stop":
						T("stopButton", b, !0, c), Y("stopButton", "jwStop");
						break;
					case "next":
						T("nextButton", b, !0, c), Y("nextButton", "jwPlaylistNext");
						break;
					case "elapsed":
						T("elapsedText", b, !0, c, null, null, e.skin.getSkinElement("controlbar", "elapsedBackground"));
						break;
					case "time":
						f = _utils.exists(e.skin.getSkinElement("controlbar", "timeSliderCapLeft")) ? e.skin.getSkinElement("controlbar", "timeSliderCapLeft").width : 0, g = _utils.exists(e.skin.getSkinElement("controlbar", "timeSliderCapRight")) ? e.skin.getSkinElement("controlbar", "timeSliderCapRight").width : 0, d = b == "left" ? f : g, i = {
							height: D().height,
							position: "relative",
							"float": "left",
							styleFloat: "left",
							cssFloat: "left"
						};
						var j = O("timeSlider", c, i);
						T("timeSliderCapLeft", b, !0, j, "relative"), T("timeSliderRail", b, !1, j, "relative"), T("timeSliderBuffer", b, !1, j, "absolute"), T("timeSliderProgress", b, !1, j, "absolute"), T("timeSliderThumb", b, !1, j, "absolute"), T("timeSliderCapRight", b, !0, j, "relative"), Z("time");
						break;
					case "fullscreen":
						T("fullscreenButton", b, !1, c), T("normalscreenButton", b, !0, c), Y("fullscreenButton", "jwSetFullscreen", !0), Y("normalscreenButton", "jwSetFullscreen", !1);
						break;
					case "volume":
						f = _utils.exists(e.skin.getSkinElement("controlbar", "volumeSliderCapLeft")) ? e.skin.getSkinElement("controlbar", "volumeSliderCapLeft").width : 0, g = _utils.exists(e.skin.getSkinElement("controlbar", "volumeSliderCapRight")) ? e.skin.getSkinElement("controlbar", "volumeSliderCapRight").width : 0, d = b == "left" ? f : g, h = e.skin.getSkinElement("controlbar", "volumeSliderRail").width + f + g, i = {
							height: D().height,
							position: "relative",
							width: h,
							"float": "left",
							styleFloat: "left",
							cssFloat: "left"
						};
						var k = O("volumeSlider", c, i);
						T("volumeSliderCapLeft", b, !1, k, "relative"), T("volumeSliderRail", b, !1, k, "relative"), T("volumeSliderProgress", b, !1, k, "absolute"), T("volumeSliderThumb", b, !1, k, "absolute"), T("volumeSliderCapRight", b, !1, k, "relative"), Z("volume");
						break;
					case "mute":
						T("muteButton", b, !1, c), T("unmuteButton", b, !0, c), Y("muteButton", "jwSetMute", !0), Y("unmuteButton", "jwSetMute", !1);
						break;
					case "duration":
						T("durationText", b, !0, c, null, null, e.skin.getSkinElement("controlbar", "durationBackground"))
				}
			}

			function T(a, b, c, d, g, h, k) {
				if (_utils.exists(e.skin.getSkinElement("controlbar", a)) || a.indexOf("Text") > 0 || a.indexOf("divider") === 0) {
					var l = {
						height: "100%",
						position: g ? g : "relative",
						display: "block",
						"float": "left",
						styleFloat: "left",
						cssFloat: "left"
					};
					(a.indexOf("next") === 0 || a.indexOf("prev") === 0) && (e.jwGetPlaylist().length < 2 || f.hideplaylistcontrols.toString() == "true") && f.forcenextprev.toString() != "true" && (c = !1, l.display = "none");
					var m;
					if (a.indexOf("Text") > 0)
						a.innerhtml = "00:00", l.font = f.fontsize + "px/" + (D().height + 1) + "px " + f.font, l.color = f.fontcolor, l.textAlign = "center", l.fontWeight = f.fontweight, l.fontStyle = f.fontstyle, l.cursor = "default", k && (l.background = "url(" + k.src + ") no-repeat center", l.backgroundSize = "100% " + D().height + "px"), l.padding = "0 5px";
					else if (a.indexOf("divider") === 0)
						if (h)
							isNaN(parseInt(h)) || (m = parseInt(h));
						else
					if (k) {
						var n = e.skin.getSkinElement("controlbar", k);
						n && (l.background = "url(" + n.src + ") repeat-x center left", m = n.width)
					} else
						l.background = "url(" + e.skin.getSkinElement("controlbar", "divider").src + ") repeat-x center left", m = e.skin.getSkinElement("controlbar", "divider").width;
					else
						l.background = "url(" + e.skin.getSkinElement("controlbar", a).src + ") repeat-x center left", m = e.skin.getSkinElement("controlbar", a).width;
					b == "left" ? c && (i += m) : b == "right" && c && (j += m), _utils.typeOf(d) == "undefined" && (d = r.elements), l.width = m;
					if (s)
						_css(r[a], l);
					else {
						var o = O(a, d, l);
						_utils.exists(e.skin.getSkinElement("controlbar", a + "Over")) && (o.onmouseover = function(b) {
							o.style.backgroundImage = ["url(", e.skin.getSkinElement("controlbar", a + "Over").src, ")"].join("")
						}, o.onmouseout = function(b) {
							o.style.backgroundImage = ["url(", e.skin.getSkinElement("controlbar", a).src, ")"].join("")
						}), a.indexOf("divider") == 0 && o.setAttribute("class", "divider"), o.innerHTML = "&nbsp;"
					}
				}
			}

			function U() {
				e.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, V), e.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, W), e.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER, _), e.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, bb), e.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_TIME, bd), e.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE, ba), e.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_VOLUME, bh), e.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, bc)
			}

			function V() {
				f.hideplaylistcontrols || (e.jwGetPlaylist().length > 1 || f.forcenextprev.toString() == "true" ? (_show(r.nextButton), _show(r.prevButton)) : (_hide(r.nextButton), _hide(r.prevButton)), bg(), X())
			}

			function W(a) {
				n = e.jwGetPlaylist()[a.index].duration, u = -1, bd({
					id: e.id,
					duration: n,
					position: 0
				}), _({
					id: e.id,
					bufferProgress: 0
				})
			}

			function X() {
				bd({
					id: e.id,
					duration: e.jwGetDuration(),
					position: 0
				}), _({
					id: e.id,
					bufferProgress: 0
				}), ba({
					id: e.id,
					mute: e.jwGetMute()
				}), bb({
					id: e.id,
					newstate: a.api.events.state.IDLE
				}), bh({
					id: e.id,
					volume: e.jwGetVolume()
				})
			}

			function Y(a, b, c) {
				if (s)
					return;
				if (_utils.exists(e.skin.getSkinElement("controlbar", a))) {
					var d = r[a];
					_utils.exists(d) && (_css(d, {
						cursor: "pointer"
					}), b == "fullscreen" ? d.onmouseup = function(a) {
						a.stopPropagation(), e.jwSetFullscreen(!e.jwGetFullscreen())
					} : d.onmouseup = function(a) {
						a.stopPropagation(), _utils.exists(c) ? e[b](c) : e[b]()
					})
				}
			}

			function Z(a) {
				if (s)
					return;
				var b = r[a + "Slider"];
				_css(r.elements, {
					cursor: "pointer"
				}), _css(b, {
					cursor: "pointer"
				}), b.onmousedown = function(b) {
					k = a
				}, b.onmouseup = function(a) {
					a.stopPropagation(), $(a.pageX)
				}, b.onmousemove = function(b) {
					if (k == "time") {
						l = !0;
						var c = b.pageX - t[a + "Slider"].left - window.pageXOffset;
						_css(r[k + "SliderThumb"], {
							left: c
						})
					}
				}
			}

			function $(b) {
				l = !1;
				var c;
				if (k == "time") {
					c = b - t.timeSliderRail.left + window.pageXOffset;
					var d = c / t.timeSliderRail.width * n;
					d < 0 ? d = 0 : d > n && (d = n - 3), (e.jwGetState() == a.api.events.state.PAUSED || e.jwGetState() == a.api.events.state.IDLE) && e.jwPlay(), e.jwSeek(d)
				} else if (k == "volume") {
					c = b - t.volumeSliderRail.left - window.pageXOffset;
					var f = Math.round(c / t.volumeSliderRail.width * 100);
					f < 10 ? f = 0 : f > 100 && (f = 100), e.jwGetMute() && e.jwSetMute(!1), e.jwSetVolume(f)
				}
				k = "none"
			}

			function _(a) {
				_utils.exists(a.bufferPercent) && (o = a.bufferPercent);
				if (t.timeSliderRail) {
					var b = e.skin.getSkinElement("controlbar", "timeSliderCapLeft"),
						c = t.timeSliderRail.width,
						d = isNaN(Math.round(c * o / 100)) ? 0 : Math.round(c * o / 100);
					_css(r.timeSliderBuffer, {
						width: d,
						left: b ? b.width : 0
					})
				}
			}

			function ba(a) {
				a.mute ? (_hide(r.muteButton), _show(r.unmuteButton), _hide(r.volumeSliderProgress)) : (_show(r.muteButton), _hide(r.unmuteButton), _show(r.volumeSliderProgress))
			}

			function bb(b) {
				b.newstate == a.api.events.state.BUFFERING || b.newstate == a.api.events.state.PLAYING ? (_show(r.pauseButton), _hide(r.playButton)) : (_hide(r.pauseButton), _show(r.playButton)), H(), b.newstate == a.api.events.state.IDLE ? (_hide(r.timeSliderBuffer), _hide(r.timeSliderProgress), _hide(r.timeSliderThumb), bd({
					id: e.id,
					duration: e.jwGetDuration(),
					position: 0
				})) : (_show(r.timeSliderBuffer), b.newstate != a.api.events.state.BUFFERING && (_show(r.timeSliderProgress), _show(r.timeSliderThumb)))
			}

			function bc(a) {
				_({
					bufferPercent: 0
				}), bd(_utils.extend(a, {
					position: 0,
					duration: n
				}))
			}

			function bd(a) {
				_utils.exists(a.position) && (m = a.position);
				var b = !1;
				_utils.exists(a.duration) && a.duration != n && (n = a.duration, b = !0);
				var c = m === n === 0 ? 0 : m / n,
					d = t.timeSliderRail;
				if (d) {
					var f = isNaN(Math.round(d.width * c)) ? 0 : Math.round(d.width * c),
						g = e.skin.getSkinElement("controlbar", "timeSliderCapLeft"),
						h = f + (g ? g.width : 0);
					r.timeSliderProgress && (_css(r.timeSliderProgress, {
						width: f,
						left: g ? g.width : 0
					}), l || r.timeSliderThumb && (r.timeSliderThumb.style.left = h + "px"))
				}
				r.durationText && (r.durationText.innerHTML = _utils.timeFormat(n));
				if (r.elapsedText) {
					var i = _utils.timeFormat(m);
					r.elapsedText.innerHTML = i, u != i.length && (b = !0, u = i.length)
				}
				b && bg()
			}

			function be() {
				var a = r.elements.childNodes,
					b, c;
				for (var d = 0; d < a.length; d++) {
					var e = a[d].childNodes;
					for (var f in e) {
						if (isNaN(parseInt(f, 10)))
							continue;
						e[f].id.indexOf(g.id + "_divider") === 0 && c && c.id.indexOf(g.id + "_divider") === 0 && e[f].style.backgroundImage == c.style.backgroundImage ? e[f].style.display = "none" : e[f].id.indexOf(g.id + "_divider") === 0 && b && b.style.display != "none" && (e[f].style.display = "block"), e[f].style.display != "none" && (c = e[f]), b = e[f]
					}
				}
			}

			function bf() {
				e.jwGetFullscreen() ? (_show(r.normalscreenButton), _hide(r.fullscreenButton)) : (_hide(r.normalscreenButton), _show(r.fullscreenButton)), e.jwGetState() == a.api.events.state.BUFFERING || e.jwGetState() == a.api.events.state.PLAYING ? (_show(r.pauseButton), _hide(r.playButton)) : (_hide(r.pauseButton), _show(r.playButton)), e.jwGetMute() == !0 ? (_hide(r.muteButton), _show(r.unmuteButton), _hide(r.volumeSliderProgress)) : (_show(r.muteButton), _hide(r.unmuteButton), _show(r.volumeSliderProgress))
			}

			function bg() {
				be(), bf();
				var b = {
					width: p
				}, c = {
						"float": "left",
						styleFloat: "left",
						cssFloat: "left"
					};
				if (f.position == a.html5.view.positions.OVER || e.jwGetFullscreen())
					b.left = f.margin, b.width -= 2 * f.margin, b.top = q - D().height - f.margin, b.height = D().height;
				var d = e.skin.getSkinElement("controlbar", "capLeft"),
					h = e.skin.getSkinElement("controlbar", "capRight");
				c.width = b.width - (d ? d.width : 0) - (h ? h.width : 0);
				var i = _utils.getBoundingClientRect(r.leftGroup).width,
					j = _utils.getBoundingClientRect(r.rightGroup).width,
					k = c.width - i - j - 1,
					l = k,
					m = e.skin.getSkinElement("controlbar", "timeSliderCapLeft"),
					n = e.skin.getSkinElement("controlbar", "timeSliderCapRight");
				return _utils.exists(m) && (l -= m.width), _utils.exists(n) && (l -= n.width), r.timeSlider.style.width = k + "px", r.timeSliderRail.style.width = l + "px", _css(g, b), _css(r.elements, c), _css(r.background, c), F(), b
			}

			function bh(a) {
				if (_utils.exists(r.volumeSliderRail)) {
					var b = isNaN(a.volume / 100) ? 1 : a.volume / 100,
						c = _utils.parseDimension(r.volumeSliderRail.style.width),
						d = isNaN(Math.round(c * b)) ? 0 : Math.round(c * b),
						f = _utils.parseDimension(r.volumeSliderRail.style.right),
						g = _utils.exists(e.skin.getSkinElement("controlbar", "volumeSliderCapLeft")) ? e.skin.getSkinElement("controlbar", "volumeSliderCapLeft").width : 0;
					_css(r.volumeSliderProgress, {
						width: d,
						left: g
					});
					if (r.volumeSliderThumb) {
						var h = d - Math.round(_utils.parseDimension(r.volumeSliderThumb.style.width) / 2);
						h = Math.min(Math.max(h, 0), c - _utils.parseDimension(r.volumeSliderThumb.style.width)), _css(r.volumeSliderThumb, {
							left: h
						})
					}
					_utils.exists(r.volumeSliderCapLeft) && _css(r.volumeSliderCapLeft, {
						left: 0
					})
				}
			}

			function bi() {
				try {
					var a = e.id.indexOf("_instream") > 0 ? e.id.replace("_instream", "") : e.id;
					B = document.getElementById(a), B.addEventListener("mousemove", H)
				} catch (b) {
					_utils.log("Could not add mouse listeners to controlbar: " + b)
				}
			}

			function bj() {
				E(), P(), F(), s = !0, U(), f.idlehide = f.idlehide.toString().toLowerCase() == "true", f.position == a.html5.view.positions.OVER && f.idlehide ? (g.style.opacity = 0, z = !0) : (g.style.opacity = 1, setTimeout(function() {
					z = !0, L()
				}, 1)), bi(), X()
			}
			window.controlbar = this;
			var e = c,
				f = _utils.extend({}, b, e.skin.getComponentSettings("controlbar"), d);
			if (f.position == a.html5.view.positions.NONE || typeof a.html5.view.positions[f.position] == "undefined")
				return;
			_utils.mapLength(e.skin.getComponentLayout("controlbar")) > 0 && (f.layout = e.skin.getComponentLayout("controlbar"));
			var g, h, i, j, k = "none",
				l, m, n, o, p, q, r = {}, s = !1,
				t = {}, u = -1,
				v, w = !1,
				x, y, z = !1,
				A = !1,
				B, C = new a.html5.eventdispatcher;
			_utils.extend(this, C), this.getDisplayElement = function() {
				return g
			}, this.resize = function(a, b) {
				bi(), _utils.cancelAnimation(g), p = a, q = b, A != e.jwGetFullscreen() && (A = e.jwGetFullscreen(), A || H(), y = undefined);
				var c = bg();
				return bd({
					id: e.id,
					duration: n,
					position: m
				}), _({
					id: e.id,
					bufferPercent: o
				}), c
			}, this.show = function() {
				w && (w = !1, _show(g), L())
			}, this.hide = function() {
				w || (w = !0, _hide(g), M())
			};
			var G, L = K(a.api.events.JWPLAYER_COMPONENT_SHOW),
				M = K(a.api.events.JWPLAYER_COMPONENT_HIDE);
			return bj(), this
		}
	}(jwplayer),
	function(a) {
		var b = ["width", "height", "state", "playlist", "item", "position", "buffer", "duration", "volume", "mute", "fullscreen"],
			c = a.utils;
		a.html5.controller = function(b, d, e, f) {
			function u(a) {
				r ? t.sendEvent(a.type, a) : q.push(a)
			}

			function v(b) {
				if (!r) {
					r = !0, t.sendEvent(a.api.events.JWPLAYER_READY, b), a.utils.exists(window.playerReady) && playerReady(b), a.utils.exists(window[e.config.playerReady]) && window[e.config.playerReady](b);
					while (q.length > 0) {
						var c = q.shift();
						t.sendEvent(c.type, c)
					}
					e.config.autostart && !a.utils.isIOS() && K();
					while (P.length > 0) {
						var d = P.shift();
						R(d.method, d.arguments)
					}
				}
			}

			function w() {
				try {
					p = w;
					if (!n) {
						n = !0, t.sendEvent(a.api.events.JWPLAYER_MEDIA_BEFOREPLAY), n = !1;
						if (o) {
							o = !1, p = null;
							return
						}
					}
					return E(h.item), h.playlist[h.item].levels[0].file.length > 0 && (l || h.state == a.api.events.state.IDLE ? (h.getMedia().load(h.playlist[h.item]), l = !1) : h.state == a.api.events.state.PAUSED && h.getMedia().play()), !0
				} catch (b) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, b), p = null
				}
				return !1
			}

			function x() {
				try {
					if (h.playlist[h.item].levels[0].file.length > 0)
						switch (h.state) {
							case a.api.events.state.PLAYING:
							case a.api.events.state.BUFFERING:
								h.getMedia() && h.getMedia().pause();
								break;
							default:
								n && (o = !0)
					}
					return !0
				} catch (b) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, b)
				}
				return !1
			}

			function y(b) {
				try {
					if (h.playlist[h.item].levels[0].file.length > 0) {
						typeof b != "number" && (b = parseFloat(b));
						switch (h.state) {
							case a.api.events.state.IDLE:
								m < 0 && (m = h.playlist[h.item].start, h.playlist[h.item].start = b), n || w();
								break;
							case a.api.events.state.PLAYING:
							case a.api.events.state.PAUSED:
							case a.api.events.state.BUFFERING:
								h.seek(b)
						}
					}
					return !0
				} catch (c) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, c)
				}
				return !1
			}

			function z(b) {
				p = null, c.exists(b) || (b = !0);
				try {
					return (h.state != a.api.events.state.IDLE || b) && h.getMedia() && h.getMedia().stop(b), n && (o = !0), !0
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function A() {
				try {
					h.playlist[h.item].levels[0].file.length > 0 && (h.config.shuffle ? E(C()) : h.item + 1 == h.playlist.length ? E(0) : E(h.item + 1));
					if (h.state != a.api.events.state.IDLE) {
						var b = h.state;
						h.state = a.api.events.state.IDLE, t.sendEvent(a.api.events.JWPLAYER_PLAYER_STATE, {
							oldstate: b,
							newstate: a.api.events.state.IDLE
						})
					}
					return w(), !0
				} catch (c) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, c)
				}
				return !1
			}

			function B() {
				try {
					h.playlist[h.item].levels[0].file.length > 0 && (h.config.shuffle ? E(C()) : h.item === 0 ? E(h.playlist.length - 1) : E(h.item - 1));
					if (h.state != a.api.events.state.IDLE) {
						var b = h.state;
						h.state = a.api.events.state.IDLE, t.sendEvent(a.api.events.JWPLAYER_PLAYER_STATE, {
							oldstate: b,
							newstate: a.api.events.state.IDLE
						})
					}
					return w(), !0
				} catch (c) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, c)
				}
				return !1
			}

			function C() {
				var a = null;
				if (h.playlist.length > 1)
					while (!c.exists(a))
						a = Math.floor(Math.random() * h.playlist.length), a == h.item && (a = null);
				else
					a = 0;
				return a
			}

			function D(b) {
				if (!h.playlist || !h.playlist[b])
					return !1;
				try {
					if (h.playlist[b].levels[0].file.length > 0) {
						var c = h.state;
						c !== a.api.events.state.IDLE && (h.playlist[h.item] && h.playlist[h.item].provider == h.playlist[b].provider ? z(!1) : z()), E(b), w()
					}
					return !0
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function E(b) {
				if (!h.playlist[b])
					return;
				h.setActiveMediaProvider(h.playlist[b]), h.item != b && (h.item = b, l = !0, t.sendEvent(a.api.events.JWPLAYER_PLAYLIST_ITEM, {
					index: b
				}))
			}

			function F(b) {
				try {
					E(h.item);
					var c = h.getMedia();
					switch (typeof b) {
						case "number":
							c.volume(b);
							break;
						case "string":
							c.volume(parseInt(b, 10))
					}
					return h.setVolume(b), !0
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function G(b) {
				try {
					E(h.item);
					var c = h.getMedia();
					return typeof b == "undefined" ? (c.mute(!h.mute), h.setMute(!h.mute)) : b.toString().toLowerCase() == "true" ? (c.mute(!0), h.setMute(!0)) : (c.mute(!1), h.setMute(!1)), !0
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function H(b, c) {
				try {
					return h.width = b, h.height = c, j.resize(b, c), t.sendEvent(a.api.events.JWPLAYER_RESIZE, {
						width: h.width,
						height: h.height
					}), !0
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function I(b, c) {
				try {
					return typeof b == "undefined" && (b = !h.fullscreen), typeof c == "undefined" && (c = !0), b != h.fullscreen && (h.fullscreen = b.toString().toLowerCase() == "true", j.fullscreen(h.fullscreen), c && t.sendEvent(a.api.events.JWPLAYER_FULLSCREEN, {
						fullscreen: h.fullscreen
					}), t.sendEvent(a.api.events.JWPLAYER_RESIZE, {
						width: h.width,
						height: h.height
					})), !0
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function J(b) {
				try {
					return z(), n && (o = !1), h.loadPlaylist(b), h.playlist[h.item].provider ? (E(h.item), h.config.autostart.toString().toLowerCase() == "true" && !c.isIOS() && !n && w(), !0) : !1
				} catch (d) {
					t.sendEvent(a.api.events.JWPLAYER_ERROR, d)
				}
				return !1
			}

			function K(a) {
				c.isIOS() || (E(h.item), h.config.autostart.toString().toLowerCase() == "true" && !c.isIOS() && w())
			}

			function L(a) {
				I(a.fullscreen, !1)
			}

			function M() {
				try {
					return h.getMedia().detachMedia()
				} catch (a) {
					return null
				}
			}

			function N() {
				try {
					var a = h.getMedia().attachMedia();
					typeof p == "function" && p()
				} catch (b) {
					return null
				}
			}

			function O() {
				if (h.state != a.api.events.state.IDLE)
					return;
				p = O;
				switch (h.config.repeat.toUpperCase()) {
					case a.html5.controller.repeatoptions.SINGLE:
						w();
						break;
					case a.html5.controller.repeatoptions.ALWAYS:
						h.item == h.playlist.length - 1 && !h.config.shuffle ? D(0) : A();
						break;
					case a.html5.controller.repeatoptions.LIST:
						h.item == h.playlist.length - 1 && !h.config.shuffle ? (z(), E(0)) : A();
						break;
					default:
						z()
				}
			}

			function Q(a) {
				return function() {
					r ? R(a, arguments) : P.push({
						method: a,
						arguments: arguments
					})
				}
			}

			function R(a, b) {
				var c = [];
				for (i = 0; i < b.length; i++)
					c.push(b[i]);
				a.apply(this, c)
			}
			var g = b,
				h = e,
				j = f,
				k = d,
				l = !0,
				m = -1,
				n = !1,
				o = !1,
				p, q = [],
				r = !1,
				s = c.exists(h.config.debug) && h.config.debug.toString().toLowerCase() == "console",
				t = new a.html5.eventdispatcher(k.id, s);
			c.extend(this, t), h.addGlobalListener(u), h.addEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL, function() {
				h.getMedia().play()
			}), h.addEventListener(a.api.events.JWPLAYER_MEDIA_TIME, function(a) {
				a.position >= h.playlist[h.item].start && m >= 0 && (h.playlist[h.item].start = m, m = -1)
			}), h.addEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, function(a) {
				setTimeout(O, 25)
			}), h.addEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, K), h.addEventListener(a.api.events.JWPLAYER_FULLSCREEN, L), a.html5.controller.repeatoptions = {
				LIST: "LIST",
				ALWAYS: "ALWAYS",
				SINGLE: "SINGLE",
				NONE: "NONE"
			};
			var P = [];
			this.play = Q(w), this.pause = Q(x), this.seek = Q(y), this.stop = Q(z), this.next = Q(A), this.prev = Q(B), this.item = Q(D), this.setVolume = Q(F), this.setMute = Q(G), this.resize = Q(H), this.setFullscreen = Q(I), this.load = Q(J), this.playerReady = v, this.detachMedia = M, this.attachMedia = N, this.beforePlay = function() {
				return n
			}, this.destroy = function() {
				h.getMedia() && h.getMedia().destroy()
			}
		}
	}(jwplayer),
	function(a) {
		a.html5.defaultSkin = function() {
			return this.text = '<?xml version="1.0" ?><skin author="LongTail Video" name="Five" version="1.1"><components><component name="controlbar"><settings><setting name="margin" value="20"/><setting name="fontsize" value="11"/><setting name="fontcolor" value="0x000000"/></settings><layout><group position="left"><button name="play"/><divider name="divider"/><button name="prev"/><divider name="divider"/><button name="next"/><divider name="divider"/><text name="elapsed"/></group><group position="center"><slider name="time"/></group><group position="right"><text name="duration"/><divider name="divider"/><button name="blank"/><divider name="divider"/><button name="mute"/><slider name="volume"/><divider name="divider"/><button name="fullscreen"/></group></layout><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAElJREFUOI3t1LERACAMQlFgGvcfxNIhHMK4gsUvUviOmgtNsiAZkBSEKxKEnCYkkQrJn/YwbUNiSDDYRZaQRDaShv+oX9GBZEIuK+8hXVLs+/YAAAAASUVORK5CYII="/><element name="blankButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAYCAYAAAAyJzegAAAAFElEQVQYV2P8//8/AzpgHBUc7oIAGZdH0RjKN8EAAAAASUVORK5CYII="/><element name="capLeft" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAYAAAA7zJfaAAAAQElEQVQIWz3LsRGAMADDQJ0XB5bMINABZ9GENGrszxhjT2WLSqxEJG2JQrTMdV2q5LpOAvyRaVmsi7WdeZ/7+AAaOTq7BVrfOQAAAABJRU5ErkJggg=="/><element name="capRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAYAAAA7zJfaAAAAQElEQVQIWz3LsRGAMADDQJ0XB5bMINABZ9GENGrszxhjT2WLSqxEJG2JQrTMdV2q5LpOAvyRaVmsi7WdeZ/7+AAaOTq7BVrfOQAAAABJRU5ErkJggg=="/><element name="divider" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADhJREFUCB0FwcENgEAAw7Aq+893g8APUILNOQcbFRktVGqUVFRkWNz3xTa2sUaLNUosKlRUvvf5AdbWOTtzmzyWAAAAAElFTkSuQmCC"/><element name="playButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAANUlEQVR42u2RsQkAAAjD/NTTPaW6dXLrINJA1kBpGPMAjDWmOgp1HFQXx+b1KOefO4oxY57R73YnVYCQUCQAAAAASUVORK5CYII="/><element name="pauseButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAIUlEQVQ4jWNgGAWjYOiD/0gYG3/U0FFDB4Oho2AUDAYAAEwiL9HrpdMVAAAAAElFTkSuQmCC"/><element name="prevButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAQklEQVQ4y2NgGAWjYOiD/1AMA/JAfB5NjCJD/YH4PRaLyDa0H4lNNUP/DxlD59PCUBCIp3ZEwYA+NZLUKBgFgwEAAN+HLX9sB8u8AAAAAElFTkSuQmCC"/><element name="nextButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAQElEQVQ4y2NgGAWjYOiD/0B8Hojl0cT+U2ooCL8HYn9qGwrD/bQw9P+QMXQ+tSMqnpoRBUpS+tRMUqNgFAwGAADxZy1/mHvFnAAAAABJRU5ErkJggg=="/><element name="timeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAOElEQVRIDe3BwQkAIRADwAhhw/nU/kWwUK+KPITMABFh19Y+F0acY8CJvX9wYpXgRElwolSIiMf9ZWEDhtwurFsAAAAASUVORK5CYII="/><element name="timeSliderBuffer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAN0lEQVRIDe3BwQkAMQwDMBcc55mRe9zi7RR+FCwBEWG39vcfGHFm4MTuhhMlwYlVBSdKhYh43AW/LQMKm1spzwAAAABJRU5ErkJggg=="/><element name="timeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAIElEQVRIiWNgGAWjYBTQBfynMR61YCRYMApGwSigMQAAiVWPcbq6UkIAAAAASUVORK5CYII="/><element name="timeSliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAYCAYAAAA/OUfnAAAAO0lEQVQYlWP4//8/Awwz0JgDBP/BeN6Cxf/hnI2btiI4u/fsQ3AOHjqK4Jw4eQbBOX/hEoKDYjSd/AMA4cS4mfLsorgAAAAASUVORK5CYII="/><element name="muteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAJklEQVQ4y2NgGAUjDcwH4v/kaPxPikZkxcNVI9mBQ5XoGAWDFwAAsKAXKQQmfbUAAAAASUVORK5CYII="/><element name="unmuteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAMklEQVQ4y2NgGAWDHPyntub5xBr6Hwv/Pzk2/yfVG/8psRFE25Oq8T+tQnsIaB4FVAcAi2YVysVY52AAAAAASUVORK5CYII="/><element name="volumeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAAACmpqampqbBXAu8AAAAAnRSTlMAgJsrThgAAAArSURBVAhbY2AgErBAyA4I2QEhOyBkB4TsYOhAoaCCUCUwDTDtMMNgRuMHAFB5FoGH5T0UAAAAAElFTkSuQmCC"/><element name="volumeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAgJsrThgAAAArSURBVAhbY2AgErBAyA4I2QEhOyBkB4TsYOhAoaCCUCUwDTDtMMNgRuMHAFB5FoGH5T0UAAAAAElFTkSuQmCC"/><element name="volumeSliderCapRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAYCAYAAAAyJzegAAAAFElEQVQYV2P8//8/AzpgHBUc7oIAGZdH0RjKN8EAAAAASUVORK5CYII="/><element name="fullscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAQklEQVRIiWNgGAWjYMiD/0iYFDmSLbDHImdPLQtgBpEiR7Zl2NijAA5oEkT/0Whi5UiyAJ8BVMsHNMtoo2AUDAIAAGdcIN3IDNXoAAAAAElFTkSuQmCC"/><element name="normalscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAP0lEQVRIx2NgGAWjYMiD/1RSQ5QB/wmIUWzJfzx8qhj+n4DYCAY0DyJ7PBbYU8sHMEvwiZFtODXUjIJRMJgBACpWIN2ZxdPTAAAAAElFTkSuQmCC"/></elements></component><component name="display"><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlOZpuml+rYAAAASSURBVBhXY2AYJuA/GBwY6jQAyDyoK8QcL4QAAAAASUVORK5CYII="/><element name="playIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAiUlEQVR42u3XSw2AMBREURwgAQlIQAISKgUpSEFKJeCg5b0E0kWBTVcD9ySTsL0Jn9IBAAAA+K2UUrBlW/Rr5ZDoIeeuoFkxJD9ss03aIXXQqB9SttoG7ZA6qNcOKdttiwcJh9RB+iFl4SshkRBuLR72+9cvH0SOKI2HRo7x/Fi1/uoCAAAAwLsD8ki99IlO2dQAAAAASUVORK5CYII="/><element name="muteIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAVUlEQVR42u3WMQrAIAxAUW/g/SdvGmvpoOBeSHgPsjj5QTANAACARCJilIhYM0tEvJM+Ik3Id9E957kQIb+F3OdCPC0hPkQriqWx9hp/x/QGAABQyAPLB22VGrpLDgAAAABJRU5ErkJggg=="/><element name="errorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA/0lEQVR42u2U0QmEMBAF7cASLMESUoIlpARLSCkpwRJSgiWkhOvAXD4WsgRkyaG5DbyB+Yvg8KITAAAAAAAYk+u61mwk15EjPtlEfihmqIiZR1Qx80ghjgdUuiHXGHSVsoag0x6x8DUoyjD5KovmEJ9NTDMRPIT0mtdIUkjlonuNohO+Ha99DTmkuGgKCTcvebAzx82ZoCWC3/3aIMWSRucaxcjORSFY4xpFdjYJGp1rFGcyCYZ/RVh6AUnfcNZ2zih3/mGj1jVCdiNDwyrq1rA/xMdeEXvDVdnYc1vDc3uPkDObXrlaxbNHSOohQhr/WOeLEWfWTgAAAAAAADzNF9sHJ7PJ57MlAAAAAElFTkSuQmCC"/><element name="bufferIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACBklEQVR42u3Zv0sCYRzH8USTzOsHHEWGkC1HgaDgkktGDjUYtDQ01RDSljQ1BLU02+rk1NTm2NLq4Nx/0L/h9fnCd3j4cnZe1/U8xiO8h3uurufF0/3COd/3/0UWYiEWYiEWYiGJQ+J8xuPxKhXjEMZANinjIZhkGuVRNioE4wVURo4JkHm0xKWmhRAc1bh1EyCUw5BcBIjHiApKa4CErko6DEJwuRo6IRKzyJD8FJAyI3Zp2zRImiBcRhlfo5RtlxCcE3CcDNpGrhYIT2IhAJKilO0VRmzJ32fAMTpBTS0QMfGwlcuKMRftE0DJ0wCJdcOsCkBdXP3Mh9CEFUBTPS9mDZJBG6io4aqVzMdCokCw9H3kT6j/C/9iDdSeUMNC7DkyyxAs/Rk6Qss8FPWRZgdVtUH4DjxEn1zxh+/zj1wHlf4MQhNGrwqA6sY40U8JonRJwEQh+AO3AvCG6gHv4U7IY4krxkroWoAOkoQMGfCBrgIm+YBGqPENpIJ66CJg3x66Y0gnSUidAEEnNr9jjLiWMn5DiWP0OC/oAsCgkq43xBdGDMQr7YASP/vEkHvdl1+JOCcEV5sC4hGEOzTlPuKgd0b0xD4JkRcOgnRRTjdErkYhAsQVq6IdUuPJtmk7BCL3t/h88cx91pKQkI/pkDx6pmYTIjEoxiHsN1YWYiEWYiEWknhflZ5IErA5nr8AAAAASUVORK5CYII="/></elements></component><component name="dock"><settings><setting name="fontcolor" value="0xffffff"/></settings><elements><element name="button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlOZpuml+rYAAAASSURBVBhXY2AYJuA/GBwY6jQAyDyoK8QcL4QAAAAASUVORK5CYII="/></elements></component><component name="playlist"><settings><setting name="backgroundcolor" value="0xe8e8e8"/></settings><elements><element name="item" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUaN7t2MENwCAMBEEe9N8wSKYC/D8YV7CyJoRkVtVImxkZPQInMxoP0XiIxkM0HsGbjjSNBx544IEHHnjggUe/6UQeey0PIh7XTftGxKPj4eXCtLsHHh+ZxkO0Iw8PR55Ni8ZD9Hu/EAoP0dc5RRg9qeRjVF8AAAAASUVORK5CYII="/><element name="sliderCapTop" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAHCAYAAADnCQYGAAAAFUlEQVQokWP8//8/A7UB46ihI9hQAKt6FPPXhVGHAAAAAElFTkSuQmCC"/><element name="sliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAKElEQVQ4y2P4//8/Az68bNmy/+iYkB6GUUNHDR01dNTQUUNHDaXcUABUDOKhcxnsSwAAAABJRU5ErkJggg=="/><element name="sliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAJUlEQVQ4T2P4//8/Ay4MBP9xYbz6Rg0dNXTU0FFDRw0dNZRyQwHH4NBa7GJsXAAAAABJRU5ErkJggg=="/><element name="sliderCapBottom" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAHCAYAAADnCQYGAAAAFUlEQVQokWP8//8/A7UB46ihI9hQAKt6FPPXhVGHAAAAAElFTkSuQmCC"/></elements></component></components></skin>', this.xml = null, window.DOMParser ? (parser = new DOMParser, this.xml = parser.parseFromString(this.text, "text/xml")) : (this.xml = new ActiveXObject("Microsoft.XMLDOM"), this.xml.async = "false", this.xml.loadXML(this.text)), this
		}
	}(jwplayer),
	function(a) {
		_utils = a.utils, _css = _utils.css, _hide = function(a) {
			_css(a, {
				display: "none"
			})
		}, _show = function(a) {
			_css(a, {
				display: "block"
			})
		}, a.html5.display = function(b, c) {
			function E() {
				g.display = H("div", "display"), g.display_text = H("div", "display_text"), g.display.appendChild(g.display_text), g.display_image = H("img", "display_image"), g.display_image.onerror = function(a) {
					_hide(g.display_image)
				}, g.display_image.onload = F, g.display_icon = H("div", "display_icon"), g.display_iconBackground = H("div", "display_iconBackground"), g.display.appendChild(g.display_image), g.display_iconBackground.appendChild(g.display_icon), g.display.appendChild(g.display_iconBackground), I(), setTimeout(function() {
					y = !0, e.icons.toString() == "true" && V()
				}, 1)
			}

			function F(b) {
				j = g.display_image.naturalWidth, k = g.display_image.naturalHeight, G();
				if (f.jwGetState() == a.api.events.state.IDLE || f.jwGetPlaylist()[f.jwGetPlaylistIndex()].provider == "sound")
					_css(g.display_image, {
						display: "block",
						opacity: 0
					}), _utils.fadeTo(g.display_image, 1, .1);
				u = !1
			}

			function G() {
				if (f.jwGetFullscreen() && f.jwGetStretching() == a.utils.stretching.EXACTFIT) {
					var b = document.createElement("div");
					_utils.stretch(a.utils.stretching.UNIFORM, b, h, i, A, B), _utils.stretch(a.utils.stretching.EXACTFIT, g.display_image, _utils.parseDimension(b.style.width), _utils.parseDimension(b.style.height), j, k), _css(g.display_image, {
						left: b.style.left,
						top: b.style.top
					})
				} else
					_utils.stretch(f.jwGetStretching(), g.display_image, h, i, j, k)
			}

			function H(a, b) {
				var c = document.createElement(a);
				return c.id = f.id + "_jwplayer_" + b, _css(c, D[b].style), c
			}

			function I() {
				for (var a in g)
					_utils.exists(D[a].click) && (g[a].onclick = D[a].click)
			}

			function J(b) {
				typeof b.preventDefault != "undefined" ? b.preventDefault() : b.returnValue = !1;
				if (typeof z == "function") {
					z(b);
					return
				}
				f.jwGetState() != a.api.events.state.PLAYING ? f.jwPlay() : f.jwPause()
			}

			function K(a) {
				if (n) {
					L();
					return
				}
				g.display_icon.style.backgroundImage = ["url(", f.skin.getSkinElement("display", a).src, ")"].join(""), _css(g.display_icon, {
					width: f.skin.getSkinElement("display", a).width,
					height: f.skin.getSkinElement("display", a).height,
					top: (f.skin.getSkinElement("display", "background").height - f.skin.getSkinElement("display", a).height) / 2,
					left: (f.skin.getSkinElement("display",
						"background").width - f.skin.getSkinElement("display",
						a).width) / 2
				}), M(), _utils.exists(f.skin.getSkinElement("display", a + "Over")) ? (g.display_icon.onmouseover = function(b) {
					g.display_icon.style.backgroundImage = ["url(", f.skin.getSkinElement("display", a + "Over").src, ")"].join("")
				}, g.display_icon.onmouseout = function(b) {
					g.display_icon.style.backgroundImage = ["url(", f.skin.getSkinElement("display", a).src, ")"].join("")
				}) : (g.display_icon.onmouseover = null, g.display_icon.onmouseout = null)
			}

			function L() {
				e.icons.toString() == "true" && (_hide(g.display_icon), _hide(g.display_iconBackground), W())
			}

			function M() {
				!x && e.icons.toString() == "true" && (_show(g.display_icon), _show(g.display_iconBackground), V())
			}

			function N(a) {
				n = !0, L(), g.display_text.innerHTML = a.message, _show(g.display_text), g.display_text.style.top = (i - _utils.getBoundingClientRect(g.display_text).height) / 2 + "px"
			}

			function O() {
				v = !1, g.display_image.style.display = "none"
			}

			function P() {
				r = ""
			}

			function Q(b) {
				(b.type == a.api.events.JWPLAYER_PLAYER_STATE || b.type == a.api.events.JWPLAYER_PLAYLIST_ITEM) && n && (n = !1, _hide(g.display_text));
				var c = f.jwGetState();
				if (c == r)
					return;
				r = c, q >= 0 && clearTimeout(q), s || f.jwGetState() == a.api.events.state.PLAYING || f.jwGetState() == a.api.events.state.PAUSED ? S(f.jwGetState()) : q = setTimeout(R(f.jwGetState()), 500)
			}

			function R(a) {
				return function() {
					S(a)
				}
			}

			function S(b) {
				_utils.exists(m) && (clearInterval(m), m = null, _utils.animations.rotate(g.display_icon, 0));
				switch (b) {
					case a.api.events.state.BUFFERING:
						_utils.isIPod() ? (O(), L()) : (f.jwGetPlaylist()[f.jwGetPlaylistIndex()].provider == "sound" && T(), l = 0, m = setInterval(function() {
							l += o, _utils.animations.rotate(g.display_icon, l % 360)
						}, p), K("bufferIcon"), s = !0);
						break;
					case a.api.events.state.PAUSED:
						_utils.isIPod() || (f.jwGetPlaylist()[f.jwGetPlaylistIndex()].provider != "sound" && _css(g.display_image, {
							background: "transparent no-repeat center center"
						}), K("playIcon"), s = !0);
						break;
					case a.api.events.state.IDLE:
						f.jwGetPlaylist()[f.jwGetPlaylistIndex()] && f.jwGetPlaylist()[f.jwGetPlaylistIndex()].image ? T() : O(), K("playIcon"), s = !0;
						break;
					default:
						f.jwGetPlaylist()[f.jwGetPlaylistIndex()] && f.jwGetPlaylist()[f.jwGetPlaylistIndex()].provider == "sound" ? _utils.isIPod() ? (O(), s = !1) : T() : (O(), s = !1), f.jwGetMute() && e.showmute ? K("muteIcon") : L()
				}
				q = -1
			}

			function T() {
				if (f.jwGetPlaylist()[f.jwGetPlaylistIndex()]) {
					var a = f.jwGetPlaylist()[f.jwGetPlaylistIndex()].image;
					a && (a != w ? (w = a, u = !0, g.display_image.src = _utils.getAbsolutePath(a)) : !u && !v && (v = !0, g.display_image.style.opacity = 0, g.display_image.style.display = "block", _utils.fadeTo(g.display_image, 1, .1)))
				}
			}

			function U(a) {
				return function() {
					if (!y)
						return;
					!x && t != a && (t = a, C.sendEvent(a, {
						component: "display",
						boundingRect: _utils.getDimensions(g.display_iconBackground)
					}))
				}
			}
			var d = {
				icons: !0,
				showmute: !1
			}, e = _utils.extend({}, d, c),
				f = b,
				g = {}, h, i, j, k, l, m, n, o = _utils.exists(f.skin.getComponentSettings("display").bufferrotation) ? parseInt(f.skin.getComponentSettings("display").bufferrotation, 10) : 15,
				p = _utils.exists(f.skin.getComponentSettings("display").bufferinterval) ? parseInt(f.skin.getComponentSettings("display").bufferinterval, 10) : 100,
				q = -1,
				r = a.api.events.state.IDLE,
				s = !0,
				t, u = !1,
				v = !0,
				w = "",
				x = !1,
				y = !1,
				z, A, B, C = new a.html5.eventdispatcher;
			_utils.extend(this, C);
			var D = {
				display: {
					style: {
						cursor: "pointer",
						top: 0,
						left: 0,
						overflow: "hidden"
					},
					click: J
				},
				display_icon: {
					style: {
						cursor: "pointer",
						position: "absolute",
						top: (f.skin.getSkinElement("display", "background").height - f.skin.getSkinElement("display", "playIcon").height) / 2,
						left: (f.skin.getSkinElement("display",
							"background").width - f.skin.getSkinElement("display",
							"playIcon").width) / 2,
						border: 0,
						margin: 0,
						padding: 0,
						zIndex: 3,
						display: "none"
					}
				},
				display_iconBackground: {
					style: {
						cursor: "pointer",
						position: "absolute",
						top: (i - f.skin.getSkinElement("display", "background").height) / 2,
						left: (h - f.skin.getSkinElement("display",
							"background").width) / 2,
						border: 0,
						backgroundImage: ["url(",
							f.skin.getSkinElement("display",
								"background").src,
								")"
						].join(""),
						width: f.skin.getSkinElement("display",
							"background").width,
						height: f.skin.getSkinElement("display",
							"background").height,
						margin: 0,
						padding: 0,
						zIndex: 2,
						display: "none"
					}
				},
				display_image: {
					style: {
						display: "none",
						width: h,
						height: i,
						position: "absolute",
						cursor: "pointer",
						left: 0,
						top: 0,
						margin: 0,
						padding: 0,
						textDecoration: "none",
						zIndex: 1
					}
				},
				display_text: {
					style: {
						zIndex: 4,
						position: "relative",
						opacity: .8,
						backgroundColor: parseInt("000000",
							16),
						color: parseInt("ffffff",
							16),
						textAlign: "center",
						fontFamily: "Arial,sans-serif",
						padding: "0 5px",
						fontSize: 14
					}
				}
			};
			f.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, Q), f.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE, Q), f.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, P), f.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, Q), f.jwAddEventListener(a.api.events.JWPLAYER_ERROR, N), E(), this.getDisplayElement = function() {
				return g.display
			}, this.resize = function(a, b) {
				if (f.jwGetFullscreen() && _utils.isMobile())
					return;
				_css(g.display, {
					width: a,
					height: b
				}), _css(g.display_text, {
					width: a - 10,
					top: (b - _utils.getBoundingClientRect(g.display_text).height) / 2
				}), _css(g.display_iconBackground, {
					top: (b - f.skin.getSkinElement("display", "background").height) / 2,
					left: (a - f.skin.getSkinElement("display",
						"background").width) / 2
				});
				if (h != a || i != b)
					h = a, i = b, t = undefined, V();
				f.jwGetFullscreen() || (A = a, B = b), G(), Q({})
			}, this.show = function() {
				x && (x = !1, S(f.jwGetState()))
			}, this.hide = function() {
				x || (L(), x = !0)
			};
			var V = U(a.api.events.JWPLAYER_COMPONENT_SHOW),
				W = U(a.api.events.JWPLAYER_COMPONENT_HIDE);
			return this.setAlternateClickHandler = function(a) {
				z = a
			}, this.revertAlternateClickHandler = function() {
				z = undefined
			}, this
		}
	}(jwplayer),
	function(a) {
		var b = a.utils,
			c = b.css;
		a.html5.dock = function(d, e) {
			function f() {
				return {
					align: a.html5.view.positions.RIGHT
				}
			}

			function t(a) {
				return "url(" + a + ") no-repeat center center"
			}

			function u(a) {}

			function v(c, e) {
				F();
				if (i.length > 0) {
					var f = 10,
						l = f,
						p = -1,
						q = d.skin.getSkinElement("dock", "button").height,
						r = d.skin.getSkinElement("dock", "button").width,
						s = c - r - f,
						t, u;
					g.align == a.html5.view.positions.LEFT && (p = 1, s = f);
					for (var v = 0; v < i.length; v++) {
						var w = Math.floor(l / e);
						l + q + f > (w + 1) * e && (l = (w + 1) * e + f, w = Math.floor(l / e));
						var x = h[i[v]].div;
						x.style.top = l % e + "px", x.style.left = s + (d.skin.getSkinElement("dock", "button").width + f) * w * p + "px";
						var y = {
							x: b.parseDimension(x.style.left),
							y: b.parseDimension(x.style.top),
							width: r,
							height: q
						};
						if (!t || y.x <= t.x && y.y <= t.y)
							t = y;
						if (!u || y.x >= u.x && y.y >= u.y)
							u = y;
						x.style.width = r + "px", x.style.height = q + "px", l += d.skin.getSkinElement("dock", "button").height + f
					}
					n = {
						x: t.x,
						y: t.y,
						width: u.x - t.x + u.width,
						height: t.y - u.y + u.height
					}
				}
				if (m != d.jwGetFullscreen() || j != c || k != e)
					j = c, k = e, m = d.jwGetFullscreen(), o = undefined, setTimeout(z, 1)
			}

			function w(a) {
				return function() {
					!l && o != a && i.length > 0 && (o = a, r.sendEvent(a, {
						component: "dock",
						boundingRect: n
					}))
				}
			}

			function x(c) {
				b.isMobile() ? c.newstate == a.api.events.state.IDLE ? B() : C() : y()
			}

			function y(c) {
				if (l)
					return;
				clearTimeout(q);
				if (e.position == a.html5.view.positions.OVER || d.jwGetFullscreen())
					switch (d.jwGetState()) {
						case a.api.events.state.PAUSED:
						case a.api.events.state.IDLE:
							s && s.style.opacity < 1 && (!e.idlehide || b.exists(c)) && E(), e.idlehide && (q = setTimeout(function() {
								D()
							}, 2e3));
							break;
						default:
							b.exists(c) && E(), q = setTimeout(function() {
								D()
							}, 2e3)
				} else
					E()
			}

			function D() {
				l || (A(), s.style.opacity == 1 && (b.cancelAnimation(s), b.fadeTo(s, 0, .1, 1, 0)))
			}

			function E() {
				l || (z(), s.style.opacity == 0 && (b.cancelAnimation(s), b.fadeTo(s, 1, .1, 0, 0)))
			}

			function F() {
				try {
					p = document.getElementById(d.id), p.addEventListener("mousemove", y)
				} catch (a) {
					b.log("Could not add mouse listeners to dock: " + a)
				}
			}
			var g = b.extend({}, f(), e);
			if (g.align == "FALSE")
				return;
			var h = {}, i = [],
				j, k, l = !1,
				m = !1,
				n = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				}, o, p, q, r = new a.html5.eventdispatcher;
			b.extend(this, r);
			var s = document.createElement("div");
			s.id = d.id + "_jwplayer_dock", s.style.opacity = 1, F(), d.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, x), this.getDisplayElement = function() {
				return s
			}, this.setButton = function(c, e, f, g) {
				!e && h[c] ? (b.arrays.remove(i, c), s.removeChild(h[c].div), delete h[c]) : e && (h[c] || (h[c] = {}), h[c].handler = e, h[c].outGraphic = f, h[c].overGraphic = g, h[c].div || (i.push(c), h[c].div = document.createElement("div"), h[c].div.style.position = "absolute", s.appendChild(h[c].div), h[c].div.appendChild(document.createElement("div")), h[c].div.childNodes[0].style.position = "relative", h[c].div.childNodes[0].style.width = "100%", h[c].div.childNodes[0].style.height = "100%", h[c].div.childNodes[0].style.zIndex = 10, h[c].div.childNodes[0].style.cursor = "pointer", h[c].div.appendChild(document.createElement("img")), h[c].div.childNodes[1].style.position = "absolute", h[c].div.childNodes[1].style.left = 0, h[c].div.childNodes[1].style.top = 0, d.skin.getSkinElement("dock", "button") && (h[c].div.childNodes[1].src = d.skin.getSkinElement("dock", "button").src), h[c].div.childNodes[1].style.zIndex = 9, h[c].div.childNodes[1].style.cursor = "pointer", h[c].div.onmouseover = function() {
					h[c].overGraphic && (h[c].div.childNodes[0].style.background = t(h[c].overGraphic)), d.skin.getSkinElement("dock", "buttonOver") && (h[c].div.childNodes[1].src = d.skin.getSkinElement("dock", "buttonOver").src)
				}, h[c].div.onmouseout = function() {
					h[c].outGraphic && (h[c].div.childNodes[0].style.background = t(h[c].outGraphic)), d.skin.getSkinElement("dock", "button") && (h[c].div.childNodes[1].src = d.skin.getSkinElement("dock", "button").src)
				}, d.skin.getSkinElement("dock", "button") && (h[c].div.childNodes[1].src = d.skin.getSkinElement("dock", "button").src)), h[c].outGraphic ? h[c].div.childNodes[0].style.background = t(h[c].outGraphic) : h[c].overGraphic && (h[c].div.childNodes[0].style.background = t(h[c].overGraphic)), e && (h[c].div.onclick = function(b) {
					b.preventDefault(), a(d.id).callback(c), h[c].overGraphic && (h[c].div.childNodes[0].style.background = t(h[c].overGraphic)), d.skin.getSkinElement("dock", "button") && (h[c].div.childNodes[1].src = d.skin.getSkinElement("dock", "button").src)
				})), v(j, k)
			};
			var z = w(a.api.events.JWPLAYER_COMPONENT_SHOW),
				A = w(a.api.events.JWPLAYER_COMPONENT_HIDE);
			this.resize = v;
			var B = function() {
				c(s, {
					display: "block"
				}), l && (l = !1, z())
			}, C = function() {
					c(s, {
						display: "none"
					}), l || (A(), l = !0)
				};
			return this.hide = C, this.show = B, this
		}
	}(jwplayer),
	function(a) {
		a.html5.eventdispatcher = function(b, c) {
			var d = new a.events.eventdispatcher(c);
			a.utils.extend(this, d), this.sendEvent = function(c, e) {
				a.utils.exists(e) || (e = {}), a.utils.extend(e, {
					id: b,
					version: a.version,
					type: c
				}), d.sendEvent(c, e)
			}
		}
	}(jwplayer),
	function(a) {
		var b = a.utils;
		a.html5.instream = function(c, d, e, f) {
			function A() {
				_fakemodel = new a.html5.model(this, k.getMedia() ? k.getMedia().getDisplayElement() : k.container, k), x = new a.html5.eventdispatcher, j.jwAddEventListener(a.api.events.JWPLAYER_RESIZE, I), j.jwAddEventListener(a.api.events.JWPLAYER_FULLSCREEN, I)
			}

			function B() {
				_fakemodel.setMute(k.mute), _fakemodel.setVolume(k.volume)
			}

			function C() {
				t || (t = new a.html5.mediavideo(_fakemodel, k.getMedia() ? k.getMedia().getDisplayElement() : k.container), t.addGlobalListener(D), t.addEventListener(a.api.events.JWPLAYER_MEDIA_META, G), t.addEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, F), t.addEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL, E)), t.attachMedia()
			}

			function D(a) {
				w && H(a.type, a)
			}

			function E(a) {
				w && t.play()
			}

			function F(a) {
				w && setTimeout(function() {
					z.jwInstreamDestroy(!0)
				}, 10)
			}

			function G(a) {
				a.metadata.width && a.metadata.height && l.resizeMedia()
			}

			function H(a, b, c) {
				(w || c) && x.sendEvent(a, b)
			}

			function I() {
				var a = k.plugins.object.display.getDisplayElement().style;
				if (u) {
					var c = k.plugins.object.controlbar.getDisplayElement().style;
					u.resize(b.parseDimension(a.width), b.parseDimension(a.height)), _css(u.getDisplayElement(), b.extend({}, c, {
						zIndex: 1001,
						opacity: 1
					}))
				}
				v && (v.resize(b.parseDimension(a.width), b.parseDimension(a.height)), _css(v.getDisplayElement(), b.extend({}, a, {
					zIndex: 1e3
				}))), l && l.resizeMedia()
			}
			var g = {
				controlbarseekable: "always",
				controlbarpausable: !0,
				controlbarstoppable: !0,
				playlistclickable: !0
			}, h, i, j = c,
				k = d,
				l = e,
				m = f,
				n, o, p, q, r, s, t, u, v, w = !1,
				x, y, z = this;
			return this.load = function(c, d) {
				B(), w = !0, i = b.extend(g, d), h = a.html5.playlistitem(c), C(), y = document.createElement("div"), y.id = z.id + "_instream_container", m.detachMedia(), n = t.getDisplayElement(), s = k.playlist[k.item], r = j.jwGetState(), (r == a.api.events.state.BUFFERING || r == a.api.events.state.PLAYING) && n.pause(), o = n.src ? n.src : n.currentSrc, p = n.innerHTML, q = n.currentTime, v = new a.html5.display(z, b.extend({}, k.plugins.config.display)), v.setAlternateClickHandler(function(b) {
					_fakemodel.state == a.api.events.state.PAUSED ? z.jwInstreamPlay() : H(a.api.events.JWPLAYER_INSTREAM_CLICK, b)
				}), y.appendChild(v.getDisplayElement());
				if (!b.isMobile()) {
					u = new a.html5.controlbar(z, b.extend({}, k.plugins.config.controlbar, {}));
					if (k.plugins.config.controlbar.position == a.html5.view.positions.OVER)
						y.appendChild(u.getDisplayElement());
					else {
						var e = k.plugins.object.controlbar.getDisplayElement().parentNode;
						e.appendChild(u.getDisplayElement())
					}
				}
				l.setupInstream(y, n), I(), t.load(h)
			}, this.jwInstreamDestroy = function(b) {
				if (!w)
					return;
				w = !1, r != a.api.events.state.IDLE ? (t.load(s, !1), t.stop(!1)) : t.stop(!0), t.detachMedia(), l.destroyInstream();
				if (u)
					try {
						u.getDisplayElement().parentNode.removeChild(u.getDisplayElement())
				} catch (c) {}
				H(a.api.events.JWPLAYER_INSTREAM_DESTROYED, {
					reason: b ? "complete" : "destroyed"
				}, !0), m.attachMedia();
				if (r == a.api.events.state.BUFFERING || r == a.api.events.state.PLAYING)
					n.play(), k.playlist[k.item] == s && k.getMedia().seek(q);
				return
			}, this.jwInstreamAddEventListener = function(a, b) {
				x.addEventListener(a, b)
			}, this.jwInstreamRemoveEventListener = function(a, b) {
				x.removeEventListener(a, b)
			}, this.jwInstreamPlay = function() {
				if (!w)
					return;
				t.play(!0)
			}, this.jwInstreamPause = function() {
				if (!w)
					return;
				t.pause(!0)
			}, this.jwInstreamSeek = function(a) {
				if (!w)
					return;
				t.seek(a)
			}, this.jwInstreamGetState = function() {
				return w ? _fakemodel.state : undefined
			}, this.jwInstreamGetPosition = function() {
				return w ? _fakemodel.position : undefined
			}, this.jwInstreamGetDuration = function() {
				return w ? _fakemodel.duration : undefined
			}, this.playlistClickable = function() {
				return !w || i.playlistclickable.toString().toLowerCase() == "true"
			}, this.jwPlay = function(a) {
				i.controlbarpausable.toString().toLowerCase() == "true" && this.jwInstreamPlay()
			}, this.jwPause = function(a) {
				i.controlbarpausable.toString().toLowerCase() == "true" && this.jwInstreamPause()
			}, this.jwStop = function() {
				i.controlbarstoppable.toString().toLowerCase() == "true" && (this.jwInstreamDestroy(), j.jwStop())
			}, this.jwSeek = function(a) {
				switch (i.controlbarseekable.toLowerCase()) {
					case "always":
						this.jwInstreamSeek(a);
						break;
					case "backwards":
						_fakemodel.position > a && this.jwInstreamSeek(a)
				}
			}, this.jwGetPosition = function() {}, this.jwGetDuration = function() {}, this.jwGetWidth = j.jwGetWidth, this.jwGetHeight = j.jwGetHeight, this.jwGetFullscreen = j.jwGetFullscreen, this.jwSetFullscreen = j.jwSetFullscreen, this.jwGetVolume = function() {
				return k.volume
			}, this.jwSetVolume = function(a) {
				t.volume(a), j.jwSetVolume(a)
			}, this.jwGetMute = function() {
				return k.mute
			}, this.jwSetMute = function(a) {
				t.mute(a), j.jwSetMute(a)
			}, this.jwGetState = function() {
				return _fakemodel.state
			}, this.jwGetPlaylist = function() {
				return [h]
			}, this.jwGetPlaylistIndex = function() {
				return 0
			}, this.jwGetStretching = function() {
				return k.config.stretching
			}, this.jwAddEventListener = function(a, b) {
				x.addEventListener(a, b)
			}, this.jwRemoveEventListener = function(a, b) {
				x.removeEventListener(a, b)
			}, this.skin = j.skin, this.id = j.id + "_instream", A(), this
		}
	}(jwplayer),
	function(a) {
		var b = {
			prefix: "",
			file: "",
			link: "",
			linktarget: "_top",
			margin: 8,
			out: .5,
			over: 1,
			timeout: 5,
			hide: !0,
			position: "bottom-left"
		};
		_css = a.utils.css, a.html5.logo = function(c, d) {
			function j() {
				k(), e.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, t), l(), m()
			}

			function k() {
				if (b.prefix) {
					var e = c.version.split(/\W/).splice(0, 2).join("/");
					b.prefix.indexOf(e) < 0 && (b.prefix += e + "/")
				}
				d.position == a.html5.view.positions.OVER && (d.position = b.position);
				try {
					window.location.href.indexOf("https") == 0 && (b.prefix = b.prefix.replace("http://l.longtailvideo.com", "https://securel.longtailvideo.com"))
				} catch (f) {}
				g = a.utils.extend({}, b, d)
			}

			function l() {
				h = document.createElement("img"), h.id = e.id + "_jwplayer_logo", h.style.display = "none", h.onload = function(a) {
					_css(h, q()), o()
				};
				if (!g.file)
					return;
				g.file.indexOf("/") >= 0 ? h.src = g.file : h.src = g.prefix + g.file
			}

			function m() {
				g.link ? (h.onmouseover = p, h.onmouseout = o, h.onclick = n) : this.mouseEnabled = !1
			}

			function n(a) {
				typeof a != "undefined" && a.stopPropagation();
				if (!i)
					return;
				e.jwPause(), e.jwSetFullscreen(!1), g.link && window.open(g.link, g.linktarget);
				return
			}

			function o(a) {
				g.link && i && (h.style.opacity = g.out);
				return
			}

			function p(a) {
				i && (h.style.opacity = g.over);
				return
			}

			function q() {
				var a = {
					textDecoration: "none",
					position: "absolute",
					cursor: "pointer"
				};
				a.display = g.hide.toString() == "true" && !i ? "none" : "block";
				var b = g.position.toLowerCase().split("-");
				for (var c in b)
					a[b[c]] = parseInt(g.margin);
				return a
			}

			function r() {
				g.hide.toString() == "true" && (h.style.display = "block", h.style.opacity = 0, a.utils.fadeTo(h, g.out, .1, parseFloat(h.style.opacity)), f = setTimeout(function() {
					s()
				}, g.timeout * 1e3)), i = !0
			}

			function s() {
				i = !1, g.hide.toString() == "true" && a.utils.fadeTo(h, 0, .1, parseFloat(h.style.opacity))
			}

			function t(b) {
				b.newstate == a.api.events.state.BUFFERING && (clearTimeout(f), r())
			}
			var e = c,
				f, g, h, i = !1;
			j();
			if (!g.file)
				return;
			return this.resize = function(a, b) {}, this.getDisplayElement = function() {
				return h
			}, this
		}
	}(jwplayer),
	function(a) {
		var b = {
			ended: a.api.events.state.IDLE,
			playing: a.api.events.state.PLAYING,
			pause: a.api.events.state.PAUSED,
			buffering: a.api.events.state.BUFFERING
		}, c = a.utils,
			d = c.isMobile(),
			e, f, g = {};
		a.html5.mediavideo = function(h, i) {
			function B(a, b) {
				return k[a] ? k[a] : (k[a] = function(a) {
					c.exists(a.target.parentNode) && b(a)
				}, k[a])
			}

			function C() {
				p = a.api.events.state.IDLE, v = !0, o = D(), o.setAttribute("x-webkit-airplay", "allow"), n.parentNode && (o.id = n.id, n.parentNode.replaceChild(o, n))
			}

			function D() {
				var a = g[m.id];
				a || (n.tagName.toLowerCase() == "video" ? a = n : a = document.createElement("video"), g[m.id] = a, a.id || (a.id = n.id));
				for (var b in j)
					a.addEventListener(b, B(b, j[b]), !0);
				return a
			}

			function E(b) {
				if (b == a.api.events.state.PAUSED && p == a.api.events.state.IDLE)
					return;
				if (d)
					switch (b) {
						case a.api.events.state.PLAYING:
							T();
							break;
						case a.api.events.state.BUFFERING:
						case a.api.events.state.PAUSED:
							U()
				}
				if (p != b) {
					var c = p;
					m.state = p = b, V(a.api.events.JWPLAYER_PLAYER_STATE, {
						oldstate: c,
						newstate: b
					})
				}
			}

			function F(a) {}

			function G(b) {
				var c = Math.round(o.volume * 100);
				V(a.api.events.JWPLAYER_MEDIA_VOLUME, {
					volume: c
				}, !0), V(a.api.events.JWPLAYER_MEDIA_MUTE, {
					mute: o.muted
				}, !0)
			}

			function H(b) {
				if (!v)
					return;
				var d;
				if (c.exists(b) && b.lengthComputable && b.total)
					d = b.loaded / b.total * 100;
				else if (c.exists(o.buffered) && o.buffered.length > 0) {
					var e = o.buffered.length - 1;
					e >= 0 && (d = o.buffered.end(e) / o.duration * 100)
				}
				c.useNativeFullscreen() && c.exists(o.webkitDisplayingFullscreen) && m.fullscreen != o.webkitDisplayingFullscreen && V(a.api.events.JWPLAYER_FULLSCREEN, {
					fullscreen: o.webkitDisplayingFullscreen
				}, !0), y === !1 && p == a.api.events.state.BUFFERING && (V(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL), y = !0), x || (d == 100 && (x = !0), c.exists(d) && d > m.buffer && (m.buffer = Math.round(d), V(a.api.events.JWPLAYER_MEDIA_BUFFER, {
					bufferPercent: Math.round(d)
				})))
			}

			function I(b) {
				if (!v)
					return;
				if (c.exists(b) && c.exists(b.target)) {
					w > 0 && !isNaN(b.target.duration) && (isNaN(m.duration) || m.duration < 1) && (b.target.duration == Infinity ? m.duration = 0 : m.duration = Math.round(b.target.duration * 10) / 10), !q && o.readyState > 0 && E(a.api.events.state.PLAYING);
					if (p == a.api.events.state.PLAYING) {
						if (o.readyState > 0 && (t > -1 || !q)) {
							q = !0;
							try {
								o.currentTime != t && t > -1 && (o.currentTime = t, t = -1)
							} catch (d) {}
							o.volume = m.volume / 100, o.muted = m.mute
						}
						m.position = m.duration > 0 ? Math.round(b.target.currentTime * 10) / 10 : 0, V(a.api.events.JWPLAYER_MEDIA_TIME, {
							position: m.position,
							duration: m.duration
						});
						if (m.position >= m.duration && (m.position > 0 || m.duration > 0)) {
							Q();
							return
						}
					}
				}
				H(b)
			}

			function J(a) {}

			function K(a) {
				if (!v)
					return;
				e && f && (o.style.width = e, o.style.height = f, e = _previousHieght = 0), b[a.type] && (a.type == "ended" ? Q() : E(b[a.type]))
			}

			function L(b) {
				if (!v)
					return;
				var c = Math.round(o.duration * 10) / 10,
					d = {
						height: o.videoHeight,
						width: o.videoWidth,
						duration: c
					};
				w || (m.duration < c || isNaN(m.duration)) && o.duration != Infinity && (m.duration = c), V(a.api.events.JWPLAYER_MEDIA_META, {
					metadata: d
				})
			}

			function M(b) {
				if (!v)
					return;
				if (p == a.api.events.state.IDLE)
					return;
				var d = "There was an error: ";
				if (b.target.error && b.target.tagName.toLowerCase() == "video" || b.target.parentNode.error && b.target.parentNode.tagName.toLowerCase() == "video") {
					var e = c.exists(b.target.error) ? b.target.error : b.target.parentNode.error;
					switch (e.code) {
						case e.MEDIA_ERR_ABORTED:
							c.log("User aborted the video playback.");
							return;
						case e.MEDIA_ERR_NETWORK:
							d = "A network error caused the video download to fail part-way: ";
							break;
						case e.MEDIA_ERR_DECODE:
							d = "The video playback was aborted due to a corruption problem or because the video used features your browser did not support: ";
							break;
						case e.MEDIA_ERR_SRC_NOT_SUPPORTED:
							d = "The video could not be loaded, either because the server or network failed or because the format is not supported: ";
							break;
						default:
							d = "An unknown error occurred: "
					}
				} else {
					if (b.target.tagName.toLowerCase() != "source") {
						c.log("An unknown error occurred.  Continuing...");
						return
					}
					z--;
					if (z > 0)
						return;
					if (c.userAgentMatch(/firefox/i)) {
						c.log("The video could not be loaded, either because the server or network failed or because the format is not supported."), A(!1);
						return
					}
					d = "The video could not be loaded, either because the server or network failed or because the format is not supported: "
				}
				A(!1), d += N(), _error = !0, V(a.api.events.JWPLAYER_ERROR, {
					message: d
				});
				return
			}

			function N() {
				var b = "";
				for (var c in r.levels) {
					var d = r.levels[c],
						e = n.ownerDocument.createElement("source");
					b += a.utils.getAbsolutePath(d.file), c < r.levels.length - 1 && (b += ", ")
				}
				return b
			}

			function O() {
				c.exists(s) || (s = setInterval(function() {
					H()
				}, 100))
			}

			function P() {
				clearInterval(s), s = null
			}

			function Q() {
				p == a.api.events.state.PLAYING && (A(!1), V(a.api.events.JWPLAYER_MEDIA_BEFORECOMPLETE), V(a.api.events.JWPLAYER_MEDIA_COMPLETE))
			}

			function R(b) {
				c.exists(o.webkitDisplayingFullscreen) && m.fullscreen && !o.webkitDisplayingFullscreen && V(a.api.events.JWPLAYER_FULLSCREEN, {
					fullscreen: !1
				}, !0)
			}

			function S(a) {
				if (a.length > 0 && c.userAgentMatch(/Safari/i) && !c.userAgentMatch(/Chrome/i)) {
					var b = -1;
					for (var d = 0; d < a.length; d++)
						switch (c.extension(a[d].file)) {
							case "mp4":
								b < 0 && (b = d);
								break;
							case "webm":
								a.splice(d, 1)
					}
					if (b > 0) {
						var e = a.splice(b, 1)[0];
						a.unshift(e)
					}
				}
			}

			function T() {
				setTimeout(function() {
					o.setAttribute("controls", "controls")
				}, 100)
			}

			function U() {
				setTimeout(function() {
					o.removeAttribute("controls")
				}, 250)
			}

			function V(a, b, c) {
				if (v || c)
					b ? l.sendEvent(a, b) : l.sendEvent(a)
			}
			var j = {
				abort: F,
				canplay: K,
				canplaythrough: K,
				durationchange: L,
				emptied: F,
				ended: K,
				error: M,
				loadeddata: L,
				loadedmetadata: L,
				loadstart: K,
				pause: K,
				play: F,
				playing: K,
				progress: H,
				ratechange: F,
				seeked: K,
				seeking: K,
				stalled: K,
				suspend: K,
				timeupdate: I,
				volumechange: G,
				waiting: K,
				canshowcurrentframe: F,
				dataunavailable: F,
				empty: F,
				load: J,
				loadedfirstframe: F,
				webkitfullscreenchange: R
			}, k = {}, l = new a.html5.eventdispatcher;
			c.extend(this, l);
			var m = h,
				n = i,
				o, p, q, r, s, t, u = !1,
				v = !1,
				w = !1,
				x, y, z;
			C(), this.load = function(b, g) {
				typeof g == "undefined" && (g = !0);
				if (!v)
					return;
				r = b, w = r.duration > 0, m.duration = r.duration, c.empty(o), o.style.display = "block", o.style.opacity = 1, e && f && (o.style.width = e, o.style.height = f, e = _previousHieght = 0), z = 0, S(b.levels);
				if (b.levels && b.levels.length > 0)
					if (b.levels.length == 1 || c.isIOS())
						o.src = b.levels[0].file;
					else {
						o.src && o.removeAttribute("src");
						for (var h = 0; h < b.levels.length; h++) {
							var i = o.ownerDocument.createElement("source");
							i.src = b.levels[h].file, o.appendChild(i), z++
						}
					} else
						o.src = b.file;
				o.volume = m.volume / 100, o.muted = m.mute, d && T(), x = y = q = !1, m.buffer = 0, c.exists(b.start) || (b.start = 0), t = b.start > 0 ? b.start : -1, V(a.api.events.JWPLAYER_MEDIA_LOADED), (!d && b.levels.length == 1 || !u) && o.load(), u = !1, g && (E(a.api.events.state.BUFFERING), V(a.api.events.JWPLAYER_MEDIA_BUFFER, {
					bufferPercent: 0
				}), O()), o.videoWidth > 0 && o.videoHeight > 0 && L()
			}, this.play = function() {
				if (!v)
					return;
				O(), y ? E(a.api.events.state.PLAYING) : (o.load(), E(a.api.events.state.BUFFERING)), o.play()
			}, this.pause = function() {
				if (!v)
					return;
				o.pause(), E(a.api.events.state.PAUSED)
			}, this.seek = function(a) {
				if (!v)
					return;
				!q && o.readyState > 0 ? !(m.duration <= 0 || isNaN(m.duration)) && !(m.position <= 0 || isNaN(m.position)) && (o.currentTime = a, o.play()) : t = a
			};
			var A = this.stop = function(b) {
				if (!v)
					return;
				c.exists(b) || (b = !0), P();
				if (b) {
					y = !1;
					var d = navigator.userAgent;
					if (o.webkitSupportsFullscreen)
						try {
							o.webkitExitFullscreen()
					} catch (g) {}
					o.style.opacity = 0, U(), c.isIE() ? o.src = "" : o.removeAttribute("src"), c.empty(o), o.load(), u = !0
				}
				if (c.isIPod())
					e = o.style.width, f = o.style.height, o.style.width = 0, o.style.height = 0;
				else if (c.isIPad()) {
					o.style.display = "none";
					try {
						o.webkitExitFullscreen()
					} catch (h) {}
				}
				E(a.api.events.state.IDLE)
			};
			this.fullscreen = function(a) {
				a === !0 ? this.resize("100%", "100%") : this.resize(m.config.width, m.config.height)
			}, this.resize = function(a, b) {}, this.volume = function(b) {
				d || (o.volume = b / 100, V(a.api.events.JWPLAYER_MEDIA_VOLUME, {
					volume: b / 100
				}))
			}, this.mute = function(b) {
				d || (o.muted = b, V(a.api.events.JWPLAYER_MEDIA_MUTE, {
					mute: b
				}))
			}, this.getDisplayElement = function() {
				return o
			}, this.hasChrome = function() {
				return d && p == a.api.events.state.PLAYING
			}, this.detachMedia = function() {
				return v = !1, this.getDisplayElement()
			}, this.attachMedia = function() {
				v = !0
			}, this.destroy = function() {
				if (o && o.parentNode) {
					P();
					for (var a in j)
						o.removeEventListener(a, B(a, j[a]), !0);
					c.empty(o), n = o.parentNode, o.parentNode.removeChild(o), delete g[m.id], o = null
				}
			}
		}
	}(jwplayer),
	function(a) {
		var b = {
			ended: a.api.events.state.IDLE,
			playing: a.api.events.state.PLAYING,
			pause: a.api.events.state.PAUSED,
			buffering: a.api.events.state.BUFFERING
		}, c = a.utils.css;
		a.html5.mediayoutube = function(b, d) {
			function k(b) {
				if (h != b) {
					var c = h;
					f.state = b, h = b, e.sendEvent(a.api.events.JWPLAYER_PLAYER_STATE, {
						oldstate: c,
						newstate: b
					})
				}
			}

			function l(a) {
				var b = a.levels[0].file;
				b = ["http://www.youtube.com/v/", m(b), "&amp;hl=en_US&amp;fs=1&autoplay=1"].join(""), i = document.createElement("object"), i.id = g.id, i.style.position = "absolute";
				var c = {
					movie: b,
					allowfullscreen: "true",
					allowscriptaccess: "always"
				};
				for (var d in c) {
					var e = document.createElement("param");
					e.name = d, e.value = c[d], i.appendChild(e)
				}
				j = document.createElement("embed"), i.appendChild(j);
				var f = {
					src: b,
					type: "application/x-shockwave-flash",
					allowfullscreen: "true",
					allowscriptaccess: "always",
					width: i.width,
					height: i.height
				};
				for (var h in f)
					j.setAttribute(h, f[h]);
				i.appendChild(j), i.style.zIndex = 2147483e3, g != i && g.parentNode && g.parentNode.replaceChild(i, g), g = i
			}

			function m(a) {
				var b = a.split(/\?|\#\!/),
					c = "";
				for (var d = 0; d < b.length; d++)
					b[d].substr(0, 2) == "v=" && (c = b[d].substr(2));
				return c == "" && (a.indexOf("/v/") >= 0 ? c = a.substr(a.indexOf("/v/") + 3) : a.indexOf("youtu.be") >= 0 ? c = a.substr(a.indexOf("youtu.be/") + 9) : c = a), c.indexOf("?") > -1 && (c = c.substr(0, c.indexOf("?"))), c.indexOf("&") > -1 && (c = c.substr(0, c.indexOf("&"))), c
			}
			var e = new a.html5.eventdispatcher;
			a.utils.extend(this, e);
			var f = b,
				g = document.getElementById(d.id),
				h = a.api.events.state.IDLE,
				i, j;
			return this.getDisplayElement = this.detachMedia = function() {
				return g
			}, this.attachMedia = function() {}, this.play = function() {
				h == a.api.events.state.IDLE ? (e.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER, {
					bufferPercent: 100
				}), e.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL), k(a.api.events.state.PLAYING)) : h == a.api.events.state.PAUSED && k(a.api.events.state.PLAYING)
			}, this.pause = function() {
				k(a.api.events.state.PAUSED)
			}, this.seek = function(a) {}, this.stop = function(b) {
				_utils.exists(b) || (b = !0), f.position = 0, k(a.api.events.state.IDLE), b && c(g, {
					display: "none"
				})
			}, this.volume = function(b) {
				f.setVolume(b), e.sendEvent(a.api.events.JWPLAYER_MEDIA_VOLUME, {
					volume: Math.round(b)
				})
			}, this.mute = function(b) {
				g.muted = b, e.sendEvent(a.api.events.JWPLAYER_MEDIA_MUTE, {
					mute: b
				})
			}, this.resize = function(a, b) {
				a * b > 0 && i && (i.width = j.width = a, i.height = j.height = b)
			}, this.fullscreen = function(a) {
				a === !0 ? this.resize("100%", "100%") : this.resize(f.config.width, f.config.height)
			}, this.load = function(b) {
				l(b), c(i, {
					display: "block"
				}), k(a.api.events.state.BUFFERING), e.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER, {
					bufferPercent: 0
				}), e.sendEvent(a.api.events.JWPLAYER_MEDIA_LOADED), this.play()
			}, this.hasChrome = function() {
				return h != a.api.events.state.IDLE
			}, this.embed = j, this
		}
	}(jwplayer),
	function(jwplayer) {
		var _configurableStateVariables = ["width", "height", "start", "duration", "volume", "mute", "fullscreen", "item", "plugins", "stretching"],
			_utils = jwplayer.utils;
		jwplayer.html5.model = function(api, container, options) {
			function _loadExternal(a) {
				var b = new jwplayer.html5.playlistloader;
				b.addEventListener(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED, function(a) {
					_model.playlist = new jwplayer.html5.playlist(a), _loadComplete(!0)
				}), b.addEventListener(jwplayer.api.events.JWPLAYER_ERROR, function(a) {
					_model.playlist = new jwplayer.html5.playlist({
						playlist: []
					}), _loadComplete(!1)
				}), b.load(a)
			}

			function _loadComplete() {
				_model.config.shuffle ? _model.item = _getShuffleItem() : (_model.config.item >= _model.playlist.length ? _model.config.item = _model.playlist.length - 1 : _model.config.item < 0 && (_model.config.item = 0), _model.item = _model.config.item), _model.position = 0, _model.duration = _model.playlist.length > 0 ? _model.playlist[_model.item].duration : 0, _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED, {
					playlist: _model.playlist
				}), _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_ITEM, {
					index: _model.item
				})
			}

			function _getShuffleItem() {
				var a = null;
				if (_model.playlist.length > 1)
					while (!jwplayer.utils.exists(a))
						a = Math.floor(Math.random() * _model.playlist.length), a == _model.item && (a = null);
				else
					a = 0;
				return a
			}

			function forward(a) {
				switch (a.type) {
					case jwplayer.api.events.JWPLAYER_MEDIA_LOADED:
						_container = _media.getDisplayElement();
						break;
					case jwplayer.api.events.JWPLAYER_MEDIA_MUTE:
						this.mute = a.mute;
						break;
					case jwplayer.api.events.JWPLAYER_MEDIA_VOLUME:
						this.volume = a.volume
				}
				_eventDispatcher.sendEvent(a.type, a)
			}
			var _api = api,
				_container = container,
				_cookies = _utils.getCookies(),
				_model = {
					id: _container.id,
					playlist: [],
					state: jwplayer.api.events.state.IDLE,
					position: 0,
					buffer: 0,
					container: _container,
					config: {
						width: 480,
						height: 320,
						item: -1,
						skin: undefined,
						file: undefined,
						image: undefined,
						start: 0,
						duration: 0,
						bufferlength: 5,
						volume: _cookies.volume ? _cookies.volume : 90,
						mute: _cookies.mute && _cookies.mute.toString().toLowerCase() == "true" ? !0 : !1,
						fullscreen: !1,
						repeat: "",
						stretching: jwplayer.utils.stretching.UNIFORM,
						autostart: !1,
						debug: undefined,
						screencolor: undefined
					}
				}, _media, _eventDispatcher = new jwplayer.html5.eventdispatcher,
				_components = ["display", "logo", "controlbar", "playlist", "dock"];
			jwplayer.utils.extend(_model, _eventDispatcher);
			for (var option in options) {
				if (typeof options[option] == "string") {
					var type = /color$/.test(option) ? "color" : null;
					options[option] = jwplayer.utils.typechecker(options[option], type)
				}
				var config = _model.config,
					path = option.split(".");
				for (var edge in path)
					edge == path.length - 1 ? config[path[edge]] = options[option] : (jwplayer.utils.exists(config[path[edge]]) || (config[path[edge]] = {}), config = config[path[edge]])
			}
			for (var index in _configurableStateVariables) {
				var configurableStateVariable = _configurableStateVariables[index];
				_model[configurableStateVariable] = _model.config[configurableStateVariable]
			}
			var pluginorder = _components.concat([]);
			if (jwplayer.utils.exists(_model.plugins) && typeof _model.plugins == "string") {
				var userplugins = _model.plugins.split(",");
				for (var userplugin in userplugins)
					typeof userplugins[userplugin] == "string" && pluginorder.push(userplugins[userplugin].replace(/^\s+|\s+$/g, ""))
			}
			jwplayer.utils.isMobile() ? (pluginorder = ["display", "logo", "dock", "playlist"], jwplayer.utils.exists(_model.config.repeat) || (_model.config.repeat = "list")) : _model.config.chromeless && (pluginorder = ["logo", "dock", "playlist"], jwplayer.utils.exists(_model.config.repeat) || (_model.config.repeat = "list")), _model.plugins = {
				order: pluginorder,
				config: {},
				object: {}
			};
			if (typeof _model.config.components != "undefined")
				for (var component in _model.config.components)
					_model.plugins.config[component] = _model.config.components[component];
			var playlistVisible = !1;
			for (var pluginIndex in _model.plugins.order) {
				var pluginName = _model.plugins.order[pluginIndex],
					pluginConfig = jwplayer.utils.exists(_model.plugins.config[pluginName]) ? _model.plugins.config[pluginName] : {};
				_model.plugins.config[pluginName] = jwplayer.utils.exists(_model.plugins.config[pluginName]) ? jwplayer.utils.extend(_model.plugins.config[pluginName], pluginConfig) : pluginConfig, jwplayer.utils.exists(_model.plugins.config[pluginName].position) ? (pluginName == "playlist" && (playlistVisible = !0), _model.plugins.config[pluginName].position = _model.plugins.config[pluginName].position.toString().toUpperCase()) : pluginName == "playlist" ? _model.plugins.config[pluginName].position = jwplayer.html5.view.positions.NONE : _model.plugins.config[pluginName].position = jwplayer.html5.view.positions.OVER
			}
			_model.plugins.config.controlbar && playlistVisible && (_model.plugins.config.controlbar.hideplaylistcontrols = !0);
			if (typeof _model.plugins.config.dock != "undefined") {
				if (typeof _model.plugins.config.dock != "object") {
					var position = _model.plugins.config.dock.toString().toUpperCase();
					_model.plugins.config.dock = {
						position: position
					}
				}
				typeof _model.plugins.config.dock.position != "undefined" && (_model.plugins.config.dock.align = _model.plugins.config.dock.position, _model.plugins.config.dock.position = jwplayer.html5.view.positions.OVER);
				if (typeof _model.plugins.config.dock.idlehide == "undefined")
					try {
						_model.plugins.config.dock.idlehide = _model.plugins.config.controlbar.idlehide
				} catch (e) {}
			}
			_model.loadPlaylist = function(arg) {
				var input;
				if (typeof arg == "string")
					if (arg.indexOf("[") == 0 || arg.indexOf("{") == "0")
						try {
							input = eval(arg)
					} catch (err) {
					input = arg
				} else
					input = arg;
				else
					input = arg;
				var config;
				switch (jwplayer.utils.typeOf(input)) {
					case "object":
						config = input;
						break;
					case "array":
						config = {
							playlist: input
						};
						break;
					default:
						config = {
							file: input
						}
				}
				_model.playlist = new jwplayer.html5.playlist(config), _model.item = _model.config.item >= 0 ? _model.config.item : 0, !_model.playlist[0].provider && _model.playlist[0].file ? _loadExternal(_model.playlist[0].file) : _loadComplete()
			};
			var _mediaProviders = {};
			return _model.setActiveMediaProvider = function(a) {
				a.provider == "audio" && (a.provider = "sound");
				var b = a.provider,
					c = _media ? _media.getDisplayElement() : null;
				if (b == "sound" || b == "http" || b == "")
					b = "video";
				if (!jwplayer.utils.exists(_mediaProviders[b])) {
					switch (b) {
						case "video":
							_media = new jwplayer.html5.mediavideo(_model, c ? c : _container);
							break;
						case "youtube":
							_media = new jwplayer.html5.mediayoutube(_model, c ? c : _container)
					}
					if (!jwplayer.utils.exists(_media))
						return !1;
					_media.addGlobalListener(forward), _mediaProviders[b] = _media
				} else
					_media != _mediaProviders[b] && (_media && _media.stop(), _media = _mediaProviders[b]);
				return !0
			}, _model.getMedia = function() {
				return _media
			}, _model.seek = function(a) {
				return _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_MEDIA_SEEK, {
					position: _model.position,
					offset: a
				}), _media.seek(a)
			}, _model.setVolume = function(a) {
				_utils.saveCookie("volume", a), _model.volume = a
			}, _model.setMute = function(a) {
				_utils.saveCookie("mute", a), _model.mute = a
			}, _model.setupPlugins = function() {
				if (!jwplayer.utils.exists(_model.plugins) || !jwplayer.utils.exists(_model.plugins.order) || _model.plugins.order.length == 0)
					return jwplayer.utils.log("No plugins to set up"), _model;
				for (var a = 0; a < _model.plugins.order.length; a++)
					try {
						var b = _model.plugins.order[a];
						jwplayer.utils.exists(jwplayer.html5[b]) ? b == "playlist" ? _model.plugins.object[b] = new jwplayer.html5.playlistcomponent(_api, _model.plugins.config[b]) : _model.plugins.object[b] = new jwplayer.html5[b](_api, _model.plugins.config[b]) : _model.plugins.order.splice(plugin, plugin + 1), typeof _model.plugins.object[b].addGlobalListener == "function" && _model.plugins.object[b].addGlobalListener(forward)
				} catch (c) {
					jwplayer.utils.log("Could not setup " + b)
				}
			}, _model
		}
	}(jwplayer),
	function(a) {
		a.html5.playlist = function(b) {
			var c = [];
			if (b.playlist && b.playlist instanceof Array && b.playlist.length > 0)
				for (var d in b.playlist)
					isNaN(parseInt(d)) || c.push(new a.html5.playlistitem(b.playlist[d]));
			else
				c.push(new a.html5.playlistitem(b));
			return c
		}
	}(jwplayer),
	function(a) {
		var b = {
			size: 180,
			position: a.html5.view.positions.NONE,
			itemheight: 60,
			thumbs: !0,
			fontcolor: "#000000",
			overcolor: "",
			activecolor: "",
			backgroundcolor: "#f8f8f8",
			font: "_sans",
			fontsize: "",
			fontstyle: "",
			fontweight: ""
		}, c = {
				_sans: "Arial, Helvetica, sans-serif",
				_serif: "Times, Times New Roman, serif",
				_typewriter: "Courier New, Courier, monospace"
			};
		_utils = a.utils, _css = _utils.css, _hide = function(a) {
			_css(a, {
				display: "none"
			})
		}, _show = function(a) {
			_css(a, {
				display: "block"
			})
		}, a.html5.playlistcomponent = function(d, e) {
			function p() {
				h = document.createElement("div"), h.id = f.id + "_jwplayer_playlistcomponent", h.style.overflow = "hidden";
				switch (g.position) {
					case a.html5.view.positions.RIGHT:
					case a.html5.view.positions.LEFT:
						h.style.width = g.size + "px";
						break;
					case a.html5.view.positions.TOP:
					case a.html5.view.positions.BOTTOM:
						h.style.height = g.size + "px"
				}
				B(), o.item && (g.itemheight = o.item.height), h.style.backgroundColor = "#C6C6C6", f.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, u), f.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, z), f.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, A)
			}

			function q() {
				var a = document.createElement("ul");
				return _css(a, {
					width: h.style.width,
					minWidth: h.style.width,
					height: h.style.height,
					backgroundColor: g.backgroundcolor,
					backgroundImage: o.background ? "url(" + o.background.src + ")" : "",
					color: g.fontcolor,
					listStyle: "none",
					margin: 0,
					padding: 0,
					fontFamily: c[g.font] ? c[g.font] : c._sans,
					fontSize: (g.fontsize ? g.fontsize : 11) + "px",
					fontStyle: g.fontstyle,
					fontWeight: g.fontweight,
					overflowY: "auto"
				}), a
			}

			function r(a) {
				return function() {
					var b = m.getElementsByClassName("item")[a],
						c = g.fontcolor,
						d = o.item ? "url(" + o.item.src + ")" : "";
					a == f.jwGetPlaylistIndex() && (g.activecolor !== "" && (c = g.activecolor), o.itemActive && (d = "url(" + o.itemActive.src + ")")), _css(b, {
						color: g.overcolor !== "" ? g.overcolor : c,
						backgroundImage: o.itemOver ? "url(" + o.itemOver.src + ")" : d
					})
				}
			}

			function s(a) {
				return function() {
					var b = m.getElementsByClassName("item")[a],
						c = g.fontcolor,
						d = o.item ? "url(" + o.item.src + ")" : "";
					a == f.jwGetPlaylistIndex() && (g.activecolor !== "" && (c = g.activecolor), o.itemActive && (d = "url(" + o.itemActive.src + ")")), _css(b, {
						color: c,
						backgroundImage: d
					})
				}
			}

			function t(b) {
				var c = k[b],
					d = document.createElement("li");
				d.className = "item", _css(d, {
					height: g.itemheight,
					display: "block",
					cursor: "pointer",
					backgroundImage: o.item ? "url(" + o.item.src + ")" : "",
					backgroundSize: "100% " + g.itemheight + "px"
				}), d.onmouseover = r(b), d.onmouseout = s(b);
				var e = document.createElement("div"),
					f = new Image,
					h = 0,
					l = 0,
					m = 0;
				y() && (c.image || c["playlist.image"] || o.itemImage) && (f.className = "image", o.itemImage ? (h = (g.itemheight - o.itemImage.height) / 2, l = o.itemImage.width, m = o.itemImage.height) : (l = g.itemheight * 4 / 3, m = g.itemheight), _css(e, {
					height: m,
					width: l,
					"float": "left",
					styleFloat: "left",
					cssFloat: "left",
					margin: "0 5px 0 0",
					background: "black",
					overflow: "hidden",
					margin: h + "px",
					position: "relative"
				}), _css(f, {
					position: "relative"
				}), e.appendChild(f), f.onload = function() {
					a.utils.stretch(a.utils.stretching.FILL, f, l, m, this.naturalWidth, this.naturalHeight)
				}, c["playlist.image"] ? f.src = c["playlist.image"] : c.image ? f.src = c.image : o.itemImage && (f.src = o.itemImage.src), d.appendChild(e));
				var n = i - l - h * 2;
				j < g.itemheight * k.length && (n -= 15);
				var p = document.createElement("div");
				_css(p, {
					position: "relative",
					height: "100%",
					overflow: "hidden"
				});
				var q = document.createElement("span");
				c.duration > 0 && (q.className = "duration", _css(q, {
					fontSize: (g.fontsize ? g.fontsize : 11) + "px",
					fontWeight: g.fontweight ? g.fontweight : "bold",
					width: "40px",
					height: g.fontsize ? g.fontsize + 10 : 20,
					lineHeight: 24,
					"float": "right",
					styleFloat: "right",
					cssFloat: "right"
				}), q.innerHTML = _utils.timeFormat(c.duration), p.appendChild(q));
				var t = document.createElement("span");
				t.className = "title", _css(t, {
					padding: "5px 5px 0 " + (h ? 0 : "5px"),
					height: g.fontsize ? g.fontsize + 10 : 20,
					lineHeight: g.fontsize ? g.fontsize + 10 : 20,
					overflow: "hidden",
					"float": "left",
					styleFloat: "left",
					cssFloat: "left",
					width: (c.duration > 0 ? n - 50 : n) - 10 + "px",
					fontSize: (g.fontsize ? g.fontsize : 13) + "px",
					fontWeight: g.fontweight ? g.fontweight : "bold"
				}), t.innerHTML = c ? c.title : "", p.appendChild(t);
				if (c.description) {
					var u = document.createElement("span");
					u.className = "description", _css(u, {
						display: "block",
						"float": "left",
						styleFloat: "left",
						cssFloat: "left",
						margin: 0,
						paddingLeft: t.style.paddingLeft,
						paddingRight: t.style.paddingRight,
						lineHeight: (g.fontsize ? g.fontsize + 4 : 16) + "px",
						overflow: "hidden",
						position: "relative"
					}), u.innerHTML = c.description, p.appendChild(u)
				}
				return d.appendChild(p), d
			}

			function u(a) {
				h.innerHTML = "", k = v();
				if (!k)
					return;
				items = [], m = q();
				for (var b = 0; b < k.length; b++) {
					var c = t(b);
					c.onclick = w(b), m.appendChild(c), items.push(c)
				}
				n = f.jwGetPlaylistIndex(), s(n)(), h.appendChild(m);
				if (_utils.isIOS() && window.iScroll) {
					m.style.height = g.itemheight * k.length + "px";
					var d = new iScroll(h.id)
				}
			}

			function v() {
				var a = f.jwGetPlaylist(),
					b = [];
				for (var c = 0; c < a.length; c++)
					a[c]["ova.hidden"] || b.push(a[c]);
				return b
			}

			function w(a) {
				return function() {
					f.jwPlaylistItem(a), f.jwPlay(!0)
				}
			}

			function x() {
				m.scrollTop = f.jwGetPlaylistIndex() * g.itemheight
			}

			function y() {
				return g.thumbs.toString().toLowerCase() == "true"
			}

			function z(a) {
				n >= 0 && (s(n)(), n = a.index), s(a.index)(), x()
			}

			function A() {
				if (g.position == a.html5.view.positions.OVER)
					switch (f.jwGetState()) {
						case a.api.events.state.IDLE:
							_show(h);
							break;
						default:
							_hide(h)
				}
			}

			function B() {
				for (var a in o)
					o[a] = C(a)
			}

			function C(a) {
				return f.skin.getSkinElement("playlist", a)
			}
			var f = d,
				g = a.utils.extend({}, b, f.skin.getComponentSettings("playlist"), e);
			if (g.position == a.html5.view.positions.NONE || typeof a.html5.view.positions[g.position] == "undefined")
				return;
			var h, i, j, k, l, m, n = -1,
				o = {
					background: undefined,
					item: undefined,
					itemOver: undefined,
					itemImage: undefined,
					itemActive: undefined
				};
			return this.getDisplayElement = function() {
				return h
			}, this.resize = function(a, b) {
				i = a, j = b;
				if (f.jwGetFullscreen())
					_hide(h);
				else {
					var c = {
						display: "block",
						width: i,
						height: j
					};
					_css(h, c)
				}
			}, this.show = function() {
				_show(h)
			}, this.hide = function() {
				_hide(h)
			}, p(), this
		}
	}(jwplayer),
	function(a) {
		function b(b) {
			if (a.utils.isYouTube(b.file))
				return "youtube";
			var c = a.utils.extension(b.file),
				d;
			if (c && a.utils.extensionmap[c]) {
				if (c == "m3u8")
					return "video";
				d = a.utils.extensionmap[c].html5
			} else
				b.type && (d = b.type);
			if (d) {
				var e = d.split("/")[0];
				if (e == "audio")
					return "sound";
				if (e == "video")
					return e
			}
			return ""
		}
		a.html5.playlistitem = function(c) {
			var d = {
				author: "",
				date: "",
				description: "",
				image: "",
				link: "",
				mediaid: "",
				tags: "",
				title: "",
				provider: "",
				file: "",
				streamer: "",
				duration: -1,
				start: 0,
				currentLevel: -1,
				levels: []
			}, e = a.utils.extend({}, d, c);
			return e.type && (e.provider = e.type, delete e.type), e.levels.length === 0 && (e.levels[0] = new a.html5.playlistitemlevel(e)), e.provider ? e.provider = e.provider.toLowerCase() : e.provider = b(e.levels[0]), e
		}
	}(jwplayer),
	function(a) {
		a.html5.playlistitemlevel = function(b) {
			var c = {
				file: "",
				streamer: "",
				bitrate: 0,
				width: 0
			};
			for (var d in c)
				a.utils.exists(b[d]) && (c[d] = b[d]);
			return c
		}
	}(jwplayer),
	function(a) {
		a.html5.playlistloader = function() {
			function c(c) {
				var e = [];
				try {
					var e = a.utils.parsers.rssparser.parse(c.responseXML.firstChild);
					b.sendEvent(a.api.events.JWPLAYER_PLAYLIST_LOADED, {
						playlist: new a.html5.playlist({
							playlist: e
						})
					})
				} catch (f) {
					d("Could not parse the playlist")
				}
			}

			function d(c) {
				b.sendEvent(a.api.events.JWPLAYER_ERROR, {
					message: c ? c : "Could not load playlist an unknown reason."
				})
			}
			var b = new a.html5.eventdispatcher;
			a.utils.extend(this, b), this.load = function(b) {
				a.utils.ajax(b, c, d)
			}
		}
	}(jwplayer),
	function(a) {
		a.html5.skin = function() {
			var b = {}, c = !1;
			this.load = function(d, e) {
				new a.html5.skinloader(d, function(a) {
					c = !0, b = a, e()
				}, function() {
					new a.html5.skinloader("", function(a) {
						c = !0, b = a, e()
					})
				})
			}, this.getSkinElement = function(d, e) {
				if (c)
					try {
						return b[d].elements[e]
				} catch (f) {
					a.utils.log("No such skin component / element: ", [d, e])
				}
				return null
			}, this.getComponentSettings = function(a) {
				return c && b && b[a] ? b[a].settings : null
			}, this.getComponentLayout = function(a) {
				return c ? b[a].layout : null
			}
		}
	}(jwplayer),
	function(a) {
		a.html5.skinloader = function(b, c, d) {
			function l() {
				typeof j != "string" || j === "" ? m(a.html5.defaultSkin().xml) : a.utils.ajax(a.utils.getAbsolutePath(j), function(b) {
					try {
						if (a.utils.exists(b.responseXML)) {
							m(b.responseXML);
							return
						}
					} catch (c) {
						p()
					}
					m(a.html5.defaultSkin().xml)
				}, function(b) {
					m(a.html5.defaultSkin().xml)
				})
			}

			function m(b) {
				var c = b.getElementsByTagName("component");
				if (c.length === 0)
					return;
				for (var d = 0; d < c.length; d++) {
					var f = c[d].getAttribute("name"),
						g = {
							settings: {},
							elements: {},
							layout: {}
						};
					e[f] = g;
					var i = c[d].getElementsByTagName("elements")[0].getElementsByTagName("element");
					for (var j = 0; j < i.length; j++)
						o(i[j], f);
					var k = c[d].getElementsByTagName("settings")[0];
					if (k && k.childNodes.length > 0) {
						var l = k.getElementsByTagName("setting");
						for (var m = 0; m < l.length; m++) {
							var p = l[m].getAttribute("name"),
								q = l[m].getAttribute("value"),
								r = /color$/.test(p) ? "color" : null;
							e[f].settings[p] = a.utils.typechecker(q, r)
						}
					}
					var s = c[d].getElementsByTagName("layout")[0];
					if (s && s.childNodes.length > 0) {
						var t = s.getElementsByTagName("group");
						for (var u = 0; u < t.length; u++) {
							var v = t[u];
							e[f].layout[v.getAttribute("position")] = {
								elements: []
							};
							for (var w = 0; w < v.attributes.length; w++) {
								var x = v.attributes[w];
								e[f].layout[v.getAttribute("position")][x.name] = x.value
							}
							var y = v.getElementsByTagName("*");
							for (var z = 0; z < y.length; z++) {
								var A = y[z];
								e[f].layout[v.getAttribute("position")].elements.push({
									type: A.tagName
								});
								for (var B = 0; B < A.attributes.length; B++) {
									var C = A.attributes[B];
									e[f].layout[v.getAttribute("position")].elements[z][C.name] = C.value
								}
								a.utils.exists(e[f].layout[v.getAttribute("position")].elements[z].name) || (e[f].layout[v.getAttribute("position")].elements[z].name = A.tagName)
							}
						}
					}
					h = !1, n()
				}
			}

			function n() {
				clearInterval(i), k || (i = setInterval(function() {
					q()
				}, 100))
			}

			function o(b, c) {
				var d = new Image,
					f = b.getAttribute("name"),
					h = b.getAttribute("src"),
					i;
				if (h.indexOf("data:image/png;base64,") === 0)
					i = h;
				else {
					var l = a.utils.getAbsolutePath(j),
						m = l.substr(0, l.lastIndexOf("/"));
					i = [m, c, h].join("/")
				}
				e[c].elements[f] = {
					height: 0,
					width: 0,
					src: "",
					ready: !1,
					image: d
				}, d.onload = function(a) {
					r(d, f, c)
				}, d.onerror = function(a) {
					k = !0, n(), g()
				}, d.src = i
			}

			function p() {
				for (var a in e) {
					var b = e[a];
					for (var c in b.elements) {
						var d = b.elements[c],
							f = d.image;
						f.onload = null, f.onerror = null, delete d.image, delete b.elements[c]
					}
					delete e[a]
				}
			}

			function q() {
				for (var a in e)
					if (a != "properties")
						for (var b in e[a].elements)
							if (!e[a].elements[b].ready)
								return;
				h === !1 && (clearInterval(i), f(e))
			}

			function r(b, c, d) {
				e[d] && e[d].elements[c] ? (e[d].elements[c].height = b.height, e[d].elements[c].width = b.width, e[d].elements[c].src = b.src, e[d].elements[c].ready = !0, n()) : a.utils.log("Loaded an image for a missing element: " + d + "." + c)
			}
			var e = {}, f = c,
				g = d,
				h = !0,
				i, j = b,
				k = !1;
			l()
		}
	}(jwplayer),
	function(a) {
		a.html5.api = function(b, c) {
			function i() {
				f.state == a.api.events.state.PLAYING || f.state == a.api.events.state.BUFFERING ? h.pause() : h.play()
			}

			function j(a) {
				return function() {
					return f[a]
				}
			}

			function k(a, b, c) {
				return function() {
					var d = f.plugins.object[a];
					d && d[b] && typeof d[b] == "function" && d[b].apply(d, c)
				}
			}

			function m(a) {
				return function() {
					if (l && typeof l[a] == "function")
						return l[a].apply(this, arguments);
					_utils.log("Could not call instream method - instream API not initialized")
				}
			}

			function n() {
				f.config.playlistfile ? (f.addEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, o), f.loadPlaylist(f.config.playlistfile)) : typeof f.config.playlist == "string" ? (f.addEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, o), f.loadPlaylist(f.config.playlist)) : (f.loadPlaylist(f.config), setTimeout(o, 25))
			}

			function o(b) {
				f.removeEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, o), f.setupPlugins(), g.setup();
				var b = {
					id: d.id,
					version: d.version
				};
				h.playerReady(b)
			}
			var d = {}, e = document.createElement("div");
			b.parentNode.replaceChild(e, b), e.id = b.id, d.version = a.version, d.id = e.id;
			var f = new a.html5.model(d, e, c),
				g = new a.html5.view(d, e, f),
				h = new a.html5.controller(d, e, f, g);
			d.skin = new a.html5.skin, d.jwPlay = function(a) {
				typeof a == "undefined" ? i() : a.toString().toLowerCase() == "true" ? h.play() : h.pause()
			}, d.jwPause = function(a) {
				typeof a == "undefined" ? i() : a.toString().toLowerCase() == "true" ? h.pause() : h.play()
			}, d.jwStop = h.stop, d.jwSeek = h.seek, d.jwPlaylistItem = function(a) {
				if (!l)
					return h.item(a);
				if (l.playlistClickable())
					return l.jwInstreamDestroy(), h.item(a)
			}, d.jwPlaylistNext = h.next, d.jwPlaylistPrev = h.prev, d.jwResize = h.resize, d.jwLoad = h.load, d.jwDetachMedia = h.detachMedia, d.jwAttachMedia = h.attachMedia, d.jwGetPlaylistIndex = j("item"), d.jwGetPosition = j("position"), d.jwGetDuration = j("duration"), d.jwGetBuffer = j("buffer"), d.jwGetWidth = j("width"), d.jwGetHeight = j("height"), d.jwGetFullscreen = j("fullscreen"), d.jwSetFullscreen = h.setFullscreen, d.jwGetVolume = j("volume"), d.jwSetVolume = h.setVolume, d.jwGetMute = j("mute"), d.jwSetMute = h.setMute, d.jwGetStretching = function() {
				return f.stretching.toUpperCase()
			}, d.jwGetState = j("state"), d.jwGetVersion = function() {
				return d.version
			}, d.jwGetPlaylist = function() {
				return f.playlist
			}, d.jwAddEventListener = h.addEventListener, d.jwRemoveEventListener = h.removeEventListener, d.jwSendEvent = h.sendEvent, d.jwDockSetButton = function(a, b, c, d) {
				f.plugins.object.dock && f.plugins.object.dock.setButton && f.plugins.object.dock.setButton(a, b, c, d)
			}, d.jwControlbarShow = k("controlbar", "show"), d.jwControlbarHide = k("controlbar", "hide"), d.jwDockShow = k("dock", "show"), d.jwDockHide = k("dock", "hide"), d.jwDisplayShow = k("display", "show"), d.jwDisplayHide = k("display", "hide");
			var l;
			return d.jwLoadInstream = function(b, c) {
				l || (l = new a.html5.instream(d, f, g, h)), setTimeout(function() {
					l.load(b, c)
				}, 10)
			}, d.jwInstreamDestroy = function() {
				l && l.jwInstreamDestroy()
			}, d.jwInstreamAddEventListener = m("jwInstreamAddEventListener"), d.jwInstreamRemoveEventListener = m("jwInstreamRemoveEventListener"), d.jwInstreamGetState = m("jwInstreamGetState"), d.jwInstreamGetDuration = m("jwInstreamGetDuration"), d.jwInstreamGetPosition = m("jwInstreamGetPosition"), d.jwInstreamPlay = m("jwInstreamPlay"), d.jwInstreamPause = m("jwInstreamPause"), d.jwInstreamSeek = m("jwInstreamSeek"), d.jwDestroy = function() {
				h.destroy()
			}, d.jwGetLevel = function() {}, d.jwGetBandwidth = function() {}, d.jwGetLockState = function() {}, d.jwLock = function() {}, d.jwUnlock = function() {}, f.config.chromeless && !a.utils.isIOS() ? n() : d.skin.load(f.config.skin, n), d
		}
	}(jwplayer)
}(function(a, b) {
	function c(b, c) {
		var e = b.nodeName.toLowerCase();
		if ("area" === e) {
			var f = b.parentNode,
				g = f.name,
				h;
			return !b.href || !g || f.nodeName.toLowerCase() !== "map" ? !1 : (h = a("img[usemap=#" + g + "]")[0], !! h && d(h))
		}
		return (/input|select|textarea|button|object/.test(e) ? !b.disabled : "a" == e ? b.href || c : c) && d(b)
	}

	function d(b) {
		return !a(b).parents().andSelf().filter(function() {
			return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
		}).length
	}
	a.ui = a.ui || {};
	if (a.ui.version)
		return;
	a.extend(a.ui, {
		version: "1.8.24",
		keyCode: {
			ALT: 18,
			BACKSPACE: 8,
			CAPS_LOCK: 20,
			COMMA: 188,
			COMMAND: 91,
			COMMAND_LEFT: 91,
			COMMAND_RIGHT: 93,
			CONTROL: 17,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			INSERT: 45,
			LEFT: 37,
			MENU: 93,
			NUMPAD_ADD: 107,
			NUMPAD_DECIMAL: 110,
			NUMPAD_DIVIDE: 111,
			NUMPAD_ENTER: 108,
			NUMPAD_MULTIPLY: 106,
			NUMPAD_SUBTRACT: 109,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SHIFT: 16,
			SPACE: 32,
			TAB: 9,
			UP: 38,
			WINDOWS: 91
		}
	}), a.fn.extend({
		propAttr: a.fn.prop || a.fn.attr,
		_focus: a.fn.focus,
		focus: function(b,
			c) {
			return typeof b == "number" ? this.each(function() {
				var d = this;
				setTimeout(function() {
					a(d).focus(),
					c && c.call(d)
				}, b)
			}) : this._focus.apply(this, arguments)
		},
		scrollParent: function() {
			var b;
			return a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? b = this.parents().filter(function() {
				return /(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
			}).eq(0) : b = this.parents().filter(function() {
				return /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
			}).eq(0), /fixed/.test(this.css("position")) || !b.length ? a(document) : b
		},
		zIndex: function(c) {
			if (c !== b)
				return this.css("zIndex", c);
			if (this.length) {
				var d = a(this[0]),
					e, f;
				while (d.length && d[0] !== document) {
					e = d.css("position");
					if (e === "absolute" || e === "relative" || e === "fixed") {
						f = parseInt(d.css("zIndex"), 10);
						if (!isNaN(f) && f !== 0)
							return f
					}
					d = d.parent()
				}
			}
			return 0
		},
		disableSelection: function() {
			return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(a) {
				a.preventDefault()
			})
		},
		enableSelection: function() {
			return this.unbind(".ui-disableSelection")
		}
	}), a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function(c, d) {
		function h(b, c, d, f) {
			return a.each(e, function() {
				c -= parseFloat(a.curCSS(b, "padding" + this, !0)) || 0, d && (c -= parseFloat(a.curCSS(b, "border" + this + "Width", !0)) || 0), f && (c -= parseFloat(a.curCSS(b, "margin" + this, !0)) || 0)
			}), c
		}
		var e = d === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
			f = d.toLowerCase(),
			g = {
				innerWidth: a.fn.innerWidth,
				innerHeight: a.fn.innerHeight,
				outerWidth: a.fn.outerWidth,
				outerHeight: a.fn.outerHeight
			};
		a.fn["inner" + d] = function(c) {
			return c === b ? g["inner" + d].call(this) : this.each(function() {
				a(this).css(f, h(this, c) + "px")
			})
		}, a.fn["outer" + d] = function(b, c) {
			return typeof b != "number" ? g["outer" + d].call(this, b) : this.each(function() {
				a(this).css(f, h(this, b, !0, c) + "px")
			})
		}
	}), a.extend(a.expr[":"], {
		data: a.expr.createPseudo ? a.expr.createPseudo(function(b) {
			return function(c) {
				return !!a.data(c, b)
			}
		}) : function(b, c, d) {
			return !!a.data(b, d[3])
		},
		focusable: function(b) {
			return c(b, !isNaN(a.attr(b, "tabindex")))
		},
		tabbable: function(b) {
			var d = a.attr(b, "tabindex"),
				e = isNaN(d);
			return (e || d >= 0) && c(b, !e)
		}
	}), a(function() {
		var b = document.body,
			c = b.appendChild(c = document.createElement("div"));
		c.offsetHeight, a.extend(c.style, {
			minHeight: "100px",
			height: "auto",
			padding: 0,
			borderWidth: 0
		}), a.support.minHeight = c.offsetHeight === 100, a.support.selectstart = "onselectstart" in c, b.removeChild(c).style.display = "none"
	}), a.curCSS || (a.curCSS = a.css), a.extend(a.ui, {
		plugin: {
			add: function(b, c, d) {
				var e = a.ui[b].prototype;
				for (var f in d)
					e.plugins[f] = e.plugins[f] || [], e.plugins[f].push([c, d[f]])
			},
			call: function(a, b, c) {
				var d = a.plugins[b];
				if (!d || !a.element[0].parentNode)
					return;
				for (var e = 0; e < d.length; e++)
					a.options[d[e][0]] && d[e][1].apply(a.element, c)
			}
		},
		contains: function(a, b) {
			return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
		},
		hasScroll: function(b, c) {
			if (a(b).css("overflow") === "hidden")
				return !1;
			var d = c && c === "left" ? "scrollLeft" : "scrollTop",
				e = !1;
			return b[d] > 0 ? !0 : (b[d] = 1, e = b[d] > 0, b[d] = 0, e)
		},
		isOverAxis: function(a, b, c) {
			return a > b && a < b + c
		},
		isOver: function(b, c, d, e, f, g) {
			return a.ui.isOverAxis(b, d, f) && a.ui.isOverAxis(c, e, g)
		}
	})
})(jQuery),
function(a, b) {
	if (a.cleanData) {
		var c = a.cleanData;
		a.cleanData = function(b) {
			for (var d = 0, e;
			(e = b[d]) != null; d++)
				try {
					a(e).triggerHandler("remove")
			} catch (f) {}
			c(b)
		}
	} else {
		var d = a.fn.remove;
		a.fn.remove = function(b, c) {
			return this.each(function() {
				return c || (!b || a.filter(b, [this]).length) && a("*", this).add([this]).each(function() {
					try {
						a(this).triggerHandler("remove")
					} catch (b) {}
				}), d.call(a(this), b, c)
			})
		}
	}
	a.widget = function(b, c, d) {
		var e = b.split(".")[0],
			f;
		b = b.split(".")[1], f = e + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][f] = function(c) {
			return !!a.data(c, b)
		}, a[e] = a[e] || {}, a[e][b] = function(a, b) {
			arguments.length && this._createWidget(a, b)
		};
		var g = new c;
		g.options = a.extend(!0, {}, g.options), a[e][b].prototype = a.extend(!0, g, {
			namespace: e,
			widgetName: b,
			widgetEventPrefix: a[e][b].prototype.widgetEventPrefix || b,
			widgetBaseClass: f
		}, d), a.widget.bridge(b, a[e][b])
	}, a.widget.bridge = function(c, d) {
		a.fn[c] = function(e) {
			var f = typeof e == "string",
				g = Array.prototype.slice.call(arguments, 1),
				h = this;
			return e = !f && g.length ? a.extend.apply(null, [!0, e].concat(g)) : e, f && e.charAt(0) === "_" ? h : (f ? this.each(function() {
				var d = a.data(this, c),
					f = d && a.isFunction(d[e]) ? d[e].apply(d, g) : d;
				if (f !== d && f !== b)
					return h = f, !1
			}) : this.each(function() {
				var b = a.data(this, c);
				b ? b.option(e || {})._init() : a.data(this, c, new d(e, this))
			}), h)
		}
	}, a.Widget = function(a, b) {
		arguments.length && this._createWidget(a, b)
	}, a.Widget.prototype = {
		widgetName: "widget",
		widgetEventPrefix: "",
		options: {
			disabled: !1
		},
		_createWidget: function(b, c) {
			a.data(c, this.widgetName, this), this.element = a(c), this.options = a.extend(!0, {}, this.options, this._getCreateOptions(), b);
			var d = this;
			this.element.bind("remove." + this.widgetName, function() {
				d.destroy()
			}), this._create(), this._trigger("create"), this._init()
		},
		_getCreateOptions: function() {
			return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
		},
		_create: function() {},
		_init: function() {},
		destroy: function() {
			this.element.unbind("." + this.widgetName).removeData(this.widgetName), this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled")
		},
		widget: function() {
			return this.element
		},
		option: function(c, d) {
			var e = c;
			if (arguments.length === 0)
				return a.extend({}, this.options);
			if (typeof c == "string") {
				if (d === b)
					return this.options[c];
				e = {}, e[c] = d
			}
			return this._setOptions(e), this
		},
		_setOptions: function(b) {
			var c = this;
			return a.each(b, function(a, b) {
				c._setOption(a, b)
			}), this
		},
		_setOption: function(a, b) {
			return this.options[a] = b, a === "disabled" && this.widget()[b ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", b), this
		},
		enable: function() {
			return this._setOption("disabled", !1)
		},
		disable: function() {
			return this._setOption("disabled", !0)
		},
		_trigger: function(b, c, d) {
			var e, f, g = this.options[b];
			d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent;
			if (f)
				for (e in f)
					e in c || (c[e] = f[e]);
			return this.element.trigger(c, d), !(a.isFunction(g) && g.call(this.element[0], c, d) === !1 || c.isDefaultPrevented())
		}
	}
}(jQuery),
function(a, b) {
	var c = !1;
	a(document).mouseup(function(a) {
		c = !1
	}), a.widget("ui.mouse", {
		options: {
			cancel: ":input,option",
			distance: 1,
			delay: 0
		},
		_mouseInit: function() {
			var b = this;
			this.element.bind("mousedown." + this.widgetName, function(a) {
				return b._mouseDown(a)
			}).bind("click." + this.widgetName, function(c) {
				if (!0 === a.data(c.target, b.widgetName + ".preventClickEvent"))
					return a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1
			}), this.started = !1
		},
		_mouseDestroy: function() {
			this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
		},
		_mouseDown: function(b) {
			if (c)
				return;
			this._mouseStarted && this._mouseUp(b), this._mouseDownEvent = b;
			var d = this,
				e = b.which == 1,
				f = typeof this.options.cancel == "string" && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : !1;
			if (!e || f || !this._mouseCapture(b))
				return !0;
			this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
				d.mouseDelayMet = !0
			}, this.options.delay));
			if (this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
				this._mouseStarted = this._mouseStart(b) !== !1;
				if (!this._mouseStarted)
					return b.preventDefault(), !0
			}
			return !0 === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(a) {
				return d._mouseMove(a)
			}, this._mouseUpDelegate = function(a) {
				return d._mouseUp(a)
			}, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), b.preventDefault(), c = !0, !0
		},
		_mouseMove: function(b) {
			return !a.browser.msie || document.documentMode >= 9 || !! b.button ? this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted) : this._mouseUp(b)
		},
		_mouseUp: function(b) {
			return a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, b.target == this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b)), !1
		},
		_mouseDistanceMet: function(a) {
			return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
		},
		_mouseDelayMet: function(a) {
			return this.mouseDelayMet
		},
		_mouseStart: function(a) {},
		_mouseDrag: function(a) {},
		_mouseStop: function(a) {},
		_mouseCapture: function(a) {
			return !0
		}
	})
}(jQuery),
function(a, b) {
	var c = 5;
	a.widget("ui.slider", a.ui.mouse, {
		widgetEventPrefix: "slide",
		options: {
			animate: !1,
			distance: 0,
			max: 100,
			min: 0,
			orientation: "horizontal",
			range: !1,
			step: 1,
			value: 0,
			values: null
		},
		_create: function() {
			var b = this,
				d = this.options,
				e = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
				f = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
				g = d.values && d.values.length || 1,
				h = [];
			this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all" + (d.disabled ? " ui-slider-disabled ui-disabled" : "")), this.range = a([]), d.range && (d.range === !0 && (d.values || (d.values = [this._valueMin(), this._valueMin()]), d.values.length && d.values.length !== 2 && (d.values = [d.values[0], d.values[0]])), this.range = a("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (d.range === "min" || d.range === "max" ? " ui-slider-range-" + d.range : "")));
			for (var i = e.length; i < g; i += 1)
				h.push(f);
			this.handles = e.add(a(h.join("")).appendTo(b.element)), this.handle = this.handles.eq(0), this.handles.add(this.range).filter("a").click(function(a) {
				a.preventDefault()
			}).hover(function() {
				d.disabled || a(this).addClass("ui-state-hover")
			}, function() {
				a(this).removeClass("ui-state-hover")
			}).focus(function() {
				d.disabled ? a(this).blur() : (a(".ui-slider .ui-state-focus").removeClass("ui-state-focus"), a(this).addClass("ui-state-focus"))
			}).blur(function() {
				a(this).removeClass("ui-state-focus")
			}), this.handles.each(function(b) {
				a(this).data("index.ui-slider-handle", b)
			}), this.handles.keydown(function(d) {
				var e = a(this).data("index.ui-slider-handle"),
					f, g, h, i;
				if (b.options.disabled)
					return;
				switch (d.keyCode) {
					case a.ui.keyCode.HOME:
					case a.ui.keyCode.END:
					case a.ui.keyCode.PAGE_UP:
					case a.ui.keyCode.PAGE_DOWN:
					case a.ui.keyCode.UP:
					case a.ui.keyCode.RIGHT:
					case a.ui.keyCode.DOWN:
					case a.ui.keyCode.LEFT:
						d.preventDefault();
						if (!b._keySliding) {
							b._keySliding = !0, a(this).addClass("ui-state-active"), f = b._start(d, e);
							if (f === !1)
								return
						}
				}
				i = b.options.step, b.options.values && b.options.values.length ? g = h = b.values(e) : g = h = b.value();
				switch (d.keyCode) {
					case a.ui.keyCode.HOME:
						h = b._valueMin();
						break;
					case a.ui.keyCode.END:
						h = b._valueMax();
						break;
					case a.ui.keyCode.PAGE_UP:
						h = b._trimAlignValue(g + (b._valueMax() - b._valueMin()) / c);
						break;
					case a.ui.keyCode.PAGE_DOWN:
						h = b._trimAlignValue(g - (b._valueMax() - b._valueMin()) / c);
						break;
					case a.ui.keyCode.UP:
					case a.ui.keyCode.RIGHT:
						if (g === b._valueMax())
							return;
						h = b._trimAlignValue(g + i);
						break;
					case a.ui.keyCode.DOWN:
					case a.ui.keyCode.LEFT:
						if (g === b._valueMin())
							return;
						h = b._trimAlignValue(g - i)
				}
				b._slide(d, e, h)
			}).keyup(function(c) {
				var d = a(this).data("index.ui-slider-handle");
				b._keySliding && (b._keySliding = !1, b._stop(c, d), b._change(c, d), a(this).removeClass("ui-state-active"))
			}), this._refreshValue(), this._animateOff = !1
		},
		destroy: function() {
			return this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"), this._mouseDestroy(), this
		},
		_mouseCapture: function(b) {
			var c = this.options,
				d, e, f, g, h, i, j, k, l;
			return c.disabled ? !1 : (this.elementSize = {
				width: this.element.outerWidth(),
				height: this.element.outerHeight()
			}, this.elementOffset = this.element.offset(), d = {
				x: b.pageX,
				y: b.pageY
			}, e = this._normValueFromMouse(d), f = this._valueMax() - this._valueMin() + 1, h = this, this.handles.each(function(b) {
				var c = Math.abs(e - h.values(b));
				f > c && (f = c, g = a(this), i = b)
			}), c.range === !0 && this.values(1) === c.min && (i += 1, g = a(this.handles[i])), j = this._start(b, i), j === !1 ? !1 : (this._mouseSliding = !0, h._handleIndex = i, g.addClass("ui-state-active").focus(), k = g.offset(), l = !a(b.target).parents().andSelf().is(".ui-slider-handle"), this._clickOffset = l ? {
				left: 0,
				top: 0
			} : {
				left: b.pageX - k.left - g.width() / 2,
				top: b.pageY - k.top - g.height() / 2 - (parseInt(g.css("borderTopWidth"),
					10) || 0) - (parseInt(g.css("borderBottomWidth"),
					10) || 0) + (parseInt(g.css("marginTop"),
					10) || 0)
			}, this.handles.hasClass("ui-state-hover") || this._slide(b, i, e), this._animateOff = !0, !0))
		},
		_mouseStart: function(a) {
			return !0
		},
		_mouseDrag: function(a) {
			var b = {
				x: a.pageX,
				y: a.pageY
			}, c = this._normValueFromMouse(b);
			return this._slide(a, this._handleIndex, c), !1
		},
		_mouseStop: function(a) {
			return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(a, this._handleIndex), this._change(a, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
		},
		_detectOrientation: function() {
			this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
		},
		_normValueFromMouse: function(a) {
			var b, c, d, e, f;
			return this.orientation === "horizontal" ? (b = this.elementSize.width, c = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (b = this.elementSize.height, c = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), d = c / b, d > 1 && (d = 1), d < 0 && (d = 0), this.orientation === "vertical" && (d = 1 - d), e = this._valueMax() - this._valueMin(), f = this._valueMin() + d * e, this._trimAlignValue(f)
		},
		_start: function(a, b) {
			var c = {
				handle: this.handles[b],
				value: this.value()
			};
			return this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("start", a, c)
		},
		_slide: function(a, b, c) {
			var d, e, f;
			this.options.values && this.options.values.length ? (d = this.values(b ? 0 : 1), this.options.values.length === 2 && this.options.range === !0 && (b === 0 && c > d || b === 1 && c < d) && (c = d), c !== this.values(b) && (e = this.values(), e[b] = c, f = this._trigger("slide", a, {
				handle: this.handles[b],
				value: c,
				values: e
			}), d = this.values(b ? 0 : 1), f !== !1 && this.values(b, c, !0))) : c !== this.value() && (f = this._trigger("slide", a, {
				handle: this.handles[b],
				value: c
			}), f !== !1 && this.value(c))
		},
		_stop: function(a, b) {
			var c = {
				handle: this.handles[b],
				value: this.value()
			};
			this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("stop", a, c)
		},
		_change: function(a, b) {
			if (!this._keySliding && !this._mouseSliding) {
				var c = {
					handle: this.handles[b],
					value: this.value()
				};
				this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("change", a, c)
			}
		},
		value: function(a) {
			if (arguments.length) {
				this.options.value = this._trimAlignValue(a), this._refreshValue(), this._change(null, 0);
				return
			}
			return this._value()
		},
		values: function(b, c) {
			var d, e, f;
			if (arguments.length > 1) {
				this.options.values[b] = this._trimAlignValue(c), this._refreshValue(), this._change(null, b);
				return
			}
			if (!arguments.length)
				return this._values();
			if (!a.isArray(arguments[0]))
				return this.options.values && this.options.values.length ? this._values(b) : this.value();
			d = this.options.values, e = arguments[0];
			for (f = 0; f < d.length; f += 1)
				d[f] = this._trimAlignValue(e[f]), this._change(null, f);
			this._refreshValue()
		},
		_setOption: function(b, c) {
			var d, e = 0;
			a.isArray(this.options.values) && (e = this.options.values.length), a.Widget.prototype._setOption.apply(this, arguments);
			switch (b) {
				case "disabled":
					c ? (this.handles.filter(".ui-state-focus").blur(), this.handles.removeClass("ui-state-hover"), this.handles.propAttr("disabled", !0), this.element.addClass("ui-disabled")) : (this.handles.propAttr("disabled", !1), this.element.removeClass("ui-disabled"));
					break;
				case "orientation":
					this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue();
					break;
				case "value":
					this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
					break;
				case "values":
					this._animateOff = !0, this._refreshValue();
					for (d = 0; d < e; d += 1)
						this._change(null, d);
					this._animateOff = !1
			}
		},
		_value: function() {
			var a = this.options.value;
			return a = this._trimAlignValue(a), a
		},
		_values: function(a) {
			var b, c, d;
			if (arguments.length)
				return b = this.options.values[a], b = this._trimAlignValue(b), b;
			c = this.options.values.slice();
			for (d = 0; d < c.length; d += 1)
				c[d] = this._trimAlignValue(c[d]);
			return c
		},
		_trimAlignValue: function(a) {
			if (a <= this._valueMin())
				return this._valueMin();
			if (a >= this._valueMax())
				return this._valueMax();
			var b = this.options.step > 0 ? this.options.step : 1,
				c = (a - this._valueMin()) % b,
				d = a - c;
			return Math.abs(c) * 2 >= b && (d += c > 0 ? b : -b), parseFloat(d.toFixed(5))
		},
		_valueMin: function() {
			return this.options.min
		},
		_valueMax: function() {
			return this.options.max
		},
		_refreshValue: function() {
			var b = this.options.range,
				c = this.options,
				d = this,
				e = this._animateOff ? !1 : c.animate,
				f, g = {}, h, i, j, k;
			this.options.values && this.options.values.length ? this.handles.each(function(b, i) {
				f = (d.values(b) - d._valueMin()) / (d._valueMax() - d._valueMin()) * 100, g[d.orientation === "horizontal" ? "left" : "bottom"] = f + "%", a(this).stop(1, 1)[e ? "animate" : "css"](g, c.animate), d.options.range === !0 && (d.orientation === "horizontal" ? (b === 0 && d.range.stop(1, 1)[e ? "animate" : "css"]({
					left: f + "%"
				}, c.animate), b === 1 && d.range[e ? "animate" : "css"]({
					width: f - h + "%"
				}, {
					queue: !1,
					duration: c.animate
				})) : (b === 0 && d.range.stop(1, 1)[e ? "animate" : "css"]({
					bottom: f + "%"
				}, c.animate), b === 1 && d.range[e ? "animate" : "css"]({
					height: f - h + "%"
				}, {
					queue: !1,
					duration: c.animate
				}))), h = f
			}) : (i = this.value(), j = this._valueMin(), k = this._valueMax(), f = k !== j ? (i - j) / (k - j) * 100 : 0, g[d.orientation === "horizontal" ? "left" : "bottom"] = f + "%", this.handle.stop(1, 1)[e ? "animate" : "css"](g, c.animate), b === "min" && this.orientation === "horizontal" && this.range.stop(1, 1)[e ? "animate" : "css"]({
				width: f + "%"
			}, c.animate), b === "max" && this.orientation === "horizontal" && this.range[e ? "animate" : "css"]({
				width: 100 - f + "%"
			}, {
				queue: !1,
				duration: c.animate
			}), b === "min" && this.orientation === "vertical" && this.range.stop(1, 1)[e ? "animate" : "css"]({
				height: f + "%"
			}, c.animate), b === "max" && this.orientation === "vertical" && this.range[e ? "animate" : "css"]({
				height: 100 - f + "%"
			}, {
				queue: !1,
				duration: c.animate
			}))
		}
	}), a.extend(a.ui.slider, {
		version: "1.8.24"
	})
}(jQuery), window.log = function() {
	log.history = log.history || [], log.history.push(arguments), this.console && console.log(Array.prototype.slice.call(arguments))
}, $(function() {
	function d() {
		this.audio = "", this.stopped = !1, this.type = "html5", this.volume = 6, this.init = function() {
			this.audio = new Audio(Settings.url), Settings.auto !== "1" ? this.audio.setAttribute("preload", "none") : (this.audio.setAttribute("preload", "auto"), this.audio.setAttribute("autoplay", "autoplay"))
		}, this.play = function() {
			this.stopped === !0 && (this.audio.setAttribute("src", Settings.url), this.audio.load()), this.audio.play(), this.audio.volume = this.volume / 10, this.stopped = !1
		}, this.stop = function() {
			this.audio.pause(), this.audio.setAttribute("src", "#"), this.stopped = !0
		}, this.playing = function() {
			return navigator.userAgent.match(/like Mac OS X/i) ? !0 : this.audio.currentTime.toString() === "0" || this.audio.duration.toString() === "NaN" ? !1 : !0
		}, this.changeVolume = function(a) {
			this.volume = a, this.audio.volume = this.volume / 10
		}, this.decreaseVolume = function() {
			this.volume > 0 && (this.volume -= 1, this.changeVolume(this.volume))
		}, this.increaseVolume = function() {
			this.volume < 10 && (this.volume += 1, this.changeVolume(this.volume))
		}, log("Using HTML5 Player")
	}

	function e() {
		this.flashStuff = {
			flashvars: {},
			attributes: {},
			params: {}
		}, this.volume = 6, this.embed = "/lib/flash/player.swf", this.init = function() {
			var b = this,
				c = window.document.getElementsByTagName("head")[0],
				d = null;
			d = window.document.createElement("script"), d.type = "text/javascript", d.src = "https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js", c.appendChild(d), d.onload = d.onreadystatechange = function() {
				a.container.append('<div id="wPlayerFlash"></div>');
				var c = {
					autostart: "true",
					volume: b.volume * 10,
					file: Settings.url,
					type: "sound"
				}, d = {
						id: "wPlayerFlash",
						name: "wPlayerFlash"
					}, e = {};
				b.flashStuff.flashvars = c, b.flashStuff.attributes = d, b.flashStuff.params = e, Settings.auto === !0 && b.play()
			}
		}, this.play = function() {
			swfobject.embedSWF(this.embed, "wPlayerFlash", "1", "1", "9.0.0", "expressInstall.swf", this.flashStuff.flashvars, this.flashStuff.params, this.flashStuff.attributes)
		}, this.stop = function() {
			$("#wPlayerFlash").remove(), a.container.append('<div id="wPlayerFlash"></div>')
		}, this.playing = function() {
			return !0
		}, this.changeVolume = function(a) {
			this.volume = a, this.flashStuff.flashvars.volume = this.volume * 10, this.flashStuff.params.volume = this.volume * 10, jwplayer().setVolume(this.volume * 10)
		}, this.decreaseVolume = function() {
			this.volume > 0 && (this.volume -= 1, this.changeVolume(this.volume))
		}, this.increaseVolume = function() {
			this.volume < 10 && (this.volume += 1, this.changeVolume(this.volume))
		}, log("Using Flash Player")
	}

	function g() {
		f.playing === !0 && (f.seconds < 21600 ? (f.tick(), c && clearTimeout(c), c = setTimeout(function() {
			g()
		}, 1e3)) : f.stop())
	}

	function h(d) {
		var e = $.param(Settings),
			g = "/player.php?hash=" + Settings.player.hash + "&action=getCurrentData";
		$.getJSON(g, function(b) {
			typeof b.error != "undefined" && (b.artist = Settings.Defaults.artist || "Radio", b.track = Settings.Defaults.track || b.error, b.image = Settings.Defaults.image || b.image, a.play.hide(), a.stop.hide(), a.warning.attr("title", b.error).show(), a.time.text("Off Air"), f.online = !1, c && clearTimeout(c)), typeof d == "function" && d(), b.image === "/lib/images/music.png" && (b.image = Settings.Defaults.image);
			if (b.artist === "noartist" || b.artist == !1)
				b.artist = Settings.Defaults.artist;
			b.track === "notrack" && (b.track = Settings.Defaults.track), f.changeData(b.artist, b.track, b.image)
		}), b && clearTimeout(b), b = setTimeout(function() {
			f.playing === !0 && h(!1)
		}, 3e4)
	}
	log(location.host);
	var a = {
		artist: $("#wPlayerArtist"),
		track: $("#wPlayerTrack"),
		image: $("#wPlayerArt img"),
		time: $("#wPlayerTime"),
		play: $("#wPlayerPlay"),
		stop: $("#wPlayerStop"),
		container: $("#wPlayerContainer"),
		warning: $("#wPlayerWarning")
	}, b, c;
	$.ajaxSetup({
		timeout: 5e3,
		cache: !1
	}), Settings.Defaults = {
		artist: a.artist.text(),
		track: a.track.text(),
		image: a.image.attr("src")
	}, Settings.player.auto = Settings.player.autoplay || !1, Settings.url = "http://" + Settings.player.host + ":" + Settings.player.port + "/", Settings.player.type === "ice" ? Settings.url += Settings.player.stream : Settings.url += Settings.player.type !== "v1" && Settings.player.stream ? "stream/" + Settings.player.stream + "/" : ";listen.mp3", log(Settings.url);
	var f = {
		url: "",
		obj: {},
		playing: !1,
		seconds: 0,
		details: {},
		online: !0,
		sCalls: 0,
		status: function() {
			this.obj.playing() ? (this.playing = !0, g()) : (this.sCalls += 1, this.sCalls < 5 ? a.time.text("Buffering") : this.checkHTML(), setTimeout(function() {
				f.status()
			}, 1e3))
		},
		play: function() {
			var b = this;
			b.sCalls = 0, this.obj.play(), this.seconds = 0, this.playing = !0, b.sCalls === 0 && b.status(), a.play.hide(), a.stop.show(), h()
		},
		stop: function() {
			a.time.text("Stopped"), a.stop.hide(), a.play.show(), this.obj.stop(), this.playing = !1, this.seconds = 0, this.changeData(Settings.Defaults.artist, Settings.Defaults.track, Settings.Defaults.image)
		},
		displayPlayer: function() {
			$("#wPlayerPlay").click(function() {
				return f.play(), $("#wPlayerPlay").hide(), $("#wPlayerStop").show(), !1
			}), $("#wPlayerStop").click(function() {
				return f.stop(), $("#wPlayerStop").hide(), $("#wPlayerPlay").show(), !1
			})
		},
		tick: function() {
			var b = this,
				c, d, e;
			this.seconds += 1, c = Math.floor(this.seconds / 3600), d = Math.floor(this.seconds / 60) - c * 60, e = this.seconds - c * 3600 - d * 60, c < 10 && (c = "0" + c), d < 10 && (d = "0" + d), e < 10 && (e = "0" + e), a.time.html(c + ":" + d + ":" + e)
		},
		changeData: function(b, c, d) {
			this.details.player.always_di == 0 && a.image.attr("src", d), a.artist.text(b), a.track.text(c)
		},
		init: function() {
			var b = this,
				c = "/files/json/" + Settings.hash + ".json",
				f = document.createElement("audio"),
				g = Settings;
			try {
				typeof f.canPlayType != "undefined" && f.canPlayType("audio/mpeg") ? this.obj = new d : this.obj = new e
			} catch (i) {
				this.obj = new e
			}
			if (window.location.hostname.indexOf(Settings.player.site) == -1 && window.location.hostname.indexOf("wavepanel.net") == -1 && window.location.hostname.indexOf("radiocdn") == -1) {
				a.container.html("The player is not allowed to be embedded on this site.");
				return
			}
			b.details = g, b.displayPlayer(), b.obj.init(), h(function() {
				b.online === !0 && g.player.autoplay === "1" && (navigator.userAgent.match(/like Mac OS X/i) || setTimeout(function() {
					a.play.click()
				}, 1e3))
			})
		},
		checkHTML: function() {
			this.obj.playing() || (this.obj.stop(), this.obj = new e, Settings.auto = !0, this.obj.init())
		},
		decreaseVolume: function() {
			this.obj.decreaseVolume()
		},
		increaseVolume: function() {
			this.obj.increaseVolume()
		},
		setVolume: function(a) {
			this.obj.changeVolume(a)
		}
	};
	(function() {
		var a = function() {
			f.playing === !0 ? f.stop() : f.play()
		}, b = $("#volumeBar"),
			c = $("#volume");
		f.init(),
		function() {
			b.length && c.length && (b.slider({
				orientation: "vertical",
				min: 0,
				max: 10,
				value: 6,
				slide: function(a, b) {
					f.setVolume(b.value)
				}
			}), c.click(function() {
				b.css("display") === "none" ? b.css("display", "block") : b.css("display", "none")
			}))
		}(), $(document).keyup(function(c) {
			var d = b.slider("value");
			c.keyCode === 32 && a(), c.keyCode === 40 && (f.decreaseVolume(), d > 0 && b.slider("value", d - 1)), c.keyCode === 38 && (f.increaseVolume(), d < 10 && b.slider("value", d + 1))
		}), $(window).bind("message", a), $("#popOut").click(function() {
			var a = 450;
			Settings.player.art !== "1" && (a = 315), f.playing && f.stop(), window.open(window.location.href, "playerPopOut", "height=135,width=" + a + ",left=20,top=20,resizable=0,scrollbars=0,toolbar0,menubar=0,location=0,directories=0,status=0")
		})
	})()
});