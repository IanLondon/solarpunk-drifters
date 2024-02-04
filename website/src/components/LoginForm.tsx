'use client'
import * as React from 'react'
import {
  useCreateUserMutation,
  useGetUserDataQuery,
  useLoginMutation
} from '../lib/redux'
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { type SerializedError } from '@reduxjs/toolkit'

interface FieldProps extends React.ComponentProps<'input'> {
  label: React.ReactNode
  id: string
}

export function Field(props: FieldProps): React.ReactNode {
  const { label, ...inputProps } = props
  return (
    <div className='mb-4'>
      <label className='mb-1 block font-bold' htmlFor={inputProps.id}>
        {label}
      </label>
      <input
        {...inputProps}
        className={
          'rounded-lg border border-amber-500 bg-amber-900 p-2 focus:ring-amber-100'
        }
      />
    </div>
  )
}

interface LoginFormData {
  username: string
  password: string
}

type LoginFormType = 'CREATE_USER' | 'LOGIN'

interface LoginFormProps {
  handleFormSubmit: (data: LoginFormData) => void
  formType: LoginFormType
}

function LoginForm(props: LoginFormProps): React.ReactNode {
  const { handleFormSubmit } = props

  let buttonText = ''
  if (props.formType === 'CREATE_USER') {
    buttonText = 'Create User'
  } else if (props.formType === 'LOGIN') {
    buttonText = 'Log In'
  } else {
    props.formType satisfies never
    console.error('unhandled login formType: ', props.formType)
  }

  const submit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const pojo = Object.fromEntries(formData)
      if (
        typeof pojo.username === 'string' &&
        typeof pojo.password === 'string'
      ) {
        handleFormSubmit({
          username: pojo.username,
          password: pojo.password
        })
      } else {
        console.error('invalid form input', pojo)
      }
    },
    [handleFormSubmit]
  )
  return (
    <form onSubmit={submit}>
      <Field
        autoComplete='username'
        id={`${props.formType}-username`}
        label='Username'
        name='username'
      />
      <Field
        autoComplete='password'
        id={`${props.formType}-password`}
        label='Password'
        name='password'
        type='password'
      />
      <button className='mt-2 w-full rounded-lg bg-amber-500 p-2 font-bold'>
        {buttonText}
      </button>
    </form>
  )
}

// TODO: less hacky implementation
export function extractBaseQueryErrorMessage(
  error: FetchBaseQueryError | SerializedError
): string | null {
  if (
    typeof error === 'object' &&
    error !== undefined &&
    'status' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  ) {
    return error.data.message
  }
  return null
}

export function ConnectedLoginForm(props: {
  handleRegisterLinkClick: () => void
}): React.ReactNode {
  const [login, result] = useLoginMutation()

  const errorComponent = result.isError ? (
    <div className='text-xl font-bold italic text-amber-200'>
      {extractBaseQueryErrorMessage(result.error) ?? '???'}
    </div>
  ) : null

  return (
    <article>
      {errorComponent}
      <LoginForm
        formType='LOGIN'
        handleFormSubmit={(data) => {
          login(data).catch((err) => {
            console.error('login mutation error', err)
          })
        }}
      />
      <div>
        No account?{' '}
        <a
          href='#'
          onClick={props.handleRegisterLinkClick}
          className='font-bold text-amber-300 underline'
        >
          Register.
        </a>
      </div>
    </article>
  )
}

export function ConnectedCreateUserForm(props: {
  handleCreateUser: () => void
}): React.ReactNode {
  const [createUser, result] = useCreateUserMutation()

  const errorComponent = result.isError ? (
    <div className='text-xl font-bold italic text-amber-200'>
      {extractBaseQueryErrorMessage(result.error) ?? '???'}
    </div>
  ) : null

  return (
    <article>
      <div className='text-center text-2xl'>Create new user</div>
      {errorComponent}
      <LoginForm
        formType='CREATE_USER'
        handleFormSubmit={(data) => {
          createUser(data)
            .then((response) => {
              if (!('error' in response)) {
                props.handleCreateUser()
              }
            })
            .catch((err) => {
              console.error('create user mutation error', err)
            })
        }}
      />
    </article>
  )
}

export function LoadingLogin(): React.ReactNode {
  return (
    <div className='absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-slate-800/80'>
      <span className='text-center'>loading...</span>
    </div>
  )
}

export function ConnectedLoginOrCreate(): React.ReactNode {
  const { data, isFetching, isLoading } = useGetUserDataQuery()

  const [showRegisterForm, setShowRegisterForm] = React.useState<boolean>(false)

  const handleRegisterLinkClick = React.useCallback(() => {
    setShowRegisterForm(true)
  }, [])

  if (data !== undefined && data !== null) {
    return <div>{data.username}</div>
  }

  const form = showRegisterForm ? (
    <ConnectedCreateUserForm
      handleCreateUser={() => {
        setShowRegisterForm(false)
      }}
    />
  ) : (
    <ConnectedLoginForm handleRegisterLinkClick={handleRegisterLinkClick} />
  )
  return (
    <div className='relative p-8'>
      {isLoading || isFetching ? <LoadingLogin /> : null}
      {form}
    </div>
  )
}
