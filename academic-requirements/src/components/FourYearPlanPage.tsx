import React from "react";

const FourYearPlanPage = (props: { showing: boolean }) => {
  return <div>{props.showing && <div>"Four Year Plan Page Here!"</div>}</div>;
};

export default FourYearPlanPage;
