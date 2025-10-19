
import { MdWork } from "react-icons/md";
import { CgHomeAlt } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import 'react-phone-input-2/lib/style.css'
import '../styles/CompanyInfo.css';

function CompanyInfo ({companyName, setCompanyName, companyAdresa, setCompanyAdresa, contactInfo, setContactInfo}) {
    return (
        <div className='CompanyInfo'>
            <h3>Údaje o zamestnávateľovi</h3>
            <div className="input-group">
                <MdWork className="input-icon"/>
                <input type='text' placeholder="Názov spoločnosti" value={companyName} onChange={(e => setCompanyName(e.target.value))} />
            </div>
            <div className="input-group">
                <CgHomeAlt className="input-icon"/>
                <input type='text' placeholder="Sídlo spoločnosti" value={companyAdresa} onChange={(e => setCompanyAdresa(e.target.value))} />
            </div>
            <div className="input-group">
                <MdOutlineEmail className="input-icon"/>
                <input type='text' placeholder="Kontaktná osoba" value={contactInfo} onChange={(e => setContactInfo(e.target.value))} />
            </div>
        </div>
    )
}

export default CompanyInfo;