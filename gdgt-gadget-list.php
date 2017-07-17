<?php
/*
Plugin Name: gdgt gadget list widget
Plugin URI: http://gdgt.com/
Description: Show off your gadgets! This widget displays your <a href="http://gdgt.com/">gdgt</a> Have, Want, and Had lists.
Version: 1.1.1
Author: gdgt
Author URI: http://gdgt.com/
License: GPLv2 or later
*/

define( 'GDGT_VERSION', '1.1.1' );
define( 'GDGT_HOST', 'gdgt.com' );
define( 'GDGT_CDN_URL', 'http://media.gdgt.com/' );
define( 'GDGT_URL', 'http://' . GDGT_HOST );
define( 'GDGT_API_URL', 'http://api.' . GDGT_HOST );
define( 'GDGT_USR_URL', 'http://user.' . GDGT_HOST );
define( 'GDGT_IMG_URL', GDGT_CDN_URL . 'img/' );
define( 'GDGT_CSS_URL', GDGT_CDN_URL . 'css/' );
define( 'GDGT_REFRESH_LIST', (60 * 60 * 24) );

/**
 * Load CSS and JS
 */
function gdgt_gadget_list_init() {
	if ( is_active_widget( false, false, 'gadgetlistwidget' ) ) {
		wp_enqueue_script( 'gdgt-gadget-list-js', plugins_url( 'gdgt-gadget-list.js', __FILE__ ), null, GDGT_VERSION );
		wp_enqueue_style( 'gdgt-gadget-list-css', plugins_url( 'gdgt-gadget-list.css', __FILE__ ), null, null, 'all' );
	}
}
add_action( 'wp_enqueue_scripts', 'gdgt_gadget_list_init' );

class GadgetListWidget extends WP_Widget {

	function __construct() {
		parent::__construct( false, 'gdgt Gadget List', array( 'description' => 'Show off your gadgets!' ) );
	}

	function GadgetListWidget() {
		$this->__construct();
	}

	function widget($args, $instance) {
		extract($args);
		echo $before_widget;
		$options = array();
		$options['width'] = $instance['width'] ? $instance['width'] : 180;
		$options['height'] = $instance['height'] ? $instance['height'] : 250;
		$options['showcount'] = $instance['showcount'];

		if ( isset( $instance['gdgtuser'] ) )
			gdgt_gadget_list_widget( $instance['gdgtuser'], $options );
		echo $after_widget;
	}

	function form($instance) { ?>
    <div>
      <p><label for="<?php echo esc_attr( $this->get_field_id( 'gdgtuser' ) ); ?>"><?php echo sprintf( __( '%s username:', 'gdgt-gadget-list' ), 'gdgt' ); ?></label></p>
      <p><input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'gdgtuser' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'gdgtuser' ) ); ?>" value="<?php if ( isset( $instance['gdgtuser'] ) ) {
      echo esc_attr( $instance['gdgtuser'] );
    } ?>" /></p>
    </div>
    <div>
      <p>
        <label for="<?php echo esc_attr( $this->get_field_id( 'width' ) ); ?>"><?php echo __( 'width:', 'gdgt-gadget-list' ); ?></label>
        <input type="text" id="<?php echo esc_attr( $this->get_field_id( 'width' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'width' ) ); ?>" value="<?php if ( isset( $instance['width'] ) ) {
      echo absint( $instance['width'] );
    } else {
      echo 200;
    } ?>" style="width: 40px;" />px
      </p>
      <p>
        <label for="<?php echo esc_attr( $this->get_field_id( 'height' ) ); ?>"><?php echo __( 'height:', 'gdgt-gadget-list' ); ?></label>
        <input type="text" id="<?php echo esc_attr($this->get_field_id('height')); ?>" name="<?php echo esc_attr( $this->get_field_name( 'height' ) ); ?>" value="<?php if ( isset( $instance['height'] ) ) {
      echo absint( $instance['height'] );
    } else {
      echo 300;
    } ?>" style="width: 40px;" />px
      </p>
    </div>
    <div>
      <p>
	<?php echo __( 'show list counts:', 'gdgt-gadget-list' ); ?> <input type="radio" id="<?php echo esc_attr( $this->get_field_id( 'showcount' ) . '_true' ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'showcount' ) ); ?>" value="true" <?php if ( isset( $instance['showcount'] ) && ( $instance['showcount'] == 'true' || empty( $instance['showcount'] ) ) )
      echo 'checked="checked"'; ?> /> <label for="<?php echo esc_attr( $this->get_field_id( 'showcount' ) . '_true'); ?>"><?php echo __( 'yes', 'gdgt-gadget-list' ); ?></label> <input type="radio" id="<?php echo esc_attr( $this->get_field_id('showcount' ) . '_false' ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'showcount' ) ); ?>" value="false" <?php if ( isset( $instance['showcount'] ) && $instance['showcount'] == 'false' )
      echo 'checked="checked"'; ?> /> <label for="<?php echo esc_attr( $this->get_field_id( 'showcount' ) . '_false'); ?>"><?php echo __( 'no', 'gdgt-gadget-list' ); ?></label>
        <br />
	<?php echo __( '(only if width is 200px or more)', 'gdgt-gadget-list' ); ?>
      </p>
    </div><?php
  }

	function update( $new_instance, $old_instance ) {
		return $new_instance;
	}

}

