# 🚀 Setup Using Git Commands (Alternative Method)

This guide shows how to set up PRISM using Git commands instead of downloading ZIP.

---

## 📋 Prerequisites

### 1. Install Node.js
- Go to: https://nodejs.org/
- Download and install the **LTS version**
- Restart your computer after installation

### 2. Install Git
- **Windows:** https://git-scm.com/download/win
- **Mac:** https://git-scm.com/download/mac
- **Linux:** `sudo apt-get install git`

---

## ⚡ Method 1: Using Git Clone (Recommended)

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**Mac:**
- Press `Cmd + Space`
- Type `terminal`
- Press Enter

**Linux:**
- Press `Ctrl + Alt + T`

### Step 2: Navigate to Where You Want the Project

```bash
# Go to Desktop
cd Desktop

# Or go to Documents
cd Documents

# Or go to any specific folder
cd /path/to/your/folder
```

### Step 3: Clone the Repository

```bash
git clone https://github.com/Mithuncoding/rrsearch3.git
```

**What this does:** Downloads the entire project from GitHub to your computer.

**You should see:**
```
Cloning into 'rrsearch3'...
remote: Enumerating objects: 150, done.
remote: Counting objects: 100% (150/150), done.
remote: Compressing objects: 100% (100/100), done.
remote: Total 150 (delta 50), reused 150 (delta 50)
Receiving objects: 100% (150/150), 500 KB | 2.5 MB/s, done.
Resolving deltas: 100% (50/50), done.
```

### Step 4: Enter the Project Folder

```bash
cd rrsearch3
```

### Step 5: Install Dependencies

```bash
npm install
```

**Wait 2-5 minutes** for installation to complete.

### Step 6: Run the Application

```bash
npm run dev
```

### Step 7: Open in Browser

Open your browser and go to: **http://localhost:3000**

**Done!** 🎉

---

## 🔄 Method 2: Using Git with SSH (For Advanced Users)

If you have SSH keys set up with GitHub:

```bash
# Clone using SSH
git clone git@github.com:Mithuncoding/rrsearch3.git

# Enter folder
cd rrsearch3

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 📥 How to Get Latest Updates

When your brother updates the project, you can get the latest version:

### Step 1: Navigate to Project Folder

```bash
cd path/to/rrsearch3
```

### Step 2: Pull Latest Changes

```bash
git pull origin master
```

**What this does:** Downloads only the new changes (much faster than re-downloading everything).

### Step 3: Update Dependencies (if needed)

```bash
npm install
```

### Step 4: Run the App

```bash
npm run dev
```

---

## 🎯 All Commands in One Place

### First Time Setup:
```bash
# 1. Navigate to where you want the project
cd Desktop

# 2. Clone the repository
git clone https://github.com/Mithuncoding/rrsearch3.git

# 3. Enter the folder
cd rrsearch3

# 4. Install dependencies
npm install

# 5. Run the app
npm run dev
```

### Every Time You Want to Use It:
```bash
# 1. Navigate to project folder
cd Desktop/rrsearch3

# 2. Run the app
npm run dev
```

### To Get Updates:
```bash
# 1. Navigate to project folder
cd Desktop/rrsearch3

# 2. Pull latest changes
git pull origin master

# 3. Update dependencies
npm install

# 4. Run the app
npm run dev
```

### To Stop the App:
```
Ctrl + C
```

---

## 🔍 Useful Git Commands

### Check Current Status
```bash
git status
```
Shows what files have changed.

### See Commit History
```bash
git log
```
Shows all updates made to the project.

### Check Which Branch You're On
```bash
git branch
```
Should show `* master`.

### See Remote Repository
```bash
git remote -v
```
Shows the GitHub link.

### Reset to Latest Version (Discard Local Changes)
```bash
git reset --hard origin/master
```
**Warning:** This deletes any changes you made!

---

## 🆘 Troubleshooting

### Problem: "git is not recognized"
**Solution:**
- Install Git (see prerequisites)
- Restart your computer
- Try again

### Problem: "Permission denied (publickey)"
**Solution:**
- Use HTTPS clone instead: `git clone https://github.com/Mithuncoding/rrsearch3.git`
- Or set up SSH keys: https://docs.github.com/en/authentication

### Problem: "fatal: destination path 'rrsearch3' already exists"
**Solution:**
- You already have the folder
- Either:
  - Delete the existing folder
  - Or navigate into it: `cd rrsearch3`
  - Then pull updates: `git pull origin master`

### Problem: "npm is not recognized"
**Solution:**
- Install Node.js (see prerequisites)
- Restart your computer
- Try again

### Problem: Git pull says "merge conflict"
**Solution:**
- If you haven't changed any files:
  ```bash
  git reset --hard origin/master
  ```
- This resets to the latest version

---

## 💡 Advantages of Using Git

✅ **Faster Updates** - Only downloads changes, not entire project  
✅ **Version Control** - Can see history of changes  
✅ **Easy Rollback** - Can go back to previous versions  
✅ **Automatic Sync** - Always get latest features  
✅ **Better for Collaboration** - Can contribute back if you want  

---

## 📊 Comparison: Git Clone vs ZIP Download

| Feature | Git Clone | ZIP Download |
|---------|-----------|--------------|
| Initial Setup | Medium | Easy |
| Getting Updates | Fast (git pull) | Slow (re-download) |
| Size | Downloads only needed files | Downloads everything |
| Version Control | Yes | No |
| Learn Git | Yes | No |
| Recommended For | Regular use | One-time use |

---

## 🎓 Quick Git Tutorial

### What is Git?
Git is a version control system that tracks changes in code.

### What is GitHub?
GitHub is a website that hosts Git repositories (like Google Drive for code).

### What is a Repository?
A repository (repo) is a project folder with all its files and history.

### What is Clone?
Clone means making a copy of a repository on your computer.

### What is Pull?
Pull means downloading the latest changes from GitHub.

### What is Branch?
A branch is a version of the code. `master` is the main branch.

---

## 🎯 Summary: Choose Your Method

### Use **Git Clone** if:
- ✅ You want to easily get updates
- ✅ You want to learn Git
- ✅ You'll use the app regularly

### Use **ZIP Download** if:
- ✅ You only want to try it once
- ✅ You don't want to install Git
- ✅ You prefer clicking over typing commands

**Both work perfectly!** Choose what's comfortable for you. 😊

---

## 📞 Need Help?

### For Git Issues:
- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/

### For App Issues:
- Check **SETUP_GUIDE.md** for detailed troubleshooting
- Check **QUICK_START.md** for simple setup
- Ask your brother! 😊

---

## 🔗 Important Links

- **Project Repository:** https://github.com/Mithuncoding/rrsearch3
- **Node.js Download:** https://nodejs.org/
- **Git Download:** https://git-scm.com/
- **Git Tutorial:** https://www.atlassian.com/git/tutorials

---

## ✅ Final Checklist

Before starting, make sure you have:
- [ ] Node.js installed (`node --version` works)
- [ ] Git installed (`git --version` works)
- [ ] Internet connection (for cloning and npm install)
- [ ] At least 500 MB free disk space

Then run:
```bash
git clone https://github.com/Mithuncoding/rrsearch3.git
cd rrsearch3
npm install
npm run dev
```

**That's it!** Open http://localhost:3000 and enjoy! 🎉

---

**Happy researching!** 🚀📚
