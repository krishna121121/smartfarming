const express = require('express');
const cors = require('cors');
const path = require('path');
const stringSimilarity = require('string-similarity'); // For fuzzy matching

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Predefined responses dataset (extended version with more keywords)
const responses = [
    { keyword: 'hola', response: 'Hola! How can I assist you with smart farming today?' },
    { keyword: 'hello', response: 'Hello! How can I assist you with smart farming today?' },
    { keyword: 'hi', response: 'Hi there! How can I help you explore smart farming solutions?' },
    { keyword: 'hey', response: 'Hey! What would you like to know about smart farming?' },
    { keyword: 'what is smart farming', response: 'Smart farming uses IoT, AI, and sensors to optimize agricultural practices.' },
    { keyword: 'how does smart farming work', response: 'Smart farming involves collecting data using sensors and devices to make informed decisions for irrigation, fertilization, and harvesting.' },
    { keyword: 'benefits of smart farming', response: 'Benefits of smart farming include increased productivity, optimized resource usage, reduced costs, and sustainable practices.' },
    { keyword: 'tools used in smart farming', response: 'Tools include drones, GPS devices, automated tractors, soil sensors, AI-driven tools, and weather forecasting software.' },
    { keyword: 'precision farming', response: 'Precision farming focuses on monitoring and analyzing field variations to improve crop management and yield.' },
    { keyword: 'hydroponics', response: 'Hydroponics is a method of growing plants in nutrient-rich water instead of soil, allowing efficient resource usage.' },
    { keyword: 'vertical farming', response: 'Vertical farming involves growing crops in stacked layers to save space, reduce water usage, and increase crop yields.' },
    { keyword: 'smart irrigation', response: 'Smart irrigation systems use real-time soil moisture data and weather conditions to optimize water supply for crops.' },
    { keyword: 'drones in farming', response: 'Drones are used for crop monitoring, pest detection, fertilizer spraying, and field analysis.' },
    { keyword: 'what is soil analysis', response: 'Soil analysis helps determine nutrient content, pH levels, and soil health to enhance crop production.' },
    { keyword: 'pest detection', response: 'Pest detection uses cameras, AI, and sensors to identify pests early and minimize crop damage.' },
    { keyword: 'sustainable farming practices', response: 'Sustainable farming includes water conservation, reduced chemical usage, renewable energy integration, and soil health improvement.' },
    { keyword: 'automated tractors', response: 'Automated tractors use AI and GPS systems to plow, sow, and harvest crops with minimal human intervention.' },
    { keyword: 'smart weather prediction', response: 'Weather prediction software uses AI and data models to forecast weather, helping farmers plan activities like irrigation and harvesting.' },
    { keyword: 'crop monitoring systems', response: 'Crop monitoring systems use sensors and drones to provide real-time insights into crop health and growth.' },
    { keyword: 'iot in agriculture', response: 'IoT in agriculture uses connected sensors to monitor soil conditions, temperature, and other environmental factors to improve farming.' },
    { keyword: 'ai in farming', response: 'AI analyzes farming data to optimize planting schedules, resource allocation, and detect diseases early.' },
    { keyword: 'robotics in farming', response: 'Robots assist with activities like planting, weeding, and harvesting, reducing labor costs and improving efficiency.' },
    { keyword: 'crop rotation', response: 'Crop rotation involves growing different crops in the same field seasonally to maintain soil health and reduce pests.' },
    { keyword: 'weather monitoring', response: 'Weather monitoring devices collect real-time data to predict rainfall, temperature changes, and humidity for efficient planning.' },
    { keyword: 'data analytics in farming', response: 'Data analytics processes farming data to identify patterns, predict yields, and optimize farm operations.' },
    { keyword: 'water management in smart farming', response: 'Water management involves using smart irrigation techniques and monitoring soil moisture levels to conserve water.' },
    { keyword: 'agriculture drones', response: 'Agriculture drones help in mapping fields, spraying pesticides, and monitoring crop growth.' },
    { keyword: 'smart greenhouse', response: 'Smart greenhouses use automated systems to control temperature, humidity, and light, enabling year-round crop growth.' },
    { keyword: 'renewable energy in farming', response: 'Farmers use solar and wind energy to power irrigation systems, tractors, and farming tools sustainably.' },
    { keyword: 'smart pest control', response: 'Smart pest control involves AI-based pest identification systems and automated traps to minimize crop loss.' },
    { keyword: 'blockchain in agriculture', response: 'Blockchain ensures transparency in the supply chain, improves traceability, and enhances trust between farmers and buyers.' },
    { keyword: 'machine learning in farming', response: 'Machine learning predicts crop diseases, optimizes resources, and enhances productivity using historical data analysis.' },
    { keyword: 'robotic harvesting', response: 'Robotic harvesters use sensors and AI to pick fruits and vegetables efficiently without damaging them.' },
    { keyword: 'farm management software', response: 'Farm management software helps farmers plan, monitor, and analyze all farm activities from a single platform.' },
    { keyword: 'climate smart agriculture', response: 'Climate-smart agriculture adapts farming practices to climate changes while reducing greenhouse gas emissions.' }
];

// Handle POST requests to '/api/chatbot'
app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message.toLowerCase().trim();

    // Extract all keywords for fuzzy matching
    const keywords = responses.map(item => item.keyword);

    // Find the best match using string-similarity
    const bestMatch = stringSimilarity.findBestMatch(userMessage, keywords);
    const match = bestMatch.bestMatch;

    let botResponse;

    if (match.rating > 0.5) { // Acceptable similarity threshold
        const responseObj = responses.find(item => item.keyword === match.target);
        botResponse = responseObj.response;
    } else {
        botResponse = `I'm sorry, I couldn't understand that. Could you try asking something like "What is smart farming?" or "What are the benefits of precision farming?"`;
    }

    res.json({ response: botResponse });
});

// Start the server
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
