import { IoIosMenu } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { CgWorkAlt, CgEuro } from "react-icons/cg";
import '../styles/JobInfo.css';
import 'react-datepicker/dist/react-datepicker.css';

function JobInfo ({positionTitle, setPositionTitle, jobType, setJobType, placeOfWork, setPlaceOfWork, startDate, setStartDate, salary, setSalary}) {
    return (
        <div className='JobInfo'>
            <h3>Pracovný pomer</h3>
            <div className="input-group">
                <IoIosMenu className="input-icon"/>
                <input type='text' placeholder="Názov pozície" value={positionTitle} onChange={(e => setPositionTitle(e.target.value))} />
                {/* atribút typ */}
                <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                    <option value="plný úväzok">Plný úväzok</option>
                    <option value="polovičný">Polovičný</option>
                </select>
            </div>
            <div className="input-group">
                <CgWorkAlt className="input-icon"/>
                <input type='text' placeholder="Miesto výkonu práce" value={placeOfWork} onChange={(e => setPlaceOfWork(e.target.value))} />
            </div>
            <div className="input-group">
                <CiCalendarDate className="input-icon"/>
                <input type='text' placeholder="Dátum začiatku (DD Month YYYY)" value={startDate} onChange={(e => setStartDate(e.target.value))} 
                    pattern="^\d{2}\s[A-Za-z]+\s\d{4}$"
                    title="Format: DD Month YYYY" 
                />
            </div>
            <div className="input-group">
                <CgEuro className="input-icon"/>
                <input type='text' placeholder="Základná mzda (EUR)" value={salary} onChange={(e => setSalary(e.target.value))} />
            </div>
        </div>
    )
}

export default JobInfo;