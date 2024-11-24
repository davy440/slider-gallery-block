import { createHigherOrderComponent} from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    RangeControl
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';

const withSliderControls = createHigherOrderComponent((BlockEdit) => {
    return ( props ) => {
        const { name, isSelectionEnabled, attributes, setAttributes } = props;
        const { className, lightbox, autoplay, delay, gap } = attributes;
        
        const customTooltip = value => `${value}s`;
        const delayMarks = value => `${value}px`;
        const marks = [
            {
                value: 1,
                label: ''
            },
            {
                value: 2,
                label: ''
            },
            {
                value: 3,
                label: ''
            },
            {
                value: 4,
                label: ''
            },
            {
                value: 5,
                label: ''
            },
            {
                value: 6,
                label: ''
            },
            {
                value: 7,
                label: ''
            },
            {
                value: 8,
                label: ''
            },
            {
                value: 9,
                label: ''
            },
            {
                value: 10,
                label: ''
            }
        ];

        
        if (name === 'core/gallery' && className === 'is-style-slider' && isSelectionEnabled)  {
            return (
                <>  
                    <InspectorControls group="settings">
                        <PanelBody title={ __( 'Slider Options' ) }>
                            
                            <ToggleControl
                                __nextHasNoMarginBottom
                                label={__('Enable Lightbox')}
                                help={__('Enable lightbox for slider if linking to media file')}
                                checked={lightbox}
                                onChange={() => setAttributes({lightbox: !lightbox})}
                            />

                            <ToggleControl
                                __nextHasNoMarginBottom
                                label={__('Autoplay')}
                                checked={autoplay}
                                onChange={() => setAttributes({autoplay: !autoplay})}
                            />

                            {
                                autoplay === true &&
                                (
                                    <RangeControl
                                        label={ __( 'Delay' ) }
                                        initialPosition={1}
                                        min={1}
                                        max={10}
                                        step={1}
                                        showTooltip={true}
                                        renderTooltipContent={customTooltip}
                                        withInputField={false}
                                        marks={marks}
                                        value={delay}
                                        onChange={(newDelay) => setAttributes({delay: newDelay})}
                                    />
                                )
                            }

                            <RangeControl
                                label={ __( 'Space between slides' ) }
                                initialPosition={2}
                                min={1}
                                max={10}
                                step={1}
                                showTooltip={true}
                                renderTooltipContent={delayMarks}
                                withInputField={false}
                                marks={marks}
                                value={gap}
                                onChange={(newGap) => setAttributes({gap: newGap})}
                            />
                        </PanelBody>
                    </InspectorControls>
                    <BlockEdit key="edit" { ...props } />
                </>
            );
        } else {
            return <BlockEdit key="edit" { ...props } />
        }
    };
}, 'withSliderControls');

addFilter(
    'editor.BlockEdit',
    'sg-block/with-slider-controls',
    withSliderControls
);

const addSliderSettings = (settings, name) => {
    if ('core/gallery' !== name) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            lightbox: {
                type: "boolean",
                default: false
            },
            autoplay: {
                type: "boolean",
                default: false
            },
            delay: {
                type: "number",
                default: 1
            },
            gap: {
                type: "number",
                default: 2
            }
        }
    };
}

addFilter(
    'blocks.registerBlockType',
    'sg-block/add-slider-settings',
    addSliderSettings
);


const addPropsToSlider = (props, blockType, attributes) => {
    
    if ('core/gallery' === blockType.name) {
        const { lightbox, autoplay, gap, delay } = attributes;
        return {
            ...props,
            'data-enable-lightbox': lightbox,
            'data-autoplay': autoplay,
            'data-delay': delay,
            'data-gap': gap
        }
    }
    return props;
}

addFilter(
    'blocks.getSaveContent.extraProps',
    'sg-block/add-props-to-slider',
    addPropsToSlider
);