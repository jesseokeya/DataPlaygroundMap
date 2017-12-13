const socket = io();
$(document).ready(() => {
  socket.on('tableData', (result) => {
    const tableData = {
      body: JSON.parse(result.data),
      headers: result.headers
    }
    appendTableHeaders(tableData.headers)
    appendTableRows(tableData.body)
    console.log(tableData);
  })
})

const appendTableHeaders = (headers) => {
  $('.thead-dark').empty();
  $('.thead-dark').append(getTableHeaders(headers));
}

const appendTableRows = (body) => {
  $('tbody').empty();
  $('tbody').append(getTableRows(body));
}

const getTableHeaders = (headers) => {
  let th = [];
  for (let i in headers) {
    th.push(`<th scope="col">${headers[i]}</th>`)
  }
  return `<tr>
  <th scope="col">#</th>${th}</tr>`
}

const getTableRows = (bodies) => {
  let th = '';
  let td = '';
  let result = [];
  for (let i in bodies) {
    th = `<th scope="row">
            <span class="badge badge-dark text-white">${parseInt(i) + 1}</span>
          </th>`;
    for (j in bodies[i]) {
      td += `<td>${bodies[i][j]}</td>`;
    }
    result.push(`<tr>${th}${td}</tr>`);
    td = '';
  }
  return `${result}`
}
