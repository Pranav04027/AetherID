"use client";
import { useState } from "react";

export default function Page() {
  const [fields, setFields] = useState<string[]>([""]);

  const handleChange = (index: number, value: string) => {
    const copy = [...fields];
    copy[index] = value;
    setFields(copy);
  };

  const addField = () => setFields([...fields, ""]);

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log(fields); // array of inputs
  };

  return (
    <div>
      {fields.map((value, i) => (
        <div key={i}>
          <input
            value={value}
            onChange={(e) => handleChange(i, e.target.value)}
          />
          <button onClick={() => removeField(i)}>Remove</button>
        </div>
      ))}

      <button onClick={addField}>Add input</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
