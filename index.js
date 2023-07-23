// movies.js
const Search = document.querySelector(".search-input input");
// Function to display movies on the page
function displayMovies(moviesData) {
    const moviesContainer = document.getElementById("moviesContainer");
    var movieData = moviesData.Search
    moviesContainer.innerHTML = "";

    movieData.forEach(movie => {
        movie.comments = [];
        movie.rating = "";
        const movieItem = document.createElement("li");
        movieItem.classList.add("movie-item");
        movieItem.innerHTML = `
        <div class="movie-card">
            <div class="movie-name">${movie.Title}</div>
            <div class="movie-name">${movie.Year}</div>
            <img class="movie-image" src="${movie.Poster}">
          </div>
        `;
        movieItem.addEventListener("click", () => showMoviePage(movie));
        moviesContainer.appendChild(movieItem);
    });

    
}

// Function to fetch movies from the API and store in local storage
function fetchAndStoreMovies() {

    var text = document.getElementById('input-search').value;
    if (!text){
        text = "got";
    }
    document.getElementById('input-search').textContent = text;
    document.getElementById('Search-for').textContent = "Searched for " + text + " Movie Name";

    var url = "https://www.omdbapi.com/?s=" + text + "&apikey=7a75dd33&page=" + "1";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Store the movie data in local storage
            localStorage.setItem("moviesData", JSON.stringify(data));

            // Display the movies on the page
            displayMovies(data);
        })
        .catch(error => {
            console.error("Error fetching movie data:", error);
        });
}

// Function to show individual movie page with comments and rating
function showMoviePage(movie) {
    const individualMoviePage = document.getElementById("individualMoviePage");
    const movieTitleElement = document.getElementById("movieTitle");
    const movieYearElement = document.getElementById("movieYear");
    const commentsContainer = document.getElementById("commentsContainer");
    const ratingInput = document.getElementById("rating");
    const commentInput = document.getElementById("comment");

    // Display movie title and year
    movieTitleElement.textContent = movie.Title;
    movieYearElement.textContent = `Year: ${movie.Year}`;

    // Display comments for the selected movie
    commentsContainer.innerHTML = "";
    movie.comments.forEach(comment => {
        const commentItem = document.createElement("li");
        commentItem.textContent = comment;
        commentsContainer.appendChild(commentItem);
    });

    // Handle submit button click to add a new comment and rating
    const submitCommentButton = document.getElementById("submitComment");
    submitCommentButton.addEventListener("click", () => {
        const newRating = parseInt(ratingInput.value);
        const newComment = commentInput.value;

        // Update the movie's rating and comments
        if (!isNaN(newRating) && newRating >= 1 && newRating <= 5) {
            movie.rating = newRating;
        }

        if (newComment.trim() !== "") {
            movie.comments.push(newComment);
        }

        // Save the updated movie data back to local storage
        const movieData = JSON.parse(localStorage.getItem("moviesData")) || [];
        const updatedMovieData = movieData.map(dataMovie => (dataMovie.id === movie.id ? movie : dataMovie));
        localStorage.setItem("moviesData", JSON.stringify(updatedMovieData));

        // Clear input fields
        ratingInput.value = "";
        commentInput.value = "";

        // Re-render the movie page to show updated rating and comments
        showMoviePage(movie);
    });

    // Handle "Go Back" button click to go back to the movie list
    const goBackButton = document.getElementById("goBack");
    goBackButton.addEventListener("click", () => {
        individualMoviePage.style.display = "none";
        document.getElementById("moviesContainer").style.display = "block";
    });

    //Display the individual movie page and hide the movie list
    individualMoviePage.style.display = "block";
    document.getElementById("moviesContainer").style.display = "none";
}

// Check if movie data is available in local storage
fetchAndStoreMovies();
