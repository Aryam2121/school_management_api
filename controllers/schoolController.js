const db = require('../config/db');
const calculateDistance = require('../utils/distanceCalculator');

// Add a School
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Latitude and Longitude must be numbers.' });
  }

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};

// List Schools sorted by proximity
exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'User latitude and longitude are required.' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Latitude and Longitude must be numbers.' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        school.latitude,
        school.longitude
      )
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ schools: schoolsWithDistance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};
