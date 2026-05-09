import React from 'react'

export const StatusIndicator = ({ status, label }) => {
  return (
     <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' ? 'bg-green-500' : 
        status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  )
}
