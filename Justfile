# Run the Hugo dev server
runserver:
    hugo server -D --disableFastRender

# Install dependencies
install:
    ln -s themes/my-saas/package-lock.json package-lock.json
    ln -s themes/my-saas/package.json package.json
    ln -s themes/my-saas/postcss.config.js postcss.config.js
    ln -s themes/my-saas/tailwind.config.js tailwind.config.js
    npm install
