import React, { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import * as ttServices from '@tomtom-international/web-sdk-services';

// Componente TomTomMap che visualizza una mappa e la centra su un indirizzo dato
const TomTomMap = ({ address }) => {
  // Crea un ref per contenere l'elemento DOM dove verrà renderizzata la mappa
  const mapElement = useRef(null);

  useEffect(() => {
    // Inizializza la mappa TomTom
    const map = tt.map({
      key: import.meta.env.VITE_TOMTOM_API_KEY, // Chiave API dalle variabili d'ambiente
      container: mapElement.current, // Elemento DOM per renderizzare la mappa
      center: [12.4964, 41.9028], // Coordinate iniziali (Roma)
      zoom: 3, // Livello di zoom iniziale
    });

    // Funzione per ottenere le coordinate di un indirizzo dato
    const fetchCoordinates = async () => {
      try {
        // Usa il servizio di geocodifica di TomTom per ottenere le coordinate dell'indirizzo
        const response = await ttServices.services.geocode({
          key: import.meta.env.VITE_TOMTOM_API_KEY,
          query: address,
        });

        console.log('Risposta di geocodifica:', response);
        const result = response.results[0];
        if (result && result.position) {
          const { lng, lat } = result.position;
          if (!isNaN(lng) && !isNaN(lat)) {
            // Centra la mappa sulle coordinate ottenute
            map.setCenter([lng, lat]);
            map.setZoom(15);
            // Decommentare la linea seguente per aggiungere un marker sulla posizione
            // new tt.Marker().setLngLat([lng, lat]).addTo(map);
          } else {
            console.error('Coordinate non valide:', lng, lat);
          }
        } else {
          console.error('Nessun risultato valido trovato per l\'indirizzo dato.');
        }
      } catch (error) {
        console.error('Errore durante la geocodifica:', error);
      }
    };

    // Esegui la geocodifica solo se l'indirizzo è fornito
    if(address != null){
        fetchCoordinates();
    }
    
    // Funzione di pulizia: rimuove la mappa quando il componente viene smontato
    return () => {
      map.remove();
    };
  }, [address]); // Esegui l'effetto quando l'indirizzo cambia

  // Renderizza il contenitore della mappa
  return <div ref={mapElement} style={{ height: '100%', width: '100%' }} />;
};

export default TomTomMap;