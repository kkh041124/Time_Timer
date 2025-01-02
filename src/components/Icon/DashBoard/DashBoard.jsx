import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

const DashBoard = () => {
  const navigate = useNavigate();
  const movePage = () => {
    navigate("./dashboard");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md p-2"
            onClick={movePage}
          >
            <LayoutDashboard className="h-6 w-6" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={8}
          className="bg-white text-black rounded-md p-2 shadow-lg"
        >
          <p>대시보드</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DashBoard;
