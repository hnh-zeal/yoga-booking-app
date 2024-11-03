import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Booking, YogaClass, YogaCourse } from "@/types";

export const fetchYogaClasses = async (): Promise<YogaClass[]> => {
  const classesCollection = collection(db, "yoga_classes");
  const coursesCollection = collection(db, "yoga_courses");

  try {
    const snapshot = await getDocs(classesCollection);
    if (!snapshot.empty) {
      const fetchedClasses: YogaClass[] = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const yogaClass = {
            ...docSnapshot.data(),
          } as YogaClass;

          // Fetch the associated YogaCourse based on courseId
          if (yogaClass.courseId) {
            const courseDoc = await getDoc(
              doc(coursesCollection, yogaClass.courseId.toString())
            );
            if (courseDoc.exists()) {
              yogaClass.course = {
                id: courseDoc.id,
                ...courseDoc.data(),
              } as YogaCourse;
            }
          }

          return yogaClass;
        })
      );

      return fetchedClasses;
    } else {
      console.log("No classes found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

export const bookClasses = async (
  userId: String,
  email: string,
  classes: YogaClass[]
) => {
  try {
    const docRef = await addDoc(collection(db, "booking"), {
      userId,
      email,
      classes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error booking classes:", error);
    throw error;
  }
};

export const fetchBooking = async (userId: string): Promise<Booking[]> => {
  const bookingCollection = collection(db, "booking");
  try {
    const userBookingQuery = query(
      bookingCollection,
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(userBookingQuery);

    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      classes: doc.data().classes,
      createdAt: doc.data().createdAt,
    }));

    return bookings.sort((a, b) => a.createdAt - b.createdAt) as Booking[];
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const fetchYogaClass = async (
  classId: string
): Promise<YogaClass | null> => {
  try {
    const yogaClassDocRef = doc(db, "yoga_classes", classId);
    const yogaClassDoc = await getDoc(yogaClassDocRef);

    if (yogaClassDoc.exists()) {
      const yogaClassData = yogaClassDoc.data();

      const courseId = yogaClassData?.courseId?.toString();
      const courseDocRef = doc(db, "yoga_courses", courseId);
      const courseDoc = await getDoc(courseDocRef);

      if (!courseDoc.exists()) {
        console.log("No such Yoga Course document!");
        return null;
      }

      return {
        id: yogaClassDoc.id,
        ...yogaClassDoc.data(),
        course: {
          id: courseDoc.id,
          ...courseDoc.data(),
        } as YogaCourse,
      } as YogaClass;
    } else {
      console.log("No such Yoga Class document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Yoga Class:", error);
    throw error;
  }
};

export const fetchBookingDetails = async (
  bookingId: string
): Promise<Booking | null> => {
  try {
    const bookingDocRef = doc(db, "booking", bookingId);
    const bookingDoc = await getDoc(bookingDocRef);

    if (bookingDoc.exists()) {
      return {
        id: bookingDoc.id,
        ...bookingDoc.data(),
      } as Booking;
    } else {
      console.log("No such booking document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};
