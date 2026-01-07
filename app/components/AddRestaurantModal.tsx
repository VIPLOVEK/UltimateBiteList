'use client'

import { useState, useEffect } from 'react'

interface Restaurant {
  id: number
  name: string
  cuisine: string
  mustTry: string
  location?: string
  link?: string
  rating?: string
}

interface AddRestaurantModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (restaurant: Omit<Restaurant, 'id'>) => void
  editingRestaurant?: Restaurant | null
  onUpdate?: (id: number, restaurant: Omit<Restaurant, 'id'>) => void
}

const CUISINES = [
  // Asian Cuisines
  { name: 'Chinese', emoji: '🥡' },
  { name: 'Japanese', emoji: '🍣' },
  { name: 'Korean', emoji: '🥘' },
  { name: 'Thai', emoji: '🍜' },
  { name: 'Vietnamese', emoji: '🍲' },
  { name: 'Indian', emoji: '🍛' },
  { name: 'Pakistani', emoji: '🍛' },
  { name: 'Bangladeshi', emoji: '🍛' },
  { name: 'Sri Lankan', emoji: '🍛' },
  { name: 'Nepalese', emoji: '🍛' },
  { name: 'Indonesian', emoji: '🍜' },
  { name: 'Malaysian', emoji: '🍜' },
  { name: 'Singaporean', emoji: '🍜' },
  { name: 'Filipino', emoji: '🍜' },
  { name: 'Cambodian', emoji: '🍜' },
  { name: 'Laotian', emoji: '🍜' },
  { name: 'Burmese', emoji: '🍜' },
  { name: 'Mongolian', emoji: '🍖' },
  { name: 'Tibetan', emoji: '🍜' },
  
  // Middle Eastern & North African
  { name: 'Middle Eastern', emoji: '🥙' },
  { name: 'Lebanese', emoji: '🥙' },
  { name: 'Turkish', emoji: '🌯' },
  { name: 'Persian', emoji: '🍛' },
  { name: 'Afghan', emoji: '🍛' },
  { name: 'Armenian', emoji: '🥙' },
  { name: 'Israeli', emoji: '🥙' },
  { name: 'Moroccan', emoji: '🥘' },
  { name: 'Egyptian', emoji: '🥙' },
  { name: 'Ethiopian', emoji: '🍲' },
  { name: 'Eritrean', emoji: '🍲' },
  
  // European Cuisines
  { name: 'Italian', emoji: '🍝' },
  { name: 'French', emoji: '🥐' },
  { name: 'Spanish', emoji: '🥘' },
  { name: 'Greek', emoji: '🫒' },
  { name: 'German', emoji: '🍖' },
  { name: 'British', emoji: '🍔' },
  { name: 'Irish', emoji: '🍖' },
  { name: 'Portuguese', emoji: '🍖' },
  { name: 'Russian', emoji: '🥘' },
  { name: 'Polish', emoji: '🥘' },
  { name: 'Czech', emoji: '🍖' },
  { name: 'Hungarian', emoji: '🍖' },
  { name: 'Romanian', emoji: '🍖' },
  { name: 'Bulgarian', emoji: '🥘' },
  { name: 'Serbian', emoji: '🍖' },
  { name: 'Croatian', emoji: '🍖' },
  { name: 'Balkan', emoji: '🥘' },
  { name: 'Swedish', emoji: '🍖' },
  { name: 'Norwegian', emoji: '🦞' },
  { name: 'Danish', emoji: '🍖' },
  { name: 'Finnish', emoji: '🦞' },
  { name: 'Dutch', emoji: '🍖' },
  { name: 'Belgian', emoji: '🍖' },
  { name: 'Swiss', emoji: '🧀' },
  { name: 'Austrian', emoji: '🍖' },
  
  // American Cuisines
  { name: 'American', emoji: '🍔' },
  { name: 'Mexican', emoji: '🌮' },
  { name: 'Tex-Mex', emoji: '🌮' },
  { name: 'Cuban', emoji: '🍖' },
  { name: 'Puerto Rican', emoji: '🍖' },
  { name: 'Dominican', emoji: '🍖' },
  { name: 'Brazilian', emoji: '🍖' },
  { name: 'Argentinian', emoji: '🥩' },
  { name: 'Peruvian', emoji: '🍲' },
  { name: 'Colombian', emoji: '🍖' },
  { name: 'Venezuelan', emoji: '🍖' },
  { name: 'Chilean', emoji: '🦞' },
  { name: 'Ecuadorian', emoji: '🍲' },
  { name: 'Jamaican', emoji: '🍖' },
  { name: 'Trinidadian', emoji: '🍖' },
  { name: 'Haitian', emoji: '🍲' },
  { name: 'Southern', emoji: '🍗' },
  { name: 'Cajun', emoji: '🍲' },
  { name: 'Creole', emoji: '🍲' },
  
  // African Cuisines
  { name: 'Ghanaian', emoji: '🍲' },
  { name: 'Nigerian', emoji: '🍲' },
  { name: 'Senegalese', emoji: '🍲' },
  { name: 'South African', emoji: '🍖' },
  { name: 'Kenyan', emoji: '🍲' },
  { name: 'Tanzanian', emoji: '🍲' },
  { name: 'West African', emoji: '🍲' },
  { name: 'East African', emoji: '🍲' },
  
  // Other Regional
  { name: 'Caribbean', emoji: '🍖' },
  { name: 'Mediterranean', emoji: '🥗' },
  { name: 'Fusion', emoji: '🍽️' },
  { name: 'International', emoji: '🌍' },
  
  // Specialty Categories
  { name: 'Seafood', emoji: '🦞' },
  { name: 'BBQ', emoji: '🍖' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Sushi', emoji: '🍱' },
  { name: 'Steakhouse', emoji: '🥩' },
  { name: 'Vegetarian', emoji: '🥬' },
  { name: 'Vegan', emoji: '🌱' },
  { name: 'Breakfast', emoji: '🥞' },
  { name: 'Brunch', emoji: '🥞' },
  { name: 'Dessert', emoji: '🍰' },
  { name: 'Bakery', emoji: '🍞' },
  { name: 'Cafe', emoji: '☕' },
  { name: 'Coffee', emoji: '☕' },
  { name: 'Ice Cream', emoji: '🍦' },
  { name: 'Fast Food', emoji: '🍔' },
  { name: 'Food Truck', emoji: '🚚' },
  { name: 'Tapas', emoji: '🥘' },
  { name: 'Dim Sum', emoji: '🥡' },
  { name: 'Ramen', emoji: '🍜' },
  { name: 'Noodles', emoji: '🍜' },
  { name: 'Soup', emoji: '🍲' },
  { name: 'Salad', emoji: '🥗' },
  { name: 'Sandwich', emoji: '🥪' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Taco', emoji: '🌮' },
  { name: 'Burrito', emoji: '🌯' },
  { name: 'Other', emoji: '🍽️' },
]

// Function to assign appropriate emoji to a cuisine name
const getCuisineEmoji = (cuisineName: string): string => {
  if (!cuisineName) return '🍽️'
  
  const normalized = cuisineName.toLowerCase().trim()
  
  // Check exact matches first
  const exactMatch = CUISINES.find(c => c.name.toLowerCase() === normalized)
  if (exactMatch) return exactMatch.emoji
  
  // Check partial matches and keywords
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
  
  // Default emoji for unknown cuisines
  return '🍽️'
}

const US_STATES = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
  { name: 'District of Columbia', abbreviation: 'DC' },
]

// Common cities by state - focusing on Virginia since most restaurants are there
const CITIES_BY_STATE: { [key: string]: string[] } = {
  'Virginia': [
    'Alexandria', 'Arlington', 'Ashburn', 'Burke', 'Chantilly', 'Clarendon',
    'Fairfax', 'Falls Church', 'Herndon', 'Leesburg', 'Manassas', 'McLean',
    'Reston', 'Springfield', 'Sterling', 'Tysons', 'Vienna', 'Woodbridge'
  ],
  'New York': [
    'New York', 'Brooklyn', 'Queens', 'Manhattan', 'Bronx', 'Staten Island',
    'Buffalo', 'Rochester', 'Albany', 'Syracuse'
  ],
  'California': [
    'Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Oakland',
    'Sacramento', 'Fresno', 'Long Beach', 'Santa Ana', 'Anaheim'
  ],
  'Texas': [
    'Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso',
    'Arlington', 'Corpus Christi', 'Plano', 'Laredo'
  ],
  'Florida': [
    'Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale',
    'St. Petersburg', 'Tallahassee', 'Hialeah', 'Port St. Lucie', 'Cape Coral'
  ],
  'Illinois': [
    'Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Elgin',
    'Peoria', 'Champaign', 'Waukegan', 'Cicero'
  ],
  'Pennsylvania': [
    'Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton',
    'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona'
  ],
  'Ohio': [
    'Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton',
    'Parma', 'Canton', 'Youngstown', 'Lorain'
  ],
  'Georgia': [
    'Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Sandy Springs',
    'Roswell', 'Macon', 'Johns Creek', 'Albany'
  ],
  'North Carolina': [
    'Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville',
    'Cary', 'Wilmington', 'High Point', 'Concord'
  ],
  'Michigan': [
    'Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Lansing', 'Ann Arbor',
    'Flint', 'Dearborn', 'Livonia', 'Troy'
  ],
  'New Jersey': [
    'Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Woodbridge',
    'Lakewood', 'Toms River', 'Hamilton', 'Trenton'
  ],
  'Washington': [
    'Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent',
    'Everett', 'Renton', 'Yakima', 'Federal Way'
  ],
  'Massachusetts': [
    'Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford',
    'Brockton', 'Quincy', 'Lynn', 'Fall River'
  ],
  'Arizona': [
    'Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale',
    'Gilbert', 'Tempe', 'Peoria', 'Surprise'
  ],
  'Tennessee': [
    'Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro',
    'Franklin', 'Jackson', 'Johnson City', 'Bartlett'
  ],
  'Indiana': [
    'Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers',
    'Bloomington', 'Hammond', 'Gary', 'Muncie'
  ],
  'Maryland': [
    'Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Annapolis',
    'College Park', 'Salisbury', 'Laurel', 'Greenbelt'
  ],
  'Missouri': [
    'Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence', 'Lee\'s Summit',
    'O\'Fallon', 'St. Joseph', 'St. Charles', 'St. Peters'
  ],
  'Wisconsin': [
    'Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton',
    'Waukesha', 'Oshkosh', 'Eau Claire', 'Janesville'
  ],
  'Colorado': [
    'Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton',
    'Arvada', 'Westminster', 'Pueblo', 'Centennial'
  ],
}

export default function AddRestaurantModal({ isOpen, onClose, onAdd, editingRestaurant, onUpdate }: AddRestaurantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    mustTry: '',
    city: '',
    state: '',
    link: '',
    rating: ''
  })
  const [showCustomCuisine, setShowCustomCuisine] = useState(false)
  const [customCuisine, setCustomCuisine] = useState('')
  const [showLocationFields, setShowLocationFields] = useState(false)
  
  // Get cities for selected state
  const availableCities = formData.state ? (CITIES_BY_STATE[formData.state] || []) : []

  // Helper function to extract city and state from location string
  const extractCityState = (location: string): { city: string; state: string } => {
    if (!location) return { city: '', state: '' }
    
    // State abbreviations map
    const stateAbbrMap: { [key: string]: string } = {
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
    
    // Try "City, State" pattern first
    const cityStatePattern = /([^,]+),\s*([A-Za-z\s]+)$/
    const match = location.match(cityStatePattern)
    
    if (match) {
      const city = match[1].trim()
      let state = match[2].trim()
      
      // Convert state abbreviation to full name if needed
      if (stateAbbrMap[state.toUpperCase()]) {
        state = stateAbbrMap[state.toUpperCase()]
      }
      
      return { city, state }
    }
    
    // Try to find state in location
    const allStates = Object.values(stateAbbrMap)
    for (const fullState of allStates) {
      if (location.includes(fullState)) {
        // Try to extract city before state
        const parts = location.split(fullState)
        if (parts[0]) {
          const city = parts[0].replace(/[,\-–—]/g, '').trim()
          if (city && city.length > 2) {
            return { city, state: fullState }
          }
        }
        return { city: '', state: fullState }
      }
    }
    
    return { city: '', state: '' }
  }

  useEffect(() => {
    if (isOpen) {
      if (editingRestaurant) {
        // Populate form with restaurant data for editing
        const cuisineName = editingRestaurant.cuisine.replace(/[\u{1F300}-\u{1F9FF}]+\s*$/u, '').trim()
          .replace(/^[\u{1F300}-\u{1F9FF}]+\s*/u, '').trim()
        
        // Extract city and state from location
        const { city, state } = editingRestaurant.location 
          ? extractCityState(editingRestaurant.location)
          : { city: '', state: '' }
        
        setFormData({
          name: editingRestaurant.name || '',
          cuisine: cuisineName || '',
          mustTry: editingRestaurant.mustTry || '',
          city: city,
          state: state,
          link: editingRestaurant.link || '',
          rating: editingRestaurant.rating || ''
        })
        
        // Check if cuisine is in the predefined list
        const isPredefinedCuisine = CUISINES.some(c => c.name.toLowerCase() === cuisineName.toLowerCase())
        setShowCustomCuisine(!isPredefinedCuisine)
        setCustomCuisine(isPredefinedCuisine ? '' : cuisineName)
        
        // Show location fields if no link provided
        setShowLocationFields(!editingRestaurant.link || !editingRestaurant.link.trim())
      } else {
        // Reset form when adding new restaurant
        setFormData({
          name: '',
          cuisine: '',
          mustTry: '',
          city: '',
          state: '',
          link: '',
          rating: ''
        })
        setShowCustomCuisine(false)
        setCustomCuisine('')
        setShowLocationFields(false)
      }
    }
  }, [isOpen, editingRestaurant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const finalCuisine = showCustomCuisine ? customCuisine : formData.cuisine
    
    if (!formData.name || !finalCuisine || !formData.mustTry) {
      alert('Please fill in all required fields (Name, Cuisine, and Must Try dishes)')
      return
    }

    // Get emoji for cuisine - use predefined or assign appropriate emoji
    // Format: "Cuisine Name Emoji" (emoji at the end)
    const cuisineData = CUISINES.find(c => c.name.toLowerCase() === finalCuisine.toLowerCase())
    const emoji = cuisineData ? cuisineData.emoji : getCuisineEmoji(finalCuisine)
    const cuisineDisplay = `${finalCuisine} ${emoji}`

    // Build location string from city and state
    let locationString = ''
    if (formData.city && formData.state) {
      locationString = `${formData.city}, ${formData.state}`
    } else if (formData.state) {
      locationString = formData.state
    }

    // Google Maps link is required - use provided link or auto-generate
    let googleMapsLink = formData.link?.trim()
    
    // If no link provided, auto-generate from restaurant name, city, and state
    if (!googleMapsLink) {
      if (formData.city && formData.state) {
        const searchQuery = encodeURIComponent(`${formData.name}, ${formData.city}, ${formData.state}`)
        googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
      } else if (formData.state) {
        const searchQuery = encodeURIComponent(`${formData.name}, ${formData.state}`)
        googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
      } else if (formData.city) {
        const searchQuery = encodeURIComponent(`${formData.name}, ${formData.city}`)
        googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
      } else {
        // If no location info, use just restaurant name
        const searchQuery = encodeURIComponent(formData.name)
        googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
      }
    }

    const restaurantData = {
      name: formData.name,
      cuisine: cuisineDisplay,
      mustTry: formData.mustTry,
      location: locationString || undefined,
      link: googleMapsLink,
      rating: formData.rating || undefined
    }

    if (editingRestaurant && onUpdate) {
      // Update existing restaurant
      onUpdate(editingRestaurant.id, restaurantData)
    } else {
      // Add new restaurant
      onAdd(restaurantData)
    }

    onClose()
  }

  const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'custom') {
      setShowCustomCuisine(true)
      setFormData({ ...formData, cuisine: '' })
    } else {
      setShowCustomCuisine(false)
      setFormData({ ...formData, cuisine: value })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // If state changes, reset city
    if (name === 'state') {
      setFormData({
        ...formData,
        state: value,
        city: '' // Reset city when state changes
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-rose-200/50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 text-white p-4 md:p-6 rounded-t-2xl border-b border-pink-300/30 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">
              {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 active:bg-white/30 rounded-full p-2.5 md:p-2 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6 bg-white">
          {/* Restaurant Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              Restaurant Name <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 placeholder-slate-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm text-base"
              placeholder="e.g., Joe's Pizza"
            />
          </div>

          {/* Cuisine */}
          <div>
            <label htmlFor="cuisine" className="block text-sm font-semibold text-slate-700 mb-2">
              Cuisine Type <span className="text-pink-500">*</span>
            </label>
            {!showCustomCuisine ? (
              <select
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleCuisineChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm text-base"
              >
                <option value="">Select Cuisine</option>
                {CUISINES.map((cuisine) => (
                  <option key={cuisine.name} value={cuisine.name}>
                    {cuisine.emoji} {cuisine.name}
                  </option>
                ))}
                <option value="custom">➕ Add New Cuisine</option>
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  id="customCuisine"
                  name="customCuisine"
                  value={customCuisine}
                  onChange={(e) => setCustomCuisine(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-pink-400/50 text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm text-base"
                  placeholder="Enter new cuisine type"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCuisine(false)
                    setCustomCuisine('')
                    setFormData({ ...formData, cuisine: '' })
                  }}
                  className="text-sm text-pink-500 hover:text-pink-600 font-medium"
                >
                  ← Back to list
                </button>
              </div>
            )}
          </div>

          {/* Must Try Dishes */}
          <div>
            <label htmlFor="mustTry" className="block text-sm font-semibold text-slate-700 mb-2">
              Must Try Dishes <span className="text-pink-500">*</span>
            </label>
            <textarea
              id="mustTry"
              name="mustTry"
              value={formData.mustTry}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 placeholder-slate-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all resize-none shadow-sm text-base"
              placeholder="e.g., Pepperoni Pizza, Margherita Pizza, Garlic Knots"
            />
            <p className="text-xs text-slate-500 mt-1">Separate multiple dishes with commas</p>
          </div>

          {/* Google Maps Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-semibold text-slate-700 mb-2">
              Google Maps Link <span className="text-pink-500">*</span>
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={(e) => {
                handleChange(e)
                // If user enters a link, hide location fields
                if (e.target.value.trim()) {
                  setShowLocationFields(false)
                }
              }}
              className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 placeholder-slate-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm text-base"
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.link && formData.link.trim() ? (
                <span className="text-green-600">✓ Custom Google Maps URL provided</span>
              ) : (
                <span>If not provided, a link will be automatically generated from the restaurant name, city, and state.</span>
              )}
            </p>
          </div>

          {/* Checkbox to show location fields */}
          {!formData.link || !formData.link.trim() ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-rose-50/50 rounded-xl border border-rose-200/50">
                <input
                  type="checkbox"
                  id="showLocationFields"
                  checked={showLocationFields}
                  onChange={(e) => setShowLocationFields(e.target.checked)}
                  className="w-5 h-5 text-pink-500 border-rose-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="showLocationFields" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Google Map Link is not handy
                </label>
              </div>

              {/* State and City Fields - Only show when checkbox is checked */}
              {showLocationFields && (
                <>
                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-slate-700 mb-2">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm text-base"
                    >
                      <option value="">Select State</option>
                      {US_STATES.map((state) => (
                        <option key={state.abbreviation} value={state.name}>
                          {state.name} ({state.abbreviation})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                      City
                    </label>
                    {formData.state ? (
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm text-base"
                      >
                        <option value="">Select City</option>
                        {availableCities.length > 0 ? (
                          availableCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No cities available for this state</option>
                        )}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-rose-100/50 text-slate-400 cursor-not-allowed"
                        placeholder="Please select a state first"
                      />
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.state 
                        ? 'Select a city from the list. Google Maps link will be generated automatically.'
                        : 'Select a state first to see available cities.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-semibold text-slate-700 mb-2">
              Rating (Optional)
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-rose-200/50 text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50 transition-all shadow-sm"
            >
              <option value="">Select Rating</option>
              <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐ (5 stars)</option>
              <option value="⭐⭐⭐⭐">⭐⭐⭐⭐ (4 stars)</option>
              <option value="⭐⭐⭐">⭐⭐⭐ (3 stars)</option>
              <option value="⭐⭐">⭐⭐ (2 stars)</option>
              <option value="⭐">⭐ (1 star)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 md:py-3 rounded-xl border border-rose-200/50 text-slate-700 font-semibold hover:bg-rose-50 active:bg-rose-100 hover:border-rose-300/50 transition-colors touch-manipulation min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 md:py-3 rounded-xl bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 hover:from-rose-500 hover:via-pink-500 hover:to-violet-500 active:from-rose-600 active:via-pink-600 active:to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-300/50 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] border border-pink-300/30 touch-manipulation min-h-[44px]"
            >
              {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

