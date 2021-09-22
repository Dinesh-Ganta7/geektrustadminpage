import {Component} from 'react'

import './index.css'

import UserListItem from '../UserListItem'

import Pagination from '../Pagination'

class AdminMain extends Component {
  state = {
    searchInput: '',
    usersData: [], // users data
    selectedUsers: [], // selected users ids to delete
    pageCount: 0, // total pages count
    upperLimit: 10, // End index of ten results
    lowerLimit: 0, // start Index of ten results
    currentPage: 1, // Active Page
    pageNumbersList: [], // total number of pages included in pagination
    pageRangeStartIndex: 0, // pagination list start index
    pageRangeEndIndex: 4, // pagination list range index based on the range I took 4 pages to display at a time
    isSelectAllChecked: false, // status of select all checkbox
    userIdToEdit: null,
    nameEditValue: '',
    emailEditValue: '',
    roleEditValue: '',
  }

  componentDidMount() {
    this.getUsersData()
  }

  // onclick save edits
  onClickSaveEdits = () => {
    const {
      nameEditValue,
      emailEditValue,
      roleEditValue,
      userIdToEdit,
      usersData,
    } = this.state
    const updatedUserObj = {
      id: userIdToEdit,
      name: nameEditValue,
      email: emailEditValue,
      role: roleEditValue,
    }
    const usersDataCopy = [...usersData]
    const userIndex = usersDataCopy.findIndex(
      eachItem => eachItem.id === userIdToEdit,
    )
    usersDataCopy[userIndex] = updatedUserObj
    this.setState({
      usersData: usersDataCopy,
      nameEditValue: '',
      emailEditValue: '',
      roleEditValue: '',
    })
  }

  // onchange name edit value

  onChangeNameEditValue = event => {
    this.setState({nameEditValue: event.target.value})
  }

  // onchange email edit value

  onChangeEmailEditValue = event => {
    this.setState({emailEditValue: event.target.value})
  }

  // onchange role edit value

  onChangeRoleEditValue = event => {
    this.setState({roleEditValue: event.target.value})
  }

  // onclick edit btn
  onCLickEditBtn = id => {
    const {usersData} = this.state
    const user = usersData.filter(eachItem => eachItem.id === id)
    const {name, email, role} = user[0]
    this.setState({
      nameEditValue: name,
      emailEditValue: email,
      roleEditValue: role,
      userIdToEdit: id,
    })
  }

  // onclick Delete icon btn
  onClickDeleteIconBtn = id => {
    const {usersData} = this.state
    const updatedData = usersData.filter(eachItem => eachItem.id !== id)
    const pageCount = Math.ceil(updatedData.length / 10)
    this.updatePageNumbersList(pageCount)
    this.setState({usersData: updatedData, pageCount})
  }

  // onClick Delete Selected
  onClickDeleteSelected = () => {
    const {selectedUsers, usersData, searchInput} = this.state

    const updatedUsersData = usersData.filter(
      eachItem => selectedUsers.includes(eachItem.id) === false,
    )

    if (searchInput !== '') {
      const filteredData = this.getFilteredData(searchInput, updatedUsersData)
      const pageCount = Math.ceil(filteredData.length / 10)
      this.updatePageNumbersList(pageCount)
      this.setState({
        usersData: updatedUsersData,
        pageCount,
      })
    } else {
      const pageCount = Math.ceil(updatedUsersData.length / 10)
      this.updatePageNumbersList(pageCount)
      this.setState({usersData: updatedUsersData, pageCount})
    }

    this.setState({isSelectAllChecked: false})
  }

  getPageNumbersListByRange = () => {
    const {pageNumbersList, pageRangeStartIndex, pageRangeEndIndex} = this.state
    return pageNumbersList.slice(pageRangeStartIndex, pageRangeEndIndex)
  }

  // On Selecting checkBox of an item
  onClickSelect = (id, isChecked) => {
    const {selectedUsers} = this.state
    if (isChecked) {
      selectedUsers.push(id)
    } else {
      const index = selectedUsers.indexOf(id)
      selectedUsers.splice(index, 1)
    }

    this.setState({selectedUsers})
  }

