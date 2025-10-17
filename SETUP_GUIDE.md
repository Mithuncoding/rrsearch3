# 🚀 Setup Guide - How to Run PRISM on Your Laptop

This guide will help you set up and run the PRISM Research Assistant on your laptop (Windows, Mac, or Linux).

---

## 📋 Prerequisites

Before you start, you need to install these tools:

### 1. **Install Node.js** (Required)
Node.js is needed to run the application.

**Download & Install:**
- Go to: https://nodejs.org/
- Download the **LTS version** (Recommended)
- Run the installer
- Click "Next" through all steps (use default settings)

**Verify Installation:**
Open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
```bash
node --version
```
You should see something like: `v20.x.x`

```bash
npm --version
```
You should see something like: `10.x.x`

---

### 2. **Install Git** (Required)
Git is needed to download the project from GitHub.

**Download & Install:**
- Windows: https://git-scm.com/download/win
- Mac: https://git-scm.com/download/mac
- Linux: `sudo apt-get install git` (Ubuntu/Debian)

**Verify Installation:**
```bash
git --version
```
You should see something like: `git version 2.x.x`

---

## 📥 Step 1: Download the Project from GitHub

### Option A: Using Command Line (Recommended)

1. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter
   - Linux: Press `Ctrl + Alt + T`

2. **Navigate to where you want to save the project**
   ```bash
   cd Desktop
   ```
   (This will save it on your Desktop. You can choose any folder)

3. **Clone the repository**
   ```bash
   git clone https://github.com/Mithuncoding/rrsearch3.git
   ```

4. **Enter the project folder**
   ```bash
   cd rrsearch3
   ```

### Option B: Download as ZIP (Alternative)

1. Go to: https://github.com/Mithuncoding/rrsearch3
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to your desired location
5. Open Terminal/Command Prompt and navigate to that folder:
   ```bash
   cd path/to/rrsearch3
   ```

---

## 📦 Step 2: Install Dependencies

In the terminal (while inside the `rrsearch3` folder), run:

```bash
npm install
```

**What this does:** Downloads all the required packages for the project.

**Time:** Takes 2-5 minutes depending on your internet speed.

**You should see:** Lots of text scrolling as packages are installed.

---

## ▶️ Step 3: Start the Application

Once installation is complete, run:

```bash
npm run dev
```

**What this does:** Starts the development server.

**You should see:**
```
VITE v5.4.20  ready in 351 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## 🌐 Step 4: Open in Browser

1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Go to: **http://localhost:3000**
3. You should see the PRISM landing page! 🎉

---

## 🎯 Quick Start - Using the App

### Upload a Research Paper:
1. Drag and drop a PDF file onto the upload area
2. Or click "Choose Files" to browse
3. Wait for the analysis (takes 30-60 seconds)
4. Explore the different tabs!

### Tabs Available:
- **Key Takeaways** - Quick overview
- **Overview** - Detailed analysis
- **Critic's Corner** - Strengths & weaknesses
- **AI Ideation Lab** - Research hypotheses
- **Related Papers** - Find similar papers

### Chat with AI:
- Click the chat icon (bottom right)
- Ask questions about the paper
- Get instant AI responses!

---

## 🛑 How to Stop the Application

In the terminal where the app is running:
- Press `Ctrl + C`
- Type `Y` if asked to confirm
- The server will stop

To start again, just run `npm run dev` again!

---

## 🔧 Troubleshooting

### Problem: "node is not recognized as an internal or external command"
**Solution:** Node.js is not installed or not in PATH.
- Reinstall Node.js
- Make sure to check "Add to PATH" during installation
- Restart your terminal/command prompt

### Problem: "npm install" fails
**Solution:** 
1. Delete the `node_modules` folder (if exists)
2. Delete `package-lock.json` (if exists)
3. Run `npm install` again
4. If still fails, try: `npm install --legacy-peer-deps`

### Problem: Port 3000 is already in use
**Solution:** 
- Another app is using port 3000
- Stop that app or change port
- To change port, edit `vite.config.js`:
  ```javascript
  export default defineConfig({
    server: {
      port: 3001  // Change to any available port
    }
  })
  ```

### Problem: Page shows blank/white screen
**Solution:**
1. Check browser console (Press F12)
2. Look for errors
3. Make sure you're on `http://localhost:3000` (not `https`)
4. Try clearing browser cache (Ctrl + Shift + Delete)
5. Try a different browser

