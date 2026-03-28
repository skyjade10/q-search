import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const FilterDrawer = ({ isOpen, onClose, filters, onFilterChange, category }) => {
    
    if (!isOpen) return null

    const isHotel = category === 'hotel'
    
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4" onClick={onClose}>
        <div
            className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <FontAwesomeIcon icon={faClose} onClick={onClose} className="text-lg text-gray-400 hover:text-gray-600"/>
            </div>

            <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceMax}
                onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
                className="mt-2 w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>${filters.priceMax}</span>
                </div>
            </div>

            {isHotel && (
                <>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nights</label>
                    <select
                    value={filters.nights}
                    onChange={(e) => onFilterChange('nights', Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                    <option value={1}>1 night</option>
                    <option value={2}>2 nights</option>
                    <option value={3}>3 nights</option>
                    <option value={7}>1 week</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                    <input
                    type="date"
                    value={filters.checkIn}
                    onChange={(e) => onFilterChange('checkIn', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <label className="mt-2 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={filters.rating4Plus}
                    onChange={(e) => onFilterChange('rating4Plus', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">4+ stars</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">What matters to you?</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                {['Cheap', 'Fast', 'Comfortable', 'High quality'].map((pref) => (
                    <label key={pref} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={filters.preferences.includes(pref)}
                        onChange={(e) => {
                        const newPrefs = filters.preferences.includes(pref)
                            ? filters.preferences.filter((p) => p !== pref)
                            : [...filters.preferences, pref]
                        onFilterChange('preferences', newPrefs)
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    {pref}
                    </label>
                ))}
                </div>
            </div>
            </div>

            <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
            Apply Filters
            </button>
        </div>
        </div>
    )
}

export default FilterDrawer
