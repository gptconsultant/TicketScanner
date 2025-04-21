import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  List, 
  Divider, 
  Chip, 
  Text,
  IconButton,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useScan from '../../hooks/useScan';
import useEvent from '../../hooks/useEvent';

const TicketDetailsScreen = ({ route, navigation }) => {
  const { ticket, scanResult } = route.params;
  const { selectedEvent, selectedGate } = useEvent();
  const { resetScan } = useScan();

  if (!ticket) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={64} color="#e74c3c" />
        <Title style={styles.errorTitle}>No Ticket Data</Title>
        <Paragraph style={styles.errorText}>
          The ticket information is unavailable.
        </Paragraph>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatValidityStatus = () => {
    if (!scanResult) return null;
    
    if (scanResult.success) {
      return (
        <Chip 
          icon={() => <Feather name="check" size={16} color="white" />}
          style={styles.validChip}
          textStyle={{ color: 'white' }}
        >
          Valid
        </Chip>
      );
    } else {
      return (
        <Chip 
          icon={() => <Feather name="x" size={16} color="white" />}
          style={styles.invalidChip}
          textStyle={{ color: 'white' }}
        >
          Invalid
        </Chip>
      );
    }
  };

  const handleBackToScanner = () => {
    resetScan();
    navigation.navigate('Scanner');
  };
  
  const handleNewScan = () => {
    resetScan();
    navigation.goBack();
  };

  const handleManualOverride = () => {
    Alert.alert(
      'Manual Override',
      'Are you sure you want to manually approve this ticket?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          onPress: () => {
            // Handle manual override logic here
            Alert.alert('Success', 'Ticket has been manually approved.');
            setTimeout(() => {
              handleBackToScanner();
            }, 2000);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View>
              <Title style={styles.title}>Ticket Details</Title>
              <Paragraph style={styles.scanTime}>
                Scanned: {formatDateTime(new Date().toISOString())}
              </Paragraph>
            </View>
            {formatValidityStatus()}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.ticketContainer}>
            <Feather name="ticket" size={24} color="#2c3e50" />
            <View style={styles.ticketInfo}>
              <Title style={styles.ticketId}>#{ticket.id}</Title>
              <Paragraph style={styles.ticketType}>
                {ticket.type || 'General Admission'}
              </Paragraph>
            </View>
          </View>

          <List.Section>
            <List.Subheader style={styles.sectionHeader}>Ticket Information</List.Subheader>
            <List.Item
              title="Event"
              description={selectedEvent?.name || 'Unknown Event'}
              left={() => <List.Icon icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Gate"
              description={selectedGate?.name || 'Unknown Gate'}
              left={() => <List.Icon icon="map-marker" />}
            />
            <Divider />
            <List.Item
              title="Ticket Type"
              description={ticket.type || 'General Admission'}
              left={() => <List.Icon icon="ticket" />}
            />
            <Divider />
            <List.Item
              title="Purchase Date"
              description={formatDateTime(ticket.purchaseDate)}
              left={() => <List.Icon icon="shopping" />}
            />
            <Divider />
            <List.Item
              title="Price"
              description={ticket.price ? `$${ticket.price.toFixed(2)}` : 'N/A'}
              left={() => <List.Icon icon="cash" />}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.sectionHeader}>Attendee Information</List.Subheader>
            <List.Item
              title="Name"
              description={ticket.attendeeName || 'Not provided'}
              left={() => <List.Icon icon="account" />}
            />
            <Divider />
            <List.Item
              title="Email"
              description={ticket.attendeeEmail || 'Not provided'}
              left={() => <List.Icon icon="email" />}
            />
          </List.Section>

          {scanResult && !scanResult.success && (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Title style={styles.errorCardTitle}>Invalid Ticket</Title>
                <Paragraph style={styles.errorCardText}>
                  {scanResult.error || 'Unknown error occurred during validation.'}
                </Paragraph>
                
                {scanResult.isOffline && (
                  <Chip 
                    icon="cloud-off-outline" 
                    style={styles.offlineChip}
                  >
                    Offline Validation
                  </Chip>
                )}
                
                <Button 
                  mode="contained" 
                  onPress={handleManualOverride}
                  style={styles.overrideButton}
                >
                  Manual Override
                </Button>
              </Card.Content>
            </Card>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleBackToScanner}
          style={styles.button}
          icon="camera"
        >
          Back to Scanner
        </Button>
        <Button 
          mode="outlined" 
          onPress={handleNewScan}
          style={styles.button}
          icon="refresh"
        >
          New Scan
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: '#2c3e50',
  },
  scanTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  divider: {
    marginVertical: 16,
  },
  ticketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  ticketInfo: {
    marginLeft: 12,
  },
  ticketId: {
    fontSize: 18,
    marginBottom: 2,
  },
  ticketType: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  sectionHeader: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  validChip: {
    backgroundColor: '#2ecc71',
  },
  invalidChip: {
    backgroundColor: '#e74c3c',
  },
  offlineChip: {
    backgroundColor: '#f39c12',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  errorCard: {
    marginTop: 16,
    backgroundColor: '#ffefef',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  errorCardTitle: {
    color: '#e74c3c',
  },
  errorCardText: {
    color: '#c0392b',
  },
  overrideButton: {
    marginTop: 16,
    backgroundColor: '#e67e22',
  },
  buttonContainer: {
    margin: 16,
    marginTop: 0,
  },
  button: {
    marginBottom: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
  },
  errorText: {
    marginVertical: 8,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#2c3e50',
  },
});

export default TicketDetailsScreen;
