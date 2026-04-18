interface TooltipProps {
  children: React.ReactNode;
  text: string;
  mobileHint?: string; // 移动端始终显示的提示
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ 
  children, 
  text, 
  mobileHint,
  position = "top" 
}: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#2a3050]",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#2a3050]",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[#2a3050]",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-[#2a3050]",
  };

  return (
    <div className="relative group inline-flex flex-col items-center">
      {/* Desktop tooltip - show on hover */}
      <div
        className={`hidden md:block absolute ${positionClasses[position]} px-3 py-2 bg-[#2a3050] 
                     text-gray-200 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 
                     transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700/50`}
      >
        {text}
        <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
      </div>

      {/* Mobile hint - always show below */}
      {mobileHint && (
        <div className="md:hidden text-[10px] text-gray-500 text-center mt-1.5 leading-tight">
          {mobileHint}
        </div>
      )}

      {/* Children (button) */}
      {children}
    </div>
  );
}
