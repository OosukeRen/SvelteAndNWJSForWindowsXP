function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

const uniqueInstanceID = UUID();
let projectName = 'YourAPP';
let packageData = fs.readFileSync('package.json', 'utf-8');
let packageDataParsed = JSON.parse(packageData);
packageDataParsed.name = `${projectName}-${uniqueInstanceID}`;
fs.writeFileSync('package.json', JSON.stringify(packageDataParsed), 'utf-8');
