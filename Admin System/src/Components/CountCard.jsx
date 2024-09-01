import "./CountCard.css";

function CountCard({ obj }) {
  const { img, number, description } = obj;
  return (
    <div className="count-card">
      <div className="card-img">
        <img src={img} alt="" />
      </div>
      <div className="card-details">
        <p className="card-number">{number}</p>
        <p className="card-status">{description}</p>
      </div>
    </div>
  );
}

export default CountCard;
