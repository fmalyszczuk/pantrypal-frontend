import { useEffect, useState } from 'react'

// Persists state to localStorage under `key` so it survives page reloads
// (and switching away from and back to a tab, since that unmounts the page
// component too). Falls back to plain in-memory state if localStorage is
// unavailable — e.g. private browsing — so the UI still works either way.
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write failures (storage full, private mode, etc.) — the
      // page keeps working, it just won't persist across reloads.
    }
  }, [key, value])

  return [value, setValue]
}
