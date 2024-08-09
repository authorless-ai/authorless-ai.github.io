# Run the Hugo dev server
runserver:
    -rm public/*.dev.*
    hugo --config hugo.yaml,hugo.dev.yaml server -D --disableFastRender

# Build the site
build:
    -rm -rf public/
    hugo

# Install dependencies
install:
    ln -s themes/my-saas/package-lock.json package-lock.json
    ln -s themes/my-saas/package.json package.json
    ln -s themes/my-saas/postcss.config.js postcss.config.js
    ln -s themes/my-saas/tailwind.config.js tailwind.config.js
    npm install
