import { useState, useRef } from "react";
import PropTypes from "prop-types";

const CameraCapture = ({ setImage }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    setIsCameraActive(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    setImage(dataUrl); // Set the captured image in the parent component's state
    stopCamera();
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!isCameraActive ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <>
          <button onClick={stopCamera}>Stop Camera</button>
          <button onClick={captureImage}>Capture Image</button>{" "}
          {/* Added Capture Image button */}
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <video ref={videoRef} width="100%" height="auto" autoPlay />
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width="640"
        height="480"
      />
    </div>
  );
};

// PropTypes for CameraCapture component
CameraCapture.propTypes = {
  setImage: PropTypes.func.isRequired, // setImage should be a function
};

export default CameraCapture;
