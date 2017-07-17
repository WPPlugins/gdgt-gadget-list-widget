<div id="gdgt_widget_<?php echo $username; ?>" class="gdgt-gadget-list-widget">
  <div class="gdgt-widget-header">
    <a href="<?php echo esc_url( GDGT_URL, array( 'http', 'https' ) ); ?>" class="gdgt-logo" title="gdgt"></a>
    <h4><a href="<?php echo esc_url( $user_url ); ?>" title="<?php echo esc_attr( $username ); ?> on gdgt"><?php echo __( 'my <strong>gadgets</strong>', 'gdgt-gadget-list-widget' ); ?></a></h4>
    <ul class="tabs">
      <li class="have selected"><a class="have" title="have (<?php echo $have_count; ?>)"><?php echo __( 'has', 'gdgt-gadget-list-widget' ); ?> <span class="count"><?php if ( $show_counts && $have_count > 0 )
  echo '(' . $have_count . ')'; ?></span></a></li>
      <li class="want"><a class="want" title="want (<?php echo $want_count; ?>)">wants <span class="count"><?php if ( $show_counts && $want_count > 0 )
  echo '(' . $want_count . ')'; ?></span></a></li>
      <li class="had"><a class="had" title="had (<?php echo $had_count; ?>)">had <span class="count"><?php if ( $show_counts && $had_count > 0 )
  echo '(' . $had_count . ')'; ?></span></a></li>
    </ul>
  </div>

  <div class="gdgt-widget-list">
    <ul class="have-list gadget-list">
      <?php
      if ( ! empty( $data ) && is_array( $data->have ) ) {
        foreach ( $data->have as $g ) {
          ?>
          <li class="list-item">
            <a href="<?php echo esc_url( GDGT_URL . $g->url, array( 'http', 'https' ) ); ?>" title="<?php echo esc_attr( $g->name ); ?>">
              <img src="<?php echo esc_url( GDGT_IMG_URL . $g->image, array( 'http', 'https' ) ); ?>" alt="<?php echo esc_attr( $g->name ); ?>" />
              <span><?php echo esc_html( $g->name ); ?></span>
            </a>
          </li>
          <?php
        }
      } else {
        ?>
        <li class="message"><?php echo sprintf( __( '%s has made their gadget list private.', 'gdgt-gadget-list-widget' ), esc_html( $username ) ); ?></li>
  <?php
}
?>
    </ul>

    <ul class="want-list gadget-list">
      <?php
      if ( ! empty( $data ) && is_array( $data->want ) ) {
        foreach ( $data->want as $g ) {
          ?>
          <li class="list-item">
            <a href="<?php echo esc_url( GDGT_URL . $g->url, array( 'http', 'https' ) ); ?>" title="<?php echo esc_attr( $g->name ); ?>">
              <img src="<?php echo esc_url( GDGT_IMG_URL . $g->image, array( 'http', 'https' ) ); ?>" alt="<?php echo esc_attr( $g->name ); ?>" />
              <span><?php echo esc_html( $g->name ); ?></span>
            </a>
          </li>
          <?php
        }
      } else {
        ?>
        <li class="message"><?php echo sprintf( __( '%s has made their gadget list private.', 'gdgt-gadget-list-widget' ), esc_html( $username ) ); ?></li>
  <?php
}
?>
    </ul>

    <ul class="had-list gadget-list">
      <?php
      if ( ! empty( $data ) && is_array( $data->had ) ) {
        foreach ($data->had as $g) {
          ?>
          <li class="list-item">
            <a href="<?php echo esc_url( GDGT_URL . $g->url, array( 'http', 'https' ) ); ?>" title="<?php echo esc_attr( $g->name ); ?>">
              <img src="<?php echo esc_url( GDGT_IMG_URL . $g->image, array( 'http', 'https' ) ); ?>" alt="<?php echo esc_attr( $g->name ); ?>" />
              <span><?php echo esc_html( $g->name ); ?></span>
            </a>
          </li>
          <?php
        }
      } else {
        ?>
        <li class="message"><?php echo sprintf( __( '%s has made their gadget list private.', 'gdgt-gadget-list-widget' ), esc_html( $username ) ); ?></li>
  <?php
}
?>
    </ul>
  </div>

  <div class="gdgt-widget-footer">
    <a href="<?php echo esc_url( GDGT_URL, array( 'http', 'https' ) ); ?>/widgets/" class="create-list" title="<?php esc_attr( __( 'make your own list!', 'gdgt-gadget-list-widget' ) ); ?>">// <?php echo esc_html( __( 'make your own list!', 'gdgt-gadget-list-widget' ) ); ?></a>
  </div>
</div>

<script type="text/javascript"><?php
$params = array('user' => strtolower($username), 'element' => '#gdgt_widget_' . $username);
foreach (array('width', 'height', 'showcount') as $key) {
	if ( isset( $options[$key] ) )
		$params[$key] = $options[$key];
}
?>gdgt.gadgetListWidget(<?php echo json_encode( $params ); ?>);</script>