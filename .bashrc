# shellcheck shell=bash

# Source interactive configurations, interactive shells
for file in ~/.{bash_prompt,aliases,functions}; do
    [ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;

