// Importazione dei componenti e hook necessari
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const App = () => {
  // Stato per controllare la visibilità dell'Offcanvas
  const [showOffCanvas, setShowOffCanvas] = useState(false);

  // Funzioni per gestire l'apertura e la chiusura dell'Offcanvas
  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  return (
    <>
      <main className="container-big">
        {/* Sezione del titolo e del pulsante per aggiungere una meta */}
        <div className="container-tit-btn">
          <h1 className="titolo">Pianifica il tuo viaggio</h1>
          <Button className="btn-meta" onClick={handleShowOffCanvas}>
            Aggiungi Meta
          </Button>
        </div>

        {/* Componente Offcanvas per aggiungere una nuova meta */}
        <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Aggiungi Meta</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="container-form">
              {/* Form per inserire i dettagli della nuova meta */}
              <form action="">
                <h4 className="global-text">Titolo</h4>
                <input className="global-input" type="text" />

                <h4 className="global-text">Data</h4>
                <input className="global-input" type="date" />

                <h4 className="global-text">Luogo</h4>
                <input className="global-input" type="text" />

                <h4 className="global-text">Img</h4>
                <input className="global-input" type="file" />

                <h4 className="global-text">Descrizione</h4>
                <textarea className="global-input" name="" id=""></textarea>
              </form>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Contenitore per il calendario e la mappa */}
        <div className="container-cal-map">
          <div className="calendario">Calendario</div>
          <div className="mappa">Mappa</div>
        </div>

        {/* Contenitore per la visualizzazione dei dettagli della meta */}
        <div className="container">
          <div className="container-img">
            <img src="" alt="img" />
          </div>
          <div className="container-tit-desc">
            <h4>Titolo</h4>
            <p>Descrizione</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;