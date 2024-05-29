import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './Pagination.css';


const CustomPagination = ({ studentsPerPage, totalStudents, paginate, currentPage }) => {
  // Calculer le nombre total de pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalStudents / studentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      {/* Bouton "Previous" */}
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
      </PaginationItem>
      {/* Boutons de pagination */}
      {pageNumbers.map(number => (
        <PaginationItem key={number} active={number === currentPage}>
          <PaginationLink onClick={() => paginate(number)}>
            {number}
          </PaginationLink>
        </PaginationItem>
      ))}
      {/* Bouton "Next" */}
      <PaginationItem disabled={currentPage === pageNumbers.length}>
        <PaginationLink next onClick={() => paginate(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

export default CustomPagination;
