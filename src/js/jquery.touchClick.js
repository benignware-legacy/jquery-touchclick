// Ensure private scope + aliases
(function ( $, window) {
  
  var pluginName = 'touchClick';
  
  var defaults = {
    draggingTimeout: 100, 
    scrollingTimeout: 750, 
    preventClickTimeout: 10
  };
  
  function getOverflowContainer(elem) {
    while (elem && elem.nodeType == 1) {
      if (elem.nodeName.toLowerCase() == 'body' || elem.nodeName.toLowerCase() == 'html') {
        break;
      }
      var overflow = $(elem).css('overflow');
      if (overflow == 'auto' || overflow == 'scroll') {
        return elem;
      }
      elem = elem.parentNode;
    }
    return window;
  }
  
  // helper methods

  var pluginClass = function TouchClick(element, options) {
    
    var touchClick = this;
    
    
    var $element = $(element);
    var $window = $(window);
    
    var dragging = false;
    var draggingTimeoutId = null;
    var preventClick = false;
    var touchStartElement = null;
    
    var overflowContainer = null;
    var scrolling = false;
    var touchStartScrollPos = null;
    var scrollingTimeoutId = null;
    
    var preventClickTimeoutId = null;
    
    $element.bind('touchstart', function(event) {
      touchStartScrollPos = null;
      overflowContainer = getOverflowContainer(event.target);
      if (overflowContainer) {
        var scrollPos = {
          x: overflowContainer.scrollLeft, 
          y: overflowContainer.scrollTop
        };
        touchStartScrollPos = scrollPos;
      }
      window.clearTimeout(draggingTimeoutId);
      window.clearTimeout(scrollingTimeoutId);
      window.clearTimeout(preventClickTimeoutId);
      dragging = false;
      scrolling = false;
      touchStartElement = event.target;
      
      if (overflowContainer && (overflowContainer.scrollHeight > 0 || overflowContainer.scrollWidth > 0)) {
        $(overflowContainer).bind('scroll', scrollHandler);
      }
      
    });
    
    $element.bind('touchmove', function(event) {
      dragging = true;
      if (overflowContainer) {
        var scrollPos = {
          x: overflowContainer.scrollLeft, 
          y: overflowContainer.scrollTop
        };
        if (touchStartScrollPos) {
          if (touchStartScrollPos.x != scrollPos.x || touchStartScrollPos.y != scrollPos.y) {
            scrolling = true;
          }
        }
      }
    });
    
    var clicked = false;
	
	/*
	// test listener
    $element.bind('click', function(event) {
        console.log("TEST CLICK", event.target);
    });
    */
    
    function preventClickHandler(event) {
      if (event.originalEvent == window.event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.clearTimeout(preventClickTimeoutId);
        preventClickTimeoutId = window.setTimeout(function() {
          $(this).unbind('click', preventClickHandler);
        }, options.preventClickTimeout);
      }
    }
    
    $element.bind('touchend', function(event) {
      
      if (!scrolling && !dragging && event.target == touchStartElement) {
        
        $(event.target).trigger('click');
        
        $(event.target).bind('click', preventClickHandler);
        
        
        var events = jQuery._data(event.target).events;
        if (events && events['click'] && events['click'].length > 1) {
          var onClickHandlers = events['click'];
          onClickHandlers.splice(0, 0, onClickHandlers.pop());
        }
        
        //event.preventDefault();
        //event.stopImmediatePropagation();
      }
      
      window.clearTimeout(draggingTimeoutId);
      draggingTimeoutId = window.setTimeout(function() {
        dragging = false;
      }, options.draggingTimeout);
      
      
    });
    
    function scrollHandler(event) {
      scrolling = true;
      window.clearTimeout(draggingTimeoutId);
      draggingTimeoutId = window.setTimeout(function() {
        scrolling = false;
        $(this).unbind('scroll', scrollHandler);
      }, options.scrollingTimeout);
    }
    
    
  };
  

  // bootstrap plugin
  
  $.fn[pluginName] = function(options) {
      
      options = $.extend({}, defaults, options);

      return this.each(function() {
  
          if (!$(this).data(pluginName)) {
            
              $(this).data(pluginName, new pluginClass(this, options));
  
          }
          
          return $(this);
  
    });

  };

})( jQuery, window );