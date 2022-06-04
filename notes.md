
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

To get a div to fill space with using height: 'fill-available'. Any siblings sharing the parent must have a height set (not sure if it needs to be a static height). The parent container must also be a flex.


### Todo

[x] create and 'add exercise' app component/modal using real exercise data

    [ ] add the actual 'add' functionality that should add the selected exercises to the "Workout Report" `/[user]/workout`

[-] introduce functionality to add an empty Workout for a User.

[ ] introduce functionality to add a new UserExercise in db for a Workout.

    - should use real Exercises provided by AddExercises.

    [ ] ability to modify data.

[ ] implement searching & filtering for AddExercies.

[ ] implement user Authentication/login w/ discord.

[ ] setup middleware for mutations.

[ ] establish subscriptions to db for modifying UserExercises feilds (sets, reps, weight).

