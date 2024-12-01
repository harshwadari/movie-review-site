const omdbApiKey = '2e179ad8'; // Your OMDb API key
const tmdbApiKey = 'e5f6c5aad099783bb84b54c34f1e0f97'; // Your TMDB API key

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        fetchMovieDetails(movieId);
    }
};

async function fetchMovieDetails(movieId) {
    const apiUrl = `http://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${omdbApiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data.Response === "True") {
            displayMovieDetails(data);
            fetchTMDBMovieReviews(data.Title); // Fetch TMDB reviews
            displaySentimentChart(data.Title);
            fetchTMDBMovieDetails(data.imdbID); // Pass imdbID to fetch TMDB details
        } else {
            document.getElementById('movie-info').innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        document.getElementById('movie-info').innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

function displayMovieDetails(movie) {
    const movieTitle = document.getElementById('movie-title');
    const movieInfo = document.getElementById('movie-info');

    movieTitle.textContent = movie.Title;

    movieInfo.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Cast:</strong> ${movie.Actors}</p>
        <p><strong>Released:</strong> ${movie.Released}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
    `;

    // Load reviews placeholder
    document.getElementById('reviews-list').innerHTML = "<p>Loading reviews...</p>";
}

async function fetchTMDBMovieReviews(movieTitle) {
    try {
        const tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieTitle)}`;
        const tmdbSearchResponse = await fetch(tmdbSearchUrl);
        const tmdbSearchData = await tmdbSearchResponse.json();

        if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
            const tmdbMovieId = tmdbSearchData.results[0].id;
            const tmdbReviewsUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/reviews?api_key=${tmdbApiKey}`;
            const tmdbReviewsResponse = await fetch(tmdbReviewsUrl);
            const tmdbReviewsData = await tmdbReviewsResponse.json();

            if (tmdbReviewsData.results && tmdbReviewsData.results.length > 0) {
                displayReviews(tmdbReviewsData.results);
            } else {
                document.getElementById('reviews-list').innerHTML = "<p>No reviews available for this movie.</p>";
            }
        } else {
            document.getElementById('reviews-list').innerHTML = "<p>No reviews found for this movie.</p>";
        }
    } catch (error) {
        console.error('Error fetching TMDB reviews:', error);
        document.getElementById('reviews-list').innerHTML = `<p>Something went wrong while fetching reviews. Please try again later.</p>`;
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review">
            <h4>${review.author}</h4>
            <p>${review.content}</p>
        </div>
    `).join('');
}

// Handle review submission
document.getElementById('submit-review').addEventListener('click', function () {
    const review = document.getElementById('review-input').value;
    if (review) {
        alert("Review submitted!"); // Replace with backend API call if needed
    } else {
        alert("Please write a review before submitting.");
    }
});

async function displaySentimentChart(movieTitle) {
    try {
        const encodedMovieTitle = encodeURIComponent(movieTitle);
        // Use a relative URL to your backend
        const response = await fetch(`/chart/${encodedMovieTitle}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const chartImageBase64 = data.chart_image;

        const imgElement = document.createElement('img');
        imgElement.src = `data:image/png;base64,${chartImageBase64}`;
        imgElement.alt = `Sentiment Analysis for ${movieTitle}`;

        const chartContainer = document.getElementById('sentiment-chart-container');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(imgElement);

    } catch (error) {
        console.error('Error fetching or displaying sentiment chart:', error);
    }
}

async function fetchTMDBMovieDetails(imdbID) {
    try {
        const tmdbSearchUrl = `https://api.themoviedb.org/3/find/${imdbID}?api_key=${tmdbApiKey}&external_source=imdb_id`;
        const tmdbSearchResponse = await fetch(tmdbSearchUrl);
        const tmdbSearchData = await tmdbSearchResponse.json();

        if (tmdbSearchData.movie_results && tmdbSearchData.movie_results.length > 0) {
            const tmdbMovieId = tmdbSearchData.movie_results[0].id;
            const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${tmdbApiKey}&append_to_response=videos,images`;
            const tmdbResponse = await fetch(tmdbUrl);
            if (!tmdbResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const tmdbData = await tmdbResponse.json();

            const trailer = tmdbData.videos.results.find(video => video.type === "Trailer");
            const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';
            const backdropUrl = tmdbData.images.backdrops.length > 0 ? `https://image.tmdb.org/t/p/original${tmdbData.images.backdrops[0].file_path}` : '';

            displayBackdropAndTrailer(backdropUrl, trailerUrl);
        }
    } catch (error) {
        console.error('Error fetching TMDB movie details:', error);
    }
}

function displayBackdropAndTrailer(backdropUrl, trailerUrl) {
    const backdropContainer = document.getElementById('backdrop-container');
    backdropContainer.style.backgroundImage = `url(${backdropUrl})`;

    const trailerContainer = document.getElementById('trailer-container');
    if (trailerUrl) {
        trailerContainer.innerHTML = `<iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        trailerContainer.innerHTML = '<p>No trailer available.</p>';
    }
}

// Function to fetch the user score for the searched movie based on the movie ID
function fetchUserScore(movieId) {
    const apiKey = 'e5f6c5aad099783bb84b54c34f1e0f97';
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
  
    // Make the API call to TMDB to get the movie details
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const voteAverage = data.vote_average.toFixed(1); // Round to 1 decimal place
        const voteCount = data.vote_count;
  
        // Update the HTML elements with the score and vote count
        document.getElementById('user-score').innerText = `${voteAverage} / 10`;
        document.getElementById('vote-count').innerText = `${voteCount.toLocaleString()} votes`;
  
        // Update the circular progress bar based on the user score
        const scorePercentage = voteAverage * 10; // Convert the score (0-10) to percentage (0-100)
  
        // Update the circular progress bar
        const circle = document.querySelector('.score-circle circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (scorePercentage / 100) * circumference;
  
        // Apply the stroke offset to visually show the score
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        
        // Optionally, you can update the stroke color to green
        circle.style.stroke = "green";
      })
      .catch(error => console.error('Error fetching movie details:', error));
  }
  