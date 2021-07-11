let text = '吾輩は猫である'
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
    alert(res["data"]["translations"][0]["translatedText"])
}