const express = require("express");
const connection = require("../config/connection");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var auth = require("../services/authentication");

router.use(express.json());


// router.post("/login", (req, res) => {
//     // console.log('Login Hit');
//     const { email, password } = req.body;
//     let source = "";
//     const user_email = req.body.email;
//     var currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     currentDate = currentDate.toISOString().split("T")[0];
//     const checkCurrentDate = new Date(`${currentYear}-07-01`)
//       .toISOString()
//       .split("T")[0];
  
//     var startDate;
//     var endDate;
  
//     if (currentDate >= checkCurrentDate) {
//       startDate = new Date(`${currentYear}-07-01`).toISOString().split("T")[0];
//       endDate = new Date(`${currentYear + 1}-06-30`).toISOString().split("T")[0];
//     } else {
//       startDate = new Date(`${currentYear - 1}-07-01`)
//         .toISOString()
//         .split("T")[0];
//       endDate = new Date(`${currentYear}-06-30`).toISOString().split("T")[0];
//     }
  
//     if (req.body.source) {
//       source = req.body.source;
//     } else {
//       source = "web";
//     }
  
//     query =
//       "SELECT u.id, u.first_name, u.last_name, u.username FROM users u  WHERE u.username = ?";
//     connection.query(query, [email], (err, results) => {
//       if (err) {
//         logger.error(`- ${email} - ${new Date()}-Login error:`, err);
//         return res.status(500).json({ message: "Internal server error" });
//       }
  
//       if (results.length === 0) {
//         logger.info(
//           `Login failed: Incorrect Email or Password- ${email} - ${new Date()}`
//         );
//         return res.status(401).json({ message: "Incorrect Email or Password" });
//       }
//       const employee = results[0];
  
//       if (employee.password) {
//         bcrypt.compare(password, employee.password, (bErr, bResult) => {
//           if (bErr) {
//             logger.error(`- ${user_email}  - ${new Date()}-Login error:`, bErr);
//             return res.status(500).json({ message: "Internal server error" });
//           }
  
//           if (bResult) {
//             if (results[0].status != 1) {
//               logger.error(
//                 `Login error is: employee must be a Active- ${user_email} - ${new Date()}`
//               );
//               return res.status(401).json({
//                 message:
//                   "Your account seems to be inactive. Please reach out to the HR!",
//               });
//             }
  
//             if (results[0].application_access == "no" && source == "mobile") {
//               logger.error(
//                 `Login error is: Application Access is required, contact to the support ${user_email}  - ${new Date()}`
//               );
//               return res.status(401).json({
//                 message: "Application Access is required, contact to the support",
//               });
//             }
  
//             const {
//               id,
//               name,
//               email,
//               role,
//               password_change_count,
//               manager_id,
//               designation,
//             } = employee;
  
//             //we can use above sigle query but for time being I'm creating new query
  
//             query =
//               "SELECT e.id, e.name, e.father_name, e.cnic_number, p.name as designation, e.designation as designation_id, e.dob, p.grade, e.gender, e.branch_code, e.account_number, e.employee_id, e.official_email, e.domicile, e.marital_status, e.email, e.mobile, e.landline, e.address, edd.id as next_to_kin, edd.dependent_name as next_to_kin_name, e.status, e.employment_status, e.hire_date, e.joining_date, e.medical_date, e.application_access, e.checkout_check, e.facelock, e.have_mobile, e.geofence, gl.id as geofence_id, gl.name as geofence_name,e.have_ssid, ss.list , e.ssid, gl.points as geofencepoint_text, e.manager_id, (select name from employee where id = e.manager_id ) as manager_name, d.id as department_id, d.name as department_name, w.id as wing_id, w.name as wing_name, e.created_by FROM employee e join positions p on (p.id = e.designation) join departments d on (d.id = e.department_id) join wings w on (w.id = d.wing_id) left join geofence_locations gl on(gl.id = e.geofence_id) left join employee_dependent edd on (e.next_to_kin = edd.id) left join ssid_list ss on (e.ssid = ss.id) where e.id = ?";
//             connection.query(query, [id], async (error, basicData) => {
//               if (error) {
//                 logger.error("Get Employee Data error is:", error);
//                 res.status(400).json({ message: "Something Wrong!" });
//                 return;
//               } else {
//                 if (basicData.length === 0) {
//                   logger.info(
//                     `Get Employee Data error is: employee id does not exist - ${email} - ${new Date()}`
//                   );
//                   return res
//                     .status(404)
//                     .json({ message: "Employee id does not exist" });
//                 } else {
//                   let latLngArray = await extractLatLngFromPolygon(
//                     basicData[0].geofencepoint_text
//                   );
  
//                   query =
//                     "SELECT count(id) as leaveRequest FROM employee_leave_request where first_approver = ?";
  
//                   connection.query(query, [id], (error, leaveRequestCount) => {
//                     if (error) {
//                       logger.error(
//                         "Get Employee Leave Request Count Data error is:",
//                         error
//                       );
//                       res.status(400).json({ message: "Something Wrong!" });
//                       return;
//                     } else {
//                       query =
//                         "SELECT count(id) as teamMember FROM employee where manager_id = ?";
  
//                       connection.query(query, [id], (error, teamMemberCount) => {
//                         if (error) {
//                           logger.error(
//                             "Get Employee Team Member Count Data error is:",
//                             error
//                           );
//                           res.status(400).json({ message: "Something Wrong!" });
//                           return;
//                         } else {
//                           query =
//                             "SELECT type, value FROM configuration where type = 'Late Time'";
  
