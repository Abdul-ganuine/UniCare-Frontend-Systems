import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PublicRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/panel");
    }
  }, [navigate]);

  return <div>{children}</div>;
}

export default PublicRoute;
