
import { CgProfile } from "react-icons/cg";
import { CgHomeAlt } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import '../styles/GeneralInfo.css';
import { useState } from "react";

function GeneralInfo ({name, setName, birthDate, setBirthDate, adresa, setAdresa, email, setEmail, phone, setPhone}) {
    return (
        <div className='generalInfo'>
            <h3>Údaje o zamestnancovi</h3>
            <div className="input-group">
                <CgProfile className="input-icon"/>
                <input type='text' placeholder="Meno a priezvisko" value={name} onChange={(e => setName(e.target.value))} />
            </div>
            <div className="input-group">
                <CiCalendarDate className="input-icon"/>
                <input type='text' placeholder="Dátum narodenia (DD.MM.YYYY)" value={birthDate} onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);

                    const d = digits.slice(0, 2);
                    const m = digits.slice(2, 4);
                    const y = digits.slice(4, 8);

                    let out = d;
                    if (digits.length > 2) out += "." + m;
                    if (digits.length > 4) out += "." + y;

                    setBirthDate(out);
                    }}
                    onBlur={() => {
                    const m = birthDate.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
                    if (m) {
                        const dd = m[1].padStart(2, "0");
                        const mm = m[2].padStart(2, "0");
                        setBirthDate(`${dd}.${mm}.${m[3]}`);
                    }
                    }}
                    maxLength={10}
                    pattern="^\d{2}\.\d{2}\.\d{4}$"
                    title="Format: DD.MM.YYYY" 
                />
            </div>
            <div className="input-group">
                <CgHomeAlt className="input-icon"/>
                <input type='text' placeholder="Adresa" value={adresa} onChange={(e => setAdresa(e.target.value))} />
            </div>
            <div className="input-group">
                <MdOutlineEmail className="input-icon"/>
                <input type='text' placeholder="E-mail" value={email} onChange={(e => setEmail(e.target.value))} />
            </div>
            <div className="input-group phone-input-wrapper">
                <PhoneInput
                    country={'sk'}
                    value={phone}
                    onChange={setPhone}
                    inputProps={{
                        maxLength: 16
                    }}
                    enableSearch
                    inputStyle={{
                        backgroundColor: '#2a2d4d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        width: '100%',
                        paddingLeft: '44px'
                    }}
                    buttonStyle={{
                        backgroundColor: '#2a2d4d',
                        border: 'none'
                    }}
                    containerStyle={{ width: '100%' }}
                    />
            </div>
        </div>
    )
}

export default GeneralInfo;