//                           connection.query(query, (error, configuration) => {
//                             if (error) {
//                               logger.error(
//                                 "Get configuration Data error is:",
//                                 error
//                               );
//                               res
//                                 .status(400)
//                                 .json({ message: "Something Wrong!" });
//                               return;
//                             } else {
//                               // console.log(startDate);
//                               // console.log(endDate);
//                               query =
//                                 "SELECT lt.id, lt.type, elt.id as leave_type_id, lt.total, elt.remaining, elt.id as employee_leave_id FROM employee_leave_type elt join leave_types lt on (lt.id = elt.leave_type_id) where elt.employee_id = ? AND elt.start_date >= ? AND elt.end_date <= ? group by lt.id";
  
//                               connection.query(
//                                 query,
//                                 [id, startDate, endDate],
//                                 (error, leaveCount) => {
//                                   if (error) {
//                                     logger.error(
//                                       ` ${new Date()}-Get Employee Leave Count Data error is:`,
//                                       error
//                                     );
//                                     res
//                                       .status(400)
//                                       .json({ message: "Something Wrong!123" });
//                                     return;
//                                   } else {
//                                     query =
//                                       "SELECT id, photo_name FROM employee_photos where employee_id = ? order by id desc limit 1 ";
  
//                                     connection.query(
//                                       query,
//                                       [id],
//                                       (error, photoName) => {
//                                         if (error) {
//                                           logger.error(
//                                             "Get Employee Photo Data error is:",
//                                             error
//                                           );
//                                           res.status(400).json({
//                                             message: "Something Wrong!",
//                                           });
//                                           return;
//                                         } else {
//                                           var photoname;
//                                           if (photoName.length === 0) {
//                                             photoname = "user.png";
//                                           } else {
//                                             photoname = photoName[0].photo_name;
//                                           }
  
//                                           query =
//                                             "SELECT r.name FROM employee_right er join `right` r on (r.id = er.right_id) where er.employee_id = ?";
  
//                                           connection.query(
//                                             query,
//                                             [id],
//                                             (error, right) => {
//                                               if (error) {
//                                                 logger.error(
//                                                   `${email} - ${new Date()}Get Employee rights Data error is:`,
//                                                   error
//                                                 );
//                                                 res.status(400).json({
//                                                   message: "Something Wrong!",
//                                                 });
//                                                 return;
//                                               } else {
//                                                 var rights = [];
//                                                 right.forEach((element) => {
//                                                   rights.push(element.name);
//                                                 });
  
//                                                 const response = {
//                                                   id,
//                                                   name,
//                                                   email,
//                                                   role,
//                                                   password_change_count,
//                                                   manager_id,
//                                                   designation,
//                                                   rights,
//                                                 };
  
//                                                 const accessToken = jwt.sign(
//                                                   response,
//                                                   process.env.ACCESS_TOKEN,
//                                                   {
//                                                     expiresIn: "36h",
//                                                   }
//                                                 );
  
//                                                 logger.info(
//                                                   `Login successful: Employee ID - ${id} - ${new Date()}`
//                                                 );
  
//                                                 return res.status(200).json({
//                                                   token: accessToken,
//                                                   basicData: basicData,
//                                                   leaveCount: leaveCount,
//                                                   leaveRequestCount:
//                                                     leaveRequestCount,
//                                                   teamMemberCount:
//                                                     teamMemberCount,
//                                                   latLngArray: latLngArray,
//                                                   photoName: photoname,
//                                                   configuration: configuration,
//                                                 });
//                                               }
//                                             }
//                                           );
//                                         }
//                                       }
//                                     );
//                                   }
//                                 }
//                               );
//                             }
//                           });
//                         }
//                       });
//                     }
//                   });
//                 }
//               }
//             });
//           } else {
//             logger.info(
//               `Login failed: Incorrect Email or Password- ${email} - ${new Date()}`
//             );
//             return res
//               .status(401)
//               .json({ message: "Incorrect Email or Password" });
//           }
//         });
//       } else {
//         logger.error(`Login error: Password not found-${email} - ${new Date()}`);
//         return res
//           .status(400)
//           .json({ message: "Something went wrong. Please try again later" });
//       }
//     });
//   });


//imp code
// router.post('/login', async (req, res) => {
//   console.log(req.body);
//   const { username, password } = req.body;

//   try {
//       // Query to find the user by username
//       const query = 'SELECT u.id, u.first_name, u.last_name, u.username, u.password FROM users u WHERE u.username = $1';
//       const result = await connection.query(query, [username]);

//       // Check if the user exists
//       if (result.rows.length === 0) {
//           return res.status(400).json({ error: 'Invalid username or password' });
//       }

//       const user = result.rows[0];

//       // Check if the password is correct (since it's stored in plain text)
//       if (password !== user.password) {
//           return res.status(400).json({ error: 'Invalid username or password' });
//       }

//       // Create and sign a JWT token
//       const token = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN, { expiresIn: '8h' });

//       // Send the token and user info as the response
//       res.json({
//           token,
//           user: {
//               id: user.id,
//               first_name: user.first_name,
//               last_name: user.last_name,
//               username: user.username,
//           },
//       });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//   }
// });


router.post('/login', async (req, res) => {
    
    const { username, password } = req.body;

    try {
        // Query to find the user by username
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.username, u.password, u.user_type_id
            FROM users u 
            WHERE u.username = $1
        `;
        const result = await connection.query(query, [username]);

        // Check if the user exists
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Check if user_type_id is 8
                if (parseInt(user.user_type_id) !== 8) {
            console.log(user.user_type_id);
            return res.status(403).json({ error: 'You are not authorized to login.' });
        }

        // Check if the password is correct (plain text comparison)
        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Create and sign a JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.ACCESS_TOKEN,
            { expiresIn: '8h' }
        );

        // Send the token and user info as the response
        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});










module.exports = router;