const sorting = {
  field: 'id',
  asc: true,
  columns: {
    id: 'asc',
    fullname: 'desc',
    createdAt: 'desc',
    updatedAt: 'desc'
  }
}

function showError(data) {
  const form = document.querySelector('form')
  const errorsBox = document.createElement('div')
  errorsBox.classList.add('errors-box')
  if (data.errors && data.errors.length) {
    for (const err of data.errors) {
      const errorItem = document.createElement('p')
      errorItem.classList.add('error-message')
      errorItem.textContent = 'Ошибка: ' + err.message
      errorsBox.append(errorItem)
    }
  } else if (data.message) {
    const errorItem = document.createElement('p')
    errorItem.classList.add('error-message')
    errorItem.textContent = 'Ошибка: ' + data.message
    errorsBox.append(errorItem)
  }
  form.insertBefore(errorsBox, form.querySelector('.btn-group'))
}

function showFormValidateError(error) {
  const form = document.querySelector('form')
  const errorsBox = document.createElement('div')
  errorsBox.classList.add('errors-box')
  const message = document.querySelector('.error-message')

  message && message.remove()
  
  const errorItem = document.createElement('p')
  errorItem.classList.add('error-message')
  errorItem.textContent = error
  errorsBox.append(errorItem)

  form.insertBefore(errorsBox, form.querySelector('.btn-group'))
}

async function loadClients() {
  const response = await fetch('http://localhost:3000/api/clients')
  const clients = await response.json()

  return clients
}

async function addNewClient(client) {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify(client),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if (!response.ok) {
    showError(data)
  }
}

async function getClientInfo(clientId) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()

  return data
}

async function saveClientInfo(client) {
  const response = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
    method: 'PATCH',
    body: JSON.stringify(client),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if (!response.ok) {
    showError(data)
  }
}

async function deleteClient(clientId) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if (!response.ok) {
    showError(data)
  }
}

async function searchClients(value) {
  const response = await fetch(`http://localhost:3000/api/clients?search=${value}`)
  const clients = await response.json()

  return clients
}

function createColumnTitle(title, dir, addHtml = '') {
  return dir === 'asc' ?
    `${title}<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g clip-path="url(#clip0_224_2092)">
        <path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/>
      </g>
      <defs>
        <clipPath id="clip0_224_2092">
          <rect width="12" height="12" fill="white" transform="translate(12 12) rotate(-180)"/>
        </clipPath>
      </defs>
    </svg>${addHtml}`
    :
    `${title}<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g clip-path="url(#clip0_224_2095)">
        <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/>
      </g>
      <defs>
        <clipPath id="clip0_224_2095">
          <rect width="12" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>${addHtml}`
}

