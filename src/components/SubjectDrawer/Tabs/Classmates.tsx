import { Mail, Search, Users } from "lucide-react";
import { useCurrentFrame, interpolate } from "remotion";
import type { SubjectDrawerProps } from "../../../compositions/SubjectDrawer/schema";

export const SubjectDrawerClassmates: React.FC<{
    classmates?: SubjectDrawerProps["classmates"],
    activeSubTab?: 'all' | 'exercise'
}> = ({
    classmates = [],
    activeSubTab = 'all'
}) => {
        const frame = useCurrentFrame();
        const entranceOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

        return (
            <div
                className="flex flex-col h-full bg-[#1a1f26] font-inter text-white overflow-hidden"
                style={{ opacity: entranceOpacity }}
            >
                {/* Search & Tabs Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#1a1f26]">
                    <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                        <button className={`px-3 py-1 text-[11px] font-bold rounded-md border flex items-center gap-1.5 ${activeSubTab === 'all'
                            ? 'bg-[#79be15]/20 text-[#79be15] border-[#79be15]/20'
                            : 'text-white/40 border-transparent'
                            }`}>
                            <Users size={12} />
                            Všichni
                        </button>
                        <button className={`px-4 py-1 text-[11px] font-bold rounded-md border flex items-center gap-1.5 ${activeSubTab === 'exercise'
                            ? 'bg-[#79be15]/20 text-[#79be15] border-[#79be15]/20'
                            : 'text-white/40 border-transparent'
                            }`}>
                            <Users size={12} />
                            Cvičení
                        </button>
                    </div>

                    <div className="relative flex-1 ml-6 max-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                            type="text"
                            placeholder="Vyhledat..."
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-[12px] font-bold text-white/80 placeholder:text-white/20 focus:outline-none"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                    {classmates.map((person, i) => {
                        const stagger = i * 2;
                        const itemOpacity = interpolate(frame, [5 + stagger, 15 + stagger], [0, 1], { extrapolateRight: 'clamp' });
                        const itemX = interpolate(frame, [5 + stagger, 15 + stagger], [10, 0], { extrapolateRight: 'clamp' });

                        return (
                            <div
                                key={person.name}
                                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                                style={{
                                    opacity: itemOpacity,
                                    transform: `translateX(${itemX}px)`
                                }}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    {person.avatarUrl ? (
                                        <div className="w-12 h-12 rounded-xl border-2 border-[#79be15]/10 overflow-hidden bg-[#1a1f26]">
                                            <img
                                                src={person.avatarUrl}
                                                alt={person.name}
                                                className="w-full h-full object-cover grayscale-0 scale-100"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                            <Users size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-bold text-white">
                                            {person.name}
                                        </span>
                                        <span className="text-[10px] font-black text-[#79be15]">
                                            • ONLINE
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-bold text-white/40 mt-0.5 uppercase tracking-wider truncate">
                                        {person.degree} • {person.semester}, {person.year}
                                    </div>
                                </div>

                                {/* Action */}
                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40">
                                    <Mail size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
