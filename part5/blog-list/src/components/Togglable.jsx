import { useState } from 'react';

const Togglable = forwardRef(
  ({ buttonLabel, cancelLabel = 'cancel', children }) => {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        {!visible && (
          <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
        )}

        {visible && (
          <div>
            {children}
            <button onClick={() => setVisible(!visible)}>{cancelLabel}</button>
          </div>
        )}
      </div>
    );
  }
);

export default Togglable;
