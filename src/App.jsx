// IMPORT
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const App = () => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  return (
    <>
      <main className="container-big">
        <div className="container-tit-btn">
          <h1 className="titolo">Pianifica il tuo viaggio</h1>
          <Button className="btn-meta" onClick={handleShowOffCanvas}>
            Aggiungi Meta
          </Button>
        </div>
        <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Aggiungi Meta</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="container-form">
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
        <div className="container-cal-map">
          <div className="calendario">Calendario</div>
          <div className="mappa">Mappa</div>
        </div>
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