function createTableHead(clientsList) {
  const row = document.createElement('tr')
  const columnId = document.createElement('th')
  columnId.classList.add('table__column')
  columnId.innerHTML = createColumnTitle('ID', sorting.columns.id)

  if (sorting.field === 'id') {
    columnId.style.color = 'var(--firm, #9873FF)'
  }

  columnId.addEventListener('click', () => {
    const container = document.getElementById('container')
    const table = document.querySelector('table')

    if (sorting.field !== 'id')
      sorting.asc = true
    else
      sorting.asc = !sorting.asc

    sorting.field = 'id'
    sorting.columns.id = sorting.asc ? 'asc' : 'desc'

    const sortedClients = sortClients(clientsList, 'id', sorting.asc)
    const clientsTable = createTable(sortedClients)
    table.remove()
    container.insertBefore(clientsTable, container.querySelector('button'))
  })
  row.append(columnId)

  const fullnameCol = document.createElement('th')
  fullnameCol.classList.add('table__column')
  fullnameCol.innerHTML = createColumnTitle('Фамилия Имя Отчество', sorting.columns.fullname,
    `<svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.37109 8L4.6582 6.01758H1.92871L1.23047 8H0L2.6709 0.832031H3.94043L6.61133 8H5.37109ZM4.35059 5.01172L3.68164 3.06836C3.63281 2.93815 3.56445 2.73307 3.47656 2.45312C3.39193 2.17318 3.33333 1.9681 3.30078 1.83789C3.21289 2.23828 3.08431 2.67611 2.91504 3.15137L2.27051 5.01172H4.35059ZM6.96289 5.80762V4.83105H9.47266V5.80762H6.96289ZM13.0322 5.13867L11.2646 8H9.93164L11.9434 4.87012C11.0319 4.55436 10.5762 3.8903 10.5762 2.87793C10.5762 2.22363 10.8024 1.72396 11.2549 1.37891C11.7074 1.03385 12.373 0.861328 13.252 0.861328H15.3955V8H14.2236V5.13867H13.0322ZM14.2236 1.83789H13.2959C12.8044 1.83789 12.4268 1.92578 12.1631 2.10156C11.9027 2.27409 11.7725 2.55729 11.7725 2.95117C11.7725 3.33529 11.8994 3.63477 12.1533 3.84961C12.4072 4.06445 12.8011 4.17188 13.335 4.17188H14.2236V1.83789Z" fill="#9873FF"/>
      </svg>
    `)

  if (sorting.field === 'fullname') {
    fullnameCol.style.color = 'var(--firm, #9873FF)'
  }

  fullnameCol.addEventListener('click', () => {
    const container = document.getElementById('container')
    const table = document.querySelector('table')

    if (sorting.field !== 'fullname')
      sorting.asc = true
    else
      sorting.asc = !sorting.asc

    sorting.field = 'fullname'
    sorting.columns.fullname = sorting.asc ? 'asc' : 'desc'

    for (let i = 0; i < clientsList.length; i++) {
      for (let j = 0; j < clientsList.length - 1; j++) {
        if (sorting.asc) {
          if (clientsList[j].surname + " " + clientsList[j].name + " " + clientsList[j].lastname >
            clientsList[j + 1].surname + " " + clientsList[j + 1].name + " " + clientsList[j + 1].lastname) {
            const temp = clientsList[j]
            clientsList[j] = clientsList[j + 1]
            clientsList[j + 1] = temp
          }
        } else if (clientsList[j].surname + " " + clientsList[j].name + " " + clientsList[j].lastname <
          clientsList[j + 1].surname + " " + clientsList[j + 1].name + " " + clientsList[j + 1].lastname) {
          const temp = clientsList[j]
          clientsList[j] = clientsList[j + 1]
          clientsList[j + 1] = temp
        }
      }
    }

    const clientsTable = createTable(clientsList)
    table.remove()
    container.insertBefore(clientsTable, container.querySelector('button'))
  })
  row.append(fullnameCol)

  const createdAtCol = document.createElement('th')
  createdAtCol.classList.add('table__column')
  createdAtCol.innerHTML = createColumnTitle('Дата и время создания', sorting.columns.createdAt)

  if (sorting.field === 'createdAt') {
    createdAtCol.style.color = 'var(--firm, #9873FF)'
  }

  createdAtCol.addEventListener('click', () => {
    const container = document.getElementById('container')
    const table = document.querySelector('table')

    if (sorting.field !== 'createdAt')
      sorting.asc = true
    else
      sorting.asc = !sorting.asc

    sorting.field = 'createdAt'
    sorting.columns.createdAt = sorting.asc ? 'asc' : 'desc'

    const sortedClients = sortClients(clientsList, 'createdAt', sorting.asc)
    const clientsTable = createTable(sortedClients)
    table.remove()
    container.insertBefore(clientsTable, container.querySelector('button'))
  })
  row.append(createdAtCol)

  const updatedAtCol = document.createElement('th')
  updatedAtCol.classList.add('table__column')
  updatedAtCol.innerHTML = createColumnTitle('Последние изменения', sorting.columns.updatedAt)

  if (sorting.field === 'updatedAt') {
    updatedAtCol.style.color = 'var(--firm, #9873FF)'
  }

  updatedAtCol.addEventListener('click', () => {
    const container = document.getElementById('container')
    const table = document.querySelector('table')

    if (sorting.field !== 'updatedAt')
      sorting.asc = true
    else
      sorting.asc = !sorting.asc

    sorting.field = 'updatedAt'
    sorting.columns.updatedAt = sorting.asc ? 'asc' : 'desc'

    const sortedClients = sortClients(clientsList, 'updatedAt', sorting.asc)
    const clientsTable = createTable(sortedClients)
    table.remove()
    container.insertBefore(clientsTable, container.querySelector('button'))
  })
  row.append(updatedAtCol)

  const contactsCol = document.createElement('th')
  contactsCol.classList.add('table__column')
  contactsCol.textContent = 'Контакты'
  row.append(contactsCol)

  const actionsCol = document.createElement('th')
  actionsCol.classList.add('table__column')
  actionsCol.textContent = 'Действия'
  row.append(actionsCol)

  const clientReferCol = document.createElement('th')
  clientReferCol.classList.add('table__column')
  clientReferCol.textContent = 'Ссылка на клиента'
  row.append(clientReferCol)

  return row
}

