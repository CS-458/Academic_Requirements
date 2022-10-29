# Tests to Run Before Pull Requests

# Input Page UI Tests

### Dropdown Menu:

1. Clicking the dropdown shows all available options. The user can then select one specific option.

2. User can type “Computer” and both Computer Science and AMCS majors show up for the major dropdown.

3. Typing in something that does not match any of the majors shows that there are no options and does not select any major.

4. There are four dropdown menus: major, concentration, class acronym, and class number

### Major Input:

1. The major input is a dropdown menu, that was tested above.

2. When a major is selected, the concentration dropdown then appears, and a concentration can be selected.

3. When a major is selected, we log it into the console saying that it has been selected. It is stored in a local variable as well.

### Generate Schedule Button:

1. The generate schedule button, when pressed, takes the user to the four year plan screen and hides all of the input page elements.

2. Pressing the generate schedule button with Computer Science & GDD Concentration selected shows every major course for that concentration in a list in the course list.

3. Pressing the generate schedule button with Computer Science & Interdisciplinary selected shows every major course for that concentration in a list in the course list.

4. Clicking generate schedule without selecting a major and concentration should throw an error message popup.

### Removing Course:

1. Each course has an X and clicking on it removes the course from the list.

2. The course list updates accordingly. Selecting any three courses and removing the course in the middle results in a list of two courses. (Testing using various courses

# Running Automated Unit Tests

- Navigate to the inner academic-requirements folder, run the `npm test` command to launch the tests.
- These tests are also automatically run when a pull request is created and a merge into main will not be possible until they pass.