add_action( 'widgets_init', create_function( '', 'return register_widget(\'GadgetListWidget\');' ) );

/**
 * Retrieve data from gdgt api servers and display the widget.
 *
 * @param string $username gdgt username
 * @param array $options widget options
 */
function gdgt_gadget_list_widget( $username, $options=array() ) {
	$now = time();
	$datakey = 'gdgt_widget_' . $username;
	$timekey = $datakey . '_updated';

	$data = false;

	$data = get_transient( $datakey );
	if ( $data === false ) {
		$last_updated = get_transient( $timekey );

		if ( $last_updated === false || ($now - $last_updated) > GDGT_REFRESH_LIST ) {
			$response = wp_remote_get(GDGT_API_URL . '/profile/' . strtolower($username) . '/gadgets.jsonp');
			if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) == 200) {
				$response_body = trim( wp_remote_retrieve_body( $response ) );
				if ( empty( $response_body ) )
					return;

				$data = json_decode( $response_body );
				if ( empty( $data ) || ! isset( $data->user ) )
					return;

				set_transient( $datakey, $data, GDGT_REFRESH_LIST );
				set_transient( $timekey, $now, GDGT_REFRESH_LIST );
			}
		}
	}

	if ( ! empty( $data ) )
		create_gadget_list_widget($username, $options, $data);
}

/**
 * Display gdgt gadget lists. Outputs HTML markup.
 *
 * @param string $username gdgt username
 * @param array $options widget options
 * @param array $data widget data
 */
function create_gadget_list_widget( $username, $options=array(), $data=null ) {
	$have_count = $want_count = $had_count = 0;
	$user_url = $user_img = '';
	if ( isset( $options['showcount'] ) && ( $options['showcount'] === false || $options['showcount'] === 'false' ) ) {
		$options['showcount'] = 'false';
		$show_counts = false;
	} else {
		$show_counts = true;
	}

	if ( ! empty( $data ) ) {
		$user = $data->user;
		$firstname = $user->first_name;
		$user_url = $user->profile_url;
		$user_img = $user->avatar_file_path;

		if ( isset( $data->have ) && is_array( $data->have ) )
			$have_count = count( $data->have );
		if ( isset( $data->have ) && is_array( $data->want ) )
			$want_count = count( $data->want );
		if ( isset( $data->had ) && is_array( $data->had ) )
			$had_count = count( $data->had );
	} else {
		$data = stdClass();
	}

	include dirname(__FILE__) . '/widget-skeleton.php';
}
