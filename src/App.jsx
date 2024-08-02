// IMPORT
import { useState } from "react";
const App = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <main>
        <h1>Pianifica il tuo viaggio</h1>
        <button className="btn-meta">Aggiungi meta</button>
        <div className="container-form">
          <form action="">
            <h4 className="global-text">Titolo</h4>
            <input className="global-input" type="text" />

            <h4 className="global-text">data</h4>
            <input className="global-input" type="data" />

            <h4 className="global-text">Luogo</h4>
            <input className="global-input" type="text" />

            <h4 className="global-text">Img</h4>
            <input className="global-input" type="file" />

            <h4 className="global-text">Descrizione</h4>
            <textarea className="global-input" name="" id=""></textarea>
          </form>
        </div>
        <div className="container-cal-map">
          <div className="calendario">Calendario</div>
          <div className="mappa">mappa</div>
        </div>
        <div className="container"></div>
      </main>
    </>
  );
};

export default App;
