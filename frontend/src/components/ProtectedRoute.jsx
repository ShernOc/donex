import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element}) => {
  // If the user is not authenticated, redirect to the login page
  // if (!localStorage.getItem('token')) {
  //   return <Navigate to="/login" replace />;
  // }

  // If authenticated, render the requested component
  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default ProtectedRoute;