interface Restaurant {
  id: number
  name: string
  cuisine: string
  mustTry: string
  location?: string
  link?: string
  rating?: string
}

interface RestaurantCardProps {
  restaurant: Restaurant
  onEdit?: (restaurant: Restaurant) => void
  onDelete?: (restaurant: Restaurant) => void
}

export default function RestaurantCard({ restaurant, onEdit, onDelete }: RestaurantCardProps) {
  // Extract city and state from location
  const getCityState = (location: string): string => {
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
    
    // Check for state name or abbreviation in the location
    let foundState = ''
    let foundStateName = ''
    
    for (const [abbr, fullName] of Object.entries(stateAbbreviations)) {
      // Check for state abbreviation
      const abbrRegex = new RegExp(`\\b${abbr}\\b`, 'i')
      if (abbrRegex.test(location)) {
        foundState = abbr
        foundStateName = fullName
        break
      }
      
      // Check for full state name
      const stateRegex = new RegExp(`\\b${fullName}\\b`, 'i')
      if (stateRegex.test(location)) {
        foundState = fullName
        foundStateName = fullName
        break
      }
    }
    
    // If state found, extract city
    if (foundState) {
      const stateRegex = new RegExp(`\\b${foundState}\\b`, 'i')
      const parts = location.split(stateRegex)
      if (parts[0]) {
        // Extract city from before the state
        let city = parts[0].replace(/[,\-–—]/g, '').trim()
        // Remove common restaurant name patterns
        city = city.replace(/\b(restaurant|cafe|bar|grill|kitchen|cuisine|food|hall)\b/gi, '').trim()
        city = city.replace(/\s+/g, ' ').trim()
        
        if (city && city.length > 2) {
          return `${city}, ${foundStateName}`
        }
      }
      return foundStateName
    }
    
    // Check for Virginia cities (many restaurants are in VA)
    for (const city of vaCities) {
      const cityRegex = new RegExp(`\\b${city}\\b`, 'i')
      if (cityRegex.test(location)) {
        if (city === 'Virginia') {
          // If location contains "Virginia", try to extract city before it
          const parts = location.split(/Virginia/i)
          if (parts[0]) {
            let cityName = parts[0].replace(/[,\-–—]/g, '').trim()
            cityName = cityName.replace(/\b(restaurant|cafe|bar|grill|kitchen|cuisine|food|hall)\b/gi, '').trim()
            cityName = cityName.replace(/\s+/g, ' ').trim()
            if (cityName && cityName.length > 2) {
              return `${cityName}, Virginia`
            }
          }
          return 'Virginia'
        }
        return `${city}, Virginia`
      }
    }
    
    // Pattern: Handle parentheses (e.g., "CHA Street Food (Sterling)")
    const parenMatch = location.match(/\(([^)]+)\)/)
    if (parenMatch) {
      const cityInParens = parenMatch[1].trim()
      // Check if it's a known city
      for (const vaCity of vaCities) {
        if (cityInParens.toLowerCase() === vaCity.toLowerCase() || 
            cityInParens.toLowerCase().includes(vaCity.toLowerCase())) {
          return `${vaCity}, Virginia`
        }
      }
      // If it looks like a city name
      if (cityInParens.length > 2 && cityInParens.length < 25 && 
          cityInParens[0] === cityInParens[0].toUpperCase() &&
          !cityInParens.match(/\b(restaurant|cafe|bar|grill|kitchen|cuisine|food|hall)\b/i)) {
        return `${cityInParens}, Virginia`
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
      // Check if any part looks like a city name
      for (const part of dashParts) {
        // Check for known cities first
        for (const vaCity of vaCities) {
          if (part.toLowerCase().includes(vaCity.toLowerCase())) {
            return `${vaCity}, Virginia`
          }
        }
        // Check if it looks like a city
        if (part[0] === part[0].toUpperCase() && part.length < 30 && 
            !part.match(/\b(restaurant|cafe|bar|grill|kitchen|cuisine|food|hall|steakhouse)\b/i)) {
          return `${part}, Virginia`
        }
      }
    }
    
    // If location is just a single word/phrase, check if it's a known city
    const cleanLocation = location.trim()
    for (const city of vaCities) {
      if (cleanLocation.match(new RegExp(`\\b${city}\\b`, 'i'))) {
        if (city === 'Virginia') {
          // Try to extract city name before "Virginia"
          const before = cleanLocation.split(/Virginia/i)[0].trim()
          if (before && before.length > 2) {
            return `${before}, Virginia`
          }
        }
        return `${city}, Virginia`
      }
    }
    
    // If it's a short location that doesn't look like a restaurant name, treat as city
    if (cleanLocation.length > 0 && cleanLocation.length < 30 && 
        !cleanLocation.match(/restaurant|cafe|bar|grill|kitchen|cuisine|food|hall|steakhouse/i)) {
      return `${cleanLocation}, Virginia`
    }
    
    // Final fallback: return location as-is (but format it nicely)
    return cleanLocation
  }

  // Calculate city/state first (needed for both display and link generation)
  const cityState = restaurant.location ? getCityState(restaurant.location) : ''

  // Generate Google Maps link if not provided
  const getGoogleMapsLink = () => {
    // Use provided link if available (most accurate - user-provided)
    if (restaurant.link && restaurant.link.trim()) {
      return restaurant.link.trim()
    }
    
    if (!restaurant.location) {
      return null
    }
    
    // Create a more specific Google Maps search query for better accuracy
    // Format: "Restaurant Name, City, State" works best for Google Maps
    let searchQuery = ''
    
    // Extract city and state from cityState display
    let city = ''
    let state = ''
    
    if (cityState && cityState.includes(',')) {
      const parts = cityState.split(',').map(p => p.trim())
      if (parts.length >= 2) {
        city = parts[0]
        state = parts[1]
      }
    }
    
    // Check if location is too similar to restaurant name (like "Chateau de Chantilly Cafe" vs "Chateau de Chantily")
    const nameLower = restaurant.name.toLowerCase().trim()
    const locationLower = restaurant.location.toLowerCase().trim()
    const nameWords = nameLower.split(/\s+/).filter(w => w.length > 2)
    const locationWords = locationLower.split(/\s+/).filter(w => w.length > 2)
    const commonWords = nameWords.filter(w => locationWords.some(lw => lw.includes(w) || w.includes(lw)))
    const isLocationSimilarToName = commonWords.length >= Math.max(2, nameWords.length * 0.6) && nameWords.length > 0
    
    // Build the most specific query possible
    if (city && state && city.length > 2) {
      // Best case: "Restaurant Name, City, State" - most specific and accurate
      // Example: "Chateau de Chantily, Chantilly, Virginia"
      searchQuery = `${restaurant.name}, ${city}, ${state}`
    } else if (isLocationSimilarToName && cityState && cityState.includes(',')) {
      // If location is similar to name, prefer using city/state for accuracy
      // This handles cases like "Chateau de Chantily" with location "Chateau de Chantilly Cafe"
      searchQuery = `${restaurant.name}, ${cityState}`
    } else if (cityState && cityState !== restaurant.location && cityState.includes(',')) {
      // Use formatted city/state if available
      searchQuery = `${restaurant.name}, ${cityState}`
    } else {
      // Fallback: clean up location and use it intelligently
      let cleanLocation = restaurant.location
      
      // Remove restaurant name from location if it's duplicated at the start
      if (locationLower.startsWith(nameLower)) {
        cleanLocation = cleanLocation.substring(restaurant.name.length).trim()
        cleanLocation = cleanLocation.replace(/^[,\-–—|\s]+/, '').trim()
      }
      
      // Extract meaningful location parts (remove restaurant descriptors)
      const locationParts = cleanLocation
        .split(/[,\-–—|]/)
        .map(p => p.trim())
        .filter(p => {
          const lower = p.toLowerCase()
          return (
            p.length > 2 && 
            p.length < 50 &&
            !lower.match(/\b(restaurant|cafe|bar|grill|kitchen|cuisine|food|hall|steakhouse|bakery|modern|indian|vegetarian|mediterranean)\b/) &&
            // Don't use parts that are too similar to restaurant name
            !nameWords.some(w => lower.includes(w) && w.length > 4)
          )
        })
      
      // Use the most meaningful location part
      if (locationParts.length > 0) {
        const bestLocation = locationParts[locationParts.length - 1] // Usually the last part has city/state
        searchQuery = `${restaurant.name}, ${bestLocation}`
      } else if (cleanLocation && cleanLocation.length > 2 && !isLocationSimilarToName) {
        // Only use clean location if it's not too similar to name
        searchQuery = `${restaurant.name}, ${cleanLocation}`
      } else {
        // Last resort: use restaurant name with state if we can infer it
        if (restaurant.location.toLowerCase().includes('virginia') || 
            restaurant.location.toLowerCase().includes('va') ||
            cityState?.toLowerCase().includes('virginia')) {
          searchQuery = `${restaurant.name}, Virginia`
        } else if (city && city.length > 2) {
          searchQuery = `${restaurant.name}, ${city}`
        } else {
          searchQuery = restaurant.name
        }
      }
    }
    
    // Create Google Maps search URL with the specific query
    const query = encodeURIComponent(searchQuery)
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  }

  const mapsLink = getGoogleMapsLink()

  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-pink-200/50 transition-all duration-300 transform hover:-translate-y-1 border border-rose-100/50 hover:border-pink-300/70 h-full flex flex-col relative">
      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(restaurant)}
              className="p-2.5 md:p-2 rounded-lg bg-white/90 md:bg-white/80 hover:bg-pink-50 active:bg-pink-100 border border-rose-200/50 hover:border-pink-300 text-slate-600 hover:text-pink-600 transition-all shadow-md md:shadow-sm hover:shadow-md touch-manipulation"
              title="Edit restaurant"
              aria-label="Edit restaurant"
            >
              <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(restaurant)}
              className="p-2.5 md:p-2 rounded-lg bg-white/90 md:bg-white/80 hover:bg-red-50 active:bg-red-100 border border-rose-200/50 hover:border-red-300 text-slate-600 hover:text-red-600 transition-all shadow-md md:shadow-sm hover:shadow-md touch-manipulation"
              title="Delete restaurant"
              aria-label="Delete restaurant"
            >
              <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Restaurant Name */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2 pr-24 md:pr-20">
          {restaurant.name}
        </h2>
        {/* Cuisine Badge */}
        <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 text-white rounded-lg text-xs font-semibold shadow-md border border-pink-300/30">
          {restaurant.cuisine}
        </span>
      </div>

      {/* Must Try Section */}
      <div className="mb-4 flex-grow">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl mt-0.5">⭐</span>
          <span className="font-semibold text-pink-500 text-sm uppercase tracking-wide">Must Try</span>
        </div>
        <p className="text-slate-600 pl-7 text-sm leading-relaxed line-clamp-3">
          {restaurant.mustTry}
        </p>
      </div>

      {/* Location (if available) */}
      {restaurant.location && cityState && (() => {
        // Check if cityState already contains the restaurant name to avoid duplication
        const nameLower = restaurant.name.toLowerCase().trim()
        const cityStateLower = cityState.toLowerCase().trim()
        
        // Check if cityState starts with or contains the restaurant name
        const nameWords = nameLower.split(/\s+/).filter(w => w.length > 2)
        const cityStateWords = cityStateLower.split(/\s+/).filter(w => w.length > 2)
        const commonWords = nameWords.filter(w => cityStateWords.includes(w))
        const isNameInCityState = cityStateLower.startsWith(nameLower) || 
                                  cityStateLower.includes(nameLower) ||
                                  (commonWords.length >= Math.max(2, nameWords.length * 0.7) && nameWords.length > 0)
        
        // Determine what to display
        let displayText = ''
        if (isNameInCityState) {
          // If name is already in cityState, just show cityState
          displayText = cityState
        } else {
          // Otherwise show "Restaurant Name - City, State"
          displayText = `${restaurant.name} - ${cityState}`
        }
        
        return (
          <div className="mt-4 pt-4 border-t border-rose-100/50">
            {mapsLink ? (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 text-xs flex items-center gap-2 hover:text-pink-500 transition-colors group"
              >
                <svg className="w-4 h-4 flex-shrink-0 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="group-hover:underline font-medium truncate">
                  {isNameInCityState ? (
                    <span className="text-slate-700">{displayText}</span>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800">{restaurant.name}</span>
                      {' - '}
                      <span className="text-slate-600">{cityState}</span>
                    </>
                  )}
                </span>
                <svg 
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-slate-500 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium truncate">
                  {isNameInCityState ? (
                    <span className="text-slate-700">{displayText}</span>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800">{restaurant.name}</span>
                      {' - '}
                      <span className="text-slate-600">{cityState}</span>
                    </>
                  )}
                </span>
              </p>
            )}
          </div>
        )
      })()}

      {/* Rating (if available) */}
      {restaurant.rating && (
        <div className="mt-3 pt-3 border-t border-rose-100/50 flex items-center gap-2">
          <span className="text-pink-500 text-sm font-semibold">
            {restaurant.rating}
          </span>
        </div>
      )}
    </div>
  )
}

