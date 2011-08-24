# ko - Knockout

Knockout makes it fun and easy to record your sleep / caffeine consumption
during a programing competition. Knockout installs a git commit hook that
records your current status in each commit message. Example:

    commit 4763e15c07e679790319f6130027dd857bd0faa3
    Author: Wade Simmons
    Date:   Tue Aug 23 10:16:13 2011 -0700

        Fix them bugs
        
        Hours of sleep: 7
        Cups of coffee: 3
        Cans of soda: 2
        Cans of redbull: 4

The stats are stored in `~/.ko.json`, so you can update your levels from any
open terminal. Any Git repo you install the commit hook to will then include
your global stats.

# Installation and example usage

```bash
$ npm install -g ko

$ ko --help 
 
  Usage: ko [options]

  Options:

    -s, --sleep <hours>  Add sleep
    -c, --coffee         Add coffee
    -p, --soda           Add soda / pop
    -r, --redbull        Add redbull

    -l, --list           Show current stats
    -i, --install        Install pre-commit hook
    -R, --reset          Reset stats
    -h, --help           output usage information

$ cd my-git-repo

$ ko --install
 -> .git/hooks/prepare-commit-msg
 -> .git/hooks/commit-msg

$ ko -c 
 
Hours of sleep: 0
Cups of coffee: 1 <<
Cans of soda: 0
Cans of redbull: 0

$ ko -s 4 
 
Hours of sleep: 4 <<
Cups of coffee: 1
Cans of soda: 0
Cans of redbull: 0

$ git commit -a -m 'quick commit message' 
[master 4763e15] quick commit message
 1 files changed, 1 insertions(+), 1 deletions(-)

$ git show HEAD 
commit 4763e15c07e679790319f6130027dd857bd0faa3
Author: Wade Simmons
Date:   Tue Aug 23 10:16:13 2011 -0700

    quick commit message
    
    Hours of sleep: 4
    Cups of coffee: 1
    Cans of soda: 0
    Cans of redbull: 0
```
