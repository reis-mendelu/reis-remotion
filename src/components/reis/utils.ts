import { BlockLesson, LessonWithRow, OrganizedLessons } from './types';

const DEFAULT_START_HOUR = 7;
const DEFAULT_END_HOUR = 20;

export function timeToPercent(time: string, startHour = DEFAULT_START_HOUR, endHour = DEFAULT_END_HOUR): number {
    const totalHours = endHour - startHour;
    const [hours, minutes] = time.split(':').map(Number);
    const hoursFromStart = hours - startHour;
    const totalMinutesFromStart = hoursFromStart * 60 + minutes;
    const totalMinutesInDay = totalHours * 60;
    return (totalMinutesFromStart / totalMinutesInDay) * 100;
}

export function getEventStyle(startTime: string, endTime: string, startHour = DEFAULT_START_HOUR, endHour = DEFAULT_END_HOUR): { top: string; height: string } {
    const topPercent = timeToPercent(startTime, startHour, endHour);
    const bottomPercent = timeToPercent(endTime, startHour, endHour);
    return {
        top: `${topPercent}%`,
        height: `${bottomPercent - topPercent}%`,
    };
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export function organizeLessons(lessons: BlockLesson[]): OrganizedLessons {
    if (!lessons || lessons.length === 0) return { lessons: [], totalRows: 1 };

    const sortedLessons = [...lessons].sort((a, b) =>
        timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    const rows: number[] = [];
    const lessonsWithRows: LessonWithRow[] = [];

    sortedLessons.forEach(lesson => {
        const start = timeToMinutes(lesson.startTime);
        const end = timeToMinutes(lesson.endTime);
        let placed = false;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i] <= start) {
                rows[i] = end;
                lessonsWithRows.push({ ...lesson, row: i });
                placed = true;
                break;
            }
        }

        if (!placed) {
            rows.push(end);
            lessonsWithRows.push({ ...lesson, row: rows.length - 1 });
        }
    });

    return { lessons: lessonsWithRows, totalRows: rows.length };
}
