import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { CalendarEventCard } from './CalendarEventCard';
import { organizeLessons, getEventStyle } from './utils';
import { BlockLesson } from './types';

interface WeeklyCalendarDayProps {
    dayIndex: number;
    lessons: BlockLesson[];
    holiday: string | null;
    isToday: boolean;
    showSkeleton?: boolean;
    onEventClick?: (lesson: BlockLesson) => void;
    startHour?: number;
    endHour?: number;
    animated?: boolean;
}

export const WeeklyCalendarDay: React.FC<WeeklyCalendarDayProps> = ({ 
    lessons, holiday, isToday, showSkeleton = false, onEventClick,
    startHour, endHour, animated = false
}) => {
    const { lessons: organizedLessons, totalRows } = organizeLessons(lessons);
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div className={`flex-1 relative h-full ${isToday ? 'bg-white/5' : ''}`}>
            {holiday && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 z-20">
                    <div className="flex flex-col items-center text-center p-2">
                        <span className="text-xl mb-1">🇨🇿</span>
                        <h3 className="text-sm font-bold text-red-500">{holiday}</h3>
                        <span className="text-[10px] text-red-500/80 font-medium uppercase tracking-wider mt-0.5">Státní svátek</span>
                    </div>
                </div>
            )}

            {!holiday && showSkeleton && (
                <div className="flex flex-col gap-2 p-2">
                    <div className="h-12 w-full rounded bg-white/5 animate-pulse" />
                    <div className="h-16 w-full rounded bg-white/5 animate-pulse" />
                </div>
            )}

            {!holiday && !showSkeleton && organizedLessons.map((lesson, index) => {
                const style = getEventStyle(lesson.startTime, lesson.endTime, startHour, endHour);
                const hasOverlap = totalRows > 1;

                // Animation Logic
                const DELAY_PER_ITEM = 15; // 0.5s stagger
                const START_DELAY = 15; // Wait 0.5s before starting
                
                const entrance = spring({
                    frame: frame - (START_DELAY + index * DELAY_PER_ITEM),
                    fps,
                    config: { damping: 15, stiffness: 120, mass: 0.8 },
                });

                const scale = animated ? entrance : 1;
                const opacity = animated ? entrance : 1;

                return (
                    <div
                        key={lesson.id}
                        className="absolute"
                        style={{
                            ...style,
                            left: hasOverlap ? `${(lesson.row / totalRows) * 100}%` : '0',
                            width: hasOverlap ? `${100 / totalRows}%` : '100%',
                            transform: `scale(${scale})`,
                            transformOrigin: 'top center',
                            opacity,
                        }}
                    >
                        <CalendarEventCard lesson={lesson} onClick={() => onEventClick?.(lesson)} />
                    </div>
                );
            })}
        </div>
    );
};
