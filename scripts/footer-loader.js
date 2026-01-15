document.addEventListener("DOMContentLoaded", function () {
    const placeholder = document.getElementById("footer-placeholder");
    if (placeholder) {
        // Determine the path to the root based on the script tag's src
        const scriptTag = document.querySelector('script[src*="footer-loader.js"]');
        let rootPath = "";
        if (scriptTag) {
            const src = scriptTag.getAttribute("src");
            // Extract the prefix before 'scripts/footer-loader.js'
            if (src.indexOf("scripts/footer-loader.js") !== -1) {
                rootPath = src.split("scripts/footer-loader.js")[0];
            }
        }

        // Inline footer HTML to avoid CORS issues with file:// protocol
        const footerHTML = `
      <footer class="footer">
        <div class="footer-links">
          <a href="/pages/site/about.html">About</a>
          <a href="/pages/site/faq.html">FAQ</a>
          <a href="/pages/site/roadmap.html">Roadmap</a>
          <a href="/pages/site/privacy.html">Privacy</a>
          <a href="/pages/site/credits.html">Credits</a>
          <a href="/pages/site/sitemap.html">Sitemap</a>
        </div>
      
        <div class="footer-text">
          Made with 💙 by Students for Students. © 2025 Poornimites
        </div>
      </footer>
      `;

        placeholder.innerHTML = footerHTML;

        // Adjust links for file:// protocol
        if (window.location.protocol === 'file:') {
            const footerLinks = placeholder.querySelectorAll("a");
            footerLinks.forEach((link) => {
                let linkPath = link.getAttribute("href");
                if (linkPath.startsWith('/')) {
                    // Remove leading slash and prepend rootPath
                    const relativePath = rootPath + linkPath.substring(1);
                    link.setAttribute('href', relativePath);
                }
            });
        }
    }
});
