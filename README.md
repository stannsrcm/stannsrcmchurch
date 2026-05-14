# St. Ann's RCM Church - 3D Website

A premium, production-ready 3D church website built with Next.js 14, Supabase, and Three.js.

## 🚀 Quick Start

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    - Go to your [Supabase Dashboard](https://supabase.com/dashboard).
    - Open the **SQL Editor**.
    - Copy and paste the contents of `database.sql` and run it.
    - Create a Storage Bucket named `gallery` and set it to **Public**.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🔐 Admin Credentials

- **URL**: `/login`
- **Email**: 
- **Password**: 

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **3D Engine**: Three.js + React Three Fiber
- **Database**: Supabase
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI and 3D components.
- `lib/`: Configuration for Supabase and NextAuth.
- `public/`: Static assets and images.

## ⚡ Deployment

This project is optimized for deployment on **Vercel**. Simply push to GitHub and connect your repository to Vercel. Don't forget to add your environment variables in the Vercel dashboard.
