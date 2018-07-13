export function getQueryParameter (name) {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

export function removeFacebookQuery () {
  if (window.location.hash === '#_=_') {
    history.replaceState
      ? history.replaceState(null, null, window.location.href.split('#')[0])
      : window.location.hash = ''
  }
}

export function trim (str) {
  if (str.length > 30) {
    return str.substring(0, 25) + ' ...'
  }
  return str
}
