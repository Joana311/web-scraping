
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

# Big Bugs

    [ ] currently there after a new workout is created. the url is not updated to include the id of the added workout.

    [ ] the json response needs to be encoded when being return via https

# Todo

    [ ] swap from using a search query parameter for workout id to just using a page.

    [x] create and 'add exercise' app component/modal using real exercise data

        [x] finish the actual 'add' functionality that should add the selected exercises as UserExercises to the "Workout Report" `/[user]/workout`


    [x] introduce functionality to add an empty Workout for a User.

        [x] fetch actual workout information for a given user. 

    [x] introduce functionality to add a new UserExercise in db for a Workout.

        (should use real Exercises provided by AddExercises.)

        [-] ability to modify data.

    [ ] stop using babel compiler and swap back or SWC, by using a different superjson plugin 

    [try this one](https://github.com/remorses/next-superjson)

    [ ] use a `<Layout>` component to hold Title/Nav Header of the app/site

    [ ] implement searching & filtering for AddExercies.

        [ ] remove the ability to add exercises that are already in the workout.

    [ ] implement user Authentication/login w/ discord.

    [ ] setup middleware for mutations.

    [ ] establish subscriptions to db for modifying UserExercises feilds (sets, reps, weight).

    [ ] add graphql back in

    [ ] set up subscriptions using graphql to mutate a workout session

    [ ] close workouts automatically in a smart way. (or maybe just prompt when they open the app)


    [ ] ability to delete/edit previous workouts

    [ ] clean up the flow/directory structure for components 