#!/bin/bash

# Check if Inkscape is installed
if ! command -v inkscape &> /dev/null; then
    echo "Inkscape is not installed. Please install it first:"
    echo "  brew install inkscape"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "  brew install imagemagick"
    exit 1
fi

# Create PNG versions
echo "Converting SVG to PNG..."
inkscape -w 16 -h 16 packshiprc.svg -o packshiprc-16.png
inkscape -w 32 -h 32 packshiprc.svg -o packshiprc-32.png
inkscape -w 64 -h 64 packshiprc-128.svg -o packshiprc-64.png
inkscape -w 128 -h 128 packshiprc-128.svg -o packshiprc-128.png

# Create ICO version
echo "Creating ICO file..."
convert packshiprc-16.png packshiprc-32.png packshiprc-64.png packshiprc-128.png packshiprc.ico

echo "Conversion complete!"
echo "Files created:"
echo "  - packshiprc-16.png"
echo "  - packshiprc-32.png"
echo "  - packshiprc-64.png"
echo "  - packshiprc-128.png"
echo "  - packshiprc.ico" 