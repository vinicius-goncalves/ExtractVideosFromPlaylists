const extractButton = document.querySelector('#extract-button')
const playlistIdSearch = document.querySelector('#playlist-id-search')
const linksVideoContainer = document.querySelector('#links-video-container')
const prevAndNextContainer = document.querySelector('#prev-next-container')
const resultContainer = document.querySelector('#results-container')
const headerInformation = document.querySelector('#header-information')
const copy = document.querySelector('.copy')

let playlistIdSearchInMemory = playlistIdSearch.value

const url = (termToSearch) => `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${termToSearch}&maxResults=50&key=AIzaSyAdUJVJ-T8RjlYjUMBzjCb181iFWcozD8Y`
const pages = (pageToken) => `${url(playlistIdSearchInMemory)}&pageToken=${pageToken}`

const copyContent = () => {
    navigator
    .clipboard
    .writeText(Array.from(document.querySelectorAll('a')).join(', '))

    headerInformation.textContent = "You've copied this page content succefully"
    headerInformation.style.color = '#4adf4a'

}

const insertIntoHTML = extractResults => {

    prevAndNextContainer.innerHTML = ''
    
    linksVideoContainer.style.display = 'block'
    extractButton.value = 'Extract again'
    playlistIdSearch.value = ''
    headerInformation.textContent = `The request has found ${extractResults.pageInfo.totalResults} videos from playlist: ${playlistIdSearchInMemory}`

    linksVideoContainer.innerHTML = extractResults.items.map(value => {
        
        const videoId = value.contentDetails.videoId
        const videoFromIdToUrl = `https://www.youtube.com/watch?v=${videoId}`
        
        return `
        <li class="video-link-extract-container">
        <a class="video-link-extract" href="${videoFromIdToUrl}" rel="external" target="_blank">${videoFromIdToUrl}</a>
                    </li>`
    }).join('')
    
    if (extractResults.nextPageToken || extractResults.prevPageToken) {
        prevAndNextContainer.innerHTML =
            `${extractResults.prevPageToken ? `<button class="previous" onclick="fetchMoreResults('${extractResults.prevPageToken}')">Previous</button>` : ''}
        ${extractResults.nextPageToken ? `<button class="next" onclick="fetchMoreResults('${extractResults.nextPageToken}')">More videos</button>` : ''}`
    }

    if (linksVideoContainer.querySelectorAll('li') != null) {
        prevAndNextContainer.innerHTML += `<button class="copy" onclick="copyContent()">Copy Content Extracted</button>`
    }
}

const fetchMoreResults = async token => {
    const response = await fetch(pages(token))
    const data = await response.json()
    insertIntoHTML(data)
}

const fetchTerm = async playlistToExtract => {
    const response = await fetch(url(playlistToExtract))
    const data = await response.json()
    insertIntoHTML(data)
}

extractButton.addEventListener('click', () => {
    const inputPlaylistId = playlistIdSearch.value.trim()
    if (!inputPlaylistId) {
        headerInformation.textContent = 'Please, insert a valid ID and try again.'
        headerInformation.style.color = 'red'
        return
    }

    playlistIdSearchInMemory = inputPlaylistId
    fetchTerm(playlistIdSearchInMemory)

})