import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { Card, FilterDrawer, FlightCard, HotelCard, HouseCard } from './components'
import { CURRENCY_RATES, convertCurrency } from './utils/utility'
import { useBackend } from './contexts/BackendContext.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons'

const SORT_OPTIONS = ['Best Match', 'Cheapest', 'Fastest']

// Debounce utility
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}


const App = () => {
  const { loading, error, results, searchProducts } = useBackend()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('Best Match')
  const [preferredCurrency, setPreferredCurrency] = useState('USD')
  const [activeResults, setActiveResults] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceMax: 500,
    rating4Plus: false,
    preferences: [],
    nights: 1,
    checkIn: new Date().toISOString().split('T')[0],
  })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [runId, setRunId] = useState(null)

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.trim()) {
        setIsLoading(true)
        try {
          const result = await searchProducts(searchQuery, selectedCategory);
          setActiveResults(Array.isArray(result?.data) ? result.data : []);
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setActiveResults([]);
      }
    }, 500),
    [filters.priceMax, searchProducts]
  );

   useEffect(() => {
     //debouncedSearch(query);
     console.log('Query changed:', query);
     console.log('Selected category changed:', selectedCategory);
   }, [query, debouncedSearch,selectedCategory]);

  const runSearch = async () => {
    if (query.trim()) {
      setIsLoading(true)
      try {
        const result = await searchProducts(query, selectedCategory);
        setActiveResults(Array.isArray(result?.data) ? result.data : []);
        setIsLoading(false)
      } catch (error) {
        console.error('Search failed:', error)
        setIsLoading(false)
      }
    }
  }

  const handleCardClick = (item) => {
    window.open(item.url, '_blank')
  }

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const categories = ['all', 'electronics', 'food', 'clothing', 'hotel', 'house', 'flight']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="nav flex items-center justify-items-normal gap-4 sm:flex-row flex-col">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-700"><span className="text-blue-600">Q</span>-Search</h1> 
            </div>
            <div className="flex grow items-center gap-4 ">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search hotels, houses, flights, electronics..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <FontAwesomeIcon icon={faBarsStaggered} onClick={()=>{setIsFilterOpen(true)}} className="rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600" />
              
              <div
                className=''
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500  px-3 py-2 "
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

              </div>
              
              <button
                onClick={runSearch}
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {activeResults.length} results • {selectedCategory === 'all' ? 'All categories' : selectedCategory}
            {runId && ` • Run ID: ${runId}`}
          </p>
          <select
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            className="rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 py-1 text-xs"
          >
            {Object.keys(CURRENCY_RATES).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        {(() => {
          const filteredResults = selectedCategory === 'all'
            ? activeResults
            : activeResults.filter((r) => r.category === selectedCategory);

          return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResults.map((item) => {
                const sharedProps = { item, preferredCurrency, onClick: handleCardClick };
                if (item.category === 'hotel') return <HotelCard {...sharedProps} />;
                if (item.category === 'house') return <HouseCard {...sharedProps} />;
                if (item.category === 'flight') return <FlightCard {...sharedProps} />;
                return <Card key={item.id} {...sharedProps} />;
              })}
            </div>
          );
        })()}

        {activeResults.length === 0 && !isLoading && (
          <div className="mt-12 text-center text-gray-500">
            <p>No results found. Try adjusting your search or filters.</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-center text-gray-500">
            <p>Searching with TinyFish Web Agent...</p>
          </div>
        )}
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        category={selectedCategory}
      />
    </div>
  )
}

export default App
