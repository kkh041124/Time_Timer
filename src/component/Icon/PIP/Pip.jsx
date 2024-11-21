import { useRef } from "react";
import picture_in_picture from "./asset/picture_in_picture.svg";
import picture_in_picture_center from "./asset/picture_in_picture_center.svg";
import styles from "./Pip.module.css";
import usePictureInPicture from "react-use-pip";

const Pip = () => {
  const videoRef = useRef(null);
  const {
    isPictureInPictureActive, //PIP 모드가 활성인지 비활성인지 여부
    isPictureInPictureAvailable, //PIP 모드가 지원되고 활성화되었는지 여부
    togglePictureInPicture,
  } = usePictureInPicture(videoRef);
  return (
    <div>
      <img src={picture_in_picture} />
    </div>
  );
};

export default Pip;
