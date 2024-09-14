document.addEventListener('DOMContentLoaded', () => {
    const moviesList = document.getElementById('moviesList');
    const commentsSection = document.getElementById('commentsSection');
    const commentsList = document.getElementById('commentsList');
    const viewCommentsButton = document.getElementById('viewCommentsButton');
    const backToMoviesButton = document.getElementById('backToMoviesButton');

    // Function to fetch and display movies
    async function fetchMovies() {
        try {
            const response = await fetch('/movies');
            if (!response.ok) throw new Error('Network response was not ok');
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            moviesList.innerHTML = '<p>Error loading movies.</p>';
        }
    }

    // Function to display movies
    function displayMovies(movies) {
        moviesList.innerHTML = '';
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.innerHTML = `
                <h3>${movie.title}</h3>
                <p>${movie.plot || 'No plot available'}</p>
            `;
            moviesList.appendChild(movieElement);
        });
    }

    // Function to fetch and display comments
    async function fetchComments() {
        try {
            const response = await fetch('/comments');
            if (!response.ok) throw new Error('Network response was not ok');
            const comments = await response.json();
            displayComments(comments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            commentsList.innerHTML = '<p>Error loading comments.</p>';
        }
    }

    // Function to display comments
    function displayComments(comments) {
        commentsList.innerHTML = ''; // Clear existing comments
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.innerHTML = `<p>${comment.text}</p>`;
            commentsList.appendChild(commentElement);
        });
    }

    // Event listeners
    viewCommentsButton.addEventListener('click', () => {
        fetchComments();
        moviesList.style.display = 'none';
        commentsSection.style.display = 'block';
    });

    backToMoviesButton.addEventListener('click', () => {
        moviesList.style.display = 'block';
        commentsSection.style.display = 'none';
    });

    // Initial fetch of movies
    fetchMovies();
});
