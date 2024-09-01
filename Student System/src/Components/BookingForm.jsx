import AppointmentForm from "./AppointmentForm";
import "./BookingForm.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AppointmentForm.css";
import { toast } from "react-toastify";
import axios from "axios";

function BookingForm({ details }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState("face-to-face"); // New state for appointment type
  const [success, setSuccess] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const url =
      "http://localhost:3000/knust.students/wellnesshub/appointments/book";
    try {
      const response = await axios.post(
        url,
        {
          doctorId: details._id,
          date: formattedDate,
          time: selectedTime,
          type: appointmentType,
        },
        { withCredentials: true }
      );

      setSelectedDate(null);
      setSelectedTime(null);
      setSuccess(false);
      toast.success(response.data.message, {
        autoClose: 2000,
      });
      window.location.reload();

      setSuccess(true);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later!", {
        autoClose: 2000,
      });
    }
  };

  const checkAvailability = async (e) => {
    e.preventDefault();
    console.log(appointmentType);

    const url =
      "http://localhost:3000/knust.students/wellnesshub/appointments/check-availability";
    if (!selectedDate || !selectedTime) {
      return toast.error("Date and time fields can't be left blank", {
        autoClose: 2000,
      });
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      const response = await axios.post(
        url,
        {
          doctorId: details._id,
          date: formattedDate,
          time: selectedTime,
          type: appointmentType,
        },
        { withCredentials: true }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
      });

      setSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Oops! This time slot is unavailable.", {
          autoClose: 2000,
        });
      } else {
        toast.error("Oops! Something went wrong, try again later!", {
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div className='app-form-side'>
      <div className='book-form-box'>
        <div className='doctor-detials'>
          <div>
            <p className='professional-title'>Timings:</p>
            <p className='professional-title-info'>
              {details?.timings[0]} - {details?.timings[1]}
            </p>
          </div>
          <div>
            <p className='professional-title'>Phone:</p>
            <p className='professional-title-info'>{details?.number}</p>
          </div>
          <div>
            <p className='professional-title'>Office:</p>
            <p className='professional-title-info'>College of Science (FF27)</p>
          </div>
        </div>
      </div>
      <div>
        <form action='' className='form'>
          <DatePicker
            placeholderText='Select date'
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat='yyyy-MM-dd'
            minDate={new Date()}
            className='date-picker'
            required
          />
          <input
            type='time'
            placeholder='10:15 am'
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          />
          <div>
            <label style={{ color: "grey" }}>Appointment Type:</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value='face-to-face'>Face-to-Face</option>
              <option value='virtual'>Virtual</option>
            </select>
          </div>

          {!success && (
            <button className='btn' onClick={checkAvailability}>
              Check Time Slot Availability
            </button>
          )}

          {success && (
            <button className='btn' onClick={handleBooking}>
              Book Appointment
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
