# YOUTUBE CONVERTER 1.0.2

Akan diupdae setiap error, maka gabung saluran untuk mengetahui informasi

## Contact And Channel

channel informasi untuk segala
system dibawah naungan "hydra"

[channel](https://whatsapp.com/channel/0029VadrgqYKbYMHyMERXt0e)
[number](https://wa.me/6285173328399)

## Installation

You can install the package using npm:

```bash
npm install github:skyzoo92/hydra_yt
```

## Usage

```Javascript
const { ytmp3, ytmp4 } = require('@hydra-ytdl');
```

## Quality Available

```Javascript
const audio = [ 64, 96, 128, 192, 256, 320 ]
const video = [ 360, 480, 720, 1080 ]
```
## Download Audio (MP3) 🎧

```Javascript
// url YouTube kamu
const url = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID';

// quality download, pilih di Quality Available
const quality = "128"

/* 
 * atau kamu bisa langsung url
 * saja untuk default quality (128)
 * example: ytmp3(url)
*/

ytmp3(url, quality)
    .then(result => {
        if (result.status) {
            console.log('Download Link:', result.download);
            console.log('Metadata:', result.metadata);
        } else {
            console.error('Error:', result.result);
        }
    });
```

## Download Video (MP4) 🗃️

```Javascript
// url YouTube kamu
const url = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID';

// quality download, pilih di Quality Available
const quality = "360"

/* 
 * atau kamu bisa langsung url
 * saja untuk default quality (360)
 * example: ytmp4(url)
*/

ytmp4(url, quality)
    .then(result => {
        if (result.status) {
            console.log('Download Link:', result.download);
            console.log('Metadata:', result.metadata);
        } else {
            console.error('Error:', result.result);
        }
    });
```
