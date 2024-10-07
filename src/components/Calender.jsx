import React, { useState } from "react";
import '../Styles/Calender.css'; 

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState({});
  const [eventOptionsVisible, setEventOptionsVisible] = useState(null); 

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setSelectedEvent(null); 
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const { title, description, remark } = e.target.elements;
    const monthYearKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

    setEvents((prevEvents) => {
      const dayEvents = prevEvents[monthYearKey]?.[selectedDate] || [];

      const updatedEvents = selectedEvent
        ? dayEvents.map((event) =>
            event === selectedEvent
              ? { title: title.value, description: description.value, remark: remark.value }
              : event
          )
        : [
            ...dayEvents,
            { title: title.value, description: description.value, remark: remark.value },
          ];

      return {
        ...prevEvents,
        [monthYearKey]: {
          ...prevEvents[monthYearKey],
          [selectedDate]: updatedEvents.sort((a, b) => a.title.localeCompare(b.title)), 
        },
      };
    });

    closeModal();
  };

  const handleDeleteEvent = (day, eventToDelete) => {
    const monthYearKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      setEvents((prevEvents) => {
        const updatedEvents = {
          ...prevEvents,
          [monthYearKey]: {
            ...prevEvents[monthYearKey],
            [day]: prevEvents[monthYearKey][day].filter(event => event !== eventToDelete),
          },
        };

        return updatedEvents;
      });
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedEvent(null); 
    setEventOptionsVisible(null); 
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year) === 0 ? 6 : firstDayOfMonth(month, year) - 1;
    const monthYearKey = `${year}-${month + 1}`;
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const day = i;
      const dayEvents = (events[monthYearKey]?.[day] || []).sort((a, b) => a.title.localeCompare(b.title)); 
      const date = new Date(year, month, day);
      const dayofweek = date.getDay();

      days.push(
        <div
          key={day}
          className={`calendar-day ${dayEvents.length ? 'has-event' : ''} ${dayofweek === 0 || dayofweek === 6 ? 'weekend' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div>{day}</div>
          {dayEvents.slice(0, 2).map((event, index) => ( 
            <div key={index} className="event-title">
              {event.title.length > 10 ? event.title.slice(0, 10) + '...' : event.title}
            </div>
          ))}
          {dayEvents.length > 2 && <div className="more-events">+{dayEvents.length - 2} more</div>}
        </div>
      );
    }

    return days;
  };

  const handleEventEditClick = (day, event) => {
    setSelectedDate(day);
    setSelectedEvent(event);
  };

  const handleEventClick = (day, event) => {
    setEventOptionsVisible(event); 
  };

  const renderEventDetails = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthYearKey = `${year}-${month + 1}`;
    const daysInCurrentMonth = daysInMonth(month, year);

    const eventsForMonth = [];

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dayEvents = events[monthYearKey]?.[day] || [];
      if (dayEvents.length) {
        eventsForMonth.push({ day, events: dayEvents });
      }
    }

    if (!eventsForMonth.length) {
      return <p>No events for this month.</p>;
    }

    return (
      <div className="event-details">
        <h3>All Event Details for {monthNames[month]} {year}</h3>
        {eventsForMonth.map(({ day, events }) => (
          <div key={day}>
            <h4>{monthNames[month]} {day}</h4>
            <ul>
              {events.map((event, index) => (
                <li key={index} className="event-clickable" onClick={() => handleEventClick(day, event)}>
                  <p><strong>Title:</strong> {event.title}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Remark:</strong> {event.remark}</p>
                  
                  {eventOptionsVisible === event && (
                    <div className="event-options">
                      <button className="eventhandle-button" onClick={() => handleEventEditClick(day, event)}>Edit</button>
                      <button className="eventhandle-button" onClick={() => handleDeleteEvent(day, event)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="calendar-page">
      <div className="calendar-section">
        <div className="calendar-header">
          <button onClick={goToPreviousMonth} className="arrow-btn">«</button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={goToNextMonth} className="arrow-btn">»</button>
        </div>
        <div className="calendar-grid-header">
          {dayNames.map((day, index) => (
            <div key={index} className="calendar-day-header">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">{renderDays()}</div>
      </div>

      <div className="entries-section">
        <h3>Event Details</h3>
        {renderEventDetails()}
      </div>

      {(selectedDate && !selectedEvent) &&  (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Event for {selectedDate}</h3>
            <form onSubmit={handleEventSubmit}>
              <div className="form-detail">
                <label>Title: </label>
                <input type="text" name="title" required className="form-detail-title"/>
              </div>
              <div className="form-detail">
                <label>Description: </label>
                <textarea name="description" required className="form-detail-title"/>
              </div>
              <div className="form-detail">
                <label>Remark: </label>
                <input type="text" name="remark" required className="form-detail-title"/>
              </div>
              <button type="submit">Save</button>
              <button type="button" className="close-btn" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Event for {selectedDate}</h3>
            <form onSubmit={handleEventSubmit}>
              <div className="form-detail">
                <label>Title: </label>
                <input type="text" name="title" defaultValue={selectedEvent?.title || ''} required className="form-detail-title" />
              </div>
              <div className="form-detail">
                <label>Description: </label>
                <textarea name="description" defaultValue={selectedEvent?.description || ''} required className="form-detail-title" />
              </div>
              <div className="form-detail">
                <label>Remark: </label>
                <input type="text" name="remark" defaultValue={selectedEvent?.remark || ''} required className="form-detail-title" />
              </div>
              <button type="submit">Save</button>
              <button type="button" className="close-btn" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
