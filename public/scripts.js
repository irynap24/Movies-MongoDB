

document.addEventListener('DOMContentLoaded', () => {
    const moviesList = document.getElementById('moviesList');
    const commentsSection = document.getElementById('commentsSection');
    const commentsList = document.getElementById('commentsList');
    const viewCommentsButton = document.getElementById('viewCommentsButton');
    const backToMoviesButton = document.getElementById('backToMoviesButton');
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const commentId = document.getElementById('commentId');
    const prevMoviesPageButton = document.getElementById('prevMoviesPage');
    const nextMoviesPageButton = document.getElementById('nextMoviesPage');
    const moviesPageInfo = document.getElementById('moviesPageInfo');
    const prevCommentsPageButton = document.getElementById('prevCommentsPage');
    const nextCommentsPageButton = document.getElementById('nextCommentsPage');
    const commentsPageInfo = document.getElementById('commentsPageInfo');

    let moviesPage = 1;
    let moviesTotalPages = 1;
    let commentsPage = 1;
    let commentsTotalPages = 1;
    // Make sure this is at the top level of your scripts.js file
    window.deleteComment = async function (id) {
        try {
            const response = await fetch(`/comments/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete comment');
            fetchComments(); // Refresh comments after deletion
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    async function fetchMovies() {
        try {
            const response = await fetch(`/movies?page=${moviesPage}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const { movies, totalPages } = await response.json();
            moviesTotalPages = totalPages;
            displayMovies(movies);
            updateMoviesPaginationControls();
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            moviesList.innerHTML = '<p>Error loading movies.</p>';
        }
    }

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

    function updateMoviesPaginationControls() {
        prevMoviesPageButton.disabled = moviesPage <= 1;
        nextMoviesPageButton.disabled = moviesPage >= moviesTotalPages;
        moviesPageInfo.textContent = `Page ${moviesPage}`;
    }

    async function fetchComments() {
        try {
            const response = await fetch(`/comments?page=${commentsPage}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const { comments, totalPages } = await response.json();
            commentsTotalPages = totalPages;
            displayComments(comments);
            updateCommentsPaginationControls();
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            commentsList.innerHTML = '<p>Error loading comments.</p>';
        }
    }

    function displayComments(comments) {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.innerHTML = `
            <p>${comment.text}</p>
            <button onclick="editComment('${comment._id}', '${comment.text}')">Edit</button>
            <button onclick="deleteComment('${comment._id}')">Delete</button>
        `;
            commentsList.appendChild(commentElement);
        });
    }


    function updateCommentsPaginationControls() {
        prevCommentsPageButton.disabled = commentsPage <= 1;
        nextCommentsPageButton.disabled = commentsPage >= commentsTotalPages;
        commentsPageInfo.textContent = `Page ${commentsPage}`;
    }

    async function handleCommentSubmit(event) {
        event.preventDefault();
        const commentData = { text: commentText.value };

        if (commentId.value) {
            // Update existing comment
            await fetch(`/comments/${commentId.value}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });
        } else {
            // Add new comment
            await fetch('/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });
        }

        commentForm.reset();
        fetchComments();
    }

    window.editComment = function (id, text) {
        commentId.value = id;
        commentText.value = text;
    };

    // Function to delete a comment
    async function deleteComment(id) {
        try {
            const response = await fetch(`/comments/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete comment');
            fetchComments(); // Refresh comments after deletion
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    }


    viewCommentsButton.addEventListener('click', () => {
        fetchComments();
        moviesList.style.display = 'none';
        commentsSection.style.display = 'block';
    });

    backToMoviesButton.addEventListener('click', () => {
        moviesList.style.display = 'block';
        commentsSection.style.display = 'none';
    });

    commentForm.addEventListener('submit', handleCommentSubmit);

    prevMoviesPageButton.addEventListener('click', () => {
        if (moviesPage > 1) {
            moviesPage--;
            fetchMovies();
        }
    });

    nextMoviesPageButton.addEventListener('click', () => {
        if (moviesPage < moviesTotalPages) {
            moviesPage++;
            fetchMovies();
        }
    });

    prevCommentsPageButton.addEventListener('click', () => {
        if (commentsPage > 1) {
            commentsPage--;
            fetchComments();
        }
    });

    nextCommentsPageButton.addEventListener('click', () => {
        if (commentsPage < commentsTotalPages) {
            commentsPage++;
            fetchComments();
        }
    });

    fetchMovies();
});
