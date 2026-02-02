import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../../components/Navbar'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const removeItemMock = jest.fn()

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: removeItemMock,
      },
      writable: true,
    })
  })

  test('renders navbar without user', () => {
    window.localStorage.getItem.mockReturnValue(null)

    render(<Navbar />)

    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })

  test('renders navbar with logged-in user', () => {
    window.localStorage.getItem.mockReturnValue(
      JSON.stringify({ name: 'Abhinand' })
    )

    render(<Navbar />)

    expect(screen.getByText(/logout/i)).toBeInTheDocument()
  })

  test('logout clears localStorage and redirects', () => {
    window.localStorage.getItem.mockReturnValue(
      JSON.stringify({ name: 'Abhinand' })
    )

    render(<Navbar />)

    fireEvent.click(screen.getByText(/logout/i))

    expect(removeItemMock).toHaveBeenCalledWith('doubtBunk')
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
})