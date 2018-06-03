export default (props = {}) => {
  const onClick = props.onClick || ((href) => {
    window.location.href = href
  })

  return <div>
    <a target='_top' onClick={() => onClick('/login/facebook')} style={{ color: '#3b5998', marginRight: '0.5rem', cursor: 'pointer' }}><i className='fa fa-facebook-square fa-3x' /></a>
    <a target='_top' onClick={() => onClick('/login/twitter')} style={{ color: '#2fc2ef', marginRight: '0.5rem', cursor: 'pointer' }}><i className='fa fa-twitter-square fa-3x' /></a>
    <a target='_top' href='/auth/github' style={{ color: '#337ab7' }}><i className='fa fa-github fa-3x' /></a>
  </div>
}
