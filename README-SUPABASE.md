# Vindio - Supabase Integration Setup

This project now includes Supabase integration for authentication and data management.

## 🚀 Setup Instructions

### 1. Supabase Project Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is ready, go to **Settings** > **API**
3. Copy your project URL and anon key

### 2. Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the migration files in order:
   - `supabase/migrations/001_create_profiles.sql`
   - `supabase/migrations/002_create_projects_tasks.sql`
   - `supabase/migrations/003_create_activity_messages.sql`

### 4. Authentication Setup

#### Google OAuth Setup (Optional)
1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URLs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

#### Email Configuration
1. Go to **Authentication** > **Settings**
2. Configure your email settings or use Supabase's default email service
3. Customize email templates if needed

### 5. Row Level Security (RLS)

The migrations include RLS policies that ensure:
- Users can only access their own data
- Profiles are automatically created when users sign up
- Proper data isolation between users

### 6. Run the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🔧 Features Included

### Authentication
- ✅ Email/Password signup and login
- ✅ Google OAuth integration
- ✅ Password reset functionality
- ✅ Automatic profile creation
- ✅ Protected routes with middleware

### Database Integration
- ✅ User profiles with custom fields
- ✅ Projects and tasks management
- ✅ Activity logging system
- ✅ Real-time data updates
- ✅ Row Level Security (RLS)

### Composables
- `useAuth()` - Authentication management
- `useDatabase()` - Database operations
- Auto-generated Supabase composables

## 📊 Database Schema

### Tables Created:
- **profiles** - User profile information
- **projects** - User projects
- **tasks** - Project tasks
- **activity_logs** - User activity tracking
- **messages** - Team communication

### Key Features:
- Automatic profile creation on signup
- Row Level Security for data protection
- Optimized indexes for performance
- Trigger-based updated_at timestamps

## 🔐 Security Features

- Row Level Security (RLS) enabled on all tables
- User data isolation
- Secure environment variable handling
- Protected API routes
- Authenticated middleware

## 🎨 UI Integration

The existing UI components have been updated to:
- Use real Supabase data instead of JSON files
- Display user-specific information
- Handle loading and error states
- Support real-time updates

## 📱 Pages Updated

- **Login** (`/login`) - Supabase auth integration
- **Signup** (`/signup`) - User registration with profile creation
- **Dashboard** (`/dashboard`) - Real-time data from Supabase
- **Profile** (`/profile`) - Editable user profile management
- **Forgot Password** (`/forgot-password`) - Password reset flow

## 🛠️ Development Notes

- TypeScript errors in composables are expected during development
- Restart the development server after setting up environment variables
- Use Supabase Studio for database management and monitoring
- Check the browser console for any authentication or database errors

## 📚 Next Steps

After setting up your Supabase credentials:

1. Test user registration and login
2. Verify profile creation works
3. Check dashboard data loading
4. Test Google OAuth (if configured)
5. Verify password reset functionality

Your application is now ready with full Supabase integration! 🎉
