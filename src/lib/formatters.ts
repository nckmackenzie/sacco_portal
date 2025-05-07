import { isAxiosError } from 'axios'

export const flattenErrors = (error: Record<string, Array<string>>) => {
  return Object.values(error).flat()
}

export function errorHandler(error: unknown) {
  if (isAxiosError(error)) {
    let errors = ''
    if (error.status === 422) {
      errors = flattenErrors(error.response?.data.errors).join('\n')
    } else if (error.status === 404) {
      throw new Error('Could not find the requested resource.')
    } else if (error.status === 302) {
      throw new Error(error.response?.data.message)
    } else if (error.status === 401) {
      window.location.pathname = '/login'
    } else {
      errors = error.response?.data.error
    }
    throw new Error(errors || 'An error occurred while performing this action.')
  } else {
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred.')
  }
}
