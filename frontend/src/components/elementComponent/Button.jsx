import styled from 'styled-components'
import { Link } from 'react-router-dom';

const AuthButtons = ({ text, link }) => {
  return (
    <ButtonLink to={link}>
      {text}
    </ButtonLink>
  )
}

const ButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 44px;
  padding: 10px 22px;
  background-color: #2A1F10;
  color: #fff;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #B8935A;
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    min-width: 0;
    flex: 1;
  }
`;


export default AuthButtons
