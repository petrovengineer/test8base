import { Query } from 'react-apollo';
import { withAuth, gql } from "@8base/react-sdk";
import { useEffect } from 'react';
import Logout from './logout';

/* GraphQL query for user information */
const USER_INFO = gql`
  query UserQuery {
    user {
      firstName
    }
  }
`;

/* Component generator function being passeda auth data */
const Login = (props) => {
  // useEffect(()=>{
  //   console.log("LOGIN PROPS ",props);
  // },[])
  let { auth: { isAuthorized, authClient } } = props;
	/* Component to display when NOT authorized*/
  if (!isAuthorized) {
	  return (
	    <div>
	      <h2>Login</h2> <button onClick={() => authClient.authorize()}>Login</button>
	    </div>
	  );
  }

  /* Component to display when authorized*/
  return (
    <>
      <Query query={USER_INFO}>
        {({ data, loading }) => (
          <div>{!loading && <p>{data?data.user.firstName:''} </p>}</div>
        )}
      </Query>
      <Logout/>
    </>
  );
};

/* Decorate exported function with withAuth */
export default withAuth(Login);