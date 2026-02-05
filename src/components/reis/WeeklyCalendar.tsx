import { AbsoluteFill } from "remotion";
import { WeeklyCalendarDay } from "./WeeklyCalendarDay";
import { BlockLesson } from "./types";
import { Background } from "../Background";

const mockLessons: BlockLesson[] = [
  {
    id: "algoritmizace",
    date: "20260211",
    startTime: "09:00",
    endTime: "10:00",
    courseName: "Přednáška: Algoritmizace",
    courseCode: "ALG",
    courseId: "123",
    room: "Q1.1",
    roomStructured: { name: "Q1.1", id: "1" },
    teachers: [{ fullName: "John Doe", shortName: "JD", id: "1" }],
    periodId: "1",
    studyId: "1",
    campus: "Q",
    isDefaultCampus: "true",
    facultyCode: "PEF",
    isSeminar: "false",
    isConsultation: "false",
  },
  {
    id: "databaze",
    date: "20260211",
    startTime: "11:00",
    endTime: "12:00",
    courseName: "Zkouška: Databáze",
    courseCode: "DB",
    courseId: "125",
    room: "Aula",
    roomStructured: { name: "Aula", id: "3" },
    teachers: [{ fullName: "Bob Wilson", shortName: "BW", id: "3" }],
    periodId: "1",
    studyId: "1",
    campus: "Q",
    isDefaultCampus: "true",
    facultyCode: "PEF",
    isSeminar: "false",
    isConsultation: "false",
    isExam: true,
  }
];

export const WeeklyCalendar: React.FC = () => {
  const START_HOUR = 8;
  const END_HOUR = 13; // Focus on a smaller part of the day as requested
  const TOTAL_HOURS = END_HOUR - START_HOUR;

  return (
    <AbsoluteFill>
      <Background type="stars" starsCount={500} />
      
      <AbsoluteFill className="flex items-center justify-center">
        <div 
          className="w-80 bg-[#1f2937] rounded-xl border border-white/5 shadow-2xl overflow-hidden flex flex-col"
          style={{ 
            height: 480, // Proportional height for the snapshot
            boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
          }}
        >
          {/* REIS Header Replication - Dark Mode */}
          <div className="flex border-b border-[#0f172a] bg-[#1f2937] flex-shrink-0 h-14">
            <div className="w-12 border-r border-[#0f172a] bg-[#111827]"></div>
            <div className="flex-1 py-1 text-center border-r border-[#0f172a] bg-[#111827]/30">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-xl font-bold leading-tight text-white">8</div>
                <div className="text-[13px] leading-tight text-[#f3f4f6] font-medium uppercase tracking-wider">Středa</div>
              </div>
            </div>
          </div>

          {/* Content Area with Hour Sidebar */}
          <div className="flex-1 flex relative">
            {/* Hour Sidebar */}
            <div className="w-12 border-r border-[#0f172a] bg-[#111827] relative flex-shrink-0">
              {[...Array(TOTAL_HOURS)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-full flex justify-center text-[10px] text-[#9ca3af] font-medium"
                  style={{ top: `${(i / TOTAL_HOURS) * 100}%`, transform: 'translateY(-50%)' }}
                >
                  {i + START_HOUR}:00
                </div>
              ))}
            </div>

            {/* Grid Area */}
            <div className="flex-1 relative bg-[#1f2937]">
               {/* Hour Grid Lines */}
               {[...Array(TOTAL_HOURS + 1)].map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute w-full border-t border-[#111827]"
                   style={{ top: `${(i / TOTAL_HOURS) * 100}%` }}
                 />
               ))}
               
               <WeeklyCalendarDay 
                 dayIndex={2} 
                 lessons={mockLessons} 
                 holiday={null} 
                 isToday={true} 
                 startHour={START_HOUR}
                 endHour={END_HOUR}
                 animated={true}
               />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
