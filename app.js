const _ = require('lodash');
const fs = require('fs');
var position = 1;
var file_path = './jsonfile.txt';
if (process.argv.length === 2) {
    console.log('\n \nPlease use one of the following templates : \n node app.js add --title TITLEHERE --body BODYHERE \n node app.js list \n node app.js read --title TITLEHERE \n node app.js remove --title TITLEHERE \n \n')
} else
if (process.argv[2] === 'add') {
    if (process.argv.length === 3) {
        console.log(' \n \n Options : \n --help : Show help [boolean] \n --title, -t : Title of note [required] \n --body, -b : Body of note [required] \n \n Missing required arguments : Title and Body.');
    } else {
        var title = process.argv[4]
        var body = process.argv[6]
        var object = {
            title,
            body
        }

        fs.readFile(file_path, function read(err, data) {
            if (err) {
                throw err;
            }
            var file_content = data.toString();
            file_content = file_content.substring(position);
            var file = fs.openSync(file_path, 'r+');
            console.log('\n \n Note created :  \n  -- \n title : ' + object.title + '\n body : ' + object.body + '\n \n \n ')
            var bufferedText = new Buffer(JSON.stringify(object) + ',' + file_content);
            //bufferedText = bufferedText.slice(0,bufferedText.length-2) + bufferedText.slice(bufferedText.length-1, bufferedText.length)            
            fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
            fs.close(file);
        });
    }
} else if (process.argv[2] === 'list') {
    fs.readFile(file_path, function read(err, data) {
        if (err) {
            throw err;
        }
        var file_content = data.toString();
        if (file_content === '[]' ) {
            console.log('\n \n The file is emtpy : 0 notes to print. \n \n ')
        } else {
            var jsonObjectsString = file_content.substring(1, file_content.length - 2);
            var jsonObjectsArray = eval('[' + jsonObjectsString + ']')
            //console.log(jsonObjectsArray)
            console.log('Printing ' + jsonObjectsArray.length + ' note(s) \n')
            console.log('------------------------ \n')
            for (i = 0; i < jsonObjectsArray.length; i++) {
                console.log('title : ' + jsonObjectsArray[i].title + '\n')
                console.log('body : ' + jsonObjectsArray[i].body + '\n')
                console.log('------------------------ \n')
            }
        }
    });
} else if (process.argv[2] === 'read') {
    if (process.argv.length !== 5) {
        console.log('\n \n Options : \n --help : Show help [boolean] \n --title, -t : Title of note [required] \n \n Missing required argument : Title.');
    } else {
        fs.readFile(file_path, function read(err, data) {
            if (err) {
                throw err;
            }
            var file_content = data.toString();
            var jsonObjectsString = file_content.substring(1, file_content.length - 2);
            var jsonObjectsArray = eval('[' + jsonObjectsString + ']')
            var bool = true
            for (i = 0; i < jsonObjectsArray.length; i++) {
                if (jsonObjectsArray[i].title === process.argv[4]) {
                    if (bool === true) {
                        console.log('\n \n Note(s) found : \n \n ')
                    }
                    console.log('title : ' + jsonObjectsArray[i].title + '\n')
                    console.log('body : ' + jsonObjectsArray[i].body + '\n')
                    console.log('------------------------ \n')
                    bool = false
                }
            }
        });
    }
} else if (process.argv[2] === 'remove') {
    if (process.argv.length !== 5) {
        console.log('\n \n Options : \n --help : Show help [boolean] \n --title, -t : Title of note [required] \n \n Missing required argument : Title.');
    } else {
        fs.readFile(file_path, function read(err, data) {
            if (err) {
                throw err;
            }
            var file_content = data.toString();
            var jsonObjectsString = file_content.substring(1, file_content.length - 1);
            var jsonObjectsArray = eval('[' + jsonObjectsString + ',]')
            for (i = 0; i < jsonObjectsArray.length; i++) {
                if (jsonObjectsArray[i].title === process.argv[4]) {

                    jsonObjectsArray = jsonObjectsArray.filter(function (obj) {
                        return obj.title !== process.argv[4];
                    });

                }
            }
            console.log(jsonObjectsArray)
            fs.writeFile('./jsonfile.txt', JSON.stringify(jsonObjectsArray), function () {
                console.log('File Successfully updated ! ')
            })

            /*fs.appendFile('./jsonfile.txt',JSON.stringify(jsonObjectsArray),(err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!'); 
            })*/
        });
    }
}