  // On clicking select all
  onSelectAll = event => {
    const {lowerLimit, upperLimit, usersData, searchInput} = this.state
    if (searchInput !== '') {
      if (event.target.checked) {
        const filteredData = this.getFilteredData(searchInput, usersData)
        const selectedUsersData = filteredData.slice(lowerLimit, upperLimit)
        const selectedUsersIds = []
        selectedUsersData.forEach(eachObj => {
          selectedUsersIds.push(eachObj.id)
        })
        this.setState({
          selectedUsers: selectedUsersIds,
          isSelectAllChecked: true,
        })
      } else {
        this.setState({selectedUsers: [], isSelectAllChecked: false})
      }
    }

    if (searchInput === '') {
      if (event.target.checked) {
        const selectedUsersData = usersData.slice(lowerLimit, upperLimit)
        const selectedUsersIds = []
        selectedUsersData.forEach(eachObj => {
          selectedUsersIds.push(eachObj.id)
        })
        this.setState({
          selectedUsers: selectedUsersIds,
          isSelectAllChecked: true,
        })
      } else {
        this.setState({selectedUsers: [], isSelectAllChecked: false})
      }
    }
  }

  // OnClick Prev button in pagination
  onClickPrevBtn = () => {
    const {currentPage} = this.state

    if (currentPage > 4 && (currentPage - 1) % 4 === 0) {
      this.setState(prevState => ({
        pageRangeStartIndex: prevState.pageRangeStartIndex - 4,
        pageRangeEndIndex: prevState.pageRangeEndIndex - 4,
        currentPage: prevState.currentPage - 1,
        upperLimit: prevState.upperLimit - 10,
        lowerLimit: prevState.lowerLimit - 10,
      }))
    } else {
      this.setState(prevState => ({
        currentPage: prevState.currentPage - 1,
        upperLimit: prevState.upperLimit - 10,
        lowerLimit: prevState.lowerLimit - 10,
      }))
    }

    this.setState({selectedUsers: []})
  }

  // OnClick Next button in pagination
  onClickNextBtn = () => {
    const {currentPage, pageCount} = this.state
    if (currentPage < pageCount && currentPage % 4 === 0) {
      this.setState(prevState => ({
        pageRangeStartIndex: prevState.pageRangeStartIndex + 4,
        pageRangeEndIndex: prevState.pageRangeEndIndex + 4,
        currentPage: prevState.currentPage + 1,
        upperLimit: prevState.upperLimit + 10,
        lowerLimit: prevState.lowerLimit + 10,
      }))
    } else {
      this.setState(prevState => ({
        currentPage: prevState.currentPage + 1,
        upperLimit: prevState.upperLimit + 10,
        lowerLimit: prevState.lowerLimit + 10,
      }))
    }
    this.setState({selectedUsers: []})
  }

  // Updating currentPage on clicking a page button in pagination
  onClickPaginationBtn = page => {
    const lowerLimit = page * 10 - 10
    const upperLimit = page * 10
    const selectedUsers = []
    this.setState({currentPage: page, lowerLimit, upperLimit, selectedUsers})
  }

  // Updating pagesNumbersList of pagination in state,which is an array which contains number of pages
  updatePageNumbersList = pageCount => {
    const pageNumbersList = []
    for (let i = 1; i <= pageCount; i += 1) {
      pageNumbersList.push(i)
    }
    this.setState({pageNumbersList})
  }

  // Getting Users Data from API
  getUsersData = async () => {
    const response = await fetch(
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json',
    )
    const data = await response.json()
    const pageCount = Math.ceil(data.length / 10)
    this.updatePageNumbersList(pageCount)

    this.setState({usersData: data, pageCount})
  }

