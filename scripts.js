document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('nav a[href^="#"]'); // Only select internal links

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor click behavior
            const targetId = this.getAttribute('href'); // Get the href value (e.g., "#about-section")
            const targetElement = document.querySelector(targetId); // Find the corresponding section

            if (targetElement) {
                // Scroll to the target element smoothly
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Instagram-like profile logo zoom
    const logo = document.getElementById('profileLogo');
    const overlay = document.getElementById('profileOverlay');

    if (logo && overlay) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            overlay.classList.add('active');
        });
        overlay.addEventListener('click', function(e) {
            // Only close if clicked outside the large image
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
        // Optional: ESC key closes overlay
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                overlay.classList.remove('active');
            }
        });
    }

    // Fetch and render all blog posts
    function renderPosts() {
      fetch('/api/posts')
        .then(res => res.json())
        .then(posts => {
          const grid = document.getElementById('blogGrid');
          grid.innerHTML = '';
          posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `
              ${post.image_url ? `<img src="${post.image_url}" alt="Blog Image">` : ''}
              <div class="blog-content">
                <div>
                  <h2 class="blog-title">${post.title}</h2>
                  <p class="blog-excerpt">${post.summary}</p>
                  <p class="blog-meta">Published on ${new Date(post.timestamp).toLocaleDateString()} · ${post.tags || ''}</p>
                </div>
                <div class="author-tag">by Admin</div>
                <div class="reactions" style="margin: 0.5rem 0;">
                  ${['❤️','😆','😮','👍','👎'].map(emoji => `
                    <button disabled style="margin-right:6px;background:#f1f5f9;border:none;border-radius:0.5rem;padding:0.35rem 0.7rem;font-size:1.1rem;">
                      ${emoji} <span>${post.reactions && post.reactions[emoji] || 0}</span>
                    </button>
                  `).join('')}
                </div>
                <div>
                  <button onclick="toggleComments(${post.id})" id="toggle-comments-${post.id}" style="margin-bottom:8px;">Show Comments (${post.comments.length})</button>
                  <div class="comments" id="comments-${post.id}" style="display:none;">
                    <div>
                      ${post.comments.map(c => `
                        <div style="margin-bottom:6px;">
                          <b>${c.author}:</b> ${c.text} <span style="color:#888;font-size:0.85em;">(${new Date(c.timestamp).toLocaleString()})</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `;
            grid.appendChild(card);
          });
        });
    }

    // Reaction handler
    function reactToPost(postId, emoji) {
      fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      })
      .then(res => res.json())
      .then(reactions => {
        document.getElementById(`react-${postId}-${emoji}`).textContent = reactions[emoji];
      });
    }

    // Toggle comments
    function toggleComments(postId) {
      const el = document.getElementById(`comments-${postId}`);
      const btn = document.getElementById(`toggle-comments-${postId}`);
      if (el.style.display === 'none') {
        el.style.display = 'block';
        btn.textContent = btn.textContent.replace('Show', 'Hide');
      } else {
        el.style.display = 'none';
        btn.textContent = btn.textContent.replace('Hide', 'Show');
      }
    }

    // Submit comment
    function submitComment(e, postId) {
      e.preventDefault();
      const input = e.target.elements['comment'];
      fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'User', text: input.value })
      })
      .then(() => {
        renderPosts();
      });
      input.value = '';
      return false;
    }

    // Blog post upload
    const uploadForm = document.querySelector('.upload-form');
    if (uploadForm) {
      uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        fetch('/api/posts', {
          method: 'POST',
          body: formData
        })
        .then(res => {
          if (!res.ok) throw new Error('Failed to upload');
          return res.json();
        })
        .then(() => {
          alert('Blog post created!');
          uploadForm.reset();
          renderPosts();
        })
        .catch(() => alert('Error uploading post'));
      });
    }

    // Hide upload form and manager by default
    document.getElementById('adminUploadForm').style.display = 'none';
    document.getElementById('blogManagerCard').style.display = 'none';

    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: document.getElementById('adminUsername').value,
          password: document.getElementById('adminPassword').value
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(() => {
        document.getElementById('adminLoginBox').style.display = 'none';
        document.getElementById('adminUploadForm').style.display = '';
        document.getElementById('blogManagerCard').style.display = '';
        fetchMyBlogs();
      })
      .catch(() => alert('Invalid credentials'));
    });

    // Initial render
    renderPosts();
});