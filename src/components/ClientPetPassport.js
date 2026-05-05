import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ClientPetPassport({ pet, onClose }) {
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
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${pet.petName}_passport.pdf`);
      
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF');
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent passportModal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Паспорт питомца: {pet.petName}</h2>
          <button className="modalCloseBtn" onClick={onClose}>×</button>
        </div>
        
        <div className="passportActions">
          <button className="downloadPdfBtn" onClick={generatePDF}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0-3-3m3 3 3-3M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Скачать PDF
          </button>
        </div>
        
        <div className="passportContent">
          <div ref={pdfContentRef} className="clientPassportForPrint">
            {/* Шапка */}
            <div className="passportHeader">
              <h1>ВЕТСЕРВИС</h1>
              <h2>Ветеринарный паспорт</h2>
              <div className="passportDivider"></div>
            </div>
            
            {/* Информация о питомце */}
            <div className="passportSection">
              <h3>Информация о питомце</h3>
              <table className="passportTable">
                <tbody>
                  <tr>
                    <td className="label">Кличка:</td>
                    <td className="value">{pet.petName || 'Не указано'}</td>
                  </tr>
                  <tr>
                    <td className="label">Вид животного:</td>
                    <td className="value">{pet.petType || 'Не указано'}</td>
                  </tr>
                  <tr>
                    <td className="label">Порода:</td>
                    <td className="value">{pet.petBreed || 'Не указано'}</td>
                  </tr>
                  <tr>
                    <td className="label">Возраст:</td>
                    <td className="value">{pet.petAge || 'Не указано'}</td>
                  </tr>
                  <tr>
                    <td className="label">Окрас:</td>
                    <td className="value">{pet.petColor || 'Не указано'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Информация о владельце */}
            <div className="passportSection">
              <h3>Информация о владельце</h3>
              <table className="passportTable">
                <tbody>
                  <tr>
                    <td className="label">ФИО владельца:</td>
                    <td className="value">{pet.ownerName || 'Не указано'}</td>
                  </tr>
                  <tr>
                    <td className="label">Телефон:</td>
                    <td className="value">{pet.ownerPhone || 'Не указано'}</td>
                  </tr>
                  <tr>
                    <td className="label">Адрес:</td>
                    <td className="value">{pet.ownerAddress || 'Не указано'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Медицинские заметки */}
            {pet.medicalNotes && (
              <div className="passportSection">
                <h3>Медицинские заметки</h3>
                <div className="medicalNotes">
                  {pet.medicalNotes}
                </div>
              </div>
            )}
            
            {/* Таблица вакцинаций - полная как у админа */}
            <div className="passportSection">
              <h3>Вакцинации и обработки</h3>
              <table className="vaccinationsTable">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Вакцина/Препарат</th>
                    <th>Подпись врача</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>___/___/_____</td>
                    <td>_______________</td>
                    <td>_______________</td>
                  </tr>
                  <tr>
                    <td>___/___/_____</td>
                    <td>_______________</td>
                    <td>_______________</td>
                  </tr>
                  <tr>
                    <td>___/___/_____</td>
                    <td>_______________</td>
                    <td>_______________</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Нижний колонтитул */}
            <div className="passportFooter">
              <p>ВетСервис - Забота о здоровье ваших питомцев</p>
              <p>Дата выдачи: {new Date().toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientPetPassport;