import { useEffect, useState } from 'react';
import { Offcanvas, Accordion } from 'react-bootstrap';
import { MdDelete, MdEdit } from "react-icons/md";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TomTomMap from './Map';

function App() {
  // Stato per gestire la visibilità del componente Offcanvas
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  
  // Funzione per chiudere l'Offcanvas e resettare i dati del form
  const handleCloseOffCanvas = () => {
    setShowOffCanvas(false);
    setFormData({
      titolo: '',
      luogo: '',
      data: '',
      descrizione: '',
      isChecked: false,
    });
    setFormErrors({ titolo: '', data: '' });
    setImmagine(null);
    setRemoveImage(false);
    setIsEditing(false);
  };

  // Funzione per mostrare l'Offcanvas
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  // Stato per memorizzare i dati del form
  const [formData, setFormData] = useState({
    titolo: '',
    luogo: '',
    data: '',
    descrizione: '',
    isChecked: false,
  });
  
  // Stato per gestire l'immagine caricata
  const [immagine, setImmagine] = useState(null);

  // Stato per memorizzare gli errori di validazione del form
  const [formErrors, setFormErrors] = useState({ titolo: '', data: '' });

  // Stato per gestire gli elementi salvati localmente
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : {};
  });

  // Stato per gestire la modalità di modifica
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  // Stato per gestire l'eliminazione di un'immagine
  const [removeImage, setRemoveImage] = useState(false);

  // Stato per la data selezionata dal calendario
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Stato per filtrare gli elementi in base alla data selezionata
  const [filteredItems, setFilteredItems] = useState([]);

  // Stato per memorizzare l'indirizzo selezionato
  const [address, setAddress] = useState(null);

  // Effetto per salvare gli elementi nel localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  // Effetto per impostare la data corrente come data selezionata all'inizio
  useEffect(() => {
    const today = new Date();
    onDateChange(today);
  }, []);

  // Effetto per aggiornare gli elementi filtrati quando gli elementi o la data selezionata cambiano
  useEffect(() => {
    setFilteredItems(items[selectedDate] || []);
  }, [items, selectedDate]);

  // Gestore del cambiamento dei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funzione per convertire un file in base64 (immagine)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Gestore del cambiamento del file immagine
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Image = await convertToBase64(file);
      setImmagine(base64Image);
    } catch (error) {
      console.error("Errore nella conversione dell'immagine", error);
    }
  };

  // Funzione per validare il form
  const validateForm = () => {
    let valid = true;
    const newErrors = { titolo: '', data: '' };
  
    if (!formData.titolo) {
      newErrors.titolo = 'Il titolo è obbligatorio';
      valid = false;
    }
  
    if (!formData.data) {
      newErrors.data = 'La data è obbligatoria';
      valid = false;
    }
  
    setFormErrors(newErrors);
    return valid;
  };
  
  // Funzione per rendere la sezione dell'immagine in base allo stato
  const renderImageSection = () => {
    switch (true) {
      case immagine && isEditing:
        return (
          <div className='form-remove-img'>
            <input className='w-100' type="file" name='immagine' onChange={handleFileChange} />
            <div className='d-flex my-2'>
              <img src={immagine} alt="Immagine caricata" className="w-50 me-2" />
              <label>
                <input className='me-1' type="checkbox" checked={removeImage} onChange={() => setRemoveImage(!removeImage)} />
                Elimina immagine caricata
              </label>
            </div>
          </div>
        );
  
      case immagine && !removeImage:
        return (
          <div className='form-remove-img'>
            <label>
              <input className='me-1' type="checkbox" checked={removeImage} onChange={handleRemoveImageChange} />
              Annulla caricamento
            </label>
          </div>
        );
  
      default:
        return (
          <input className='w-100' type="file" name='immagine' onChange={handleFileChange} />
        );
    }
  };

  // Gestore del cambiamento dello stato per rimuovere un'immagine
  const handleRemoveImageChange = () => {
    setRemoveImage(!removeImage);
    if (!removeImage) {
      setImmagine(null);
    }
    setRemoveImage(false);
  };

  // Gestore della sottomissione del form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Interrompe la sottomissione se il modulo non è valido
    }

    const newItem = { ...formData, immagine: removeImage ? null : immagine };
    const dateKey = formData.data;

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      if (isEditing) {
        updatedItems[dateKey][currentEditIndex] = newItem;
        setIsEditing(false);
        setCurrentEditIndex(null);
      } else {
        if (!updatedItems[dateKey]) {
          updatedItems[dateKey] = [];
        }
        updatedItems[dateKey] = [...updatedItems[dateKey], newItem];
      }

      return updatedItems;
    });

    handleCloseOffCanvas();
  };

  // Gestore per eliminare un elemento dall'elenco
  const handleDelete = (indexD) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[selectedDate].splice(indexD, 1);

      if (updatedItems[selectedDate].length === 0) {
        delete updatedItems[selectedDate];
      }

      return updatedItems;
    });
  };

  // Gestore per modificare un elemento esistente
  const handleEdit = (indexE) => {
    const itemToEdit = filteredItems[indexE];
    handleShowOffCanvas();

    setFormData({
      titolo: itemToEdit.titolo,
      luogo: itemToEdit.luogo,
      data: itemToEdit.data,
      descrizione: itemToEdit.descrizione,
      isChecked: itemToEdit.isChecked,
    });

    setImmagine(itemToEdit.immagine);
    setIsEditing(true);
    setCurrentEditIndex(indexE);
  };

  // Gestore per cambiare lo stato della checkbox di un elemento
  const handleCheckboxChange = (index) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[selectedDate][index].isChecked = !updatedItems[selectedDate][index].isChecked;
      return updatedItems;
    });
  };

  // Gestore per cambiare la data selezionata e aggiornare gli elementi filtrati
  const onDateChange = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
    setFilteredItems(items[formattedDate] || []);
  };

  // Gestore per aggiornare l'indirizzo quando un item nell'accordion viene cliccato
  const handleAccordionClick = (index) => {
    const address = filteredItems[index]?.luogo;
    if (address) {
      setAddress(address);
    }
  };

  console.log(items);
  console.log(filteredItems);

  return (
    <>
      <main className='container py-4 global-text'>
        <div className='pb-4 pb-md-5 text-center d-md-flex justify-content-between align-items-center'>
          <h1 className='fw-semibold pb-1 pb-md-0'>Pianifica il tuo viaggio</h1>
          <div>
            <button onClick={handleShowOffCanvas} className='btn-default btn-meta'>
              Aggiungi meta
            </button>
          </div>

          <Offcanvas className="offcanvas-container" show={showOffCanvas} onHide={handleCloseOffCanvas} placement='end'>
            <Offcanvas.Header className='offcanvas-header p-0' closeButton>
              <h3 className='p-0 m-0'>{isEditing ? 'Modifica' : 'Aggiungi meta'}</h3>
            </Offcanvas.Header>
            <Offcanvas.Body className='p-0'>
              <div className="form-container global-input-title  global-input">
                <form onSubmit={handleSubmit}>
                  <h5>Titolo</h5>
                  <input className='w-100' type="text" name='titolo' value={formData.titolo} onChange={handleChange} placeholder='Colosseo'/>
                  {formErrors.titolo && <p className="text-danger">{formErrors.titolo}</p>}

                  <h5>Luogo</h5>
                  <input className='w-100' type="text" name='luogo' value={formData.luogo} onChange={handleChange} placeholder='Piazza del Colosseo, Roma, Italia'/>

                  <h5>Data</h5>
                  <input type="date" name='data' value={formData.data} onChange={handleChange} />
                  {formErrors.data && <p className="text-danger">{formErrors.data}</p>}

                  <h5>Immagine</h5>
                  {renderImageSection()}
                  
                  <h5>Descrizione</h5>
                  <textarea rows={4} className="w-100 d-block" name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder='Visita al colosseo'></textarea>

                  <button type='submit' className='btn-default btn-form' >{isEditing ? 'Conferma' : 'Aggiungi'}</button>
                </form>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>

        <div className="cal-map-container m-0 mb-4 mb-md-5 row g-4">
          <div className="col-12 col-md-6 col-lg-4 m-0 p-0 pe-md-1">
            <div className="Calendar h-100">
              <Calendar onChange={onDateChange} value={selectedDate} />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-8 m-0 mt-3 m-md-0 p-0 ps-md-1">
            <div className="Map">
              <TomTomMap address={address} />
            </div>
          </div>
        </div>
        <div>
          {filteredItems.length > 0 ? (
            <Accordion className='pb-4'>
              {filteredItems.map((item, index) => (
                <Accordion.Item eventKey={index} key={index} className='accordion-item'>
                  <Accordion.Header
                    className='custon-accordion-header'
                    onClick={() => handleAccordionClick(index)}
                  >
                    <label className="accordion-checkbox-container">
                      <input
                        className='accordion-checkbox'
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <span className="custom-checkbox"></span>
                    </label>
                    <h5 className='mb-0'>{item.titolo}</h5>
                  </Accordion.Header>
                  <Accordion.Body className='d-flex'>
                    <div className="img-travel-container me-2 me-md-3">
                      <img src={item.immagine} alt={item.titolo} />
                    </div>
                    <div className='d-flex descr-btn-containter'>
                      <div className='Description flex-grow-1 me-2'>
                        <p className="mb-auto">{item.descrizione}</p>
                      </div>
                      <div className='d-flex flex-column'>
                        <button onClick={() => handleEdit(index)} className="mb-auto acc-default-btn edit-btn"><MdEdit /></button>
                        <button onClick={() => handleDelete(index)} className="acc-default-btn delete-btn"><MdDelete /></button>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <h5 className='no-meta-message'>Non hai mete per questa data.</h5>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
