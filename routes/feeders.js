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
//   const id = req.params.id; // Get feeder_code from URL params
//   const ht_ltvalue = req.query.ht_ltvalue; // Get the additional parameter
//   const feederType = req.query.feederType;
//   console.log(id);
//   if (ht_ltvalue == 'ht') {
//     ht_lt = 3;
//   } else {
//     ht_lt = 2;
//   }

//   const selectQuery = `
//                        SELECT DISTINCT ON (s.pole_number)  
//     s.con_size_a, 
//     s.con_size_b, 
//     s.con_size_c, 
//     s.con_size_n,
//     s.section_id, 
//     s.pole_number AS section_pole_number, 
//     s.pole_phase AS section_pole_phase,    
//     e.equip_size,
//     e.equip_type,
//     e.pole_type,
//     e.rs_con, 
//     e.rs_con1, 
//     e.rs_con3, 
//     e.sc_con, 
//     e.lc_con, 
//     e.si_con, 
//     e.li_con, 
//     e.pb_con, 
//     e.ag_con, 
//     e.st_con,   
//     ST_Length(ST_Transform(s.geom, 4326)::geography) AS section_length_meters,
//     ST_Length(ST_Transform(e.geom, 4326)::geography) AS equipment_length_meters,
//     ST_X(ST_Transform(ST_StartPoint(s.geom), 4326)) AS start_x,
//     ST_Y(ST_Transform(ST_StartPoint(s.geom), 4326)) AS start_y,
//     ST_X(ST_Transform(ST_EndPoint(s.geom), 4326)) AS end_x,
//     ST_Y(ST_Transform(ST_EndPoint(s.geom), 4326)) AS end_y,
//     ST_X(ST_Transform(ST_StartPoint(e.geom), 4326)) AS equip_start_x,
//     ST_Y(ST_Transform(ST_StartPoint(e.geom), 4326)) AS equip_start_y,
//     ST_X(ST_Transform(ST_EndPoint(e.geom), 4326)) AS equip_end_x,
//     ST_Y(ST_Transform(ST_EndPoint(e.geom), 4326)) AS equip_end_y,
//     cp.name AS conductor_name,
//     cp.ratingname, 
//     cp.resistance, 
//     cp.reactance,
//     cp.amp_rating,
//     td.iron_loss,
//     td.copper_loss,
//     SUM(td.iron_loss + td.copper_loss) AS total_loss
// FROM section2 s
// LEFT JOIN equipment2 e
//     ON s.pole_number = e.pole_number 
//     AND e.equip_type IN ($2,8)
//     AND e.feeder_code = s.feeder_code  -- Add this line
//     AND e.pole_phase = s.pole_phase   -- Add this line
// LEFT JOIN conductor_phase cp  
//     ON s.con_size_a = cp.id  
// LEFT JOIN transformer_loss td  
//     ON e.equip_size::NUMERIC = td.transformer_size
// WHERE s.feeder_code = $1  
//     AND s.pole_phase = 'R-Y-B'
// GROUP BY 
//     s.con_size_a, 
//     s.con_size_b, 
//     s.con_size_c, 
//     s.con_size_n,
//     s.section_id, 
//     s.pole_number, 
//     s.pole_phase,
//     e.equip_size,
//     e.equip_type,
//     e.rs_con, 
//     e.rs_con1, 
//     e.rs_con3, 
//     e.sc_con, 
//     e.lc_con, 
//     e.si_con, 
//     e.li_con, 
//     e.pb_con, 
//     e.ag_con, 
//     e.st_con,   
//     s.geom, 
//     e.geom,
//     e.pole_type,
//     cp.name,
//     cp.ratingname,
//     cp.resistance, 
//     cp.reactance,
//     cp.amp_rating,
//     td.iron_loss,
//     td.copper_loss;              
//                   `;

//   try {
//     const results = await new Promise((resolve, reject) => {
//       connection.query(selectQuery, [id, ht_lt], (err, results) => {
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


//     // Calculate sum of equip_size
//     const sumEquipSize = results.rows.reduce((sum, row) => {
//       return sum + (parseFloat(row.equip_size) || 0);
//     }, 0);

//     //console.log("Total equip_size sum:", sumEquipSize);

//     // Transform results to include calculated geometry details
//     const transformedResults = results.rows.map(row => ({
//       ...row,
//       section_length_meters: parseFloat(row.section_length_meters) || null,
//       equipment_length_meters: parseFloat(row.equipment_length_meters) || null,
//       start_coordinates: row.start_x && row.start_y ? { x: parseFloat(row.start_x), y: parseFloat(row.start_y) } : null,
//       end_coordinates: row.end_x && row.end_y ? { x: parseFloat(row.end_x), y: parseFloat(row.end_y) } : null
//     }));

