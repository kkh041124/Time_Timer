import { Github } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

const GitHub = () => {
  const moveGit = () => {
    const url = "https://github.com/kkh041124/Time_Timer";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md p-2"
            onClick={moveGit}
          >
            <Github className="h-6 w-6" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={8}
          className="bg-white text-black rounded-md p-2 shadow-lg"
        >
          <p>GitHub</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GitHub;
