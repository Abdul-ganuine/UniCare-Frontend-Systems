import "./viewAppointments.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Doctors.css";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { toast } from "react-toastify";
import moment from "moment";

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId")
  console.log(userId)
  const getAppointments = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:3000/panel/getAppointmentsByDoctorId",
        { userId },
        {
          withCredentials: true,
        }
      );
      dispatch(hideLoading());

      if (res.data.status) {
        const data = res.data.data;
        setAppointments(data);

        if (data.length === 0) {
          toast.success("You do not have any appointments");
        } else {
          // toast.success(res.data.message);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to fetch appointments");
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:3000/panel/changeAppointmentStatus",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.status) {
        getAppointments();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to approve appointment.");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "50px",
    },
    {
      name: "Picture",
      selector: (row) => (
        <img
          src={`http://localhost:3000/profImages/${row.studentDetails.img}`}
          alt=''
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          className='row-image'
        />
      ),
    },
    {
      name: "Student Name",
      selector: (row) => row.studentDetails.name,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.studentDetails.contact,
      width: "130px",
    },
    {
      name: "Date",
      selector: (row) => moment(row.date).format("dddd, MMMM D, YYYY"),
      sortable: true,
      width: "210px",
    },
    {
      name: "Time",
      selector: (row) => moment(row.time, "HH:mm").format("h:mm a"), // Formatting the time
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className='btn-container'>
          {row.status === "pending" && (
            <>
              <button
                className='approve'
                onClick={() => changeAppointmentStatus(row, "approved")}
              >
                Approve
              </button>
              <button
                className='reject'
                onClick={() => changeAppointmentStatus(row, "rejected")}
              >
                Reject
              </button>
            </>
          )}
          {/* {row.status === "approved" && (
            <button className="reject">Reject</button>
          )} */}
        </div>
      ),
    },
  ];

  return (
    <div className='viewPage'>
      <div className='table-container'>
        <DataTable
          columns={columns}
          data={appointments}
          title='Available Appointments'
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 15, 20, 25]}
          pointerOnHover
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight='600px'
          responsive
        ></DataTable>
      </div>
    </div>
  );
}

export default ViewAppointments;
