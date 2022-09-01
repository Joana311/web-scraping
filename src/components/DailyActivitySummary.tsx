import React from "react";
import MuscleHeatMap from "./MuscleHeatMap";

const DailyActivitySummary = () => {
  const summary_info = {
    "Weight Moved": undefined,
    "Calories Burned": undefined,
    "Personal Bests": undefined,
  }
  Object.entries
  return (
    <>
      <h1 className="font-light">Today's Activity</h1>
      <div
        id="summary-container"
        className='flex flex-row rounded-md bg-secondary'
      >
        <div id='summary-info'
          className="flex w-[62%] flex-col 
              items-start space-y-[1.5rem]
              pt-[1.2rem] pb-[1rem] pl-[1.5rem]" >
          {Object.entries(summary_info).map(([info_key, amount], index) => {
            return (
              <article id="summary-item"
                key={index}
                className="flex w-[15ch] flex-col 
                  items-center 
                  border-b-[1px] border-white/25 
                  pb-[.2rem] ">
                <h1 id="info-name" className='text-[.9rem] font-light'>
                  {info_key}
                </h1>
                <span id="info-value"> {amount ?? '-'} </span>
              </article>
            )
          })}

        </div>
        <div id='heatmap' className="w-[38%] p-[.5rem]">
          <MuscleHeatMap />
        </div>
      </div>
    </>
  );
};

export default DailyActivitySummary;
