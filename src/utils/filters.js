export var DateTime = (val) => {
  let dd = new Date(val)
  return dd.getFullYear() + '-' + ((dd.getMonth() + 1) < 10 ? '0' +
    (dd.getMonth() + 1) : (dd.getMonth() + 1)) + '-' + (dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()) + ' ' +
    (dd.getHours() < 10 ? '0' + dd.getHours() : dd.getHours()) + ':' + (dd.getMinutes() < 10 ? '0' + dd.getMinutes() : dd.getMinutes())
}

export var DateNotTime = (val) => {
  let dd = new Date(val)
  return dd.getFullYear() + '-' + ((dd.getMonth() + 1) < 10 ? '0' +
    (dd.getMonth() + 1) : (dd.getMonth() + 1)) + '-' + (dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate())
}
