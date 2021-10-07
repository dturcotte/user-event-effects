import { useEffect, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

function TestComponent() {
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [clicked]);

  return (
    <>
      <div data-testid="count">{count}</div>
      <button
        onClick={() => {
          setClicked(true);
        }}
      >
        increment count
      </button>
    </>
  );
}

describe("Clicks don't flush effects anymore", () => {
  test('but useEffect is run on mount', () => {
    render(<TestComponent />);

    // the useEffect has already run here
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    userEvent.click(screen.getByRole('button', { name: 'increment count' }))

    // but why didn't it run a second time here?
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  test("but works when wrapped in act (though this shouldn't be needed", () => {
    render(<TestComponent />);

    // the useEffect has already run here
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    userEvent.click(screen.getByRole('button', { name: 'increment count' }))

    act(() => expect(screen.getByTestId('count')).toHaveTextContent('2'));
  });

  test('but does work when async', async () => {
    render(<TestComponent />);

    // the useEffect has already run here
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    userEvent.click(screen.getByRole('button', { name: 'increment count' }))

    // but it does happen eventually
    await waitFor(() => { expect(screen.getByTestId('count')).toHaveTextContent('2'); })
  })

})
