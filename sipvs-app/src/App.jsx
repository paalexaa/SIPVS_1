import { useState } from "react";
import "./App.css";
import GeneralInfo from "../components/GeneralInfo";
import CompanyInfo from "../components/CompanyInfo";
import JobInfo from "../components/JobInfo";
import Section from "../components/Section";
import CVDisplay from "../components/CVDisplay";

import { signXmlFile } from "../src/sign";

function App() {
  const [isEditing, setIsEditing] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [adresa, setAdresa] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyAdresa, setCompanyAdresa] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [positionTitle, setPositionTitle] = useState("");
  const [jobType, setJobType] = useState("plný úväzok");
  const [placeOfWork, setPlaceOfWork] = useState("");
  const [startDate, setStartDate] = useState("");
  const [salary, setSalary] = useState("");

  const [duties, setDuties] = useState([""]);

  const userData = {
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
    duties,
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/generate-xml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const html = await response.text();

      const newWindow = window.open();
      newWindow.document.write(html);
      newWindow.document.close();

      setIsEditing(false);
    } catch (error) {
      console.error("Chyba pri odosielaní údajov:", error);
      alert("Došlo k chybe pri spracovaní údajov.");
    }
  }

  async function handleSign() {
    try {
      setIsSigning(true);

      await fetch("http://localhost:8080/api/generate-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      await signXmlFile(userData);

      const signed = await signXmlFile(userData);

      if (signed) {
        setIsSigned(true);
      }
    } catch (error) {
      console.error("Chyba pri podpise:", error);
      alert("Došlo k chybe pri podpise dokumentu.");
    } finally {
      setIsSigning(false);
    }
  }

  async function handleTimestamp() {
    // if (!isSigned) {
    //   alert("Nemožno vytvoriť pečiatku pre nepodpísaný dokument.");
    //   return;
    // }

    try {
      const response = await fetch(
        "http://localhost:8080/api/generate-timestamp",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        alert("Chyba pri vytváraní časovej pečiatky: " + text);
        return;
      }

      const message = await response.text();
      alert("Časová pečiatka bola úspešne vytvorená. " + message);
    } catch (error) {
      console.error("Chyba pri vytváraní časovej pečiatky:", error);
      alert("Došlo k chybe pri vytváraní časovej pečiatky: " + error.message);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  return (
    <div className="App">
      <h1>Pracovná zmluva</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <GeneralInfo
            {...{
              name,
              setName,
              birthDate,
              setBirthDate,
              adresa,
              setAdresa,
              email,
              setEmail,
              phone,
              setPhone,
            }}
          />
          <CompanyInfo
            {...{
              companyName,
              setCompanyName,
              companyAdresa,
              setCompanyAdresa,
              contactInfo,
              setContactInfo,
            }}
          />
          <JobInfo
            {...{
              positionTitle,
              setPositionTitle,
              jobType,
              setJobType,
              placeOfWork,
              setPlaceOfWork,
              startDate,
              setStartDate,
              salary,
              setSalary,
            }}
          />
          <Section {...{ duties, setDuties }} />
          <button type="submit">Generovať dokumenty</button>
          <button
            type="button"
            onClick={handleSign}
            className="btn-sign"
            disabled={isSigning}
          >
            {isSigning ? "Podpisujem..." : "Podpísať"}
          </button>
          <button type="button" onClick={handleTimestamp}>
            Vygenerovať časovú pečiatku
          </button>
        </form>
      ) : (
        <CVDisplay data={userData} onEdit={handleEdit} />
      )}
    </div>
  );
}

export default App;
