// support only last chrome || yandex 12.15

var db,
    dbVersion = 136,
    request = window.indexedDB.open('megaFiles', dbVersion),

    progressBar = document.getElementById('progress_bar'),
    progressText = document.getElementById('progress_percent'),
    progressUploaded = document.getElementById('progress_uploaded'),
    progressTotal = document.getElementById('progress_total'),
    progressRemaining = document.getElementById('progress_remaining'),
    progressSpeed = document.getElementById('progress_speed'),

    t = new TimeStructure(), //creating a TimeStructure object
    s = new SizeStructure(), //creating a SizeStructure object

    store;

document.getElementById('download').addEventListener('click', function(e) {
    e.preventDefault();
    downloadFile();
});

function loadFileViaAjax() {
    var ajax = new XMLHttpRequest(),
        downloadSpeed,
        startTime,
        blob;

    progressBar.value = 0;

    //ajax.open('GET', 'image-file', true);
    ajax.open('GET', 'mp3-file', true);
    ajax.responseType = 'blob'; //the magic
    ajax.addEventListener('progress', updateProgress, false);
    ajax.addEventListener('loadstart', onLoadStart, false);
    ajax.addEventListener('load', onComplete, false);
    ajax.addEventListener('abort', downloadAbort, false);
    ajax.addEventListener('error', downloadError, false);
    ajax.send();
    downloadSpeed = setInterval(getDownloadSpeed, 1000); //per seconds

    function downloadAbort(e) {
        console.log('download abort: ', e);
        clearInterval(downloadSpeed);
        ajax.abort();
    }

    function downloadError(e) {
        console.log('download error: ', e);
    }


    function getDownloadSpeed() {
        speed = uploaded - prevUpload;
        prevUpload = uploaded;
        progressSpeed.innerHTML = s.SpeedToStructuredString(speed);

        // calculate remaining time
        remainingBytes = total - uploaded;
        timeRemaining = remainingBytes / speed;
        progressRemaining.innerHTML = t.SecondsToStructuredString(timeRemaining);
    }

    function onComplete() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            insertFileIntoDB(ajax.response);
            clearInterval(downloadSpeed);
        } else {
            console.log('failed to download');
        }
    }

    function onLoadStart() {
        console.log('start');
        startTime = new Date().getTime();
    }

    var uploaded = 0, prevUpload = 0, speed = 0, total = 0, remainingBytes = 0, timeRemaining = 0;

    function updateProgress(e) {
        //console.log('lengthComputable', e.lengthComputable);

        uploaded = e.loaded;
        total = e.total;
        var percentage = Math.round((e.loaded / e.total) * 100);

        progressBar.value = percentage;
        progressText.innerHTML = Math.round(percentage);
        progressUploaded.innerHTML = s.BytesToStructuredString(e.loaded);
        progressTotal.innerHTML = s.BytesToStructuredString(e.total);

        //if (!startTime) return;

        //var time = Math.round((new Date().getTime() - startTime) / 10) / 100;
        //var connSpeed = Math.round(e.loaded / time / 10000);
        //
        //progressTime.innerHTML = time;
        //progressSpeed.innerHTML = connSpeed;
    }
}

function downloadFile() {
    console.log('download file');

    createDB();
}

function extractFileFromDB() {
    var store = db.transaction(['files'], 'readwrite').objectStore('files');

    // Retrieve the file that was just stored
    store.get('blob').onsuccess = function (event) {
        var imgFile = event.target.result;

        console.log("Got elephant! " + imgFile);

        //imgFile = dataURLToBlob(imgFile);

        // Get window.URL object
        //var URL = window.URL || window.webkitURL;
        //
        //// Create and revoke ObjectURL
        //var imgURL = URL.createObjectURL(imgFile);

        // Set img src to ObjectURL
        //var imgElephant = document.createElement('img');
        //imgElephant.setAttribute('src', imgURL);
        //document.body.appendChild(imgElephant);

        saveAs(imgFile, "pretty song.mp3");

        // localStorage.setItem('img', imgURL);
        //window.open(imgURL);
        // Revoking ObjectURL
        //URL.revokeObjectURL(imgURL);

    };
}

function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    var parts, contentType, raw;

    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        parts = dataURL.split(',');
        contentType = parts[0].split(':')[1];
        raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    parts = dataURL.split(BASE64_MARKER);
    contentType = parts[0].split(':')[1];
    raw = window.atob(parts[1]);

    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

function insertFileIntoDB(blob) {
    console.log('put into db', blob);

    // After exception, you have to start over from getting transaction.
    var store = db.transaction(['files'], 'readwrite').objectStore('files');

    // Obtain DataURL string
    //var data = event.target.result;
    var req = store.put(blob, 'blob');
    req.onerror = function(e) {
        console.log(e);
    };
    req.onsuccess = function(event) {
        console.log('Successfully stored a blob as String.');

        extractFileFromDB();
    };

    //var fr = new FileReader();
    //
    //fr.onload = function(e) {
    //
    //};
    //
    //fr.readAsDataURL(blob);
}

function createDB() {
    console.log('createDB');
    loadFileViaAjax();
}

request.onerror = function (event) {
    console.log("Error creating/accessing IndexedDB database");
};

request.onsuccess = function (event) {
    console.log("Success creating/accessing IndexedDB database");

    db = event.target.result;

    db.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    console.log('db',db);
    db.createObjectStore('files');
};
