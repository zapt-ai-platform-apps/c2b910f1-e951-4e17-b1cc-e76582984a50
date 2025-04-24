import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        <button
          className={`btn px-4 py-2 whitespace-nowrap ${
            selectedCategory === 'all' 
              ? 'btn-primary' 
              : 'btn-secondary'
          }`}
          onClick={() => onSelectCategory('all')}
        >
          Todos
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            className={`btn px-4 py-2 whitespace-nowrap ${
              selectedCategory === category.id 
                ? 'btn-primary' 
                : 'btn-secondary'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}