import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DoubtCard from '../../components/DoubtCard'

// ✅ Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}))

describe('DoubtCard', () => {
  const title = 'Test Doubt'
  const description = 'This is a test description'
  const doubId = '123'

  const onEditMock = jest.fn()
  const onDeleteMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // ✅ Mock fetch (async side effect)
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ count: 3 }),
      })
    )
  })

  test('renders title and description', async () => {
    render(
      <DoubtCard
        title={title}
        description={description}
        doubId={doubId}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    )

    // ✅ wait for useEffect to complete
    await screen.findByText(title)

    expect(screen.getByText(description)).toBeInTheDocument()
  })

  test('calls API with correct doubt id and displays count', async () => {
    render(
      <DoubtCard
        title={title}
        description={description}
        doubId={doubId}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `/api/answers/count/${doubId}`,
        expect.any(Object)
      )
    })

    expect(await screen.findByText('3')).toBeInTheDocument()
  })

  test('edit button calls onEdit', async () => {
    render(
      <DoubtCard
        title={title}
        description={description}
        doubId={doubId}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    )

    // wait for effect to finish
    await screen.findByText(title)

    await userEvent.click(screen.getByText(/edit/i))
    expect(onEditMock).toHaveBeenCalledTimes(1)
  })

  test('delete button calls onDelete', async () => {
    render(
      <DoubtCard
        title={title}
        description={description}
        doubId={doubId}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    )

    // wait for effect to finish
    await screen.findByText(title)

    await userEvent.click(screen.getByText(/delete/i))
    expect(onDeleteMock).toHaveBeenCalledTimes(1)
  })

  test('solutions link points to correct route', async () => {
    render(
      <DoubtCard
        title={title}
        description={description}
        doubId={doubId}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    )

    await screen.findByText(title)

    const link = screen.getByRole('link', { name: /solutions/i })
    expect(link).toHaveAttribute('href', `/answers/${doubId}`)
  })
})