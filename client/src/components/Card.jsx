import React from 'react'
import { formatMoney } from '../utils/utility'
import { convertCurrency } from '../utils/utility'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const Card = ({ item, preferredCurrency,  onClick }) => {
  const converted = convertCurrency(item.price ? item.price : 0, item.currency ? item.currency : 'USD', preferredCurrency)   
  

  return (
    <div
      onClick={() => onClick(item)}
      className="group cursor-pointer rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-gray-300"
    >
      <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900">{item.name ? item.name : 'Unnamed Product'}</h3>
            {item.availability && <p className="text-xs text-gray-500">{item.availability}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {formatMoney(converted ?? item.price, preferredCurrency)}
            </p>
            {converted && item.currency !== preferredCurrency && (
              <p className="text-xs text-gray-500">{formatMoney(item.price, item.currency)}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {item.tags && item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className=" rounded-md bg-gray-100 px-2 py-1px  text-[10px] h text-gray-700">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStar} className="text-gray-500"/>
            <span className="text-xs font-medium text-gray-700">{item.rating}</span>
          </div>
        </div>
        <div className="truncate">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className=" text-xs font-medium text-blue-600 hover:text-blue-800">
            {item.url}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Card
