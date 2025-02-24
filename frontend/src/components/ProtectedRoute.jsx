import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  // If the user is not authenticated, allow them to access the route (Login/Register)
  if (!isAuthenticated) {
    return element;
  }
  
  // If authenticated, redirect to the home page or another page
  return <Navigate to="/" replace />;
};
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default ProtectedRoute;

