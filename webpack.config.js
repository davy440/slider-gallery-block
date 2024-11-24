const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        filters: {import: './assets/src/gallery.filters.jsx', filename: './gallery-filters/gallery.filters.js'}
    }
}