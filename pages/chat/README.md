# Poornimites Chat Application

A production-ready Discord-style real-time chat application built with vanilla JavaScript and Firebase.

## 📂 File Structure

```
pages/chat/
├── chat-app.js           # Main application entry point
├── firebase-config.js    # Firebase configuration (UPDATE THIS!)
└── modules/
    ├── auth.js          # Authentication service
    ├── ui.js            # UI rendering
    ├── firestore.js     # Database operations
    ├── storage.js       # File upload handling
    ├── markdown.js      # Markdown parsing
    └── virtual-list.js  # Virtualized scrolling
```

## 🚀 Setup Instructions

### 1. Update Firebase Configuration

Edit `firebase-config.js` and replace the placeholder values with your Firebase project credentials:

```javascript
export const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 2. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 3. Deploy Storage Security Rules

```bash
firebase deploy --only storage
```

### 4. Deploy Cloud Functions (Optional)

```bash
cd ../../functions
npm install
firebase deploy --only functions
```

### 5. Run the Application

Serve the project using a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using VS Code Live Server
# Right-click on chat.html and select "Open with Live Server"
```

Then navigate to `http://localhost:8000/chat.html`

## ✨ Features Implemented

### Core Messaging
- ✅ Real-time message rendering with Firestore listeners
- ✅ Virtualized scrolling for performance
- ✅ Markdown formatting (bold, italic, code blocks, etc.)
- ✅ File/image/video uploads with progress bars
- ✅ Message editing and deletion
- ✅ Typing indicators
- ✅ Emoji reactions

### Authentication
- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ User profile management

### Servers & Channels
- ✅ Server creation and switching
- ✅ Channel creation and navigation
- ✅ Real-time server/channel lists

## 🎨 UI Layout

The application uses a Discord-like 4-column layout:
1. **Server Sidebar** (72px) - Server icons
2. **Channel Sidebar** (240px) - Channel list and user info
3. **Chat Area** (flex) - Messages and input
4. **Members Sidebar** (240px) - Member list

## 🔧 Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Backend**: Firebase
  - Firestore (database)
  - Firebase Auth (authentication)
  - Firebase Storage (file uploads)
  - Cloud Functions (optional)
- **Styling**: Pure CSS with CSS Variables

## 📝 Next Steps

Features to implement:
- [ ] Threaded replies
- [ ] Global search
- [ ] Unread indicators
- [ ] Read receipts
- [ ] Role-based permissions
- [ ] Slow mode
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive design improvements

## 🔐 Security

- Firebase Security Rules are enforced for all database operations
- XSS protection via HTML escaping
- Authentication required for all actions
- Owner-based permissions for message editing/deletion

## 📖 Documentation

For detailed implementation information, see:
- `firestore.rules` - Database security rules
- `storage.rules` - Storage security rules
- `functions/index.js` - Cloud Functions
