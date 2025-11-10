
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
                <CiCalendarDate className="input-icon" />
                <input
                    type="date"
                    placeholder="Dátum narodenia"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)} // <-- формат YYYY-MM-DD
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