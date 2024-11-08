import { useState, useRef } from "react";

const CameraCapture = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const takePicture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
  };

  const closeCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  return (
    <div>
      <button onClick={openCamera}>Open Camera</button>
      {isCameraOpen && (
        <div>
          <video
            ref={videoRef}
            style={{
              display: "block",
              width: "100%", // Ensure the video is visible
              maxWidth: "500px",
              marginTop: "10px",
            }}
          />
          <button onClick={takePicture}>Take Picture</button>
          <button onClick={closeCamera}>Close Camera</button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      {photo && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={photo} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
