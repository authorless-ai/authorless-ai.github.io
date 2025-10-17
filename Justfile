hugo_version := "0.151.2"

# Run the Hugo dev server
runserver:
    -rm -rf public/
    hugo --config hugo.yaml,hugo.dev.yaml --gc --cleanDestinationDir server -D --disableFastRender

# Build the site
build:
    -rm -rf public/
    hugo

# Install on linux
install-hugo:
    wget -O /tmp/hugo_extended_withdeploy_{{hugo_version}}_Linux-64bit.tar.gz https://github.com/gohugoio/hugo/releases/download/v{{hugo_version}}/hugo_extended_withdeploy_{{hugo_version}}_Linux-64bit.tar.gz
    tar xzf  /tmp/hugo_extended_withdeploy_{{hugo_version}}_Linux-64bit.tar.gz -C /tmp
    sudo mv /tmp/hugo /usr/local/bin/
    sudo chmod +x /usr/local/bin/hugo
    rm /tmp/hugo_extended_withdeploy_{{hugo_version}}_Linux-64bit.tar.gz
    rm /tmp/hugo

# Install dependencies
install:
    ln -s themes/my-saas/package-lock.json package-lock.json
    ln -s themes/my-saas/package.json package.json
    ln -s themes/my-saas/postcss.config.js postcss.config.js
    ln -s themes/my-saas/tailwind.config.js tailwind.config.js
    npm install
