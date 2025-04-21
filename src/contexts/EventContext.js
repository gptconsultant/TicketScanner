import React, { createContext, useState, useContext, useEffect } from 'react';
import * as eventService from '../services/eventService';
import * as gateService from '../services/gateService';
import * as asyncStorage from '../utils/asyncStorage';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [gates, setGates] = useState([]);
  const [selectedGate, setSelectedGate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  useEffect(() => {
    if (user) {
      loadEvents();
      // Try to restore the selected event and gate from storage
      restoreSessionData();
    }
  }, [user]);

  const restoreSessionData = async () => {
    try {
      const sessionData = await asyncStorage.getSessionData();
      if (sessionData) {
        if (sessionData.selectedEvent) {
          setSelectedEvent(sessionData.selectedEvent);
          if (sessionData.selectedEvent.id) {
            loadGates(sessionData.selectedEvent.id);
          }
        }
        if (sessionData.selectedGate) {
          setSelectedGate(sessionData.selectedGate);
        }
      }
    } catch (err) {
      console.error("Error restoring session data:", err);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await eventService.getEvents();
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to load events: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadGates = async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      const gatesData = await gateService.getGatesByEvent(eventId);
      setGates(gatesData);
    } catch (err) {
      setError('Failed to load gates: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectEvent = async (event) => {
    setSelectedEvent(event);
    await asyncStorage.storeSessionData({ 
      ...await asyncStorage.getSessionData() || {}, 
      selectedEvent: event 
    });
    
    if (event?.id) {
      await loadGates(event.id);
    }
  };

  const selectGate = async (gate) => {
    setSelectedGate(gate);
    await asyncStorage.storeSessionData({ 
      ...await asyncStorage.getSessionData() || {}, 
      selectedGate: gate 
    });
  };

  const updateGateStatus = async (gateId, isEnabled) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we're online before making the API call
      if (isConnected) {
        await gateService.updateGateStatus(gateId, isEnabled);
      } else {
        // Queue up changes for sync later
        await asyncStorage.queueGateStatusChange(gateId, isEnabled);
      }
      
      // Update local state immediately for better UX
      setGates(gates.map(gate => 
        gate.id === gateId ? { ...gate, isEnabled } : gate
      ));
    } catch (err) {
      setError('Failed to update gate status: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider value={{
      events,
      selectedEvent,
      gates,
      selectedGate,
      loading,
      error,
      loadEvents,
      selectEvent,
      loadGates,
      selectGate,
      updateGateStatus
    }}>
      {children}
    </EventContext.Provider>
  );
};
