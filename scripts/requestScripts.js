const extractButton = document.querySelector('#extract-button')
const playlistIdSearch = document.querySelector('#playlist-id-search')
const linksVideoContainer = document.querySelector('#links-video-container')
const prevAndNextContainer = document.querySelector('#prev-next-container')
const resultContainer = document.querySelector('#results-container')

const url = (termToSearch) => `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${termToSearch}&maxResults=50&key=AIzaSyAdUJVJ-T8RjlYjUMBzjCb181iFWcozD8Y`


const insertIntoHTML = extractResults => {
    linksVideoContainer.innerHTML = extractResults.items.map((value, index) => {
        
        const videoId = value.contentDetails.videoId
        const videoFromIdToUrl = `https://www.youtube.com/watch?v=${videoId}`

        return `
        <li class="video-link-extract-container">
                    <a class="video-link-extract" href="${videoFromIdToUrl}" rel="external" target="_blank">${videoFromIdToUrl}</a>
                    </li>`
    }).join('')

    if(extractResults.nextPageToken || extractResults.prevPageToken) {
        prevAndNextContainer.innerHTML = 
        `${extractResults.prevPageToken ? `<button class="previous" onclick="fetchMoreResults('${extractResults.prevPageToken}')">Previous</button>` : ''}
        ${extractResults.nextPageToken ? `<button class="next" onclick="fetchMoreResults('${extractResults.nextPageToken}')">More videos</button>` : ''}`

    }
}

const pages = (pageToken) => `${url(playlistIdSearch.value)}&pageToken=${pageToken}`

const fetchMoreResults = async token => {
    const response = await fetch(pages(token))
    const data = await response.json()
    insertIntoHTML(data)
} 

const fetchTerm = async () => {
    const response = await fetch(url(playlistIdSearch.value))
    const data = await response.json()
    insertIntoHTML(data)
}
    

extractButton.addEventListener('click', () => {
    fetchTerm()
})