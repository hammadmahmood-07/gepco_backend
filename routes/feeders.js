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
    const selectQuery = "SELECT * FROM feeder where feedermapped = 1 and feeder_code = '108803'";
    connection.query(selectQuery, (err, results) => {
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

  const signedin_user = res.locals.id;

  //console.log(id);
  const selectQuery =
    "SELECT feeder_code, feeder_name FROM feeder WHERE feedermapped = 1 AND gstationid = $1";

  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      const result = results.rows;
      //console.log(result);
      return res.status(201).json({ result });
    }
  });
});



router.get(
  "/get_gridstations",
  auth.authenticateToken,
  async (req, res) => {
    const signedin_user = res.locals.id;
    const selectQuery = "SELECT * FROM grid_stations";
    connection.query(selectQuery, (err, results) => {
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



// router.get("/get_section_equipment/:id", auth.authenticateToken, async (req, res) => {
//   const id = req.params.id;  // Get feeder_code from URL params

//   const selectQuery = `
//     SELECT  
//     s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n,
//     s.section_id, 
//     s.pole_number AS section_pole_number, 
//     s.pole_phase AS section_pole_phase,
//     e.equip_size,
//     e.rs_con, e.rs_con1, e.rs_con3, e.sc_con, e.lc_con, 
//       e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con,   
//     ST_Length(ST_Transform(s.geom, 4326)::geography) AS section_length_meters,  -- Transform section geom
//     ST_Length(ST_Transform(e.geom, 4326)::geography) AS equipment_length_meters -- Transform equipment geom
// FROM section2 s
// LEFT JOIN equipment2 e
//   ON s.pole_number = e.pole_number AND e.equip_type = 2
// WHERE s.feeder_code = $1
//   `;

//   try {
//     const results = await new Promise((resolve, reject) => {
//       connection.query(selectQuery, [id], (err, results) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(results);
//       });
//     });

//     // Check if results are empty
//     if (results.rows.length === 0) {
//       return res.status(404).json({ message: 'No equipment found for this feeder code.' });
//     }

//     // Transform results to include calculated geometry details
//     const transformedResults = results.rows.map(row => ({
//       ...row,
//       section_length_meters: parseFloat(row.section_length_meters) || null,
//       equipment_length_meters: parseFloat(row.equipment_length_meters) || null
//     }));

//     return res.status(200).json({ results: transformedResults });
//   } catch (error) {
//     console.error('Database query failed:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


// router.post(
//   "/add_analysisparameter",
//   auth.authenticateToken,
//   async (req, res) => {
//     try {
//       const data = req.body; // Array or single object
//       console.log(data)
//       const timestamp = new Date(); // Current timestamp

//       // Convert input to an array if it's a single object
//       const records = Array.isArray(data) ? data : [data];

//       // Array to hold inserted IDs
//       const insertedIds = [];

//       // Insert each record and return its ID
//       for (const record of records) {
//         if(record.selectedOption === 'manual'){
//           const formattedMonth = new Date(record.month);
//       const formattedMonthString = formattedMonth.toISOString().slice(0, 7); // Format as 'YYYY-MM'
//       // Append '-31' to make it a valid date (assumes the last day of the month)
//       const validDateFormat = `${formattedMonthString}-31`;

//           const result = await connection.query(
//             `
//             INSERT INTO analysis_parametr (
//               grid_station_name,
//               feeder_name,
//               feeder_code,
//               load,
//               date,
//               power_factor
//             ) VALUES (
//               $1, $2, $3, $4, $5, $6
//             )
//             RETURNING analysis_parametr_id;
//             `,
//             [
//               record.gstationid, // Replace with actual data if available
//               record.feeder_name, // Replace with actual data if available
//               parseInt(record.feeder_code, 10),
//               record.maximumCurrent,
//               validDateFormat,     
//               Math.round(record.powerFactor * 1000), // Convert float to integer
//             ]
//           );
//         }
//         else{
//           const result = await connection.query(
//             `
//             INSERT INTO analysis_parametr (
//               grid_station_name,
//               feeder_name,
//               feeder_code,
//               ct_ratio,
//               cable_size,
//               cable_length,
//               load,
//               date,
//               time,
//               kwh_units_consumption,
//               kvarh_units_consumption,
//               power_factor,
//               operation_circle
//             ) VALUES (
//               $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
//             )
//             RETURNING analysis_parametr_id;
//             `,
//             [
//               "Grid Station", // Replace with actual data if available
//               record.feeder_name, // Replace with actual data if available
//               parseInt(record.feeder_code, 10),
//               parseInt(record.ct_ratio.split("/")[0], 10), // Convert "400/5" to 400
//               parseInt(record.cable_size.replace(/[^0-9]/g, ""), 10), // Extract 500 from "500MCM"
//               parseInt(record.cable_length.replace(/[^0-9]/g, ""), 10), // Extract 35 from "35 M"
//               record.load,
//               timestamp.toISOString().split("T")[0], // Current date
//               timestamp.toISOString().split("T")[1].slice(0, 8), // Current time
//               parseInt(record.kwh_units_consumption, 10),
//               record.kvarh_units_consumption,
//               Math.round(record.powerFactor * 1000), // Convert float to integer
//               record.operation_circle,
//             ]
//           );
//         }


//         // Push the ID of the inserted record to the array
//         insertedIds.push(result.rows[0].analysis_parametr_id);
//       }

//       res.status(201).json({
//         message: "Records inserted successfully!",
//         insertedIds, // Return all inserted IDs
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to insert data" });
//     }
//   }
// );

router.get("/get_section_equipment/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id; // Get feeder_code from URL params

  const selectQuery = `
                       SELECT  
                                  s.con_size_a, 
                                  s.con_size_b, 
                                  s.con_size_c, 
                                  s.con_size_n,
                                  s.section_id, 
                                  s.pole_number AS section_pole_number, 
                                  s.pole_phase AS section_pole_phase,	
                                  e.equip_size,
                                  e.equip_type,
                                  e.pole_type,
                                  e.rs_con, 
                                  e.rs_con1, 
                                  e.rs_con3, 
                                  e.sc_con, 
                                  e.lc_con, 
                                  e.si_con, 
                                  e.li_con, 
                                  e.pb_con, 
                                  e.ag_con, 
                                  e.st_con,   
                                  ST_Length(ST_Transform(s.geom, 4326)::geography) AS section_length_meters,
                                  ST_Length(ST_Transform(e.geom, 4326)::geography) AS equipment_length_meters,
                                  ST_X(ST_Transform(ST_StartPoint(s.geom), 4326)) AS start_x,
                                  ST_Y(ST_Transform(ST_StartPoint(s.geom), 4326)) AS start_y,
                                  ST_X(ST_Transform(ST_EndPoint(s.geom), 4326)) AS end_x,
                                  ST_Y(ST_Transform(ST_EndPoint(s.geom), 4326)) AS end_y,
                                  ST_X(ST_Transform(ST_StartPoint(e.geom), 4326)) AS equip_start_x,
                                  ST_Y(ST_Transform(ST_StartPoint(e.geom), 4326)) AS equip_start_y,
                                  ST_X(ST_Transform(ST_EndPoint(e.geom), 4326)) AS equip_end_x,
                                  ST_Y(ST_Transform(ST_EndPoint(e.geom), 4326)) AS equip_end_y,
                                  cp.name AS conductor_name,
                                  cp.ratingname, 
                                  cp.resistance, 
                                  cp.reactance,
                                  cp.amp_rating,
                                  td.iron_loss,
                                  td.copper_loss,
                                  (td.iron_loss + td.copper_loss) * COUNT(e.equip_size) OVER (PARTITION BY e.equip_size) AS total_loss
                              FROM section2 s
                              LEFT JOIN equipment2 e
                                ON s.pole_number = e.pole_number 
                                AND e.equip_type = 8
                              LEFT JOIN conductor_phase cp  
                                ON s.con_size_a = cp.id  
                              LEFT JOIN transformer_loss td  
                              on e.equip_size::NUMERIC = td.transformer_size
                              WHERE s.feeder_code = $1
                                AND s.pole_phase = 'R-Y-B'
                              GROUP BY 
                                  s.con_size_a, 
                                  s.con_size_b, 
                                  s.con_size_c, 
                                  s.con_size_n,
                                  s.section_id, 
                                  s.pole_number, 
                                  s.pole_phase,
                                  e.equip_size,
                                  e.equip_type,
                                  e.rs_con, 
                                  e.rs_con1, 
                                  e.rs_con3, 
                                  e.sc_con, 
                                  e.lc_con, 
                                  e.si_con, 
                                  e.li_con, 
                                  e.pb_con, 
                                  e.ag_con, 
                                  e.st_con,   
                                  s.geom, 
                                  e.geom,
                                  e.pole_type,
                                  cp.name,
                                  cp.ratingname,
                                  cp.resistance, 
                                  cp.reactance,
                                  cp.amp_rating,
                                  td.iron_loss,
                                  td.copper_loss;              
                  `;

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

    // Transform results to include calculated geometry details
    const transformedResults = results.rows.map(row => ({
      ...row,
      section_length_meters: parseFloat(row.section_length_meters) || null,
      equipment_length_meters: parseFloat(row.equipment_length_meters) || null,
      start_coordinates: row.start_x && row.start_y ? { x: parseFloat(row.start_x), y: parseFloat(row.start_y) } : null,
      end_coordinates: row.end_x && row.end_y ? { x: parseFloat(row.end_x), y: parseFloat(row.end_y) } : null
    }));

    return res.status(200).json({ results: transformedResults });
  } catch (error) {
    console.error('Database query failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/get_equipment/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id; // Get feeder_code from URL params



  const selectQuery = `SELECT equip_type, equip_size, ST_X(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_x,
                    ST_Y(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_y FROM equipment2 where feeder_code = $1 AND equip_type = 8`;
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
    const result = results.rows;
    return res.status(200).json({ result });
  }
  catch (error) {
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
      console.log(data)
      const timestamp = new Date(); // Current timestamp

      // Convert input to an array if it's a single object
      const records = Array.isArray(data) ? data : [data];

      // Array to hold inserted IDs
      const insertedIds = [];

      // Insert each record and return its ID
      for (const record of records) {
        let result; // Declare result variable outside the blocks

        if (record.selectedOption === 'manual') {
          const formattedMonth = new Date(record.month);
          const formattedMonthString = formattedMonth.toISOString().slice(0, 7); // Format as 'YYYY-MM'
          // Append '-31' to make it a valid date (assumes the last day of the month)
          const validDateFormat = `${formattedMonthString}-31`;

          result = await connection.query(
            `INSERT INTO analysis_parametr (
              grid_station_name,
              feeder_name,
              feeder_code,
              load,
              date,
              power_factor
            ) VALUES (
              $1, $2, $3, $4, $5, $6
            ) RETURNING analysis_parametr_id;`,
            [
              record.gstationid, // Replace with actual data if available
              record.feeder_name, // Replace with actual data if available
              parseInt(record.feeder_code, 10),
              record.maximumCurrent,
              validDateFormat,
              Math.round(record.powerFactor * 1000), // Convert float to integer
            ]
          );
        }
        else {
          result = await connection.query(
            `INSERT INTO analysis_parametr (
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
            ) RETURNING analysis_parametr_id;`,
            [
              "Grid Station", // Replace with actual data if available
              record.feeder_name, // Replace with actual data if available
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
              record.operation_circle,
            ]
          );
        }

        // Push the ID of the inserted record to the array
        insertedIds.push(result.rows[0].analysis_parametr_id);
      }

      res.status(201).json({
        message: "Records inserted successfully!",
        insertedIds, // Return all inserted IDs
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to insert data" });
    }
  }
);


router.post(
  "/add_feedersummary",
  auth.authenticateToken,
  async (req, res) => {
    try {
      const data = req.body; // Assuming `req.body` is an array of records

      if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: "Invalid data format or empty array." });
      }

      const query = `
                INSERT INTO analysis_feeder_summary (
                  fs, demand_kw, demand_kva, demand_pct_pf, demand_amps,
                  amps_n, conn_customer, conn_kva, kw_loss_pct, kw_loss_line,
                  kw_loss_tran, kw_loss_reg, demand_kva_r, demand_kva_y, demand_kva_b,
                  power_factor_r, power_factor_y, power_factor_b, amps_r, amps_y, amps_b,
                  customer_count_r, customer_count_y, customer_count_b,
                  pct_loading_r, pct_loading_y, pct_loading_b,
                  minimum_section_id, minimum_volts, maximum_section_id,
                  maximum_volts, maximum_section_pct_loading
                )
                VALUES ${data.map((_, i) =>
        `(${Array(32)
          .fill(0)
          .map((_, j) => `$${i * 32 + j + 1}`)
          .join(", ")})`
      ).join(", ")}
                RETURNING source_id;
              `;

      const values = data.flatMap(record => [
        record.feeder_code,
        record.demand_kW,
        record.demand_kva,
        record.demand_pct_pf,
        record.demand_amps,
        record.amps_n,
        record.CON_customer,
        record.CON_kVA,
        record.kw_loss_pct,
        record.kw_loss_line,
        record.kw_loss_tran,
        record.kw_loss_reg,
        record.demand_kva_r,
        record.demand_kva_y,
        record.demand_kva_b,
        record.power_factor_r,
        record.power_factor_y,
        record.power_factor_b,
        record.amps_r,
        record.amps_y,
        record.amps_b,
        record.customer_count_r,
        record.customer_count_y,
        record.customer_count_b,
        record.pct_loading_r,
        record.pct_loading_y,
        record.pct_loading_b,
        record.minimum_section_id,
        record.minimum_volts,
        record.maximum_section_id,
        record.maximum_volts,
        record.maximum_section_pct_loading,
      ]);

      const result = await connection.query(query, values);

      res.status(201).json({
        message: "Data inserted successfully.",
        insertedIds: result.rows.map(row => row.source_id),
      });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ message: "Failed to insert data.", error: error.message });
    }
  }
);

