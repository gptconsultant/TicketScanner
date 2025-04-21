import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { 
  List, 
  Switch, 
  FAB, 
  Dialog, 
  Portal, 
  Button, 
  TextInput, 
  Title, 
  Paragraph,
  Divider,
  ActivityIndicator,
  Snackbar,
  RadioButton,
  Text,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

// Conditionally import DateTimePicker based on platform
let DateTimePicker;
if (Platform.OS !== 'web') {
  // On native platforms, use the community DateTimePicker
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} else {
  // On web, create a simple fallback component
  DateTimePicker = ({ value, onChange }) => {
    const handleTimeChange = (e) => {
      const time = e.target.value;
      if (time) {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        onChange({ type: 'set', nativeEvent: { timestamp: date } }, date);
      }
    };
    
    const formattedTime = `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`;
    
    return (
      <input
        type="time"
        value={formattedTime}
        onChange={handleTimeChange}
        style={{ padding: 8, fontSize: 16, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
      />
    );
  };
}

import useEvent from '../../hooks/useEvent';
import { 
  fetchEventRules, 
  createRule, 
  updateRule,
  deleteRule 
} from '../../services/eventService';

const RULE_TYPES = [
  { label: 'Time Restriction', value: 'TIME_RESTRICTION' },
  { label: 'Gate Restriction', value: 'GATE_RESTRICTION' },
  { label: 'Ticket Type Restriction', value: 'TICKET_TYPE_RESTRICTION' },
  { label: 'One-time Use', value: 'ONE_TIME_USE' },
];

const ManageRulesScreen = ({ navigation }) => {
  const { events, selectedEvent, selectEvent } = useEvent();
  
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  // New rule form state
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState(RULE_TYPES[0].value);
  const [ruleValue, setRuleValue] = useState('');
  const [ruleActive, setRuleActive] = useState(true);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load rules for the selected event
  useEffect(() => {
    if (selectedEvent) {
      loadRules();
    }
  }, [selectedEvent]);

  const loadRules = async () => {
    if (!selectedEvent) return;
    
    setLoading(true);
    try {
      const response = await fetchEventRules(selectedEvent.id);
      if (response.success) {
        setRules(response.data);
      } else {
        showSnackbar('Failed to load rules');
      }
    } catch (error) {
      console.error('Error loading rules:', error);
      showSnackbar('Error loading rules');
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (rule) => {
    try {
      const updatedRule = { ...rule, isActive: !rule.isActive };
      const response = await updateRule(selectedEvent.id, updatedRule);
      
      if (response.success) {
        // Update local state
        setRules(rules.map(r => 
          r.id === rule.id ? { ...r, isActive: !r.isActive } : r
        ));
        
        showSnackbar(`Rule ${rule.name} ${!rule.isActive ? 'activated' : 'deactivated'}`);
      } else {
        showSnackbar('Failed to update rule status');
      }
    } catch (error) {
      console.error('Error updating rule status:', error);
      showSnackbar('Error updating rule status');
    }
  };

  const openCreateDialog = () => {
    setEditingRule(null);
    setRuleName('');
    setRuleType(RULE_TYPES[0].value);
    setRuleValue('');
    setRuleActive(true);
    setSelectedTime(new Date());
    setCreateDialogVisible(true);
  };

  const openEditDialog = (rule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleType(rule.type);
    setRuleValue(rule.value);
    setRuleActive(rule.isActive);
    
    // If time restriction, parse the time value
    if (rule.type === 'TIME_RESTRICTION') {
      const [hours, minutes] = rule.value.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      setSelectedTime(time);
    }
    
    setCreateDialogVisible(true);
  };

  const handleSaveRule = async () => {
    if (!ruleName.trim()) {
      showSnackbar('Please enter rule name');
      return;
    }
    
    // Prepare rule value based on rule type
    let finalRuleValue = ruleValue;
    if (ruleType === 'TIME_RESTRICTION') {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      finalRuleValue = `${hours}:${minutes}`;
    }
    
    try {
      let response;
      
      if (editingRule) {
        // Update existing rule
        const updatedRule = {
          ...editingRule,
          name: ruleName.trim(),
          type: ruleType,
          value: finalRuleValue,
          isActive: ruleActive,
        };
        
        response = await updateRule(selectedEvent.id, updatedRule);
      } else {
        // Create new rule
        response = await createRule(
          selectedEvent.id,
          ruleName.trim(),
          ruleType,
          finalRuleValue,
          ruleActive
        );
      }
      
      if (response.success) {
        await loadRules();
        showSnackbar(editingRule ? `Rule updated` : `Rule created`);
        setCreateDialogVisible(false);
      } else {
        showSnackbar(editingRule ? 'Failed to update rule' : 'Failed to create rule');
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      showSnackbar('Error saving rule');
    }
  };

  const handleDeleteRule = (rule) => {
    Alert.alert(
      'Delete Rule',
      `Are you sure you want to delete the rule "${rule.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteRule(selectedEvent.id, rule.id);
              
              if (response.success) {
                setRules(rules.filter(r => r.id !== rule.id));
                showSnackbar(`Rule deleted`);
              } else {
                showSnackbar('Failed to delete rule');
              }
            } catch (error) {
              console.error('Error deleting rule:', error);
              showSnackbar('Error deleting rule');
            }
          } 
        },
      ]
    );
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    setTimePickerVisible(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRuleValueInput = () => {
    switch (ruleType) {
      case 'TIME_RESTRICTION':
        return (
          <View style={styles.timePickerContainer}>
            <Paragraph style={styles.timeLabel}>Entry allowed until:</Paragraph>
            <Button 
              mode="outlined" 
              onPress={() => setTimePickerVisible(true)}
              style={styles.timeButton}
            >
              {formatTime(selectedTime)}
            </Button>
            {timePickerVisible && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        );
      
      case 'GATE_RESTRICTION':
        return (
          <TextInput
            label="Allowed Gate IDs (comma separated)"
            value={ruleValue}
            onChangeText={setRuleValue}
            mode="outlined"
            style={styles.input}
            placeholder="e.g. Gate A, Gate B, VIP"
          />
        );
      
      case 'TICKET_TYPE_RESTRICTION':
        return (
          <TextInput
            label="Allowed Ticket Types (comma separated)"
            value={ruleValue}
            onChangeText={setRuleValue}
            mode="outlined"
            style={styles.input}
            placeholder="e.g. VIP, PREMIUM, GENERAL"
          />
        );
      
      case 'ONE_TIME_USE':
        return (
          <Paragraph style={styles.ruleDescription}>
            This rule enforces that tickets can only be scanned once.
          </Paragraph>
        );
      
      default:
        return (
          <TextInput
            label="Rule Value"
            value={ruleValue}
            onChangeText={setRuleValue}
            mode="outlined"
            style={styles.input}
          />
        );
    }
  };

  if (!selectedEvent) {
    return (
      <View style={styles.placeholderContainer}>
        <Title>No Event Selected</Title>
        <Paragraph>Please select an event first</Paragraph>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Dashboard')}
          style={{ marginTop: 20 }}
        >
          Go to Dashboard
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Managing Rules for:</Title>
        <Paragraph style={styles.eventName}>{selectedEvent.name}</Paragraph>
        <Divider style={styles.divider} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Paragraph>Loading rules...</Paragraph>
        </View>
      ) : rules.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shield" size={48} color="#7f8c8d" />
          <Paragraph style={styles.emptyText}>No rules found for this event.</Paragraph>
          <Paragraph style={styles.emptySubtext}>
            Create rules by pressing the + button below.
          </Paragraph>
        </View>
      ) : (
        <FlatList
          data={rules}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`Type: ${item.type.replace(/_/g, ' ')}`}
              left={(props) => <List.Icon {...props} icon="shield" />}
              right={() => (
                <View style={styles.listItemRight}>
                  <Switch
                    value={item.isActive}
                    onValueChange={() => toggleRuleStatus(item)}
                    color="#2c3e50"
                  />
                  <IconButton
                    icon="pencil"
                    size={24}
                    color="#3498db"
                    onPress={() => openEditDialog(item)}
                  />
                  <IconButton
                    icon="trash-can-outline"
                    size={24}
                    color="#e74c3c"
                    onPress={() => handleDeleteRule(item)}
                  />
                </View>
              )}
              style={[
                styles.listItem,
                !item.isActive && styles.inactiveItem
              ]}
              onPress={() => openEditDialog(item)}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={openCreateDialog}
      />

      <Portal>
        <Dialog
          visible={createDialogVisible}
          onDismiss={() => setCreateDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>{editingRule ? 'Edit Rule' : 'Create New Rule'}</Dialog.Title>
          <Dialog.ScrollArea>
            <View style={styles.dialogContent}>
              <TextInput
                label="Rule Name"
                value={ruleName}
                onChangeText={setRuleName}
                mode="outlined"
                style={styles.input}
              />
              
              <Title style={styles.sectionTitle}>Rule Type</Title>
              <RadioButton.Group onValueChange={value => setRuleType(value)} value={ruleType}>
                {RULE_TYPES.map(type => (
                  <RadioButton.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                    style={styles.radioItem}
                  />
                ))}
              </RadioButton.Group>
              
              <Title style={styles.sectionTitle}>Rule Value</Title>
              {renderRuleValueInput()}
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Rule Active</Text>
                <Switch
                  value={ruleActive}
                  onValueChange={setRuleActive}
                  color="#2c3e50"
                />
              </View>
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setCreateDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveRule}>{editingRule ? 'Update' : 'Create'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

// Add the missing IconButton component
const IconButton = ({ icon, size, color, onPress }) => {
  return (
    <Feather
      name={icon === 'pencil' ? 'edit-2' : icon === 'trash-can-outline' ? 'trash-2' : icon}
      size={size}
      color={color}
      style={{ marginLeft: 12 }}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  divider: {
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: 'white',
  },
  inactiveItem: {
    backgroundColor: '#ecf0f1',
    opacity: 0.7,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2c3e50',
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  radioItem: {
    paddingVertical: 4,
  },
  timePickerContainer: {
    marginBottom: 16,
  },
  timeLabel: {
    marginBottom: 8,
  },
  timeButton: {
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
  },
  ruleDescription: {
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: 16,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ManageRulesScreen;
