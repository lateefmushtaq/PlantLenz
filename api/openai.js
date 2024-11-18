const { Configuration, OpenAIApi } = require("openai");
const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })
);

export const config = {
    api: {
        bodyParser: false,
    },
};

module.exports = async function handler(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: "Error parsing the form" });
            return;
        }

        const { image } = files;

        if (!image) {
            res.status(400).json({ error: "No image file provided" });
            return;
        }

        try {
            const plantName = await identifyPlant(image.path);

            if (!plantName) {
                res.status(200).json({ result: "The image provided is not of a plant." });
                return;
            }

            const prompt = `Please tell me about the plant known as ${plantName}.`;
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 100,
            });

            res.status(200).json({ result: response.data.choices[0].text });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

async function identifyPlant(imagePath) {
    try {
        const visionResponse = await axios.post(
            `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
            {
                requests: [
                    {
                        image: {
                            content: fs.readFileSync(imagePath, { encoding: "base64" }),
                        },
                        features: [{ type: "LABEL_DETECTION" }],
                    },
                ],
            }
        );

        const labels = visionResponse.data.responses[0].labelAnnotations;
        const plantLabel = labels.find((label) => label.description.toLowerCase().includes("plant"));

        return plantLabel ? plantLabel.description : null;
    } catch (error) {
        console.error("Error identifying the plant:", error);
        return null;
    }
}
