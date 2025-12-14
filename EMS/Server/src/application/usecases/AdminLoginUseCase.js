import { con } from '../../infrastructure/database/db.js';

class AdminLoginUseCase {
  async execute(email, password) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
      con.query(sql, [email, password], (err, result) => {
        if (err) {
          reject({ LoginStatus: false, Error: "Query Error" });
        } else if (result.length > 0) {
          resolve({ LoginStatus: true, admin: result[0] });
        } else {
          resolve({ LoginStatus: false, message: 'Invalid email or password' });
        }
      });
    });
  }
}

export default new AdminLoginUseCase();
