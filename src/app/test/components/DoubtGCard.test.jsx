import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DoubtGCard from '../../components/DoubtGCard'

// ✅ Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}))

describe('DoubtGCard', () => {
  const title = 'Guest Doubt'
  const description = 'Guest view description'
  const doubId = '456'

  const addSolutionMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // ✅ Mock fetch for useEffect
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ count: 2 }),
      })
    )
  })

  test('renders title and description', async () => {
    render(
      <DoubtGCard
        title={title}
        description={description}
        doubId={doubId}
        addSoltuion={addSolutionMock}
      />
    )

    // wait for effect to finish
    await screen.findByText(title)

    expect(screen.getByText(description)).toBeInTheDocument()
  })

  test('fetches and displays solution count', async () => {
    render(
      <DoubtGCard
        title={title}
        description={description}
        doubId={doubId}
        addSoltuion={addSolutionMock}
      />
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `/api/answers/count/${doubId}`,
        expect.any(Object)
      )
    })

    expect(await screen.findByText('2')).toBeInTheDocument()
  })

  test('Add Solution button triggers callback', async () => {
    render(
      <DoubtGCard
        title={title}
        description={description}
        doubId={doubId}
        addSoltuion={addSolutionMock}
      />
    )

    await screen.findByText(title)

    await userEvent.click(screen.getByText(/add solution/i))
    expect(addSolutionMock).toHaveBeenCalledTimes(1)
  })

  test('View Solutions link has correct href', async () => {
    render(
      <DoubtGCard
        title={title}
        description={description}
        doubId={doubId}
        addSoltuion={addSolutionMock}
      />
    )

    await screen.findByText(title)

    const link = screen.getByRole('link', { name: /view solutions/i })
    expect(link).toHaveAttribute('href', `/answers/${doubId}`)
  })
})
