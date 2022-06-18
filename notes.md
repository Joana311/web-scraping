# Notes

These are notes that i take while im programming usually. It includes things like: bugs, feature ideas, commands i forget, etc.

## Useful commands (for me mostly xD)

Generate Prisma Client:

`npx prisma generate`

Browser Database:

`npx prisma studio`

Push changes to db & reseed:

`prisma migrate dev`

Push raw table changes:

`prisma db push`

## Actual notes

Client is like a little worker dude that executes queries you give it and stuff

im not sure if theres a way to make the client aware of the already defined queries that the Apollo Server has.

To get a div to fill space with using height: 'fill-available'. Any siblings sharing the parent must have a height set (not sure if it needs to be a static height). The parent container must also be a flex.

I decided to go with trpc instead of graphql and apollo because it does both jobs pretty much and i don't really need a public api atm. Whenever i need it i can probably easily implement it using trpc and nextjs api routes.

## Big Bugs

    [ ] creating new workout sends 2 requests to the server.

## Todo

    [ ] use a `<Layout>` component to hold Title/Nav Header of the app/site


    [ ] establish subscriptions to db for modifying UserExercises fields (sets, reps, weight).

    [ ] close workouts automatically in a smart way. (or maybe just prompt when they open the app)

    [ ] ability to delete/edit previous workouts

    
    [ ] rework api so that only id's are served and then further info is fetched from the db when it is needed.

    [-] ability to modify data.

    [/] implement searching & filtering for AddExercises.
        
        * my current solution is slow af rn *  

        [ ] remove the ability to add exercises that are already in the workout.

    [ ] create a UserExercise page with better details `../user/workout/exercise/:id`

## In Progress

    [-] use optimistic updates to update the set data

    [ ] setup middleware for pulling user data from the db to use id as a context for requests.

## Done Recently

    [x] implement user Authentication/login w/ discord.

    [x] currently there after a new workout is created. the url is not updated to include the id of the added workout.

    [x] stop using babel compiler and swap back or SWC, by using a different superjson plugin 

    [x] introduce functionality to add a new UserExercise in db for a Workout.

    [x] clean up the flow/directory structure for components.

    [x] swap from using a search query parameter for workout id to just using a page.

    [x] create and 'add exercise' app component/modal using real exercise data

        [x] finish the actual 'add' functionality that should add the selected exercises as UserExercises to the "Workout Report" `/[user]/workout`


    [x] introduce functionality to add an empty Workout for a User.

        [x] fetch actual workout information for a given user. 