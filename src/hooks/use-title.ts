import { useRef } from 'react'
import { useIsomorphicLayoutEffect, useUnmount } from 'usehooks-ts'
import { env } from '@/env'

interface UseDocumentTitleOptions {
  preserveTitleOnUnmount?: boolean
}

export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {},
): void {
  const { preserveTitleOnUnmount = true } = options
  const defaultTitle = useRef<string | null>(null)

  useIsomorphicLayoutEffect(() => {
    defaultTitle.current = window.document.title
  }, [])

  useIsomorphicLayoutEffect(() => {
    window.document.title = title + ' | ' + env.VITE_APP_TITLE
  }, [title])

  useUnmount(() => {
    if (!preserveTitleOnUnmount && defaultTitle.current) {
      window.document.title = defaultTitle.current
    }
  })
}
