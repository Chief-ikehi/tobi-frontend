import { User, Customer, Investor, Agent, mockUsers } from '../mock/users';

export interface UserFilters {
  role?: User['role'];
  search?: string;
}

export interface UserSearchParams extends UserFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export class UserService {
  private users: User[] = mockUsers;

  // Get all users with optional filtering
  async getUsers(params: UserSearchParams = {}): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    let filteredUsers = [...this.users];

    // Apply filters
    if (params.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredUsers.sort((a, b) => {
        const order = params.sortOrder === 'desc' ? -1 : 1;
        switch (params.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name) * order;
          case 'date':
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit
    };
  }

  // Get a single user by ID
  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  // Create a new user
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `user${this.users.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    const updatedUser: User = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // Get users by role
  async getUsersByRole(role: User['role']): Promise<User[]> {
    return this.users.filter(user => user.role === role);
  }

  // Get customer details
  async getCustomerDetails(id: string): Promise<Customer | null> {
    const user = await this.getUserById(id);
    if (!user || user.role !== 'customer') return null;
    return user as Customer;
  }

  // Get investor details
  async getInvestorDetails(id: string): Promise<Investor | null> {
    const user = await this.getUserById(id);
    if (!user || user.role !== 'investor') return null;
    return user as Investor;
  }

  // Get agent details
  async getAgentDetails(id: string): Promise<Agent | null> {
    const user = await this.getUserById(id);
    if (!user || user.role !== 'agent') return null;
    return user as Agent;
  }
}

// Export a singleton instance
export const userService = new UserService(); 