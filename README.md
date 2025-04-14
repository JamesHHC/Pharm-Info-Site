# Pharmacy Info | Helms Home Care
A web application for displaying information related to pharmacies and subsequent pharmacy contacts. Built using Vite and the React framework.

## Client
TODO (Run instructions)

## Server
TODO (Run instructions)
#### Required files:
`server/.env`
```env
DATABASE_URL=postgresql://user:password@localhost:PORT/pharmacydb
```

## Database
PostgreSQL was used to set up four tables to contain the needed information.
<div>
  <p> <!-- Pharmacy Table -->
    <strong>pharmacies</strong><br>
    Contains info about pharmacies.
    <ul>
      <li>id - SERIAL PK</li>
      <li>name - TEXT</li>
      <li>TODO</li>
    </ul>
  </p>
  <p> <!-- Contacts Table -->
    <strong>contacts</strong><br>
    Contains info about contacts.
    <ul>
      <li>id - SERIAL PK</li>
      <li>name - TEXT</li>
      <li>TODO</li>
    </ul>
  </p>
  <p> <!-- Pharmacy-Contacts Table -->
    <strong>pharmacy_contacts</strong><br>
    Many-to-many join table for pharmacies & contacts.
    <ul>
      <li>pharmacy_id - SERIAL PK</li>
      <li>contact_id - SERIAL PK</li>
    </ul>
  </p>
  <p> <!-- User Table -->
    <strong>users</strong><br>
    For authentication/access management.
    <ul>
      <li>TODO</li>
    </ul>
  </p>
</div>
