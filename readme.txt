=== gdgt gadget list widget ===
Contributors: gdgt
Tags: gdgt, widget, widgets, sidebar, gadget, gadgets, list
Requires at least: 2.8
Tested up to: 3.2.1
Stable tag: 1.1.1
License: GPLv2 or later

Show off your gadgets! This widget displays your gdgt Have, Want, and Had lists in a WordPress widget. For more, visit [gdgt widgets](http://gdgt.com/widgets/ "gdgt WordPress widget information")

== Installation ==

Obviously, you'll want to start by installing and activating the widget! (If you have any advanced caching plugins enabled, such as WP Super Cache, make sure you clear your site cache once installation is complete.)

= Widget =
1. Navigate to your Widgets subpanel under the Appearance menu.
1. Drag the widget into one or more sidebars.
1. Enter your gdgt username (if you don't have one, [sign up here](http://gdgt.com/register/ "register for gdgt") ).
1. Specify the size of your widget.
1. That's it!

= Template =
If you'd like to add the widget directly to your template, call the widget using the `<?php gdgt_gadget_list_widget('USERNAME', array('OPTION'=>VALUE)); ?>` template tag. The `username` is required, while `options` is an optional associative array allowing you to control the following:

* width (number of pixels, default 300, minimum 180, maximum 500)
* height (number of pixels, default 265, minimum 200, maximum 500)
* showcount (toggles display of list counts, true or false, default true)

Example: `<?php gdgt_gadget_list_widget('ryan', array('width'=>300, 'height'=>350, 'showcount'=>true)); ?>`

== Frequently Asked Questions ==

= Is there a minimum and maximum size for the widget? =

Yes. The widget can scale between 180-500 pixels wide, and 200-500 pixels tall.

= The list count is set to yes, why isn't it showing? =

If you've set the width to lower than 200 pixels, the widget's list count is disabled.

== Screenshots ==

1. Display your gdgt gadget list in a WordPress widget.

== Changelog ==

= 1.1.1 = 
* Fixed class constructor error when running on PHP 4
* Fixed errors regarding showing the product count.

= 1.1 =
* Only load gdgt JavaScript and CSS when widget is active for a given view
* Remote JSON feed replaces serialized PHP
* Use WordPress HTTP API for improved compatibility with WordPress installs
* Properly escape outputted text

== Upgrade notice ==

= 1.1.1 = 
Further compatibility with PHP 4 installs.

= 1.1 =
New API endpoints, improved compatibility, PHP5 updates.
