const db = require('../config/db');

const getSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const query = `
        SELECT 
            *,
            (
                6371 * acos(
                    cos(radians(?)) * 
                    cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(?)) + 
                    sin(radians(?)) * 
                    sin(radians(latitude))
                )
            ) AS distance
        FROM schools
        HAVING distance < 50
        ORDER BY distance
    `;

    db.execute(query, [latitude, longitude, latitude], (err, results) => {
        if (err) {
            console.error('Error in getSchools:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

const addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ error: 'Invalid latitude or longitude range' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';

    db.promise().query(query, [name, address, latitude, longitude])
        .then(result => {
            res.status(201).json({
                message: 'School added successfully',
                schoolId: result[0].insertId
            });
        })
        .catch(error => {
            console.error('Error in addSchool:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

module.exports = {
    getSchools,
    addSchool
};
