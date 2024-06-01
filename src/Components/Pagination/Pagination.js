import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
import './Pagination.css';

const CustomPagination = ({ 
  itemsPerPage, 
  totalItems, 
  paginate, 
  currentPage, 
  renderPageNumber 
}) => {
  // Calculer le nombre total de pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      {/* Bouton "Previous" */}
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink previous onClick={() => paginate(currentPage - 1)}>
        
        </PaginationLink>
      </PaginationItem>
      {/* Boutons de pagination */}
      {pageNumbers.map(number => (
        <PaginationItem key={number} active={number === currentPage}>
          <PaginationLink onClick={() => paginate(number)}>
            {renderPageNumber ? renderPageNumber(number) : number}
          </PaginationLink>
        </PaginationItem>
      ))}
      {/* Bouton "Next" */}
      <PaginationItem disabled={currentPage === pageNumbers.length}>
        <PaginationLink next onClick={() => paginate(currentPage + 1)}>
        
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

CustomPagination.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  prevLabel: PropTypes.string,
  nextLabel: PropTypes.string,
  renderPageNumber: PropTypes.func
};

export default CustomPagination;
