import { storageService } from "./storageService";

export const authService = {
  // User Auth
  login: (email?: string, password?: string): 'user' | 'admin' | 'invalid' | 'banned' => {
    // Check for Admin Credentials
    if ((email === 'admin' || email === 'admin@decideforme.app') && password === 'admin123') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('isAuthenticated', 'true'); 
        
        const adminUser = {
            id: 'admin',
            name: 'Admin User',
            username: '@admin',
            email: 'admin@decideforme.app',
            avatar: '',
            preferences: { style: 'N/A', budget: 'N/A', food: 'N/A' }
        };
        localStorage.setItem('dfm_user', JSON.stringify(adminUser));

        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('adminAuthChange'));
        return 'admin';
    }

    // Check Sync Users
    const users = storageService.getUsers();
    // For this demo, we assume password is correct if email matches user in DB
    // In real app, check hash.
    const validUser = users.find(u => u.email === email || u.username === email);

    if (validUser) {
        if (validUser.status === 'Banned') {
            return 'banned';
        }
        localStorage.setItem('isAuthenticated', 'true');
        
        // Ensure user object has minimal fields for app to work
        const appUser = {
            id: validUser.id,
            name: validUser.name,
            username: validUser.username || '@user',
            email: validUser.email,
            avatar: validUser.avatar || '',
            preferences: validUser.preferences || { style: 'Casual', budget: 'Medium', food: 'Everything' }
        };
        localStorage.setItem('dfm_user', JSON.stringify(appUser));
        window.dispatchEvent(new Event('authChange'));
        return 'user';
    }

    return 'invalid';
  },

  signup: (username: string, email: string, password: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    
    const newUser = {
      id: Date.now().toString(),
      name: username, // Using username as name for simplicity in signup
      username: `@${username}`,
      email: email,
      avatar: '',
      preferences: {
        style: 'Casual',
        budget: 'Medium',
        food: 'Everything'
      }
    };
    
    // SYNC: Save to central storage for Admin
    storageService.saveUser(newUser);

    localStorage.setItem('dfm_user', JSON.stringify(newUser));
    
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('userChange'));
  },

  resetPassword: (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Password reset link sent to ${email}`);
        resolve(true);
      }, 1500);
    });
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('user_vibe');
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('adminAuthChange'));
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Admin Specific
  adminLogin: () => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('isAuthenticated', 'true'); 
    
    const adminUser = {
        id: 'admin',
        name: 'Admin User',
        username: '@admin',
        email: 'admin@decideforme.app',
        avatar: '',
        preferences: { style: 'N/A', budget: 'N/A', food: 'N/A' }
    };
    localStorage.setItem('dfm_user', JSON.stringify(adminUser));

    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('adminAuthChange'));
  },

  adminLogout: () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('isAuthenticated');
    window.dispatchEvent(new Event('adminAuthChange'));
    window.dispatchEvent(new Event('authChange'));
  },
  
  isAdminAuthenticated: () => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  }
};
