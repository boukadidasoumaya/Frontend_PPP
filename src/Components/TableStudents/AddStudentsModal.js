import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Input, FormGroup } from 'reactstrap';
import { FormLabel } from 'react-bootstrap';

import { useEffect} from 'react';
import axios from 'axios';
const AddStudentModal = ({ modalOpen, toggleModal,setModalOpen }) => {
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [groups, setGroups] = useState([]);
  
const initialErrors = {
  firstName: "",
  lastName: "",
  cin: "",
  email: "",
  birthday: "", 
  major: "",
  year: "", 
  group: "", 
};
const [errors, setErrors] = useState(initialErrors);
const [students, setStudents] = useState([]);
const clearErrors = () => {
  setErrors(initialErrors);
};
  const handleStudent = (action) => {
    // setErrors(initialErrors);
  
    // Récupération des valeurs des champs
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const cin = document.getElementById('cin').value;
    const email = document.getElementById('email').value;
    let birthday =document.getElementById('birthday').value; 
    const major = document.getElementById('major').value;
    const year = parseInt(document.getElementById('year').value); // Convertir niveau en entier
    const group = parseInt(document.getElementById('group').value); // Convertir groupe en entier
  
   // Vérification si le CIN est vide ou ne contient pas exactement 8 chiffres
  const cinError = !cin ? "CIN is required" : (cin.length !== 8 ? "CIN must be 8 digits long" : "");
  // Vérification si le CIN contient uniquement des chiffres
  const cinFormatError = !/^\d+$/.test(cin) ? "CIN must contain only digits" : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Vérification si le prénom contient uniquement des lettres et des espaces
  const firstNameFormatError = !/^[a-zA-Z\s]+$/.test(firstName) ? "First name must contain only letters " : "";
  
  // Vérification si le nom de famille contient uniquement des lettres et des espaces
  const lastNameFormatError = !/^[a-zA-Z\s]+$/.test(lastName) ? "Last name must contain only letters" : "";
  
  
  
  // Combinaison des erreurs
  const newErrors = {
    firstName: !firstName ? "First name is required" : firstNameFormatError,
    lastName: !lastName ? "Last name is required" : lastNameFormatError,
    cin: cinError || cinFormatError,
    email: !email ? "Email is required" : !emailRegex.test(email) ? "Invalid Email format" : "",
    birthday: !birthday ? "Birthday is required" : "", 
    major: !major ? "Major is required" : "",
    year: !year ? "Year is required" : "", 
    group: !group ? "Group is required" : "", 
  };
  
    // Mise à jour de l'état des erreurs
    console.log(newErrors)
    console.log("after new errrors firstname",firstName);
    setErrors(newErrors);
    console.log(errors)
  
    // Vérification si des erreurs existent
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    
    if (action === "add") {  
        const newStudent = {
          FirstName: firstName,
          LastName: lastName,
          CIN: cin,
          Email: email,
          Birthday: birthday,
          Major: major,
          Year: year,
          Group: group
        };
        
        // Send new student data to server
      
          axios.post("http://localhost:5000/students", newStudent)
            .then(response => {
             console.log('Student added:', response.data);
             console.log('newStudent:', newStudent);
             setStudents([...students, newStudent]); // Add new student to original data
              
              setModalOpen(false);
            })
            .catch(error => {
              const backendErrors = error.response.data.errors;
              console.log("backend",error.response.data)
                setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
                console.log("backend errors",backendErrors); 
                if (backendErrors&& backendErrors.cin) {
                  setErrors(prevErrors => ({ ...prevErrors, cin: "CIN already exists" }));
                }
                if(backendErrors && backendErrors.email){
                  setErrors(prevErrors => ({ ...prevErrors, email: "Email already exists" }));
  
                }
                console.log("errors",errors);// Close modal after adding
            });
        
      }
     
      
    
  };
  
  
  const handleMajorChange = (newMajor) => {
    setSelectedMajor(newMajor);

    // Déterminer les options disponibles pour l'année en fonction du Major sélectionné
    if (newMajor === 'MPI' || newMajor === 'CBA') {
      setSelectedYear('1');
      setGroups(['1', '2', '3', '4']);
    } else if (newMajor === 'MASTER' || newMajor === 'DOCTORAT') {
      setSelectedYear('');
      setGroups(['1']);
    } else {
      setSelectedYear('2');
      setGroups(['1', '2', '3']);
    }
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);

    // Déterminer le nombre de groupes disponibles en fonction de l'année sélectionnée
    if (parseInt(newYear) >= 3) {
      setGroups(['1', '2']);
    } else {
      setGroups(['1', '2', '3']);
    }
  };

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Add Student</ModalHeader>
      <ModalBody>
        <FormGroup>
          <FormLabel for="major">Major</FormLabel>
          <select
            className="form-control shadow-none border-1 bg-transparent text-dark"
            name="major"
            id="major"
            value={selectedMajor}
            onChange={(e) => handleMajorChange(e.target.value)}
          >
            <option value="">Select Major</option>
            <option value="MPI">MPI</option>
            <option value="CBA">CBA</option>
            <option value="RT">RT</option>
            {/* Ajoutez les autres majors ici */}
          </select>
        </FormGroup>

        {selectedMajor && (
          <FormGroup>
            <FormLabel for="year">Year</FormLabel>
            <select
              className="form-control shadow-none border-1 bg-transparent text-dark"
              name="year"
              id="year"
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">Select Year</option>
              {selectedMajor === 'MASTER' || selectedMajor === 'DOCTORAT' ? (
                <option value="1">1</option>
              ) : (
                <>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </>
              )}
            </select>
          </FormGroup>
        )}

        {selectedYear && (
          <FormGroup>
            <FormLabel for="group">Group</FormLabel>
            <select
              className="form-control shadow-none border-1 bg-transparent text-dark"
              name="group"
              id="group"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </FormGroup>
        )}
      </ModalBody>
      <div className="modal-footer">
        <Button className="addbtn" onClick={() => handleStudent('add')}>
          Add Student
        </Button>
        <Button color="link text-muted" onClick={toggleModal}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
