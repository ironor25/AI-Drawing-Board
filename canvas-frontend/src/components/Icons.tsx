import type { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  title
}: {
  icon: ReactNode,
  onClick: () => void,
  activated: boolean,
  title?: string
}) {
  return (
    <div className="relative group">
      <div
        className={`pointer m-1 rounded-md cursor-pointer hover:mr-4 hover:ml-4 p-2 duration-400 bg-purple-300 hover:bg-gray-700 ${activated ? "text-yellow-300  " : "text-white" }`}
        onClick={onClick}
      >
        {icon}
      </div>
      {title && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
          {/* The Arrow */}
          <div className="mx-auto w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
          {/* The Label - Darker for better visibility */}
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap">
            {title}
          </div>
        </div>
      )}
    </div>
  );
}
