//@ts-ignore
import {Course} from "./components/course.tsx";
//@ts-ignore
import StringProcessing from "./StringProcessing.tsx";

class RequirementProcessing{

    majorReqCheck(course: Course, reqList):{addedCourse: boolean, reqList: any}{
        let courseString = course.subject + "-" + course.number;
        //determines whether course has fulfilled a major course and
        //shouldn't be check for a gen-ed req
        let addedCourse = false;
        const reqCheck = new StringProcessing();
        //run once or for each category the course is in
        for (var i = 0; i < reqList.length; i++) {
          let x = reqList[i];
          //initialize the variables if they aren't already
          if (x.coursesTaken == undefined) {
            x.coursesTaken = [];
          }
          if (x.creditCountTaken == undefined) {
            x.creditCountTaken = 0;
          }
          if (x.courseCountTaken == undefined) {
            x.courseCountTaken = 0;
          }
          if (x.percentage == undefined) {
            x.percentage = 0;
          }
          //Check if this is the category of the course
          if (course.idCategory == x.idCategory) {
            //Check if a course has already been used for this requirement
            if (x.coursesTaken.indexOf(courseString) == -1) {
              let courseReqArr = x.courseReqs.split(",");
              //The only requirement is a course count
              if (x.courseCount && !x.courseReqs && !x.creditCount) {
                x.courseCountTaken = x.courseCountTaken + 1;
                x.percentage = (x.courseCountTaken / x.courseCount) * 100;
              }
              //The only requirement is a courses required list
              if (!x.courseCount && x.courseReqs && !x.creditCount) {
                let validCourse = false;
                courseReqArr.forEach((item) => {
                  let found = reqCheck.courseInListCheck(item, [courseString], undefined);
                  if (found.returnValue) {
                    validCourse = true;
                  }
                });
                if (validCourse) {
                  x.percentage = x.percentage + (1 / courseReqArr.length) * 100;
                }
              }
              //The only requirement is a credit count
              if (!x.courseCount && !x.courseReqs && x.creditCount) {
                x.creditCountTaken = x.creditCountTaken + course.credits;
                x.percentage = (x.creditCountTaken / x.creditCount) * 100;
              }
              //The requirement is a course count and a list of required courses
              if (x.courseCount && x.courseReqs && !x.creditCount) {
                let validCourse = false;
                courseReqArr.forEach((item) => {
                  let found = reqCheck.courseInListCheck(item, [courseString], undefined);
                  if (found.returnValue) {
                    validCourse = true;
                  }
                });
                if (validCourse) {
                  x.percentage = x.percentage + (1 / courseReqArr.length) * 100;
                }
              }
              //The requirement is a credit count and list of required courses
              if (!x.courseCount && x.courseReqs && x.creditCount) {
                let temp1 = 1000;
                x.creditCountTaken = x.creditCountTaken + course.credits;
                let temp2 = (x.creditCountTaken / x.creditCount) * 100;
                let validCourse = false;
                courseReqArr.forEach((item) => {
                  let found = reqCheck.courseInListCheck(item, [courseString], undefined);
                  if (found.returnValue) {
                    validCourse = true;
                  }
                });
                if (validCourse) {
                  temp2 = x.percentage + (1 / courseReqArr.length) * 100;
                }
                if (temp1 < temp2) {
                  x.percentage = temp1;
                } else {
                  x.percentage = temp2;
                }
              }
              //The requirement is a credit count and a course count
              if (x.courseCount && !x.courseReqs && x.creditCount) {
                x.courseCountTaken = x.courseCountTaken + 1;
                x.creditCountTaken = x.creditCountTaken + course.credits;
                let temp1 = (x.creditCountTaken / x.creditCount) * 100;
                let temp2 = (x.courseCountTaken / x.courseCount) * 100;
                if (temp1 > temp2) {
                  x.percentage = temp2;
                } else {
                  x.percentage = temp1;
                }
              }
              //The requirement is a credit count, a course count, and a course list
              if (x.courseCount && x.courseReqs && x.creditCount) {
                //update taken credits and course count
                x.creditCountTaken = x.creditCountTaken + course.credits;
                x.courseCountTaken = x.courseCountTaken + 1;
                let validCourse = false;
                let temp1 = x.percentage;
                courseReqArr.forEach((item) => {
                  let found = reqCheck.courseInListCheck(item, [courseString], undefined);
                  if (found.returnValue) {
                    validCourse = true;
                  }
                });
                if (validCourse) {
                  temp1 = x.percentage + (1 / courseReqArr.length) * 100;
                }
                let temp2 = (x.creditCountTaken / x.creditCount) * 100;
                let temp3 = (x.courseCountTaken / x.courseCount) * 100;
                if (temp1 <= temp2 && temp1 <= temp3) {
                  x.percentage = temp1;
                } else if (temp2 <= temp1 && temp2 <= temp3) {
                  x.percentage = temp2;
                } else {
                  x.percentage = temp3;
                }
              }
              x.coursesTaken.push(courseString);
              addedCourse = true;
              if (x.parentCategory) {
                let temp1 = 1000;
                let temp2 = 1000;
                let parent = reqList.find(
                  (item) => item.idCategory === x.parentCategory
                );
                let parentIndex = reqList.indexOf(parent);
                //update for credits
                if (parent.creditCount != null) {
                  if (parent.creditCountTaken == undefined) {
                    reqList[parentIndex].creditCountTaken = 0;
                  }
                  reqList[parentIndex].creditCountTaken += course.credits;
                  temp1 =
                    reqList[parentIndex].creditCountTaken /
                    reqList[parentIndex].creditCount;
                }
                //update for number of courses
                if (parent.courseCount != null) {
                  if (parent.courseCountTaken == undefined) {
                    reqList[parentIndex].courseCountTaken = 0;
                  }
                  reqList[parentIndex].courseCountTaken += 1;
                  temp2 =
                    reqList[parentIndex].courseCountTaken /
                    reqList[parentIndex].courseCount;
                }
                if (parent.courseReqs != null) {
                  if (parent.coursesTaken == undefined) {
                    reqList[parentIndex].coursesTaken = "";
                  }
                  reqList[parentIndex].coursesTaken =
                    parent.coursesTaken + "," + courseString;
                  courseReqArr = reqList[parentIndex].split(",");
                  let validCourse = false;
                  courseReqArr.forEach((item) => {
                    let found = reqCheck.courseInListCheck(item, [courseString], undefined);
                    if (found.returnValue) {
                      validCourse = true;
                    }
                  });
                  if (validCourse) {
                    reqList[parentIndex].percentage =
                      reqList[parentIndex].percentage +
                      (1 / courseReqArr.length) * 100;
                  }
                } else {
                  //use the lesser percentage so we don't report complete if it's not
                  if (temp1 >= temp2) {
                    reqList[parentIndex].percentage = temp2 * 100;
                  } else {
                    reqList[parentIndex].percentage = temp1 * 100;
                  }
                }
                if (reqList[parentIndex].percentage > 100) {
                  reqList[parentIndex].percentage = 100;
                }
              }
              if (x.percentage > 100) {
                x.percentage = 100;
              }
            }
          }
        }
        return {addedCourse, reqList};
    }
}

export default RequirementProcessing;