  // Updating pageCount which contains number of pages
  onChangeSearchInput = event => {
    const {usersData} = this.state
    const filteredData = usersData.filter(
      eachObj =>
        eachObj.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        eachObj.email
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        eachObj.role.toLowerCase().includes(event.target.value.toLowerCase()),
    )

    const pageCount = Math.ceil(filteredData.length / 10)
    this.updatePageNumbersList(pageCount)

    this.setState({searchInput: event.target.value, pageCount})
  }

  // Getting Filtered Data based on search input
  getFilteredData = (searchInput, usersData) => {
    const filteredData = usersData.filter(
      eachObj =>
        eachObj.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        eachObj.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        eachObj.role.toLowerCase().includes(searchInput.toLowerCase()),
    )
    return filteredData
  }

  // Function To Get Delete Btn
  getDeleteBtn = () => {
    const {pageCount} = this.state
    if (pageCount > 0) {
      return (
        <button
          type="button"
          className="delete-btn"
          onClick={this.onClickDeleteSelected}
        >
          Delete Selected
        </button>
      )
    }
    return null
  }

  // updating select all checkbox status
  selectAllCheckedStatus = () => {
    const {isSelectAllChecked} = this.state

    let isChecked
    if (isSelectAllChecked) {
      isChecked = 'checked'
    } else {
      isChecked = ''
    }
    return isChecked
  }

  render() {
    const {
      searchInput,
      currentPage,
      pageCount,
      selectedUsers,
      isSelectAllChecked,
      lowerLimit,
      upperLimit,
      usersData,
      nameEditValue,
      emailEditValue,
      roleEditValue,
    } = this.state

    const data = this.getFilteredData(searchInput, usersData).slice(
      lowerLimit,
      upperLimit,
    )

    const pageNumbersListByRange = this.getPageNumbersListByRange()

    return (
      <div className="admin-main-bg-container">
        <input
          type="search"
          className="search-bar"
          placeholder="Search by name, email or role"
          value={searchInput}
          onChange={this.onChangeSearchInput}
        />
        <div className="table-container">
          <table className="users-data-table">
            <thead>
              <tr className="table-headings-row">
                <th>
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={this.onSelectAll}
                    checked={this.selectAllCheckedStatus()}
                  />
                </th>
                <th className="table-heading">Name</th>
                <th className="table-heading">Email</th>
                <th className="table-heading">Role</th>
                <th className="table-heading">Action</th>
              </tr>

              <tr className="table-headings-row">
                <th>
                  <br />
                </th>
                <th className="table-heading">
                  <input
                    type="text"
                    className="edit-input-el"
                    placeholder="Select a user and edit name"
                    value={nameEditValue}
                    onChange={this.onChangeNameEditValue}
                  />
                </th>
                <th className="table-heading">
                  <input
                    type="text"
                    className="edit-input-el"
                    placeholder="Select a user and edit email"
                    value={emailEditValue}
                    onChange={this.onChangeEmailEditValue}
                  />
                </th>
                <th className="table-heading">
                  <input
                    type="text"
                    className="edit-input-el"
                    placeholder="Select a user and edit role"
                    value={roleEditValue}
                    onChange={this.onChangeRoleEditValue}
                  />
                </th>
                <th>
                  <button
                    type="button"
                    className="save-btn"
                    onClick={this.onClickSaveEdits}
                  >
                    Save
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map(eachItem => (
                <UserListItem
                  userData={eachItem}
                  key={eachItem.id}
                  onClickSelect={this.onClickSelect}
                  selectedUsers={selectedUsers}
                  isSelectAllChecked={isSelectAllChecked}
                  onClickDeleteIconBtn={this.onClickDeleteIconBtn}
                  onCLickEditBtn={this.onCLickEditBtn}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="delete-btn-pagination-container">
          {this.getDeleteBtn()}
          <Pagination
            pageCount={pageCount}
            onClickPaginationBtn={this.onClickPaginationBtn}
            currentPage={currentPage}
            pagesList={pageNumbersListByRange}
            onClickPrevBtn={this.onClickPrevBtn}
            onClickNextBtn={this.onClickNextBtn}
          />
        </div>
      </div>
    )
  }
}

export default AdminMain
