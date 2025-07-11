import { yupResolver } from '@hookform/resolvers/yup/src/yup.js'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object({
  username: yup
    .string()
    .required('El usuario es obligatorio'),
  password: yup
    .string()
    .min(6, 'Password no válido se necesitan 6 caracteres').required('El password es obligatorio'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contrasenas no coinciden')
    .required('Confirma tu contrasena')
})

const BasicForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm()
  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type='text' {...register('username')} placeholder='Usuario' />
      <input type='password' {...register('password')} placeholder='Contrasena' />
      <input type='password' {...register('confirmPassword')} placeholder='Confirmar Contrasena' />
      <button type='submit'>Enviar</button>
    </form>
  )
}

export default BasicForm
