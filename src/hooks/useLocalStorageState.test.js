import { renderHook, act } from '@testing-library/react'
import { useLocalStorageState } from './useLocalStorageState.js'

beforeEach(() => {
  localStorage.clear()
})

test('reads the initial value when nothing is stored yet', () => {
  const { result } = renderHook(() => useLocalStorageState('test-key', ['a']))

  expect(result.current[0]).toEqual(['a'])
})

test('persists updates to localStorage under the given key', () => {
  const { result } = renderHook(() => useLocalStorageState('test-key', []))

  act(() => {
    result.current[1](['hello'])
  })

  expect(JSON.parse(localStorage.getItem('test-key'))).toEqual(['hello'])
})

test('reads a previously stored value on a fresh mount', () => {
  localStorage.setItem('test-key', JSON.stringify(['stored']))

  const { result } = renderHook(() => useLocalStorageState('test-key', []))

  expect(result.current[0]).toEqual(['stored'])
})
