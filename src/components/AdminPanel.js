import React, { useState } from 'react';
import PetPassportForm from './PetPassportForm';
import PetCard from './PetCard';
import AdminRequests from './AdminRequests';
import AdminServices from './AdminServices';
import EditPetModal from './EditPetModal';
import { db, petsCollection, getDocs, deleteDoc, doc } from '../firebase';
import { auth } from '../firebase';

function AdminPanel({ setAdmin }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pets');
  const [editingPet, setEditingPet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  React.useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const snapshot = await getDocs(petsCollection);
      const petsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Удалить паспорт питомца?')) {
      await deleteDoc(doc(db, 'pets', petId));
      await loadPets();
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    loadPets();
  };

  const handleLogout = async () => {
    await auth.signOut();
    setAdmin(null);
  };

  return (
    <div className="adminContainer">
      <div className="adminHeader">
        <h1 className="adminTitle">ВетСервис - Панель администратора</h1>
        <button onClick={handleLogout} className="logoutButton">
          Выйти
        </button>
      </div>

      <div className="adminTabs">
        <button 
          className={`tabButton ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => setActiveTab('pets')}
        >
          Паспорта питомцев
        </button>
        <button 
          className={`tabButton ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Услуги
        </button>
        <button 
          className={`tabButton ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Записи клиентов
        </button>
      </div>

      {activeTab === 'pets' && (
        <>
          <div className="formSection">
            <h2 className="sectionTitle">Создать паспорт питомца</h2>
            <PetPassportForm onPetAdded={loadPets} />
          </div>

          <div className="petsList">
            <h2 className="sectionTitle">Паспорта питомцев</h2>
            {loading ? (
              <div>Загрузка...</div>
            ) : pets.length === 0 ? (
              <div className="noPets">Нет добавленных питомцев</div>
            ) : (
              <div className="petsGrid">
                {pets.map(pet => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'services' && <AdminServices />}
      {activeTab === 'requests' && <AdminRequests />}

      {showEditModal && editingPet && (
        <EditPetModal 
          pet={editingPet}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default AdminPanel;