import { useEffect, useRef } from "react";
import { useRhinoState } from "../store/states";
import { userMediaConstraints } from "../utils/constants";
export const LocalVideo = (data) => {
  const localVideoElement = useRef();
  const [localStream, setLocalStream] = useRhinoState("localStream");
  const [screenStream, setScreenStream] = useRhinoState("screenStream");
  const [shareScreen, setShareScreen] = useRhinoState("shareScreen");
  const [isStarted] = useRhinoState("isStarted");

  useEffect(() => {
    let stream = {};
    (async () => {
      if (shareScreen) {
        let stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setScreenStream(stream);
        stream.oninactive = () => {
          setScreenStream(null);
          setShareScreen(false);
        };
      } else if (!stream || !shareScreen) {
        let stream = await navigator.mediaDevices.getUserMedia(
          userMediaConstraints
        );
        setScreenStream(null);
        setLocalStream(stream);
      }
    })();
    // return () => {
    //   stream.getTracks().forEach((x) => x.stop());
    // };
  }, [shareScreen, isStarted]);
  useEffect(() => {
    if (isStarted) {
      localVideoElement.current.srcObject = screenStream
        ? screenStream
        : localStream;
      localVideoElement.current.play();
    }
  }, [localStream, screenStream]);
  return isStarted ? (
    <article
      className="z-1 absolute cursor-move right-2 bottom-2 md:right-10 md:bottom-10 rounded w-1/4 md:w-1/5 lg:w-1/6 local-video"
      id="localVideo"
      data-userName="you"
      draggable
      onDragStart={(event) => {
        var style = getComputedStyle(event.target, null);
        event.dataTransfer.setData(
          "text/plain",
          `localVideo,${
            parseInt(style.getPropertyValue("left"), 10) - event.clientX
          },${parseInt(style.getPropertyValue("top"), 10) - event.clientY}`
        );
      }}
    >
      <video
        className="z-1 absolute cursor-move right-0 bottom-0 rounded w-full"
        width={200}
        height={100}
        muted
        controls
        playsInline
        ref={localVideoElement}
      ></video>
    </article>
  ) : null;
};

LocalVideo.displayName = "LocalVideo";
