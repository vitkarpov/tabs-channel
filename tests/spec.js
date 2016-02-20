var vow = require('vow');
var webpage = require('webpage');

console.log('start');

vow.all([
    'http://localhost:3000/a.com.html',
    'http://localhost:3001/b.com.html',
    'http://localhost:3002/c.com.html'
].map(function(url) {
    var page = webpage.create();

    return new vow.Promise(function(resolve, reject) {
        console.log('opening ' + url);
        page.open(url, function(status) {
            if (status !== 'success') {
                return reject();
            }
            console.log('opened ' + url);
            resolve(page);
        });
    })
})).then(
    function(pages) {
        var messages = {
            b: 'hello, B! It`s A!',
            c: 'hello, C! It`s A!'
        };

        pages[0].evaluate(function(pages) {
            document.getElementById('send').click();
        });
        pages[1].onCallback = onCallback;
        pages[2].onCallback = onCallback;

        function onCallback(data) {
            onCallback.called = onCallback.called || 0;
            onCallback.called++;
            try {
                assert(data.message === messages[data.page], data.message, data.page);
            } catch(e) {
                console.log(e);
            }
            if (onCallback.called === 2) {
                console.log('finish');
                phantom.exit();
            }
        }

        function assert(condition, message, page) {
            if (condition) {
                console.log('✓ Got message from "' + page + '": it\'s equal to "' + message + '"');
            } else {
                throw new Error(message + ' is not expected from ' + page);
            }
        }
    },
    function() {
        console.log('Unable to reach some of the test pages :(');
        phantom.exit();
    }
);
