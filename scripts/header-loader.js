document.addEventListener("DOMContentLoaded", function () {
  const placeholder = document.getElementById("header-placeholder");
  if (placeholder) {
    // Determine the path to the root based on the script tag's src
    const scriptTag = document.querySelector('script[src*="header-loader.js"]');
    let rootPath = "";
    if (scriptTag) {
      const src = scriptTag.getAttribute("src");
      // Extract the prefix before 'scripts/header-loader.js'
      if (src.indexOf("scripts/header-loader.js") !== -1) {
        rootPath = src.split("scripts/header-loader.js")[0];
      }
    }

    // Inline header HTML to avoid CORS issues with file:// protocol and allow local testing
    const headerHTML = `
    <nav class="navbar">
      <div class="logo">
        <a href="/index.html">Poornimites</a>
      </div>

      <div class="nav-links">
        <a href="/index.html">Home</a>
        <a href="/pages/tools/tools.html">Tools</a>
        <a href="/pages/resources/notes.html">Notes</a>
        <a href="/pages/community/index.html">Lounge</a>
        <a href="/pages/user/profile.html">Profile</a>
      </div>

      <div class="nav-icons">
        <span class="icon">🔔</span>
        <span class="icon">⚙️</span>
      </div>
    </nav>
    `;

    placeholder.innerHTML = headerHTML;

    // Highlight active link
    const currentPath = window.location.pathname;
    const navLinks = placeholder.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      let linkPath = link.getAttribute("href");

      // Optional: Rewrite links to be relative for file:// support
      if (window.location.protocol === 'file:') {
        if (linkPath.startsWith('/')) {
          // Remove leading slash and prepend rootPath
          const relativePath = rootPath + linkPath.substring(1);
          link.setAttribute('href', relativePath);
          // Update linkPath for active check
          linkPath = relativePath;
        }
      }

      // Check for active link
      // We use checks that handle both file path variations and server paths
      if (currentPath.endsWith(linkPath) ||
        (linkPath.endsWith("index.html") && currentPath.endsWith("/")) ||
        currentPath.includes(linkPath.replace(/^\.\.\//, ''))) { // rough match for relative
        link.classList.add("active");
      }
    });
  }
});
