import React, { useEffect } from 'react';
import { withAuth, gql } from '@8base/react-sdk';
import { withApollo } from 'react-apollo';
import {flowRight as compose} from 'lodash';

/* Query the for the ID of the logged in user */
const CURRENT_USER = gql`
  query currentUser {
    user {
      id
    }
  }
`;

/* Mutation for adding user with email */
const SIGN_UP_USER = gql`
  mutation userSignUp($user: UserCreateInput!) {
    userSignUp(user: $user) {
      id
      email
    }
  }
`;

/* Authentication success callback function */
const AuthCallback = ({ auth, history, client }) => {
  useEffect(() => {
    const completeAuth = async () => {
    	/* Pull required values from authorized user data */
      const { idToken, email } = await auth.authClient.getAuthorizedData();
        console.log("AUTH", auth);
      /* Context for API calls */
      const context = { 
      	headers: { 
      		authorization: `Bearer ${idToken}` 
      	} 
      }

      try {
        /* Check if a user exists, if not an error will be thrown */
        await client.query({ query: CURRENT_USER, context });
      } catch {
        /* Sign up user if the request errored */
        await client.mutate({
          mutation: SIGN_UP_USER,
          variables: { 
          	user: { email } 
          },
          context
        });
      }

      /* After succesfull signup store token in local storage */
      await auth.authClient.setState({ token: idToken });
      /* Redirect back to home page */
      history.replace('/');
    };

    /* Run authentication function */
    completeAuth();
  }, []);

  return <p>Please wait...</p>;
};

/* Decorated export */
export default compose(withAuth, withApollo)(AuthCallback);