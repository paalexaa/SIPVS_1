import { IoIosMenu } from "react-icons/io";
import '../styles/Section.css';
import 'react-datepicker/dist/react-datepicker.css';

function Section({ duties, setDuties }) {
  const addDuty = () => setDuties([...duties, ""]);

  const removeDuty = (index) => {
    const newDuties = duties.filter((_, i) => i !== index);
    setDuties(newDuties);
  };

  const updateDuty = (index, value) => {
    const newDuties = [...duties];
    newDuties[index] = value;
    setDuties(newDuties);
  };

  return (
    <div className="practicalExperience">
      <h3>Pracovné povinnosti</h3>

      {duties.map((duty, index) => (
        <div key={index} className="input-group duty-item">
          <IoIosMenu className="input-icon" />
          <input
            type="text"
            placeholder={`Povinnosť ${index + 1}`}
            value={duty}
            onChange={(e) => updateDuty(index, e.target.value)}
          />
          <button className="delete-btn" type="button" onClick={() => removeDuty(index)}>
            ❌
          </button>
        </div>
      ))}

      <button type="button" onClick={addDuty} className="add-btn">
        ➕ Pridať povinnosť
      </button>
    </div>
  );
}

export default Section;
