import { useForm } from 'react-hook-form'

const BasicForm = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type='text' {...register('username')} placeholder='Usuario' />
      <input type='password' {...register('password')} placeholder='Contrasena' />
      <button type='submit'>Enviar</button>
    </form>
  )
}

export default BasicForm
