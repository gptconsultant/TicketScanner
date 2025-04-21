import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEvents, fetchGates } from '../services/eventService';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [gates, setGates] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from API or localStorage
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetchEvents();
      if (response.success) {
        setEvents(response.data);
        
        // Try to restore selected event from storage
        const storedEventId = await AsyncStorage.getItem('selectedEventId');
        if (storedEventId) {
          const event = response.data.find(e => e.id === parseInt(storedEventId));
          if (event) {
            setSelectedEvent(event);
          }
        }
      } else {
        console.error('Failed to load events:', response.error);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load gates for the selected event
  const loadGates = async (eventId) => {
    setIsLoading(true);
    try {
      const response = await fetchGates(eventId);
      if (response.success) {
        setGates(response.data);
        
        // Try to restore selected gate from storage
        const storedGateId = await AsyncStorage.getItem('selectedGateId');
        if (storedGateId) {
          const gate = response.data.find(g => g.id === parseInt(storedGateId));
          if (gate && gate.isEnabled) {
            setSelectedGate(gate);
          } else {
            // If stored gate is disabled or not found, reset it
            setSelectedGate(null);
            await AsyncStorage.removeItem('selectedGateId');
          }
        }
      } else {
        console.error('Failed to load gates:', response.error);
      }
    } catch (error) {
      console.error('Error loading gates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select an event
  const selectEvent = async (event) => {
    setSelectedEvent(event);
    setSelectedGate(null); // Reset gate when event changes
    
    await AsyncStorage.setItem('selectedEventId', event.id.toString());
    await AsyncStorage.removeItem('selectedGateId');
    
    // Load gates for the selected event
    await loadGates(event.id);
  };

  // Select a gate
  const selectGate = async (gate) => {
    if (!gate.isEnabled) {
      console.error('Cannot select disabled gate');
      return false;
    }
    
    setSelectedGate(gate);
    await AsyncStorage.setItem('selectedGateId', gate.id.toString());
    return true;
  };

  // Initialize by loading events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // When selected event changes, load gates for that event
  useEffect(() => {
    if (selectedEvent) {
      loadGates(selectedEvent.id);
    }
  }, [selectedEvent]);

  return (
    <EventContext.Provider
      value={{
        events,
        gates,
        selectedEvent,
        selectedGate,
        isLoading,
        selectEvent,
        selectGate,
        loadEvents,
        loadGates
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
