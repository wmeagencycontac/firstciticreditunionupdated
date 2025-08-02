import { RequestHandler } from "express";
import { LoginRequest, LoginResponse, User } from "@shared/api";

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "2", 
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    createdAt: "2024-02-20T10:30:00Z"
  }
];

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;
    
    // Mock authentication - in real app, verify password hash
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || password !== "demo123") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Mock JWT token
    const token = `mock-jwt-token-${user.id}`;
    
    const response: LoginResponse = {
      user,
      token
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const handleProfile: RequestHandler = (req, res) => {
  // Mock authentication check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract user ID from mock token
  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-', '');
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
};
