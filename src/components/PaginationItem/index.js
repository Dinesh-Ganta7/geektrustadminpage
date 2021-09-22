import './index.css'

const PaginationItem = props => {
  const {page, onClickPage, isSelected} = props

  const onClickPageBtn = () => {
    onClickPage(page)
  }
  const buttonClassName = isSelected ? 'page-btn selected-button' : 'page-btn'
  return (
    <li>
      <button
        type="button"
        className={buttonClassName}
        onClick={onClickPageBtn}
      >
        {page}
      </button>
    </li>
  )
}

export default PaginationItem
