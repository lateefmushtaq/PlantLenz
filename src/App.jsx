import { useState } from "react";
import axios from "axios";
import "./App.css";
import CameraCapture from "./Camera";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("/api/openai", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data.result);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };

  return (
    <>
      <h1>Plant Identifier</h1>
      <h2>Logo</h2>
      <div style={{ display: "flex" }}>
        <button onClick={handleButtonClick}>Upload Image</button>
        <input
          type="file"
          id="hiddenFileInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
          accept="image/*"
        />
        <div>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected plant"
              style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}
            />
          )}
        </div>
        <CameraCapture image={image} setImage={setImage} />
      </div>
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Identify Plant
      </button>
      {result && <p>{result}</p>}
    </>
  );
}
