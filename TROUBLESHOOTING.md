# 🔧 Troubleshooting Guide - PRISM

## Common Issues & Solutions

### ✅ **FIXED: PDF.js Worker Error**

**Error:**
```
Uncaught TypeError: Cannot set properties of undefined (setting 'workerSrc')
```

**Solution Applied:**
- Changed to CDN-based worker configuration
- Using stable PDF.js version 3.11.174
- Worker loads from CloudFlare CDN for reliability

**Current Configuration:**
```javascript
const PDFJS_VERSION = '3.11.174';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
```

---

### 🌐 **React DevTools**

**Recommendation:**
Install React DevTools for better development experience:
- Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
- Edge: https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil

**Benefits:**
- Inspect React component tree
- View props and state
- Profile component performance
- Debug hooks

---

## Other Potential Issues

### 🔴 Port Already in Use

**Issue:** Port 3000 already occupied

**Solution:**
- App automatically tries port 3001, 3002, etc.
- Or manually kill process on port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

---

### 🔴 PDF Upload Fails

**Symptoms:**
- PDF won't parse
- "Failed to parse PDF" error

**Solutions:**
1. **Check File Size**: Must be <50MB
2. **Check PDF Format**: Must be standard PDF (not scanned images)
3. **Clear Browser Cache**: Ctrl+Shift+Delete
4. **Try Different PDF**: Some PDFs have encryption/restrictions

**Test PDFs:**
- ArXiv papers work great
- PubMed Central articles work well
- Avoid: Password-protected PDFs, Image-only PDFs

---

### 🔴 API Rate Limiting

**Symptoms:**
- Analysis fails after first few papers
- "Too many requests" error

**Solutions:**
1. **Wait 60 seconds** between analyses
2. **Use your own API key** (see README.md)
3. **Consider upgrading** to paid Gemini API tier

**Get Your Own Key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Replace key in `src/services/geminiApi.js`
3. Free tier: 60 requests/minute

---

### 🔴 Slow Performance

**Symptoms:**
- Analysis takes >2 minutes
- UI feels sluggish

**Solutions:**
1. **Large PDFs**: Extract text first with smaller page range
2. **Clear Browser Data**: Cookies, cache, local storage
3. **Close Other Tabs**: Free up RAM
4. **Use Chrome/Edge**: Best performance with V8 engine

**Optimization Tips:**
- Upload PDFs <20MB for best speed
- Avoid PDFs with 100+ pages
- Use DOCX for text-only papers

---

### 🔴 Figures Not Showing

**Symptoms:**
- Figures tab empty
- "No Figures Found" message

**Reasons:**
1. **DOCX/TXT Files**: Only PDFs support figure extraction
2. **PDF Type**: Some PDFs embed images as vectors
3. **Processing Time**: Wait 30-60 seconds for extraction

**Solutions:**
- Only upload PDF files if you need figures
- Wait for full analysis to complete
- Check if PDF has actual images (not just text)

---

### 🔴 Chat Not Responding

**Symptoms:**
- Message sent but no response
- Spinner never stops

**Solutions:**
1. **Check Network**: Open DevTools → Network tab
2. **API Timeout**: Wait and try again
3. **Context Too Long**: Paper might be too large
4. **Refresh Page**: Clear state and try again

**Prevention:**
- Keep questions concise
- Avoid attaching too many figures
- One question at a time

---

### 🔴 Export Fails

**Symptoms:**
- Export button doesn't work
- Download never starts

**Solutions:**
1. **Check Pop-up Blocker**: Allow downloads
2. **Try Different Format**: PDF, Markdown, or PPTX
3. **Analysis Complete**: Wait for all tabs to load
4. **Browser Permissions**: Allow file downloads

**Workaround:**
- Copy content manually
- Take screenshots
- Print to PDF from browser

---

## 🛠️ Development Issues

### TypeScript/ESLint Errors

**Ignore These:**
- CSS @apply warnings (expected with Tailwind)
- scrollbar-width compatibility (progressive enhancement)
- prop-types warnings (using JSX runtime)

**Real Errors to Fix:**
- Import path errors
- Undefined variable references
- Missing dependencies

---

### Build Errors

**Clean Build:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

**Clear Vite Cache:**
```bash
# Delete .vite cache folder
rm -rf node_modules/.vite
npm run dev
```

---

### Hot Module Replacement (HMR) Not Working

**Solutions:**
1. **Restart Dev Server**: Ctrl+C, then `npm run dev`
2. **Hard Refresh Browser**: Ctrl+Shift+R
3. **Check File Paths**: Must be absolute imports
4. **Disable Browser Extensions**: Can interfere with HMR

---

## 📊 Performance Monitoring

### Check These in DevTools:

**Console:**
- No error messages
- API responses successful
- Worker loads correctly

**Network:**
- Gemini API calls return 200
- Worker file loads (pdf.worker.min.js)
- No failed requests

**Performance:**
- Initial load <3 seconds
- Analysis complete <60 seconds
- Smooth animations 60fps

---

## 🆘 Still Having Issues?

### Debug Checklist:

- [ ] Node.js version 18+
- [ ] npm install completed successfully
- [ ] Dev server running (port 3001)
- [ ] Browser DevTools open (F12)
- [ ] Internet connection active
- [ ] No firewall blocking API calls
- [ ] Using supported browser (Chrome/Edge/Firefox/Safari)

### Get Help:

1. **Check Console**: F12 → Console tab for errors
2. **Review README.md**: Full documentation
3. **Check QUICKSTART.md**: Usage guide
4. **Open GitHub Issue**: Detailed error report

### Include in Bug Reports:

- Browser & version
- Error messages (screenshots)
- Steps to reproduce
- File type trying to upload
- Network tab output

---

## ✨ Pro Tips

### Best Practices:

1. **Test with ArXiv Papers**: Free, high-quality PDFs
2. **Start Small**: 5-10 page papers first
3. **Use Quiz**: Better personalization
4. **Export Often**: Don't lose work
5. **Clear History**: If app feels slow

### Performance Optimization:

1. **Close Unused Tabs**: Free RAM
2. **Use Incognito**: No extension interference
3. **Wired Connection**: Faster than WiFi
4. **Desktop Browser**: Better than mobile

---

## 🎯 System Requirements

### Minimum:
- **RAM**: 4GB
- **Browser**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Internet**: 5 Mbps download
- **Storage**: 500MB free

### Recommended:
- **RAM**: 8GB+
- **Browser**: Latest Chrome/Edge
- **Internet**: 25+ Mbps
- **Storage**: 2GB free

---

<div align="center">

### 🚀 Application Status: ✅ FULLY OPERATIONAL

All known issues resolved. App running smoothly at **http://localhost:3001**

</div>
