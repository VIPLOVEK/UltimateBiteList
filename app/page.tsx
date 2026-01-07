'use client'

import { useState, useEffect } from 'react'
import RestaurantCard from './components/RestaurantCard'
import AddRestaurantModal from './components/AddRestaurantModal'
import { restaurants as initialRestaurants } from './data/restaurants'

interface Restaurant {
  id: number
  name: string
  cuisine: string
  mustTry: string
  location?: string
  link?: string
  rating?: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  // Load restaurants from localStorage on mount
  useEffect(() => {
    const savedRestaurants = localStorage.getItem('userRestaurants')
    if (savedRestaurants) {
      try {
        const parsed = JSON.parse(savedRestaurants)
        setRestaurants([...initialRestaurants, ...parsed])
      } catch (e) {
        setRestaurants(initialRestaurants)
      }
    } else {
      setRestaurants(initialRestaurants)
    }
  }, [])

  const handleAddRestaurant = (restaurantData: Omit<Restaurant, 'id'>) => {
    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: Date.now() // Simple ID generation (will be > 1000)
    }

    const updatedRestaurants = [...restaurants, newRestaurant]
    setRestaurants(updatedRestaurants)

    // Save user-added restaurants to localStorage (IDs > 1000 are user-added)
    const userRestaurants = updatedRestaurants.filter(r => r.id > 1000)
    localStorage.setItem('userRestaurants', JSON.stringify(userRestaurants))
  }

  const handleUpdateRestaurant = (id: number, restaurantData: Omit<Restaurant, 'id'>) => {
    const updatedRestaurants = restaurants.map(r => 
      r.id === id ? { ...restaurantData, id } : r
    )
    setRestaurants(updatedRestaurants)

    // Save user-added restaurants to localStorage (IDs > 1000 are user-added)
    const userRestaurants = updatedRestaurants.filter(r => r.id > 1000)
    localStorage.setItem('userRestaurants', JSON.stringify(userRestaurants))
    
    setEditingRestaurant(null)
  }

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRestaurant(null)
  }

  const handleDeleteRestaurant = (restaurant: Restaurant) => {
    // Safety check: Prevent deleting if it's the last restaurant
    if (restaurants.length <= 1) {
      alert('Cannot delete the last restaurant. At least one restaurant must remain.')
      return
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${restaurant.name}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    // Remove the restaurant from the list
    const updatedRestaurants = restaurants.filter(r => r.id !== restaurant.id)
    setRestaurants(updatedRestaurants)

    // Update localStorage - only save user-added restaurants (IDs > 1000)
    const userRestaurants = updatedRestaurants.filter(r => r.id > 1000)
    if (userRestaurants.length > 0) {
      localStorage.setItem('userRestaurants', JSON.stringify(userRestaurants))
    } else {
      // If no user restaurants left, clear localStorage
      localStorage.removeItem('userRestaurants')
    }
  }

  // Helper function to extract cuisine name without emoji
  const getCuisineName = (cuisine: string) => {
    if (!cuisine) return ''
    
    // Handle multiple cuisines separated by commas
    const cuisines = cuisine.split(',').map(c => c.trim())
    
    return cuisines.map(c => {
      // Remove emoji from the end (format: "Cuisine Name Emoji")
      // Also handle emoji at the start (legacy format)
      let cleaned = c.replace(/[\u{1F300}-\u{1F9FF}]+\s*$/u, '').trim() // Remove emoji at end
      cleaned = cleaned.replace(/^[\u{1F300}-\u{1F9FF}]+\s*/u, '').trim() // Remove emoji at start (legacy)
      return cleaned
    }).join(', ').trim() || cuisine
  }
  
  // Helper function to get emoji for a cuisine name
  const getCuisineEmoji = (cuisineName: string): string => {
    if (!cuisineName) return '🍽️'
    
    // Check if we can find the emoji from the original restaurant data
    for (const restaurant of restaurants) {
      const restaurantCuisineName = getCuisineName(restaurant.cuisine)
      const individualCuisines = restaurantCuisineName.split(',').map(c => c.trim())
      
      if (individualCuisines.some(c => c.toLowerCase() === cuisineName.toLowerCase())) {
        // Extract emoji from the original cuisine string
        const cuisineParts = restaurant.cuisine.split(',').map(c => c.trim())
        for (const part of cuisineParts) {
          const nameWithoutEmoji = part.replace(/[\u{1F300}-\u{1F9FF}]+\s*$/u, '').trim()
            .replace(/^[\u{1F300}-\u{1F9FF}]+\s*/u, '').trim()
          if (nameWithoutEmoji.toLowerCase() === cuisineName.toLowerCase()) {
            // Extract emoji (format: "Cuisine Name Emoji")
            const emojiMatch = part.match(/([\u{1F300}-\u{1F9FF}]+)/u)
            if (emojiMatch) {
              return emojiMatch[1]
            }
          }
        }
      }
    }
    
    // Fallback: use the getCuisineEmoji function from AddRestaurantModal logic
    const normalized = cuisineName.toLowerCase().trim()
    if (normalized.includes('italian') || normalized.includes('pasta') || normalized.includes('pizza')) return '🍝'
    if (normalized.includes('japanese') || normalized.includes('sushi') || normalized.includes('ramen')) return '🍣'
    if (normalized.includes('mexican') || normalized.includes('taco') || normalized.includes('burrito')) return '🌮'
    if (normalized.includes('chinese') || normalized.includes('dim sum') || normalized.includes('dumpling')) return '🥡'
    if (normalized.includes('indian') || normalized.includes('curry') || normalized.includes('biryani')) return '🍛'
    if (normalized.includes('french') || normalized.includes('bistro')) return '🥐'
    if (normalized.includes('thai') || normalized.includes('pad thai')) return '🍜'
    if (normalized.includes('american') || normalized.includes('burger') || normalized.includes('bbq')) return '🍔'
    if (normalized.includes('korean') || normalized.includes('kimchi')) return '🥘'
    if (normalized.includes('mediterranean') || normalized.includes('hummus') || normalized.includes('falafel')) return '🥗'
    if (normalized.includes('greek')) return '🫒'
    if (normalized.includes('spanish') || normalized.includes('tapas')) return '🥘'
    if (normalized.includes('vietnamese') || normalized.includes('pho')) return '🍲'
    if (normalized.includes('middle eastern') || normalized.includes('lebanese') || normalized.includes('turkish')) return '🥙'
    if (normalized.includes('seafood') || normalized.includes('fish') || normalized.includes('lobster')) return '🦞'
    if (normalized.includes('bbq') || normalized.includes('barbecue') || normalized.includes('grill')) return '🍖'
    if (normalized.includes('pizza')) return '🍕'
    if (normalized.includes('sushi')) return '🍱'
    if (normalized.includes('vegetarian') || normalized.includes('veggie')) return '🥬'
    if (normalized.includes('vegan')) return '🌱'
    if (normalized.includes('breakfast') || normalized.includes('brunch') || normalized.includes('pancake')) return '🥞'
    if (normalized.includes('dessert') || normalized.includes('sweet') || normalized.includes('bakery')) return '🍰'
    if (normalized.includes('cafe') || normalized.includes('coffee') || normalized.includes('latte')) return '☕'
    if (normalized.includes('steak') || normalized.includes('steakhouse')) return '🥩'
    if (normalized.includes('pakistani') || normalized.includes('halal')) return '🍛'
    if (normalized.includes('ghanaian') || normalized.includes('african')) return '🍲'
    if (normalized.includes('balkan') || normalized.includes('eastern european')) return '🥘'
    if (normalized.includes('portuguese')) return '🍖'
    if (normalized.includes('southern') || normalized.includes('soul food')) return '🍗'
    
    return '🍽️'
  }
  
  // Extract unique cuisine names (case-insensitive, without emojis) for the filter dropdown
  const getUniqueCuisines = () => {
    const cuisineMap = new Map<string, { name: string, emoji: string }>()
    
    restaurants.forEach(restaurant => {
      const cuisineName = getCuisineName(restaurant.cuisine)
      
      // Handle multiple cuisines separated by commas
      const individualCuisines = cuisineName.split(',').map(c => c.trim()).filter(c => c)
      
      individualCuisines.forEach(cuisine => {
        const key = cuisine.toLowerCase().trim()
        
        // Only add if not already in map (case-insensitive check)
        if (key && !cuisineMap.has(key)) {
          const emoji = getCuisineEmoji(cuisine)
          cuisineMap.set(key, { name: cuisine, emoji })
        }
      })
    })
    
    return Array.from(cuisineMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }
  
  // Helper function to extract city/state from location (same logic as RestaurantCard)
  const getCityStateFromLocation = (location: string): string => {
    if (!location || !location.trim()) return ''
    location = location.trim()
    
    // Common US state abbreviations
    const stateAbbreviations: { [key: string]: string } = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
      'DC': 'District of Columbia'
    }
    
    // Known Virginia cities/areas from the data
    const vaCities = [
      'Clarendon', 'Ashburn', 'Sterling', 'Tysons', 'Chantilly', 'Herndon',
      'Arlington', 'Fairfax', 'Vienna', 'Falls Church', 'Alexandria', 'McLean',
      'Reston', 'Leesburg', 'Manassas', 'Woodbridge', 'Springfield', 'Burke'
    ]
    
    // Try to find "City, State" or "City, ST" pattern first
    const cityStatePattern = /([^,]+),\s*([A-Z]{2}|[A-Za-z\s]+)$/
    const match = location.match(cityStatePattern)
    
    if (match) {
      const city = match[1].trim()
      const state = match[2].trim()
      // If it's a state abbreviation, convert to full name
      const stateDisplay = stateAbbreviations[state.toUpperCase()] || state
      return `${city}, ${stateDisplay}`
    }
    
    // Check for state abbreviations or full names
    for (const [abbr, fullName] of Object.entries(stateAbbreviations)) {
      const stateRegex = new RegExp(`\\b${abbr}\\b|\\b${fullName}\\b`, 'i')
      if (location.match(stateRegex)) {
        // Check for known cities
        for (const city of vaCities) {
          if (location.toLowerCase().includes(city.toLowerCase())) {
            return `${city}, ${fullName}`
          }
        }
        // If no city found but state is present, return just state
        return fullName
      }
    }
    
    // Check for cities in parentheses (e.g., "Restaurant Name (City)")
    const parenMatch = location.match(/\(([^)]+)\)/)
    if (parenMatch) {
      const cityInParens = parenMatch[1].trim()
      for (const city of vaCities) {
        if (cityInParens.toLowerCase() === city.toLowerCase()) {
          return `${city}, Virginia`
        }
      }
    }
    
    // Pattern: Handle separators like "|" or "-" (e.g., "FiLLi Cafe | Chantilly - Virginia")
    if (location.includes('|') || location.includes('-')) {
      const parts = location.split(/[|\-–—]/).map(p => p.trim()).filter(p => p && p.length > 1)
      
      let cityFound = ''
      let stateFound = ''
      
      // Check each part for city or state
      for (const part of parts) {
        // Check for state
        for (const [abbr, fullName] of Object.entries(stateAbbreviations)) {
          if (part.match(new RegExp(`\\b${abbr}\\b`, 'i')) || part.match(new RegExp(`\\b${fullName}\\b`, 'i'))) {
            stateFound = fullName
            break
          }
        }
        
        // Check for known cities
        for (const vaCity of vaCities) {
          if (part.toLowerCase().includes(vaCity.toLowerCase())) {
            cityFound = vaCity
            break
          }
        }
        
        // Check if part looks like a city (capitalized, reasonable length, not restaurant-related)
        if (!cityFound && part.length > 2 && part.length < 25 && 
            part[0] === part[0].toUpperCase() && 
            !part.match(/\b(restaurant|cafe|bar|grill|kitchen|cuisine|food|hall|steakhouse|bakery|modern|indian|vegetarian|mediterranean)\b/i)) {
          cityFound = part
        }
      }
      
      if (cityFound && stateFound) {
        return `${cityFound}, ${stateFound}`
      }
      if (cityFound) {
        return `${cityFound}, Virginia`
      }
      if (stateFound) {
        return stateFound
      }
    }
    
    // Pattern: Try to extract from dash-separated parts
    const dashParts = location.split(/[,\-–—]/).map(p => p.trim()).filter(p => p && p.length > 2)
    if (dashParts.length >= 2) {
      // Check last part for state
      const lastPart = dashParts[dashParts.length - 1]
      for (const [abbr, fullName] of Object.entries(stateAbbreviations)) {
        if (lastPart.match(new RegExp(`\\b${abbr}\\b`, 'i')) || lastPart.match(new RegExp(`\\b${fullName}\\b`, 'i'))) {
          // Check previous part for city
          if (dashParts.length >= 2) {
            const prevPart = dashParts[dashParts.length - 2]
            for (const city of vaCities) {
              if (prevPart.toLowerCase().includes(city.toLowerCase())) {
                return `${city}, ${fullName}`
              }
            }
          }
          return fullName
        }
      }
    }
    
    // Check for known cities in the location string
    for (const city of vaCities) {
      if (location.toLowerCase().includes(city.toLowerCase())) {
        return `${city}, Virginia`
      }
    }
    
    // If no pattern matches, return empty string (don't use raw location)
    return ''
  }
  
  // Extract unique cuisine names (case-insensitive, without emojis) for the filter dropdown
  const cuisines = getUniqueCuisines()

  // Helper function to extract city and state separately from location
  const getCityAndState = (location: string): { city: string, state: string } => {
    const cityState = getCityStateFromLocation(location)
    if (!cityState) return { city: '', state: '' }
    
    // Split "City, State" format
    const parts = cityState.split(',').map(p => p.trim())
    if (parts.length >= 2) {
      return { city: parts[0], state: parts[1] }
    }
    
    // If only one part, check if it's a state or city
    const stateAbbreviations: { [key: string]: string } = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
      'DC': 'District of Columbia'
    }
    
    const singlePart = parts[0]
    // Check if it's a state
    for (const [abbr, fullName] of Object.entries(stateAbbreviations)) {
      if (singlePart.toLowerCase() === fullName.toLowerCase() || singlePart.toUpperCase() === abbr) {
        return { city: '', state: fullName }
      }
    }
    
    // Otherwise treat as city
    return { city: singlePart, state: '' }
  }

  // Helper function to get numeric rating from star string
  const getRatingNumber = (rating?: string): number => {
    if (!rating) return 0
    return (rating.match(/⭐/g) || []).length
  }

  const filteredRestaurants = restaurants.filter(restaurant => {
    const cuisineName = getCuisineName(restaurant.cuisine)
    const cityState = restaurant.location ? getCityStateFromLocation(restaurant.location) : ''
    
    // For cuisine matching, check if any of the cuisines match (handles multiple cuisines)
    const cuisineNames = cuisineName.split(',').map(c => c.trim().toLowerCase())
    const matchesCuisineFilter = selectedCuisine === '' || 
      cuisineNames.some(c => c === selectedCuisine.toLowerCase()) ||
      cuisineName.toLowerCase() === selectedCuisine.toLowerCase()
    
    // Rating filter
    const ratingNum = getRatingNumber(restaurant.rating)
    const minRating = selectedRating ? parseInt(selectedRating) : 0
    const matchesRatingFilter = ratingNum >= minRating
    
    // Location filter - search by city and/or state
    const matchesLocationFilter = (() => {
      if (!locationSearch.trim()) return true
      
      const searchTerm = locationSearch.toLowerCase().trim()
      const { city, state } = getCityAndState(restaurant.location || '')
      
      // Match if search term appears in city OR state
      const cityMatch = city && city.toLowerCase().includes(searchTerm)
      const stateMatch = state && state.toLowerCase().includes(searchTerm)
      
      // Also check the full cityState string for partial matches
      const fullMatch = cityState && cityState.toLowerCase().includes(searchTerm)
      
      return cityMatch || stateMatch || fullMatch
    })()
    
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cuisineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.mustTry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cityState && cityState.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch && matchesCuisineFilter && matchesRatingFilter && matchesLocationFilter
  })

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'rating-desc':
        return getRatingNumber(b.rating) - getRatingNumber(a.rating)
      case 'rating-asc':
        return getRatingNumber(a.rating) - getRatingNumber(b.rating)
      default:
        return 0
    }
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100/50">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          {/* Header */}
          <header className="text-center mb-10">
            <div className="inline-block mb-4">
              <span className="text-6xl md:text-7xl">🍽️</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent mb-4 tracking-tight">
              The Ultimate Bite List
            </h1>
            <p className="text-lg md:text-xl text-slate-700 mb-3 max-w-2xl mx-auto">
              Discover amazing restaurants and their must-try dishes
            </p>
            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Share your favorite spots with the community
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 hover:from-rose-500 hover:via-pink-500 hover:to-violet-500 active:from-rose-600 active:via-pink-600 active:to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-pink-300/50 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] border border-pink-300/30 touch-manipulation min-h-[44px] text-base md:text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Restaurant
            </button>
          </header>

          {/* Search and Filter Bar */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-rose-200/50 shadow-xl shadow-pink-100/50">
              {/* Search Bar */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search restaurants, cuisine, dishes, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-400/50 transition-all shadow-sm text-base"
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cuisine Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cuisine
                  </label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-400/50 transition-all appearance-none cursor-pointer shadow-sm text-base"
                  >
                    <option value="">All Cuisines</option>
                    {cuisines.map(cuisine => (
                      <option key={cuisine.name} value={cuisine.name}>
                        {cuisine.emoji} {cuisine.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location (City or State)
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by city or state..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-400/50 transition-all shadow-sm text-base"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-400/50 transition-all appearance-none cursor-pointer shadow-sm text-base"
                  >
                    <option value="">Any Rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4+ stars)</option>
                    <option value="3">⭐⭐⭐ (3+ stars)</option>
                    <option value="2">⭐⭐ (2+ stars)</option>
                    <option value="1">⭐ (1+ star)</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-400/50 transition-all appearance-none cursor-pointer shadow-sm text-base"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="rating-desc">Rating (High to Low)</option>
                    <option value="rating-asc">Rating (Low to High)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-slate-700">
            <span className="font-semibold text-pink-500">{sortedRestaurants.length}</span>
            <span className="ml-2">restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found</span>
          </div>
          {(searchQuery || selectedCuisine || selectedRating || locationSearch || sortBy !== 'name-asc') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCuisine('')
                setSelectedRating('')
                setLocationSearch('')
                setSortBy('name-asc')
              }}
              className="text-sm text-slate-500 hover:text-pink-500 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>

        {/* Restaurant Grid */}
        {sortedRestaurants.length === 0 ? (
          <div className="text-center py-20 md:py-32">
            <div className="inline-block p-4 bg-white/60 rounded-full mb-6 border border-pink-200/50 shadow-lg">
              <svg className="w-12 h-12 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-600 text-xl mb-2">No restaurants found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                onEdit={handleEditRestaurant}
                onDelete={handleDeleteRestaurant}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddRestaurant}
        editingRestaurant={editingRestaurant}
        onUpdate={handleUpdateRestaurant}
      />
    </main>
  )
}

