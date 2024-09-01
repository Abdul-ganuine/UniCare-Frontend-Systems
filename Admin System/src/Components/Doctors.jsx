import { useEffect, useState } from "react";
import axios from "axios";
import "./Doctors.css";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { toast } from "react-toastify";

function Doctors() {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  /*Delete Doctor*/
  function handleDelete(id) {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this record?"
    );
    if (confirm) {
      dispatch(showLoading());
      axios
        .post(`http://localhost:3000/panel/deleteDoctor`, { id })
        .then((response) => {
          if (response.status === 200) {
            dispatch(hideLoading());
            setData((prevDoctors) =>
              prevDoctors.filter((doctor) => doctor._id !== id)
            );
            toast.success("Doctor successfully deleted.");
          }
        })
        .catch((error) => {
          console.error("Error deleting doctor:", error);
          dispatch(hideLoading());
          toast.error(
            "An error occurred while deleting the doctor. Please try again."
          );
        });
    }
  }

  /*Get all Doctors*/
  useEffect(() => {
    dispatch(showLoading());
    axios
      .get("http://localhost:3000/panel/getDoctors")
      .then((res) => {
        setData(res.data);
        dispatch(hideLoading());
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  const column = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone Number",
      selector: (row) => row.number,
    },
    {
      name: "Specialization",
      selector: (row) => row.specialization,
    },
    {
      name: "Picture",
      selector: (row) => (
        <img
          src={`http://localhost:3000/profImages/${row.img}`}
          alt=""
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          className="row-image"
        />
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="btn-container">
          <button className="delete" onClick={() => handleDelete(row._id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  const formattedData = data.reverse();
  return (
    <div className="doctors">
      <div className="doctors-container">
        <div className="table-container">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search🔎"
              className="table-search"
            />
          </div>
          <DataTable
            columns={column}
            data={formattedData}
            title="Available Doctors"
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 15, 20, 25]}
            fixedHeader
            pointerOnHover
            highlightOnHover
            fixedHeaderScrollHeight="600px"
            defaultSortAsc="false"
            // actions={
            //   <button className="add-btn" onClick={() => showAddDoctorForm()}>
            //     Add Doctor
            //   </button>
            // }
          ></DataTable>
        </div>
      </div>
    </div>
  );
}

export default Doctors;
