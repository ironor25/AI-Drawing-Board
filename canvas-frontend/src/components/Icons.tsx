import type { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated
}: {
  icon: ReactNode,
  onClick: () => void,
  activated: boolean
}) {
  return (
    <div
      className={`pointer m-1 rounded-md cursor-pointer hover:mr-4 hover:ml-4 p-2 duration-400 bg-purple-300 hover:bg-gray-700 ${activated ? "text-yellow-300  " : "text-white" }`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
