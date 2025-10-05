import { useState } from 'react'
import './App.css'
import GeneralInfo from '../components/GeneralInfo';
import CompanyInfo from '../components/CompanyInfo';
import JobInfo from '../components/JobInfo';
import Section from '../components/Section';
import CVDisplay from '../components/CVDisplay';

function App() {
  const [isEditing, setIsEditing] = useState(true);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [adresa, setAdresa] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyAdresa, setCompanyAdresa] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const [positionTitle, setPositionTitle] = useState('');
  const [jobType, setJobType,] = useState('plný úväzok');
  const [placeOfWork, setPlaceOfWork] = useState('');
  const [startDate, setStartDate] = useState('');
  const [salary, setSalary] = useState('');

  const [duties, setDuties] = useState(['']);

  const userData = {
    name, birthDate, adresa, email, phone,
    companyName, companyAdresa, contactInfo,
    positionTitle, jobType, placeOfWork, startDate, salary,
    duties
  };

  function handleSubmit(e) {
    e.preventDefault(); 
    setIsEditing(false);
    alert('Data was successfully saved!'); 
  }

  function handleEdit() {
    setIsEditing(true); 
  }

  return (
    <div className='App'>
      <h1>Pracovná zmluva</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <GeneralInfo {...{name, setName, birthDate, setBirthDate, adresa, setAdresa, email, setEmail, phone, setPhone}} />   
          <CompanyInfo {...{companyName, setCompanyName, companyAdresa, setCompanyAdresa, contactInfo, setContactInfo}} />      
          <JobInfo {...{positionTitle, setPositionTitle, jobType, setJobType, placeOfWork, setPlaceOfWork, startDate, setStartDate, salary, setSalary}} />
          <Section {...{duties, setDuties}} />
          <button type='submit'>Submit</button>
        </form>
        ) : (
          <CVDisplay data={userData} onEdit={handleEdit} />
      )}
    </div>
  );
}

export default App
