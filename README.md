# configDotFiles  

## Intent
Have a repo from which to setup any new MacOS or Linux shell environment with familiar cli experience.

### How it works  
The .bashrc pulls in the .bash_profile, so same experience whether it's a log in session like ssh or macOS or not depending on how initiating the cli.
At the heart of the code, this allows dividing customizations into logical groups by .fileName.  

```shell script
# .bash_profile excerpt
# Load the shell dotfiles, and then some:
# * ~/.path can be used to extend `$PATH`.
# * ~/.extra can be used for other settings you don’t want to commit.
for file in ~/.{path,bash_prompt,exports,aliases,functions,extra}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;
``` 

## To use  
These instructions include a clever approach based on this article for using a repo with clever alias to manage your changes over time.
article:
TODO: update instructions, resolve if you need to use bare repo if hosting on gh (i think no)
The article says, create a .cfg directory in home and some aliases so you can manage changes.

Gitignore should include .cfg to avoid recursive issues

Aliases should include:

```shell script

```

### save any existing ".files"
