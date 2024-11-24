<?php
/**
 * Registering the Slider Block Style
 */
function sbglock_register_block_style() {

    wp_enqueue_style('sgblock-slider-style', esc_url(SGBLOCK_URI . 'assets/css/slider.front.css'), [], SGBLOCK_VERSION);

    // Gallery Slider
    register_block_style(
        'core/gallery',
        array(
            'name'			=>	'slider',
            'label'			=>	__('Slider', 'sgblock'),
            'style-handle'  =>  'sgblock-slider-style'
        )
    );
}
add_action('init', 'sbglock_register_block_style');