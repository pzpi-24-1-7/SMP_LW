import { useState } from 'react';

const CreateLotForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    startPrice: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!formData.title || !formData.startPrice) return; 
    
    onAdd(formData);
    setFormData({ title: '', category: '', startPrice: '', imageUrl: '' });
  };

  return (
    <form className="create-lot-form" onSubmit={handleSubmit}>
      <h3>Додати новий лот</h3>
      <div className="form-inputs">
        <input name="title" placeholder="Назва (напр. Ваза)" value={formData.title} onChange={handleChange} required />
        <input name="category" placeholder="Категорія" value={formData.category} onChange={handleChange} required />
        <input name="startPrice" type="number" placeholder="Стартова ціна" value={formData.startPrice} onChange={handleChange} required />
        <input name="imageUrl" placeholder="URL картинки (необов'язково)" value={formData.imageUrl} onChange={handleChange} />
        <button type="submit" className="btn-submit">Створити</button>
      </div>
    </form>
  );
};

export default CreateLotForm;