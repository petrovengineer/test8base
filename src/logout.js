import React from 'react';
import { withAuth } from '@8base/react-sdk';

const LogoutButton = ({ auth }) => (
  <>
    <button onClick={() => auth.authClient.logout()}>logout</button>
  </>
);

export default withAuth(LogoutButton);