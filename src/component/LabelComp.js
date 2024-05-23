import React from 'react';

const LabelComp = ({ id, label, onLabelChange, onDelete, onChecked }) => {
  const handleChange = (event) => {
    onLabelChange(id, event.target.value);
  };

  const handleChecked = () => {
    onChecked(id);
  }


  const handleLabelDelete = () => {
    onDelete(id);
  }

  return (
    <div className="m-4 p-3 bg-white rounded-md shadow-md ">
      <div className="flex flex-row justify-between">
        <label className="font-semibold">Label </label>
        <div className='flex flex-row justify-between' >
          <input type="checkbox" onClick={handleChecked}></input>
          <i className="fi fi-rr-trash text-red-500" onClick={handleLabelDelete}></i>
        </div>

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