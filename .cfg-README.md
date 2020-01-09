# configDotFiles  
If already installed, this file is from the bare repo installed in .cfg folder in your $HOME directory. The parent repo is on github here.
Read to use section for installation instructions.

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
Additionally, these instructions include an approach [presented in this article](https://www.atlassian.com/git/tutorials/dotfiles) for using a bare cloned repo with a clever alias to manage your changes over time.

Our source repo's `.gitignore` includes .cfg to avoid recursive issues and does not include any IDE files.

## To use  

In a fresh terminal, from your home directory use this to make an executable script and run it. If you do not have curl on Ubuntu, it will prompt you how to install it.

```shell script
curl https://gist.githubusercontent.com/rudimusmaximus/cbb877cb5797b00d7fbb9ddc88e7f8b9/raw > .cfg-install.sh &&chmod +x .cfg-install.sh
```
The script lives in [this gist](https://gist.github.com/rudimusmaximus/cbb877cb5797b00d7fbb9ddc88e7f8b9).  

Run it like this.
```shell script
bash .cfg-install.sh
```
When finished, you can simply remove it:  
```shell script  
rm .cfg-install.sh
```  
Any backups of .files that would have been overwritten can be found in .cfg-install.sh
After you restart the terminal, type 'alias' to see our shortcuts. The cursor now has magic powers in git repos. And, nvm is assumed installed. 
TODO: testing and open for comments, turn on more items from the original posts like functions and more settings that are currently commented out.