//     return res.status(200).json({ results: transformedResults });
//   } catch (error) {
//     console.error('Database query failed:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.get("/get_section_equipment/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id; // This could be feeder_code or equip_number
  const ht_ltvalue = req.query.ht_ltvalue; // 'ht' or 'lt'
  const feederType = req.query.feederType; // 'HT' or 'LT'
  //console.log(feederType);
  let ht_lt;
  if (ht_ltvalue === 'ht') {
    ht_lt = 3;
  } else {
    ht_lt = 2;
  }

  try {
    let selectQuery = '';
    let values = [];

    if (feederType === 'HT') {
      selectQuery = `
        SELECT DISTINCT ON (s.pole_number)  
          s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n,
          s.section_id, s.pole_number AS section_pole_number, s.pole_phase AS section_pole_phase,
          e.equip_size, e.equip_type, e.pole_type,
          e.rs_con, e.rs_con1, e.rs_con3, e.sc_con, e.lc_con, e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con,
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
          cp.name AS conductor_name, cp.ratingname, cp.resistance, cp.reactance, cp.amp_rating,
          td.iron_loss, td.copper_loss,
          SUM(td.iron_loss + td.copper_loss) AS total_loss
        FROM section2 s
        LEFT JOIN equipment2 e
          ON s.pole_number = e.pole_number 
          AND e.equip_type IN ($2, 8)
          AND e.feeder_code = s.feeder_code
          AND e.pole_phase = s.pole_phase
        LEFT JOIN conductor_phase cp ON s.con_size_a = cp.id
        LEFT JOIN transformer_loss td ON e.equip_size::NUMERIC = td.transformer_size
        WHERE s.feeder_code = $1 AND s.pole_phase = 'R-Y-B'
        GROUP BY s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n,
          s.section_id, s.pole_number, s.pole_phase,
          e.equip_size, e.equip_type, e.rs_con, e.rs_con1, e.rs_con3,
          e.sc_con, e.lc_con, e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con,
          s.geom, e.geom, e.pole_type, cp.name, cp.ratingname,
          cp.resistance, cp.reactance, cp.amp_rating, td.iron_loss, td.copper_loss;
      `;
      values = [id, ht_lt];
    } else if (feederType === 'LT') {
      selectQuery = `
        SELECT DISTINCT ON (s.pole_number)  
          s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n,
          s.section_id, s.pole_number AS section_pole_number, s.pole_phase AS section_pole_phase,
          e.equip_size, e.equip_type, e.pole_type,
          e.rs_con, e.rs_con1, e.rs_con3, e.sc_con, e.lc_con, e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con,
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
          cp.name AS conductor_name, cp.ratingname, cp.resistance, cp.reactance, cp.amp_rating,
          td.iron_loss, td.copper_loss,
          SUM(td.iron_loss + td.copper_loss) AS total_loss
        FROM section2 s
        LEFT JOIN equipment2 e
          ON s.pole_number = e.pole_number 
          AND e.equip_type IN ($2, 8)
          AND e.pole_phase = s.pole_phase
        LEFT JOIN conductor_phase cp ON s.con_size_a = cp.id
        LEFT JOIN transformer_loss td ON e.equip_size::NUMERIC = td.transformer_size
        WHERE (s.feeder_code = $1 OR e.equip_number = $1)
          AND s.pole_phase = 'R-Y-B'
        GROUP BY s.con_size_a, s.con_size_b, s.con_size_c, s.con_size_n,
          s.section_id, s.pole_number, s.pole_phase,
          e.equip_size, e.equip_type, e.rs_con, e.rs_con1, e.rs_con3,
          e.sc_con, e.lc_con, e.si_con, e.li_con, e.pb_con, e.ag_con, e.st_con,
          s.geom, e.geom, e.pole_type, cp.name, cp.ratingname,
          cp.resistance, cp.reactance, cp.amp_rating, td.iron_loss, td.copper_loss;
      `;
      values = [id, ht_lt];
    } else {
      return res.status(400).json({ message: "Invalid feederType. Must be HT or LT." });
    }

    const { rows } = await connection.query(selectQuery, values);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No equipment found for this feeder code or transformer.' });
    }

    // Calculate total equip_size
    const totalEquipSize = rows.reduce((sum, row) => sum + (parseFloat(row.equip_size) || 0), 0);

    // Format response with geometry details
    const formattedRows = rows.map(row => ({
      ...row,
      section_length_meters: parseFloat(row.section_length_meters) || null,
      equipment_length_meters: parseFloat(row.equipment_length_meters) || null,
      start_coordinates: row.start_x && row.start_y ? { x: parseFloat(row.start_x), y: parseFloat(row.start_y) } : null,
      end_coordinates: row.end_x && row.end_y ? { x: parseFloat(row.end_x), y: parseFloat(row.end_y) } : null
    }));

    res.status(200).json({ results: formattedRows, totalEquipSize });

  } catch (error) {
    console.error('Database query failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// router.get("/get_equipment/:id", auth.authenticateToken, async (req, res) => {
//   const id = req.params.id; // Get feeder_code from URL params
// console.log(id);


//   const selectQuery = `SELECT equip_type, equip_size, ST_X(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_x,
//                     ST_Y(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_y FROM equipment2 where feeder_code = $1 AND equip_type = 3`;
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
//     const result = results.rows;
//     return res.status(200).json({ result });
//   }
//   catch (error) {
//     console.error('Database query failed:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


router.get("/get_equipment/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id; // Could be feeder_code or equip_number (e.g., 'T-12345')

  let selectQuery = '';
  let values = [];

  if (id.startsWith('T-')) {
    // Case: equipment number (LT)
    selectQuery = `
      SELECT equip_type, equip_size, 
             ST_X(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_x,
             ST_Y(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_y 
      FROM equipment2 
      WHERE equip_number = $1 AND equip_type = 2
    `;
    values = [id];
  } else {
    // Case: HT feeder code
    selectQuery = `
      SELECT equip_type, equip_size, 
             ST_X(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_x,
             ST_Y(ST_Transform(ST_StartPoint(geom), 4326)) AS equip_start_y 
      FROM equipment2 
      WHERE feeder_code = $1 AND equip_type = 3
    `;
    values = [id];
  }

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(selectQuery, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'No equipment found for this ID.' });
    }

    return res.status(200).json({ result: results.rows });
  } catch (error) {
    console.error('Database query failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post(
  "/add_analysisparameter",
  auth.authenticateToken,
  async (req, res) => {
    //console.log(req.body);
    try {
      const data = req.body; // Array or single object
      // console.log(data)
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
          const year = formattedMonth.getFullYear();
          const month = formattedMonth.getMonth() + 1; // getMonth() returns 0-11, so add 1

          // Get the last day of the month dynamically
          const lastDay = new Date(year, month, 0).getDate();
          const validDateFormat = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

          result = await connection.query(
            `INSERT INTO analysis_parametr (
              grid_station_name,
              feeder_name,
              feeder_code,
              load,
              date,
              power_factor,
              analysis_parameter_type,
              type
            ) VALUES (
              $1, $2, $3, $4, $5, $6 , $7,'HT-LT'
            ) RETURNING analysis_parametr_id;`,
            [
              "Grid Station", // Replace with actual data if available
              record.feeder_name, // Replace with actual data if available
              record.feeder_code, 
              record.maximumCurrent,
              validDateFormat,
              Math.round(record.powerFactor * 1000), // Convert float to integer
              record.checklt_ht
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
              operation_circle,
              analysis_parameter_type
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            ) RETURNING analysis_parametr_id;`,
            [
              "Grid Station", // Replace with actual data if available
              record.feeder_name, // Replace with actual data if available
              record.feeder_code,
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
              record.checklt_ht
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
                  conn_customer, conn_kva, kw_loss_pct, kw_loss_line, kw_loss_tran, kw_loss_reg,
                  pct_loading_r, pct_loading_y, pct_loading_b,
                  minimum_section_id, minimum_volts, maximum_section_id, maximum_volts,
                  maximum_section_pct_loading, analysis_parametr_id, feeder_code, type
                )
                VALUES ${data.map((_, i) =>
                `(${Array(22) // <-- change from 21 to 22
                .fill(0)
                .map((_, j) => `$${i * 22 + j + 1}`) // <-- use 22 here too
                .join(', ')})`
            ).join(', ')}
            RETURNING source_id;
              `;

                const values = data.flatMap(record => [
            record.feeder_name,         // fs
            record.demand_kW,           // demand_kw
            record.demandKVA,           // demand_kva
            record.powerFactor,         // demand_pct_pf
            record.maximumCurrent,      // demand_amps
            record.CON_customer,        // conn_customer
            record.CON_kVA,             // conn_kva
            record.total_kw_loss,       // kw_loss_pct
            record.total_power_loss,    // kw_loss_line
            record.kW_loss,             // kw_loss_tran
            '0',                  // kw_loss_reg
            record.demandkva_ryb,       // pct_loading_r
            record.demandkva_ryb,       // pct_loading_y
            record.demandkva_ryb,       // pct_loading_b
            '0',                  // minimum_section_id
            record.powerFactor,         // minimum_volts
            '0',                  // maximum_section_id
            record.maximumCurrent,      // maximum_volts
            record.maximumCurrent,      // maximum_section_pct_loading
            parseInt(record.parameter_inserted_id[0]), // analysis_parametr_id
            record.feeder_code ,         // feeder_code (again)
            'HT-LT'
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


router.post('/add_elrdata',
  auth.authenticateToken, async (req, res) => {
    try {
      const data = req.body;
      for (const feeder of data) {
        const result = await connection.query(
          `INSERT INTO elr (
          feeder_type, demand_kva, kw_loss_pct, demand_pctpf, demand_amps, 
          kw_loss_line, kw_loss_trans, conn_kva, maximum_pct_loading, load_factor,
          pct_max_volt_drop, demand_kw, max_load_amp, annual_energy_loss_kwh, 
          loss_factor, line, min_volt_out_pct, transformer, total_energy_loss,
          annual_energy_loss_pct, annual_energy_sent_kwh, conductor_km, mcm_500,
          ant, dog, gopher, rabbit, total_inc_ant, total_conductor, feeder_code, feeder_name, created_at,month,type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
          $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, NOW(),$32,'HT-LT')`,
          [
            feeder.feeder_type,
            feeder.demandKVA,
            feeder.kw_loss_pct,
            feeder.powerFactor,
            feeder.maximumCurrent,
            306.0,
            58.0,
            feeder.CON_kVA,
            79.0,
            feeder.type_value,
            13.0,
            feeder.demand_kW,
            null,
            739764.5,
            0.232,
            621889.92,
            87,
            117874.56,
            739764.5,
            5.96,
            12415723.2,
            26.17,
            0.8,
            0.13,
            5.28,
            2.61,
            17.35,
            26.17,
            26.04,
            feeder.feeder_code,
            feeder.feeder_name,
            feeder.month
          ]
        );

      }

      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database insertion error' });
    }
  });

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


router.get("/get_sections/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id;

  const signedin_user = res.locals.id;

  //console.log(id);
  const selectQuery =
    "SELECT section_id FROM section2 WHERE feeder_code = $1";

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


// router.get("/analysis_parametr/:id", auth.authenticateToken, async (req, res) => {
//   const id = req.params.id;

//   //console.log(id);
//   const selectQuery =
//     "SELECT kw_loss_pct  FROM (SELECT kw_loss_pct, ROW_NUMBER() OVER ( PARTITION BY DATE_TRUNC('month', created_at)ORDER BY created_at  DESC) AS rn  FROM elr  WHERE feeder_code = $1) AS ranked WHERE rn = 1;";

//   connection.query(selectQuery, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     } else {
//       const result = results.rows;
//       //console.log(result);
//       return res.status(201).json({ result });
//     }
//   });
// });

router.get("/analysis_parametr_all", auth.authenticateToken, async (req, res) => {
  const selectQuery = `
    SELECT 
  SUM(kw_loss_pct) AS kw_loss_pct,
  DATE_TRUNC('month', month) AS created_at
FROM elr
GROUP BY DATE_TRUNC('month', month)
ORDER BY created_at ASC;
  `;

  connection.query(selectQuery, [], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json({ result: results.rows });
    }
  });
});
router.get("/analysis_parametr/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id;

  const selectQuery = `
    SELECT kw_loss_pct, month
    FROM (
      SELECT kw_loss_pct, month,
             ROW_NUMBER() OVER (
               PARTITION BY DATE_TRUNC('month', month)
               ORDER BY created_at DESC
             ) AS rn
      FROM elr
      WHERE feeder_code = $1
    ) ranked
    WHERE rn = 1;
  `;

  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json({ result: results.rows });
    }
  });
});

// routes/feederSummary.js or your relevant route file

router.put('/update-last-loss', async (req, res) => {
  const { kw_loss_pct, kw_loss_line, source_id } = req.body;

  // Validation
  if (
    kw_loss_pct === undefined ||
    kw_loss_line === undefined ||
    !source_id
  ) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

 // const connection = await pool.connect();

  try {
    const result = await connection.query(
      `UPDATE analysis_feeder_summary
       SET kw_loss_pct = $1,
           kw_loss_line = $2
       WHERE source_id = $3
       RETURNING source_id`,
      [kw_loss_pct, kw_loss_line, source_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No record found with the given source_id.' });
    }

    res.status(200).json({
      message: 'Updated successfully.',
      updatedId: result.rows[0].source_id,
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: 'Failed to update record.',
      error: error.message,
    });
  } 
  // finally {
  //   connection.release();
  // }
});

router.get('/lt-feeders/:feederCode', async (req, res) => {
  const { feederCode } = req.params;

  const query = `
    SELECT DISTINCT e.equip_number
    FROM section2 s
    LEFT JOIN equipment2 e ON s.pole_number = e.pole_number 
    WHERE s.feeder_code = $1 AND e.equip_type = '2'
  `;

  try {
    const { rows } = await connection.query(query, [feederCode]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No LT feeder data found.' });
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching LT feeder data:', error);
    res.status(500).json({ success: false, message: 'Database error occurred.' });
  }
});




module.exports = router;