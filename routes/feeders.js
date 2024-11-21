const express = require("express");
const connection = require("../config/connection");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var auth = require("../services/authentication");

router.use(express.json());


router.get(
    "/get_feeders",
    auth.authenticateToken,
    async (req, res) => {
      const signedin_user = res.locals.id;
      const selectQuery = "SELECT * FROM feeder where feedermapped = 1";
      connection.query(selectQuery,  (err, results) => {
        if (err) {
        //   logger.error(
        //     `- ${signedin_user} - ${new Date()} - feeder fetch history  error:`,
        //     err
        //   );
        return res.status(500).json({ message: err.message });
        } else {
        //   logger.info(
        //     `feeder fetch Successfully - ${signedin_user} - ${new Date()}`
        //   );
          return res.status(201).json({ results });
        }
      });
    }
  );


  router.get("/get_feeders/:id", auth.authenticateToken, async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const signedin_user = res.locals.id;
    const selectQuery =
      "SELECT * FROM feeder WHERE feedermapped = 1 AND gstationid = $1";
    
    connection.query(selectQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        return res.status(201).json({ results });
      }
    });
});



  router.get(
    "/get_gridstations",
    auth.authenticateToken,
    async (req, res) => {
      const signedin_user = res.locals.id;
      const selectQuery = "SELECT * FROM grid_stations";
      connection.query(selectQuery,  (err, results) => {
        if (err) {
        //   logger.error(
        //     `- ${signedin_user} - ${new Date()} - feeder fetch history  error:`,
        //     err
        //   );
          return res.status(500).json({ message: err.sqlMessage });
        } else {
        //   logger.info(
        //     `feeder fetch Successfully - ${signedin_user} - ${new Date()}`
        //   );
          return res.status(201).json({ results });
        }
      });
    }
  );


  // router.get("/get_section_equipment/:id", auth.authenticateToken, async (req, res) => {
  //   const id = req.params.id;
    
  //   const selectQuery = `
  //     SELECT 
  //       s.object_id, s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n, 
  //       s.wo_id AS section_wo_id, ST_AsGeoJSON(ST_Transform(s.geom, 4326)) AS section_geometry, 
  //       s.section_id, s.substation AS section_substation, s.feeder_code AS section_feeder_code, 
  //       s.feeder, s.line_voltage AS section_line_voltage, s.pole_number AS section_pole_number, 
  //       s.pole_phase AS section_pole_phase, 
  //       e.pole_type, e.transformer_mounting, e.equip_type, e.equip_use, 
  //       e.feeders_on_pole, e.rs_con, e.rs_con1, e.rs_con3, e.sc_con, e.lc_con, 
  //       e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con, e.transformer_make, 
  //       e.wo_id AS equipment_wo_id, ST_AsGeoJSON(ST_Transform(e.geom, 4326)) AS equipment_geometry, 
  //       e.objectid AS equipment_objectid, e.equip_unit, e.sequence, e.end_type, 
  //       e.substation AS equipment_substation, e.feeder_code AS equipment_feeder_code, 
  //       e.s_e, e.gps_no, e.line_voltage AS equipment_line_voltage, 
  //       e.pole_number AS equipment_pole_number, e.pole_phase AS equipment_pole_phase, 
  //       e.pole_use, e.pole_height, e.equip_number, e.equip_size, e.equip_phase, 
  //       e.equip_status, e.consumer_name, e.transformer_location, e.angle, e.tap_pole, 
  //       e.section_id AS equipment_section_id, e.remarks 
  //     FROM feeder f 
  //     JOIN section2 s ON (f.feeder_code = s.feeder_code) 
  //     JOIN equipment2 e ON (f.feeder_code = e.feeder_code) 
  //     WHERE f.feeder_code = $1;
  //   `;
  
  //   connection.query(selectQuery, [id], (err, results) => {
  //     if (err) {
  //       return res.status(500).json({ message: err.message });
  //     } else {
  //       return res.status(200).json({ results: results.rows });
  //     }
  //   });
  // });
  
  
  router.get("/get_section_equipment/:id", auth.authenticateToken, async (req, res) => {
    const id = req.params.id;  // Get feeder_code from URL params
    const signedin_user = res.locals.id;  // Assuming you are storing user ID after authentication
    const selectQuery = `
      SELECT  
        cp.name as "phase_cond", cp.shortname,s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n,
        ST_AsGeoJSON(ST_Transform(s.geom, 4326)) AS section_geometry, 
        s.section_id, 
        s.pole_number AS section_pole_number, 
        s.pole_phase AS section_pole_phase, e.rs_con, e.rs_con1, e.rs_con3, e.sc_con, e.lc_con, 
        e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con, 
        ST_AsGeoJSON(ST_Transform(e.geom, 4326)) AS equipment_geometry, 
       e.sequence,
        e.s_e, e.gps_no, e.equip_type,
        e.pole_number AS equipment_pole_number, 
        e.pole_phase AS equipment_pole_phase, 
        e.equip_number, 
        e.equip_size, e.equip_phase, 
        e.equip_status, e.consumer_name,         
        e.section_id AS equipment_section_id, 
        e.remarks 
      FROM feeder f 
      JOIN section2 s ON (f.feeder_code = s.feeder_code) 
      JOIN equipment2 e ON (f.feeder_code = e.feeder_code) 
      join conductor_phase cp ON (s.con_size_a = cp.id)
      WHERE f.feeder_code = $1  and  e.equip_type = 2 limit 1 `;
      
    
  
    try {
      const results = await new Promise((resolve, reject) => {
        connection.query(selectQuery, [id], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
  
      // Check if results are empty
      if (results.rows.length === 0) {
        return res.status(404).json({ message: 'No equipment found for this feeder code.' });
      }
  
      // Transform the geometries into coordinates
      const transformedResults = results.rows.map(row => {
        // Parse the section geometry and equipment geometry
        const sectionGeometry = row.section_geometry ? JSON.parse(row.section_geometry) : null;
        const equipmentGeometry = row.equipment_geometry ? JSON.parse(row.equipment_geometry) : null;
  
        // Extract the coordinates from the geometries
        return {
          ...row,
          section_geometry: sectionGeometry ? sectionGeometry.coordinates : null,
          equipment_geometry: equipmentGeometry ? equipmentGeometry.coordinates : null
        };
      });
  
      return res.status(200).json({ results: transformedResults });
    } catch (error) {
      console.error('Database query failed:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
router.post(
  "/add_analysisparameter",
  auth.authenticateToken,
  async (req, res) => {
    try {
      const data = req.body; // Array or single object
      const timestamp = new Date(); // Current timestamp
      
      // Convert input to an array if it's a single object
      const records = Array.isArray(data) ? data : [data];

      const insertPromises = records.map((record) => {
        return connection.query(
          `
          INSERT INTO analysis_parametr (
            grid_station_name,
            feeder_name,
            feeder_code,
            ct_ratio,
            cable_size,
            cable_length,
            load,
            date,
            time,
            kwh_units_consumption,
            kvarh_units_consumption,
            power_factor,
            operation_circle
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
          `,
          [
            "Grid Station", // Replace with actual data if available
            record.feeder_name,  // Replace with actual data if available
            parseInt(record.feeder_code, 10),
            parseInt(record.ct_ratio.split("/")[0], 10), // Convert "400/5" to 400
            parseInt(record.cable_size.replace(/[^0-9]/g, ""), 10), // Extract 500 from "500MCM"
            parseInt(record.cable_length.replace(/[^0-9]/g, ""), 10), // Extract 35 from "35 M"
            record.load,
            timestamp.toISOString().split("T")[0], // Current date
            timestamp.toISOString().split("T")[1].slice(0, 8), // Current time
            parseInt(record.kwh_units_consumption, 10),
            record.kvarh_units_consumption,
            Math.round(record.powerFactor * 1000), // Convert float to integer
            record.operation_circle
          ]
        );
      });

      await Promise.all(insertPromises);

      res.status(201).json({ message: "Records inserted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to insert data" });
    }
  }
);

module.exports = router;

module.exports = router;