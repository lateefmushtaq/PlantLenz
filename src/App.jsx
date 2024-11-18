import { useState } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image loaded:", reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Submitting image...");

    if (!image) {
      alert("Please upload an image first!");
      setLoading(false);
      return;
    }

    const apiKey = process.env.REACT_APP_PLANTNET_API_KEY;
    console.log("API Key from env:", apiKey);

    if (!apiKey) {
      console.error("API Key is missing!");
      alert("API Key is missing!");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "https://api.plant.id/v2/identify"; // Ensure this URL is correct
      console.log("Sending request to:", apiUrl); // Debug log for request URL

      const formData = new FormData();
      formData.append("images", image);

      console.log("Form Data:", formData); // Debug log for form data

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Api-Key": apiKey, // Make sure the header is correctly set
        },
      });

      console.log("Response from API:", response);
      setResult(response.data);
    } catch (error) {
      console.error("Error identifying plant:", error);
      alert("Error identifying plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Plant Identification</h2>
      <button onClick={() => document.getElementById("fileInput").click()}>
        Upload Image
      </button>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleImageChange}
        accept="image/*"
      />
      {image && (
        <div>
          <img
            src={image}
            alt="Uploaded"
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </div>
      )}
      {image && !loading && (
        <button onClick={handleSubmit}>Identify Plant</button>
      )}
      {loading && <p>Loading...</p>}
      {result && (
        <div>
          <h3>Plant Identification Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
