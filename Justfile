# Extract feature grid i18n strings
extract-i18n:
    venv/bin/python scripts/extract_feature_grid_strings.py

# Run the Hugo dev server
runserver: extract-i18n
    -rm -rf public/
    hugo --config hugo.yaml,hugo.dev.yaml --gc --cleanDestinationDir server -D --disableFastRender

# Build the site
build: extract-i18n
    -rm -rf public/
    hugo

# Install dependencies
install:
    ln -s themes/my-saas/package-lock.json package-lock.json
    ln -s themes/my-saas/package.json package.json
    ln -s themes/my-saas/postcss.config.js postcss.config.js
    ln -s themes/my-saas/tailwind.config.js tailwind.config.js
    npm install
