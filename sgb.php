<?php
/**
 *
 *	Plugin Name: Slider for Gallery Block
 *	Description: Add a Slider block style for the Gallery block in WordPress Block Editor.
 *	Plugin URI: https://indithemes.com/product/slider-for-gallery-block
 *	Author URI: https://indithemes.com
 *	Version: 1.0.0
 *  Requires at least: 6.0
 *  Requres PHP: 5.6
 *	Author: indithemes
 *  License: GPLv2 or later
 *  License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *	Text Domain: sgblock
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class SGBlock {

    public function __construct() {

        if (!defined('SGBLOCK_VERSION')) {
            define('SGBLOCK_VERSION', '1.0.0');
        }
        
        if (!defined('SGBLOCK_PATH')) {
            define('SGBLOCK_PATH', trailingslashit(plugin_dir_path( __FILE__ )));
        }
        
        if (!defined('SGBLOCK_URI')) {
            define('SGBLOCK_URI', trailingslashit(plugin_dir_url( __FILE__ )));
        }

        require SGBLOCK_PATH . 'inc/block-style-registration.php';
        require SGBLOCK_PATH . 'inc/gallery-filter.php';
        
        add_action('wp_enqueue_scripts', [$this, 'sgblock_register_scripts']);
        add_action('init', [$this, 'sgblock_register_block_scripts']);

        add_filter('render_block_core/gallery', [$this, 'disable_core_styles'], 10, 3);
    }

    /**
     * Register Scripts and Styles for the plugin
     *
     * @return  void
     */
    public function sgblock_register_scripts() {
        wp_enqueue_style('glightbox-css', esc_url(SGBLOCK_URI . 'assets/lightbox/glightbox.min.css'), [], false);
        wp_enqueue_script('glightbox-js', esc_url(SGBLOCK_URI . 'assets/lightbox/glightbox.min.js'), [], false, ['in_footer' => 'true']);
        wp_enqueue_script('sgblock-front-js', esc_url(SGBLOCK_URI . 'assets/js/slider.front.js'), ['glightbox-js'], SGBLOCK_VERSION, ['strategy' => 'defer']);
    }

    /**
     * Disable Core Styles if Slider block style is selected
     *
     * @param   string      $block_content  The block content.
     * @param   array       $block          The full block, including name and attributes.
     * @param   WP_Block    $instance       The block instance.
     *
     * @return  string                      Updated Block Content
     */
    public function disable_core_styles($block_content, $block, $instance) {
        
        $parsed_block = $instance->parsed_block;
        $attributes = $parsed_block['attrs'];

        if (!isset($attributes['className'])) {
            return $block_content;
        }

        $style = $attributes['className'];

        if ($style === 'is-style-slider') {
            $processor = new WP_HTML_Tag_Processor($block_content);
            $processor->next_tag(['class_name' => 'wp-block-gallery']);
            $processor->remove_class('wp-block-gallery');
            $processor->remove_class('is-layout-flex');
            
            

            return $processor->get_updated_html();
        }

        return $block_content;
    }

    /**
     * Register block scripts
     *
     * @return  void
     */
    public function sgblock_register_block_scripts() {
        if (is_admin()) {
            wp_enqueue_script("sgblock-block-filters-js", esc_url(SGBLOCK_URI . 'assets/js/gallery-filters/gallery.filters.js'), array('wp-editor', 'wp-edit-post', 'wp-dom-ready', 'wp-core-data'), SGBLOCK_VERSION, true);
        }
    }
}
$instance = new SGBlock();