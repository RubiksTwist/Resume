// Fetch and display the latest blog post
async function loadLatestBlogPost() {
    const blogTitle = document.getElementById('blog-title');
    const blogMeta = document.getElementById('blog-meta');
    const blogContent = document.getElementById('blog-content');

    try {
        // Fetch the blog data from the JSON file
        const response = await fetch('latest-blog.json');
        const data = await response.json();

        // Use the first blog post in the array
        const latestBlog = data[0];

        // Update the blog section with fetched data
        blogTitle.textContent = latestBlog.title;
        blogMeta.textContent = `By ${latestBlog.author} on ${latestBlog.date}`;
        blogContent.innerHTML = latestBlog.content;
    } catch (error) {
        console.error('Error fetching the latest blog post:', error);
        blogTitle.textContent = 'Error loading blog post';
        blogMeta.textContent = '';
        blogContent.textContent = 'Please try again later.';
    }
}

// Load the latest blog post on page load
document.addEventListener('DOMContentLoaded', loadLatestBlogPost);
