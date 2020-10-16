AWS.config.update({region: 'ap-southeast-2'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-southeast-2:4eb76fb5-5400-4cc4-a2a1-e80f05284988',
});
var rekognition = new AWS.Rekognition();
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;


function startReckognition() {
  snapshot(stream)
}

function snapshot(stream) {
  localMediaStream = stream;
  console.log('videoWidth:', video.videoWidth, 'videoHeight', video.videoHeight);
  ctx.drawImage(video, 0, 0, 1000, 1000, 0, 0, 300, 300);
  document.getElementById('somedata').src = canvas.toDataURL('image/png');
  var image_data = document.getElementById('somedata').src;
  var imageBlob = dataURItoBlob(image_data);
  console.log('blob bytes',imageBlob.byteLength)
  var params = {
    Image: {
      Bytes: imageBlob
    },
    Attributes: [
      "ALL"
    ]
  };
  document.getElementById("result").innerHTML = "checking, please wait a few seconds...";
  rekognition.detectFaces(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else { // successful response
      
      feels = data.FaceDetails[0].Emotions
      //console.log(feels)
      displaythis = ""
      for (var i = 0; i < feels.length; i++) {
        //console.log(feels[i]['Type'],feels[i]['Confidence']);
        howfeel = feels[i]['Type']
        howconfident = Math.round(feels[i]['Confidence'])
        console.log(howfeel,howconfident);
        if (howfeel == "HAPPY" && howconfident > 90 ) {displaythis = 'HAPPY!!!'; break}
        else {displaythis=displaythis+howfeel+'  '+howconfident+'%<br>';}
      }

      document.getElementById("result").innerHTML = displaythis;
    } // successful response
  });
}


function dataURItoBlob(image_data) {
  var binary = atob(image_data.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Uint8Array(array);
}