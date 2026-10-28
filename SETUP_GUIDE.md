# TeamSpace Setup Guide - Get All Credentials

Follow these steps to set up all required services and get your API keys.

---

## 📋 Prerequisites

You'll need accounts for:
1. **Supabase** (Database & Auth) - Free tier available
2. **Daily.co** (Video calls) - Free tier: 10 rooms
3. **Google Cloud** (OAuth & Drive) - Free

---

## 1️⃣ Set Up Supabase

### Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up (GitHub recommended)
3. Click **"New Project"**
4. Fill in:
   - **Name**: `teamspace`
   - **Database Password**: (generate a strong one, save it)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
5. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get Supabase Credentials

1. Once created, go to **Settings** (gear icon on left sidebar)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL** → Copy this
   - **Project API keys** → Copy the `anon` `public` key

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Enable Google OAuth in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Scroll down to **Google**
3. Toggle **"Enabled"** to ON
4. Leave this tab open, we'll come back to add Google credentials

### Step 4: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **"Run"** (or press `Ctrl+Enter`)
5. You should see: "Success. No rows returned"

---

## 2️⃣ Set Up Google Cloud (OAuth & Drive)

### Step 1: Create Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Click **"Select a project"** (top bar) → **"New Project"**
3. **Project name**: `TeamSpace`
4. Click **"Create"**
5. Wait for project creation, then select it

### Step 2: Enable Required APIs

1. In the search bar (top), type: **"Google Drive API"**
2. Click on it → Click **"Enable"**
3. Wait for it to enable
4. Repeat for: **"Google+ API"** (or "Google People API")

### Step 3: Configure OAuth Consent Screen

1. In left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **"External"** → Click **"Create"**
3. Fill in:
   - **App name**: `TeamSpace`
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **"Save and Continue"**
5. **Scopes**: Click **"Add or Remove Scopes"**
   - Check: `userinfo.email`
   - Check: `userinfo.profile`
   - Check: `drive.file`
6. Click **"Update"** → **"Save and Continue"**
7. **Test users**: Click **"Add Users"** → Add your Gmail address
8. Click **"Save and Continue"** → **"Back to Dashboard"**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type**: `Web application`
4. **Name**: `TeamSpace Web`
5. **Authorized JavaScript origins**:
   - Click **"Add URI"** → `http://localhost:3000`
6. **Authorized redirect URIs**:
   - Click **"Add URI"** → `http://localhost:3000/auth/callback`
   - Click **"Add URI"** → `https://xxxxx.supabase.co/auth/v1/callback`
     (Replace `xxxxx` with your Supabase project URL)
7. Click **"Create"**
8. **Copy both**:
   - **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxx`)

```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### Step 5: Add Google Credentials to Supabase

1. Go back to **Supabase dashboard**
2. **Authentication** → **Providers** → **Google**
3. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
4. Click **"Save"**

---

## 3️⃣ Set Up Daily.co (Video Calls)

### Step 1: Create Daily.co Account

1. Go to **https://dashboard.daily.co/signup**
2. Sign up (email or GitHub)
3. Verify your email

### Step 2: Get API Key

1. In Daily.co dashboard, go to **Developers** → **API Keys**
2. You'll see your **API Key** (starts with a long string)
3. Click **"Copy"**

```
DAILY_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4️⃣ Create Your `.env.local` File

1. In your project folder, create a file named `.env.local`
2. Paste all your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Daily.co Video
DAILY_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

3. **Save the file**

---

## 5️⃣ Test Your Setup

1. **Stop** your dev server if running (`Ctrl+C`)
2. **Restart** with:
   ```bash
   npm run dev
   ```
   Or for Electron:
   ```bash
   npm run electron:dev
   ```
3. Open **http://localhost:3000/login**
4. Click **"Continue with Google"**
5. You should see Google's sign-in popup!

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Supabase URL and anon key copied
- [ ] Database migration run successfully
- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created (Client ID & Secret)
- [ ] Google credentials added to Supabase
- [ ] Daily.co account created
- [ ] Daily.co API key copied
- [ ] `.env.local` file created with all credentials
- [ ] Dev server restarted
- [ ] Google sign-in tested successfully

---

## 🆘 Troubleshooting

### "supabaseUrl is required" error
- Make sure `.env.local` exists in the project root
- Check that variable names start with `NEXT_PUBLIC_`
- Restart your dev server after creating `.env.local`

### Google sign-in popup doesn't appear
- Check OAuth redirect URIs in Google Cloud Console
- Make sure Google credentials are added to Supabase
- Clear browser cache and try again

### "Invalid redirect URI" error
- Double-check redirect URIs in Google Cloud Console
- Make sure both localhost and Supabase callback URLs are added

### Video calls not working
- Verify Daily.co API key is correct
- Check API key has room creation permissions

---

## 📚 Next Steps

Once everything is set up:

1. **Invite team members** - Add their emails as test users in Google Cloud
2. **Create channels** - Customize your workspace
3. **Upload files** - Test Drive integration
4. **Start a call** - Test video functionality
5. **Build for production** - When ready, update redirect URIs for your domain

---

**Estimated Setup Time**: 20-30 minutes

**Need help?** Check the official docs:
- Supabase: https://supabase.com/docs
- Google Cloud: https://console.cloud.google.com/apis
- Daily.co: https://docs.daily.co/
