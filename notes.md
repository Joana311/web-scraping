
Generate Prisma Client:

`npx prisma generate`

Browser Database:

`npx prisma studio`

Push changes to db & reseed:

`prisma migrate dev`

Push raw table changes:

`prisma db push`

Apollo Server is for connecting API's im guessing. like a server for endpoints to get rerouted to graphql.

Client is like a little worker dude that executes queries you give it and stuff

im not sure if theres a way to make the client aware of the already defined queries that the Apollo Server has. 
