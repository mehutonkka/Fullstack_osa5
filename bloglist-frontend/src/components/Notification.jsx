import styled from 'styled-components'

const NotificationBox = styled.div`
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #000000;
  border-radius: 10px;
  background: #cc8625;
  color: #393939;
  font-weight: 600;
`

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <NotificationBox>
      {message}
    </NotificationBox>
  )
}

export default Notification
