$(document).ready(() => {
  const currentUrlPath = window.location.pathname;

  if (currentUrlPath === '/') {
    $('.index').addClass('active')
  }

  if (currentUrlPath === '/map') {
    $('.map-main').addClass('active')
  }

  if (currentUrlPath === '/table') {
    $('.table').addClass('active')
  }
})
