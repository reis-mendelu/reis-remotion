import { Search, X, BookOpen } from "lucide-react";
import type { SearchResultItem } from "../../compositions/SearchBar/schema";

interface SearchBarStaticProps {
  queryText: string;
  isOpen: boolean;
  isLoading: boolean;
  results: SearchResultItem[];
  selectedIndex: number;
  showClear: boolean;
  showCursor: boolean;
  cursorOpacity: number;
  /** 0-1 spring progress for dropdown slide-down reveal */
  dropdownProgress?: number;
}

export function SearchBarStatic({
  queryText,
  isOpen,
  isLoading,
  results,
  selectedIndex,
  showClear,
  showCursor,
  cursorOpacity,
  dropdownProgress = 1,
}: SearchBarStaticProps) {
  return (
    <div className="w-full h-full flex items-center">
      <div className="flex-1 max-w-3xl mx-auto flex items-center gap-2">
        <div className="relative w-full z-50">
          <div
            className={`relative flex items-center w-full max-w-3xl bg-base-100 rounded-xl border shadow-sm ${
              isOpen
                ? "border-primary shadow-[0_0_0_3px_rgba(121,190,21,0.15)]"
                : "border-base-300"
            }`}
          >
            <div className="flex-1 flex items-center h-12 px-4">
              <Search
                className={`w-5 h-5 mr-3 ${
                  isOpen ? "text-base-content" : "text-base-content/50"
                }`}
              />
              <div className="w-full flex items-center text-sm text-base-content">
                <span>{queryText}</span>
                {showCursor && (
                  <span
                    style={{ opacity: cursorOpacity }}
                    className="text-base-content font-light"
                  >
                    |
                  </span>
                )}
              </div>
              {showClear && (
                <div className="p-1 hover:bg-base-200 rounded-full">
                  <X className="w-4 h-4 text-base-content/50" />
                </div>
              )}
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-base-100 border border-t-0 border-base-300 rounded-b-lg shadow-lg overflow-hidden flex flex-col"
              style={{
                clipPath: `inset(0 0 ${(1 - dropdownProgress) * 100}% 0)`,
                opacity: dropdownProgress,
              }}
            >
              <div className="h-px w-full bg-base-300" />
              <div className="px-4 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider mt-1">
                <span>Výsledky</span>
              </div>
              <div className="max-h-[min(400px,50vh)] overflow-y-auto pb-2">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <div
                      key={result.id}
                      role="option"
                      aria-selected={selectedIndex === index}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 cursor-pointer text-left ${
                        selectedIndex === index
                          ? "bg-primary/10"
                          : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center">
                          <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm text-base-content truncate">
                            {result.title}
                          </span>
                          <span className="text-base-content/40 flex-shrink-0">
                            •
                          </span>
                          <span className="text-xs text-base-content/50 flex-shrink-0">
                            {result.detail}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-base-content/50">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-base-content/50" />
                        <span>Načítání...</span>
                      </div>
                    ) : (
                      <span>Žádné výsledky</span>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
