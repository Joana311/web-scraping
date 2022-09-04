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

mobile has a hard time displaying negative margins

## Big Bugs

    [-] getServerSession is sometimes returning another users account info.

## Minor Bugs

    [ ] the scroll notifiers elements are not hiding correctly when there is no area to scroll.

    [ ] navigating forward from /[user] to /[user]/recent after recent was deleted takes you to a blank page because it cannot get the session i should handle this with a 404 page and then reroute. 

## Todo

    [ ] find a better way to request the 4mb data used in AddNewExerciseModal, look into streaming.

    [ ] close workouts automatically in a smart way. (or maybe just prompt when they open the app)

    [ ] ability to delete/edit previous workouts

    [ ] rework api so that only id's are served and then further info is fetched from the db when it is needed (aka optimize api calls to reduce response times from server).

    [ ] optimize api functions to not make so many prisma calls.

    [ ] make the muscle map actually reflect the current workout of a user

    [ ] save the `selected` state in AddNewExerciseModal via query params. and reset it  when the add button is pressed

    [ ] add notes feature to exercises in workout

    [ ] create a UserExercise page with better details `../user/workout/exercise/:id`

## In Progress

    [-] implement searching & filtering for AddExercises.

        [x] added support for force and equipment tag filters

        [/] filter on server side.
          * currently filtering on client side *

        [ ] remove the ability to add exercises that are already in the workout.

    [-] alot of ui jitters/jumps caused by conditional renders. Clean up with use of skeletons or better load state logic.

        [x] add skeletons for loading states on the daily workouts elements in /[user] router
            ** still need to fix the rendering logic a bit, especially on deletion of a workout **

    [-] finish the moving off of Mui to Tailwind
        * mostly done. Just need to remove the mui table *

    [x] add muscle heat map inside of daily summary

        [ ] make it dynamic based on the muscles of selected exercises using RPE to determine the color of differnet muscles on the heatmap.

    [-] setup middleware for pulling user data from the db to use id as a context for requests.
        * currently doing it inside trpc's createContext instead of using the middleware option, might wait for trpc v10 to do any big trpc refactors *

    [-] fixed messy rerouting logic for deAuthentication.

        [ ] improve re-routing logic whenever a session is expired and the user is redirected to `/` (currently does not log you out or clear app info about user)

## Done Recently

    [x] iOS display is super wonky. need too look up better ways to display vh. __need to update my iphone to latest iOS version__.
        ** this has mostly been fixed since adding the pwa support since that should be the primary way to use the app on mobile. **

    [x] create a route specifically for current workout.

    [x] swapped from local db to supabase hosted db so that i can deploy the app.

    [x] implemented next-pwa to make the app saveable to homescreen and function nativelike.

    [x] create a page for the AddNewExerciseModal or make it based off of route parameters so that i can use swipe on mobile

    [x] fix next-auth no secret warning

    [x] routing to home sometimes doesnt show the correct button for create or continue workout. Need to make to either save state of an open workout in app context or make sure were making a request everytime we hit that page for `workout.current`

    [x] new workout is super slow to route to
        * fixed by moving the add workout request to the button click event instead of the page load*

    [x] ability to delete an exercise from current workout. Added pretty animations too

    [x] allow for only 1 Exercise card to be expanded at a time.

    [x] workout report exercises cards are not displaying correctly. Minor visual bug.

    [x] hydration problems (server not matching client) when rendering userexercisecard
        - just had to wrap the icon in a table cell <td> to fix it

    [x] ability to modify current UserExercises fields (sets, reps, weight).

        [x] use optimistic updates to update the set data whenever a set or new exercise is added

    [x] display the correct app-location in the header

    [x] trying to add exercises crashes app

    [x] use a `<Layout>` component to hold Title/Nav Header of the app/site

    [x] creating new workout sends 2 requests to the server.

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
