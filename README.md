jquery-touchclick
=================

JQuery-Plugin triggers click-listeners on touch-events in order to remove delay

Features
--------
* Generic approach
* No custom events or other hacks needed
* Accounts for scrolling gestures

Example
-------

```
$(document).ready(function() {
	$("body").touchClick();
});
```

Get access to the plugin-instance:
```
var touchClick = $("body").data('touchClick');
```


Rails
-----

To integrate jquery-touchclick with rails add the jquery-benignware-rails gem to your application bundle

```
gem 'jquery-benignware-rails'
```

Require the javascript in your application.js
```
//= require benignware/jquery.touchClick.js
```
