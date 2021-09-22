import './index.css'

import PaginationItem from '../PaginationItem'

const Pagination = props => {
  const {
    pageCount,
    onClickPaginationBtn,
    currentPage,
    pagesList,
    onClickPrevBtn,
    onClickNextBtn,
  } = props

  const onChangePage = page => {
    onClickPaginationBtn(page)
  }

  const onClickPrev = () => {
    onClickPrevBtn()
  }
  const onClickNext = () => {
    onClickNextBtn()
  }

  // Function To Get Previous Btn IN Pagination
  const getPrevBtn = () => {
    if (pageCount === 0) {
      return null
    }
    if (currentPage === 1) {
      return (
        <button
          className="prev-next-btn disabled-btn"
          type="button"
          onClick={onClickPrev}
          disabled
        >
          &laquo;Previous
        </button>
      )
    }
    return (
      <button className="prev-next-btn" type="button" onClick={onClickPrev}>
        &laquo;Previous
      </button>
    )
  }

  // Function To Get Next Btn In Pagination
  const getNextBtn = () => {
    if (currentPage === pageCount) {
      return (
        <button
          className="prev-next-btn disabled-btn"
          type="button"
          onClick={onClickNext}
          disabled
        >
          Next &raquo;
        </button>
      )
    }
    if (pageCount === 0) {
      return null
    }
    return (
      <button className="prev-next-btn" type="button" onClick={onClickNext}>
        Next &raquo;
      </button>
    )
  }

  return (
    <div className="pagination-container">
      {getPrevBtn()}
      <ul className="pagination-list">
        {pagesList.map(page => (
          <PaginationItem
            page={page}
            onClickPage={onChangePage}
            key={page}
            isSelected={page === currentPage}
          />
        ))}
      </ul>
      {getNextBtn()}
    </div>
  )
}

export default Pagination
