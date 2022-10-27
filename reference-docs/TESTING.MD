# Tests to Run Before Pull Requests

# Input Page UI Tests

* Upon selection of a major the concentration list appears and is populated with accurate concentrations
* A course can be added and removed from the completed course list and this list is reflected in the console after clicking "generate schedule" (Removed courses should not be in this list).
* When adding a completed course a duplicate course or a course with no selected subject, number, or both should throw an error popup with an appropriate message
* Clicking generate schedule without selecting a major and concentration should throw an error message popup

# Running Automated Unit Tests

* Navigate to the inner academic-requirements folder, run the 'npm test' command to launch the tests.
