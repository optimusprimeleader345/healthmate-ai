import React from 'react'
import { Input } from './Input'
import { Search } from 'lucide-react'

interface SearchBoxProps {
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search...',
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={placeholder}
          onChange={onChange}
          className="pl-10"
        />
      </div>
    </div>
  )
}

export default SearchBox
