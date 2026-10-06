require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000
const API_KEY = process.env.OPEN_OPENWEATHER_API_KEY


const frontendPath = path.join(__dirname, '..', "frontend");
app.use(cors());
app.use(express.static(frontendPath));
app.use(express.json());

if (!API_KEY) {
    console.error(`please provide API_KEY`);
    process.exit(1);
}



app.get("/api/weather", async (req, res) => {

    const city = req.query.city
    if (!city) {
        return res.json({ message: "please provide a city " })
    }
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        const weatherRes = await fetch(url);
        const data = await weatherRes.json();

        console.log(data)

        if (weatherRes.status === 404) {
            return res.status(404).json({ message: `${city}not found` })

        }
        if (!weatherRes.ok) {
            return res.status(502).json({ error: `server is down` })
        }
        res.json({
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            humidity: data.main.humidity,
            id: data.id
        })

    } catch (error) {
        return res.status(500).json({ message: `` });
    }

})
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})