# 🍽️ The Ultimate Bite List

A beautiful web application to discover and share amazing restaurants with their must-try dishes. Built with Next.js, React, and Tailwind CSS.

## ✨ Features

- 🎨 Beautiful, modern UI with gradient backgrounds
- 🔍 Search restaurants by name, cuisine, dishes, or location
- 🏷️ Filter by cuisine type, rating, and location
- ⭐ Highlight must-try dishes for each restaurant
- 📱 Fully responsive design (mobile & desktop)
- ➕ Add new restaurants with a user-friendly form
- ✏️ Edit existing restaurant details
- 🗑️ Delete restaurants (with safeguards)
- 🗺️ Google Maps integration for restaurant locations
- 💾 Local storage for user-added restaurants
- 🚀 Fast and lightweight

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd restaurant-list-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Adding Restaurants

### Via UI (Recommended)
Click the "Add Restaurant" button on the homepage and fill in the form.

### Via Code
Edit `app/data/restaurants.ts` to add restaurants programmatically:

```typescript
{
  id: 16,
  name: "Your Restaurant Name",
  cuisine: "Cuisine Type 🍽️",
  mustTry: "Dish 1, Dish 2, Dish 3",
  location: "City, State",
  link: "https://maps.google.com/...",
  rating: "⭐⭐⭐⭐⭐"
}
```

## 🎨 Customization

- Colors and styling: Edit `app/globals.css`
- Layout: Modify `app/page.tsx`
- Restaurant cards: Update `app/components/RestaurantCard.tsx`
- Modal form: Update `app/components/AddRestaurantModal.tsx`

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and configure everything
   - Click "Deploy"
   - Your app will be live in minutes!

   **No configuration needed!** Vercel automatically:
   - Detects Next.js
   - Runs `npm install` and `npm run build`
   - Deploys with optimal settings
   - Provides HTTPS and a custom domain

### Alternative: Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Click "Deploy"

## 💰 Cost

**100% Free!** This application uses only free and open-source resources:
- ✅ All dependencies are free (MIT/Apache licenses)
- ✅ Google Maps public URLs (no API key needed)
- ✅ localStorage for data (no database costs)
- ✅ Free hosting on Vercel/Netlify

See [FREE_RESOURCES_ANALYSIS.md](./FREE_RESOURCES_ANALYSIS.md) for detailed analysis.

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Storage:** Browser localStorage
- **Maps:** Google Maps (public URLs)

## 📱 Mobile Support

The application is fully responsive and optimized for:
- 📱 Mobile phones (iOS & Android)
- 📱 Tablets
- 💻 Desktop browsers

## 🤝 Contributing

Feel free to:
- Add your favorite restaurants
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

---

Made with ❤️ for food lovers everywhere

