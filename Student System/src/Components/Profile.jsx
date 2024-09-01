import "./Person.css";
import prof from "../assets/defaultProf.jpg";

const Person = ({ name, img, profession, college }) => {
  return (
    <div className='person'>
      <div className='prof-img'>
        <img src={img} alt='' />
      </div>
      <div className='person-txt'>
        <p className='person-name'>{name}</p>
        <p className='person-profession'>{profession}</p>
        <p className='person-college'>{college}</p>
      </div>
    </div>
  );
};
export default Person;
