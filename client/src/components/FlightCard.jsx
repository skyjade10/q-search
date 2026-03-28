import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlane, faSuitcase, faBolt, faStar } from '@fortawesome/free-solid-svg-icons'
import { formatMoney } from '../utils/utility'
import { convertCurrency } from '../utils/utility'

const FlightCard = ({ item, preferredCurrency, onClick }) => {
  const converted = convertCurrency(item.price ? item.price : 0, item.currency ? item.currency : 'USD', preferredCurrency)

  return (
    <div
      onClick={() => onClick(item)}
      className="group cursor-pointer rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-gray-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FontAwesomeIcon icon={faPlane} className="text-blue-600 text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.airline || 'Airline Name'}</h3>
          <p className="text-sm text-gray-500">{item.flightNumber || 'Flight Number'}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatMoney(converted ?? item.price, preferredCurrency)}
          </p>
          {converted && item.currency !== preferredCurrency && (
            <p className="text-xs text-gray-500">{formatMoney(item.price, item.currency)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{item.departureTime || '07:30'}</p>
          <p className="text-xs text-gray-500">{item.departureAirport || 'NLA'}</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">{item.duration || '1h 40m'} • {item.type || 'Direct'}</p>
            <div className="w-16 h-px bg-gray-300 my-1"></div>
            <span className="text-xs text-gray-400">→</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{item.arrivalTime || '09:10'}</p>
          <p className="text-xs text-gray-500">{item.arrivalAirport || 'LUN'}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-600">
        {item.bagIncluded && (
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faSuitcase} className="text-green-600" />
            <span>Bag included</span>
          </div>
        )}
        {item.fastest && (
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faBolt} className="text-yellow-600" />
            <span>Fastest</span>
          </div>
        )}
        {item.onTime && (
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStar} className="text-blue-600" />
            <span>On-time</span>
          </div>
        )}
      </div>
      <div className="truncate">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800">
          {item.url}
        </a>
      </div>
    </div>
  )
}

export default FlightCard