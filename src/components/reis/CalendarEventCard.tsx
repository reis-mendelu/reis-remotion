import React from 'react';
import { MapPin } from 'lucide-react';
import { BlockLesson } from './types';

interface CalendarEventCardProps {
    lesson: BlockLesson;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function calculateDuration(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
}

function getExamSectionName(courseName: string): string {
    const parts = courseName.split(' - ');
    if (parts.length > 1) {
        return parts[parts.length - 1];
    }
    return courseName;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ lesson, onClick }) => {
    const duration = calculateDuration(lesson.startTime, lesson.endTime);
    const isLongEnough = duration >= 60;

    const getEventStyles = () => {
        if (lesson.isExam) {
            return {
                bg: 'bg-[#FEF2F2]/85',
                border: 'border-l-[#dc2626]',
                text: 'text-gray-900',
            };
        } else if (lesson.isSeminar === 'true') {
            // Seminars/exercises use lecture colors (blue) in original
            return {
                bg: 'bg-[#F0F7FF]/85',
                border: 'border-l-[#00548f]',
                text: 'text-gray-900',
            };
        } else {
            // Lectures use seminar colors (green) in original
            return {
                bg: 'bg-[#F3FAEA]/85',
                border: 'border-l-[#79be15]',
                text: 'text-gray-900',
            };
        }
    };

    const styles = getEventStyles();
    const courseTitle = lesson.isExam
        ? getExamSectionName(lesson.courseName)
        : lesson.courseName;

    return (
        <div
            className={`h-full mx-1 rounded overflow-hidden cursor-pointer 
                        ${styles.bg} border-l-4 ${styles.border}`}
            onClick={onClick}
        >
            <div className="p-2 h-full flex flex-col text-sm overflow-hidden font-inter">
                <div className={`font-semibold ${styles.text} flex-shrink-0 break-words line-clamp-2`}>
                    {courseTitle}
                </div>

                {isLongEnough && lesson.isExam && (
                    <div className="text-[#dc2626] font-medium text-xs flex-shrink-0">
                        {lesson.courseName.split(' - ')[0]}
                    </div>
                )}

                {isLongEnough && (
                    <div className="text-gray-600 text-sm mt-auto flex-shrink-0 flex items-center justify-between gap-2">
                        {lesson.room && (
                            <div className="flex items-center gap-1 min-w-0 flex-1">
                                <MapPin size={12} className="flex-shrink-0" />
                                <span className="truncate">{lesson.room}</span>
                            </div>
                        )}
                        <div className="text-gray-500 whitespace-nowrap flex-shrink-0">
                            {lesson.startTime} - {lesson.endTime}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
