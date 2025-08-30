import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, subDays, isSameMonth, isSameDay, getDay } from 'date-fns';

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  events: { date: Date }[];
}

const CalendarCard: React.FC<Props> = ({ selectedDate, onDateChange, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date(); // Current date (August 30, 2025)

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const firstDayOfMonth = getDay(monthStart);
  const calendarStart = subDays(monthStart, firstDayOfMonth);

  const calendarDays: Date[] = [];
  let tempDay = calendarStart;
  for (let i = 0; i < 42; i++) { // 6 weeks x 7 days
    calendarDays.push(tempDay);
    tempDay = addDays(tempDay, 1);
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const renderDay = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(event.date, day));
    const isSelected = isSameDay(day, selectedDate);
    const isToday = isSameDay(day, today);
    const isCurrentMonth = isSameMonth(day, currentDate);

    return (
      <TouchableOpacity
        key={day.toString()}
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDay,
          isToday && styles.todayDay, // Apply purple background for today
        ]}
        onPress={() => {
          onDateChange(day);
          if (!isCurrentMonth) {
            setCurrentDate(day);
          }
        }}
      >
        <Text style={[styles.dayText, !isCurrentMonth && styles.otherMonthText, isSelected && styles.selectedDayText]}>
          {format(day, 'd')}
        </Text>
        {dayEvents.length > 0 && <View style={styles.eventDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradientBg}>
      <View style={styles.calendarCard}>
        {/* Header */}
        <View style={styles.calendarHeaderRow}>
          <TouchableOpacity onPress={prevMonth}>
            <Text style={styles.calendarChevron}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.calendarHeaderText}>
            {format(currentDate, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={nextMonth}>
            <Text style={styles.calendarChevron}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Days of Week */}
        <View style={styles.weekDaysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map(day => renderDay(day))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarHeaderText: { fontSize: 18, fontWeight: '600', color: '#333' },
  calendarChevron: { fontSize: 24, color: '#6B46C1', paddingHorizontal: 10 },
  weekDaysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekDayText: { width: 40, textAlign: 'center', fontSize: 12, color: '#666' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dayContainer: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginVertical: 4 },
  selectedDay: { backgroundColor: '#6B46C1' },
  todayDay: { backgroundColor: '#6B46C1', opacity: 0.7 }, // Purple background for today, slightly transparent to differentiate from selected
  dayText: { fontSize: 16, color: '#333', fontWeight: '500' },
  otherMonthText: { color: '#bbb' },
  selectedDayText: { color: '#fff' }, // White text for selected day for contrast
  eventDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f96c3d', marginTop: 2 },
});

export default CalendarCard;