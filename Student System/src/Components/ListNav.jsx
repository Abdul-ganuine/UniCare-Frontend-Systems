import { useContext, useEffect, useState } from "react";
import "./ListNav.css";
import { GlobalContext } from "../Context/ContextApi";
import Person from "./Profile";
import BookingForm from "./BookingForm";
import prof from "../assets/defaultProf.jpg";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

function ListNav() {
  const [navigateProvider, setNavigateProvider] = useState(false);

  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [selectProfessional, setSelectProfile] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [index, setIndex] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const doc = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/tasks/getdoctors",
          { withCredentials: true }
        );

        const couns = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/tasks/getcounsellors",
          { withCredentials: true }
        );

        const pending = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/appointments/pending",
          { withCredentials: true }
        );

        const appointments = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/appointments/appointments",
          { withCredentials: true }
        );
        setAppointments(appointments.data.appointments);
        setPendingAppointments(pending.data.appointments);
        setDoctors(doc.data);
        setCounsellors(couns.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, []);

  // Function to format the date and get the day of the week
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <nav className='listna'>
      {!navigateProvider ? (
        <>
          <div className='greenNav'>
            <p className='listnav-header'>Choose a Doctor or a Counsellor</p>
            <div className='altBtns'>
              <p
                onClick={() => setSelectProfile(true)}
                className={selectProfessional ? "unvisited" : "visited"}
              >
                Doctors
              </p>
              <p
                onClick={() => setSelectProfile(false)}
                className={selectProfessional ? "visited" : "unvisited"}
              >
                Counsellors
              </p>
            </div>

            <div className='professionalsList'>
              {selectProfessional ? (
                <div className='usersCustomized'>
                  {doctors?.map(({ first_name, last_name, img }, index) => {
                    return (
                      <div
                        className='usersCustomized-singles'
                        onClick={() => {
                          setIndex(index);
                          setNavigateProvider(!navigateProvider);
                        }}
                        key={index}
                      >
                        <Person
                          img={
                            img
                              ? `http://localhost:3000/profImages/${img}`
                              : prof
                          }
                        />
                        <p className='usersCustomized-name'>
                          Dr. {`${first_name} ${last_name}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='usersCustomized'>
                  {counsellors?.map(({ first_name, last_name, img }, index) => {
                    return (
                      <div
                        className='usersCustomized-singles'
                        onClick={() => {
                          setIndex(index);
                          setNavigateProvider(!navigateProvider);
                        }}
                        key={index}
                      >
                        <Person
                          img={
                            img
                              ? `http://localhost:3000/profImages/${img}`
                              : prof
                          }
                        />
                        <p className='usersCustomized-name'>
                          Dr. {`${first_name} ${last_name}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='appointment-list'>
            <div className='list-container'>
              <div className='appointments'>Pending Appointments</div>
              {pendingAppointments.length > 0 ? (
                <div className='list-container'>
                  {pendingAppointments?.map(
                    (
                      { name, img, date, time, status, specialization, type },
                      index
                    ) => {
                      return (
                        <div className='list' key={index}>
                          <div className='app-details-heading'>
                            <Person
                              img={
                                img
                                  ? `http://localhost:3000/profImages/${img}`
                                  : prof
                              }
                            />
                            <div className='app-details'>
                              <p className='list-name'>{name}</p>
                              <p
                                className='list-portfolio'
                                style={{ color: "grey", fontSize: "0.8rem" }}
                              >
                                {specialization}
                              </p>
                            </div>
                          </div>
                          <div className='app-timings'>
                            <p
                              className='list-date'
                              style={{ textAlign: "center" }}
                            >
                              {time}
                            </p>
                            <p
                              className='list-date'
                              style={{ color: "grey", fontSize: "0.8rem" }}
                            >
                              {formatDate(date)}
                            </p>
                          </div>

                          <div className='app-status'>
                            {status === "approve" && (
                              <div>
                                <div className='app-status'>
                                  <p>{status}</p>
                                  <FaCheck color='rgb(89, 220, 89)' />
                                </div>

                                <p
                                  style={{ color: "grey", fontSize: "0.8rem" }}
                                >
                                  {type}
                                </p>
                              </div>
                            )}

                            {status === "reject" && (
                              <div>
                                <div className='app-status'>
                                  <p>{status}</p>
                                  <FaTimes color='rgb(240, 74, 74)' />
                                </div>
                                <p
                                  style={{ color: "grey", fontSize: "0.8rem" }}
                                >
                                  {type}
                                </p>
                              </div>
                            )}

                            {status === "pending" && (
                              <div className='app-status'>
                                <div>
                                  <p>{status} ...</p>
                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div style={{ color: "grey" }}>
                  You have no pending appointment
                </div>
              )}
            </div>
            <div className='list-container'>
              <div className='appointments'>Recent Appointments</div>

              <div>
                {appointments.length > 0 ? (
                  <div className='list-container'>
                    {appointments?.map(
                      (
                        { name, img, date, time, status, specialization, type },
                        index
                      ) => {
                        return (
                          <div className='list' key={index}>
                            <div className='app-details-heading'>
                              <Person
                                img={
                                  img
                                    ? `http://localhost:3000/profImages/${img}`
                                    : prof
                                }
                              />
                              <div className='app-details'>
                                <p className='list-name'>{name}</p>
                                <p
                                  className='list-portfolio'
                                  style={{ color: "grey", fontSize: "0.8rem" }}
                                >
                                  {specialization}
                                </p>
                              </div>
                            </div>
                            <div className='app-timings'>
                              <p
                                className='list-date'
                                style={{ textAlign: "center" }}
                              >
                                {time}
                              </p>
                              <p
                                className='list-date'
                                style={{ color: "grey", fontSize: "0.8rem" }}
                              >
                                {formatDate(date)}
                              </p>
                            </div>

                            <div className='app-status'>
                              {status === "approved" && (
                                <div>
                                  <div className='app-status'>
                                    <p>{status}</p>
                                    <FaCheck color='rgb(89, 220, 89)' />
                                  </div>

                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              )}

                              {status === "rejected" && (
                                <div>
                                  <div className='app-status'>
                                    <p>{status}</p>
                                    <FaTimes color='rgb(240, 74, 74)' />
                                  </div>
                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              )}

                              {status === "pending" && (
                                <div className='app-status'>
                                  <div>
                                    <p>{status} ...</p>
                                    <p
                                      style={{
                                        color: "grey",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {type}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div style={{ color: "grey" }}>
                    You have no appointments outstanding
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='listnav'>
          {navigateProvider && (
            <div className='selectSide'>
              <div
                className='backbtn'
                onClick={() => setNavigateProvider(!navigateProvider)}
              >
                <FaTimes size='15' />
              </div>
            </div>
          )}
          {selectProfessional ? (
            <div className='prof-details'>
              <div className='prof-detailed-info'>
                <div className='prof-detailed-info-img'>
                  <img
                    src={
                      doctors[index]?.img
                        ? `http://localhost:3000/profImages/${doctors[index]?.img}`
                        : prof
                    }
                    alt='profile Picture'
                  />
                </div>
                <p className='prof-detailed-info-name'>
                  Dr.
                  {`${doctors[index]?.first_name} ${doctors[index]?.last_name}`}
                </p>
                <h3 className='prof-detailed-info-txt'>KNUST Hospital</h3>
                <p className='prof-detailed-info-txt spec'>
                  {doctors[index]?.specialization}
                </p>
              </div>
              <BookingForm details={doctors[index]} />
            </div>
          ) : (
            <div className='prof-details'>
              <div className='prof-detailed-info'>
                <div className='prof-detailed-info-img'>
                  <img
                    src={
                      counsellors[index]?.img
                        ? `http://localhost:3000/profImages/${counsellors[index]?.img}`
                        : prof
                    }
                    alt='profile Picture'
                  />
                </div>
                <p className='prof-detailed-info-name'>
                  Dr.
                  {`${counsellors[index]?.first_name} ${counsellors[index]?.last_name}`}
                </p>
                <h3 className='prof-detailed-info-txt'>
                  KNUST Couselling Center
                </h3>
                <p className='prof-detailed-info-txt spec'>
                  {" "}
                  {counsellors[index]?.specialization}
                </p>
              </div>
              <BookingForm details={counsellors[index]} />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default ListNav;
