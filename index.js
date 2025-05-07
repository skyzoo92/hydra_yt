const axios = require("axios");
const yts = require("yt-search");
const { createDecipheriv } = require('crypto')

function getYouTubeVideoId(url) {
	const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|user\/[^\/\n\s]+\/)?(?:watch\?v=|v%3D|embed%2F|video%2F)?|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

const audio = [92, 128, 256, 320]
const video = [144, 360, 480, 720, 1080]

const hexcode = (hex) => Buffer.from(hex, 'hex')
const decode = (enc) => {
    try {
        const secret_key = 'C5D58EF67A7584E4A29F6C35BBC4EB12'
        const data = Buffer.from(enc, 'base64')
        const iv = data.slice(0, 16)
        const content = data.slice(16)
        const key = hexcode(secret_key)

        const decipher = createDecipheriv('aes-128-cbc', key, iv)
        let decrypted = Buffer.concat([decipher.update(content), decipher.final()])

        return JSON.parse(decrypted.toString())
    } catch (error) {
      throw new Error(error.message)
    }
}

async function savetube(link, quality, value) {
    try {
        const cdn = (await axios.get("https://media.savetube.me/api/random-cdn")).data.cdn
        const infoget = (await axios.post('https://' + cdn + '/v2/info', {
            'url': link
        },{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://yt.savetube.me/1kejjj1?id=362796039'
            }
        })).data
        const info = decode(infoget.data)
        const response = (await axios.post('https://' + cdn + '/download', {
            'downloadType': value,
            'quality': `${quality}`,
            'key': info.key
        },{
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://yt.savetube.me/start-download?from=1kejjj1%3Fid%3D362796039'
            }
        })).data
        const headRes = await axios.head(response.data.downloadUrl);
const contentLength = headRes.headers['content-length'];
        return {
    status: true,
    quality: `${quality}${value === "audio" ? "kbps" : "p"}`,
    availableQuality: value === "audio" ? audio : video,
    url: response.data.downloadUrl,
    size: contentLength ? Number(contentLength) : null,
    filename: `${info.title} (${quality}${value === "audio" ? "kbps).mp3" : "p).mp4"}`
}
    } catch (error) {
        console.error("Converting error:", error)
        return {
            status: false,
            message: "Converting error"
        }
    }
}

async function ytmp3(link, formats = 128) {
	const videoId = getYouTubeVideoId(link);
	const format = audio.includes(Number(formats)) ? Number(formats) : 128
	if (!videoId) {
		return {
			status: false,
			message: "Invalid YouTube URL"
		};
	}
	try {
	    let url = "https://youtube.com/watch?v=" + videoId
		let data = await yts(url);
		let response = await savetube(url, format, "audio")
		return {
			status: true,
			creator: "hydra-ytdl",
			metadata: data.all[0],
			download: response
		};
	} catch (error) {
		console.log(error)
		return {
			status: false,
			message: error.response ? `HTTP Error: ${error.response.status}` : error.message
		};
	}
}

async function ytmp4(link, formats = 360) {
	const videoId = getYouTubeVideoId(link);
	const format = video.includes(Number(formats)) ? Number(formats) : 360
	if (!videoId) {
		return {
			status: false,
			message: "Invalid YouTube URL"
		};
	}
	try {
		let url = "https://youtube.com/watch?v=" + videoId
		let data = await yts(url);
		let response = await savetube(url, format, "video")
		return {
			status: true,
			creator: "hydra-ytdl",
			metadata: data.all[0],
			download: response
		};
	} catch (error) {
		console.log(error)
		return {
			status: false,
			message: error.response ? `HTTP Error: ${error.response.status}` : error.message
		};
	}
}

async function transcript(link) {
    try {
        const response = await axios.get('https://ytb2mp4.com/api/fetch-transcript', {
            params: {
                'url': link
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://ytb2mp4.com/youtube-transcript'
            }
        });
        return {
            status: true,
            creator: "hydra-ytdl",
            transcript: response.data.transcript
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

module.exports = {
	ytmp3,
	ytmp4,
	transcript
};
