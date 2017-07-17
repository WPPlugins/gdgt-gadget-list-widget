GDGT_HOST = 'gdgt.com';
GDGT_URL = 'http://' + GDGT_HOST;
GDGT_API_URL = 'http://api.' + GDGT_HOST + '/';
GDGT_USR_URL = 'http://user.' + GDGT_HOST + '/';
GDGT_IMG_URL = 'http://media.gdgt.com/img/';
GDGT_CSS_URL = 'http://media.gdgt.com/assets/css/';
/*
 * gdgt API JavaScript Library v1.0
 * http://gdgt.com/
 *
 * Structure, syntax and some code are based on and 
 * inspired by the jQuery library (http://jquery.com)
 *
 */ 

(function (window, undefined) {
  var gdgt = function(selector, context) {
    return new gdgt.fn.init(selector, context);
  },
  
  _gdgt = window.gdgt,
  document = window.document;
  
  /*
   * "Core" stuff - init(), find(), each()
   */
  gdgt.fn = gdgt.prototype = {
    URL: GDGT_URL,
    API_URL: GDGT_API_URL,
    USR_URL: GDGT_USR_URL,
    IMG_URL: GDGT_IMG_URL,
    CSS_URL: GDGT_CSS_URL,
    
    loadedScripts: [],
    loadedStylesheets: [],
    
    init: function(selector, context) {
      if (!selector) return this;
      
      if (selector.length && selector.length > 0 && typeof selector !== 'string')
        return gdgt.extend(selector, gdgt());
      else if (selector.nodeType)
        return gdgt.extend([selector], gdgt());
      
      if (!context)
        context = this;
      
      return context.find(selector);
    },
    
    find: function(selector, context) {
      var path, tag, id, classname, sel, child, children, found, elem;
      
      if (!selector || typeof selector !== 'string') return this;
      
      if (!context || context === undefined) {
        if (this.length == 1)
          context = this[0];
        else if (this.length > 1)
          context = this;
        else
          context = document;
      }
      
      path = selector.split(' ');
      if (path.length > 1) {
        elem = context;
        for (var i=0; i<path.length; i++) {
          elem = gdgt(elem).find(path[i]);
        }
        return gdgt.extend(elem, gdgt());
      }
      
      if (context.length && context.length > 0 && typeof context !== 'string') {
      
        elem = [];
        for (var i=0; i<context.length; i++) {
          found = gdgt(context[i]).find(selector, context[i]);
          gdgt.each(found, function(x) {
            elem.push(this);
          });
        }
        return gdgt.extend(elem, gdgt());
      
      } else {
        
        if (selector.indexOf('#') >= 0) {
          id = selector.split('#')[1];
          elem = [];
          elem.push(context.getElementById(id));
          if (!elem)
            return this;
          
          return gdgt.extend(elem, gdgt());
        } else if (selector.indexOf('.') >= 0) {
          elem = [];
          sel = selector.split(/\./);
          tag = sel[0];
          classname = sel[1];
          if (tag.length > 0) {
            found = gdgt.merge([], context.getElementsByTagName(tag));
            for (var i=0; i<found.length; i++) {
              if (gdgt.hasClass(found[i], classname))
                elem.push(found[i]);
            }
          } else {
            for (var i=0; i<context.childNodes.length; i++) {
              child = context.childNodes[i];
              
              if (gdgt.hasClass(child, classname)) {
                elem.push(child);
              }
              
              children = gdgt().find('.' + classname, child);
              if (children.length > 0) {
                children.each(function(x) {
                  elem.push(this);
                });
              }
            }
          }
          if (elem.length == 0)
            return this;
          
          return gdgt.extend(elem, gdgt());
        } else {
          elem = gdgt.merge([], context.getElementsByTagName(selector));
          if (elem.length == 0)
            return this;
          
          return gdgt.extend(elem, gdgt());
        }
      }
    }
  };
  
  gdgt.fn.init.prototype = gdgt.fn;
  
  /*
   * extend() methods, borrowed in whole from jQuery
   */
  gdgt.extend = gdgt.fn.extend = function() {
  	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;
  
  	if ( typeof target === "boolean" ) {
  		deep = target;
  		target = arguments[1] || {};
  		i = 2;
  	}
  
  	if ( typeof target !== "object" && !gdgt.isFunction(target) ) {
  		target = {};
  	}
  
  	if ( length === i ) {
  		target = this;
  		--i;
  	}
  
  	for ( ; i < length; i++ ) {
  		if ( (options = arguments[ i ]) != null ) {
  			for ( name in options ) {
  				src = target[ name ];
  				copy = options[ name ];
  
  				if ( target === copy ) {
  					continue;
  				}
  
  				if ( deep && copy && ( gdgt.isPlainObject(copy) || gdgt.isArray(copy) ) ) {
  					var clone = src && ( gdgt.isPlainObject(src) || gdgt.isArray(src) ) ? src
  						: gdgt.isArray(copy) ? [] : {};
  
  					target[ name ] = gdgt.extend( deep, clone, copy );
  
  				} else if ( copy !== undefined ) {
  				  target[ name ] = copy;
  				}
  			}
  		}
  	}
  
  	return target;
  };

  /*
   * Core extenders - available to the base gdgt object, such as gdgt.FUNCTION_NAME()
   * these are not contextual, and "this" referts to the gdgt core object, not the element
   */
  gdgt.extend({
  	merge: function( first, second ) {
  		var i = first.length, j = 0;
  
  		if ( typeof second.length === "number" ) {
  			for ( var l = second.length; j < l; j++ ) {
  				first[ i++ ] = second[ j ];
  			}
  		
  		} else {
  			while ( second[j] !== undefined ) {
  				first[ i++ ] = second[ j++ ];
  			}
  		}
  
  		first.length = i;
  
  		return first;
  	},
  	
    isFunction: function(obj) {
      //return (obj.constructor.toString().indexOf('function Function') >= 0);
		  return toString.call(obj) === "[object Function]";
    },
    
    isArray: function(obj) {
      //return (obj.constructor.toString().indexOf('function Array') >= 0);
		  return toString.call(obj) === "[object Array]";
    },
    
    isElement: function(obj) {
		  return (obj.nodeType) ? true : false;
    },
    
  	isPlainObject: function( obj ) {
  		if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
  			return false;
  		}
  		
  		if ( obj.constructor
  			&& !hasOwnProperty.call(obj, "constructor")
  			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
  			return false;
  		}
  		
  		var key;
  		for ( key in obj ) {}
  		
  		return key === undefined || hasOwnProperty.call( obj, key );
  	},
  
  	isEmptyObject: function( obj ) {
  		for ( var name in obj ) {
  			return false;
  		}
  		return true;
  	},
  	
  	error: function( msg ) {
  		throw msg;
  	},
    
    getJSONP: function(url, params, callback) {
      var s = document.createElement('script');
      s.src = url + '?callback=' + callback;
      document.getElementsByTagName('head').item(0).appendChild(s);
    },
    
    processJSONP: function(callback, data) {
      // TODO: process any errors returned here
      if (callback.length > 0)
        eval(callback + '(data);');
    },
    
    loadScript: function(script) {      
      gdgt.fn.loadedScripts.push(script);
      var scr = document.createElement('script');
      scr.src = script;
      document.getElementsByTagName('head').item(0).appendChild(scr);
    },
    
    loadStyle: function(style) {
      for (var i=0; i<gdgt.fn.loadedStylesheets; i++) {
        if (gdgt.fn.loadedStylesheets[i] == style)
          return;
      }
      
      gdgt.fn.loadedStylesheets.push(style);
      var lnk = document.createElement('link');
      lnk.rel = 'stylesheet';
      lnk.type = 'text/css';
      lnk.href = style;
      document.getElementsByTagName('head').item(0).appendChild(lnk);
    },
    
    generateSeed: function() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      
      return ('gdgt' + S4() + S4() + S4());
    },
    
    attr: function(elem, attr, val) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        if (!val || val === undefined) {
          return gdgt.attr(elem[0], attr);
        }
          
        for (var i=0; i<elem.length; i++) {
          gdgt.attr(elem[i], attr, val);
        }
        return elem;
      }
      
      if (!val || val === undefined) {
        //return elem.getAttribute(attr);
        return eval('elem.' + attr);
      }
        
      eval('elem.' + attr + ' = val');
      //elem.setAttribute(attr, val);
      return elem;
    },
    
    each: function(arr, method) {
      //if (!gdgt.isFunction(method))
        //return arr;
        
      for (var i=0; i<arr.length; i++) {
        method.call(arr[i], i);
      }
      
      return arr;
    },
    
    text: function(elem, txt) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        if (!txt)
          return elem[0].innerHTML;
        
        for (var i=0; i<elem.length; i++) {
          gdgt.text(elem[i], txt);
        }
        return elem;
      }
      
      if (!txt)
        return elem.innerHTML;
      
      elem.innerHTML = '';
      elem.appendChild(document.createTextNode(txt));
      return elem;
    },
    
    html: function(elem, code) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        if (!code)
          return elem[0].innerHTML;
          
        for (var i=0; i<elem.length; i++) {
          gdgt.html(elem[i], code);
        }
        return elem;
      }
      
      if (!code)
        return elem.innerHTML;
        
      elem.innerHTML = code;
      return elem;
    },
    
    hasClass: function(elem, classname) {
      var elems = elem;
      if (elem.length && elem.length > 0 && typeof elem !== 'string')
        elem = elems[0];
      if (!elem.className) return false;
      
      var classes = elem.className.split(' ');
      
      for (var i=0; i<classes.length; i++) {
        if (classes[i] == classname)
          return true;
      }
      
      return false;
    },
    
    getClass: function(elem) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string')
        return elem[0].className.split(' ');
      
      return elem.className.split(' ');
    },
    
    addClass: function(elem, classname) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        for (var i=0; i<elem.length; i++) {
          gdgt.addClass(elem[i], classname);
        }
        return elem;
      }
      
      if (gdgt.hasClass(elem, classname))
        return gdgt(elem);
      
      elem.className = elem.className + ' ' + classname;
      return gdgt(elem);
    },
    
    removeClass: function(elem, classname) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        for (var i=0; i<elem.length; i++) {
          gdgt.removeClass(elem[i], classname);
        }
        return elem;
      }
      
      elem.className = elem.className.replace(classname, '');
      return gdgt(elem);
    },
    
    css: function(elem, prop, val) {
      var style = elem.style;
      
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        if (!val || val === undefined)
          return gdgt.css(elem[0], prop);
          
        for (var i=0; i<elem.length; i++) {
          gdgt.css(elem[i], prop, val);
        }
      } else if (gdgt.isElement(elem)) {
        if (!val || val === undefined)
          return eval('style.' + prop);
      
        eval('style.' + prop + ' = val');
      }
      return elem;
      
    },
    
    show: function(elem) {
      var display = 'block';
      
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        for (var i=0; i<elem.length; i++) {
          gdgt.show(elem[i]);
        }
        return elem;
      }
      
      if (elem.oldstyle && elem.oldstyle.display && elem.oldstyle.display.length > 0)
        display = elem.oldstyle.display;
      
      return gdgt.css(elem, 'display', 'block');
    },
    
    hide: function(elem) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        for (var i=0; i<elem.length; i++) {
          gdgt.hide(elem[i]);
        }
        return elem;
      }
      
      if (!elem.oldstyle)
        elem.oldstyle = {};
      
      elem.oldstyle.display = elem.style.display;
      return gdgt.css(elem, 'display', 'none');
    },
    
    addEvent: function(elem, event, callback) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        for (var i=0; i<elem.length; i++) {
          gdgt.addEvent(elem[i], event, callback);
        }
      } else if (gdgt.isElement(elem)) {
        if (document.addEventListener) {
          elem.addEventListener(event, callback, false);
        } else {
          elem.attachEvent('on' + event, function(e) {
            callback.call(e.srcElement, e);
          });
        }
      }
      return elem;
    },
    
    removeEvent: function(elem, event, callback) {
      if (elem.length && elem.length > 0 && typeof elem !== 'string') {
        for (var i=0; i<elem.length; i++) {
          gdgt.removeEvent(elem[i], event, callback);
        }
      } else if (gdgt.isElement(elem)) {
        if (document.removeEventListener) {
          elem.removeEventListener(event, callback, false);
        } else {
          elem.detachEvent('on' + event, function(e) {
            callback.call(e.srcElement, e);
          });
        }
      }
      return elem;
    }
  });
  
  /*
   * Object extenders - available/applied to contextual "gdgt objects", such as gdgt('elem_id').FUNCTION_NAME()
   * they're contextual, so "this" refers to the calling object/element
   */
  gdgt.fn.extend({
    attr: function(attr, val) {
      return gdgt.attr(this, attr, val);
    },
    
    each: function(method) {
      return gdgt.each(this, method);
    },
    
    text: function(val) {
      return gdgt.text(this, val);
    },
    
    html: function(code) {
      return gdgt.html(this, code);
    },
    
    hasClass: function(classname) {
      return gdgt.hasClass(this, classname);
    },
    
    getClass: function() {
      return gdgt.getClass(this);
    },
    
    addClass: function(classname) {
      return gdgt.addClass(this, classname);
    },
    
    removeClass: function(classname) {
      return gdgt.removeClass(this, classname);
    },
    
    css: function(prop, val) {
      return gdgt.css(this, prop, val);
    },
    
    show: function() {
      return gdgt.show(this);
    },
    
    hide: function() {
      return gdgt.hide(this);
    },
    
    appendChild: function(child) {
      if ((child.length && child.length > 0) && typeof child !== 'string' && !child.nodeType)
        child = child[0];
      
      this[0].appendChild(child);
      // need to get cloning working
      //this.each(function(i) {
        //this.appendChild(child);
      //});
      return this;
    },
    
    addEvent: function(event, callback) {
      return gdgt.addEvent(this, event, callback);
    },
    
    removeEvent: function(event, callback) {
      return gdgt.removeEvent(this, event, callback);
    },
    
    bind: function(event, callback) {
      return this.addEvent(event, callback);
    },
    
    unbind: function(event, callback) {
      return this.removeEvent(event, callback);
    },
    
    click: function(callback) {
      return this.addEvent('click', callback);
    },
    
    mousedown: function(callback) {
      return this.addEvent('mousedown', callback);
    },
    
    mouseup: function(callback) {
      return this.addEvent('mouseup', callback);
    }
  });
    
  window.gdgt = gdgt;
})(window);

