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
  document.querySelector('img').src = canvas.toDataURL('image/png');
  var image_data = document.querySelector('img').src;
  var imageBlob = dataURItoBlob(image_data);
  var params = {
    Image: {
      Bytes: imageBlob
    },
    MaxLabels: 20,
    MinConfidence: 70
  };
  document.getElementById("result").innerHTML = "checking, please wait a few seconds...";
  rekognition.detectLabels(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else { // successful response
      tosay = ""
      for (i = 0; i < data.Labels.length; i++) {
        label = data.Labels[i].Name;
        confidence = data.Labels[i].Confidence;
        confidence = parseInt(confidence) + "%";
        tosay = tosay + " " + label + " " + confidence;
      }
      document.getElementById("result").innerHTML = tosay;
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