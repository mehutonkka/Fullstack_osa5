import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  background: #cc8625;
  color: white;
  border-radius: 10px;
`

export const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    color : #94631d;
  }
`

export const NavUser = styled.span`
  margin-left: auto;
`

export const LogoutButton = styled.button`
  margin-left: 8px;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  background: white;
  color: #cc8625;
  cursor: pointer;

  &:hover {
    background: #94631d;;
  }
`
