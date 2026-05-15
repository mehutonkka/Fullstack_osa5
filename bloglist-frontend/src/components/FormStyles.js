import styled from 'styled-components'

export const FormContainer = styled.div`
  max-width: 400px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f9f9f9;
`

export const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Label = styled.label`
  font-weight: 600;
`

export const Input = styled.input`
  padding: 15px;
  border: 1px solid #aaa;
  border-radius: 10px;
  font-size: 1.125rem;
`

export const Button = styled.button`
  width: fit-content;
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  background: #cc8625;
  color: white;
  cursor: pointer;

  &:hover {
    background: #94631d;
  }
`
