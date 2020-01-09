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
article: https://www.atlassian.com/git/tutorials/dotfiles

Our source repo's Gitignore includes .cfg to avoid recursive issues.

In a fresh terminal, from your home directory use this to make an executable script and run it.

```shell script
curl https://gist.githubusercontent.com/rudimusmaximus/cbb877cb5797b00d7fbb9ddc88e7f8b9/raw > cfg-install.sh &&chmod +x cfg-install.sh
```
then run it
```shell script
cfg-install.sh
```
If you have any errors that were not backed up for you, back them up and remove them and try again.
When finsihed, you can simply remove it:  
```shell script  
rm cfg-install.sh
```  
