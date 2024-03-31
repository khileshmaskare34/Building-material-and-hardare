const mysql = require('mysql'); 
const { connect, param } = require('../routes');


const connection = mysql.createConnection({
  host: 'braihbrprlonugpl9rgx-mysql.services.clever-cloud.com',
  user: "usfrkrkpbbhvo7eo",
  password: "a5pcKgrf7uJpeUgYY6tF",
  database: "braihbrprlonugpl9rgx",
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

const queryDatabase = async (connect, sql, params) => new Promise(
  (resolve, reject)=>{
    const handleFunction = (err, result)=>{
      if(err){
        reject(err)
        return
      }
      resolve(result)
    }
    connect.query(sql, params, handleFunction)
  }
)





module.exports = {connection, queryDatabase};