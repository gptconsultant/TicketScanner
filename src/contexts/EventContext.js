import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eventService from '../services/eventService';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);
  const [gates, setGates] = useState([]);
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load selected event from storage on mount
  useEffect(() => {
    const loadSelectedEvent = async () => {
      try {
        const eventJson = await AsyncStorage.getItem('selectedEvent');
        const gateJson = await AsyncStorage.getItem('selectedGate');
        
        if (eventJson) {
          setSelectedEvent(JSON.parse(eventJson));
        }
        
        if (gateJson) {
          setSelectedGate(JSON.parse(gateJson));
        }
      } catch (e) {
        console.error('Failed to load event/gate from storage:', e);
      }
    };

    loadSelectedEvent();
  }, []);

  // Fetch events from API or use mock data
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const eventsData = await eventService.fetchEvents();
      setEvents(eventsData);
      return eventsData;
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch gates for selected event
  const fetchGates = async (eventId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const gatesData = await eventService.fetchGates(eventId);
      setGates(gatesData);
      return gatesData;
    } catch (err) {
      setError('Failed to fetch gates');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rules for selected event
  const fetchRules = async (eventId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rulesData = await eventService.fetchEventRules(eventId);
      setRules(rulesData);
      return rulesData;
    } catch (err) {
      setError('Failed to fetch rules');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Select an event and save to storage
  const selectEvent = async (event) => {
    setSelectedEvent(event);
    setSelectedGate(null); // Reset gate when event changes
    
    try {
      await AsyncStorage.setItem('selectedEvent', JSON.stringify(event));
      await AsyncStorage.removeItem('selectedGate');
      
      // Fetch gates for this event
      if (event) {
        await fetchGates(event.id);
        await fetchRules(event.id);
      }
    } catch (e) {
      console.error('Failed to save selected event to storage:', e);
    }
  };

  // Select a gate and save to storage
  const selectGate = async (gate) => {
    setSelectedGate(gate);
    
    try {
      await AsyncStorage.setItem('selectedGate', JSON.stringify(gate));
    } catch (e) {
      console.error('Failed to save selected gate to storage:', e);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEvent,
        selectedGate,
        gates,
        rules,
        isLoading,
        error,
        fetchEvents,
        fetchGates,
        fetchRules,
        selectEvent,
        selectGate,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};