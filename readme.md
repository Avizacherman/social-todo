# Social To Do

An app for you to make a todo list, and see others who have the same items to do.

## User Stories

A user will be able to:
- Sign up for an account
- Add items to their own to do list
- View other users who have the same items on their to do list
- View other users to do lists

## Purpose

This application is a simple way to explore the potention of Neo4j, a graph database. In Neo4j,
data is contained in nodes and linked together by relationships. Nodes and relationships may be labeled
and given properties.

## Design Considerations

In Social To Do, a User (one node) Does [a relationship] Tasks (another node) such that
`(USER)-[DOES]->(TASK)`
(this is a simple example of what a query might take the form of).

Because multiple users can do the same task, we use `MERGE` syntax when creating tasks, allowing us to first check to see if a task exists before creating a new one. If it does, we point a `[DOES]` relationship at it.

### Data Models

A `(USER)` node will have information allowing them to sign in as well as a display name.

A `[DOES]` relationship connects the `(USER)` to the `(TASK)`. It also contains properties that note when the user started the task, if they completed it and when they completed it.

The reasoning for storing the above data on the relationship is if put on the task, all users would see that data. The relationship is the unique link from a specific user to a specific task.

A `(TASK)` merely contains the name of the task being completed. When a user changes the name of a task on the list, that task is not itself changed. Instead, we check to see if the newly named task exists, (and if it does not it gets created), a new `[DOES]` relationship is pointed at that task, maintaining the properties from the old `[DOES]`, and then the old `[DOES]` is deleted. In this way, we main the integrity of `(TASK)`s.

## Future Features

A number of features are future concepts for the further development of this application.

### Filtering

A user will eventually be able to filter tasks by completed/incomplete.

### Comments

A user will eventually be able to leave comments on a task. This will be achieved through an extended relationship: `(USER)-[MAKES]->(COMMENT)-[ON]->(TASK)`. This truly harnesses the power of neo4j to extend relationships.
