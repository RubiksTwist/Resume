// Blog data (embedded or fetched)
const blogPosts = [
  { title: "Blog Post 1", content: "Content of Blog Post 1", date: "2025-10-01" },
  { title: "Blog Post 2", content: "Content of Blog Post 2", date: "2025-10-03" },
  { title: "Blog Post 3", content: "Content of Blog Post 3", date: "2025-10-05" }
];

// Sort blog posts by date (most recent first)
blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Function to display a blog post
function displayBlogPost(date) {
  const post = blogPosts.find(post => post.date === date);
  if (post) {
    document.getElementById("blog-title").innerText = post.title;
    document.getElementById("blog-content").innerText = post.content;
  }
}

// Function to generate the blog list
function generateBlogList() {
  const blogLinks = document.getElementById("blog-links");
  blogPosts.forEach(post => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = post.date;
    link.addEventListener("click", () => displayBlogPost(post.date));
    listItem.appendChild(link);
    blogLinks.appendChild(listItem);
  });
}

// Generate the blog list and display the latest post on page load
generateBlogList();
displayBlogPost(blogPosts[0].date);

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
