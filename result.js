const apiKey = '2e179ad8'; // Your OMDb API key
const tmdbApiKey = 'e5f6c5aad099783bb84b54c34f1e0f97'; // Your TMDB API key

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
        fetchMovie(query);
    }
};

async function fetchMovie(query) {
    const apiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            document.getElementById('movie-list').innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        console.error('Error fetching movie:', error);
        document.getElementById('movie-list').innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = movies.map(movie => `
        <div class="movie">
            <a href="movie.html?id=${movie.imdbID}">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </a>
        </div>
    `).join('');
}
const voteAverage = 7.0; // Example average, you will fetch this dynamically
    const scorePercentage = (voteAverage * 10); // Convert score to percentage

    // Update the circle stroke-dasharray dynamically
    document.querySelector('.circle').style.strokeDasharray = `${scorePercentage}, 100`;

    // Update the text inside the circle dynamically
    document.querySelector('.percentage').textContent = `${scorePercentage}%`;
  