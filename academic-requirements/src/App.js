import React, { useEffect, useState } from "react";
import "./App.css";
import InputPage from "./components/InputPage.tsx";
import FourYearPlanPage from "./components/FourYearPlanPage.tsx";
import ErrorPopup from "./components/ErrorPopup";

// DELETE ME WHEN DONE
import StringProcessing from "./stringProcessing/StringProcessing.tsx";

function App() {
  /* Variables to store necessary info */
  const [clickedGenerate, setClickedGenerate] = useState();
  const [previouslyTakenCourses, setPreviouslyTakenCourses] = useState();

  //majorData is an array of major objects returned from the database
  const [majorData, setMajorData] = useState([]);
  //majorDisplayData is an array of the 'name' of the major objects for display purposes
  const [majorDisplayData, setMajorDisplayData] = useState([]);
  //majorCode is an array of the 'idMajor' of the major objects for query purposes
  const [majorCode, setMajorCode] = useState();

  //concentrationData is an array of concentration objects
  const [concentrationData, setConcentrationData] = useState([]);
  //concentrationDisplayData is an array of the 'name' of the concentration objects
  const [concentrationDisplayData, setConcentrationDisplayData] = useState([]);
  //concentrationCode is an array of the 'idConcentration' of the concentration objects
  const [concentrationCode, setConcentrationCode] = useState();

  //majorCourseData is an array of course objects related to the major
  const [majorCourseData, setMajorCourseData] = useState([]);
  //concentrationCourseData is an array of the course object related to the concentration
  const [concentrationCourseData, setConcentrationCourseData] = useState([]);

  const [major, setMajor] = useState("");
  const [concentration, setConcentration] = useState("");

  //Functions and variables for controlling an error popup
  const [visibility, setVisibility] = useState(false);
  const popupCloseHandler = () => {
    setVisibility(false);
  };
  const [error, setError] = useState("");
  function throwError(error) {
    setVisibility(true);
    setError(error);
  }

  // Processes when the user clicks to generate the schedule
  function generateSchedule(major, concentration, previousCourses) {
    console.log("Generate Schedule Pressed");
    if (major != "" && concentration != "") {
      setClickedGenerate(true);
      setPreviouslyTakenCourses(previousCourses);
      setMajor(major);
      setConcentration(concentration);
    } else {
      if (major == "") {
        throwError(
          "No major is selected \n Please select a major before continuing."
        );
      } else {
        throwError(
          "No concentration is selected \n Please select a concentration before continuing."
        );
      }
    }
    // Sends information to the console for manual review
    console.log("Major: " + major + ", Concentration: " + concentration);
    console.log("Courses taken: ");
    previousCourses.forEach((course) => {
      console.log(course + ", ");
    });
  }
  // Sets major to the selected major from the dropdown
  function selectMajor(selectedMajor) {
    setMajor(selectedMajor);
  }

  // Sets concentration to the selected concentration from the dropdown
  function selectConcentration(selectedConcentration) {
    setConcentration(selectedConcentration);
  }

  // Gets the majors from the database, runs on start-up
  useEffect(() => {
    fetch("/major")
      .then((res) => res.json())
      .then((result) => {
        // Sets majorData to result from database query
        setMajorData(result);
        // Gets the 'name' of the major objects
        let temp = [];
        result.forEach((x) => {
          temp.push(x.name);
        });
        // Sets majorDisplayData to the 'name' of the majors
        setMajorDisplayData(temp);
      });
  }, []);

  // Gets the concentrations from the database based on the 'idMajor' of the selected major
  // Runs when majorCode is updated
  useEffect(() => {
    fetch(`/concentration?majid=${majorCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets concentrationData to result from database query
        setConcentrationData(result);
        // Gets the 'name' of the concentration objects
        let temp = [];
        result.forEach((x) => {
          temp.push(x.name);
        });
        // Sets concentrationDisplayData to the 'name' of the concentrations
        setConcentrationDisplayData(temp);
      });
  }, [majorCode]);

  // Gets the courses related to the 'idMajor' of the selected major
  // Runs when majorCode is updated
  useEffect(() => {
    fetch(`/courses/major?majid=${majorCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets majorCourseData to the result from the query
        setMajorCourseData(result);
      });
  }, [majorCode]);

  // Gets the courses related to the 'idConcentration' of the selected concentration
  // Runs when concentrationCode is updated
  useEffect(() => {
    fetch(`/courses/concentration?conid=${concentrationCode}`)
      .then((res) => res.json())
      .then((result) => {
        // Sets concentrationCourseData to the result from the query
        setConcentrationCourseData(result);
      });
  }, [concentrationCode]);

  // Gets the 'idMajor' relating to the 'name' of the selected major
  // Runs when major is updated
  useEffect(() => {
    for (let i = 0; i < majorData.length; i++) {
      if (majorDisplayData[i] == major) {
        // Sets the majorCode to the 'idMajor' of the selected major
        setMajorCode(majorData[i].idMajor);
      }
    }
  }, [major]);

  // Gets the 'idConcentration' relating to the 'name' of the selected major
  // Runs when concentration is updated
  useEffect(() => {
    for (let i = 0; i < concentrationData.length; i++) {
      if (concentrationDisplayData[i] == concentration) {
        // Sets the concentrationCode to the 'idConcentration' of the selected concentration
        setConcentrationCode(concentrationData[i].idConcentration);
      }
    }
  }, [concentration]);

  // DELETE ME WHEN DONE
  useEffect(() => {
    let stringProcess = new StringProcessing();

    // Basic edge case examples:

    // true -> string compare is blank, so always true
    let check = stringProcess.courseInListCheck('',['CS-144']);
    !check && console.log('fail0.0');

    // true -> string compare is null, so always true
    check = stringProcess.courseInListCheck(null,['CS-144']);
    !check && console.log('fail0.1');

    // true -> string compare is undefined, so always true
    check = stringProcess.courseInListCheck(undefined,['CS-144']);
    !check && console.log('fail0.2');

    // false -> course array is empty, so cannot be satisfied
    check = stringProcess.courseInListCheck('CS-144',[]);
    check && console.log('fail0.3');

    // false -> course array is null, so cannot be satisfied
    check = stringProcess.courseInListCheck('CS-144',null);
    check && console.log('fail0.4');

    // false -> course array is undefined, so cannot be satisfied
    check = stringProcess.courseInListCheck('CS-144',undefined);
    check && console.log('fail0.5');

    // true -> one course comparison matches
    check = stringProcess.courseInListCheck('CS-144',['CS-144']);
    !check && console.log('fail0.6');

    // false -> one course comparison not matches
    check = stringProcess.courseInListCheck('CS-144',['CS-145']);
    check && console.log('fail0.7');

    // false -> one course missing from AND
    check = stringProcess.courseInListCheck('CS-144,CS-145',['CS-144','CS-146']);
    check && console.log('fail0.8');

    // true -> both courses match AND
    check = stringProcess.courseInListCheck('CS-144,CS-145',['CS-144','CS-145']);
    !check && console.log('fail0.9');

    // false -> one course missing from AND
    check = stringProcess.courseInListCheck('CS-144,CS-145',['CS-144','CS-146']);
    check && console.log('fail0.10');

    // true -> one course matches OR
    check = stringProcess.courseInListCheck('CS-144|CS-145',['CS-144','CS-147']);
    !check && console.log('fail0.11');

    // true -> other course matches OR
    check = stringProcess.courseInListCheck('CS-144|CS-145',['CS-145','CS-147']);
    !check && console.log('fail0.12');

    // true -> both courses matches OR
    check = stringProcess.courseInListCheck('CS-144|CS-145',['CS-144','CS-145']);
    !check && console.log('fail0.13');

    // false -> no courses match OR
    check = stringProcess.courseInListCheck('CS-144|CS-145',['CS-148','CS-142']);
    check && console.log('fail0.14');

    // true -> both courses match SUBAND
    check = stringProcess.courseInListCheck('CS-144&CS-145',['CS-144','CS-145']);
    !check && console.log('fail0.15');

    // false -> one course missing from SUBAND
    check = stringProcess.courseInListCheck('CS-144&CS-145',['CS-144','CS-146']);
    check && console.log('fail0.16');

    // false -> garbage put in for course compare
    check = stringProcess.courseInListCheck('gibberish',['CS-144','CS-146']);
    check && console.log('fail0.17');

    // false -> garbage put in for course compare
    check = stringProcess.courseInListCheck('CS-144',['garbage','icky']);
    check && console.log('fail0.18');

    // true -> garbage put in for one course, but rest match
    check = stringProcess.courseInListCheck('CS-144,CS-145',['CS_144','garbage','CS-145','icky']);
    !check && console.log('fail0.19');
    
    // true -> compare if string has a - or _ in it, still compares correctly
    check = stringProcess.courseInListCheck('CS-144,CS_145,CS-146',['CS_144',"CS-145",'CS_146']);
    !check && console.log('fail0.20');

    // true -> one course is taken concurrently
    check = stringProcess.courseInListCheck('!CS-144,CS-130',['CS-130','CS-180'],['CS-144']);
    !check && console.log('fail0.21');

    // false -> one course is not taken currently nor concurrently
    check = stringProcess.courseInListCheck('!CS-144,CS-130',['CS-130','CS-180'],['CS-145']);
    check && console.log('fail0.22');

    // true -> checking for dash and underline difference in concurrent courses
    check = stringProcess.courseInListCheck('!CS-144,CS-130',['CS-130','CS-180'],['CS_144']);
    !check && console.log('fail0.23');

    // true -> checking for OR course taken concurrently
    check = stringProcess.courseInListCheck('!CS-144|CS-130',['CS-129','CS-180'],['CS-144']);
    !check && console.log('fail0.24');

    // true -> checking for SUBAND course taken concurrently
    check = stringProcess.courseInListCheck('!CS-144&CS-130',['CS-130','CS-180'],['CS-144']);
    !check && console.log('fail0.25');

    // false -> SUBAND course is taken concurrently but not both
    check = stringProcess.courseInListCheck('!CS-144&CS-130',['CS-129','CS-180'],['CS-144']);
    check && console.log('fail0.26');

    // true -> both courses are taken concurrently
    check = stringProcess.courseInListCheck('!CS-144,!CS-130',['CS-129','CS-180'],['CS-144','CS_130']);
    !check && console.log('fail0.27');

    // true -> one of the two courses are taken concurrently
    check = stringProcess.courseInListCheck('!CS-144|!CS-130',['CS-129','CS-180'],['CS-145','CS_130']);
    !check && console.log('fail0.28');

    // true -> real example with concurrent taken course
    check = stringProcess.courseInListCheck('!BIO_332|CHEM_311|CS_244',['CS-244','CHEM-311'],['BIO-332']);
    !check && console.log('fail0.29');

    // true -> check all courses in SUBANDs are satisfied
    check = stringProcess.courseInListCheck('CS-100&CS_101&CS-102',['CS-102','CS-101','CS-100']);
    !check && console.log('fail0.30'); 

    // true -> course above minimum is taken
    check = stringProcess.courseInListCheck('>CS-101',['CS-102']);
    !check && console.log('fail0.31');

    // false -> course above minimum is not taken
    check = stringProcess.courseInListCheck('>CS-101',['CS-100']);
    check && console.log('fail0.32');

    // true -> course above minimum is taken with an AND
    check = stringProcess.courseInListCheck('CS-101,>CS-102',['CS-100','CS-101','CS-103']);
    !check && console.log('fail0.32');

    // true -> course above minimum is taken with an OR
    check = stringProcess.courseInListCheck('CS-101|>MSCS-102',['MSCS-100','CS-101','MSCS-103']);
    !check && console.log('fail0.33');

    // false -> course above minimum is not taken with an OR
    check = stringProcess.courseInListCheck('CS-103|>MSCS-102',['MSCS-100','CS-101','MSCS-101']);
    check && console.log('fail0.33');

    // false -> course above minimum is taken with an OR
    check = stringProcess.courseInListCheck('CS-101|>MSCS-102',['MSCS-100','CS-101','MSCS-102']);
    !check && console.log('fail0.33');

    //REAL EXAMPLES:

    /* GDD450 Prerequisites */

    // true (SUBAND is satisfied)
    check = stringProcess.courseInListCheck('GDD_325,CS-326&CS_358|DES-350',["GDD_101","CS-358","CS-134","CS_123",'GDD_325','DES-349',"CS-326"]);
    !check && console.log('fail1.0');

    // false (SUBAND not satisfied)
    check = stringProcess.courseInListCheck('GDD_325,CS-326&CS_358|DES-350',["GDD_101","CS-134","CS_123",'GDD_325','DES-349',"CS-326","CS-369"]);
    check && console.log('fail1.1');

    // true (SUBAND not satisfied; OR satisfied)
    check = stringProcess.courseInListCheck('GDD_325,CS-326&CS_358|DES-350',["GDD_101","CS-134","CS_123",'GDD_325','DES-350',"CS-326","CS-369"]);
    !check && console.log('fail1.2');

    // false (SUBAND satisfied; AND not satisfied)
    check = stringProcess.courseInListCheck('GDD_325,CS-326&CS_358|DES-350',["CS-326","GDD_101","CS-134","CS_123",'DES-349',"CS-358"]);
    check && console.log('fail1.3');

    // false (OR satisfied; AND not satisfied)
    check = stringProcess.courseInListCheck('GDD_325,CS-326&CS_358|DES-350',["GDD_101","CS-134","CS_123",'DES-350',"CS-358"]);
    check && console.log('fail1.4');

    // true (AND satisifed; OR satisfied; SUBAND satisfied)
    check = stringProcess.courseInListCheck('GDD_325,CS-326&CS_358|DES-350',["GDD_325","GDD_101","CS-326","CS-134","CS_123",'DES-350',"CS-358"]);
    !check && console.log('fail1.5');

    /* Long psychology requirements */

    // true (all courses are taken)
    check = stringProcess.courseInListCheck('PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490',['PSYC-100','PSYC-110','PSYC-190','PSYC-233','PSYC-242','PSYC-251','PSYC-270','PSYC-290','PSYC-300','PSYC-320','PSYC-350','PSYC-490']);
    !check && console.log('fail2.0');

    // true (all courses are taken, but in a different order as above test)
    check = stringProcess.courseInListCheck('PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490',['PSYC-110','PSYC-270','PSYC-190','PSYC-233','PSYC-490','PSYC-350','PSYC-242','PSYC-100','PSYC-251','PSYC-290','PSYC-320','PSYC-300']);
    !check && console.log('fail2.1');

    // false (one course is missing)
    check = stringProcess.courseInListCheck('PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490',['PSYC-110','PSYC-270','PSYC-190','PSYC-490','PSYC-350','PSYC-242','PSYC-100','PSYC-251','PSYC-290','PSYC-320','PSYC-300']);
    check && console.log('fail2.2');

    // false (many courses are missing)
    check = stringProcess.courseInListCheck('PSYC-100,PSYC-110,PSYC-190,PSYC-233,PSYC-242,PSYC-251,PSYC-270,PSYC-290,PSYC-300,PSYC-320,PSYC-350,PSYC-490',['PSYC-110','PSYC-242','PSYC-100','PSYC-251','PSYC-290','PSYC-320','PSYC-300']);
    check && console.log('fail2.3');

    // true (all course are present in OR)
    check = stringProcess.courseInListCheck('PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291',['PSYC-121','PSYC-225','PSYC-280','PSYC-333','PSYC-355','PSYC-370','PSYC-371','PSYC-377','PSYC-381','PSYC-382','PSYC-291']);
    !check && console.log('fail2.4');

    // true (one course is present in OR)
    check = stringProcess.courseInListCheck('PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291',['PSYC-371']);
    !check && console.log('fail2.5');

    // true (another one course is present in OR)
    check = stringProcess.courseInListCheck('PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355|PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291',['PSYC-382']);
    !check && console.log('fail2.6');

    // true (two long ORs joined by an AND)
    check = stringProcess.courseInListCheck('PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355,PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291',['PSYC-377','PSYC_280']);
    !check && console.log('fail2.7');

    // false (two long ORs joined by an AND, but one of the ANDs is false)
    check = stringProcess.courseInListCheck('PSYC-121|PSYC-225|PSYC-280|PSYC-333|PSYC-355,PSYC-370|PSYC-371|PSYC-377|PSYC-381|PSYC-382|PSYC-291',['PSYC-377','PSYC_283']);
    check && console.log('fail2.8');

    // true (another one course is present in OR; all are concurrent)
    check = stringProcess.courseInListCheck('!PSYC-121|!PSYC-225|!PSYC-280|!PSYC-333|!PSYC-355|!PSYC-370|!PSYC-371|!PSYC-377|!PSYC-381|!PSYC-382|!PSYC-291',['PSYC-382']);
    !check && console.log('fail2.9');

    // true (two long ORs joined by an AND; all are concurrent)
    check = stringProcess.courseInListCheck('!PSYC-121|!PSYC-225|!PSYC-280|!PSYC-333|!PSYC-355,!PSYC-370|!PSYC-371|!PSYC-377|!PSYC-381|!PSYC-382|!PSYC-291',['PSYC-377','PSYC-333']);
    !check && console.log('fail2.10');

    /* Strings with greater than specific courses */

    // true (all 'concrete' courses are taken)
    check = stringProcess.courseInListCheck('MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300',['MATH-270','MATH-157','MATH-275','MATH-158']);
    !check && console.log('fail3.0');

    // true (a greater than course is taken)
    check = stringProcess.courseInListCheck('MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300',['MATH-270','MATH-157','MATH-275','MSCS-209']);
    !check && console.log('fail3.1');

    // true (a greater than course is taken)
    check = stringProcess.courseInListCheck('MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300',['MATH-270','MATH-157','MATH-275','STAT-300']);
    !check && console.log('fail3.2');

    // false (no greater than courses are taken)
    check = stringProcess.courseInListCheck('MATH-154|MATH-157,MATH-270,MATH-275,MATH-158|>MSCS-200|>STAT-300',['MATH-270','MATH-157','MATH-275','MSCS-170','STAT-201']);
    check && console.log('fail3.3');

    // true (no greater than courses are taken but concurrent course is taken)
    check = stringProcess.courseInListCheck('MATH-154|MATH-157,MATH-270,MATH-275,!MATH-158|>MSCS-200|>STAT-300',['MATH-270','MATH-157','MATH-275','MSCS-170','STAT-201'],['MATH-158']);
    !check && console.log('fail3.4');

    // true (concrete course is taken)
    check = stringProcess.courseInListCheck('NANO_230|>CHEM_200|>PHYS_281',['MATH-270','NANO-230']);
    !check && console.log('fail3.5');

    // true (greater than course is taken)
    check = stringProcess.courseInListCheck('NANO_230|>CHEM_200|>PHYS_281',['MATH-270','PHYS-290','NANO-229']);
    !check && console.log('fail3.6');

    // true (another greater than course is taken)
    check = stringProcess.courseInListCheck('NANO_230|>CHEM_200|>PHYS_281',['MATH-270','CHEM-200','NANO-229']);
    !check && console.log('fail3.7');

    // false (no greater than course or concrete course is taken)
    check = stringProcess.courseInListCheck('NANO_230|>CHEM_200|>PHYS_281',['MATH-270','PHYS-280','NANO-229']);
    check && console.log('fail3.8');

    // true (all greater than courses are taken)
    check = stringProcess.courseInListCheck('NANO_230,>CHEM_200,>PHYS_281',['PHYS-290','NANO-230','CHEM-199','CHEM-201']);
    !check && console.log('fail3.9');

    // false (not all greater than courses are taken)
    check = stringProcess.courseInListCheck('NANO_230,>CHEM_200,>PHYS_281',['PHYS-290','NANO-230','CHEM-199','CHEM-198']);
    check && console.log('fail3.10');
    
  },[]);

  return (
    <div>
      <InputPage
        showing={!clickedGenerate}
        onClickGenerate={generateSchedule}
        onClickMajor={selectMajor}
        onClickConcentration={selectConcentration}
        concentrationList={concentrationData}
        majorList={majorData}
        majorDisplayList={majorDisplayData}
        concentrationDisplayList={concentrationDisplayData}
      />
      <FourYearPlanPage
        showing={clickedGenerate}
        concentrationCourseList={concentrationCourseData}
        majorCourseList={majorCourseData}
      />
      <ErrorPopup
        onClose={popupCloseHandler}
        show={visibility}
        title="Error"
        error={error}
      />
    </div>
  );
}

export default App;
