async function updateVisitorCount() {
    try {
        const response = await fetch('https://api-for-resume-a4dfavdnhhdna0d8.eastus2-01.azurewebsites.net/api/HttpTrigger1');
        const data = await response.json();
        document.getElementById('visitor-count').innerText = data.count;
    } catch (error) {
        console.error("Error updating visitor count:", error);
    }
}

// Call the function when the page loads
window.onload = updateVisitorCount;