function formatRowDate(date) {
  return `${("0" + date.getDay()).slice(-2)}.${("0" + date.getMonth()).slice(-2)}.${date.getFullYear()}
    <span class="table__created-time">${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`
}

function createTableRow(client) {
  const row = document.createElement('tr')
  row.classList.add('table__row')
  const cellID = document.createElement('td')
  cellID.textContent = client.id
  row.append(cellID)
  const fullnameCell = document.createElement('td')
  fullnameCell.textContent = client.surname + " " + client.name + " " + client.lastName
  row.append(fullnameCell)
  const createdAtCell = document.createElement('td')
  const createdAtDate = new Date(client.createdAt)
  createdAtCell.innerHTML = formatRowDate(createdAtDate)
  row.append(createdAtCell)
  const updatedAtCell = document.createElement('td')
  const updatedAtDate = new Date(client.updatedAt)
  updatedAtCell.innerHTML = formatRowDate(updatedAtDate)
  row.append(updatedAtCell)
  const contactsCell = document.createElement('td')
  for (const contact of client.contacts) {
    const contactImage = document.createElement('span')
    contactImage.classList.add('contacts-icon')
    contactImage.setAttribute('data-bs-toggle', 'tooltip')
    contactImage.setAttribute('title', `${contact.type}: ${contact.value}`)
    new bootstrap.Tooltip(contactImage, {
      boundary: document.body
    })

    switch (contact.type) {
      case 'Телефон':
        contactImage.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g opacity="0.7">
              <circle cx="8" cy="8" r="8" fill="#9873FF"/>
              <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
            </g>
          </svg>`
        break;
      case 'Email':
        contactImage.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
          </svg>`
        break;
      case 'Vk':
        contactImage.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g opacity="0.7">
              <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
            </g>
          </svg>`
        break;
      case 'Facebook':
        contactImage.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g opacity="0.7">
                <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
              </g>
            </svg>`
        break;
      default:
        contactImage.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g opacity="0.7">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
            </g>
          </svg>`
        break;
    }
    contactsCell.append(contactImage)
  }
  row.append(contactsCell)

  const actionsCell = document.createElement('td')
  const editClientBtn = document.createElement('button')
  editClientBtn.classList.add('btn-reset', 'table__btn')
  editClientBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g opacity="0.7" clip-path="url(#clip0_224_2140)">
      <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
    </g>
    <defs>
      <clipPath id="clip0_224_2140">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>Изменить`
  editClientBtn.addEventListener('click', async () => {
    const clientData = await getClientInfo(client.id)
    createEditClientModal(clientData)
  })
  actionsCell.append(editClientBtn)

  const deleteClientBtn = document.createElement('button')
  deleteClientBtn.classList.add('btn-reset', 'table__btn')
  deleteClientBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g opacity="0.7" clip-path="url(#clip0_224_2145)">
      <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
    </g>
    <defs>
      <clipPath id="clip0_224_2145">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>Удалить`
  deleteClientBtn.addEventListener('click', () => {
    createDeleteClientModal(client.id)
  })
  actionsCell.append(deleteClientBtn)
  row.append(actionsCell)

  const clientReferCell = document.createElement('td')
  clientReferCell.innerHTML = `<a href="#client-${client.id}" class="table__link">Ссылка</a>`
  row.append(clientReferCell)

  return row
}

function createTable(clientsList) {
  const tableWrapper = document.createElement('div')
  tableWrapper.classList.add('table-wrapper')
  const tableElement = document.createElement('table')
  tableElement.classList.add('table')
  const tableHead = createTableHead(clientsList)
  tableElement.append(tableHead)
  tableWrapper.append(tableElement)

  for (const client of clientsList) {
    const clientRow = createTableRow(client)
    tableElement.append(clientRow)
  }

  return tableWrapper
}

function createContactElement() {
  const contactItem = document.createElement('li')
  contactItem.classList.add('contacts-item')
  const contactTypeSelect = document.createElement('select')
  contactTypeSelect.classList.add('form__select')
  const contactTypesList = ['Телефон', 'Email', 'Vk', 'Facebook', 'Другое']

  for (const contactType of contactTypesList) {
    const option = document.createElement('option')
    option.textContent = contactType
    contactTypeSelect.append(option)
  }
  contactItem.append(contactTypeSelect)

  const contactValueInput = document.createElement('input')
  contactValueInput.classList.add('form__input', 'contacts-item__input')
  contactValueInput.placeholder = 'Введите данные контакта'
  contactItem.append(contactValueInput)

  const deleteContactBtn = document.createElement('button')
  deleteContactBtn.classList.add('btn-reset', 'contacts-item__btn')
  deleteContactBtn.innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clip-path="url(#clip0_224_6681)">
        <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"></path>
      </g>
      <defs>
        <clipPath id="clip0_224_6681">
          <rect width="16" height="16" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>`
  deleteContactBtn.addEventListener('click', () => {
    contactItem.remove()

    if (document.querySelectorAll('.contacts-item').length < 10) {
      document.querySelector('.add-contact-btn').style.display = 'block'
    }

    if (!document.querySelector('.contacts-item')) {
      document.querySelector('.contacts').style.padding = '8px 30px'
    }
  })
  contactItem.append(deleteContactBtn)

  return contactItem
}

function createClientModalLayout(title, client) {
  const modalEl = document.createElement('div')
  modalEl.classList.add('modal', 'fade')
  const modalElDialog = document.createElement('div')
  modalElDialog.classList.add('modal-dialog')
  modalEl.append(modalElDialog)
  const modalElContent = document.createElement('div')
  modalElContent.classList.add('modal-content')
  modalElDialog.append(modalElContent)

  const modalHeader = document.createElement('div')
  modalHeader.classList.add('modal-header')
  if (!client) {
    modalHeader.style.paddingBottom = '32px'
  }
  const modalTitle = document.createElement('h5')
  modalTitle.classList.add('modal-title')
  modalTitle.textContent = title
  modalHeader.append(modalTitle)
  const modalCloseBtn = document.createElement('button')
  modalCloseBtn.classList.add('btn-close')
  modalCloseBtn.setAttribute('data-bs-dismiss', 'modal')
  modalHeader.append(modalCloseBtn)
  modalElContent.append(modalHeader)

  const modalElBody = document.createElement('div')
  modalElBody.classList.add('modal-body')
  modalElContent.append(modalElBody)
  const modalElFooter = document.createElement('div')
  modalElFooter.classList.add('modal-footer')
  modalElContent.append(modalElFooter)
  modalEl.append(modalElDialog)

  modalEl.addEventListener('hidden.bs.modal', function (event) {
    modalEl.remove()
  })

  const modal = new bootstrap.Modal(modalEl)
  modal.show()

  const form = createModalForm(client, modal)
  modalEl.querySelector('.modal-footer').append(form.btnGroup)
  modalEl.querySelector('.modal-body').append(form.form)

  if (!client) {
    form.btnGroup.querySelector('#cancelBtn').addEventListener('click', () => {
      modal.hide()
    })
  }

  return modalEl
}

function createModalForm(client, modal) {
  const form = document.createElement('form')
  const formMainInfo = document.createElement('div')
  formMainInfo.classList.add('form__main-info')

  if (client) {
    form.id = 'editClientForm'
    const surnameLabel = document.createElement('label')
    surnameLabel.classList.add('form__label')
    surnameLabel.innerHTML = 'Фамилия<span>*</span'
    const surnameInput = document.createElement('input')
    surnameInput.id = 'surnameField'
    surnameInput.classList.add('form__input')
    surnameInput.value = client.surname
    surnameInput.placeholder = 'Фамилия'
    surnameInput.required = true
    surnameLabel.append(surnameInput)
    formMainInfo.append(surnameLabel)

    const nameLabel = document.createElement('label')
    nameLabel.classList.add('form__label')
    nameLabel.innerHTML = 'Имя<span>*</span'
    const nameInput = document.createElement('input')
    nameInput.id = 'nameField'
    nameInput.classList.add('form__input')
    nameInput.value = client.name
    nameInput.placeholder = 'Имя'
    nameInput.required = true
    nameLabel.append(nameInput)
    formMainInfo.append(nameLabel)

    const lastnameLabel = document.createElement('label')
    lastnameLabel.classList.add('form__label')
    lastnameLabel.innerHTML = 'Отчество'
    const lastnameInput = document.createElement('input')
    lastnameInput.id = 'lastNameField'
    lastnameInput.classList.add('form__input')
    lastnameInput.value = client.lastName
    lastnameInput.placeholder = 'Отчество'
    lastnameLabel.append(lastnameInput)
    formMainInfo.append(lastnameLabel)
    form.append(formMainInfo)
  } else {
    form.id = 'addNewClientForm'
    const surnameInput = document.createElement('input')
    surnameInput.id = 'surnameField'
    surnameInput.classList.add('form__input', 'form__input-margin')
    surnameInput.placeholder = 'Фамилия*'
    surnameInput.required = true
    formMainInfo.append(surnameInput)

    const nameInput = document.createElement('input')
    nameInput.id = 'nameField'
    nameInput.classList.add('form__input', 'form__input-margin')
    nameInput.placeholder = 'Имя*'
    nameInput.required = true
    formMainInfo.append(nameInput)

    const lastnameInput = document.createElement('input')
    lastnameInput.id = 'lastNameField'
    lastnameInput.classList.add('form__input')
    lastnameInput.placeholder = 'Отчество'
    formMainInfo.append(lastnameInput)
  }
  form.append(formMainInfo)

  const contactsBox = document.createElement('div')
  contactsBox.classList.add('contacts')
  const contactsList = document.createElement('ul')
  contactsList.classList.add('contacts__list', 'list-reset')
  contactsBox.append(contactsList)
  form.append(contactsBox)

  if (client && client.contacts) {
    for (const contact of client.contacts) {
      const contactEl = createContactElement()
      contactEl.querySelector('input').value = contact.value
      const options = contactEl.querySelectorAll('option')
      for (const opt of options) {
        if (opt.innerText === contact.type)
          opt.selected = true
      }
      contactsList.append(contactEl)
    }
    contactsBox.style.padding = '25px 30px'
  }

  const addContactBtn = document.createElement('button')
  addContactBtn.classList.add('btn-reset', 'add-contact-btn')
  addContactBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clip-path="url(#clip0_224_3502)">
        <path d="M7.99998 4.66671C7.63331 4.66671 7.33331 4.96671 7.33331 5.33337V7.33337H5.33331C4.96665 7.33337 4.66665 7.63337 4.66665 8.00004C4.66665 8.36671 4.96665 8.66671 5.33331 8.66671H7.33331V10.6667C7.33331 11.0334 7.63331 11.3334 7.99998 11.3334C8.36665 11.3334 8.66665 11.0334 8.66665 10.6667V8.66671H10.6666C11.0333 8.66671 11.3333 8.36671 11.3333 8.00004C11.3333 7.63337 11.0333 7.33337 10.6666 7.33337H8.66665V5.33337C8.66665 4.96671 8.36665 4.66671 7.99998 4.66671ZM7.99998 1.33337C4.31998 1.33337 1.33331 4.32004 1.33331 8.00004C1.33331 11.68 4.31998 14.6667 7.99998 14.6667C11.68 14.6667 14.6666 11.68 14.6666 8.00004C14.6666 4.32004 11.68 1.33337 7.99998 1.33337ZM7.99998 13.3334C5.05998 13.3334 2.66665 10.94 2.66665 8.00004C2.66665 5.06004 5.05998 2.66671 7.99998 2.66671C10.94 2.66671 13.3333 5.06004 13.3333 8.00004C13.3333 10.94 10.94 13.3334 7.99998 13.3334Z" fill="#9873FF"/>
      </g>
      <defs>
        <clipPath id="clip0_224_3502">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>Добавить контакт`
  // addContactBtn.textContent = 'Добавить контакт'
  addContactBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const newContactBox = createContactElement()
    contactsList.append(newContactBox)
    contactsBox.style.padding = '25px 30px'

    if (document.querySelectorAll('.contacts-item').length >= 10) {
      addContactBtn.style.display = 'none'
    }
  })
  contactsBox.append(addContactBtn)

  if (client && client.contacts && client.contacts.length >= 10) {
    addContactBtn.style.display = 'none'
  }

  const btnGroup = document.createElement('div')
  btnGroup.classList.add('btn-group')

  const saveClientBtn = document.createElement('button')
  saveClientBtn.classList.add('btn-reset', 'form__btn-primary')
  saveClientBtn.textContent = 'Сохранить'
  saveClientBtn.addEventListener('click', (e) => {  
    e.preventDefault()

    let clientName = document.getElementById('nameField').value.trim()
    let clientSurname = document.getElementById('surnameField').value.trim()
    let clientLastname = document.getElementById('lastNameField').value.trim()
    const contactsItems = document.querySelectorAll('.contacts-item')
    const contactsList = []

    if (!clientName) {
      document.getElementById('nameField').classList.add('form-error')
    }
    
    if (!clientSurname) {
      document.getElementById('surnameField').classList.add('form-error')
    }

    if (!clientName || !clientSurname) {
      showFormValidateError('Имя и фамилия обязательны для заполнения')
      return
    } 

    for (const contactItem of contactsItems) {
      const contactType = contactItem.querySelector('select').value;
      const contactVal = contactItem.querySelector('input').value.trim();
      if (!contactVal) {
        contactItem.classList.add('form-error')
        showFormValidateError('Каждый добавленный контакт должен быть полностью заполнен')
        return
      }
      else {
        contactsList.push({ type: contactType, value: contactVal })
      }
    }

    clientName = uppercaseFirst(clientName)
    clientSurname = uppercaseFirst(clientSurname)
    clientLastname = uppercaseFirst(clientLastname)

    const clientData = {
      id: client && client.id,
      name: clientName,
      surname: clientSurname,
      lastName: clientLastname,
      contacts: contactsList
    }

    client ? saveClientInfo(clientData) : addNewClient(clientData)
  })
  btnGroup.append(saveClientBtn)

  if (client) {
    const removeClientBtn = document.createElement('button')
    removeClientBtn.classList.add('btn-reset', 'form__btn-secondary')
    removeClientBtn.textContent = 'Удалить клиента'
    removeClientBtn.addEventListener('click', (e) => {
      createDeleteClientModal(client.id)
      modal.hide()
    })
    btnGroup.append(removeClientBtn)
  } else {
    const cancelBtn = document.createElement('button')
    cancelBtn.classList.add('btn-reset', 'form__btn-secondary')
    cancelBtn.id = 'cancelBtn'
    cancelBtn.textContent = 'Отмена'
    btnGroup.append(cancelBtn)
  }
  
  form.querySelectorAll('.form__input').forEach(el => el.addEventListener('input', (e) => {
    e.target.classList.remove('form-error')
    e.target.parentNode.classList.remove('form-error')
  }))

  return ({ form, btnGroup })
}

function uppercaseFirst(str) {
  return str[0].toUpperCase() + str.slice(1)
}

function createNewClientModal() {
  createClientModalLayout('Новый клиент')
}

function createEditClientModal(client) {
  createClientModalLayout('Изменить данные', client)
}

function createDeleteClientModal(clientId) {
  const modalEl = document.createElement('div')
  modalEl.classList.add('modal')
  const modalElDialog = document.createElement('div')
  modalElDialog.classList.add('modal-dialog')
  modalEl.append(modalElDialog)
  const modalElContent = document.createElement('div')
  modalElContent.classList.add('modal-content')
  modalElDialog.append(modalElContent)
  modalEl.append(modalElDialog)

  const modalHeader = document.createElement('div')
  modalHeader.classList.add('modal-header')

  const modalTitle = document.createElement('h5')
  modalTitle.classList.add('modal-title', 'modal-title_text-center')
  modalTitle.textContent = 'Удалить клиента'
  modalHeader.append(modalTitle)

  const modalCloseBtn = document.createElement('button')
  modalCloseBtn.classList.add('btn-close')
  modalCloseBtn.setAttribute('data-bs-dismiss', 'modal')
  modalHeader.append(modalCloseBtn)

  modalElContent.append(modalHeader)

  const modalElBody = document.createElement('div')
  modalElBody.classList.add('modal-body')
  const bodyText = document.createElement('p')
  bodyText.classList.add('modal-body__text')
  bodyText.innerText = 'Вы действительно хотите удалить данного клиента?'
  modalElBody.append(bodyText)
  modalElContent.append(modalElBody)

  const modalElFooter = document.createElement('div')
  modalElFooter.classList.add('modal-footer')
  modalElContent.append(modalElFooter)

  const btnGroup = document.createElement('div')
  btnGroup.classList.add('btn-group')

  const deleteClientBtn = document.createElement('button')
  deleteClientBtn.classList.add('btn-reset', 'form__btn-primary')
  deleteClientBtn.textContent = 'Удвлить'
  deleteClientBtn.addEventListener('click', () => {
    deleteClient(clientId)
  })
  btnGroup.append(deleteClientBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.classList.add('btn-reset', 'form__btn-secondary')
  cancelBtn.id = 'cancelBtn'
  cancelBtn.textContent = 'Отмена'
  btnGroup.append(cancelBtn)

  modalElFooter.append(btnGroup)

  const modal = new bootstrap.Modal(modalEl)
  modalEl.addEventListener('hidden.bs.modal', function (event) {
    modalEl.remove()
  })
  modal.show()

  cancelBtn.addEventListener('click', () => {
    modal.hide()
  })

  return modalEl
}

function createLoading() {
  const loadingBox = document.createElement('div')
  loadingBox.classList.add('loading-box')
  const loadingCaption = document.createElement('span')
  loadingCaption.textContent = 'Подождите, идeт загрузка...'
  loadingBox.append(loadingCaption)

  return loadingBox
}

function sortClients(clientsList, field, asc) {
  for (let i = 0; i < clientsList.length; i++) {
    for (let j = 0; j < clientsList.length - 1; j++) {
      if (asc) {
        if (clientsList[j][field] > clientsList[j + 1][field]) {
          const temp = clientsList[j]
          clientsList[j] = clientsList[j + 1]
          clientsList[j + 1] = temp
        }
      } else if (clientsList[j][field] < clientsList[j + 1][field]) {
        const temp = clientsList[j]
        clientsList[j] = clientsList[j + 1]
        clientsList[j + 1] = temp
      }
    }
  }

  return clientsList
}

async function showClientInfoModal() {
  const { hash } = location
  const clientId = hash.replace('#client-', '')

  if (clientId) {
    const clientsList = await loadClients()

    const clientData = clientsList.filter(client => {
      return client.id === clientId
    })

    createEditClientModal(clientData[0])  
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('container')
  const loading = createLoading()
  container.append(loading)
  const clientsList = await loadClients()
  loading.remove()
  const sortedClients = sortClients(clientsList, 'id', true)
  const clientsTable = createTable(sortedClients)
  container.append(clientsTable)
  const addNewClientBtn = document.createElement('button')
  addNewClientBtn.classList.add('btn-reset', 'main__btn')
  addNewClientBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="16" viewBox="0 0 23 16" fill="none">
    <path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill="#9873FF"/>
  </svg>Добавить клиента`
  addNewClientBtn.addEventListener('click', createNewClientModal)
  container.append(addNewClientBtn)

  const search = document.getElementById('search')
  search.addEventListener('input', () => {
    setTimeout(async () => {
      const searchResult = await searchClients(search.value.trim())
      const clientsTable = createTable(searchResult)
      document.querySelector('table').remove()
      container.insertBefore(clientsTable, container.querySelector('button'))
    }, 300)
  })
})

window.addEventListener('hashchange', showClientInfoModal)
window.onload = showClientInfoModal