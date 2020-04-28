#!/bin/sh

if [ "$1" = "locks" ]; then
    find . -type f -name 'yarn.lock' -exec rm {} +
    find . -type f -name 'package-lock.json' -exec rm {} +
    find . -type f -name 'yarn-error.log' -exec rm {} +
fi

if [ "$1" = "packages" ] || [ "$1" = "locks" ]; then
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
    find . -name ".cache" -type d -prune -exec rm -rf '{}' +
fi

find . -name "tsconfig.tsbuildinfo" -prune -exec rm -rf '{}' +
find . -name "dist" -type d -prune | grep -v node_modules | xargs rm -rf
find . -name "lib" -type d -prune | grep -v node_modules | xargs rm -rf

if [ "$1" = "packages" ]; then
    yarn
fi
