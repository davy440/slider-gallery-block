<?php
/**
 * Filter the Gallery Block to include markup for slider
 */

function sbblock_render_gallery_block($block_content, $block, $instance) {

    $attributes = $block['attrs'] ?? '';

;
    if (isset($attributes['className']) && 'is-style-slider' === $attributes['className']) {
        $block_content = "<section class='is-style-slider__wrapper'>{$block_content}";
        
        $block_content .= '<div class="is-style-slider__navigation">';
        $block_content .= '<button type="button" class="prev"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/></svg></button>';
        $block_content .= '<button type="button" class="next"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"/></svg></button>';
        $block_content .= '</div>';
        $block_content .= '</section>';

        // Adding attributes data in the block
        $isLightbox = $attributes['lightbox'] ?? '';
        $autoplay = $attributes['autoplay'] ?? '';
        $delay = $attributes['delay'] ?? '';
        $loop = $attributes['gap'] ?? '';
        $tags = new WP_HTML_Tag_Processor( $block_content );
        if ($tags->next_tag(['tag_name' => 'section'])) {

            if (!empty($isLightbox)) {
                $tags->set_attribute('data-enable-lightbox', true);
            }

            if (!empty($autoplay)) {
                $tags->set_attribute('data-autoplay', true);
            }

            if (!empty($delay)) {
                $tags->set_attribute('data-delay', true);
            }
    
            if (!empty($gap)) {
                $tags->set_attribute('data-gap', true);
            }
        }

    }

    return $block_content;
}
add_filter('render_block_core/gallery', 'sbblock_render_gallery_block', 10, 3);