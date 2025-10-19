import '../styles/CVDisplay.css';

function CVDisplay ({data, onEdit}) {
  const {
    name, 
    birthDate, 
    adresa, 
    email, 
    phone,
    companyName, 
    companyAdresa, 
    contactInfo,
    positionTitle, 
    jobType, 
    placeOfWork, 
    startDate, 
    salary,
    duties
  } = data;

  return (
      <div className='cvDisplay'>
        <div className="cv-section">
          <h2>Údaje o zamestnancovi</h2>
          <p><strong>Meno a priezvisko:</strong> {name}</p>
          <p><strong>Dátum narodenia:</strong> {birthDate}</p>
          <p><strong>Adresa:</strong> {adresa}</p>
          <p><strong>E-mail:</strong> {email}</p>
          <p><strong>Telefónne číslo:</strong> {phone}</p>
        </div>
        <div className="cv-section">
          <h2>Údaje o zamestnávateľovi</h2>
          <p><strong>Názov spoločnosti:</strong> {companyName}</p>
          <p><strong>Sídlo spoločnosti:</strong> {companyAdresa}</p>
          <p><strong>Kontaktná osoba:</strong> {contactInfo}</p>
        </div>
        <div className="cv-section">
          <h2>Pracovný pomer</h2>
          <p><strong>Názov pozície:</strong> {positionTitle}</p>
          <p> {jobType}</p>
          <p><strong>Miesto výkonu práce:</strong> {placeOfWork}</p>
          <p><strong>Dátum začiatku:</strong> {startDate}</p>
          <p><strong>Základná mzda:</strong> {salary}</p>
        </div>
        <div className="cv-section">
          <h2>Pracovné povinnosti</h2>
          <p>{duties}</p>
        </div>
        <button type='button' onClick={onEdit}>Edit</button>
      </div>
  );
}

export default CVDisplay;