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
      <li>id - serial (PK, NN)</li>
      <li>name - text (NN)</li>
      <li>communication - text</li>
      <li>verbal_orders - boolean</li>
      <li>general_notes - text</li>
      <li>oncall_prefs - text</li>
      <li>rules - integer[]</li>
      <li>training_req - integer[]</li>
      <li>created_at - timestamp (NN)</li>
    </ul>
  </p>
  <p> <!-- Contacts Table -->
    <strong>contacts</strong><br>
    Contains info about contacts.
    <ul>
      <li>id - serial (PK, NN)</li>
      <li>name - text (NN)</li>
      <li>email - text</li>
      <li>phone - text</li>
      <li>title - text</li>
      <li>preferences - text</li>
      <li>dnc - boolean</li>
      <li>intake_only - boolean</li>
      <li>contact_type - text</li>
      <li>created_at - timestamp (NN)</li>
    </ul>
  </p>
  <p> <!-- Pharmacy-Contacts Table -->
    <strong>pharmacy_contacts</strong><br>
    Many-to-many join table for pharmacies & contacts.
    <ul>
      <li>pharmacy_id - serial (PK, FK, NN)</li>
      <li>contact_id - serial (PK, FK, NN)</li>
    </ul>
  </p>
  <p> <!-- Rules Table -->
    <strong>rules</strong><br>
    Contains an entry for a single rule.
    <ul>
      <li>id - serial (PK, NN)</li>
      <li>rule - text (NN)</li>
    </ul>
  </p>
  <p> <!-- Training Requirements Table -->
    <strong>training</strong><br>
    Contains an entry for a single training requirement
    <ul>
      <li>id - serial (PK, NN)</li>
      <li>name - text (NN)</li>
      <li>description - text (NN)</li>
    </ul>
  </p>
  <p> <!-- User Table -->
    <strong>users</strong><br>
    For authentication/access management.
    <ul>
      <li>id - serial (PK, NN)</li>
      <li>username - text (NN, UQ)</li>
      <li>password_hash - text (NN)</li>
      <li>role - text (NN)</li>
      <li>created_at - timestamp (NN)</li>
    </ul>
  </p>
</div>
