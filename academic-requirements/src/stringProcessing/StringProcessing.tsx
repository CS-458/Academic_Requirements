/* 
    Class responsible for all prerequisite and requirement checking
*/
class StringProcessing {

  // Big method that checks a list of courses based on the given compare string
  // This method is to be used for prerequisite checking and for requirements checking

  // param compareString -> the string that has requirements/prerequisites that must be satisfied
  // param coursesList -> the array of strings that have courses that are taken
  // optional param concurrentCoursesList -> array of strings that have courses that are concurrently taken
  courseInListCheck(compareString: string, coursesList: string[], concurrentCoursesList: string[] | undefined) {

    // Boundary Conditions
    if (compareString === '' || compareString === null || compareString === undefined) {
      return true; // nothing to compare to, so it must be true (essentially means no prerequisites)
    }
    if ((coursesList && coursesList.length === 0) || coursesList === null || coursesList === undefined) {
      // Since there exists at least one course to compare, if coursesList is empty,
      // then the course is not in the list
      return false;
    }

    // Force each string to have underscores instead of dashes and remove any duplicates
    let courses = this.removeDuplicates(this.replaceDashesWithUnderscores(coursesList));
    let concurrentCourses = this.removeDuplicates(this.replaceDashesWithUnderscores(concurrentCoursesList ?? []));

    // Step 1: split the string by commas (required courses)
    // Every string in the split strings must be true
    let splitStringAND = compareString.replace(/-/g,'_').split(',');
    let returnValue = true;

    splitStringAND.forEach(compareAND => {

        // If the string has a '|' or '&', it is not simplified...
        if (compareAND.search(/&|\|/) > 0) {

          let orSatisfied = false;

          // Step 2: split the string by vertical bars (this OR that courses)
          // Only one of the split strings must be true
          let splitStringOR = compareAND.split('|');
          splitStringOR.forEach(compareOR => {

            if (!orSatisfied) {

              // If the string has an '&', it is not simplified...
              if (compareOR.search(/&/) > 0) {

              // Step 3: split the string by ampersand symbols (&)
              // Every string in the split strings must be true OR one of the previously split strings is true
              let splitStringSUBAND = compareOR.split('&');

              let subandSatisfied = true;

              // Check that are courses are present
              splitStringSUBAND.forEach(compareSUBAND => {

                // If the course is meant to be taken concurrently...
                if (compareSUBAND.search(/!/) === 0) {

                  // Remove the exclamation point from the string
                  compareSUBAND = this.removeFirstCharacter(compareSUBAND);

                  // Compare it to the taken and concurrently taking courses
                  if (concurrentCourses.indexOf(compareSUBAND) !== -1 && courses.indexOf(compareSUBAND) !== -1) {
                    subandSatisfied = false;
                  }
                }

                // If the course number or above could be taken...
                else if (compareSUBAND.search(/>/) === 0) {
                  let indexGreater = this.checkCourseOrGreater(compareSUBAND,courses)
                  // If a course is greater than the requirement, delete it
                  if ( indexGreater !== -1) {
                    courses.splice(indexGreater, 1);
                  }
                  // Otherwise return false since the requirement is not met
                  else {
                    subandSatisfied = false;
                  }
                }
                else {
                  // Otherwise compare it to just the taken courses
                  if (courses.indexOf(compareSUBAND) === -1) {
                    subandSatisfied = false;
                  }
                }
                // Remove the "used" course/concurrentCourse from the course list, if it existed
                if (courses.indexOf(compareSUBAND) !== -1) {
                  courses.splice(courses.indexOf(compareSUBAND), 1);
                }
                if (concurrentCourses.indexOf(compareSUBAND) !== -1) {
                  concurrentCourses.splice(concurrentCourses.indexOf(compareSUBAND), 1);
                }
              })

              // If all of the courses were present in the SUBAND, then the OR is satisfied
              if (subandSatisfied) {
                orSatisfied = true;
              }
            }
            else {
              // If the course is meant to be taken concurrently...
              if (compareOR.search(/!/) === 0) {

                // Remove the exclamation point from the string
                compareOR = this.removeFirstCharacter(compareOR);

                orSatisfied = orSatisfied || concurrentCourses.indexOf(compareOR) !== -1 || courses.indexOf(compareOR) !== -1;
              }
              // If the course number or above could be taken...
              else if (compareOR.search(/>/) === 0) {
                let indexGreater = this.checkCourseOrGreater(compareOR,courses)
                // If a course is greater than the requirement, delete it and set orSatisfied to true
                if (indexGreater !== -1) {
                  courses.splice(indexGreater, 1);
                  orSatisfied = true;
                }
              }
              else {
                orSatisfied = orSatisfied || courses.indexOf(compareOR) !== -1;
              }

              // Remove the "used" course from the courses or concurrent coureses if it was in fact used
              if (courses.indexOf(compareOR) !== -1) {
                courses.splice(courses.indexOf(compareOR), 1);
              }
              if (concurrentCourses.indexOf(compareOR) !== -1) {
                concurrentCourses.splice(concurrentCourses.indexOf(compareOR), 1);
              }
            }
          }
          })

          // If none of the courses were satisfied in the ORs, then return false
          if (!orSatisfied) {
            //TODO error-> splitStringOR requires one of the courses to be present, but none were
            returnValue = false;
          }
        }
        // Check if the string is contained in the list of courses
        else {

          // If the course is meant to be taken concurrently...
          if (compareAND.search(/!/) === 0) {

            // Remove the exclamation point from the string
            compareAND = this.removeFirstCharacter(compareAND);

            // Compare it to the taken and concurrently taking courses
            if (concurrentCourses.indexOf(compareAND) === -1 && courses.indexOf(compareAND) === -1) {
              returnValue = false;
            }
          }
          // If the course number or above could be taken...
          else if (compareAND.search(/>/) === 0) {
            let indexGreater = this.checkCourseOrGreater(compareAND,courses)
            // If a course is greater than the requirement, delete it
            if ( indexGreater !== -1) {
              courses.splice(indexGreater, 1);
            }
            // Otherwise return false since the requirement is not met
            else {
              // TODO error -> compareAND is a manadtory minimum course number, but no course
              //                above that number was taken
              returnValue = false;
            }
          }
          else {
          // If the course is not included, return false
          if (courses.indexOf(compareAND) === -1) {
            //TODO error-> compareAND is a mandatory course, but is not in coursesList
            returnValue = false;
          }
        }}
        // Remove the "used" course/concurrentCourse from the course list, if it existed
        if (courses.indexOf(compareAND) !== -1) {
          courses.splice(courses.indexOf(compareAND), 1);
        }
        if (concurrentCourses.indexOf(compareAND) !== -1) {
          concurrentCourses.splice(concurrentCourses.indexOf(compareAND), 1);
        }
    })
 
    return returnValue;
  }

