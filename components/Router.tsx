
import React, { Children, isValidElement, ReactNode, ReactElement } from 'react';

interface RouteProps {
  path: string;
  children: React.ReactNode; // Should be a single component
}

// This is a dummy component for type checking, it doesn't render anything itself.
export const Route: React.FC<RouteProps> = ({ children }) => {
  return <>{children}</>;
};

interface RouterProps {
  children: React.ReactNode;
  currentPage: string; // Pass current page from App.tsx
}

const Router: React.FC<RouterProps> = ({ children, currentPage }) => {
  let matchedComponent: React.ReactNode = null;
  let defaultComponent: React.ReactNode = null;

  Children.forEach(children, childNode => {
    // Fix: Check if childNode is a ReactElement and specifically our Route component
    if (isValidElement(childNode) && childNode.type === Route) {
      // We've confirmed childNode is a ReactElement of type Route.
      // Its props will conform to RouteProps.
      const { path, children: pageComponent } = childNode.props as RouteProps;

      if (path === currentPage || (currentPage === '/dashboard' && path === '/')) {
        matchedComponent = pageComponent;
      }
      if (path === '/') { // Capture the default route
        defaultComponent = pageComponent;
      }
    }
  });
  
  // If no specific match, and current page is empty or '/dashboard', show default
  if (!matchedComponent && (currentPage === '' || currentPage === '/') && defaultComponent) {
    return <>{defaultComponent}</>;
  }
  // If specific match, show it
  if (matchedComponent) {
    return <>{matchedComponent}</>;
  }
  // Fallback to default if no specific match for other routes, or render nothing/error
  if (defaultComponent) return <>{defaultComponent}</>;


  // Fallback if no route matches, including no default route
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl text-red-500">404 - Page Not Found</h1>
      <p className="text-slate-400">The requested path <code className="bg-slate-700 p-1 rounded">{currentPage}</code> was not found.</p>
      <a href="#/dashboard" className="text-sky-400 hover:text-sky-300 mt-4 inline-block">Go to Dashboard</a>
    </div>
  );
};

export default Router;
