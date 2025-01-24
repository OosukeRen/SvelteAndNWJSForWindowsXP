const nw = require('nw.gui');

// Start in the center of the screen AND with half the size of the screen OR resize and position the app as per CLI arguemnts.
const initialResize = () => {
    if(!window.isSubwindow && SHOULD_USE_DEFAULT_SIZE) {
        let nwWindow = nw.Window.get();
        let screenWidth = screen.width;
        let screenHeight = screen.height;
        nwWindow.width = screenWidth/2;
        nwWindow.x = screenWidth/4;
    
        nwWindow.height = screenHeight/2;
        nwWindow.y = screenHeight/4;
    }

    if(!window.isSubwindow && !SHOULD_USE_DEFAULT_SIZE) {
        nwWindow.width = appDimensions.width;
        nwWindow.x = appDimensions.x;
    
        nwWindow.height = appDimensions.height;
        nwWindow.y = appDimensions.y;
    }
}

// Spawns another instance of the same executable AND project files, then exits the current one.
nw.App.relaunchWithArgs = function (shouldQuit) {
    // const appPath = nw.App.argv[0] || process.execPath; // Path to the app executable
    // const args = newArgs.join(' '); // Combine new arguments into a single string
    let newLaunchArguments = [...nw.App.fullArgv];

    // post 0.15 nw object has process property, the quotes are because XP terminal expects paths to be inside of double quotes.
    let XPSafeNWPath = `"${(nw.process || process).execPath}"`;

    newLaunchArguments = newLaunchArguments.filter((_arg) => {
        return _arg !== workspaceDirectory
        && _arg.indexOf('--height') < 0
        && _arg.indexOf('--width') < 0
        && _arg.indexOf('--y') < 0
        && _arg.indexOf('--x') < 0
    });

    // add the arguments for the window dimensions.
    newLaunchArguments.push(...[`--height=${nwWindow.height}`, `--width=${nwWindow.width}`, `--y=${nwWindow.y}`, `--x=${nwWindow.x}`]);

    if(!window.child_process) {
        console.error('You have to import child_process');
    } else  {
        console.error('You have to remove this check.');
    };

    const commandToExecute = `${XPSafeNWPath} . ${newLaunchArguments.join(" ")}`;

    child_process.exec(commandToExecute, {stdio: 'ignore', detached: true}, (err, stdout, stderr)  => {

    });

    setTimeout(() => {
        if(shouldQuit) {
            nw.App.quit();
        }
    }, 30)
}

const appDimensions = {};

let SHOULD_USE_DEFAULT_SIZE = true;

{
    // Start in the center of the screen AND with half the size of the screen OR resize and position the app as per CLI arguemnts.
    const initialResize = () => {
        let nwWindow = nw.Window.get();

        if(!window.isSubwindow && SHOULD_USE_DEFAULT_SIZE) {
            let screenWidth = screen.width;
            let screenHeight = screen.height;
            nwWindow.width = screenWidth/2;
            nwWindow.x = screenWidth/4;
        
            nwWindow.height = screenHeight/2;
            nwWindow.y = screenHeight/4;
        }
    
        if(!window.isSubwindow && !SHOULD_USE_DEFAULT_SIZE) {
            nwWindow.width = appDimensions.width;
            nwWindow.x = appDimensions.x;
        
            nwWindow.height = appDimensions.height;
            nwWindow.y = appDimensions.y;
        }
    }

    const dimensionKeys = [
        'width',
        'height',
        'x',
        'y'
    ];

    const argumentsWithEqual = appArguments
    .filter((_argument) => _argument.includes('='))
    .reduce((acc, _argument) => {
        let [key, value] = _argument.split('=');
        acc[key.slice(2)] = value;

        return acc;
    }, {});

    dimensionKeys.forEach((key) => {
        let value = nwWindow[key];

        if(argumentsWithEqual[key]) {
            value = argumentsWithEqual[key]
            SHOULD_USE_DEFAULT_SIZE = false;
        }

        appDimensions[key] = parseFloat(value);
    });

    initialResize()
}