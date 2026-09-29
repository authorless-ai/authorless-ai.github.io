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

media_tag := "media"
repo := "authorless-ai/authorless-ai.github.io"

# Upload everything in static/videos to the media release, then redeploy the site (requires 'gh auth login')
upload-media:
    gh release view {{media_tag}} -R {{repo}} >/dev/null 2>&1 || gh release create {{media_tag}} -R {{repo}} --target master --title "Site media" --notes "Files for static/videos. Managed by 'just upload-media', pulled in by the Pages build." --prerelease --latest=false
    gh release upload {{media_tag}} static/videos/* -R {{repo}} --clobber
    gh workflow run gh-pages.yml -R {{repo}} --ref master

# Download site media from the media release into static/videos
fetch-media:
    mkdir -p static/videos
    gh release download {{media_tag}} -R {{repo}} -D static/videos --clobber
