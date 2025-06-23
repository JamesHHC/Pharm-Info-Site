# Pharmacy Info | Helms Home Care
A web application for displaying information related to pharmacies. Built using **Vite** and the **React.js** framework.

## Client
#### Required files:
`client/src/config.js`
```js
export default {
    server_ip: 'XX',
    server_port: 'XX',
};
```

## Server
#### Required files:
`server/.env`
```env
PORT=XX
DATABASE_URL=postgresql://user:password@localhost:port/pharmacydb
JWT_SECRET=XX
REFRESH_SECRET=XX
```

## Database

<p align="center">
  <img src="docs/db_diagram.png" alt="db diagram" width=800><br>
  <b>PostgreSQL</b> and <b>pgAdmin 4</b> were used to set up the required tables.
</p>
