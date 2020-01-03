var QRCode = require('qrcode')
var canvas = document.getElementById('qrcode')
console.log('-----')
console.log('-----')
console.log('-----')
console.log('-----')


QRCode.toCanvas(canvas, 'sample text', function (error) {
  if (error) console.error(error)
  console.log('success!');
})