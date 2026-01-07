export interface Restaurant {
  id: number
  name: string
  cuisine: string
  mustTry: string
  location?: string
  link?: string
  rating?: string
}

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "A2B",
    cuisine: "Indian 🍛",
    mustTry: "Dosas, Chicku shake",
    location: "A2B Indian Vegetarian Restaurant - Virginia",
    rating: "⭐⭐⭐"
  },
  {
    id: 2,
    name: "Agora Tysons Mediterranean Restaurant",
    cuisine: "Mediterranean 🥙",
    mustTry: "Ottoman Rice, Grilled Chicken",
    location: "Agora Tysons Mediterranean Restaurant",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    id: 3,
    name: "AMBAR Restaurant, Clarendon",
    cuisine: "Balkan 🥘",
    mustTry: "",
    location: "AMBAR Restaurant, Clarendon",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 4,
    name: "Ashburn Kaboob",
    cuisine: "Mediterranean 🥙",
    mustTry: "Kaboob Platters, Spinach side",
    location: "Ashburn Kabob",
    rating: "⭐⭐⭐"
  },
  {
    id: 5,
    name: "Biryani Grill",
    cuisine: "Indian 🍛",
    mustTry: "",
    location: "Biryani Grill",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 6,
    name: "Calabash African cuisine and Bar",
    cuisine: "Ghanaian 🍲",
    mustTry: "Jollof rice , waakye, fufu & Peanut soup , Light soup , fried plantains",
    location: "Calabash African Cuisine & Bar",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 7,
    name: "Celebration by Rupa Vira",
    cuisine: "Indian 🍛",
    mustTry: "Celebration Special dessert, Bluberry Pani Puri, Goat Biryani, Goat Curry",
    location: "Celebration by Rupa Vira - Modern Indian Cuisine",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 8,
    name: "CHA Street Food (Sterling)",
    cuisine: "Pakistani 🍛",
    mustTry: "",
    location: "CHA Street Food (Sterling)",
    rating: "⭐⭐⭐"
  },
  {
    id: 9,
    name: "Chatwala",
    cuisine: "Indian 🍛",
    mustTry: "Indian street food (aloo tikki chat, pani puri, vada pav etc)",
    location: "Chaatwala",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    id: 10,
    name: "Chateau de Chantily",
    cuisine: "Dessert 🍰, Coffee ☕",
    mustTry: "",
    location: "Chateau de Chantilly Cafe",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 11,
    name: "Dolan Uyghur Restaurant",
    cuisine: "Chinese 🥡, Turkish 🌯",
    mustTry: "",
    location: "Dolan Uyghur Restaurant",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 12,
    name: "Elmina",
    cuisine: "Ghanaian 🍲",
    mustTry: "Jollof rice",
    location: "Elmina",
    rating: "⭐⭐⭐"
  },
  {
    id: 13,
    name: "Filli cafe",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "FiLLi Cafe | Chantilly - Virginia"
  },
  {
    id: 14,
    name: "Fogo de Chão Brazilian Steakhouse",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "Fogo de Chão Brazilian Steakhouse",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 15,
    name: "Genki izakaya",
    cuisine: "Japanese 🍣",
    mustTry: "",
    location: "Genki Izakaya 元気"
  },
  {
    id: 16,
    name: "GORDON RAMSAY HELL'S KITCHEN",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "GORDON RAMSAY HELL'S KITCHEN",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 17,
    name: "Jodhpur",
    cuisine: "Indian 🍛",
    mustTry: "",
    location: "Jodhpur",
    rating: "⭐⭐⭐"
  },
  {
    id: 18,
    name: "Kaboob Nook",
    cuisine: "Mediterranean 🥙",
    mustTry: "Kaboob Platters, Spinach side",
    location: "Kabob Nook",
    rating: "⭐⭐⭐"
  },
  {
    id: 19,
    name: "Kakatiya Kitchen",
    cuisine: "Indian 🍛",
    mustTry: "Chicken Noodles, Goat Biryani",
    location: "Kakatiya Kitchen",
    rating: "⭐⭐⭐"
  },
  {
    id: 20,
    name: "Krispy Krunchy Chicken",
    cuisine: "Indian 🍛",
    mustTry: "Momos are fresh made to order",
    location: "Krispy Krunchy Chicken"
  },
  {
    id: 21,
    name: "Mama Cheng ",
    cuisine: "Chinese 🥡",
    mustTry: "",
    location: "Mama Chang"
  },
  {
    id: 22,
    name: "Melt Gourmet Cheeseburgers",
    cuisine: "American 🍔",
    mustTry: "",
    location: "Melt Gourmet Cheeseburgers",
    rating: "⭐⭐⭐"
  },
  {
    id: 23,
    name: "Milk & Honey Southern Inspired Kitchen",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "Milk & Honey Southern Inspired Kitchen",
    rating: "⭐⭐⭐"
  },
  {
    id: 24,
    name: "Nandos Peri Peri",
    cuisine: "Portuguese 🍖",
    mustTry: "Chicken, Garlic Bread and Mash is delicious",
    location: "Nando's PERi-PERi",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 25,
    name: "Ocean Crab",
    cuisine: "Southern 🍗",
    mustTry: "Cajun Boil",
    location: "Ocean Crab",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 26,
    name: "Paradise biryani pointe",
    cuisine: "Indian 🍛",
    mustTry: "",
    location: "Paradise Biryani Pointe"
  },
  {
    id: 27,
    name: "peter chang",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "Peter Chang Herndon"
  },
  {
    id: 28,
    name: "Phở 75",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "Phở 75",
    rating: "⭐⭐⭐"
  },
  {
    id: 29,
    name: "Succotash",
    cuisine: "Southern 🍗",
    mustTry: "Dirty fried chicken , Apple cider BBQ ribs, Nashville Hot fried oysters",
    location: "SUCCOTASH",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 30,
    name: "Tava Fry Modern Indian Bar & Restaurant",
    cuisine: "Indian 🍛",
    mustTry: "",
    location: "Tava Fry Modern Indian Bar & Restaurant",
    rating: "⭐⭐⭐"
  },
  {
    id: 31,
    name: "Tilly Kitchen Food Hall",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "Tilly Kitchen Food Hall",
    rating: "⭐⭐⭐"
  },
  {
    id: 32,
    name: "Toosso",
    cuisine: "Pakistani 🍛",
    mustTry: "CHICKEN TIKKA SPECIAL, Falooda",
    location: "Toosso",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 33,
    name: "Tous Les Jours",
    cuisine: "Coffee ☕, Dessert 🍰",
    mustTry: "",
    location: "Tous Les Jours Bakery Cafe",
    rating: "⭐⭐⭐⭐"
  },
  {
    id: 34,
    name: "Turmerica By Tanvi Modi",
    cuisine: "Indian 🍛",
    mustTry: "Vada Paav, Thalis",
    location: "Turmerica By Tanvi Modi",
    rating: "⭐⭐⭐"
  },
  {
    id: 35,
    name: "ugly dumpling",
    cuisine: "Other 🍽️",
    mustTry: "",
    location: "Ugly Dumpling"
  }
]
