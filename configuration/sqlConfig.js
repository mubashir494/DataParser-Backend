const sqlConfig = {
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    server: process.env.SERVER,
    options: {
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
  };

export default sqlConfig