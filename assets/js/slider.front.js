/**
 * Slider Set up for the front-end
 */
const gallerySliderFunc = () => {
    // In case multiple instances of Gallery Block are present
    const galleries = document.getElementsByClassName('is-style-slider');
    if (galleries.length === 0) {
        return;
    }
    // Looping through the blocks
    for (const gallery of galleries) {
        const { enableLightbox, autoplay, delay, gap } = gallery.dataset;
        const sliderWrapper = gallery.parentElement;
        const slides = gallery.getElementsByTagName('figure');
        const slidesArr = Array.from(slides);
        const slideCount = slides.length;
        let slideWidth;
        let navCount = 0;
        let autoNext;
        let device;
        // Check the screen size of the device
        const isDevice = () => {
            device = window.innerWidth <= 768 ? 'tablet' : 'desktop';
            device = window.innerWidth <= 480 ? 'mobile' : device;
            return;
        };
        isDevice();
        window.onresize = isDevice;
        // If no images are added, abort!
        if (slideCount === 0) {
            return;
        }
        // Get the numer of columns set in Gallery block
        const match = gallery.getAttribute('class').match(/columns-([0-9a-z]+)/);
        let columns = match[1] === 'default' ? 3 : parseInt(match[1]);
        // Set width of each slide
        function setSlideWidth() {
            let wrapperWidth = gallery.clientWidth;
            let img = this.firstElementChild;
            img.style.width = `calc(100% - ${gap}px)`;
            if (device === 'desktop') {
                slideWidth = wrapperWidth / columns;
                return this.style.width = slideWidth + 'px';
            }
            if (device === 'tablet') {
                slideWidth = wrapperWidth / 2;
                this.style.marginRight = `${gap}px`;
                return this.style.width = slideWidth + 'px';
            }
            return this.style.width = '100%';
        }
        // Set Slider Height
        function setSliderHeight() {
            let heights = [];
            for (let slide of slides)
                heights = [...heights, slide.clientHeight];
            gallery.style.height = Math.max(...heights) + 'px';
        }
        // Set the initial markup for slider including
        // adding buffer slides and setting slider height
        function* setMarkup() {
            gallery.appendChild(slides[0].cloneNode(true));
            gallery.prepend(slides[slideCount - 1].cloneNode(true));
            yield;
            setSliderHeight();
        }
        const initMarkup = setMarkup();
        function addLightboxClass(link, index) {
            if (index > 0 && index <= slideCount) {
                link.classList.add('glightbox');
            }
            else {
                link.classList.remove('glightbox');
            }
        }
        // Initializing the Slides
        function initSlides() {
            const instance = this.toString();
            let index = 0;
            for (let slide of slides) {
                const anchor = slide.querySelector('a');
                const slideOffset = 'translateX(' + (index - 1) * 100 + '%' + ')';
                slide.style.transform = slideOffset;
                if (index > 0 && index <= columns) {
                    slide.classList.add('is-active');
                }
                else {
                    slide.classList.remove('is-active');
                }
                if (anchor && enableLightbox === 'true') {
                    addLightboxClass(anchor, index);
                }
                if (instance === 'init') {
                    slide.style.flexShrink = '0';
                    slide.style.position = 'absolute';
                    setSlideWidth.call(slide);
                    window.addEventListener('resize', () => setSlideWidth.call(slide));
                }
                slide.style.transition = 'transform 300ms ease';
                index++;
            }
            ;
        }
        // Add Slides
        initMarkup.next();
        // Initialize Slides
        initSlides.call('init');
        // Set Slider Height
        initMarkup.next();
        // Render the Next Slide
        const renderNextSlide = () => {
            navCount++;
            let firstElement = gallery.firstElementChild;
            firstElement = slidesArr.slice(navCount % slideCount)[0].cloneNode(true);
            gallery.firstElementChild.remove();
            gallery.appendChild(firstElement);
            initSlides.call('next');
        };
        // Render the Previous Slide
        const renderPrevSlide = () => {
            navCount--;
            let lastElement = gallery.lastElementChild;
            lastElement = slidesArr.slice(navCount % slideCount - 1)[0].cloneNode(true);
            gallery.lastElementChild.remove();
            gallery.prepend(lastElement);
            initSlides.call('prev');
        };
        // In case of autoplay, initialize the slider
        const initAutoplay = () => setInterval(() => renderNextSlide(), parseInt(delay) * 1000);
        if (autoplay === 'true') {
            autoNext = initAutoplay();
        }
        // Slider Navigation functionality
        const sliderNavigation = () => {
            const navPrev = sliderWrapper.querySelector('.prev');
            const navNext = sliderWrapper.querySelector('.next');
            navNext.addEventListener('click', () => {
                if (autoplay !== 'true') {
                    switch (device) {
                        case 'mobile':
                            if (navCount < slideCount - 1) {
                                renderNextSlide();
                            }
                            break;
                        case 'tablet':
                            if (navCount < slideCount - 2) {
                                renderNextSlide();
                            }
                            break;
                        default:
                            if (navCount < slideCount - columns) {
                                renderNextSlide();
                            }
                    }
                }
                if (autoplay === 'true') {
                    clearInterval(autoNext);
                    renderNextSlide();
                    autoNext = initAutoplay();
                }
            });
            navPrev.addEventListener('click', () => {
                if (navCount > 0) {
                    renderPrevSlide();
                }
            });
        };
        sliderNavigation();
        // Lightbox feature for Gallery block
        const LightboxFunc = () => {
            if (typeof GLightbox === 'undefined') {
                return;
            }
            const lightbox = GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                keyboardNavigation: true,
                width: "auto",
                height: "auto",
                draggable: false
            });
        };
        LightboxFunc();
    }
    ;
};
gallerySliderFunc();
