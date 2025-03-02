export const maxNavigationRate = 1000 / 30;
export const maxRedirects = 10;
export const pathValidationRegex = /^[/\w-]+$/;
export const paramValidationRegex = /^[\w-]+$/;

let lastNavigationTime = 0;
let redirectCount = 0;

// Validates a path
export const validatePath = (path: string): boolean =>
  Boolean(pathValidationRegex.exec(path));

// Validates a route parameter
export const validateRouteParam = (param: string): boolean =>
  Boolean(paramValidationRegex.exec(param));

// Validates a navigation rate
export const validateNavigationRate = (): boolean => {
  const now = Date.now();
  const timeDiff = now - lastNavigationTime;
  lastNavigationTime = now;
  return timeDiff > maxNavigationRate;
};

// Validates a redirect count
export const validateRedirectCount = (): boolean => {
  redirectCount++;
  const isValid = redirectCount <= maxRedirects;
  if (isValid) {
    redirectCount = 0
  }
  return isValid;
};

// Resets the redirect count
export const resetRedirectCount = (): void => {
  redirectCount = 0;
};
