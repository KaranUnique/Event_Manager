export const API_URL = import.meta.env.VITE_API_URL || "";
export const api = {
  url: (path) => `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`,
};