  // Replaces the dashes in each string in strings with an underscore and returns the edited array of strings
  replaceDashesWithUnderscores(strings: string[]): string[] {
    let arr = new Array<string>;
    strings.forEach(x => {
      arr.push(x.replace(/-/g,'_'));
    })
    return arr;
  }

  // Removes the first character from the given string and returns the edited string
  removeFirstCharacter(cutString: string): string {
    return cutString.substring(1, cutString.length);
  }

  // Removes all duplicate strings from array of strings and returns the array of strings without duplicates
  removeDuplicates(strings: string[]): string[] {

    // Push all strings to a set (which disallows duplicates)
    let set = new Set<string>();
    strings.forEach((x) => {
      set.add(x);
    });

    // Reassigns all strings in the set to an array
    let arr = new Array<string>;
    set.forEach((x) => {
      arr.push(x);
    });

    // Return the array
    return arr;
  }

  /* Checks if one of the courses is greater than or equal to the compareString's course and 
     returns the last index of courses where the requirement is met or -1 if not met
     ex1. compareString='>CS-130' courses=['CS-131','CS-121']  returns -> 0
     ex2. compareString='>CS-100' courses=['CS-101','CS-150']  returns -> 1 
     ex3. compareString='>CS-180' courses=['CS-101','CS-130']  returns -> -1
     Notice in ex 2 that both courses satisfied the compareString; however, the latest index is returned 
  */
  checkCourseOrGreater(compareString: string, courses: Array<string>): number {

    let returnIndex = -1;

    // Retrieve the course acronym and number from the string 
    let compareAcronym = this.removeFirstCharacter(compareString.split('_')[0]);
    let compareNumber = parseInt(compareString.split('_')[1]);

    courses.forEach((x, index) => {
      let acronym = x.split('_')[0];
      let number = parseInt(x.split('_')[1]);

      // If the course acronyms are the same, return true if the course is greater
      if (acronym === compareAcronym) {
        if (compareNumber <= number) {
          returnIndex = index;
        };
      }
    })
    return returnIndex;
  }
};

//TODO make method for processing ! strings
//TODO maybe make a method for processing all strings (regular, !, or >)

export default StringProcessing;