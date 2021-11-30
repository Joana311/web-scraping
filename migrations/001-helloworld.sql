-- Up
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    exerciseID INTEGER KEY REFERENCES Exercise(id)
);
CREATE TABLE Exercise(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    link TEXT
);

INSERT INTO User(name,email,exerciseID) values ('patient0', 'dummy@mail.co', '1');
INSERT INTO User(name,email,exerciseID) values ('patient0', 'dummy@mail.co', '2');
INSERT INTO User(name,email) values ('patient-1', 'dummy1@mail.co');

INSERT INTO Exercise(name,link) VALUES('Barbell-BenchPress', 'https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress');
INSERT INTO Exercise(name,link) VALUES('Barbell-Deadlift', 'https://exrx.net/WeightExercises/GluteusMaximus/BBDeadlift');
INSERT INTO Exercise(name,link) VALUES('Barbell-Lying Triceps Extension', 'https://exrx.net/WeightExercises/Triceps/BBLyingTriExt');
INSERT INTO Exercise(name,link) VALUES('Barbell-Hammer Curl', 'https://exrx.net/WeightExercises/Brachioradialis/CBHammerCurl');
-- Down
DROP TABLE User;
DROP TABLE Exercise;