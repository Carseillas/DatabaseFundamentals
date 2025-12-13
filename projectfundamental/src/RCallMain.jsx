import { useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import "./RCallMain.css";

function RCall() {

    const [date, setDate] = useState("");
    const [classNum, setClassNum] = useState("");
    const [student, setStudent] = useState("");
    const [classHour, setClassHour] = useState("");
    const [status, setStatus] = useState("");
    const loggedIn = localStorage.getItem("loggedIn") === "true";

    let options = [];

    for (let i = 1; i <= 30; i++) {
        options.push(<option key={i} value={`Student${i}`}>{`Student${i}`}</option>);
    }

    if (!loggedIn) {
        return <Navigate to="/" />;
    }

    async function submitRollCall() {
        setStatus("Roll Call Submitted!");
    }

    return (
        <div>
            <h1>ROLL CALL MAIN PAGE</h1>
            <h2 for="rdate" className="datelabel">Select Date:</h2><br></br>
            <input
                className='rdate'
                type="date"
                id="rdate"
                value={date}
                onChange={(e) => setDate(e.target.value)}>
            </input>
            <br></br>
            <br></br>
            <h2 for="class" className="classlabel">Select Class:</h2><br></br>
            <select id="class" name="class" className="class" value={classNum} onChange={(e) => setClassNum(e.target.value)}>
                <option value="9A">9A</option>
                <option value="9B">9B</option>
                <option value="9C">9C</option>
                <option value="9D">9D</option>
                <option value="9E">9E</option>
                <option value="9F">9F</option>
                <option value="9G">9G</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                <option value="10C">10C</option>
                <option value="10D">10D</option>
                <option value="10E">10E</option>
                <option value="10F">10F</option>
                <option value="10G">10F</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
                <option value="11C">11C</option>
                <option value="11D">11D</option>
                <option value="11E">11E</option>
                <option value="11F">11F</option>
                <option value="11G">11G</option>
                <option value="12A">12A</option>
                <option value="12B">12B</option>
                <option value="12C">12C</option>
                <option value="12D">12D</option>
                <option value="12E">12E</option>
                <option value="12F">12F</option>
                <option value="12G">12G</option>
            </select>
            <h2 for="hour" className="hourlabel">Select Hour:</h2>
            <select id="hour" name="hour" className="hour" value={classHour} onChange={(e) => setClassHour(e.target.value)}>
                <option value="1">1.</option>
                <option value="2">2.</option>
                <option value="3">3.</option>
                <option value="4">4.</option>
                <option value="5">5.</option>
                <option value="6">6.</option>
                <option value="7">7.</option>
                <option value="8">8.</option>  
            </select>
            <h2 for="student" className="studentlabel">Select Student:</h2><br></br>
            <select id="student" name="student" className="student" value={student} onChange={(e) => setStudent(e.target.value)} multiple>
                options
            </select><br></br>
            <br></br>
            <button type="submit" value="Submit" className='submit' onClick={submitRollCall}>Submit Roll Call</button><br></br>
            <label for="status" className="statuslabel">Status:{status}</label><br></br>
        </div>
    );
}

export default RCall