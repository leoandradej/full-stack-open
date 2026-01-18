import { useState } from 'react';

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {!visible && (
        <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      )}

      {visible && (
        <div>
          {children}
          <button onClick={() => setVisible(!visible)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Togglable;
