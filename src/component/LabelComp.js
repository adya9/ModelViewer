//this is the label code
import React from 'react';


const LabelComp = ({ index, label, onLabelChange}) => {
  const handleChange = (event) => {
    onLabelChange(index, event.target.value);
  };

  return (
    <div className="m-4 p-3 bg-white rounded-md shadow-md ">
      <div className="flex flex-row justify-between">
        <label className="font-semibold">Label </label>
        <i className="fi fi-rr-trash text-red-500"></i>
        
      </div> 
      <input
        type="text"
        value={label}
        onChange={handleChange}
        className="mt-2 p-2 border rounded-md w-full"
      />
    </div>
  );
};

export default LabelComp;