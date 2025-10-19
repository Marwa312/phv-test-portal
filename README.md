# PHV Upload Portal

A professional file upload portal with Supabase storage and EmailJS notifications. Users can upload documents, which are stored securely in the cloud and trigger email notifications to administrators.

## 🚀 What This Project Does

This is a complete file upload system that allows users to:

- **Upload Documents**: Support for JPG, PNG, PDF files (max 32MB each)
- **Secure Storage**: Files are stored in Supabase Storage with organized folder structure
- **Email Notifications**: Automatic email alerts sent via EmailJS when files are uploaded
- **Form Validation**: Real-time validation with user feedback
- **Dark Mode**: Elegant dark/light theme toggle
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 📁 Project Structure

```
phv-test-portal/
├── index.html                    # Main HTML file
├── package.json                  # Project configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
├── css/
│   └── style.css                 # Main stylesheet with dark mode
├── js/
│   ├── script.js                 # Main application logic
│   ├── uploadHelper.js           # Supabase upload functions
│   ├── supabaseConfig.js         # Supabase credentials (not in git)
│   └── supabaseConfig.example.js # Template for credentials
└── assets/
    └── emailjs-template.html     # EmailJS template reference
```

## 🔧 Environment Variables Setup

### 1. Supabase Configuration

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and anon key

2. **Setup Storage**:
   - Go to Storage in your Supabase dashboard
   - Create a bucket named `uploads`
   - Set it to public
   - Create RLS policy: `INSERT ON storage.objects FOR ALL TO public WITH CHECK (bucket_id = 'uploads')`

3. **Configure Credentials**:
   ```bash
   cp js/supabaseConfig.example.js js/supabaseConfig.js
   ```
   Edit `js/supabaseConfig.js`:
   ```javascript
   const SUPABASE_URL = "https://your-project-id.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```

### 2. EmailJS Configuration

1. **Create EmailJS Account**:
   - Go to [emailjs.com](https://emailjs.com)
   - Create account and verify email
   - Create a new service (Gmail, Outlook, etc.)

2. **Setup Email Template**:
   - Create a new template in EmailJS dashboard
   - Use the template from `assets/emailjs-template.html`
   - Note your Service ID, Template ID, and Public Key

3. **Update Credentials**:
   Edit `js/script.js`:
   ```javascript
   const SERVICE_ID = "your_service_id";
   const TEMPLATE_ID = "your_template_id";
   const PUBLIC_KEY = "your_public_key";
   ```

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

1. **Prepare for Deployment**:
   ```bash
   # Ensure all files are ready
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: `/` (root)
   - Deploy!

3. **Environment Variables** (Optional):
   - In Netlify dashboard → Site settings → Environment variables
   - Add your keys as environment variables
   - Update your code to use `process.env.VARIABLE_NAME`

### Option 2: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   # Follow the prompts
   ```

3. **Environment Variables**:
   - In Vercel dashboard → Project settings → Environment variables
   - Add your Supabase and EmailJS credentials

### Option 3: GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)

2. **Access Your Site**:
   - Your site will be available at: `https://yourusername.github.io/phv-test-portal`

## 🔒 Security Notes

- ✅ **Supabase credentials** are protected by `.gitignore`
- ✅ **Row Level Security (RLS)** policies protect file uploads
- ✅ **EmailJS credentials** should be kept secure
- ✅ **File validation** prevents malicious uploads
- ✅ **HTTPS required** for production deployment

## 🎨 Features

- **Professional UI**: Clean, modern interface with glass-morphism effects
- **Dark Mode**: Elegant dark/light theme toggle with persistent preferences
- **File Management**: Add/remove files with real-time preview
- **Form Validation**: Real-time validation with helpful error messages
- **Email Notifications**: Rich HTML emails with clickable file links
- **Responsive Design**: Perfect on all devices
- **Smooth Animations**: Professional transitions and hover effects

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Supabase Storage
- **Email**: EmailJS
- **CDN**: Supabase JS SDK, EmailJS Browser SDK
- **Deployment**: Netlify, Vercel, or GitHub Pages

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Quick Start

1. **Clone the repository**
2. **Setup Supabase** (follow instructions above)
3. **Setup EmailJS** (follow instructions above)
4. **Deploy to Netlify/Vercel**
5. **Test the upload functionality**

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase and EmailJS credentials
3. Ensure your storage bucket has proper RLS policies
4. Test the email template in EmailJS dashboard

---

**Your PHV Upload Portal is now ready for production!** 🎉
