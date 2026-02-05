export interface Teacher {
    fullName: string;
    shortName: string;
    id: string;
}

export interface RoomStructured {
    name: string;
    id: string;
}

export interface BlockLesson {
    id: string;
    date: string; // YYYYMMDD format, e.g., "20251022"
    startTime: string; // HH:MM format, e.g., "15:00"
    endTime: string; // HH:MM format, e.g., "16:50"
    courseName: string;
    courseCode: string;
    courseId: string;
    sectionName?: string;
    room: string;
    roomStructured: RoomStructured;
    teachers: Teacher[];
    periodId: string;
    studyId: string;
    campus: string;
    isDefaultCampus: string;
    facultyCode: string;
    isSeminar: string; // 'true' or 'false' as string
    isConsultation: string; // 'true' or 'false' as string
    isExam?: boolean;
}

export interface LessonWithRow extends BlockLesson {
    row: number;
}

export interface OrganizedLessons {
    lessons: LessonWithRow[];
    totalRows: number;
}
