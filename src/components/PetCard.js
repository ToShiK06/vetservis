import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PetCard({ pet, onDelete, onEdit }) {
  const pdfContentRef = useRef(null);

  const generatePDF = async () => {
    if (!pdfContentRef.current) return;
    
    try {
      const element = pdfContentRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${pet.petName}_passport.pdf`);
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF');
    }
  };

  return (
    <>
      {/* Скрытый контент для PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={pdfContentRef} style={{
          width: '800px',
          padding: '40px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#0A1931', fontSize: '28px', margin: 0 }}>ВЕТМАСТЕР</h1>
            <h2 style={{ color: '#4A7FA7', fontSize: '18px', margin: '10px 0' }}>Ветеринарный паспорт</h2>
            <div style={{ height: '2px', backgroundColor: '#B3CFE5', margin: '10px 0' }}></div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tbody>
              <tr>
                <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Кличка:</td>
                <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.petName || 'Не указано'}</td>
              </tr>
              <tr>
                <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Вид:</td>
                <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.petType || 'Не указано'}</td>
              </tr>
              <tr>
                <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Порода:</td>
                <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.petBreed || 'Не указано'}</td>
              </tr>
              <tr>
                <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Возраст:</td>
                <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.petAge || 'Не указано'}</td>
              </tr>
              <tr>
                <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Окрас:</td>
                <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.petColor || 'Не указано'}</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#0A1931', fontSize: '18px', marginBottom: '10px' }}>Владелец</h3>
            <div style={{ height: '1px', backgroundColor: '#B3CFE5', marginBottom: '15px' }}></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>ФИО:</td>
                  <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.ownerName || 'Не указано'}</td>
                </tr>
                <tr>
                  <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Телефон:</td>
                  <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.ownerPhone || 'Не указано'}</td>
                </tr>
                <tr>
                  <td style={{ width: '150px', padding: '8px', fontWeight: 'bold', color: '#0A1931' }}>Адрес:</td>
                  <td style={{ padding: '8px', color: '#1A3D63', borderBottom: '1px solid #B3CFE5' }}>{pet.ownerAddress || 'Не указано'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {pet.medicalNotes && pet.medicalNotes.trim() !== '' && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#0A1931', fontSize: '18px', marginBottom: '10px' }}>Медицинские заметки</h3>
              <div style={{ height: '1px', backgroundColor: '#B3CFE5', marginBottom: '15px' }}></div>
              <p style={{ padding: '8px', color: '#1A3D63', backgroundColor: '#F6FAFD', borderRadius: '5px' }}>
                {pet.medicalNotes}
              </p>
            </div>
          )}
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#0A1931', fontSize: '18px', marginBottom: '10px' }}>Вакцинации и обработки</h3>
            <div style={{ height: '1px', backgroundColor: '#B3CFE5', marginBottom: '15px' }}></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1A3D63', color: 'white' }}>
                  <th style={{ padding: '10px', border: '1px solid #B3CFE5', textAlign: 'left' }}>Дата</th>
                  <th style={{ padding: '10px', border: '1px solid #B3CFE5', textAlign: 'left' }}>Вакцина/Препарат</th>
                  <th style={{ padding: '10px', border: '1px solid #B3CFE5', textAlign: 'left' }}>Подпись врача</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px', border: '1px solid #B3CFE5', color: '#1A3D63' }}>___/___/_____</td>
                    <td style={{ padding: '8px', border: '1px solid #B3CFE5', color: '#1A3D63' }}>_______________</td>
                    <td style={{ padding: '8px', border: '1px solid #B3CFE5', color: '#1A3D63' }}>_______________</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '40px', textAlign: 'center', color: '#B3CFE5', fontSize: '12px' }}>
            <p>ВетМастер - Забота о здоровье ваших питомцев</p>
            <p>Дата выдачи: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </div>
      
      {/* Карточка питомца для отображения на сайте */}
      <div className="petCard">
        <h3 className="petName">{pet.petName}</h3>
        <div className="petInfo">
          <strong>Вид:</strong> {pet.petType}
        </div>
        <div className="petInfo">
          <strong>Порода:</strong> {pet.petBreed}
        </div>
        <div className="petInfo">
          <strong>Возраст:</strong> {pet.petAge}
        </div>
        <div className="petInfo">
          <strong>Окрас:</strong> {pet.petColor}
        </div>
        <div className="petInfo">
          <strong>Владелец:</strong> {pet.ownerName}
        </div>
        <div className="petInfo">
          <strong>Телефон:</strong> {pet.ownerPhone}
        </div>
        <div className="cardButtons">
          <button onClick={generatePDF} className="pdfButton">
            Скачать PDF
          </button>
          <button onClick={() => onEdit(pet)} className="editButton">
            Редактировать
          </button>
          <button onClick={() => onDelete(pet.id)} className="deleteButton">
            Удалить
          </button>
        </div>
      </div>
    </>
  );
}

export default PetCard;