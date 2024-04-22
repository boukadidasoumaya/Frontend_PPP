import React, { useState } from 'react';
import { Alert } from 'reactstrap';

function AlertMessage({ message }) {
  const [visible, setVisible] = useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <Alert color="info" isOpen={visible} toggle={onDismiss}>
      {message}
    </Alert>
  );
}

export default AlertMessage;
