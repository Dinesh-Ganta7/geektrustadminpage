import {AiOutlineDelete, AiTwotoneEdit} from 'react-icons/ai'

import './index.css'

const UserListItem = props => {
  const {
    userData,
    onClickSelect,
    selectedUsers,
    isSelectAllChecked,
    onClickDeleteIconBtn,
    onCLickEditBtn,
  } = props
  const {name, email, role, id} = userData

  // on clicking checkbox
  const onClickCheckBox = event => {
    onClickSelect(id, event.target.checked)
  }

  // on clicking edit
  const onClickEditIconBtn = () => {
    onCLickEditBtn(id)
  }

  // on clicking delete
  const onClickDeleteBtn = () => {
    onClickDeleteIconBtn(id)
  }

  // Getting Checkbox Status
  const getCheckBoxStatus = () => {
    let isChecked
    if (selectedUsers.includes(id) && isSelectAllChecked) {
      isChecked = 'checked'
    } else {
      isChecked = ''
    }

    if (selectedUsers.includes(id)) {
      isChecked = 'checked'
    } else {
      isChecked = ''
    }
    return isChecked
  }

  // updating className for selected item
  const selectedUserClassName = selectedUsers.includes(id)
    ? 'selected-user-row'
    : ''

  return (
    <tr className={`table-user-data-row ${selectedUserClassName}`}>
      <td>
        <input
          type="checkbox"
          className="checkbox"
          onChange={onClickCheckBox}
          checked={getCheckBoxStatus()}
        />
      </td>
      <td className="user-data-text">{name}</td>
      <td className="user-data-text">{email}</td>
      <td className="user-data-text">{role}</td>
      <td className="user-data-text">
        <button type="button" className="btn">
          <AiTwotoneEdit className="icon" onClick={onClickEditIconBtn} />
        </button>
        <button type="button" className="btn">
          <AiOutlineDelete
            className="icon delete-icon"
            onClick={onClickDeleteBtn}
          />
        </button>
      </td>
    </tr>
  )
}

export default UserListItem
