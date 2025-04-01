import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          // Get users from storage
          const usersJson = await AsyncStorage.getItem('users');
          const users = usersJson ? JSON.parse(usersJson) : [];
          
          // Find user with matching email and password
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      signup: async (name, email, password) => {
        try {
          // Get existing users
          const usersJson = await AsyncStorage.getItem('users');
          const users = usersJson ? JSON.parse(usersJson) : [];
          
          // Check if user already exists
          if (users.some(u => u.email === email)) {
            return false;
          }
          
          // Create new user
          const newUser = { name, email, password };
          
          // Add to users array and save
          users.push(newUser);
          await AsyncStorage.setItem('users', JSON.stringify(users));
          
          // Update state
          set({ user: newUser, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Signup error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);