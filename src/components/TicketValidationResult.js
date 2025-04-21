import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const TicketValidationResult = ({ 
  result, 
  onViewDetails, 
  onRescan,
  showOverrideButton = true
}) => {
  if (!result) return null;

  const { success, error, ticket, message, isOffline } = result;

  return (
    <Card style={styles.container}>
      <View style={styles.resultHeader}>
        {success ? (
          <Feather name="check-circle" size={60} color="#2ecc71" />
        ) : (
          <Feather name="x-circle" size={60} color="#e74c3c" />
        )}
        
        <Title style={[
          styles.resultTitle,
          success ? styles.successTitle : styles.errorTitle
        ]}>
          {success ? 'Valid Ticket' : 'Invalid Ticket'}
        </Title>
      </View>

      {isOffline && (
        <Chip 
          icon={() => <Feather name="wifi-off" size={16} color="white" />}
          style={styles.offlineChip}
          textStyle={{ color: 'white' }}
        >
          Offline Mode
        </Chip>
      )}

      <Card.Content style={styles.content}>
        {success ? (
          <Paragraph style={styles.successMessage}>
            {message || 'Ticket successfully validated'}
          </Paragraph>
        ) : (
          <Paragraph style={styles.errorMessage}>
            {error || 'Failed to validate ticket'}
          </Paragraph>
        )}

        {ticket && (
          <View style={styles.ticketPreview}>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Ticket ID:</Text>
              <Text style={styles.ticketValue}>{ticket.id}</Text>
            </View>
            
            {ticket.type && (
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Type:</Text>
                <Text style={styles.ticketValue}>{ticket.type}</Text>
              </View>
            )}
            
            {ticket.attendeeName && (
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Attendee:</Text>
                <Text style={styles.ticketValue}>{ticket.attendeeName}</Text>
              </View>
            )}
          </View>
        )}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={onViewDetails}
          style={[styles.button, styles.viewButton]}
          icon="ticket"
          disabled={!ticket}
        >
          View Details
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={onRescan}
          style={[styles.button, styles.rescanButton]}
          icon="camera"
        >
          New Scan
        </Button>
      </Card.Actions>

      {!success && showOverrideButton && (
        <Card.Actions style={styles.overrideContainer}>
          <Button 
            mode="text" 
            onPress={() => {
              // This would be handled by the parent component
              if (onViewDetails) {
                onViewDetails();
              }
            }}
            style={styles.overrideButton}
            labelStyle={styles.overrideButtonLabel}
          >
            Manual Override
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 4,
  },
  resultHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  resultTitle: {
    fontSize: 24,
    marginTop: 10,
  },
  successTitle: {
    color: '#2ecc71',
  },
  errorTitle: {
    color: '#e74c3c',
  },
  content: {
    paddingTop: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketPreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  ticketRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ticketLabel: {
    flex: 1,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  ticketValue: {
    flex: 2,
    color: '#2c3e50',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#2c3e50',
  },
  rescanButton: {
    borderColor: '#2c3e50',
  },
  overrideContainer: {
    justifyContent: 'center',
    paddingBottom: 16,
  },
  overrideButton: {
    marginTop: -5,
  },
  overrideButtonLabel: {
    color: '#e67e22',
    fontSize: 14,
  },
  offlineChip: {
    backgroundColor: '#f39c12',
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default TicketValidationResult;
