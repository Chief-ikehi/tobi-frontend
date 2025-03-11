'use client';

import React, { useState } from 'react';
import Image from 'next/image';


interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'doc';
  size: string;
  date: string;
  category: 'contracts' | 'statements' | 'tax' | 'reports';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Investment Agreement',
    type: 'pdf',
    size: '2.4 MB',
    date: '2024-03-15',
    category: 'contracts'
  },
  {
    id: '2',
    title: 'Monthly Statement - March 2024',
    type: 'pdf',
    size: '1.8 MB',
    date: '2024-03-01',
    category: 'statements'
  },
  {
    id: '3',
    title: 'Tax Report 2023',
    type: 'pdf',
    size: '3.2 MB',
    date: '2024-02-28',
    category: 'tax'
  },
  {
    id: '4',
    title: 'Property Inspection Report',
    type: 'pdf',
    size: '4.1 MB',
    date: '2024-02-15',
    category: 'reports'
  }
];

const categories = [
  { id: 'all', label: 'All Documents' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'statements', label: 'Statements' },
  { id: 'tax', label: 'Tax Documents' },
  { id: 'reports', label: 'Reports' }
];

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return '/icons/pdf.svg';
      case 'image':
        return '/icons/image.svg';
      case 'doc':
        return '/icons/doc.svg';
      default:
        return '/icons/file.svg';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your investment documents and reports</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
          {/* Search */}
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 pl-12 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="p-3 sm:p-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`h-10 px-4 text-sm font-medium rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredDocuments.map((document) => (
                <div 
                  key={document.id} 
                  className="p-3 sm:p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Image
                          src={getFileIcon(document.type)}
                          alt={document.type}
                          width={28}
                          height={28}
                          className="text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate mb-0.5">
                        {document.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-xs text-gray-500">{document.size}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(document.date).toLocaleDateString()}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {document.category}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <button 
                        className="p-2 sm:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        aria-label="More options"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 