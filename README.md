# SvelteAndNWJSForWindowsXP
This is a template for creating easily software for Windows XP with NW.js 15.4 (Latest possible version of NWjs that can successfully start on XP, which isn't the publicly known - 14.7). And Sveltekit (because it's pretty lightweight, easy to prototype and use and doesn't take up a loo of drive memory).

## Prerequisites. 

1. If you're building for windows XP, in order to evade as many issues as possible, you need to install NVM with Node v6.2.2 
(The internal Node.js for NW 0.15.4). That way if you write incompatible code you'll catch it earliest possible.

2. Folder pattern: 

![image](https://github.com/user-attachments/assets/718e9736-2b23-4245-8b38-20e8c2fc4c19)


### When you want to write components - modify them in the src folder, when you want to use pure .js scripts, write them in /public folder and then include them in index.html

I'll be looking in the future into a way to use scss with the project.

When starting to work with the project:

~ npm run dev

Now whenever you make a change in src, it'll automatically get built inside of public/build/bundle.js

so all you need to do is refresh the app.

When you're at a stage you're satisfied at for a user faced application -> 

run BuildApp.js but first configure it.

You'll find your app in MainFolder/BuiltApp/${YourProjectName}/${YourProjectName}.exe

If you want to be able to run more than 1 instance of your project, include "multipleInstances.js" in the index.html (as early as possible would be the best.)
// Reasoning - when NW.exe starts, it checks if an instance with this package.json name exists, so this script changes the name of the project with a UUID on every run

!!! "--user-data-dir=./NWProfile" this Chromium parameter:
If you're using the multiple instances script, you'll notice a parasite effect where %LOCALAPPDATA% gets filled with folders with ${yourAppNAME}-${RANDOM NUMBER}
When NW.exe gets started, it tries to create a folder with a user profile because of the embedded Chromium. This variable anchors all folders to one so that your drive doesn't fill up like this or if so, at least not that fast.

-------------

If you want to take everything a step further and protect your code -> go inside the package.nw folder 

RightClick => Select All, put them inside a .zip

once done rename the zip to "package.nw" (change the extension too)

then from cmd 

copy /b NAMEOFYOURPROJECT.exe+package.nw NAMEYOUWANT.exe

then voila, you can now delete your package.nw and your source code is hidden inside of the executable.

!!! Keep in mind that every time you're starting the application NW will be unzipping the project so it'll definitely slow down the starting duration based on the size and count of the files.
