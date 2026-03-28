import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faBed, faBath, faCar, faSun, faWater, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { formatMoney } from '../utils/utility'
import { convertCurrency } from '../utils/utility'

const HouseCard = ({ item, preferredCurrency, onClick }) => {
  const converted = convertCurrency(item.price ? item.price : 0, item.currency ? item.currency : 'USD', preferredCurrency)

  return (
    <div
      onClick={() => onClick(item)}
      className="group cursor-pointer rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-gray-300"
    >
      <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 mb-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{item.name || '2 Bedroom Apartment'}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {formatMoney(converted ?? item.price, preferredCurrency)}
            </p>
            <p className="text-xs text-gray-500">/month</p>
            {converted && item.currency !== preferredCurrency && (
              <p className="text-xs text-gray-500">{formatMoney(item.price, item.currency)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
          <span>{item.location || 'Kansenshi, Ndola'}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faBed} className="text-gray-400" />
            <span>{item.bedrooms || '2'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faBath} className="text-gray-400" />
            <span>{item.bathrooms || '1'}</span>
          </div>
          {item.parking && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCar} className="text-gray-400" />
              <span>Parking</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600">
          {item.solar && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faSun} className="text-yellow-600" />
              <span>Solar</span>
            </div>
          )}
          {item.reliableWater && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faWater} className="text-blue-600" />
              <span>Reliable Water</span>
            </div>
          )}
          {item.secureYard && (
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
              <span>Secure Yard</span>
            </div>
          )}
        </div>

        {item.note && (
          <p className="text-sm text-blue-600 font-medium">{item.note}</p>
        )}
        <div className="truncate">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800">
            {item.url}
          </a>
        </div>
      </div>
    </div>
  )
}

export default HouseCard