import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  List,
  Divider,
  Portal,
  Dialog
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const ScanResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { result, ticketInfo, eventId, gateName } = route.params;
  const [showRulesDialog, setShowRulesDialog] = useState(false);

  const getStatusColor = () => {
    if (result.isValid) {
      return '#4CAF50'; // Green for valid
    } else if (result.errorType === 'warning') {
      return '#FF9800'; // Orange for warning
    } else {
      return '#F44336'; // Red for error
    }
  };

  const getStatusIcon = () => {
    if (result.isValid) {
      return 'check-circle';
    } else if (result.errorType === 'warning') {
      return 'alert-circle';
    } else {
      return 'x-circle';
    }
  };

  const getStatusText = () => {
    if (result.isValid) {
      return 'Valid Ticket';
    } else {
      return result.message || 'Invalid Ticket';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
          <Feather name={getStatusIcon()} size={60} color="#FFFFFF" />
        </View>
        
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        
        {!result.isValid && result.details && (
          <Text style={styles.errorDetails}>
            {result.details}
          </Text>
        )}
      </View>
      
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Ticket Information</Title>
          <Divider style={styles.divider} />
          
          <List.Item 
            title="Ticket ID"
            description={ticketInfo.id}
            left={props => <List.Icon {...props} icon="ticket" />}
          />
          
          <List.Item 
            title="Ticket Type"
            description={ticketInfo.type || 'Standard'}
            left={props => <List.Icon {...props} icon="ticket-confirmation" />}
          />
          
          <List.Item 
            title="Attendee"
            description={ticketInfo.attendeeName || 'Not specified'}
            left={props => <List.Icon {...props} icon="account" />}
          />
          
          {ticketInfo.email && (
            <List.Item 
              title="Email"
              description={ticketInfo.email}
              left={props => <List.Icon {...props} icon="email" />}
            />
          )}
          
          <List.Item 
            title="Scanned at Gate"
            description={gateName}
            left={props => <List.Icon {...props} icon="map-marker" />}
          />
          
          <List.Item 
            title="Scan Time"
            description={new Date().toLocaleString()}
            left={props => <List.Icon {...props} icon="clock" />}
          />
        </Card.Content>
      </Card>
      
      {result.appliedRules && result.appliedRules.length > 0 && (
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.rulesHeader}>
              <Title>Validation Rules</Title>
              <Button 
                mode="text" 
                onPress={() => setShowRulesDialog(true)}
                compact
              >
                Details
              </Button>
            </View>
            <Divider style={styles.divider} />
            <Paragraph>
              {result.appliedRules.length} rules were checked during validation.
            </Paragraph>
          </Card.Content>
        </Card>
      )}
      
      <View style={styles.actionButtons}>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
          icon="camera"
        >
          Scan Another
        </Button>
      </View>
      
      <Portal>
        <Dialog
          visible={showRulesDialog}
          onDismiss={() => setShowRulesDialog(false)}
        >
          <Dialog.Title>Applied Validation Rules</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.rulesContainer}>
              {result.appliedRules && result.appliedRules.map((rule, index) => (
                <View key={`rule-${index}`} style={styles.ruleItem}>
                  <View style={styles.ruleHeader}>
                    <Text style={styles.ruleName}>{rule.name}</Text>
                    <Feather 
                      name={rule.passed ? "check" : "x"} 
                      size={20} 
                      color={rule.passed ? "#4CAF50" : "#F44336"} 
                    />
                  </View>
                  <Text style={styles.ruleDescription}>{rule.description}</Text>
                  {!rule.passed && rule.failReason && (
                    <Text style={styles.failReason}>Reason: {rule.failReason}</Text>
                  )}
                  {index < result.appliedRules.length - 1 && <Divider style={styles.ruleDivider} />}
                </View>
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRulesDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 24,
  },
  statusIndicator: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDetails: {
    textAlign: 'center',
    color: '#666',
    marginHorizontal: 24,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  actionButtons: {
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    paddingVertical: 8,
    backgroundColor: '#1E88E5',
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rulesContainer: {
    maxHeight: 300,
  },
  ruleItem: {
    marginBottom: 12,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ruleDescription: {
    marginTop: 4,
    color: '#666',
  },
  failReason: {
    marginTop: 4,
    color: '#F44336',
    fontStyle: 'italic',
  },
  ruleDivider: {
    marginTop: 12,
  },
});

export default ScanResultScreen;
