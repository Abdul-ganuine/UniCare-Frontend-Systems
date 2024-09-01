import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AppointmentForm.css";
function AppointmentForm() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  return (
    <>
      <form action='' className='form'>
        <DatePicker
          placeholderText='Select date'
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat='dd/MM/yyyy'
          minDate={new Date()}
          className='date-picker'
        />
        <input
          type='time'
          name=''
          id=''
          placeholder='10:15 am'
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />

        <button className='btn'>Check time slot availiability</button>
      </form>
    </>
  );
}

export default AppointmentForm;
