import { useState, useEffect} from 'react';
import { data, Navigate } from 'react-router-dom';
import "./RCallMain.css";

function RCall() {
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
    const [date, setDate] = useState("");
    const [classNum, setClassNum] = useState("");
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [classHour, setClassHour] = useState("");
    const [status, setStatus] = useState("");
    const [subject, setSubject] = useState("");
    const [note, setNote] = useState("");

    if (role !== "teacher" || !token) {
      return <Navigate to="/" />;
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/students`)
            .then(res => res.json())
            .then(data => {
        console.log("STUDENTS FROM SERVER:", data);
        setStudents(data);
        });
    }, []);

    const filteredStudents = students.filter(
        s => s.studentClass === classNum
    );

    async function submitRollCall() {
        if (!date || !classNum  || !classHour || !subject || !note) {
            setStatus("Please fill in all fields.");
            return;
        }
        const absentStudents = selectedStudents.map(num => Number(num));
        const res = await fetch(`${import.meta.env.VITE_API_URL}/rollcall`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classNum,
            date,
            hour: classHour,
            subject,
            note,
            absentStudents
          })
        });

        const data = await res.json();

        if (data.success) {
          setStatus("Yoklama Kaydedildi ✅");
          setSelectedStudents([]);
        } else {
          setStatus("Bir Sorun Oluştu ❌");
        }
    }

    return (
        <div>
            <h1>Yoklama Sayfası</h1>
            <h2 className="datelabel">Tarih Seç:</h2><br></br>
            <input
                className='rdate'
                type="date"
                id="rdate"
                value={date}
                onChange={(e) => setDate(e.target.value)}>
            </input>
            <br></br>
            <br></br>
            <h2 className="classlabel">Sınıf:</h2><br></br>
            <select id="class" name="class" className="class" value={classNum} defaultValue={"9A"} onChange={(e) => setClassNum(e.target.value)}>
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
            <h2 className="hourlabel">Ders Saati:</h2>
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
            <select name="subject" className="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="Math">Matematik</option>
                <option value="Physics">Fizik</option>
                <option value="Chemistry">Kimya</option>
                <option value="Biology">Biyoloji</option>
                <option value="History">Tarih</option>
                <option value="Geography">Coğrafya</option>
                <option value="Literature">Türk Dili ve Edebiyatı</option>
                <option value="English">İngilizce</option>
                <option value="PE">Beden Eğitimi</option>
                <option value="Art">Görsel Sanatlar</option>
                <option value="Music">Müzik</option>
                <option value="ComputerScience">Bilişim Teknolojileri</option>
                <option value="Religion">Din Kültürü ve Ahlak Bilgisi</option>
            </select>
            <br></br><br></br>
            <h2 className="studentlabel">Öğrenciler:</h2><br></br>
            <select
              className="student"
              multiple
              value={selectedStudents}
              onChange={(e) =>
                setSelectedStudents(
                  Array.from(e.target.selectedOptions, o => o.value)
                )
              }
            >
              {filteredStudents.length === 0 && (
                <option disabled>Öğrenci Bulunamadı</option>
              )}

              {filteredStudents.map(s => (
                <option
                  key={s.studentNum}
                  value={String(s.studentNum)}
                >
                  {s.name} ({s.studentNum})
                </option>
              ))}
            </select><br></br>
            <input type="text" className="note" placeholder="Açıklama" value={note} onChange={(e) => setNote(e.target.value)}></input><br></br>
            <p>Sınıf Toplamı: {filteredStudents.length}</p>
            <p>Yok Öğrenci Sayısı: {selectedStudents.length}</p>
            <br></br>
            <button type="submit" value="Submit" className='submit' onClick={submitRollCall}>Kaydet!</button><br></br>
            <label className="statuslabel">Durum:{status}</label><br></br>
            <button onClick={() => {
              sessionStorage.clear();
              window.location.href = "/";
            }}>
              Çıkış Yap
            </button>
        </div>
    );
}

export default RCall;