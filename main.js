// 変数
var audioContext
var recorder
 
// 初期化
window.onload = function init() {
  // オーディオコンテキストの初期化
  audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // 音声入力の取得
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
      // レコーダーの生成
      var input = audioContext.createMediaStreamSource(stream)
      audioContext.resume()
      recorder = new Recorder(input) 
    })
  }
}


function startTime(button) {
  let count =0;
  startRecording();
  const intervalId = setInterval(() =>{
    
    stopRecording();
    startRecording();
    if(false){　
      clearInterval(intervalId);　//intervalIdをclearIntervalで指定している
    }}, 5000);
    
}

// 録音開始
function startRecording(button) {
    console.log("音声入力を受け付けています");
  recorder && recorder.record()
}

// 録音停止
function stopRecording(button) {
    console.log("終了");
  recorder && recorder.stop()
   
  // 音声認識
  audioRecognize()
  console.log("ninnsikiga owarimasita");
  
   
  // レコーダーのクリア
  recorder.clear()
}

// 音声認識
function audioRecognize() {
  // WAVのエクスポート
  recorder && recorder.exportWAV(function(blob) {
    let reader = new FileReader()
    reader.onload = function() {
      // 音声認識
      let result = new Uint8Array(reader.result)
      let data = {
        "config": {
          "languageCode": "ja-JP",
          "audio_channel_count": 2
        },
        "audio": {
          "content": arrayBufferToBase64(result)
        }
      }
      fetch('https://speech.googleapis.com/v1/speech:recognize?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.text()
      }).then(function (text) {
        
        let result_json = JSON.parse(text)
        // 音声認識結果の表示
        text = result_json.results[0].alternatives[0].transcript
        console.log("result: " + text)

        let fromLang = 'ja'
        let toLang = 'en'

        // 翻訳
        const URL = "https://translation.googleapis.com/language/translate/v2?key="+apiKey_trans+
            "&q="+encodeURI(text)+"&source="+fromLang+"&target="+toLang
        let xhr = new XMLHttpRequest()
        xhr.open('POST', [URL], false)
        xhr.send();
        if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText); 
            console.log(res["data"]["translations"][0]["translatedText"]);
            Ans_trans = res["data"]["translations"][0]["translatedText"];
        }
        output.innerHTML = "\n" + Ans_trans

      })
    }
    reader.readAsArrayBuffer(blob)
  })
}

// ArrayBuffer → Base64
function arrayBufferToBase64(buffer) {
  let binary = ''
  let bytes = new Float32Array(buffer)
  let len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}