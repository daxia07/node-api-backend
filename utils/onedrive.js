const axios = require("axios")

const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me/drive/root:/music/singers:/children",
    graphMeItemsEndpoint: "https://graph.microsoft.com/v1.0/me/drive/items/"
}

const getSongs = async (accessToken) => {
    const bearer = `Bearer ${accessToken}`
    const headers = {
        'Content-Type': 'application/json', 'Authorization': bearer
    }
    const data = []
    try {
        let res = await axios.get(graphConfig.graphMeEndpoint, { headers })
        const { data: { value } } = res
        // singers -> albums -> songs & cover
        for (let i=0; i < value.length; i++) {
            // fetch singers
            const {name: singer, id: singerId} = value[i]
            // fetch albums
            const albumsReturn = await axios.get(graphConfig.graphMeItemsEndpoint + `${singerId}/children`, { headers })
            const { data: { value: albums } } = albumsReturn
            //fetch songs
            for (let i=0; i < albums.length; i++) {
                const {name: album, id: albumId} = albums[i]
                const songsReturn = await axios.get(graphConfig.graphMeItemsEndpoint + `${albumId}/children`, { headers })
                // create link and identify cover
                // TODO: query cover
                const coverReturn = await axios.get(graphConfig.graphMeItemsEndpoint + `${albumId}/children?$filter=startsWith(name,'cover.')`, {headers})
                const {data: {value: covers=[{}]} } = coverReturn
                const {id: coverId=undefined} = covers[0]
                let coverUrl = ""
                if (coverId) {
                    const coverLinkReturn = await axios.post(graphConfig.graphMeItemsEndpoint + `${coverId}/createLink`, {
                        "type": "embed",
                        "scope": "anonymous"
                    }, {headers})
                    let { data: { link: {webUrl: coverLink} }} = coverLinkReturn
                    coverUrl = coverLink.replace('/embed?', '/download?')
                }
                const { data: { value: songs} } = songsReturn
                for (let i=0; i< songs.length; i++) {
                    const {name: song, id: songId} = songs[i]
                    if (songId === coverId) {
                        continue
                    }
                    const linkReturn = await axios.post(graphConfig.graphMeItemsEndpoint + `${songId}/createLink`, {
                        "type": "embed",
                        "scope": "anonymous"
                    }, {headers})
                    let { data: { link: {webUrl} }} = linkReturn
                    webUrl = webUrl.replace('/embed?', '/download?')
                    const entry = {
                        singer,
                        album,
                        name: song,
                        musicSrc: webUrl,
                        cover: coverUrl,
                        fileId: songId
                    }
                    data.push(entry)
                }
            }
        }
        // dispatch data
    } catch (e) {
        console.log(e)
    }
    return data
}

module.exports = getSongs