const user = { uid: "test-user", displayName: "Alex Morgan", email: "alex@example.com", photoURL: null, getIdToken: async () => "test-token" };
export const useAuth = () => ({ currentUser: user, loading: false, handleGoogleLogin: async () => true, logout: async () => {} });
export const AuthProvider = ({ children }) => children;
export const auth = { currentUser: user };
export const database = {};
