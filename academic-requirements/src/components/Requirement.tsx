import type { FC } from "react";
import { memo } from "react";
import React from "react";

//defines the expected course properties
export interface RequirementProps {
  courseCount: number;
  courseReqs: string;
  creditCount: number;
  idCategory: number;
  name: string;
  parentCategory: number;
  percentage: number;
  coursesTaken: string;
  courseCountTaken: number;
  creditCountTaken: number;
}

export const Requirement: FC<RequirementProps> = memo(function Requirement({
  courseCount,
  courseReqs,
  creditCount,
  idCategory,
  name,
  parentCategory,
  percentage,
  coursesTaken,
  courseCountTaken,
  creditCountTaken,
}) {
  return (
    <div data-testid="requirement" className="RequirementText">
      <div className="requirementName">{name}</div>
      <div className="percentage">
        {percentage ? percentage + "%" : 0 + "%"}
      </div>
    </div>
  );
});
