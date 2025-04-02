#!/bin/bash

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install it first."
    exit 1
fi

# Check if correct number of arguments is provided
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <input_video> <start_time> <end_time> <speed_factor>"
    echo "Example: $0 input.mp4 00:00:10 00:00:20 2"
    echo "This will convert 10 seconds of video starting at 10s, ending at 20s, sped up 2x"
    exit 1
fi

# Get arguments
input_video="$1"
start_time="$2"
end_time="$3"
speed_factor="$4"

# Get filename without extension
filename=$(basename "$input_video" | sed 's/\.[^.]*$//')

# Create output directory if it doesn't exist
output_dir="media/publications/${filename}"
mkdir -p "$output_dir"

# Calculate duration
start_seconds=$(date -d "1970-01-01 $start_time UTC" +%s)
end_seconds=$(date -d "1970-01-01 $end_time UTC" +%s)
duration=$((end_seconds - start_seconds))

# Convert video to optimized GIF with enhanced compression
ffmpeg -i "$input_video" \
    -ss "$start_time" \
    -t "$duration" \
    -vf "select=not(mod(n\,3)),fps=3,scale=-1:240:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=sierra2_4a" \
    -loop 0 \
    -compression_level 12 \
    "$output_dir/image0.gif"

echo "Conversion complete! Output saved as: $output_dir/image0.gif" 