### Problem: AI analysis is slow or fails
**Solution:**
- The app uses Google Gemini AI (free API included)
- If it fails, it might be:
  - Internet connection issue (check your WiFi)
  - API rate limit reached (wait a few minutes)
  - Paper is too large (try a smaller paper)

---

## 📂 Project Structure

```
rrsearch3/
├── node_modules/          # Dependencies (auto-generated)
├── public/                # Static files (images, favicon)
├── src/                   # Source code
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── services/         # API & analysis services
│   └── store/            # State management
├── package.json          # Project configuration
├── vite.config.js        # Build tool config
└── README.md             # Project documentation
```

**Don't delete:**
- `node_modules/` - Required for app to run
- `package.json` - Contains all settings
- `src/` - Contains all the code

**Safe to delete:**
- `.git/` - Git history (if you don't plan to contribute)
- `FUTURE_ROADMAP.md` - Just documentation
- `GITHUB_PUSH.md` - Just documentation

---

## 🔄 How to Update to Latest Version

If your brother updates the code, here's how to get the latest version:

### If you cloned with Git:
```bash
cd rrsearch3
git pull origin master
npm install
npm run dev
```

### If you downloaded ZIP:
1. Download the new ZIP from GitHub
2. Extract and replace old folder
3. Run `npm install` again
4. Run `npm run dev`

---

## 💡 Tips for Best Experience

### 1. **Use Chrome or Edge browser**
   - Best performance and compatibility
   - Firefox and Safari work too

### 2. **Good Internet Connection**
   - AI analysis requires internet
   - Faster internet = faster analysis

### 3. **PDF Quality**
   - Use text-based PDFs (not scanned images)
   - Papers under 20 pages work best
   - Academic papers work better than books

### 4. **Keep Terminal Open**
   - Don't close the terminal while using the app
   - Minimize it if needed

### 5. **Browser Tab**
   - Keep the app tab open
   - Bookmarks work (`http://localhost:3000`)

---

## 🎓 Recommended Papers to Try

Start with these types of papers for best results:

1. **Research papers** from:
   - IEEE
   - ACM
   - arXiv
   - PubMed
   - Google Scholar

2. **Good paper lengths:**
   - 5-20 pages ideal
   - Works with longer papers too

3. **Fields that work great:**
   - Computer Science
   - Engineering
   - Medicine/Biology
   - Physics/Chemistry
   - Social Sciences

---

## 🆘 Need Help?

### Quick Fixes:
1. **Restart the server** (Ctrl+C, then `npm run dev`)
2. **Refresh browser** (F5 or Ctrl+R)
3. **Clear browser cache**
4. **Check internet connection**

### If Nothing Works:
1. Close terminal completely
2. Delete `node_modules` folder
3. Run `npm install` again
4. Run `npm run dev` again

### Still Stuck?
- Check the error message carefully
- Google the error message
- Ask your brother for help! 😊

---

## ✅ System Requirements

### Minimum:
- **OS:** Windows 10/11, macOS 10.15+, Linux
- **RAM:** 4 GB
- **Storage:** 500 MB free space
- **Internet:** Required for AI features
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

### Recommended:
- **RAM:** 8 GB or more
- **Internet:** Stable broadband connection
- **Browser:** Latest Chrome or Edge

---

## 🔒 Privacy & Security

**Your data is safe:**
- ✅ Files are processed **locally** on your computer
- ✅ Only text is sent to Google Gemini AI for analysis
- ✅ No files are uploaded to any server
- ✅ No user tracking or analytics
- ✅ Works offline after page loads (except AI features)

**What's sent to Google:**
- Text content of the paper
- Your questions in chat
- Nothing else!

**What's NOT sent:**
- Your files
- Your name or email
- Your browsing history
- Your location

---

## 🎉 You're All Set!

Enjoy using PRISM for your research! 

If you find it helpful, consider:
- ⭐ Starring the GitHub repo
- 📤 Sharing with friends
- 💬 Giving feedback

**Repository:** https://github.com/Mithuncoding/rrsearch3

---

## 📞 Contact

For issues or questions:
- Check GitHub Issues: https://github.com/Mithuncoding/rrsearch3/issues
- Ask your brother (he made this for you! ❤️)

Happy researching! 🚀📚
