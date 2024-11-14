export interface YogaClass {
  id: string;
  date: Date | any;
  teacher: string;
  courseId: number;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  course?: YogaCourse;
}

export interface YogaCourse {
  id: string;
  type: string;
  name: string;
  dayOfWeek: string;
  duration: number;
  price: number;
  time: string;
  capacity: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  password: string;
  lastLoginAt: string;
  isAnonymous: boolean;
  providerData: any;
  emailVerified: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  email: string;
  price: number;
  classes: YogaClass[];
  createdAt: Date;
  updatedAt: Date;
}
