document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const postSection = document.getElementById('postSection');
    const signInBtn = document.getElementById('signInBtn');
    const usernameInput = document.getElementById('username');
    const postInput = document.getElementById('postInput');
    const postBtn = document.getElementById('postBtn');
    const postsList = document.getElementById('postsList'); // To display the posts
  
    let username = '';
  
    // Load posts and comments from localStorage if available
    const loadPosts = () => {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.forEach(post => {
        displayPost(post);
      });
    };
  
    // Save posts to localStorage
    const savePosts = (posts) => {
      localStorage.setItem('posts', JSON.stringify(posts));
    };
  
    // Display a post in the posts list
    const displayPost = (post, postIndex) => {
      const postItem = document.createElement('div');
      postItem.classList.add('postItem');
      postItem.innerHTML = `
        <strong>${post.username}</strong>: ${post.content}<br><br>
        <button class="deletePostBtn">Delete Post</button><br><br>
        <button class="commentBtn">Comment</button><br>
        <div class="commentSection" style="display: none;">
            <textarea class="commentInput" placeholder="Write your comment..."></textarea>
            <button class="submitCommentBtn">Submit Comment</button>
            <ul class="commentList"></ul>
        </div>
      `;
  
      // Append the post to the posts list
      postsList.appendChild(postItem);
  
      // Display comments for the post
      post.comments.forEach(comment => {
        const commentList = postItem.querySelector('.commentList');
        const commentItem = document.createElement('li');
        commentItem.textContent = comment;
        commentList.appendChild(commentItem);
      });
  
      // Add event listener for deleting the post
      const deletePostBtn = postItem.querySelector('.deletePostBtn');
      deletePostBtn.addEventListener('click', () => {
        const posts = JSON.parse(localStorage.getItem('posts'));
        posts.splice(postIndex, 1); // Remove the post
        savePosts(posts);
        postsList.removeChild(postItem); // Remove from the DOM
      });
  
      // Add event listener for comment section toggle
      const commentBtn = postItem.querySelector('.commentBtn');
      commentBtn.addEventListener('click', () => {
        const commentSection = postItem.querySelector('.commentSection');
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
      });
    };
  
    // Sign in functionality
    signInBtn.addEventListener('click', () => {
      username = usernameInput.value.trim();
      if (username) {
        loginSection.style.display = 'none';
        postSection.style.display = 'block';
        alert(`Welcome, ${username}!`);
      } else {
        alert('Please enter your name or email to sign in.');
      }
    });
  
    // Post functionality (for posting a new post)
    postBtn.addEventListener('click', () => {
      const postContent = postInput.value.trim();
      if (postContent) {
        const newPost = {
          username: username,
          content: postContent,
          comments: [] // Initialize with no comments
        };
  
        // Save the new post in the localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(newPost);
        savePosts(posts);
  
        // Display the new post
        displayPost(newPost, posts.length - 1);
  
        // Clear the post input field
        postInput.value = '';
      } else {
        alert('Please write a post before submitting.');
      }
    });
  
    // Event delegation to handle comment submission and deletion
    postsList.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('submitCommentBtn')) {
        const commentSection = e.target.parentElement;
        const commentInput = commentSection.querySelector('.commentInput');
        const comment = commentInput.value.trim();
  
        if (comment) {
          const commentList = commentSection.querySelector('.commentList');
          const commentItem = document.createElement('li');
          commentItem.textContent = `${username}: ${comment}`;
          commentList.appendChild(commentItem);
  
          // Save the comment to the post in localStorage
          const postItem = e.target.closest('.postItem');
          const postIndex = Array.from(postsList.children).indexOf(postItem);
          const posts = JSON.parse(localStorage.getItem('posts'));
          posts[postIndex].comments.push(comment);
          savePosts(posts);
  
          // Clear the comment input field after posting
          commentInput.value = '';
        } else {
          alert('Please write a comment before submitting.');
        }
      }
  
      // Delete comment functionality
      if (e.target && e.target.classList.contains('deleteCommentBtn')) {
        const commentItem = e.target.closest('li');
        const postItem = e.target.closest('.postItem');
        const postIndex = Array.from(postsList.children).indexOf(postItem);
        const commentIndex = Array.from(commentItem.parentElement.children).indexOf(commentItem);
        const posts = JSON.parse(localStorage.getItem('posts'));
  
        // Remove the comment from the post
        posts[postIndex].comments.splice(commentIndex, 1);
        savePosts(posts);
  
        // Remove the comment from the DOM
        commentItem.parentElement.removeChild(commentItem);
      }
    });
  
    // Load existing posts from localStorage on page load
    loadPosts();
  });
  