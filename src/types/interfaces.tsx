export interface Chapter {
    id: number;
    title: string;
    duration: string;
}


// Full course details, used in CourseDetail and Admin
export interface Course {
    id: number;
    name: string;
    imageUrl: string;
    Duration: string;
    level: string;
    price: string;
    rating: string;
    description: string;
    chapters: Chapter[];
}

// Summary for course listings, used in Home/CourseCard
export type CourseSummary = Omit<Course, 'description' | 'chapters'>;

export interface User {
    id: number;
    displayName: string;
    email: string;
    contact: string;
    role: 'user' | 'admin';
}

// For dashboard, where course is expanded
export interface EnrolledCourse extends CourseSummary {
    chapters?: Chapter[];
}

export interface Enrollment {
    id: number;
    userId: number;
    courseId: number;
    course: EnrolledCourse;
    completedChapters: number[];
}