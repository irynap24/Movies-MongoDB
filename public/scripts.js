document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display movies
    fetch('/movies')
        .then(response => response.json())
        .then(movies => {
            const moviesDiv = document.getElementById('movies');
            if (movies.length === 0) {
                moviesDiv.innerHTML = '<p>No movies found.</p>';
            } else {
                movies.forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.className = 'movie';
                    movieElement.innerHTML = `
                        <h3>${movie.title}</h3>
                        <p>${movie.plot}</p>
                    `;
                    moviesDiv.appendChild(movieElement);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            const moviesDiv = document.getElementById('movies');
            moviesDiv.innerHTML = '<p>Error loading movies.</p>';
        });

    // Fetch and display comments
    fetch('/comments')
        .then(response => response.json())
        .then(comments => {
            const commentsDiv = document.getElementById('comments');
            if (comments.length === 0) {
                commentsDiv.innerHTML = '<p>No comments found.</p>';
            } else {
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.innerHTML = `
                        <strong>${comment.name}:</strong>
                        <p>${comment.text}</p>
                    `;
                    commentsDiv.appendChild(commentElement);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            const commentsDiv = document.getElementById('comments');
            commentsDiv.innerHTML = '<p>Error loading comments.</p>';
        });
});
