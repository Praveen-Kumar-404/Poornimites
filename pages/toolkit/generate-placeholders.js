// Script to generate placeholder pages for toolkit tools
const fs = require('fs');
const path = require('path');

const tools = [
    { name: 'citation-generator', title: 'Citation Generator', icon: '📝', description: 'Generate citations in APA, MLA, Chicago, and Harvard formats' },
    { name: 'plagiarism-checker', title: 'Plagiarism Checker', icon: '🔍', description: 'Basic plagiarism detection using web search' },
    { name: 'pdf-reader', title: 'PDF Reader', icon: '📖', description: 'View and navigate PDF files with search and zoom' },
    { name: 'pdf-converter', title: 'PDF Converter', icon: '🔄', description: 'Convert PDF to Word/Excel and images to PDF' },
    { name: 'ocr-scanner', title: 'OCR Scanner', icon: '📷', description: 'Extract text from images using OCR technology' },
    { name: 'pdf-highlighter', title: 'PDF Highlighter', icon: '🖍️', description: 'Highlight and annotate PDF documents' },
    { name: 'markdown-export', title: 'Markdown to PDF', icon: '📑', description: 'Write in markdown and export to styled PDF' },
    { name: 'notes', title: 'Note Taking', icon: '📝', description: 'Rich text note-taking with folders and search' },
    { name: 'assignment-tracker', title: 'Assignment Tracker', icon: '📅', description: 'Track assignments with deadlines and status' },
    { name: 'reminders', title: 'Reminders', icon: '🔔', description: 'Set reminders with browser notifications' },
    { name: 'timetable', title: 'Timetable', icon: '🗓️', description: 'Create and manage your class schedule' },
    { name: 'resume-templates', title: 'Resume Builder', icon: '📄', description: 'Create professional resumes with templates' },
    { name: 'lecture-notes', title: 'Lecture Notes', icon: '📚', description: 'Upload and organize lecture notes by subject' },
    { name: 'file-organizer', title: 'File Organizer', icon: '🗂️', description: 'Batch rename and organize files efficiently' },
    { name: 'scholar-search', title: 'Scholar Search', icon: '🔬', description: 'Quick access to Google Scholar with history' },
    { name: 'reference-manager', title: 'Reference Manager', icon: '📚', description: 'Manage references and generate bibliographies' },
    { name: 'code-editor', title: 'Code Editor', icon: '⌨️', description: 'Lightweight editor with syntax highlighting' },
    { name: 'snippet-manager', title: 'Snippet Manager', icon: '📋', description: 'Save and organize code snippets' },
    { name: 'formatters', title: 'Code Formatters', icon: '🎨', description: 'Format SQL, JSON, XML, HTML, and CSS' },
    { name: 'github-shortcuts', title: 'GitHub Shortcuts', icon: '🐙', description: 'Quick access to your GitHub repositories' },
    { name: 'csv-viewer', title: 'CSV Viewer', icon: '📊', description: 'View, edit, and convert CSV files' },
    { name: 'chart-generator', title: 'Chart Generator', icon: '📈', description: 'Create charts and graphs from data' },
    { name: 'campus-map', title: 'Campus Map', icon: '🗺️', description: 'Interactive map of campus buildings' },
    { name: 'library-search', title: 'Library Search', icon: '📚', description: 'Quick access to library catalog' },
    { name: 'bus-timetable', title: 'Bus Timetable', icon: '🚌', description: 'Campus bus routes and schedules' },
    { name: 'attendance', title: 'Attendance Tracker', icon: '📊', description: 'Track and calculate attendance percentage' },
    { name: 'shared-notes', title: 'Shared Notes', icon: '📝', description: 'Collaborate on notes in real-time' },
    { name: 'study-chat', title: 'Study Chat', icon: '💬', description: 'Create study group chat rooms' },
    { name: 'whiteboard', title: 'Whiteboard', icon: '🎨', description: 'Collaborative drawing and brainstorming' }
];

const template = (tool) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${tool.title} - Poornimites Toolkit</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/footer.css">
    <link rel="stylesheet" href="../../assets/css/toolkit.css">
</head>
<body>
  <header class="navbar">
    <div class="logo">🎓 <a href="../../index.html">Poornimites</a></div>
    <nav class="nav-links">
      <a href="../../tools.html">← Back to Toolkit</a>
    </nav>
    <div class="nav-icons">
      <a href="../../index.html">🏠</a>
    </div>
  </header>

  <main class="toolkit-container">
    <div class="toolkit-header">
      <h1>${tool.icon} ${tool.title}</h1>
      <p>${tool.description}</p>
    </div>

    <div class="tool-content">
      <div class="alert alert-info">
        <strong>🚧 Coming Soon!</strong><br>
        This tool is currently under development. Check back soon for updates!
      </div>

      <div class="tool-section">
        <h2>About This Tool</h2>
        <p>${tool.description}</p>
        <p>This feature will be available in a future update. In the meantime, check out our other available tools!</p>
      </div>

      <div class="tool-section">
        <h2>Suggested Tools</h2>
        <div class="tool-grid-3">
          <div class="tool-card">
            <h3>🧮 Calculator</h3>
            <p>Scientific calculator with advanced functions</p>
            <a href="calculator.html" class="btn btn-primary btn-sm">Open Tool →</a>
          </div>
          <div class="tool-card">
            <h3>⏱️ Pomodoro Timer</h3>
            <p>Stay focused with the Pomodoro Technique</p>
            <a href="pomodoro.html" class="btn btn-primary btn-sm">Open Tool →</a>
          </div>
          <div class="tool-card">
            <h3>✅ To-Do List</h3>
            <p>Manage tasks with priorities</p>
            <a href="todo-list.html" class="btn btn-primary btn-sm">Open Tool →</a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-links">
      <a href="../../about.html">About</a>
      <a href="../../faq.html">FAQ</a>
      <a href="../../privacy.html">Privacy</a>
    </div>
    <div class="footer-text">
      Made with 💙 by Students for Students. © 2025 Poornimites
    </div>
  </footer>

  <script src="../../assets/js/toolkit-common.js"></script>
</body>
</html>`;

// Generate files
tools.forEach(tool => {
    const filename = `${tool.name}.html`;
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, template(tool));
    console.log(`Created: ${filename}`);
});

console.log(`\nGenerated ${tools.length} placeholder pages!`);
