import React, { useState } from 'react';
import Pagination from '../app/Pagination';

const itemsPerPage = 10; // Adjust this as needed
const totalItems = 100; // Replace with the actual total number of items

export default function YourPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = /* Fetch or filter your items based on the current page */[];

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Render your items from displayedItems */}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}