gdgt.extend({
  gadgetListWidget: function(username, id) {
    return new gdgt.gadgetListWidget.fn.init(username, id);
  }
});

gdgt.gadgetListWidget.fn = gdgt.gadgetListWidget.prototype = {
  widgets: [],
  params: {
    width: 300,
    height: 265,
    heightOffset: 82,
    showCount: true,
    minWidth: 180,
    minHeight: 200,
    maxWidth: 500,
    maxHeight: 500
  },

  init: function(params) {
    var container, wurl, callback, obj;

    if (!params.user) return false;

    gdgt.extend(this.params, params);
    this.params.height = (this.params.height < this.params.minHeight) ? this.params.minHeight : this.params.height;
    this.params.height = (this.params.height > this.params.maxHeight) ? this.params.maxHeight : this.params.height;
    this.params.width = (this.params.width < this.params.minWidth) ? this.params.minWidth : this.params.width;
    this.params.width = (this.params.width > this.params.maxWidth) ? this.params.maxWidth : this.params.width;

    if (this.params.element)
      container = gdgt(this.params.element);
    id = 'gdgt_widget_' + this.params.user + '_' + gdgt.generateSeed();

    if (container) {
      container.attr('id', id);
      this.fillWidget(id);
    } else {
      this.drawWidget(id);
      container = gdgt('#' + id);
    }

    container.find('div.gdgt-widget-header ul.tabs li').find('a').click(function(e) {
      // TODO this can all be modified once we have .up() and .parent stuff enabled in gdgt()

      container.find('div.gdgt-widget-list ul.gadget-list').css('display', 'none');
      container.find('div.gdgt-widget-header ul.tabs li').removeClass('selected');
      if (gdgt(this).hasClass('have')) {
        container.find('div.gdgt-widget-list ul.have-list').css('display', 'block');
        container.find('div.gdgt-widget-header ul.tabs li.have').addClass('selected');
      } else if (gdgt(this).hasClass('want')) {
        container.find('div.gdgt-widget-list ul.want-list').css('display', 'block');
        container.find('div.gdgt-widget-header ul.tabs li.want').addClass('selected');
      } else if (gdgt(this).hasClass('had')) {
        container.find('div.gdgt-widget-list ul.had-list').css('display', 'block');
        container.find('div.gdgt-widget-header ul.tabs li.had').addClass('selected');
      }

      return false;
    });

    wurl = gdgt.fn.API_URL + 'profile/' + this.params.user + '/gadgets.jsonp/';
    callback = 'gdgt.gadgetListWidget.prototype.widgets[\'' + id + '\'].populate';
    gdgt.getJSONP(wurl, null, callback);

    obj = gdgt.extend(container, this);
    gdgt.gadgetListWidget.prototype.widgets[id] = obj;
    return obj;
  },

  populate: function(data) {
    if (!data.user) {
      var widget = this;
      gdgt(['have', 'want', 'had']).each(function(i) {
        var msg = gdgt(document.createElement('li'))
        .addClass('message')
        .css('height', (widget.params.height - widget.params.heightOffset) + 'px')
        .css('width', (widget.params.width - 10) + 'px')
        .text('This user has made their gadget list private.');
        widget.find('div.gdgt-widget-list ul.' + this + '-list').appendChild(msg);
      });
      return;
    }
    this.populateData(data);
  },

  populateData: function(data) {
    var have, want, had;

    this.find('div.gdgt-widget-header h4 a').attr('href', data.user.profile_url).attr('title', data.user.user_name + ' on gdgt');
    this.find('div.gdgt-widget-header a.gdgt-logo').attr('href', gdgt.fn.URL + '/');

    have = this.find('div.gdgt-widget-list ul.have-list');
    want = this.find('div.gdgt-widget-list ul.want-list');
    had = this.find('div.gdgt-widget-list ul.had-list');
    this.populateList(have, data.have);
    this.populateList(want, data.want);
    this.populateList(had, data.had);
    if (this.params.showCount === false || this.params.width < 200)
      this.find('div.gdgt-widget-header ul li span.count').css('display', 'none');

    this.find('div.gdgt-widget-header ul li.have span.count').text('(' + data.have.length + ')');
    this.find('div.gdgt-widget-header ul li.have a').attr('title', this.find('div.gdgt-widget-header ul li.have a').attr('title').split(' ')[0] + ' (' + data.have.length + ')');
    this.find('div.gdgt-widget-header ul li.want span.count').text('(' + data.want.length + ')');
    this.find('div.gdgt-widget-header ul li.want a').attr('title', this.find('div.gdgt-widget-header ul li.want a').attr('title').split(' ')[0] + ' (' + data.want.length + ')');
    this.find('div.gdgt-widget-header ul li.had span.count').text('(' + data.had.length + ')');
    this.find('div.gdgt-widget-header ul li.had a').attr('title', this.find('div.gdgt-widget-header ul li.had a').attr('title').split(' ')[0] + ' (' + data.had.length + ')');

  },

  populateList: function(list, data) {
    var item, widget;

    widget = this;
    list.html('');
    gdgt(data).each(function(i) {
      item = widget.createListItem(this);
      list.appendChild(item);
    });
  },

  createListItem: function(data) {
    var item, link, image, title;

    item = gdgt(document.createElement('li'))
    .addClass('list-item');

    link = gdgt(document.createElement('a'))
    .attr('href', gdgt.fn.URL + data.url)
    .attr('title', data.name)
    .addClass('item-name');

    image = gdgt(document.createElement('img'))
    .attr('alt', data.name);
    if (data.image.indexOf('http://') === 0)
      image.attr('src', data.image);
    else
      image.attr('src', gdgt.fn.IMG_URL + data.image);

    title = gdgt(document.createElement('span'))
    .appendChild(document.createTextNode(data.name));

    link.appendChild(image);
    link.appendChild(title);
    item.appendChild(link);

    return item;
  },

  drawWidget: function(id) {
    document.write('<div id="' + id + '"></div>');
    this.fillWidget(id);
  },

  fillWidget: function(id) {
    var widget = gdgt('#' + id);
    widget.addClass('gdgt-gadget-list-widget')
    .html('<div class="gdgt-widget-header"> \
      <a href="" class="gdgt-logo" title="gdgt"></a> \
      <h4><a href="">my <strong>gadgets</strong></a></h4> \
      <ul class="tabs"> \
        <li class="have selected"><a class="have" title="have">have <span class="have count"></span></a></li> \
        <li class="want"><a class="want" title="want">want <span class="want count"></span></a></li> \
        <li class="had"><a class="had" title="had">had <span class="had count"></span></a></li> \
      </ul> \
    </div> \
    <div class="gdgt-widget-list"> \
      <ul class="have-list gadget-list"></ul> \
      <ul class="want-list gadget-list"></ul> \
      <ul class="had-list gadget-list"></ul> \
    </div> \
    <div class="gdgt-widget-footer"> \
      <a href="' + gdgt.fn.URL + '/widgets/" class="create-list" title="make your own list!">// make your own list!</a> \
    </div>');

    widget.css('width', this.params.width + 'px')
    .find('div.gdgt-widget-list ul')
    .css('height', (this.params.height - this.params.heightOffset) + 'px');
  }
};
gdgt.gadgetListWidget.fn.init.prototype = gdgt.gadgetListWidget.fn;
