export interface Chapter {
  id: number;
  title: string;
  duration: string;
}

export interface Course {
  id: number;
  name: string;
  imageUrl: string;
  Duration: string;
  level: string;
  price: string;
  rating: string;
  description: string;
  chapters?: Chapter[];
}

export interface User {
  id: number;
  displayName: string;
  email: string;
  contact: string;
  password?: string;
  role: 'user' | 'admin';
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  completedChapters: number[];
  course?: Course;
}