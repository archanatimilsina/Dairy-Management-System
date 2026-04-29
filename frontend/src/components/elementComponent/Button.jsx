import styled from 'styled-components'
import { Link } from 'react-router-dom';

const AuthButtons = ({text,link}) => {
  return (
  
      <ButtonLink href={link}>
         <InnerButton >
 {text}
         </InnerButton>
     </ButtonLink>
  )
}

const InnerButton=styled.button`
background-color: #7DAACB;
    color: white;
    border: none;
    width: 120px;
    height: 45px;
    border-radius: 15px;
    font-size: 1rem;
    margin-top: -13px;
    cursor: pointer;
    &:hover{
      transform: translateY(5px);
    }
`;
const ButtonLink= styled.a`
text-decoration: none;
color: white;

`;


export default AuthButtons