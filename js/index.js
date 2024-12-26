let startButton = document.getElementById('start')
let stopButton = document.getElementById('stop')
let video = document.getElementById('video')

let mediaRecorder

startButton.addEventListener('click', async () => {
    try {
        //  Intialize the variable 
        let recordedChunks = []

        // properties of the media stream
        const displayMediaOptions = {
            video: {
                displaySurface: "browser",
            },
            audio: {
                suppressLocalAudioPlayback: true,
            },
            preferCurrentTab: false,
            selfBrowserSurface: "exclude",
            systemAudio: "include",
            surfaceSwitching: "include",
            monitorTypeSurfaces: "include",
        };
        // Create  a MediaStream Recording API instance
        let captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)

        // Display the recording on the vidoe element (optional)
        video.srcObject = captureStream;

        // Initialize the mediaRecorder
        mediaRecorder = new MediaRecorder(captureStream);
        //  push data to the recordedChunks array
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        }
        // Enable stop button
        stopButton.disabled = false;
        startButton.disabled = true;
        //  combine the recorded chunks into blob 
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            recordedChunks = []
            //  download the blob
            const url = URL.createObjectURL(blob);
            video.srcObject = null;
            video.src = url;
            video.controls = true;
            video.play();

            // optional: Create a download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            a.textContent = 'Download recording';
            document.body.appendChild(a);
        }

        // strat recording 
        mediaRecorder.start()

    } catch (err) {
        console.error(err)
    }

})


//  stop video
stopButton.addEventListener('click', async () => {
    //  stop the mediaRecorder
    mediaRecorder.stop()
    //  disable stop button
    stopButton.disabled = true;
    startButton.disabled = false;
})