// router.get(
//   "/get_admin_boundary",
//   auth.authenticateToken,
//   async (req, res) => {
//     const signedin_user = res.locals.id;
//               const selectQuery = `Select f.feeder_code, f.feeder_name,ogf.feeder_id, o1.name as "Sub Division", o2.name as "Division", o3.name as "Circle" 
//           from organization_feeders ogf
//           join organization o1 on (o1.org_id = ogf.org_id)
//           join organization o2 on (o1.parent_org_id = o2.org_id)
//           join organization o3 on (o2.parent_org_id = o3.org_id) 
//           join feeder f on (f.id = ogf.org_feeder_id)`;
//     connection.query(selectQuery, (err, results) => {
//       if (err) {
//         //   logger.error(
//         //     `- ${signedin_user} - ${new Date()} - feeder fetch history  error:`,
//         //     err
//         //   );
//         return res.status(500).json({ message: err.message });
//       } else {
//         //   logger.info(
//         //     `feeder fetch Successfully - ${signedin_user} - ${new Date()}`
//         //   );
//         return res.status(201).json({ results });
//       }
//     });
//   }
// );

router.get(
  "/get_admin_boundary",
  auth.authenticateToken,
  async (req, res) => {
    const query = `
                        SELECT 
                          f.feeder_code, 
                          f.feeder_name, 
                          ogf.feeder_id, 
                          o1.name AS "subDivision", 
                          o2.name AS "division", 
                          o3.name AS "circle"
                        FROM 
                          organization_feeders ogf
                        JOIN 
                          organization o1 ON (o1.org_id = ogf.org_id)
                        JOIN 
                          organization o2 ON (o1.parent_org_id = o2.org_id)
                        JOIN 
                          organization o3 ON (o2.parent_org_id = o3.org_id)
                        JOIN 
                          feeder f ON (f.id = ogf.org_feeder_id)
                        ORDER BY 
                          o3.name, o2.name, o1.name, f.feeder_name;
                      `;

    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed' });
      }

      // Transform the results into a nested structure

      // if (!Array.isArray(results)) {
      //   return res.status(500).json({ error: 'Unexpected result format' });
      // }

      const tree = [];
      const rows = results.rows || [];
      rows.forEach((row) => {
        // Find or create the Circle node
        let circleNode = tree.find((node) => node.label === row.circle);
        if (!circleNode) {
          circleNode = { label: row.circle, children: [] };
          tree.push(circleNode);
        }

        // Find or create the Division node
        let divisionNode = circleNode.children.find(
          (node) => node.label === row.division
        );
        if (!divisionNode) {
          divisionNode = { label: row.division, children: [] };
          circleNode.children.push(divisionNode);
        }

        // Find or create the Sub Division node
        let subDivisionNode = divisionNode.children.find(
          (node) => node.label === row.subDivision
        );
        if (!subDivisionNode) {
          subDivisionNode = { label: row.subDivision, children: [] };
          divisionNode.children.push(subDivisionNode);
        }

        // Add the Feeder as a leaf node
        subDivisionNode.children.push({
          label: row.feeder_name,
          data: {
            feeder_code: row.feeder_code,
            feeder_id: row.feeder_id,
          },
        });
      });

      //console.log(tree);
      res.json({ results: tree });
    });
  });

router.get(
  "/get_transformerLoss",
  auth.authenticateToken,
  async (req, res) => {
    const signedin_user = res.locals.id;
    const selectQuery = "SELECT * FROM transformer_loss";
    connection.query(selectQuery, (err, results) => {
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

module.exports = router;