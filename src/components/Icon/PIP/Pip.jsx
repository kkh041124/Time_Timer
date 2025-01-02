import { PictureInPicture } from "lucide-react";
import { useRef } from "react";
import usePictureInPicture from "react-use-pip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

const Pip = () => {
  const videoRef = useRef(null);
  const { togglePictureInPicture } = usePictureInPicture(videoRef);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md p-2"
            onClick={togglePictureInPicture}
          >
            <PictureInPicture className="h-6 w-6" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={8}
          className="bg-white text-black rounded-md p-2 shadow-lg"
        >
          <p>화면 분할</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Pip;
